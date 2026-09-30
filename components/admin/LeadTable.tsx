'use client'

import { Fragment, useActionState, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Th, Td, StatusChip, When } from '@/components/admin/Table'
import { binLeads, restoreLeads, type BinLeadsState } from '@/app/admin/leads/actions'
import { DEFAULT_LEAD_SITE, leadSite } from '@/lib/lead-sites'
import { BinButton } from '@/components/admin/BinButton'

/* ============================================================================
 * The lead table, in two modes.
 *
 *   inbox — the live enquiries. The bin MOVES them to the recycle bin.
 *   bin   — the recycle bin. Restore puts them back. There is no delete here,
 *           and no way to add one that would work: migration 009 revokes
 *           DELETE on website_leads from the role this app authenticates as.
 *
 * One component rather than two, because the columns, the selection, the
 * select-all and the guards are identical — and the copy that drifted would
 * be the destructive one.
 *
 * WHAT "SELECT ALL" MEANS: the rows ON SCREEN — this filter, this page, rows
 * someone can count. Never "every lead in the database". The bar says the
 * number for that reason, and the confirm says it again.
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
  deleted_at?: string | null
  deleted_by?: string | null
}

export function LeadTable({
  leads,
  mode = 'inbox',
}: {
  leads: LeadRow[]
  mode?: 'inbox' | 'bin'
}) {
  const isBin = mode === 'bin'

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [armedRow, setArmedRow] = useState<string | null>(null)
  const [armedBulk, setArmedBulk] = useState(false)
  const [state, action, pending] = useActionState<BinLeadsState, FormData>(
    isBin ? restoreLeads : binLeads,
    null,
  )
  const selectAllRef = useRef<HTMLInputElement>(null)

  /* Reset once the server answers. Adjusted during render rather than in an
     effect: a ticked checkbox on a row that has just moved, or a confirm
     panel hanging over rows that are no longer there, is worse than a
     re-render. */
  const [handled, setHandled] = useState<BinLeadsState>(null)
  if (state !== handled) {
    setHandled(state)
    setArmedRow(null)
    setArmedBulk(false)
    if (state?.binned || state?.restored) setSelected(new Set())
  }

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

  const selectedLeads = leads.filter((l) => selected.has(l.id))
  const columns = isBin ? 13 : 12

  const done = state?.restored
    ? `Restored ${state.restored} ${state.restored === 1 ? 'lead' : 'leads'} to the inbox.`
    : state?.binned
      ? `Moved ${state.binned} ${state.binned === 1 ? 'lead' : 'leads'} to the recycle bin. Nothing was deleted.`
      : null

  return (
    <div className="space-y-3">
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}
      {done && (
        <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          {done}
        </p>
      )}

      {/* ── Bulk bar ─────────────────────────────────────────────────────── */}
      {selected.size > 0 && (
        <div className="rounded-xl bg-ink-900 px-4 py-3 text-white">
          {!armedBulk ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-sm font-semibold">
                {selected.size} of {leads.length} on this page selected
              </span>
              {isBin ? (
                <button
                  type="button"
                  onClick={() => setArmedBulk(true)}
                  className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Restore {selected.size}
                </button>
              ) : (
                <BinButton
                  variant="solid"
                  label={`Move ${selected.size} selected to the recycle bin`}
                  onClick={() => setArmedBulk(true)}
                >
                  Move {selected.size} to recycle bin
                </BinButton>
              )}
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
                {isBin ? 'Restore' : 'Move'} <span className="font-bold">{selectedLeads.length}</span>{' '}
                {selectedLeads.length === 1 ? 'lead' : 'leads'}
                {isBin ? ' back to the inbox?' : ' to the recycle bin?'}{' '}
                <span className="font-semibold">
                  {isBin
                    ? 'They reappear with their notes and history.'
                    : 'Nothing is deleted — you can restore them from there.'}
                </span>
              </p>
              <p className="text-xs text-ink-300">
                {selectedLeads.slice(0, 4).map((l) => l.company_name).join(', ')}
                {selectedLeads.length > 4 && ` and ${selectedLeads.length - 4} more`}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {isBin ? (
                  <button
                    type="submit"
                    disabled={pending}
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {pending ? 'Restoring…' : `Yes, restore ${selectedLeads.length}`}
                  </button>
                ) : (
                  <BinButton
                    type="submit"
                    variant="solid"
                    working={pending}
                    label={`Confirm moving ${selectedLeads.length} to the recycle bin`}
                  >
                    {pending ? 'Moving…' : `Yes, move ${selectedLeads.length}`}
                  </BinButton>
                )}
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
            {isBin && <Th>Moved here</Th>}
            <Th><span className="sr-only">{isBin ? 'Restore' : 'Move to recycle bin'}</span></Th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => {
            const isSelected = selected.has(l.id)
            return (
              <Fragment key={l.id}>
                <tr className={`transition-colors ${isSelected ? 'bg-brand-50' : 'hover:bg-brand-50/50'}`}>
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
                  {isBin && (
                    <Td>
                      <When value={l.deleted_at ?? null} />
                      <span className="block text-xs text-ink-400">{l.deleted_by ?? '—'}</span>
                    </Td>
                  )}
                  <Td>
                    {isBin ? (
                      <button
                        type="button"
                        onClick={() => setArmedRow(armedRow === l.id ? null : l.id)}
                        title={`Restore ${l.company_name}`}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                      >
                        Restore
                      </button>
                    ) : (
                      <BinButton
                        label={`Move ${l.company_name} to the recycle bin`}
                        onClick={() => setArmedRow(armedRow === l.id ? null : l.id)}
                      />
                    )}
                  </Td>
                </tr>

                {/* The confirmation spans the whole row rather than living in
                    the last cell. In an 80rem table that cell sits off the
                    right edge, so the question would need sideways scrolling
                    to read — which is not a question, it is a trap. */}
                {armedRow === l.id && (
                  <tr className={isBin ? 'bg-emerald-50' : 'bg-red-50'}>
                    <td colSpan={columns} className="px-4 py-3">
                      <form
                        action={action}
                        onKeyDown={(e) => { if (e.key === 'Escape') setArmedRow(null) }}
                        className="flex flex-wrap items-center gap-x-4 gap-y-2"
                      >
                        <input type="hidden" name="id" value={l.id} />
                        <input type="hidden" name="expected" value={1} />
                        <p className={`text-sm leading-relaxed ${isBin ? 'text-emerald-900' : 'text-red-900'}`}>
                          {isBin ? 'Restore ' : 'Move '}
                          <span className="font-bold">{l.company_name}</span>
                          {isBin ? ' back to the inbox?' : ' to the recycle bin?'}{' '}
                          <span className="font-semibold">
                            {isBin
                              ? 'It reappears with its notes and history.'
                              : 'Nothing is deleted — you can restore it from there.'}
                          </span>
                        </p>
                        <div className="flex items-center gap-2">
                          {isBin ? (
                            <button
                              type="submit"
                              disabled={pending}
                              autoFocus
                              className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              {pending ? 'Restoring…' : 'Restore'}
                            </button>
                          ) : (
                            <BinButton
                              type="submit"
                              variant="solid"
                              working={pending}
                              autoFocus
                              label={`Confirm moving ${l.company_name} to the recycle bin`}
                            >
                              {pending ? 'Moving…' : 'Move to recycle bin'}
                            </BinButton>
                          )}
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
