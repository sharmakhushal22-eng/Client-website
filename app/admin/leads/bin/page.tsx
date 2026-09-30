import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { accessMode, listRows, type Lead } from '@/lib/admin/db'
import { AccessError, Panel, EmptyState } from '@/components/admin/Table'
import { LeadTable } from '@/components/admin/LeadTable'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Recycle bin' }

/* The recycle bin: leads someone removed from the inbox.
 *
 * Nothing on this page can destroy anything. There is no permanent-delete
 * control, and adding one would not work — migration 009 revokes DELETE on
 * website_leads from the role this app runs as, so the request would fail at
 * the database with 42501 whatever the code asked for. That is the point: an
 * admin password gets you as far as retiring a lead, and no further. */

export default async function LeadBinPage() {
  await requireAdmin()
  if (accessMode() === 'none') return <AccessError />

  let leads: Lead[] = []
  let error: string | null = null
  try {
    leads = await listRows<Lead>('website_leads', {
      limit: 500,
      order: 'deleted_at',
      isNotNull: ['deleted_at'],
    })
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }
  if (error) return <AccessError message={error} />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recycle bin</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-500">
            Leads removed from the inbox. They keep their notes and status history, and restoring
            one puts it back exactly as it was.
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink-700 ring-1 ring-ink-200 hover:ring-brand-300"
        >
          Back to inbox
        </Link>
      </div>

      {/* Said plainly, because the absence of a button is not an explanation. */}
      <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
        <span className="font-semibold">Nothing here can be permanently deleted from the admin
        panel.</span>{' '}
        That is enforced by the database, not by this screen: the account the site runs as has no
        permission to remove a lead. Erasing one for good is a deliberate change made directly in
        Supabase by a developer — so an admin login, lost or misused, can never destroy an enquiry.
      </div>

      <Panel title="In the bin" count={leads.length}>
        {leads.length === 0 ? (
          <EmptyState
            title="The recycle bin is empty"
            hint="Leads you remove from the inbox land here, and can be restored from here."
          />
        ) : (
          <LeadTable leads={leads} mode="bin" />
        )}
      </Panel>
    </div>
  )
}
