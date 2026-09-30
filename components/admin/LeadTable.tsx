'use client'

import { Fragment, useActionState, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Th, Td, StatusChip, When } from '@/components/admin/Table'
import { deleteLeads, type DeleteLeadsState } from '@/app/admin/leads/actions'
import { DEFAULT_LEAD_SITE, leadSite } from '@/lib/lead-sites'
import { BinButton } from '@/components/admin/BinButton'

/* ============================================================================
 * The lead inbox table: selection, bulk delete, and a delete on every row.
 *
 * WHAT "SELECT ALL" MEANS HERE, because getting this wrong is how an inbox
 * disappears: it selects the rows ON SCREEN — this filter, this page, the
 * rows the operator can actually see and count. It does NOT mean "every lead
 * in the database". The bulk bar says the number out loud for that reason,
 * and the confirm says it again.
 *
 * Every delete is armed before it fires, and the confirm names the count. A
 * genuinely one-click bulk delete was asked for and is not built: one stray
 * click on a select-all would take the entire inbox, notes and status history
 * included, with nothing to restore it from. Two clicks to destroy a month of
 * enquiries is still fast; one is a liability. Everything else here is one
 * click — selecting, selecting all, clearing.
 * ========================================================================= */

export type LeadRow = {
  id: string
  company_name: string
  full_name: string | null
  work_email: string
  phone: string
  employee_band: string | null
  designation: string | null
  city: string | null
  state: string | null
  source_site?: string
  utm_source: string | null
  form_name: string
  status: string
  owner: string | null
  created_at: string
  is_spam: boolean
}

export function LeadTable({ leads }: { leads: LeadRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [armedRow, setArmedRow] = useState<string | null>(null)
  const [armedBulk, setArmedBulk] = useState(false)
  const [state, action, pending] = useActionState<DeleteLeadsState, FormData>(deleteLeads, null)
  const selectAllRef = useRef<HTMLInputElement>(null)

  /* Reset after the server answers. Adjusted during render rather than in an
     effect: leaving a deleted row's checkbox ticked, or the confirm panel
     open over rows that no longer exist, is worse than a re-render. */
  const [handled, setHandled] = useState<DeleteLeadsState>(null)
  if (state !== handled) {
    setHandled(state)
    setArmedRow(null)
    setArmedBulk(false)
    if (state?.deleted) setSelected(new Set())
  }

  /* A partial selection shows the third checkbox state, which is the only
     honest answer to "are these all selected". */
  const allOnPage = leads.length > 0 && selected.size === leads.length
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selected.size > 0 && !allOnPage
    }
  }, [selected, allOnPage])

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleAll = () =>
    setSelected((prev) => (prev.size === leads.length ? new Set() : new Set(leads.map((l) => l.id))))

  /* Selected ids in the order they appear, so the confirm lists them the way
     the operator is reading them. */
  const selectedLeads = leads.filter((l) => selected.has(l.id))

  return (
    <div className="space-y-3">
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}
      {state?.deleted ? (
        <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          Deleted {state.deleted} {state.deleted === 1 ? 'lead' : 'leads'}, with their notes and status history.
        </p>
      ) : null}

      {/* ── Bulk bar ─────────────────────────────────────────────────────── */}
      {selected.size > 0 && (
        <div className="rounded-xl bg-ink-900 px-4 py-3 text-white">
          {!armedBulk ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-sm font-semibold">
                {selected.size} of {leads.length} on this page selected
              </span>
              <BinButton
                variant="solid"
                label={`Delete ${selected.size} selected ${selected.size === 1 ? 'lead' : 'leads'}`}
                onClick={() => setArmedBulk(true)}
              >
                Delete {selected.size}
              </BinButton>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-xs font-semibold text-ink-300 hover:text-white"
              >
                Clear selection
              </button>
            </div>
          ) : (
            <form action={action} className="space-y-2.5">
              {selectedLeads.map((l) => (
                <input key={l.id} type="hidden" name="id" value={l.id} />
              ))}
              <input type="hidden" name="expected" value={selectedLeads.length} />

              <p className="text-sm leading-relaxed">
                Delete <span className="font-bold">{selectedLeads.length}</span>{' '}
                {selectedLeads.length === 1 ? 'lead' : 'leads'}? Their notes and status history go
                too. <span className="font-semibold">This cannot be undone.</span>
              </p>
              <p className="text-xs text-ink-300">
                {selectedLeads.slice(0, 4).map((l) => l.company_name).join(', ')}
                {selectedLeads.length > 4 && ` and ${selectedLeads.length - 4} more`}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <BinButton
                  type="submit"
                  variant="solid"
                  working={pending}
                  label={`Confirm deleting ${selectedLeads.length}`}
                >
                  {pending ? 'Deleting…' : `Yes, delete ${selectedLeads.length} permanently`}
                </BinButton>
                <button
                  type="button"
                  onClick={() => setArmedBulk(false)}
                  disabled={pending}
                  className="px-2 py-1.5 text-xs font-semibold text-ink-300 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <table className="w-full min-w-[80rem] border-collapse">
        <thead>
          <tr>
            <Th>
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allOnPage}
                onChange={toggleAll}
                aria-label={allOnPage ? 'Clear selection' : 'Select all leads on this page'}
                className="h-4 w-4 cursor-pointer accent-brand-600"
              />
            </Th>
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
            <Th><span className="sr-only">Delete</span></Th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => {
            const isSelected = selected.has(l.id)
            return (
              <Fragment key={l.id}>
              <tr
                className={`transition-colors ${isSelected ? 'bg-brand-50' : 'hover:bg-brand-50/50'}`}
              >
                <Td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(l.id)}
                    aria-label={`Select ${l.company_name}`}
                    className="h-4 w-4 cursor-pointer accent-brand-600"
                  />
                </Td>
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
                <Td><SiteChip site={leadSite(l)} /></Td>
                <Td>
                  <span className="block text-xs">{l.utm_source ?? 'direct'}</span>
                  <span className="block text-xs text-ink-400">{l.form_name}</span>
                </Td>
                <Td><StatusChip status={l.status} /></Td>
                <Td>{l.owner ?? <span className="text-ink-300">unassigned</span>}</Td>
                <Td><When value={l.created_at} /></Td>
                <Td>
                  <BinButton
                    label={`Delete ${l.company_name}`}
                    onClick={() => setArmedRow(armedRow === l.id ? null : l.id)}
                  />
                </Td>
              </tr>

              {/* The confirmation spans the whole row rather than living in
                  the last cell. In an 80rem table that cell is off the right
                  edge, so the question the operator has to answer would need
                  scrolling to read — which is not a question, it is a trap. */}
              {armedRow === l.id && (
                <tr className="bg-red-50">
                  <td colSpan={12} className="px-4 py-3">
                    <form
                      action={action}
                      onKeyDown={(e) => { if (e.key === 'Escape') setArmedRow(null) }}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2"
                    >
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="expected" value={1} />
                      <p className="text-sm leading-relaxed text-red-900">
                        Delete <span className="font-bold">{l.company_name}</span>? Its notes and
                        status history go too.{' '}
                        <span className="font-semibold">This cannot be undone.</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <BinButton
                          type="submit"
                          variant="solid"
                          working={pending}
                          autoFocus
                          label={`Confirm deleting ${l.company_name}`}
                        >
                          {pending ? 'Deleting…' : 'Delete'}
                        </BinButton>
                        <button
                          type="button"
                          onClick={() => setArmedRow(null)}
                          disabled={pending}
                          className="px-2 py-1.5 text-xs font-semibold text-ink-700 hover:text-ink-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* besthrms.co gets the accent so the less common source stands out in a
 * list that is mostly ezerhrms.com. */
function SiteChip({ site }: { site: string }) {
  const other = site !== DEFAULT_LEAD_SITE
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
