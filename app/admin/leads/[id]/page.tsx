import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { accessMode, getRow, listRows, LEAD_STATUSES, type Lead } from '@/lib/admin/db'
import { AccessError, Panel, StatusChip, When } from '@/components/admin/Table'
import { Icon } from '@/components/ui/Icon'
import { setLeadStatus, setLeadOwner, addLeadNote } from '../../actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Lead' }

type Note = { id: string; author: string; body: string; created_at: string }
type History = { id: string; from_status: string | null; to_status: string; changed_at: string; changed_by: string | null }

/* Everything captured, grouped so the call-prep facts sit above the
 * attribution detail nobody reads before dialling. */
const FIELD_GROUPS: { title: string; fields: [keyof Lead, string][] }[] = [
  { title: 'Qualification', fields: [
    ['employee_band', 'Headcount'], ['designation', 'Role'],
    ['city', 'City'], ['state', 'State'],
    ['currently_using', 'Currently using'], ['timeline', 'Timeline'],
  ]},
  { title: 'Attribution', fields: [
    ['utm_source', 'Source'], ['utm_medium', 'Medium'], ['utm_campaign', 'Campaign'],
    ['referrer', 'Referrer'], ['landing_page', 'Landing page'], ['form_name', 'Form'],
  ]},
  { title: 'Delivery', fields: [
    ['autoreply_sent_at', 'Auto-reply sent'], ['internal_notified_at', 'Sales notified'],
    ['consent_at', 'Consent given'], ['first_contacted_at', 'First contacted'],
  ]},
]

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  if (accessMode() === 'none') return <AccessError />

  const { id } = await params

  let lead: Lead | null = null
  let notes: Note[] = []
  let history: History[] = []
  let error: string | null = null
  try {
    lead = await getRow<Lead>('website_leads', id)
    if (lead) {
      notes = await listRows<Note>('lead_notes', { filters: { lead_id: id }, limit: 100 })
      history = await listRows<History>('lead_status_history', {
        filters: { lead_id: id }, order: 'changed_at', ascending: true, limit: 100,
      })
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }
  if (error) return <AccessError message={error} />
  if (!lead) notFound()

  const value = (k: keyof Lead) => {
    const v = lead![k]
    if (v === null || v === undefined || v === '') return null
    if (Array.isArray(v)) return v.length ? v.join(', ') : null
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
      return new Date(v).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    }
    return String(v)
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <span aria-hidden="true">←</span> All leads
      </Link>

      {/* Header: who they are and how to reach them, first. */}
      <div className="rounded-2xl bg-surface p-6 ring-1 ring-ink-200 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{lead.company_name}</h1>
            <p className="mt-1 text-ink-600">
              {lead.full_name ?? 'Name not given'}
              {lead.designation && <span className="text-ink-400"> · {lead.designation}</span>}
            </p>
          </div>
          <StatusChip status={lead.status} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`tel:+91${lead.phone}`} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-on-accent hover:bg-brand-700">
            <Icon name="phone" className="h-4 w-4" /> +91 {lead.phone}
          </a>
          <a href={`mailto:${lead.work_email}`} className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50">
            <Icon name="mail" className="h-4 w-4" /> {lead.work_email}
          </a>
          <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-[#128C7E] ring-1 ring-inset ring-ink-200 hover:bg-ink-50">
            <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
          </a>
        </div>

        {lead.message && (
          <blockquote className="mt-6 rounded-xl bg-brand-50 p-5 text-[0.95rem] leading-relaxed text-ink-900 ring-1 ring-brand-100">
            {lead.message}
          </blockquote>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {FIELD_GROUPS.map((group) => (
            <Panel key={group.title} title={group.title}>
              <dl className="divide-y divide-ink-100">
                {group.fields.map(([k, label]) => (
                  <div key={String(k)} className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                    <dt className="text-sm font-medium text-ink-500">{label}</dt>
                    <dd className="text-sm text-ink-900">
                      {value(k) ?? <span className="text-ink-300">—</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          ))}

          <Panel title="Notes" count={notes.length}>
            <form action={addLeadNote} className="border-b border-ink-100 p-5">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="note" className="mb-1.5 block text-sm font-semibold">Add a note</label>
              <textarea
                id="note" name="body" rows={3} required
                placeholder="What was said, what was agreed, what happens next."
                className="w-full rounded-xl bg-surface px-4 py-3 text-sm ring-1 ring-inset ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <button type="submit" className="mt-3 rounded-xl bg-dark px-4 py-2 text-sm font-semibold text-white hover:bg-dark/90">
                Save note
              </button>
            </form>
            {notes.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink-400">No notes yet.</p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {notes.map((n) => (
                  <li key={n.id} className="px-5 py-4">
                    <p className="text-sm leading-relaxed text-ink-900">{n.body}</p>
                    <p className="mt-1.5 text-xs text-ink-400">
                      {n.author} · <When value={n.created_at} />
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Pipeline">
            <form action={setLeadStatus} className="space-y-3 p-5">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="status" className="block text-sm font-semibold">Status</label>
              {/* Keyed on the current status so React REMOUNTS the select
                  after an update. An uncontrolled select keeps whatever value
                  it had, so without this the dropdown still reads "New" while
                  the chip above it says "Contacted" — the page looks like the
                  save failed when it did not. */}
              <select
                key={lead.status}
                id="status" name="status" defaultValue={lead.status}
                className="w-full rounded-xl bg-surface px-4 py-2.5 text-sm ring-1 ring-inset ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-on-accent hover:bg-brand-700">
                Update status
              </button>
            </form>

            <form action={setLeadOwner} className="space-y-3 border-t border-ink-100 p-5">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="owner" className="block text-sm font-semibold">Owner</label>
              <input
                key={lead.owner ?? 'unassigned'}
                id="owner" name="owner" defaultValue={lead.owner ?? ''} placeholder="Who is chasing this"
                className="w-full rounded-xl bg-surface px-4 py-2.5 text-sm ring-1 ring-inset ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <label htmlFor="next_action_date" className="block text-sm font-semibold">Next action</label>
              <input
                key={lead.next_action_date ?? 'none'}
                id="next_action_date" name="next_action_date" type="date"
                defaultValue={lead.next_action_date ?? ''}
                className="w-full rounded-xl bg-surface px-4 py-2.5 text-sm ring-1 ring-inset ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <button type="submit" className="w-full rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">
                Save
              </button>
            </form>
          </Panel>

          <Panel title="History" count={history.length}>
            {history.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink-400">
                Nothing yet — recorded automatically on every status change.
              </p>
            ) : (
              <ol className="divide-y divide-ink-100">
                {history.map((h) => (
                  <li key={h.id} className="px-5 py-3 text-sm">
                    <span className="text-ink-400">{h.from_status ?? 'created'}</span>
                    <span className="mx-2 text-ink-300">→</span>
                    <span className="font-semibold">{h.to_status}</span>
                    <span className="mt-0.5 block text-xs text-ink-400">
                      <When value={h.changed_at} />{h.changed_by && ` · ${h.changed_by}`}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
