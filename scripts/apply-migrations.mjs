#!/usr/bin/env node
/* ============================================================================
 * Apply the SQL migrations to the marketing-site Supabase project.
 *
 * Uses the `pg` driver rather than shelling out to psql, so it needs no
 * system tooling — and rather than the Supabase CLI, so it needs no
 * interactive `supabase login`. The only input is a Postgres connection
 * string.
 *
 *   npm run db:push                     # reads DATABASE_URL from .env.local
 *   DATABASE_URL='postgresql://…' npm run db:push
 *   npm run db:push -- --print          # dump the SQL to paste into the
 *                                       # Supabase SQL editor instead
 *   npm run db:push -- --check          # list our tables, apply nothing
 *
 * Every migration is idempotent (create ... if not exists / drop policy if
 * exists), so re-running is safe.
 * ========================================================================= */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDir = join(root, 'supabase', 'migrations')

const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()
if (files.length === 0) {
  console.error('No migrations found in supabase/migrations.')
  process.exit(1)
}

const argv = process.argv.slice(2)

if (argv.includes('--print')) {
  for (const file of files) {
    process.stdout.write(`\n-- ${'='.repeat(70)}\n-- ${file}\n-- ${'='.repeat(70)}\n\n`)
    process.stdout.write(readFileSync(join(migrationsDir, file), 'utf8'))
  }
  process.exit(0)
}

/* Read DATABASE_URL from the environment, falling back to .env.local so the
 * command works without exporting anything by hand. */
function resolveUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL.trim()
  const envPath = join(root, '.env.local')
  if (!existsSync(envPath)) return null
  const m = readFileSync(envPath, 'utf8').match(/^DATABASE_URL=(.+)$/m)
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null
}

const dbUrl = resolveUrl()

if (!dbUrl || dbUrl.includes('[YOUR-PASSWORD]') || dbUrl === '') {
  console.error(
    '\nDATABASE_URL is not set (or still contains the [YOUR-PASSWORD] placeholder).\n\n' +
      '  Supabase dashboard → Project Settings → Database\n' +
      '  → Connection string → URI, and replace [YOUR-PASSWORD] with the\n' +
      '    database password you set when the project was created.\n\n' +
      '  Put the full string in .env.local as DATABASE_URL=…, then:\n' +
      '    npm run db:push\n\n' +
      '  No password to hand? Dump the SQL and paste it into the dashboard\n' +
      '  SQL editor instead:\n' +
      '    npm run db:push -- --print\n',
  )
  process.exit(1)
}

const { default: pg } = await import('pg')

/* Supabase requires TLS. rejectUnauthorized:false because the pooler presents
 * a certificate chain Node does not carry a root for; the connection is still
 * encrypted, and the host is pinned by the URL. */
const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
} catch (err) {
  console.error(`\nCould not connect: ${err.message}\n`)
  if (/password authentication failed/i.test(err.message)) {
    console.error('  The password in DATABASE_URL is wrong. Reset it in the dashboard\n' +
                  '  under Project Settings → Database → Reset database password.\n')
  } else if (/ENOTFOUND|EAI_AGAIN/i.test(err.message)) {
    console.error(
      '  The host did not resolve. Almost always this is IPv6:\n' +
      '  db.<ref>.supabase.co publishes an AAAA record ONLY, so a network\n' +
      '  without IPv6 cannot reach it — even though the site itself is fine,\n' +
      '  because the app talks to the REST API over IPv4.\n\n' +
      '  Fix: use the pooler, which is IPv4. In the Supabase dashboard go to\n' +
      '  Project Settings → Database → Connection string → "Session pooler"\n' +
      '  and copy that URI into DATABASE_URL. It looks like:\n' +
      '      postgresql://postgres.<ref>:<password>@<region>.pooler.supabase.com:5432/postgres\n\n' +
      '  Note the username is postgres.<ref>, not postgres — and the region\n' +
      '  must be the one shown in your dashboard; guessing it does not work.\n')
  } else if (/Tenant or user not found/i.test(err.message)) {
    console.error(
      '  The pooler host is reachable but does not host this project — the\n' +
      '  region in the hostname is wrong. Copy the exact Session pooler URI\n' +
      '  from Project Settings → Database rather than assembling it by hand.\n')
  }
  process.exit(1)
}

const TABLES = [
  'website_leads', 'lead_notes', 'lead_status_history', 'demo_bookings',
  'newsletter_subscribers', 'asset_downloads', 'rate_limit_events',
  'authors', 'posts', 'guides', 'compliance_calendar',
]

async function report() {
  const { rows } = await client.query(
    `select table_name from information_schema.tables
      where table_schema = 'public' and table_name = any($1)
      order by table_name`,
    [TABLES],
  )
  const present = new Set(rows.map((r) => r.table_name))
  console.log('\nTables in public:')
  for (const t of TABLES) {
    console.log(`  ${present.has(t) ? '✓' : '·'} ${t}`)
  }
  console.log(`\n  ${present.size}/${TABLES.length} present`)
  return present
}

if (argv.includes('--check')) {
  await report()
  await client.end()
  process.exit(0)
}

console.log(`Applying ${files.length} migrations to ${dbUrl.replace(/:[^:@/]+@/, ':****@')}\n`)

for (const file of files) {
  process.stdout.write(`  ${file} … `)
  const sql = readFileSync(join(migrationsDir, file), 'utf8')
  try {
    /* Each file runs as one statement batch. node-postgres sends it as a
     * simple query, so the whole file is implicitly one transaction — a
     * failure rolls the file back rather than leaving it half applied. */
    await client.query(sql)
    console.log('ok')
  } catch (err) {
    console.log('FAILED\n')
    console.error(`  ${err.message}`)
    if (err.position) console.error(`  at character ${err.position}`)
    await client.end()
    process.exit(1)
  }
}

await report()
await client.end()
console.log('\nDone.')
