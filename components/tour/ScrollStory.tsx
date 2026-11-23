'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import type { Shot } from './screens'

/* ============================================================================
 * A sticky scroll story: the words scroll, the screen stays.
 *
 * On wide screens the product window pins beside the text, and as each
 * chapter reaches the middle of the viewport the window cross-fades to that
 * chapter's real screen and eases in on the part the chapter talks about.
 * On phones there is no pinning: each chapter simply carries its own screen.
 * ========================================================================= */

export type Chapter = {
  kicker: string
  title: string
  body: string
  points?: string[]
  shot: Shot
  alt: string
  /** Where to ease in, in % of the screen, and how far. */
  focus?: { x: number; y: number; s: number }
}

export function ScrollStory({ chapters, host }: { chapters: Chapter[]; host: string }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <ol className="lg:col-span-5">
        {chapters.map((c, i) => (
          <li
            key={c.title}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            className="flex min-h-0 flex-col justify-center py-8 lg:min-h-[78vh] lg:py-0"
          >
            <div className={cn('transition-opacity duration-500 lg:pl-6 lg:border-l-2', i === active ? 'lg:border-brand-600 lg:opacity-100' : 'lg:border-ink-900/10 lg:opacity-40')}>
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-brand-700">
                {String(i + 1).padStart(2, '0')} · {c.kicker}
              </p>
              <h3 className="mt-3 font-display text-[1.6rem] font-[650] leading-[1.1] tracking-[-0.02em] text-ink-900 sm:text-[1.9rem]">
                {c.title}
              </h3>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink-600">{c.body}</p>
              {c.points && (
                <ul className="mt-4 space-y-2">
                  {c.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[0.92rem] leading-snug text-ink-700">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* phones and tablets: the screen travels with its chapter */}
            <div className="mt-6 lg:hidden">
              <Window host={host}>
                <Screen shot={c.shot} alt={c.alt} on />
              </Window>
            </div>
          </li>
        ))}
      </ol>

      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-[calc(50vh-17rem)]">
          <Window host={host}>
            {chapters.map((c, i) => (
              <Screen key={c.title} shot={c.shot} alt={c.alt} on={i === active} focus={c.focus} />
            ))}
          </Window>
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {chapters.map((c, i) => (
              <span key={c.title} className={cn('h-1 flex-1 rounded-full transition-colors duration-500', i <= active ? 'bg-brand-600' : 'bg-ink-900/10')} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Window({ host, children, className }: { host: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-[1.1rem] bg-white shadow-[0_2px_4px_rgb(11_22_51/0.05),0_32px_64px_-28px_rgb(11_22_51/0.4)] ring-1 ring-ink-900/10', className)}>
      <div className="flex items-center gap-3 border-b border-ink-900/[0.07] bg-[#f6f7fa] px-3.5 py-2">
        <span aria-hidden className="flex gap-1.5">
          <i className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <i className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <i className="h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white px-2.5 py-0.5 text-[0.7rem] text-ink-500 ring-1 ring-ink-900/[0.06]">
          <Icon name="lock" className="h-2.5 w-2.5" />
          {host}
        </span>
        <span className="w-8" aria-hidden />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#eef1f6]">{children}</div>
    </div>
  )
}

export function Screen({ shot, alt, on, focus }: { shot: Shot; alt: string; on: boolean; focus?: Chapter['focus'] }) {
  return (
    <div
      aria-hidden={!on}
      className={cn('absolute inset-0 transition-opacity duration-700', on ? 'opacity-100' : 'opacity-0')}
    >
      <div aria-hidden className="absolute inset-0 scale-105 bg-cover bg-top blur-md" style={{ backgroundImage: `url(${shot.lqip})` }} />
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp */}
      <img
        src={shot.src}
        srcSet={`${shot.srcSm} 1024w, ${shot.src} 1920w`}
        sizes="(max-width: 1024px) 100vw, 700px"
        alt={on ? alt : ''}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-top motion-safe:transition-transform motion-safe:duration-[1600ms] motion-safe:ease-[cubic-bezier(.16,1,.3,1)]"
        style={{
          transformOrigin: focus ? `${focus.x}% ${focus.y}%` : '50% 0%',
          transform: on && focus ? `scale(${focus.s})` : 'scale(1)',
        }}
      />
    </div>
  )
}
