import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { accessMode, countRows, listRows, type Lead } from '@/lib/admin/db'
import { AccessError, Panel, Th, Td, StatusChip, When, EmptyState } from '@/components/admin/Table'
import { LEAD_STATUSES } from '@/lib/admin/db'

export const dynamic = 'force-dynamic'

export default async function AdminOverview() {
  await requireAdmin()
  if (accessMode() === 'none') return <AccessError />

  let recent: Lead[] = []
  const counts: Record<string, number> = {}
  let totals = { leads: 0, bookings: 0, subs: 0, downloads: 0 }
  let error: string | null = null

  try {
    recent = await listRows<Lead>('website_leads', { limit: 8 })
    totals = {
      leads: await countRows('website_leads'),
      bookings: await countRows('demo_bookings'),
      subs: await countRows('newsletter_subscribers'),
      downloads: await countRows('asset_downloads'),
    }
    for (const s of LEAD_STATUSES) counts[s] = await countRows('website_leads', { status: s })
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  if (error) return <AccessError message={error} />

  const stats = [
    { label: 'Total leads', value: totals.leads, href: '/admin/leads' },
    { label: 'Demo bookings', value: totals.bookings, href: '/admin/bookings' },
    { label: 'Subscribers', value: totals.subs, href: '/admin/subscribers' },
    { label: 'Downloads', value: totals.downloads, href: '/admin/downloads' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="mt-1 text-sm text-ink-500">
          Everything the website has captured.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition-shadow hover:shadow-md hover:ring-brand-200"
          >
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-500">{s.label}</dt>
            <dd className="mt-2 text-3xl font-bold tabular-nums text-ink-900">{s.value}</dd>
          </Link>
        ))}
      </dl>

      {/* Pipeline — §7 statuses. Rendered as a bar so the shape of the funnel
          is visible, not just the numbers. */}
      <Panel title="Pipeline">
        <div className="grid gap-px bg-ink-200 sm:grid-cols-4 lg:grid-cols-7">
          {LEAD_STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/leads?status=${encodeURIComponent(s)}`}
              className="bg-white px-5 py-4 transition-colors hover:bg-brand-50"
            >
              <StatusChip status={s} />
              <p className="mt-2 text-2xl font-bold tabular-nums">{counts[s] ?? 0}</p>
            </Link>
          ))}
        </div>
      </Panel>

      <Panel
        title="Latest enquiries"
        count={recent.length}
        action={
          <Link href="/admin/leads" className="text-sm font-semibold text-brand-700 hover:underline">
            View all
          </Link>
        }
      >
        {recent.length === 0 ? (
          <EmptyState
            title="No enquiries yet"
            hint="Submissions from the contact form and the demo booking page land here."
          />
        ) : (
          <table className="w-full min-w-[52rem] border-collapse">
            <thead>
              <tr>
                <Th>Company</Th>
                <Th>Contact</Th>
                <Th>Headcount</Th>
                <Th>Status</Th>
                <Th>Received</Th>
              </tr>
            </thead>
            <tbody>
              {recent.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-brand-50/50">
                  <Td>
                    <Link href={`/admin/leads/${l.id}`} className="font-semibold text-brand-700 hover:underline">
                      {l.company_name}
                    </Link>
                  </Td>
                  <Td>
                    <span className="block">{l.full_name ?? '—'}</span>
                    <span className="block text-xs text-ink-400">{l.work_email}</span>
                  </Td>
                  <Td>{l.employee_band ?? '—'}</Td>
                  <Td><StatusChip status={l.status} /></Td>
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
