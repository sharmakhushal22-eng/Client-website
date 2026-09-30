import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { accessMode, listRows, LEAD_SITES, LEAD_STATUSES, type Lead } from '@/lib/admin/db'
import { AccessError, Panel, EmptyState } from '@/components/admin/Table'
import { LeadTable } from '@/components/admin/LeadTable'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Leads' }

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; site?: string }>
}) {
  await requireAdmin()
  if (accessMode() === 'none') return <AccessError />

  const { status, site } = await searchParams
  const valid = LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])
  const validSite = LEAD_SITES.includes(site as (typeof LEAD_SITES)[number])

  /* The two filters combine, so each link keeps the other's current value. */
  const href = (s: string | null, w: string | null) => {
    const q = new URLSearchParams()
    if (s) q.set('status', s)
    if (w) q.set('site', w)
    const qs = q.toString()
    return qs ? `/admin/leads?${qs}` : '/admin/leads'
  }
  const chip = (on: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ring-inset transition-colors ${
      on ? 'bg-dark text-white ring-ink-900' : 'bg-surface text-ink-600 ring-ink-200 hover:ring-brand-300'
    }`

  let leads: Lead[] = []
  let error: string | null = null
  try {
    leads = await listRows<Lead>('website_leads', {
      limit: 500,
      filters: {
        ...(valid ? { status: status! } : {}),
        ...(validSite ? { source_site: site! } : {}),
      },
    })
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }
  if (error) return <AccessError message={error} />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="mt-1 text-sm text-ink-500">
            Every enquiry from ezerhrms.com and besthrms.co, newest first.
            {valid && ` Status: “${status}”.`}
            {validSite && ` Website: ${site}.`}
          </p>
        </div>
        <Link
          href="/admin/leads/export"
          prefetch={false}
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-on-accent hover:bg-brand-700"
        >
          Export CSV
        </Link>
      </div>

      {/* Status filter — §7 pipeline */}
      <nav className="flex flex-wrap gap-2" aria-label="Filter by status">
        <Link href={href(null, validSite ? site! : null)} className={chip(!valid)}>
          All
        </Link>
        {LEAD_STATUSES.map((s) => (
          <Link key={s} href={href(s, validSite ? site! : null)} className={chip(status === s)}>
            {s}
          </Link>
        ))}
      </nav>

      <nav className="flex flex-wrap gap-2" aria-label="Filter by website">
        <Link href={href(valid ? status! : null, null)} className={chip(!validSite)}>
          All websites
        </Link>
        {LEAD_SITES.map((w) => (
          <Link key={w} href={href(valid ? status! : null, w)} className={chip(site === w)}>
            {w}
          </Link>
        ))}
      </nav>

      <Panel title="Enquiries" count={leads.length}>
        {leads.length === 0 ? (
          <EmptyState
            title={valid || validSite ? 'No leads match these filters' : 'No enquiries yet'}
            hint="Submissions from /contact and /book-a-demo appear here within seconds."
          />
        ) : (
          <LeadTable leads={leads} />
        )}
      </Panel>
    </div>
  )
}

