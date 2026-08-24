/* ============================================================================
 * Admin session cookie — signed, stateless, Edge-compatible.
 *
 * Deliberately built on Web Crypto (HMAC-SHA256) rather than node:crypto, so
 * the same verify function runs in the proxy (Edge runtime) and in server
 * components. There is no session table: the cookie carries its own subject
 * and expiry, and the signature makes it unforgeable.
 *
 * The cookie is httpOnly, so no script can read it; SameSite=Lax, so it is
 * not sent on cross-site POSTs; and Secure in production.
 * ========================================================================= */

export const SESSION_COOKIE = 'ezer_admin'
export const SESSION_MAX_AGE = 60 * 60 * 8 // 8 hours — a working day

type Payload = { sub: string; exp: number }

function b64url(bytes: Uint8Array<ArrayBuffer>): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(pad + '='.repeat((4 - (pad.length % 4)) % 4))
  /* Allocated explicitly rather than via Uint8Array.from so the type carries
   * ArrayBuffer, not ArrayBufferLike — crypto.subtle only accepts the former. */
  const out = new Uint8Array(new ArrayBuffer(bin.length))
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function key(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function signSession(sub: string, secret: string): Promise<string> {
  const payload: Payload = { sub, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE }
  const body = b64url(new TextEncoder().encode(JSON.stringify(payload)) as Uint8Array<ArrayBuffer>)
  const sig = await crypto.subtle.sign('HMAC', await key(secret), new TextEncoder().encode(body))
  return `${body}.${b64url(new Uint8Array(sig))}`
}

/** Returns the subject when the token is authentic and unexpired, else null.
 *  Never throws — a malformed cookie is just an unauthenticated request. */
export async function verifySession(
  token: string | undefined,
  secret: string | undefined,
): Promise<string | null> {
  if (!token || !secret) return null

  const [body, sig] = token.split('.')
  if (!body || !sig) return null

  try {
    /* crypto.subtle.verify is constant-time, which matters: a naive string
     * compare on the signature leaks it one byte at a time under timing
     * analysis. */
    const ok = await crypto.subtle.verify(
      'HMAC',
      await key(secret),
      fromB64url(sig),
      new TextEncoder().encode(body),
    )
    if (!ok) return null

    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as Payload
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload.sub
  } catch {
    return null
  }
}
