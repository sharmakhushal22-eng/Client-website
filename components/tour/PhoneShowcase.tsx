'use client'

import { useEffect, useRef, useState } from 'react'
import { phoneScreens, type PhoneScreen } from '@/content/tour'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { useReducedMotion, usePageVisible } from './demoStore'
import { useInView } from './useInView'

/* ============================================================================
 * The employee app, on three phones.
 *
 * Each phone holds a real, full-length screen from the ESS or EZER Learn on a
 * phone, and scrolls through it slowly, the way a thumb would. Every few
 * seconds one phone moves on to its next screen, so the whole app goes by
 * without anyone touching anything. Pick a screen below to put it on a phone
 * yourself (that stops the rotation).
 *
 * Everything moves only while the section is on screen.
 * ========================================================================= */

const SLOTS: string[][] = [
  ['m-home', 'm-leave', 'm-attendance'],
  ['m-performance', 'm-lms', 'm-achievements'],
  ['m-social', 'm-funzone', 'm-insights'],
]
const byId = Object.fromEntries(phoneScreens.map((p) => [p.id, p])) as Record<string, PhoneScreen>
/* Phone screen viewport: 390 × 844 css px. */
const VIEW = 844 / 390

const TOASTS: { icon: IconName; title: string; sub: string; cls: string }[] = [
  { icon: 'clock', title: 'Punched in · 09:02', sub: 'Pune Branch, inside the shift', cls: 'left-0 top-[14%] sm:-left-4' },
  { icon: 'check', title: 'Leave approved', sub: 'Casual leave · by your manager', cls: 'right-0 top-[30%] sm:-right-4' },
  { icon: 'sparkle', title: 'Badge earned', sub: 'Quiz ace · EZER Learn', cls: 'left-0 bottom-[30%] sm:-left-6' },
  { icon: 'heart', title: 'You were recognised', sub: 'Team spirit · on the Wall of Fame', cls: 'right-0 bottom-[16%] sm:-right-6' },
]

export function PhoneShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, 0.2)
  const reduced = useReducedMotion()
  const visible = usePageVisible()
  const [idx, setIdx] = useState([0, 0, 0])
  const [tick, setTick] = useState(0)
  const [manual, setManual] = useState(false)
  const live = inView && visible && !reduced

  useEffect(() => {
    if (!live || manual) return
    const t = window.setTimeout(() => {
      const slot = tick % 3
      setIdx((cur) => cur.map((v, k) => (k === slot ? (v + 1) % SLOTS[k].length : v)))
      setTick((n) => n + 1)
    }, 3800)
    return () => window.clearTimeout(t)
  }, [live, manual, tick])

  const pick = (id: string) => {
    const k = SLOTS.findIndex((s) => s.includes(id))
    setManual(true)
    setIdx((cur) => cur.map((v, j) => (j === k ? SLOTS[k].indexOf(id) : v)))
  }

  const current = SLOTS.map((s, k) => s[idx[k]])

  return (
    <div ref={ref} data-live={live ? '' : undefined} className="ez-phones">
      <div className="relative">
        <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-8">
          {SLOTS.map((slot, k) => (
            <figure
              key={k}
              className={cn(
                'w-[68vw] max-w-[17rem] shrink-0 snap-center sm:w-auto sm:flex-1',
                k === 1 ? 'sm:max-w-[17.5rem] sm:-translate-y-6' : 'sm:max-w-[15.5rem] sm:translate-y-4',
              )}
            >
              <Phone screens={slot.map((id) => byId[id])} active={current[k]} />
              <figcaption className="mt-5 text-center">
                <span key={current[k]} className="ez-tour-note block text-[0.95rem] font-semibold text-white">
                  {byId[current[k]].title}
                </span>
                <span key={`${current[k]}-c`} className="ez-tour-note mt-1 block text-[0.84rem] leading-snug text-white/65">
                  {byId[current[k]].caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* things that happen to an employee during a day */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          {TOASTS.map((t, i) => (
            <span
              key={t.title}
              className={cn('ez-toast absolute flex items-center gap-2.5 rounded-2xl bg-white/95 py-2 pl-2 pr-4 text-left shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)] ring-1 ring-black/5 backdrop-blur', t.cls)}
              style={{ animationDelay: `${i * 4}s` }}
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name={t.icon} className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[0.8rem] font-semibold text-ink-900">{t.title}</span>
                <span className="block text-[0.72rem] text-ink-500">{t.sub}</span>
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Put a screen on a phone">
        {phoneScreens.map((p) => {
          const on = current.includes(p.id)
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => pick(p.id)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors',
                on ? 'bg-white text-ink-900' : 'bg-white/[0.08] text-white/75 ring-1 ring-white/15 hover:bg-white/15 hover:text-white',
              )}
            >
              {p.title}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Phone({ screens, active }: { screens: PhoneScreen[]; active: string }) {
  return (
    <div className="relative rounded-[2.6rem] bg-[#0d1220] p-[7px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7),inset_0_0_0_1px_rgb(255_255_255/0.12)]">
      <div className="relative aspect-[390/844] overflow-hidden rounded-[2.15rem] bg-[#f4f6fb]">
        {screens.map((s) => {
          const on = s.id === active
          const travel = Math.max(0, (1 - VIEW / s.ratio) * 100)
          return (
            <div
              key={s.id}
              aria-hidden={!on}
              className={cn('absolute inset-0 transition-opacity duration-700', on ? 'opacity-100' : 'opacity-0')}
            >
              <div aria-hidden className="absolute inset-0 bg-cover bg-top blur-md" style={{ backgroundImage: `url(${s.lqip})` }} />
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp */}
              <img
                src={s.src}
                alt={on ? `${s.title} in the EZER employee app on a phone` : ''}
                loading="lazy"
                decoding="async"
                className={cn('absolute left-0 top-0 w-full', on && 'ez-phone-scroll')}
                style={{ ['--travel' as string]: `-${travel.toFixed(2)}%` }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- the app's own tab bar */}
              <img src={s.nav} alt="" loading="lazy" className="absolute bottom-0 left-0 w-full" style={{ aspectRatio: `1 / ${s.navRatio}` }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
