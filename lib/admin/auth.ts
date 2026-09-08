import 'server-only'
import { scrypt as _scrypt, timingSafeEqual, randomBytes } from 'node:crypto'
import { promisify } from 'node:util'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySession } from './session'

const scrypt = promisify(_scrypt) as (
  pw: string, salt: string, len: number, opts: Record<string, number>,
) => Promise<Buffer>

const SCRYPT = { N: 16384, r: 8, p: 1 }

/* Fields are separated by ':' and NOT '$'.
 *
 * Next.js loads .env files through dotenv, which performs variable expansion:
 * a '$' followed by word characters is substituted with another environment
 * variable, or with an empty string when none exists. A scrypt hash written
 * as scrypt$<salt>$<hash> therefore arrives in the process as the literal
 * string "scrypt" — and every login fails with no clue why. Colons survive
 * intact, and hex digits never contain one. */
/** Format: scrypt:<salt-hex>:<hash-hex>. Stored in ADMIN_PASSWORD_HASH; the
 *  plaintext is never written anywhere. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = (await scrypt(password, salt, 64, SCRYPT)).toString('hex')
  return `scrypt:${salt}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split(':')
  if (scheme !== 'scrypt' || !salt || !hash) return false

  const candidate = await scrypt(password, salt, 64, SCRYPT)
  const expected = Buffer.from(hash, 'hex')

  /* Lengths must match before timingSafeEqual, which throws otherwise. */
  if (candidate.length !== expected.length) return false
  return timingSafeEqual(candidate, expected)
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH &&
      process.env.ADMIN_SESSION_SECRET,
  )
}

/** The signed-in admin's email, or null. */
export async function currentAdmin(): Promise<string | null> {
  const jar = await cookies()
  return verifySession(jar.get(SESSION_COOKIE)?.value, process.env.ADMIN_SESSION_SECRET)
}

/** Use at the top of every admin page. Middleware already gates these routes,
 *  but a page must never rely on the proxy alone — a routing change or a
 *  matcher typo would silently expose every lead in the database. */
export async function requireAdmin(): Promise<string> {
  const admin = await currentAdmin()
  if (!admin) redirect('/admin/login')
  return admin
}

/* ── Login throttling ──────────────────────────────────────────────────────
 *
 * TWO layers, and the second one is the point.
 *
 * This used to be the Map alone, which does not work on serverless. Each
 * function instance gets its own memory and instances are ephemeral, so an
 * attacker's guesses land on different instances and every cold start hands
 * them a fresh allowance. The advertised "8 per 15 minutes" was really
 * "8 per instance per 15 minutes", which is an unbounded number of instances.
 * The public form limiter in lib/spam.ts already counts in Postgres for
 * exactly this reason and says so; the login endpoint — the one guarding
 * every lead in the database — did not.
 *
 * So the shared count now lives in Postgres, in the same rate_limit_events
 * table the forms use, under a 'login' bucket.
 *
 * WHERE THIS DELIBERATELY DIFFERS FROM THE FORM LIMITER
 *
 * That one fails OPEN when the database is unreachable, because losing a real
 * enquiry is worse than letting spam through. The same reasoning inverts here:
 * failing open on a login endpoint means unlimited guessing. Failing closed is
 * no good either — a database outage would lock the admin out of their own
 * site. So a database error falls back to the IN-MEMORY verdict: weaker than
 * the shared count, much better than nothing, and it never bars a legitimate
 * operator who is under the local limit.
 * ========================================================================= */
const attempts = new Map<string, { count: number; first: number }>()
const WINDOW_MS = 15 * 60 * 1000
const WINDOW_SQL = '15 minutes'
const MAX_ATTEMPTS = 8

/* The key is the HASHED address, not the raw one. Two reasons: the forms
   already hash before storing (§8.7 / DPDP — we never keep a raw IP), and
   this count now goes to the same table, so storing raw addresses here would
   put in the database precisely what the rest of the code is careful to keep
   out of it. */
export async function loginThrottleKey(): Promise<string> {
  const { getIpHash } = await import('@/lib/spam')
  return getIpHash()
}

/** Per-instance count. Cheap, instant, and the floor if Postgres is away. */
function checkLocal(key: string): { ok: boolean; retryInMin?: number } {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now })
    return { ok: true }
  }
  entry.count += 1
  if (entry.count > MAX_ATTEMPTS) {
    return { ok: false, retryInMin: Math.ceil((WINDOW_MS - (now - entry.first)) / 60000) }
  }
  return { ok: true }
}

export async function checkLoginThrottle(
  key: string,
): Promise<{ ok: boolean; retryInMin?: number }> {
  /* Local first: if this instance alone has already seen too many, there is
     nothing to ask the database about. */
  const local = checkLocal(key)
  if (!local.ok) return local

  try {
    const { getServiceClient } = await import('@/lib/supabase/server')
    const supabase = getServiceClient()
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_bucket: 'login',
      p_ip_hash: key,
      p_limit: MAX_ATTEMPTS,
      p_window: WINDOW_SQL,
    })

    if (error) {
      console.error('[admin] login throttle check failed, using local count:', error.message)
      return local
    }
    return data === false
      ? { ok: false, retryInMin: Math.ceil(WINDOW_MS / 60000) }
      : { ok: true }
  } catch (err) {
    /* getServiceClient() throws when Supabase is unconfigured, which is the
       normal state before the database is set up. Not an error worth shouting
       about on every login — the local limiter is still doing its job. */
    console.warn('[admin] login throttle has no shared store, using local count:', err)
    return local
  }
}

export async function clearLoginThrottle(key: string): Promise<void> {
  attempts.delete(key)
  /* Also drop the shared count, so a successful sign-in does not leave the
     operator part-way to a lockout on their next visit. */
  try {
    const { getServiceClient } = await import('@/lib/supabase/server')
    await getServiceClient()
      .from('rate_limit_events')
      .delete()
      .eq('bucket', 'login')
      .eq('ip_hash', key)
  } catch {
    /* No shared store configured, or it is down. The local entry is cleared
       either way, and the shared rows age out of the window on their own. */
  }
}
