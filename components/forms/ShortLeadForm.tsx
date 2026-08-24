'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { submitLead, type LeadFormState } from '@/app/actions/leads'
import { TextField, CheckboxField } from './Field'
import { HiddenTracking, useMounted } from './HiddenTracking'
import { SubmitButton } from './SubmitButton'
import {
  validateEmail,
  validatePhone,
  validateRequired,
  freeMailWarning,
} from '@/lib/validation'
import { cn } from '@/lib/cn'

const initial: LeadFormState = { status: 'idle' }

/* Spec §5.1 short form — three fields, no more. Used in the hero, the CTA
 * bands and the exit-intent prompt. Every extra field here costs conversions
 * at exactly the moment the visitor was willing. */
export function ShortLeadForm({
  formName,
  onDark = false,
  cta = 'Book a Demo',
  className,
}: {
  formName: string
  onDark?: boolean
  cta?: string
  className?: string
}) {
  const [state, action, pending] = useActionState(submitLead, initial)
  const mounted = useMounted()
  const router = useRouter()

  /* Spec §4.7 — /thank-you is where the conversion event fires, so a
   * successful submit navigates there rather than swapping in an inline
   * success message. */
  useEffect(() => {
    if (state.status === 'success') {
      router.push(`/thank-you?from=${encodeURIComponent(formName)}`)
    }
  }, [state.status, formName, router])

  return (
    <form action={action} className={cn('relative space-y-3', className)} noValidate>
      <HiddenTracking formName={formName} />

      <TextField
        name="work_email"
        label="Work email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@company.com"
        onDark={onDark}
        defaultValue={state.values?.work_email}
        serverError={state.errors?.work_email}
        validate={validateEmail}
        warn={freeMailWarning}
      />

      <TextField
        name="phone"
        label="Phone"
        type="tel"
        required
        autoComplete="tel"
        inputMode="numeric"
        placeholder="98765 43210"
        hint="+91 — we will only call about this enquiry."
        onDark={onDark}
        defaultValue={state.values?.phone}
        serverError={state.errors?.phone}
        validate={validatePhone}
      />

      <TextField
        name="company_name"
        label="Company name"
        required
        autoComplete="organization"
        placeholder="Your company"
        onDark={onDark}
        defaultValue={state.values?.company_name}
        serverError={state.errors?.company_name}
        validate={(v) => validateRequired(v, 'Company name')}
      />

      <CheckboxField name="consent" serverError={state.errors?.consent} onDark={onDark}>
        I agree to be contacted by EZER HRMS about this enquiry, and I have read
        the{' '}
        <Link
          href="/privacy-policy"
          className={cn(
            'font-semibold underline',
            onDark ? 'text-white' : 'text-brand-700',
          )}
        >
          privacy policy
        </Link>
        .
      </CheckboxField>

      <SubmitButton pending={pending} disabled={!mounted} onDark={onDark}>
        {cta}
      </SubmitButton>

      {state.status === 'error' && state.message && (
        <p
          role="alert"
          className={cn(
            'rounded-xl px-4 py-3 text-sm font-medium',
            onDark ? 'bg-red-500/15 text-red-200' : 'bg-red-50 text-red-700',
          )}
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
