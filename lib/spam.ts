import 'server-only'
import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { getServiceClient } from './supabase/server'

/* ============================================================================
 * Spam protection — spec §5.3.
 *
 * Four layers, cheapest first, so an obvious bot is rejected before it costs
 * a database round-trip:
 *   1. honeypot   — a hidden field a human never fills
 *   2. time trap  — submissions faster than 3 seconds
 *   3. rate limit — 5 per IP per hour (in Postgres; serverless shares no memory)
 *   4. Turnstile  — Cloudflare's invisible challenge, if configured
 * ========================================================================= */

export const MIN_FILL_SECONDS = 3

export type SpamVerdict = { ok: true } | { ok: false; reason: string }

/** Layer 1 + 2. Pure, no I/O — safe to call before anything expensive. */
export function checkHoneypotAndTiming(form: FormData): SpamVerdict {
  /* The honeypot field is named plausibly ("company_website") so that a bot
   * filling everything it recognises will fill it. A field named "honeypot"
   * is skipped by anything sophisticated. */
  const honey = String(form.get('company_website') ?? '')
  if (honey.trim() !== '') {
    return { ok: false, reason: 'honeypot' }
  }

  const renderedAt = Number(form.get('rendered_at') ?? 0)
  if (!renderedAt || Number.isNaN(renderedAt)) {
    return { ok: false, reason: 'missing-timestamp' }
  }

  const elapsed = (Date.now() - renderedAt) / 1000
  if (elapsed < MIN_FILL_SECONDS) {
    return { ok: false, reason: 'too-fast' }
  }
  /* A form left open for a week is more likely a stale tab than an attack.
   * We do not reject it — that would throw away a real person's typing — but
   * a negative elapsed time means a forged clock, which we do reject. */
  if (elapsed < 0) {
    return { ok: false, reason: 'clock-skew' }
  }

  return { ok: true }
}

/** Hash of the client IP. Spec §8.7 / DPDP: we never store the raw address. */
export async function getIpHash(): Promise<string> {
  const h = await headers()
  /* Vercel sets x-forwarded-for; the leftmost entry is the client. Trusting a
   * client-supplied header would normally be unsafe, but the platform
   * overwrites it at the edge, so on Vercel it is authoritative. */
  const forwarded = h.get('x-forwarded-for') ?? ''
  const ip = forwarded.split(',')[0].trim() || h.get('x-real-ip') || 'unknown'

  /* Salted, so the hashes are not reversible with a rainbow table over the
   * IPv4 space — which is small enough to enumerate exhaustively. */
  const salt = process.env.IP_HASH_SALT ?? 'ezer-website-dev-salt'
  return createHash('sha256').update(`${ip}:${salt}`).digest('hex')
}

/** Layer 3. Counts in Postgres because serverless instances share no memory. */
export async function checkRateLimit(
  bucket: 'lead' | 'newsletter' | 'download' | 'booking',
  ipHash: string,
  limit = 5,
): Promise<SpamVerdict> {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_bucket: bucket,
      p_ip_hash: ipHash,
      p_limit: limit,
      p_window: '1 hour',
    })

    if (error) {
      /* Fail OPEN. A rate limiter that goes down must not take the enquiry
       * form down with it — losing a real lead is a worse outcome than
       * letting a handful of spam rows through, and layers 1, 2 and 4 are
       * still standing. */
      console.error('[spam] rate limit check failed, allowing:', error.message)
      return { ok: true }
    }

    return data === false ? { ok: false, reason: 'rate-limited' } : { ok: true }
  } catch (err) {
    console.error('[spam] rate limit check threw, allowing:', err)
    return { ok: true }
  }
}

/** Layer 4. Cloudflare Turnstile — invisible, and preferred over reCAPTCHA
 *  for speed and privacy (spec §5.3). Skipped entirely if unconfigured, so
 *  the form works before you have set it up. */
export async function verifyTurnstile(token: string | null): Promise<SpamVerdict> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return { ok: true }

  if (!token) return { ok: false, reason: 'turnstile-missing' }

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, response: token }),
      },
    )
    const body = (await res.json()) as { success: boolean }
    return body.success ? { ok: true } : { ok: false, reason: 'turnstile-failed' }
  } catch (err) {
    /* Fail open, for the same reason as the rate limiter. */
    console.error('[spam] turnstile verify threw, allowing:', err)
    return { ok: true }
  }
}
