import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/* ============================================================================
 * Admin data access.
 *
 * The public site writes with the publishable key, which RLS deliberately
 * forbids from reading anything (spec §8.7). So the admin panel needs
 * elevated access, and there are exactly two ways to get it:
 *
 *   1. The secret key (sb_secret_… / service_role). Talks to PostgREST over
 *      HTTPS on IPv4 — works everywhere, including Vercel. PREFERRED.
 *
 *   2. A direct Postgres connection via DATABASE_URL. Full SQL, but
 *      db.<ref>.supabase.co is IPv6-only, so it fails on IPv4-only networks.
 *      Use the Session pooler URI if you need this route.
 *
 * With neither, every page renders a diagnostic instead of an empty table —
 * because an admin panel silently showing "no leads" when it simply cannot
 * read them is worse than one that says so.
 * ========================================================================= */

export type AccessMode = 'secret-key' | 'direct-postgres' | 'none'

export function accessMode(): AccessMode {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY) {
    return 'secret-key'
  }
  const url = process.env.DATABASE_URL
  if (url && !url.includes('[YOUR-PASSWORD]')) return 'direct-postgres'
  return 'none'
}

export function accessDiagnostic(): string {
  return (
    'The admin panel cannot read the database.\n\n' +
    'Add ONE of these to .env.local:\n\n' +
    '  SUPABASE_SERVICE_ROLE_KEY=sb_secret_…\n' +
    '    Supabase dashboard → Project Settings → API keys → secret key.\n' +
    '    This is the recommended route: HTTPS over IPv4, works on Vercel.\n\n' +
    '  DATABASE_URL=postgresql://…\n' +
    '    Project Settings → Database → Connection string. Use the SESSION\n' +
    '    POOLER URI — the direct db.<ref>.supabase.co host is IPv6-only and\n' +
    '    will not resolve on an IPv4-only network.'
  )
}

let sb: SupabaseClient | null = null
function client(): SupabaseClient {
  if (sb) return sb
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return sb
}

/** Run SQL over whichever route is available. Returns rows, or throws with a
 *  message the UI can show. */
async function sql<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const { default: pg } = await import('pg')
  const c = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  })
  try {
    await c.connect()
  } catch (err) {
    /* A bare "ENOTFOUND db.<ref>.supabase.co" tells an operator nothing about
     * what to do next. Wrap it in the fix. */
    const msg = err instanceof Error ? err.message : String(err)
    if (/ENOTFOUND|EAI_AGAIN|ETIMEDOUT/i.test(msg)) {
      throw new Error(
        `${msg}\n\n` +
          'This host is IPv6-only, and this network has no IPv6 route. The\n' +
          'public site is unaffected — it reaches Supabase over HTTPS/IPv4 —\n' +
          'but direct Postgres access fails.\n\n' +
          'Fix it either way:\n\n' +
          '  BEST — add the secret key and skip Postgres entirely:\n' +
          '    Supabase → Project Settings → API keys → reveal the secret key\n' +
          '    SUPABASE_SERVICE_ROLE_KEY=sb_secret_…\n' +
          '    It talks to PostgREST over HTTPS/IPv4, so it works here AND on\n' +
          '    Vercel. This is the route the admin panel is designed around.\n\n' +
          '  OR — swap DATABASE_URL for the IPv4 pooler:\n' +
          '    Project Settings → Database → Connection string → Session pooler\n' +
          '    Note the username becomes postgres.<project-ref>, and the region\n' +
          '    in the hostname must be copied exactly.\n\n' +
          'Restart the dev server after editing .env.local.',
      )
    }
    throw err
  }
  try {
    const { rows } = await c.query(text, params)
    return rows as T[]
  } finally {
    await c.end()
  }
}

/* ── Types ────────────────────────────────────────────────────────────────── */

export type Lead = {
  id: string
  created_at: string
  full_name: string | null
  work_email: string
  phone: string
  company_name: string
  employee_band: string | null
  designation: string | null
  city: string | null
  state: string | null
  currently_using: string | null
  modules_interest: string[] | null
  timeline: string | null
  message: string | null
  consent: boolean
  consent_at: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
  landing_page: string | null
  form_name: string
  status: string
  owner: string | null
  next_action_date: string | null
  first_contacted_at: string | null
  autoreply_sent_at: string | null
  internal_notified_at: string | null
  is_spam: boolean
}

export const LEAD_STATUSES = [
  'New', 'Contacted', 'Demo booked', 'Demo done', 'Proposal', 'Won', 'Lost',
] as const

/* ── Reads ────────────────────────────────────────────────────────────────── */

export async function listRows<T>(
  table: string,
  opts: { limit?: number; order?: string; ascending?: boolean; filters?: Record<string, string> } = {},
): Promise<T[]> {
  const { limit = 200, order = 'created_at', ascending = false, filters = {} } = opts
  const mode = accessMode()
  if (mode === 'none') throw new Error(accessDiagnostic())

  if (mode === 'secret-key') {
    let q = client().from(table).select('*').order(order, { ascending }).limit(limit)
    for (const [col, val] of Object.entries(filters)) q = q.eq(col, val)
    const { data, error } = await q
    if (error) throw new Error(`${error.code ?? ''} ${error.message}`.trim())
    return (data ?? []) as T[]
  }

  const where = Object.keys(filters).length
    ? 'where ' + Object.keys(filters).map((c, i) => `${c} = $${i + 1}`).join(' and ')
    : ''
  return sql<T>(
    `select * from public.${table} ${where} order by ${order} ${ascending ? 'asc' : 'desc'} limit ${limit}`,
    Object.values(filters),
  )
}

export async function getRow<T>(table: string, id: string): Promise<T | null> {
  const mode = accessMode()
  if (mode === 'none') throw new Error(accessDiagnostic())

  if (mode === 'secret-key') {
    const { data, error } = await client().from(table).select('*').eq('id', id).maybeSingle()
    if (error) throw new Error(error.message)
    return (data ?? null) as T | null
  }
  const rows = await sql<T>(`select * from public.${table} where id = $1`, [id])
  return rows[0] ?? null
}

export async function countRows(table: string, filters: Record<string, string> = {}): Promise<number> {
  const mode = accessMode()
  if (mode === 'none') return 0

  if (mode === 'secret-key') {
    let q = client().from(table).select('*', { count: 'exact', head: true })
    for (const [col, val] of Object.entries(filters)) q = q.eq(col, val)
    const { count, error } = await q
    if (error) throw new Error(error.message)
    return count ?? 0
  }
  const where = Object.keys(filters).length
    ? 'where ' + Object.keys(filters).map((c, i) => `${c} = $${i + 1}`).join(' and ')
    : ''
  const rows = await sql<{ n: string }>(
    `select count(*)::int as n from public.${table} ${where}`, Object.values(filters))
  return Number(rows[0]?.n ?? 0)
}

/* ── Writes ───────────────────────────────────────────────────────────────── */

export async function updateRow(table: string, id: string, patch: Record<string, unknown>) {
  const mode = accessMode()
  if (mode === 'none') throw new Error(accessDiagnostic())

  if (mode === 'secret-key') {
    const { error } = await client().from(table).update(patch).eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  const cols = Object.keys(patch)
  const set = cols.map((c, i) => `${c} = $${i + 2}`).join(', ')
  await sql(`update public.${table} set ${set} where id = $1`, [id, ...Object.values(patch)])
}

export async function insertRow(table: string, row: Record<string, unknown>) {
  const mode = accessMode()
  if (mode === 'none') throw new Error(accessDiagnostic())

  if (mode === 'secret-key') {
    const { error } = await client().from(table).insert(row)
    if (error) throw new Error(error.message)
    return
  }
  const cols = Object.keys(row)
  await sql(
    `insert into public.${table} (${cols.join(', ')}) values (${cols.map((_, i) => `$${i + 1}`).join(', ')})`,
    Object.values(row),
  )
}
