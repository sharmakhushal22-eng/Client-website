import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/* ============================================================================
 * Server-side Supabase client for the marketing site's own project.
 *
 * 'server-only' at the top is load-bearing: it makes the build FAIL if this
 * module is ever imported into a client component, rather than quietly
 * shipping a key to the browser (spec §8.7).
 *
 * ── Which key ──────────────────────────────────────────────────────────────
 *
 * Two keys can drive this, and the difference matters:
 *
 *   SUPABASE_SERVICE_ROLE_KEY (or the newer sb_secret_… key)
 *     Bypasses RLS entirely. Required to READ leads — which the lead inbox in
 *     §7 will need. Preferred when present.
 *
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY (the sb_publishable_… key)
 *     Subject to RLS. Our policies allow anonymous INSERT on the lead,
 *     booking, subscriber and download tables, so form submission works
 *     perfectly well on this key alone — and reads stay impossible, which is
 *     exactly the posture §8.7 asks for.
 *
 * So the site is fully functional on the publishable key. Add the secret key
 * when you build the lead inbox; nothing else needs to change.
 * ========================================================================= */

let cached: SupabaseClient | null = null

function secretKey(): string | undefined {
  /* Supabase renamed these: service_role → sb_secret_…. Accept either name so
   * a project on the newer key format does not silently fall through to the
   * publishable key and then fail on the first read. */
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
}

function anonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export function getServiceClient(): SupabaseClient {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = secretKey() || anonKey()

  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and either ' +
        'SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY — see ' +
        '.env.local.example.',
    )
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

/** True when writes will work. Inserts only need the publishable key, because
 *  RLS permits anonymous insert on the capture tables. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (secretKey() || anonKey()))
}

/** True when RLS is being bypassed — i.e. reads are possible. The lead inbox
 *  should check this before trying to list anything, so it fails with a clear
 *  message rather than an empty table that looks like "no leads yet". */
export function hasElevatedAccess(): boolean {
  return Boolean(secretKey())
}
