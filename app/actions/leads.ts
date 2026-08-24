'use server'

import { headers } from 'next/headers'
import {
  getServiceClient,
  isDatabaseConfigured,
  hasElevatedAccess,
} from '@/lib/supabase/server'
import {
  checkHoneypotAndTiming,
  checkRateLimit,
  getIpHash,
  verifyTurnstile,
} from '@/lib/spam'
import { attributionFromFormData } from '@/lib/utm'
import { sendEnquirerAutoReply, sendInternalNotification } from '@/lib/email/messages'
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateConsent,
  normalisePhone,
  EMPLOYEE_BANDS,
  DESIGNATIONS,
  CURRENTLY_USING,
  TIMELINES,
} from '@/lib/validation'

/* ============================================================================
 * Lead submission — spec §5.4.
 *
 * Order matters, and it is the order in the spec:
 *   1. write the lead to the database FIRST, before any third-party call, so
 *      a failing integration never loses a lead
 *   2. auto-reply to the enquirer
 *   3. notify sales
 * Steps 2 and 3 are best-effort and their outcome is stamped back onto the
 * row, so "which leads did we fail to notify anyone about" stays queryable.
 * ========================================================================= */

export type LeadFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  /* Field-level errors, keyed by input name, so the form can render them
   * beside the right input rather than as one lump at the top. */
  errors?: Record<string, string>
  /* Spec §5.2: "a failed submit must never silently lose what was typed."
   * The server echoes the values back so a re-render restores the form. */
  values?: Record<string, string>
}

const CONSENT_TEXT =
  'I agree to be contacted by EZER HRMS about this enquiry, and I have read the privacy policy.'

function str(form: FormData, key: string): string {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

/** Only accept a value that is in the allowed list — a select element is
 *  trivially editable in devtools, and the CHECK constraints in the database
 *  would otherwise reject the whole insert. */
function oneOf<T extends readonly string[]>(
  value: string,
  allowed: T,
): T[number] | null {
  return (allowed as readonly string[]).includes(value) ? (value as T[number]) : null
}

export async function submitLead(
  _prev: LeadFormState,
  form: FormData,
): Promise<LeadFormState> {
  /* Echoed back on every failure path. Collected up front so no early return
   * can forget to include it. */
  const values: Record<string, string> = {}
  for (const [k, v] of form.entries()) {
    if (typeof v === 'string' && k !== 'rendered_at' && k !== 'cf-turnstile-response') {
      values[k] = v
    }
  }

  const formName = str(form, 'form_name') || 'unknown'

  /* ── Layers 1 & 2: honeypot and time trap ──────────────────────────────── */
  const cheap = checkHoneypotAndTiming(form)
  if (!cheap.ok) {
    /* Deliberately reported as success. A bot that is told it was blocked
     * will retune and try again; one that is told it succeeded usually
     * stops. Nothing was written. */
    console.warn('[lead] rejected:', cheap.reason, { formName })
    return { status: 'success', message: 'Thanks — we have your enquiry.' }
  }

  /* ── Validation (server-side; §5.3 never trust the client) ─────────────── */
  const errors: Record<string, string> = {}

  const fullName = str(form, 'full_name')
  const workEmail = str(form, 'work_email')
  const phoneRaw = str(form, 'phone')
  const companyName = str(form, 'company_name')

  /* full_name is required on the long form only. The short form (hero, CTA
   * bands) is 3 fields by design — §5.1. */
  const isFullForm = form.has('full_name')

  if (isFullForm) {
    const e = validateRequired(fullName, 'Full name')
    if (e) errors.full_name = e
  }

  const emailError = validateEmail(workEmail)
  if (emailError) errors.work_email = emailError

  const phoneError = validatePhone(phoneRaw)
  if (phoneError) errors.phone = phoneError

  const companyError = validateRequired(companyName, 'Company name')
  if (companyError) errors.company_name = companyError

  const employeeBand = oneOf(str(form, 'employee_band'), EMPLOYEE_BANDS)
  const designation = oneOf(str(form, 'designation'), DESIGNATIONS)

  if (isFullForm) {
    if (!employeeBand) errors.employee_band = 'Please pick a headcount range.'
    if (!designation) errors.designation = 'Please pick your role.'
  }

  const consent = form.get('consent') === 'on' || form.get('consent') === 'true'
  const consentError = validateConsent(consent)
  if (consentError) errors.consent = consentError

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors,
      values,
    }
  }

  /* ── Layers 3 & 4: rate limit and Turnstile ────────────────────────────── */
  const ipHash = await getIpHash()

  const limited = await checkRateLimit('lead', ipHash)
  if (!limited.ok) {
    return {
      status: 'error',
      message:
        'That is a few enquiries in a short time. Give it an hour, or call us directly — we would rather just talk.',
      values,
    }
  }

  const turnstile = await verifyTurnstile(
    (form.get('cf-turnstile-response') as string | null) ?? null,
  )
  if (!turnstile.ok) {
    return {
      status: 'error',
      message: 'We could not verify that you are human. Please try again.',
      values,
    }
  }

  /* ── Build the row ─────────────────────────────────────────────────────── */
  const attribution = attributionFromFormData(form)
  const h = await headers()

  const modulesInterest = form
    .getAll('modules_interest')
    .filter((v): v is string => typeof v === 'string')

  const lead = {
    full_name: fullName || null,
    work_email: workEmail.toLowerCase(),
    phone: normalisePhone(phoneRaw),
    company_name: companyName,
    employee_band: employeeBand,
    designation,
    city: str(form, 'city') || null,
    state: str(form, 'state') || null,
    currently_using: oneOf(str(form, 'currently_using'), CURRENTLY_USING),
    modules_interest: modulesInterest,
    timeline: oneOf(str(form, 'timeline'), TIMELINES),
    message: str(form, 'message') || null,
    consent,
    consent_at: new Date().toISOString(),
    consent_text: CONSENT_TEXT,
    ...attribution,
    form_name: formName,
    ip_hash: ipHash,
    user_agent: (h.get('user-agent') ?? '').slice(0, 500),
  }

  if (!isDatabaseConfigured()) {
    /* A fresh clone with no .env.local should say so plainly rather than
     * throw a stack trace at a visitor. */
    console.error('[lead] database not configured; lead NOT saved:', lead)
    return {
      status: 'error',
      message:
        'Our enquiry form is temporarily unavailable. Please email or call us — we will pick it up straight away.',
      values,
    }
  }

  /* ── Step 1: persist, before anything else ─────────────────────────────── */
  /* Asking for the inserted row back requires SELECT privilege, which the
   * publishable key deliberately does not have — leads must never be readable
   * from a browser key (spec §8.7). So the id is only requested when running
   * on the secret key; otherwise we do a plain insert and skip the delivery
   * timestamps further down. The lead itself is saved either way, which is
   * the part that matters. */
  const supabase = getServiceClient()
  const elevated = hasElevatedAccess()

  const { data: saved, error: insertError } = elevated
    ? await supabase.from('website_leads').insert(lead).select('id').single()
    : await supabase.from('website_leads').insert(lead).then(
        (r) => ({ data: null as { id: string } | null, error: r.error }),
      )

  if (insertError) {
    console.error('[lead] insert failed:', insertError.message, insertError.details)
    return {
      status: 'error',
      message:
        'Something went wrong saving your enquiry. Nothing you typed has been lost — please try again, or call us.',
      values,
    }
  }

  /* ── Steps 2 & 3: notifications, best-effort ───────────────────────────── */
  /* Run concurrently: the enquirer's auto-reply is promised "within 60
   * seconds" and should not queue behind the internal one. */
  const [autoReply, internal] = await Promise.all([
    sendEnquirerAutoReply(lead),
    sendInternalNotification(lead),
  ])

  /* Stamp delivery back onto the row so "which leads did nobody get notified
   * about" stays a query. Needs the row id, so it only runs on the secret
   * key — see the insert above. */
  if (saved?.id) {
    const stamps: Record<string, string> = {}
    if (autoReply.sent) stamps.autoreply_sent_at = new Date().toISOString()
    if (internal.sent) stamps.internal_notified_at = new Date().toISOString()

    if (Object.keys(stamps).length > 0) {
      await supabase.from('website_leads').update(stamps).eq('id', saved.id)
    }
  }

  if (!autoReply.sent) console.error('[lead] auto-reply failed:', autoReply.error)
  if (!internal.sent) console.error('[lead] internal notify failed:', internal.error)

  return {
    status: 'success',
    message: 'Thanks — we have your enquiry.',
  }
}

/* ── Newsletter (spec §1.2 conversion 5) ─────────────────────────────────── */
export type SubscribeState = { status: 'idle' | 'success' | 'error'; message?: string }

export async function subscribeToNewsletter(
  _prev: SubscribeState,
  form: FormData,
): Promise<SubscribeState> {
  const cheap = checkHoneypotAndTiming(form)
  if (!cheap.ok) return { status: 'success', message: 'Thanks — please check your inbox.' }

  const email = str(form, 'email').toLowerCase()
  const emailError = validateEmail(email)
  if (emailError) return { status: 'error', message: emailError }

  if (!isDatabaseConfigured()) {
    return { status: 'error', message: 'Signup is temporarily unavailable.' }
  }

  const ipHash = await getIpHash()
  const limited = await checkRateLimit('newsletter', ipHash)
  if (!limited.ok) return { status: 'error', message: 'Too many attempts. Try again later.' }

  const supabase = getServiceClient()
  const { error } = await supabase.from('newsletter_subscribers').insert({
    email,
    source: str(form, 'source') || 'footer',
    ...attributionFromFormData(form),
    ip_hash: ipHash,
  })

  /* 23505 is unique_violation — the address is already on the list. Saying
   * "you are already subscribed" would confirm to a stranger that a given
   * address is in our database, so we return the same message either way. */
  if (error && error.code !== '23505') {
    console.error('[newsletter] insert failed:', error.message)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }

  return {
    status: 'success',
    message: 'Almost there — check your inbox and confirm the subscription.',
  }
}
