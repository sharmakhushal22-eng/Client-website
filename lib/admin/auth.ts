import 'server-only'
import { scrypt as _scrypt, timingSafeEqual, randomBytes } from 'node:crypto'
import { promisify } from 'node:util'
import { cookies, headers } from 'next/headers'
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
 * In-memory, per-instance. Not a substitute for the database-backed limiter
 * used on the public forms, but the admin login is a single endpoint with one
 * valid credential, and slowing an online guessing attack to a crawl is all
 * this needs to do. */
const attempts = new Map<string, { count: number; first: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8

export async function loginThrottleKey(): Promise<string> {
  const h = await headers()
  return (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
}

export function checkLoginThrottle(key: string): { ok: boolean; retryInMin?: number } {
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

export function clearLoginThrottle(key: string): void {
  attempts.delete(key)
}
