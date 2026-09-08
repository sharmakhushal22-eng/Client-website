import { createHmac, timingSafeEqual } from 'node:crypto'
import { getServiceClient, isDatabaseConfigured } from '@/lib/supabase/server'

/* ============================================================================
 * Booking webhook — cal.com and Calendly.
 *
 * WHY THIS EXISTS
 *
 * NEXT_PUBLIC_CALENDAR_URL embeds a calendar on /book-a-demo. That is all it
 * does. The booking is then created inside cal.com or Calendly and, without
 * this endpoint, never reaches us — demo_bookings stays empty forever while
 * the admin panel cheerfully explains that bookings "appear once a calendar is
 * connected". They do not. This is the missing half.
 *
 * SECURITY
 *
 * This is a public POST endpoint that writes to the database, so it is exactly
 * the kind of thing that gets found and abused. Three rules:
 *
 *   1. It FAILS CLOSED. No secret configured → 503, nothing written. The form
 *      limiter in lib/spam.ts deliberately fails OPEN, because losing a real
 *      enquiry is worse than letting spam through. The reasoning inverts here:
 *      an unauthenticated writer is not a degraded service, it is an open door.
 *   2. Signatures are compared with timingSafeEqual, never ===.
 *   3. Calendly signatures carry a timestamp, and we reject stale ones, so a
 *      captured request cannot be replayed tomorrow.
 *
 * IDEMPOTENCY
 *
 * Providers retry on any non-2xx, and they retry generously. Every write is an
 * upsert keyed on provider_booking_uid, which migration 002 made UNIQUE for
 * this reason — a duplicate delivery updates the row instead of creating a
 * second booking for the same slot.
 *
 * We also return 200 for events we do not handle. A 4xx would make the
 * provider retry a message we are never going to want, forever, and
 * eventually disable the webhook.
 * ========================================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Bodies are a few KB. Anything far larger is not a booking. */
const MAX_BODY_BYTES = 128 * 1024

/** How old a Calendly signature may be. Long enough to survive a retry storm,
 *  short enough that a captured request is not useful later. */
const MAX_SIGNATURE_AGE_S = 5 * 60

function secret(): string | undefined {
  return process.env.BOOKING_WEBHOOK_SECRET
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a, 'utf8')
  const y = Buffer.from(b, 'utf8')
  /* Length is not secret, and timingSafeEqual throws on a mismatch. */
  if (x.length !== y.length) return false
  return timingSafeEqual(x, y)
}

/* ── Signature verification ────────────────────────────────────────────────
 * cal.com:  x-cal-signature-256: <hex hmac of the raw body>
 * Calendly: calendly-webhook-signature: t=<unix>,v1=<hex hmac of "t.body">
 * ------------------------------------------------------------------------ */
type Verdict = { ok: true; provider: 'cal.com' | 'calendly' } | { ok: false; why: string }

function verify(raw: string, headers: Headers, key: string): Verdict {
  const cal = headers.get('x-cal-signature-256')
  if (cal) {
    const expected = createHmac('sha256', key).update(raw).digest('hex')
    return safeEqual(cal.trim(), expected)
      ? { ok: true, provider: 'cal.com' }
      : { ok: false, why: 'cal.com signature mismatch' }
  }

  const cly = headers.get('calendly-webhook-signature')
  if (cly) {
    const parts = Object.fromEntries(
      cly.split(',').map((p) => {
        const i = p.indexOf('=')
        return [p.slice(0, i).trim(), p.slice(i + 1).trim()]
      }),
    )
    const t = Number(parts.t)
    if (!t || Number.isNaN(t)) return { ok: false, why: 'calendly signature has no timestamp' }

    const age = Math.abs(Date.now() / 1000 - t)
    if (age > MAX_SIGNATURE_AGE_S) {
      return { ok: false, why: `calendly signature is ${Math.round(age)}s old — replay refused` }
    }

    const expected = createHmac('sha256', key).update(`${t}.${raw}`).digest('hex')
    return parts.v1 && safeEqual(parts.v1, expected)
      ? { ok: true, provider: 'calendly' }
      : { ok: false, why: 'calendly signature mismatch' }
  }

  return { ok: false, why: 'no signature header' }
}

/* ── Payload shapes ───────────────────────────────────────────────────────── */

type Booking = {
  provider: 'cal.com' | 'calendly'
  provider_booking_uid: string
  full_name: string
  work_email: string
  phone: string | null
  company_name: string | null
  slot_start: string
  slot_end: string
  timezone: string
  meeting_url: string | null
  outcome: 'Scheduled' | 'Cancelled'
}

type Json = Record<string, unknown>
const obj = (v: unknown): Json => (v && typeof v === 'object' ? (v as Json) : {})
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')

/** cal.com: BOOKING_CREATED | BOOKING_RESCHEDULED | BOOKING_CANCELLED */
function fromCal(body: Json): Booking | null {
  const trigger = str(body.triggerEvent).toUpperCase()
  if (!['BOOKING_CREATED', 'BOOKING_RESCHEDULED', 'BOOKING_CANCELLED'].includes(trigger)) {
    return null
  }
  const p = obj(body.payload)
  const attendee = obj(Array.isArray(p.attendees) ? p.attendees[0] : undefined)
  const responses = obj(p.responses)

  const uid = str(p.uid)
  const email = str(attendee.email) || str(obj(responses.email).value)
  const start = str(p.startTime)
  const end = str(p.endTime)
  if (!uid || !email || !start || !end) return null

  return {
    provider: 'cal.com',
    provider_booking_uid: uid,
    full_name: str(attendee.name) || str(obj(responses.name).value) || email,
    work_email: email.toLowerCase(),
    phone: str(obj(responses.phone).value) || null,
    company_name: str(obj(responses.company).value) || null,
    slot_start: start,
    slot_end: end,
    timezone: str(attendee.timeZone) || 'Asia/Kolkata',
    meeting_url: str(obj(p.metadata).videoCallUrl) || str(p.location) || null,
    outcome: trigger === 'BOOKING_CANCELLED' ? 'Cancelled' : 'Scheduled',
  }
}

/** Calendly: invitee.created | invitee.canceled */
function fromCalendly(body: Json): Booking | null {
  const event = str(body.event)
  if (!['invitee.created', 'invitee.canceled'].includes(event)) return null

  const p = obj(body.payload)
  const ev = obj(p.scheduled_event)

  /* The invitee URI is the stable per-invitee identifier; the event URI is
     shared by everyone on a group booking and would collide. */
  const uid = str(p.uri)
  const email = str(p.email)
  const start = str(ev.start_time)
  const end = str(ev.end_time)
  if (!uid || !email || !start || !end) return null

  return {
    provider: 'calendly',
    provider_booking_uid: uid,
    full_name: str(p.name) || email,
    work_email: email.toLowerCase(),
    phone: str(p.text_reminder_number) || null,
    company_name: null,
    slot_start: start,
    slot_end: end,
    timezone: str(p.timezone) || 'Asia/Kolkata',
    meeting_url: str(obj(ev.location).join_url) || null,
    outcome: event === 'invitee.canceled' ? 'Cancelled' : 'Scheduled',
  }
}

/* ── Handler ──────────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  const key = secret()
  if (!key) {
    /* Fails closed. See the header note: an unauthenticated writer is an open
       door, not a degraded feature. */
    console.error('[booking-webhook] BOOKING_WEBHOOK_SECRET is not set; refusing')
    return Response.json({ error: 'webhook not configured' }, { status: 503 })
  }

  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: 'body too large' }, { status: 413 })
  }

  const verdict = verify(raw, req.headers, key)
  if (!verdict.ok) {
    console.warn('[booking-webhook] rejected:', verdict.why)
    /* Deliberately vague to the caller — which check failed is not their
       business — but specific in the log, where it is ours. */
    return Response.json({ error: 'invalid signature' }, { status: 401 })
  }

  let body: Json
  try {
    body = obj(JSON.parse(raw))
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 })
  }

  const booking = verdict.provider === 'cal.com' ? fromCal(body) : fromCalendly(body)
  if (!booking) {
    /* Authentic, but not an event we store. 200 so the provider stops
       retrying — a 4xx here means it retries forever and eventually
       disables the webhook. */
    return Response.json({ ok: true, ignored: true })
  }

  if (!isDatabaseConfigured()) {
    /* 503 rather than 200: the provider SHOULD retry this one, because it is
       our outage and the booking is real. */
    console.error('[booking-webhook] database not configured; booking NOT saved:', booking)
    return Response.json({ error: 'database unavailable' }, { status: 503 })
  }

  const supabase = getServiceClient()

  /* Attach the booking to the enquiry it came from, when there is one. The
     match is by email because that is the only field both sides always have —
     somebody can book straight from the calendar embed without ever filling
     in a form, which is why demo_bookings.lead_id is nullable. Attaching it
     also fires advance_lead_on_booking(), moving the lead to "Demo booked". */
  let leadId: string | null = null
  try {
    const { data } = await supabase
      .from('website_leads')
      .select('id')
      .eq('work_email', booking.work_email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    leadId = data?.id ?? null
  } catch (err) {
    /* A failed lookup must not lose the booking. */
    console.warn('[booking-webhook] lead lookup failed, saving unlinked:', err)
  }

  const { error } = await supabase
    .from('demo_bookings')
    .upsert({ ...booking, lead_id: leadId, updated_at: new Date().toISOString() },
            { onConflict: 'provider_booking_uid' })

  if (error) {
    console.error('[booking-webhook] upsert failed:', error.message)
    /* 500 so the provider retries — the booking exists and we want it. */
    return Response.json({ error: 'could not save' }, { status: 500 })
  }

  console.log(
    `[booking-webhook] ${booking.outcome} ${booking.provider} ${booking.provider_booking_uid}` +
      `${leadId ? ` (linked to lead ${leadId})` : ' (no matching lead)'}`,
  )
  return Response.json({ ok: true })
}

/** A GET is almost always a human checking the URL is right. Say something
 *  useful, and never hint at whether the secret is correct. */
export async function GET() {
  return Response.json({
    endpoint: 'booking webhook',
    configured: Boolean(secret()),
    accepts: ['cal.com', 'calendly'],
    method: 'POST',
  })
}
