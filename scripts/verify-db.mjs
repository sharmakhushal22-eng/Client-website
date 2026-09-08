#!/usr/bin/env node
/* ============================================================================
 * Verify that the marketing-site database actually meets its contract.
 *
 *   npm run db:verify                      # reads DATABASE_URL from .env.local
 *   DATABASE_URL='postgresql://…' npm run db:verify
 *
 * `npm run db:push -- --check` answers "did the tables get created". That is
 * not the same question as "does the site work". A database can have every
 * table and still drop every enquiry on the floor, because RLS and GRANTs are
 * two separate gates and both have to line up — which is exactly the bug
 * migrations 005 and 006 exist to fix.
 *
 * So this script asserts the behaviour, not the shape:
 *
 *   • anon really can INSERT a lead        — proved by inserting one
 *   • anon really cannot SELECT leads      — proved by trying
 *   • service_role really can read them    — proved by reading
 *
 * The write test runs inside a transaction that is always rolled back, so it
 * is safe against the live database and leaves nothing behind. Nothing here
 * modifies schema.
 *
 * Exit code 0 = every check passed. Non-zero = the site is broken in the way
 * the failing line names.
 * ========================================================================= */

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function resolveUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL.trim()
  const envPath = join(root, '.env.local')
  if (!existsSync(envPath)) return null
  const m = readFileSync(envPath, 'utf8').match(/^DATABASE_URL=(.+)$/m)
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null
}

const dbUrl = resolveUrl()
if (!dbUrl || dbUrl.includes('[YOUR-PASSWORD]')) {
  console.error(
    '\nDATABASE_URL is not set.\n\n' +
      '  Supabase → Project Settings → Database → Connection string → URI\n' +
      '  (use the SESSION POOLER URI if your network has no IPv6 route).\n' +
      '  Put it in .env.local as DATABASE_URL=…\n',
  )
  process.exit(1)
}

const { default: pg } = await import('pg')
const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
} catch (err) {
  console.error(`\nCould not connect: ${err.message}\n`)
  process.exit(1)
}

/* ── Tiny assertion harness ────────────────────────────────────────────────
 * Grouped output, because "17 checks passed" is useless when one fails and
 * you need to know which part of the system it belonged to. */
let pass = 0
const failures = []
let group = ''

function heading(name) {
  group = name
  console.log(`\n${name}`)
}

function check(label, ok, detail) {
  if (ok) {
    pass++
    console.log(`  [32m✓[0m ${label}`)
  } else {
    failures.push({ group, label, detail })
    console.log(`  [31m✗[0m ${label}`)
    if (detail) console.log(`      ${detail}`)
  }
}

const one = async (sql, params = []) => (await client.query(sql, params)).rows[0]
const all = async (sql, params = []) => (await client.query(sql, params)).rows

/* ── 1. Schema ───────────────────────────────────────────────────────────── */

const CAPTURE = ['website_leads', 'demo_bookings', 'newsletter_subscribers', 'asset_downloads']
const INTERNAL = ['lead_notes', 'lead_status_history', 'rate_limit_events']
const CONTENT = ['posts', 'guides', 'authors', 'compliance_calendar']
const TABLES = [...CAPTURE, ...INTERNAL, ...CONTENT]

heading('Schema')

const present = new Set(
  (await all(
    `select table_name from information_schema.tables
      where table_schema = 'public' and table_name = any($1)`,
    [TABLES],
  )).map((r) => r.table_name),
)
for (const t of TABLES) {
  check(`table ${t}`, present.has(t), 'missing — run: npm run db:push')
}

/* The columns the application actually writes. A lead insert fails whole if
 * any one of these is absent, so name them individually rather than counting. */
const LEAD_COLUMNS = [
  'work_email', 'phone', 'company_name', 'employee_band', 'designation',
  'modules_interest', 'consent', 'consent_at', 'consent_text',
  'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid',
  'referrer', 'landing_page', 'form_name', 'ip_hash', 'user_agent',
  'status', 'owner', 'next_action_date', 'first_contacted_at',
  'autoreply_sent_at', 'internal_notified_at', 'is_spam',
]
if (present.has('website_leads')) {
  const cols = new Set(
    (await all(
      `select column_name from information_schema.columns
        where table_schema='public' and table_name='website_leads'`,
    )).map((r) => r.column_name),
  )
  const missing = LEAD_COLUMNS.filter((c) => !cols.has(c))
  check(
    `website_leads has all ${LEAD_COLUMNS.length} columns the app writes`,
    missing.length === 0,
    missing.length ? `missing: ${missing.join(', ')}` : '',
  )
}

/* ── 2. Functions and triggers ───────────────────────────────────────────── */

heading('Functions and triggers')

const fns = new Set(
  (await all(
    `select p.proname from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'`,
  )).map((r) => r.proname),
)
for (const f of ['check_rate_limit', 'prune_rate_limit_events', 'touch_updated_at',
                 'log_lead_status_change', 'advance_lead_on_booking']) {
  check(`function ${f}()`, fns.has(f))
}

const trg = new Set(
  (await all(
    `select tgname from pg_trigger where not tgisinternal`,
  )).map((r) => r.tgname),
)
check('trigger website_leads_touch (keeps updated_at honest)', trg.has('website_leads_touch'))
check('trigger website_leads_log_status (writes the audit trail)', trg.has('website_leads_log_status'))

/* check_rate_limit must be SECURITY DEFINER, or anon cannot use it: anon has
 * no privilege on rate_limit_events, deliberately. */
if (fns.has('check_rate_limit')) {
  const r = await one(
    `select p.prosecdef from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname='check_rate_limit' limit 1`,
  )
  check('check_rate_limit() is SECURITY DEFINER', r?.prosecdef === true,
    'without this the form limiter fails for anonymous visitors')
}

/* ── 3. Row Level Security ───────────────────────────────────────────────── */

heading('Row Level Security')

const rls = Object.fromEntries(
  (await all(
    `select c.relname, c.relrowsecurity from pg_class c
       join pg_namespace n on n.oid = c.relnamespace
      where n.nspname='public' and c.relname = any($1)`,
    [TABLES],
  )).map((r) => [r.relname, r.relrowsecurity]),
)
for (const t of TABLES) {
  if (present.has(t)) check(`RLS enabled on ${t}`, rls[t] === true, 'table is wide open')
}

/* ── 4. Privileges — the gate that RLS does not cover ────────────────────── */

heading('Privileges')

for (const t of CAPTURE) {
  if (!present.has(t)) continue
  const r = await one(
    `select has_table_privilege('anon', $1, 'INSERT') as ins,
            has_table_privilege('anon', $1, 'SELECT') as sel`,
    [`public.${t}`],
  )
  check(`anon may INSERT ${t}`, r.ins === true, 'the public form will fail with "permission denied"')
  check(`anon may NOT SELECT ${t}`, r.sel === false, 'DATA LEAK: readable with the browser key')
}

for (const t of INTERNAL) {
  if (!present.has(t)) continue
  const r = await one(
    `select has_table_privilege('anon', $1, 'SELECT') as sel`, [`public.${t}`])
  check(`anon may NOT SELECT ${t}`, r.sel === false, 'internal data readable from the browser')
}

for (const t of CONTENT) {
  if (!present.has(t)) continue
  const r = await one(
    `select has_table_privilege('anon', $1, 'SELECT') as sel`, [`public.${t}`])
  check(`anon may SELECT ${t}`, r.sel === true, 'published content will not render')
}

for (const t of ['website_leads', 'lead_notes', 'posts']) {
  if (!present.has(t)) continue
  const r = await one(
    `select has_table_privilege('service_role', $1, 'SELECT') as sel,
            has_table_privilege('service_role', $1, 'UPDATE') as upd`,
    [`public.${t}`],
  )
  check(`service_role may SELECT and UPDATE ${t}`, r.sel === true && r.upd === true,
    'the admin panel will show "permission denied"')
}

/* ── 5. Behaviour — the part that actually matters ───────────────────────── */
/* Everything above is metadata. This section performs the operations the site
 * performs, as the roles the site uses, and rolls the whole thing back. */

heading('Behaviour (inside a transaction, always rolled back)')

if (present.has('website_leads')) {
  await client.query('begin')
  try {
    await client.query('set local role anon')

    /* Each probe runs inside a SAVEPOINT.
     *
     * The read probe is EXPECTED to fail — that is the whole point of it —
     * and in Postgres a failed statement poisons the transaction: everything
     * after it returns 25P02 "current transaction is aborted" until a
     * rollback. Catching the error in JavaScript is not enough; the server
     * still considers the transaction dead. A savepoint is what lets a
     * deliberately-failing probe leave the transaction usable. */
    const probe = async (name, fn) => {
      await client.query(`savepoint ${name}`)
      try {
        const out = await fn()
        await client.query(`release savepoint ${name}`)
        return { ok: true, out }
      } catch (e) {
        await client.query(`rollback to savepoint ${name}`)
        return { ok: false, error: e.message }
      }
    }

    const ins = await probe('p_insert', () =>
      client.query(
        `insert into public.website_leads
           (work_email, phone, company_name, consent, consent_at, form_name)
         values ('db-verify@example.invalid', '+910000000000', 'db:verify',
                 true, now(), 'db:verify')`,
      ))
    check('anon can submit an enquiry', ins.ok && ins.out.rowCount === 1, ins.error)

    /* Reading it back must fail. Two different failures are both correct: a
     * hard privilege error, or an empty result because RLS filtered it. */
    const sel = await probe('p_select', () =>
      client.query('select id from public.website_leads limit 1'))
    const leaked = sel.ok && sel.out.rowCount > 0
    check('anon cannot read enquiries back', !leaked,
      'DATA LEAK: anyone with the publishable key can list your leads')
    if (!sel.ok) console.log(`      (refused at the privilege layer: ${sel.error.split('\n')[0]})`)

    await client.query('reset role')

    const seen = await one(
      `select count(*)::int as n from public.website_leads where form_name = 'db:verify'`)
    check('the owner role can read what anon wrote', seen.n >= 1,
      'the admin panel would show nothing')
  } finally {
    await client.query('rollback').catch(() => {})
  }

  const left = await one(
    `select count(*)::int as n from public.website_leads where form_name = 'db:verify'`)
  check('the test row was rolled back (nothing left behind)', left.n === 0,
    `${left.n} row(s) named db:verify remain — delete them by hand`)
}

/* The rate limiter is a function call, not a table write, so it needs its own
 * proof: it must both answer and record. */
if (fns.has('check_rate_limit')) {
  await client.query('begin')
  try {
    await client.query('set local role anon')
    const r = await one(
      `select public.check_rate_limit('db:verify', 'verify-hash', 5, '1 hour') as ok`)
    check('anon can call check_rate_limit()', r.ok === true,
      'every form submission will be rejected as rate-limited')
  } catch (e) {
    check('anon can call check_rate_limit()', false, e.message.split('\n')[0])
  } finally {
    /* Unconditional: the transaction may be aborted, and rollback is the only
       statement Postgres still accepts in that state. */
    await client.query('rollback').catch(() => {})
  }
}

/* ── 6. Migration coverage ───────────────────────────────────────────────── */

heading('Migrations on disk')
const files = readdirSync(join(root, 'supabase', 'migrations')).filter((f) => f.endsWith('.sql')).sort()
console.log(`  ${files.length} file(s): ${files.join(', ')}`)

/* ── Summary ─────────────────────────────────────────────────────────────── */

await client.end()

console.log('')
if (failures.length === 0) {
  console.log(`[32m  ${pass} checks passed. The database meets its contract.[0m\n`)
  process.exit(0)
}

console.log(`[31m  ${pass} passed, ${failures.length} FAILED:[0m\n`)
for (const f of failures) {
  console.log(`    [${f.group}] ${f.label}`)
  if (f.detail) console.log(`      → ${f.detail}`)
}
console.log('\n  Most failures are fixed by re-running:  npm run db:push\n')
process.exit(1)
