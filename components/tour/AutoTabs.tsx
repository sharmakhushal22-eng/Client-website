'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { useReducedMotion, usePageVisible } from './demoStore'
import { useInView } from './useInView'
import { Screen, Window, type Chapter } from './ScrollStory'

/* ============================================================================
 * Feature tabs that advance by themselves.
 *
 * The list on the left moves on every few seconds, with a bar filling under
 * the active item so the visitor can see the next change coming; the window
 * on the right cross-fades to that feature's real screen and eases in on it.
 * Choosing an item stops the rotation there. Runs only while on screen.
 * ========================================================================= */

export type Tab = Omit<Chapter, 'kicker' | 'points'> & { icon: IconName; host: string; group: string }

const DWELL = 6000

export type Chip = { icon: IconName; label: string; tone: string; at: string }

export function AutoTabs({ tabs, chips = [] }: { tabs: Tab[]; chips?: Chip[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, 0.3)
  const reduced = useReducedMotion()
  const visible = usePageVisible()
  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)
  const live = inView && visible && !reduced && !manual

  useEffect(() => {
    if (!live) return
    const t = window.setTimeout(() => setActive((a) => (a + 1) % tabs.length), DWELL)
    return () => window.clearTimeout(t)
  }, [live, active, tabs.length])

  const groups = [...new Set(tabs.map((t) => t.group))]
  const tab = tabs[active]

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        {groups.map((g) => (
          <div key={g} className="mb-6 last:mb-0">
            <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">{g}</p>
            <ul className="space-y-1.5" role="tablist" aria-label={g}>
              {tabs.map((t, i) =>
                t.group !== g ? null : (
                  <li key={t.title}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      onClick={() => { setActive(i); setManual(true) }}
                      className={cn(
                        'relative w-full overflow-hidden rounded-xl px-4 py-3 text-left transition-colors',
                        i === active ? 'bg-white shadow-[var(--shadow-raised)] ring-1 ring-ink-900/[0.06]' : 'hover:bg-white/60',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors', i === active ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700')}>
                          <Icon name={t.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-[0.98rem] font-semibold text-ink-900">{t.title}</span>
                      </span>
                      <span
                        className={cn(
                          'grid transition-[grid-template-rows,opacity] duration-500',
                          i === active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="block pl-11 pt-1.5 text-[0.9rem] leading-snug text-ink-600">{t.body}</span>
                        </span>
                      </span>
                      {i === active && (
                        <span aria-hidden className="absolute inset-x-4 bottom-0 h-[2px] overflow-hidden rounded-full bg-ink-900/[0.06]">
                          <span
                            key={`${active}-${manual}`}
                            className={cn('block h-full origin-left bg-brand-600', manual || reduced ? 'scale-x-100' : 'ez-demo-progress')}
                            style={{ animationDuration: `${DWELL}ms`, animationPlayState: live ? 'running' : 'paused' }}
                          />
                        </span>
                      )}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="lg:col-span-7">
        <div className="relative lg:sticky lg:top-28">
          <Window host={tab.host}>
            {tabs.map((t, i) => (
              <Screen key={t.title} shot={t.shot} alt={t.alt} on={i === active} focus={t.focus} />
            ))}
          </Window>
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
            {chips.map((c, i) => (
              <span
                key={c.label}
                className={cn('ez-pop absolute flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-[0.78rem] font-semibold text-ink-900 shadow-[var(--shadow-floating)] ring-1 ring-ink-900/5', c.at)}
                style={{ ['--d' as string]: `${i * 2}s` }}
              >
                <span className={cn('grid h-6 w-6 place-items-center rounded-lg', c.tone)}>
                  <Icon name={c.icon} className="h-3.5 w-3.5" />
                </span>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
