import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { accessMode, listRows, LEAD_SITES, LEAD_STATUSES, type Lead } from '@/lib/admin/db'
import { AccessError, Panel, Th, Td, StatusChip, When, EmptyState } from '@/components/admin/Table'

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
          <table className="w-full min-w-[74rem] border-collapse">
            <thead>
              <tr>
                <Th>Company</Th>
                <Th>Contact</Th>
                <Th>Headcount</Th>
                <Th>Role</Th>
                <Th>Location</Th>
                <Th>Website</Th>
                <Th>Source</Th>
                <Th>Status</Th>
                <Th>Owner</Th>
                <Th>Received</Th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-brand-50/50">
                  <Td>
                    <Link href={`/admin/leads/${l.id}`} className="font-semibold text-brand-700 hover:underline">
                      {l.company_name}
                    </Link>
                    {l.is_spam && (
                      <span className="ml-2 rounded bg-ink-200 px-1.5 py-0.5 text-[0.65rem] font-bold text-ink-600">
                        SPAM
                      </span>
                    )}
                  </Td>
                  <Td>
                    <span className="block">{l.full_name ?? '—'}</span>
                    <a href={`mailto:${l.work_email}`} className="block text-xs text-brand-700 hover:underline">
                      {l.work_email}
                    </a>
                    <a href={`tel:+91${l.phone}`} className="block text-xs text-ink-400 hover:text-brand-700">
                      +91 {l.phone}
                    </a>
                  </Td>
                  <Td className="font-medium">{l.employee_band ?? '—'}</Td>
                  <Td>{l.designation ?? '—'}</Td>
                  <Td>{[l.city, l.state].filter(Boolean).join(', ') || '—'}</Td>
                  <Td>
                    <SiteChip site={l.source_site ?? 'ezerhrms.com'} />
                  </Td>
                  <Td>
                    <span className="block text-xs">{l.utm_source ?? 'direct'}</span>
                    <span className="block text-xs text-ink-400">{l.form_name}</span>
                  </Td>
                  <Td><StatusChip status={l.status} /></Td>
                  <Td>{l.owner ?? <span className="text-ink-300">unassigned</span>}</Td>
                  <Td><When value={l.created_at} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  )
}

/* besthrms.co gets the accent so the less common source stands out in a
 * list that is mostly ezerhrms.com. */
function SiteChip({ site }: { site: string }) {
  const other = site !== 'ezerhrms.com'
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        other ? 'bg-brand-50 text-brand-700 ring-brand-200' : 'bg-surface text-ink-600 ring-ink-200'
      }`}
    >
      {site}
    </span>
  )
}
