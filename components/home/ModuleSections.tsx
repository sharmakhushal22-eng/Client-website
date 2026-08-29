'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { ModuleGroup } from '@/content/modules'

/* ============================================================================
 * The eight module areas, as sections that open.
 *
 * WHY THIS REPLACED THE TAB BAR
 *
 * The old version was a pill tab-bar over one shared panel. The problem was
 * structural, not cosmetic: a single shared panel can only be one height,
 * so it had to be sized for the largest group and every smaller one sat in a
 * mostly empty card — which is exactly what "not looking clean" was.
 * Sections that each take their own height cannot have that problem.
 *
 * It also fixes a real information loss. A tab bar shows one group and hides
 * the other eight behind labels like "Control" and "Serve", which do not tell
 * you what is inside. Here all eight are on the page with their promise
 * visible, and opening one is additive rather than a swap.
 *
 * HOVER *AND* CLICK
 *
 * Both open a section, as asked. Hover is gated three ways, because a
 * hover-opening accordion is normally a bad control — you sweep the cursor
 * down the page to reach something else and leave a wake of opened rows:
 *
 *   1. Only where the pointer is real — matchMedia('(hover: hover) and
 *      (pointer: fine)'). Touch never hovers; a phone would otherwise open a
 *      section on the tap that was meant to scroll.
 *   2. Only after the pointer RESTS for HOVER_INTENT_MS *inside* the row.
 *      The timer is armed and re-armed by mousemove rather than by
 *      mouseenter, which is the load-bearing detail — see below.
 *   3. Never against a pinned section. Once you click, the choice is yours
 *      and the mouse stops overriding it.
 *
 * What hover opens, hover closes: leaving the row collapses it again, so the
 * section is open exactly while you are pointing at it. Clicking pins, and a
 * pinned section stays open when the cursor leaves — which is what you want
 * when you are actually reading the list rather than skimming it.
 *
 * WHY THE TIMER IS ARMED ON MOUSEMOVE, NOT MOUSEENTER
 *
 * Closing on leave means the page height changes under the pointer. Collapse
 * row 3 and every row below it jumps up by the height of its panel — so a
 * row nobody pointed at can arrive underneath a cursor that never moved, and
 * the browser fires a perfectly genuine mouseenter for it. Arming on
 * mouseenter, that row would open on its own, shifting the page again: the
 * accordion would walk down the list by itself.
 *
 * A pointer that has not moved produces no mousemove, so arming on mousemove
 * ignores those arrivals entirely, and it makes gate 2 literal — the section
 * opens when the pointer has been STILL for HOVER_INTENT_MS inside the row,
 * rather than merely 140ms after crossing its edge while still travelling.
 * ========================================================================= */

const HOVER_INTENT_MS = 140

export function ModuleSections({ groups }: { groups: ModuleGroup[] }) {
  const [openId, setOpenId] = useState<string | null>(groups[0]?.id ?? null)
  /* Pinned means "a human clicked this", which outranks the pointer. */
  const [pinned, setPinned] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const canHover = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    canHover.current = mq.matches
    const onChange = (e: MediaQueryListEvent) => {
      canHover.current = e.matches
    }
    /* Plugging a mouse into a tablet, or the browser switching input modes,
       changes the answer mid-session. */
    mq.addEventListener('change', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
      if (hoverTimer.current) clearTimeout(hoverTimer.current)
    }
  }, [])

  const clearHoverTimer = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
  }, [])

  /* Armed by mousemove, so it measures stillness inside the row rather than
     time since the edge was crossed. See the note at the top of the file. */
  const onMove = useCallback(
    (id: string) => {
      if (!canHover.current || pinned) return
      clearHoverTimer()
      hoverTimer.current = setTimeout(() => setOpenId(id), HOVER_INTENT_MS)
    },
    [pinned, clearHoverTimer],
  )

  /* The counterpart hover was missing: it opened on the way in and then
     stayed open behind you, so a section you had merely passed over sat
     expanded with nothing pointing at it. A pinned section is exempt —
     that one was opened on purpose. */
  const onLeave = useCallback(
    (id: string) => {
      if (!canHover.current || pinned) return
      clearHoverTimer()
      setOpenId((cur) => (cur === id ? null : cur))
    },
    [pinned, clearHoverTimer],
  )

  const toggle = useCallback(
    (id: string) => {
      clearHoverTimer()
      if (openId === id && pinned) {
        /* Second click on the section you pinned closes it. */
        setOpenId(null)
        setPinned(false)
        return
      }
      setOpenId(id)
      setPinned(true)
    },
    [openId, pinned, clearHoverTimer],
  )

  return (
    <ul className="mt-8 space-y-3" onMouseLeave={clearHoverTimer}>
      {groups.map((group, i) => {
        const isOpen = openId === group.id
        const panelId = `module-panel-${group.id}`

        return (
          <li
            key={group.id}
            data-open={isOpen ? '' : undefined}
            className="ez-row group relative overflow-hidden rounded-2xl bg-surface ring-1 ring-ink-200 transition-shadow duration-300 data-[open]:shadow-floating data-[open]:ring-brand-200"
            onMouseMove={() => onMove(group.id)}
            onMouseLeave={() => onLeave(group.id)}
          >
            {/* The accent rail, scaling down the left edge as the section
                opens. Decorative, so it is out of the accessibility tree. */}
            <span
              aria-hidden="true"
              className="ez-rail absolute inset-y-0 left-0 w-1 bg-brand-600"
            />

            <h3>
              <button
                type="button"
                onClick={() => toggle(group.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left sm:gap-5 sm:px-7 sm:py-5"
              >
                {/* The running number gives the eight areas an order to read
                    in, which a bare grid of equal cards does not. */}
                <span className="hidden w-6 shrink-0 font-mono text-[0.7rem] font-bold text-ink-400 sm:block">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-colors duration-300 group-data-[open]:bg-brand-600 group-data-[open]:text-white group-data-[open]:ring-brand-600">
                  <Icon name={group.icon} className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[1.05rem] font-bold text-ink-900">
                    {group.label}
                  </span>
                  <span className="mt-0.5 block text-[0.88rem] leading-relaxed text-ink-600">
                    {group.promise}
                  </span>
                </span>

                <span className="hidden shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-[0.7rem] font-bold text-ink-600 transition-colors duration-300 group-data-[open]:bg-brand-100 group-data-[open]:text-brand-700 sm:block">
                  {group.modules.length}
                </span>

                <Icon
                  name="chevron-down"
                  className="h-4 w-4 shrink-0 text-brand-600 transition-transform duration-300 group-data-[open]:rotate-180"
                />
              </button>
            </h3>

            {/* Always rendered, never unmounted: the panel has to exist for
                the height to animate, and leaving it in the DOM means a
                crawler and a find-in-page both see every module rather
                than only the open group's. aria-hidden and inert keep it out
                of the tree and out of tab order while it is closed. */}
            <div
              id={panelId}
              className="ez-collapse"
              data-open={isOpen ? '' : undefined}
              /* A real boolean. React 19 warns that inert="" is treated as
                 FALSE — so the cast that used to be here left every closed
                 panel tab-reachable, which is the bug inert was added to
                 prevent: every closed group's links, live in the tab order. */
              inert={!isOpen}
              aria-hidden={!isOpen}
            >
              <div>
                <div className="px-5 pb-6 sm:px-7 sm:pl-[4.6rem]">
                  <ul className="grid gap-x-7 gap-y-4 border-t border-ink-200 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.modules.map((m, mi) => (
                      <li
                        key={m.name}
                        className="ez-mod flex items-start gap-2.5"
                        /* Capped so the ten-module group's last item is not
                           still arriving half a second after the first. */
                        style={{ animationDelay: `${Math.min(mi, 8) * 40}ms` }}
                      >
                        <Icon
                          name="check"
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-500"
                        />
                        <span>
                          <span className="block text-sm font-bold text-ink-900">
                            {m.name}
                          </span>
                          {m.blurb && (
                            <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                              {m.blurb}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* The reference's status mock for this area. The figures
                      are illustrative — hence the caption, which is not
                      optional: unlabelled numbers on a payroll page get
                      quoted back at you as if they were ours. */}
                  <div className="mt-6 rounded-2xl bg-canvas p-4 ring-1 ring-ink-200">
                    <ul className="divide-y divide-ink-200">
                      {group.mock.map((row) => (
                        <li
                          key={row.label}
                          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0"
                        >
                          <span className="text-[0.85rem] text-ink-800">
                            {row.label}
                          </span>
                          <span
                            className={
                              'shrink-0 rounded-full px-2.5 py-1 text-[0.75rem] font-bold ' +
                              (row.state === 'ok'
                                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                                : 'bg-amber-50 text-amber-800 ring-1 ring-amber-200')
                            }
                          >
                            {row.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-2 text-[0.75rem] text-ink-500">
                    Illustrative figures.
                  </p>

                  {group.href && (
                    <Link
                      href={group.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                    >
                      See {group.name.toLowerCase()} in detail
                      <Icon name="arrow-right" className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
