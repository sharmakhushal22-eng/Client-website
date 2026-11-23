'use client'

import { demoFlows } from '@/content/tour'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { requestFlow } from './demoStore'
import { personaTone } from './DemoPlayer'

/* ============================================================================
 * Every flow as a card, the way a demo library works on the bigger HR
 * sites, except each card is already moving: the real opening screen pans
 * slowly and a small cursor keeps reaching for the first thing the flow
 * clicks. Choosing a card plays that flow in the player above.
 * ========================================================================= */

export function DemoLibrary({ playerId }: { playerId: string }) {
  const play = (id: string) => {
    requestFlow(id)
    document.getElementById(playerId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {demoFlows.map((f, i) => {
        const first = f.steps[0]
        const t = f.steps.find((s) => s.target)?.target
        const secs = Math.round(f.steps.length * 3.8)
        return (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => play(f.id)}
              className="group block h-full w-full overflow-hidden rounded-2xl bg-white text-left ring-1 ring-ink-900/[0.07] transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-floating)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
            >
              <span className="relative block aspect-[16/10] overflow-hidden bg-[#eef1f6]">
                <span
                  aria-hidden
                  className="absolute inset-0 scale-105 bg-cover bg-top blur-md"
                  style={{ backgroundImage: `url(${first.lqip})` }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp */}
                <img
                  src={first.srcSm}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="ez-kenburns absolute inset-0 h-full w-full object-cover object-top"
                  style={{ animationDelay: `${-i * 1.7}s`, transformOrigin: t ? `${t.x}% ${t.y}%` : '50% 20%' }}
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900/25 via-transparent to-transparent" />
                {t && (
                  <span
                    aria-hidden
                    className="ez-mini-cursor absolute"
                    style={{ ['--tx' as string]: `${t.x}%`, ['--ty' as string]: `${t.y}%`, animationDelay: `${-i * 0.9}s` }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" className="drop-shadow-[0_2px_4px_rgb(11_22_51/0.4)]">
                      <path d="M3.5 2.2 20 10.4l-7.1 1.9-3.2 6.9L3.5 2.2Z" fill="#0b1633" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[0.72rem] font-semibold text-ink-900 shadow-sm transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon name="play" className="h-3 w-3" />
                  Watch · {secs}s
                </span>
              </span>
              <span className="block p-5">
                <span className="flex items-center gap-2">
                  <span className={cn('rounded-full px-2 py-0.5 text-[0.64rem] font-semibold uppercase tracking-[0.08em] ring-1', personaTone[f.persona])}>
                    {f.persona}
                  </span>
                  <span className="text-[0.75rem] text-ink-500">{f.steps.length} steps</span>
                </span>
                <span className="mt-3 flex items-center gap-2 font-display text-[1.2rem] font-[650] leading-tight tracking-[-0.015em] text-ink-900">
                  <Icon name={f.icon} className="h-4.5 w-4.5 shrink-0 text-brand-600" />
                  {f.name}
                </span>
                <span className="mt-2 block text-[0.9rem] leading-snug text-ink-600">{f.blurb}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
