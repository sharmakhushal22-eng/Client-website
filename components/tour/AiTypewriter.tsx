'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { useReducedMotion, usePageVisible } from './demoStore'
import { useInView } from './useInView'

/* The three AI notes EZER writes, typed out in turn. The words are the
   product's own output for the demo company (fictional people). */
const NOTES = [
  {
    who: 'For HR · Executive briefing',
    text: 'Leave days rose by 83.8 days while on-time punch-ins dropped 4.2 points, alongside 162 overdue probations. Three things to do, each with an owner.',
  },
  {
    who: 'For a manager · Monday note',
    text: 'Team health stands at 42 of 100. Probation decisions are due for Aarav Chopra and Anil Reddy, and an attendance correction has waited 21 days.',
  },
  {
    who: 'For an employee · Your month',
    text: 'This month you have been present 8 of 16 working days, usually in by 10:25 AM, with an average of 9.1 hours a day.',
  },
]

export function AiTypewriter() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, 0.4)
  const reduced = useReducedMotion()
  const visible = usePageVisible()
  const [n, setN] = useState(0)
  const [chars, setChars] = useState(0)
  const note = NOTES[n]
  const done = chars >= note.text.length
  const live = inView && visible && !reduced

  useEffect(() => {
    if (!live) return
    const t = window.setTimeout(
      () => {
        if (done) {
          setN((v) => (v + 1) % NOTES.length)
          setChars(0)
        } else setChars((c) => Math.min(note.text.length, c + 2))
      },
      done ? 3200 : 28,
    )
    return () => window.clearTimeout(t)
  }, [live, done, chars, note.text.length])

  const shown = reduced ? note.text : note.text.slice(0, chars)

  return (
    <div ref={ref}>
      <div className="flex gap-1.5" aria-hidden>
        {NOTES.map((x, i) => (
          <span key={x.who} className={cn('h-1 w-6 rounded-full transition-colors duration-500', i === n ? 'bg-brand-400' : 'bg-white/15')} />
        ))}
      </div>
      <p key={note.who} className="ez-tour-note mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-brand-300">
        {note.who}
      </p>
      <p className="mt-2 min-h-[6.5em] font-display text-[1.18rem] leading-snug text-white sm:text-[1.3rem]">
        <span aria-hidden>{shown}</span>
        {!reduced && <span aria-hidden className="ez-caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] bg-brand-300" />}
        <span className="sr-only">{note.text}</span>
      </p>
    </div>
  )
}
