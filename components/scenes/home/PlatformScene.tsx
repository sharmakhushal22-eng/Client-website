'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Arrow } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Scene } from '@/components/scene/Scene'
import { moduleGroups, solutions } from '@/content/modules'
import { cn } from '@/lib/cn'

/* ============================================================================
 * Scene 4: the platform, as an orbit.
 *
 * The particles form two counter-rotating rings. The eight areas sit on the
 * outer ring as buttons; the one you pick fills the empty centre with what
 * it does. A tab set underneath (arrow keys move, Home/End jump), so the
 * orbit is a real control and not a decoration.
 *
 * Below lg the orbit cannot hold its labels, so the same areas become a
 * stack of disclosures.
 * ========================================================================= */

export function PlatformScene({ index }: { index: number }) {
  const [active, setActive] = useState(4)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const g = moduleGroups[active]
  const n = moduleGroups.length

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = n - 1
    if (next < 0) return
    e.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <Scene index={index} tone="white" labelledBy="platform-title">
      <Container className="flex h-full flex-col justify-center py-20 lg:py-0 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <Eyebrow>The platform</Eyebrow>
            <h2 id="platform-title" className="mt-5 text-[2.3rem] leading-[1.04] sm:text-[3rem] lg:text-[min(3.4vw,6vh)]">
              Thirty-two modules.
              <br />
              <span className="text-ink-400">One core.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[1.02rem] leading-relaxed text-ink-600">
              Eight areas on one employee record. Pick one on the ring to see what it does.
            </p>
            <dl className="mt-8 hidden max-w-sm grid-cols-2 gap-x-6 gap-y-5 border-t border-ink-900/10 pt-6 lg:grid">
              {[
                ['32', 'modules across 8 areas'],
                [String(solutions.length), `solutions, ${solutions.filter((x) => !x.coming).length} live today`],
                ['16', 'reports with column-level access'],
                ['1', 'login for every company'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block font-display text-[1.8rem] font-[680] leading-none tracking-[-0.04em] text-ink-900 [font-stretch:110%]">{v}</span>
                    <span className="mt-1 block text-[0.82rem] leading-snug text-ink-500">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── The orbit (desktop) ─────────────────────────────────────── */}
          <div className="relative hidden lg:col-span-8 lg:block">
            <div className="relative mx-auto aspect-square w-[min(78vh,44rem)]">
              <div data-stage="ring" data-tone="light" className="absolute inset-0" />

              <div role="tablist" aria-label="Product areas" className="absolute inset-0">
                {moduleGroups.map((m, i) => {
                  const a = (i / n) * Math.PI * 2 - Math.PI / 2
                  const on = i === active
                  return (
                    <button
                      key={m.id}
                      ref={(el) => {
                        tabs.current[i] = el
                      }}
                      role="tab"
                      id={`orbit-tab-${m.id}`}
                      aria-selected={on}
                      aria-controls="orbit-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => setActive(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      className={cn(
                        'ez-press absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full py-2 pl-2 pr-4 text-[0.88rem] font-semibold shadow-[0_12px_28px_-14px_rgb(11_22_51/0.45)] transition-colors',
                        on ? 'bg-brand-600 text-white' : 'bg-white text-ink-800 ring-1 ring-ink-900/[0.08] hover:text-brand-700',
                      )}
                      style={{ left: `${50 + 46 * Math.cos(a)}%`, top: `${50 + 46 * Math.sin(a)}%` }}
                    >
                      <span className={cn('grid h-7 w-7 place-items-center rounded-full', on ? 'bg-white/20' : 'bg-brand-50 text-brand-600')}>
                        <Icon name={m.icon} className="h-3.5 w-3.5" />
                      </span>
                      {m.name}
                    </button>
                  )
                })}
              </div>

              <div
                key={g.id}
                id="orbit-panel"
                role="tabpanel"
                aria-labelledby={`orbit-tab-${g.id}`}
                className="ez-panel-in absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 text-center"
              >
                <p className="ez-kicker text-ink-400">{g.label}</p>
                <p className="mt-3 font-display text-[min(2.1vw,3.6vh)] font-[660] leading-[1.1] tracking-[-0.03em] text-ink-900 [font-stretch:106%]">
                  {g.promise}
                </p>
                <ul className="mx-auto mt-5 max-w-[24rem] space-y-2 text-left">
                  {g.modules.slice(0, 3).map((x) => (
                    <li key={x.name} className="flex gap-2.5 text-[0.88rem] leading-snug text-ink-700">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      <span>{x.name}</span>
                    </li>
                  ))}
                </ul>
                {g.href && (
                  <Link href={g.href} className="ez-press mt-5 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-brand-700">
                    <span className="ez-link">More on {g.name.toLowerCase()}</span>
                    <Arrow />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ── Mobile: the same areas, as disclosures ──────────────────── */}
          <div className="lg:hidden">
            {moduleGroups.map((m, i) => (
              <details key={m.id} className="group border-t border-ink-900/10 last:border-b" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600">
                    <Icon name={m.icon} className="h-4 w-4" />
                  </span>
                  <span className="font-display text-[1.3rem] font-[640] tracking-[-0.02em] text-ink-900">{m.name}</span>
                  <span aria-hidden="true" className="ml-auto text-xl text-ink-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="pb-6 pl-12">
                  <p className="font-semibold text-ink-900">{m.promise}</p>
                  <ul className="mt-3 space-y-2">
                    {m.modules.map((x) => (
                      <li key={x.name} className="text-[0.92rem] leading-snug text-ink-600">{x.name}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Scene>
  )
}
