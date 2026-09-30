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

export { accessDiagnostic } from '@/lib/admin/diagnostic'
import { accessDiagnostic } from '@/lib/admin/diagnostic'

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
  /* Absent until migration 008 is applied; treat that as ezerhrms.com. */
  source_site?: string
  /* The recycle bin — migration 009. NULL, or absent before that migration
     runs, both mean the lead is live. */
  deleted_at?: string | null
  deleted_by?: string | null
  status: string
  owner: string | null
  next_action_date: string | null
  first_contacted_at: string | null
  autoreply_sent_at: string | null
  internal_notified_at: string | null
  is_spam: boolean
}

/* Websites that write to website_leads — the CHECK in migration 008.
   Declared in lib/lead-sites.ts and re-exported here so the admin panel keeps
   importing it from one place, and so the public lead action can reach the
   same list without pulling in this module's service-role client. */
export { LEAD_SITES, DEFAULT_LEAD_SITE, leadSite, type LeadSite } from '@/lib/lead-sites'

export const LEAD_STATUSES = [
  'New', 'Contacted', 'Demo booked', 'Demo done', 'Proposal', 'Won', 'Lost',
] as const

/* ── Reads ────────────────────────────────────────────────────────────────── */

export type ListOpts = {
  limit?: number
  order?: string
  ascending?: boolean
  filters?: Record<string, string>
  /** Columns that must be NULL — `deleted_at` for "not in the recycle bin". */
  isNull?: string[]
  /** Columns that must NOT be NULL — `deleted_at` for "only the recycle bin". */
  isNotNull?: string[]
}

export async function listRows<T>(table: string, opts: ListOpts = {}): Promise<T[]> {
  const {
    limit = 200, order = 'created_at', ascending = false,
    filters = {}, isNull = [], isNotNull = [],
  } = opts
  const mode = accessMode()
  if (mode === 'none') throw new Error(accessDiagnostic())

  if (mode === 'secret-key') {
    const run = async (nulls: string[], notNulls: string[]) => {
      let q = client().from(table).select('*').order(order, { ascending }).limit(limit)
      for (const [col, val] of Object.entries(filters)) q = q.eq(col, val)
      for (const col of nulls) q = q.is(col, null)
      for (const col of notNulls) q = q.not(col, 'is', null)
      return q
    }
    let { data, error } = await run(isNull, isNotNull)

    /* The soft-delete columns arrive with migration 009. Until it is applied,
       filtering on them makes Postgres reject the whole query and the admin
       sees "cannot read the database" where its leads should be. Drop the
       filter, show the rows, and say what is missing — a panel that shows
       everything is recoverable; one that shows nothing looks broken. */
    if (error && missingColumn(error, [...isNull, ...isNotNull])) {
      console.error(
        `[admin] ${table}: ${error.message}. Apply migration 009 (npm run db:push) ` +
          'to enable the recycle bin.',
      )
      if (isNotNull.length > 0) return [] as T[]   // a bin that cannot exist is empty
      ;({ data, error } = await run([], []))
    }
    if (error) throw new Error(`${error.code ?? ''} ${error.message}`.trim())
    return (data ?? []) as T[]
  }

  const clauses = Object.keys(filters).map((c, i) => `${c} = $${i + 1}`)
    .concat(isNull.map((c) => `${c} is null`))
    .concat(isNotNull.map((c) => `${c} is not null`))
  const where = clauses.length ? `where ${clauses.join(' and ')}` : ''
  return sql<T>(
    `select * from public.${table} ${where} order by ${order} ${ascending ? 'asc' : 'desc'} limit ${limit}`,
    Object.values(filters),
  )
}

/** True when an error is Postgres complaining about one of these columns not
 *  existing — 42703 — rather than anything we should be hiding. */
function missingColumn(error: { code?: string; message: string }, columns: string[]): boolean {
  if (columns.length === 0) return false
  const text = `${error.code ?? ''} ${error.message}`
  return /42703|does not exist/i.test(text) && columns.some((c) => text.includes(c))
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

export async function countRows(
  table: string,
  filters: Record<string, string> = {},
  opts: { isNull?: string[]; isNotNull?: string[] } = {},
): Promise<number> {
  const { isNull = [], isNotNull = [] } = opts
  const mode = accessMode()
  if (mode === 'none') return 0

  if (mode === 'secret-key') {
    const run = async (nulls: string[], notNulls: string[]) => {
      let q = client().from(table).select('*', { count: 'exact', head: true })
      for (const [col, val] of Object.entries(filters)) q = q.eq(col, val)
      for (const col of nulls) q = q.is(col, null)
      for (const col of notNulls) q = q.not(col, 'is', null)
      return q
    }
    let { count, error } = await run(isNull, isNotNull)
    if (error && missingColumn(error, [...isNull, ...isNotNull])) {
      if (isNotNull.length > 0) return 0
      ;({ count, error } = await run([], []))
    }
    if (error) throw new Error(error.message)
    return count ?? 0
  }
  const clauses = Object.keys(filters).map((c, i) => `${c} = $${i + 1}`)
    .concat(isNull.map((c) => `${c} is null`))
    .concat(isNotNull.map((c) => `${c} is not null`))
  const where = clauses.length ? `where ${clauses.join(' and ')}` : ''
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

/** Delete one row by id. Returns how many rows went — 0 means it was already
 *  gone, which the caller should report differently from success: "deleted"
 *  and "there was nothing there" are not the same answer, and an admin who
 *  sees the first when the second happened stops trusting the panel.
 *
 *  Always filtered by id. A PostgREST delete with no filter empties the
 *  table, so the filter is not a nicety here. */
export async function deleteRow(table: string, id: string): Promise<number> {
  const mode = accessMode()
  if (mode === 'none') throw new Error(accessDiagnostic())
  if (!id) throw new Error('Refusing to delete without an id.')

  if (mode === 'secret-key') {
    const { data, error } = await client().from(table).delete().eq('id', id).select('id')
    if (error) throw new Error(error.message)
    return (data ?? []).length
  }
  const rows = await sql<{ id: string }>(
    `delete from public.${table} where id = $1 returning id`, [id],
  )
  return rows.length
}

/** Delete many rows by id. Returns how many actually went.
 *
 *  Chunked, and that is not premature: the lead inbox loads up to 500 rows and
 *  "select all" means all of them. PostgREST puts `id=in.(…)` in the QUERY
 *  STRING, so 500 uuids is roughly 18 KB of URL and the request comes back
 *  414 — which would read to the operator as "delete is broken" only on the
 *  large selections, the ones where it matters most.
 *
 *  An empty list deletes nothing and says so, rather than falling through to
 *  a filterless delete that would empty the table. */
export async function deleteRows(table: string, ids: string[]): Promise<number> {
  const mode = accessMode()
  if (mode === 'none') throw new Error(accessDiagnostic())

  const unique = [...new Set(ids.filter((id) => typeof id === 'string' && id.length > 0))]
  if (unique.length === 0) return 0

  const CHUNK = 100
  let removed = 0

  for (let i = 0; i < unique.length; i += CHUNK) {
    const batch = unique.slice(i, i + CHUNK)

    if (mode === 'secret-key') {
      const { data, error } = await client().from(table).delete().in('id', batch).select('id')
      if (error) throw new Error(error.message)
      removed += (data ?? []).length
      continue
    }
    const rows = await sql<{ id: string }>(
      `delete from public.${table} where id = any($1::uuid[]) returning id`,
      [batch],
    )
    removed += rows.length
  }
  return removed
}

/** Patch many rows by id. Returns how many were changed.
 *
 *  Chunked like deleteRows, and for the same reason: PostgREST puts the id
 *  list in the query string, so a 500-row selection would exceed the URL
 *  limit and fail only on the large selections.
 *
 *  This is what a "delete" is now, for leads — see softDeleteRows below. */
export async function updateRows(
  table: string,
  ids: string[],
  patch: Record<string, unknown>,
): Promise<number> {
  const mode = accessMode()
  if (mode === 'none') throw new Error(accessDiagnostic())

  const unique = [...new Set(ids.filter((id) => typeof id === 'string' && id.length > 0))]
  if (unique.length === 0) return 0

  const CHUNK = 100
  let changed = 0

  for (let i = 0; i < unique.length; i += CHUNK) {
    const batch = unique.slice(i, i + CHUNK)

    if (mode === 'secret-key') {
      const { data, error } = await client().from(table).update(patch).in('id', batch).select('id')
      if (error) throw new Error(`${error.code ?? ''} ${error.message}`.trim())
      changed += (data ?? []).length
      continue
    }
    const cols = Object.keys(patch)
    const set = cols.map((c, n) => `${c} = $${n + 2}`).join(', ')
    const rows = await sql<{ id: string }>(
      `update public.${table} set ${set} where id = any($1::uuid[]) returning id`,
      [batch, ...Object.values(patch)],
    )
    changed += rows.length
  }
  return changed
}

/** Move rows to the recycle bin. Nothing is removed — see migration 009,
 *  which also revokes the privilege that would let this be a real delete. */
export async function softDeleteRows(table: string, ids: string[], by: string): Promise<number> {
  return updateRows(table, ids, { deleted_at: new Date().toISOString(), deleted_by: by })
}

/** Take rows back out of the recycle bin. */
export async function restoreRows(table: string, ids: string[]): Promise<number> {
  return updateRows(table, ids, { deleted_at: null, deleted_by: null })
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
