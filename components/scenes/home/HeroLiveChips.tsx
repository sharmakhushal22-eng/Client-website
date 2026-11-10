'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { istClock, payrollMonth } from './hero-clock'

/* ============================================================================
 * The four cards orbiting the hero globe, kept moving so the platform reads
 * as one in use, not a still.
 *
 *   Payroll      a different company's run each time. A progress bar fills
 *                while it calculates, then it is ready for review with its net
 *                payout. The month is the one being paid out now.
 *   Activity     a short feed. New events (joiners, approvals, settlements)
 *                push in at the top, older ones slide down and their
 *                timestamps age. A stream is the strongest "people are using
 *                this right now" signal a still page can give.
 *   Punched in   a new punch every ~2.5s, stamped with the actual time in
 *                India, so it never runs ahead or backwards.
 *   Statutory    tied to payroll: the heads spin while a run calculates and
 *                tick through as it finishes, so two cards visibly react to
 *                the same event.
 *
 * The first render is a complete static state (server HTML, no-JS and
 * reduced-motion all show it). After the intro each card runs on its own
 * jittered clock, staggered so two rarely change in the same moment: a fixed
 * beat reads as a loop, an uneven one reads as traffic.
 *
 * Every record is illustrative sample data; the container's aria-label says
 * so. Nothing names a real company or person.
 *
 * Cycling only runs while the hero is on screen, the tab is visible and the
 * visitor has not asked for reduced motion.
 * ========================================================================= */

/* ── Records ─────────────────────────────────────────────────────────────── */

/* avg = average net pay per head, so the payout is plausible for the size. */
const RUNS = [
  { people: 890, sites: 4, avg: 34_200 },
  { people: 1236, sites: 7, avg: 29_800 },
  { people: 312, sites: 2, avg: 41_500 },
  { people: 2145, sites: 9, avg: 26_400 },
  { people: 168, sites: 1, avg: 52_000 },
  { people: 4870, sites: 18, avg: 23_900 },
  { people: 642, sites: 3, avg: 38_700 },
  { people: 1508, sites: 11, avg: 31_200 },
  { people: 76, sites: 1, avg: 61_000 },
  { people: 3320, sites: 14, avg: 27_600 },
]

type Kind = 'leave' | 'join' | 'expense' | 'fnf' | 'regularise' | 'offer' | 'shift' | 'payslip'

const KINDS: Record<Kind, { tile: string; icon: string }> = {
  leave: { tile: 'bg-emerald-100 text-emerald-700', icon: 'M4 6h12v10H4z M4 9h12 M7 4v3 M13 4v3 M7.5 12.5l1.8 1.8 3.2-3.3' },
  join: { tile: 'bg-brand-100 text-brand-700', icon: 'M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 16c.6-2.6 2.6-4 5-4s4.4 1.4 5 4 M15 7v5 M12.5 9.5h5' },
  expense: { tile: 'bg-amber-100 text-amber-700', icon: 'M5 3h10v14l-2-1.3-1.7 1.3-1.6-1.3L8 17l-1.6-1.3L5 17z M8 7h4 M8 10h4' },
  fnf: { tile: 'bg-violet-100 text-violet-700', icon: 'M3 6h14v10H3z M3 6l10-3v3 M12.5 11h4.5' },
  regularise: { tile: 'bg-sky-100 text-sky-700', icon: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M10 6.5V10l2.5 1.5' },
  offer: { tile: 'bg-pink-100 text-pink-700', icon: 'M5 3h7l3 3v11H5z M7.5 11.5l1.8 1.8 3.2-3.3' },
  shift: { tile: 'bg-sky-100 text-sky-700', icon: 'M4 8h11l-2.5-2.5 M16 12H5l2.5 2.5' },
  payslip: { tile: 'bg-brand-100 text-brand-700', icon: 'M3 5h14v10H3z M3 5l7 6 7-6' },
}

const EVENTS: { kind: Kind; title: string; meta: string }[] = [
  { kind: 'leave', title: 'Leave approved', meta: 'Arjun S. · 2 days' },
  { kind: 'join', title: 'Joined today', meta: 'Neha K. · Pune plant' },
  { kind: 'expense', title: 'Expense approved', meta: '₹1,840 · Kavya R.' },
  { kind: 'fnf', title: 'Full & final settled', meta: '₹82,450 · Imran Q.' },
  { kind: 'regularise', title: 'Attendance regularised', meta: 'Deepak T. · 1 day' },
  { kind: 'offer', title: 'Offer accepted', meta: 'Sr. Accountant · Mumbai' },
  { kind: 'shift', title: 'Shift swap approved', meta: 'Night → General' },
  { kind: 'payslip', title: 'Payslips emailed', meta: '312 employees' },
  { kind: 'leave', title: 'Leave approved', meta: 'Meera P. · Half day' },
  { kind: 'join', title: 'Joined today', meta: 'Rahul B. · Gurugram HQ' },
  { kind: 'expense', title: 'Travel claim approved', meta: '₹6,320 · Sunita D.' },
  { kind: 'offer', title: 'Offer accepted', meta: 'Line Supervisor · Hosur' },
  { kind: 'regularise', title: 'Missed punch fixed', meta: 'Anil Y. · Sanand' },
  { kind: 'fnf', title: 'Salary advance approved', meta: '₹15,000 · Manoj V.' },
]

/* What the feed shows before anything has happened: newest first, with ages
 * in seconds, so the server HTML is a complete, believable state. */
const SEED = [
  { e: 0, age: 4 },
  { e: 1, age: 48 },
  { e: 2, age: 130 },
  { e: 3, age: 260 },
]

const PUNCHES = [
  { who: 'Ravi K.', at: 'Chakan plant' },
  { who: 'Sneha P.', at: 'Gurugram HQ' },
  { who: 'Arif M.', at: 'Hosur unit 2' },
  { who: 'Lakshmi N.', at: 'Guindy branch' },
  { who: 'Gurpreet S.', at: 'Ludhiana mill' },
  { who: 'Anil Y.', at: 'Sanand warehouse' },
  { who: 'Kavitha R.', at: 'Whitefield office' },
  { who: 'Deepak T.', at: 'Andheri store' },
  { who: 'Farhan Q.', at: 'Salt Lake office' },
  { who: 'Pooja D.', at: 'Vizag yard' },
  { who: 'Manoj V.', at: 'Pimpri depot' },
  { who: 'Ayesha K.', at: 'Hitec City office' },
]

const HEADS = ['EPF', 'ESIC', 'PT', 'TDS']

/* The intro's calculation: the bar fills from 600ms and the run is ready at
 * 2100ms, the same moment the status label swaps. */
const INTRO_CALC = { at: 600, ms: 1500 }

/* ── Small helpers ───────────────────────────────────────────────────────── */

const noSubscribe = () => () => {}
const between = (min: number, max: number) => min + Math.random() * (max - min)
const fmt = (n: number) => n.toLocaleString('en-IN')

/** Indian money as a payroll screen shows it: crore above ₹1 Cr, else lakh. */
function inr(n: number) {
  return n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : `₹${(n / 1e5).toFixed(1)} L`
}

/** "now", "14s", "3m": the way an activity feed ages its rows. */
function ago(seconds: number) {
  if (seconds < 2) return 'now'
  if (seconds < 60) return `${Math.floor(seconds)}s`
  return `${Math.floor(seconds / 60)}m`
}

function d(ms: number) {
  return { '--d': `${ms}ms` } as React.CSSProperties
}

/** Next index in a list, never one of the last few, so a short visit does not
 *  see a record come round again. */
function useDeck(length: number, seen: number[] = [0]) {
  const recent = useRef<number[]>(seen)
  return () => {
    const avoid = new Set(recent.current.slice(-Math.min(5, length - 1)))
    let next = Math.floor(Math.random() * length)
    while (avoid.has(next)) next = (next + 1) % length
    recent.current.push(next)
    return next
  }
}

/** True while the cards should keep changing. */
function useLive(ref: React.RefObject<HTMLElement | null>) {
  const [live, setLive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let seen = false
    const update = () => setLive(seen && !document.hidden && !calm.matches)
    const io = new IntersectionObserver(
      ([entry]) => {
        seen = entry.isIntersecting
        update()
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', update)
    calm.addEventListener('change', update)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
      calm.removeEventListener('change', update)
    }
  }, [ref])
  return live
}

/** Runs `step` again and again while `live`, waiting `wait()` before each.
 *  The very first wait is `first`, so the intro keyframes finish untouched.
 *  Pausing keeps the record on screen; resuming picks up from it. */
function useTicker(live: boolean, first: number, wait: () => number, step: () => void) {
  const fns = useRef({ wait, step })
  useEffect(() => {
    fns.current = { wait, step }
  })
  const begun = useRef(false)
  useEffect(() => {
    if (!live) return
    let t = 0
    const loop = (ms: number) => {
      t = window.setTimeout(() => {
        fns.current.step()
        loop(fns.current.wait())
      }, ms)
    }
    loop(begun.current ? fns.current.wait() : first)
    begun.current = true
    return () => window.clearTimeout(t)
  }, [live, first])
}

/* ── Card chrome ─────────────────────────────────────────────────────────── */

function Chip({
  className,
  delay,
  float,
  children,
}: {
  className: string
  delay: number
  float: string
  children: React.ReactNode
}) {
  return (
    <div className={`absolute ${className}`}>
      <div data-h="card" style={d(delay)}>
        <div className="ez-bob" style={{ '--dur': float, '--bob': '-10px' } as React.CSSProperties}>
          <div className="ez-glass rounded-[18px] px-4 py-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** The intro's one-shot state change: both labels in the DOM, swapped by CSS. */
function Swap({ was, now, at }: { was: React.ReactNode; now: React.ReactNode; at: number }) {
  return (
    <span className="inline-grid">
      <span data-h="was" style={d(at)} className="[grid-area:1/1]">{was}</span>
      <span data-h="now" style={d(at + 120)} className="[grid-area:1/1]">{now}</span>
    </span>
  )
}

/** A value that rolls up into place whenever its key changes. */
function Roll({ k, delay = 0, children }: { k: React.Key; delay?: number; children: React.ReactNode }) {
  return (
    <span key={k} className="ez-roll" style={d(delay)}>
      {children}
    </span>
  )
}

const tick = (
  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
)

/* ── The cards ───────────────────────────────────────────────────────────── */

export function HeroLiveChips({ month: serverMonth }: { month: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const live = useLive(ref)

  /* Corrects a month baked in at build time without a hydration mismatch. */
  const month = useSyncExternalStore(noSubscribe, () => payrollMonth(Date.now()), () => serverMonth)

  /* Payroll + statutory: one run, two phases. */
  const nextRun = useDeck(RUNS.length)
  const [pay, setPay] = useState({ i: 0, n: 0, ready: true, calc: INTRO_CALC.ms })
  useTicker(
    live,
    5600,
    () => (pay.ready ? pay.calc : between(3600, 5000)),
    () =>
      setPay((p) =>
        p.ready ? { i: nextRun(), n: p.n + 1, ready: false, calc: Math.round(between(1300, 2000)) } : { ...p, ready: true },
      ),
  )

  /* Activity feed: newest first, four kept (three shown, one sliding out). */
  const nextEvent = useDeck(EVENTS.length, SEED.map((s) => s.e))
  const [feed, setFeed] = useState({
    n: 0,
    now: 0,
    items: SEED.map((s, id) => ({ id, e: s.e, at: -s.age * 1000 })),
  })
  useTicker(
    live,
    3400,
    () => between(2600, 4200),
    () =>
      setFeed((f) => {
        const now = Date.now()
        /* The seeds carry negative offsets; anchor them to the real clock on
           the first event so their ages carry on from what was shown. */
        const items = f.n === 0 ? f.items.map((it) => ({ ...it, at: now - 3000 + it.at })) : f.items
        return { n: f.n + 1, now, items: [{ id: f.n + SEED.length, e: nextEvent(), at: now }, ...items].slice(0, 4) }
      }),
  )

  /* Punches: the clock never goes backwards, even with the jitter. */
  const nextPunch = useDeck(PUNCHES.length)
  const lastPunch = useRef(0)
  const [punch, setPunch] = useState({ i: 0, n: 0, time: '' })
  /* The opening punch shows the real time in India from the first client
     render, so the card never jumps from a placeholder to "now". The server
     and the no-JS page keep 09:41. */
  const openingClock = useSyncExternalStore(noSubscribe, () => istClock(Date.now()), () => '09:41')
  useEffect(() => {
    lastPunch.current = Date.now()
  }, [])
  useTicker(
    live,
    2200,
    () => between(2200, 3400),
    () => {
      const at = Math.max(lastPunch.current, Date.now() - between(0, 40_000))
      lastPunch.current = at
      setPunch((p) => ({ i: nextPunch(), n: p.n + 1, time: istClock(at) }))
    },
  )

  const run = RUNS[pay.i]
  const payout = inr(run.people * run.avg)
  const who = PUNCHES[punch.i]
  const clock = punch.n === 0 ? openingClock : punch.time

  const ready = <span className="text-emerald-700">● Ready for review · {payout}</span>
  const calculating = <span className="text-amber-700">● Calculating {fmt(run.people)} payslips</span>

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {/* ── Payroll ─────────────────────────────────────────────────────── */}
      <Chip className="left-[-4%] top-[8%]" delay={500} float="7s">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-500">Payroll · {month}</p>
        <p className="ez-num mt-1 min-w-[13rem] text-[0.92rem] font-semibold text-ink-900">
          <Roll k={pay.n}>
            {fmt(run.people)} people · {run.sites} {run.sites === 1 ? 'location' : 'locations'}
          </Roll>
        </p>
        <p className="ez-num mt-1.5 text-[0.74rem] font-semibold">
          {pay.n === 0 ? (
            <Swap at={INTRO_CALC.at + INTRO_CALC.ms} was={calculating} now={ready} />
          ) : (
            <Roll k={`${pay.n}${pay.ready}`}>{pay.ready ? ready : calculating}</Roll>
          )}
        </p>
        <span className="mt-2 block h-1 overflow-hidden rounded-full bg-ink-900/[0.06]">
          <span
            key={pay.n}
            data-h="fill"
            className={`block h-full rounded-full transition-colors duration-500 ${pay.ready && pay.n > 0 ? 'bg-emerald-500' : 'bg-brand-600'}`}
            style={
              {
                '--d': `${pay.n === 0 ? INTRO_CALC.at : 0}ms`,
                '--dur': `${pay.calc}ms`,
              } as React.CSSProperties
            }
          />
        </span>
      </Chip>

      {/* ── Activity ────────────────────────────────────────────────────── */}
      <Chip className="right-[-3%] top-[29%]" delay={700} float="8.5s">
        <p className="flex items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-500">
          <span className="relative grid h-1.5 w-1.5 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Activity · Today
        </p>
        <div className="mt-1.5 h-[5.5rem] w-[13.75rem] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] sm:h-[8.25rem] sm:w-[15.5rem]">
          <ul key={feed.n} className={feed.n > 0 ? 'ez-feed-push' : undefined} style={{ '--row': '2.75rem' } as React.CSSProperties}>
            {feed.items.map((it, idx) => {
              const ev = EVENTS[it.e]
              const k = KINDS[ev.kind]
              const age = feed.n === 0 ? -it.at / 1000 : (feed.now - it.at) / 1000
              return (
                <li
                  key={it.id}
                  className={`flex h-[2.75rem] items-center gap-2.5 ${idx === 0 && feed.n > 0 ? 'ez-feed-new' : ''}`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${k.tile}`}>
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={k.icon} />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-[0.76rem] font-semibold text-ink-900">{ev.title}</span>
                    <span className="block truncate text-[0.68rem] font-medium text-ink-500">{ev.meta}</span>
                  </span>
                  <span className="ez-num shrink-0 self-start pt-1.5 text-[0.62rem] font-medium text-ink-400">{ago(age)}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </Chip>

      {/* ── Punched in ──────────────────────────────────────────────────── */}
      <Chip className="bottom-[3%] left-[2%] sm:bottom-[14%]" delay={900} float="6.5s">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 36 36" className="h-10 w-10 shrink-0 -rotate-90" aria-hidden="true">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(11 22 51 / .08)" strokeWidth="3" />
            <circle
              key={punch.n}
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="100 100"
              className="ez-punch-ring"
              style={d(punch.n === 0 ? 1100 : 0)}
            />
          </svg>
          <div className="min-w-[7.5rem]">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-500">Punched in</p>
            <p className="ez-num font-display text-[1.35rem] font-[680] leading-none tracking-[-0.03em] text-ink-900 [font-stretch:110%]">
              <Roll k={clock}>{clock}</Roll>
            </p>
            <p className="mt-1 whitespace-nowrap text-[0.68rem] font-medium text-ink-500">
              <Roll k={punch.n} delay={60}>
                {who.who} · {who.at}
              </Roll>
            </p>
          </div>
        </div>
      </Chip>

      {/* ── Statutory heads, following payroll. Off on phones: five cards do
          not fit a 340px globe, and the payroll card already says ready. ── */}
      <Chip className="bottom-[2%] right-[8%] hidden sm:block" delay={1100} float="9s">
        <div className="flex items-center gap-1.5">
          {HEADS.map((h, i) => {
            const done = pay.ready
            return (
              <span
                key={h}
                className={`inline-flex items-center gap-1 rounded-full py-1 pl-1 pr-2 text-[0.7rem] font-semibold transition-colors duration-300 ${
                  done ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-900/[0.04] text-ink-500'
                }`}
                style={done ? { transitionDelay: `${i * 110}ms` } : undefined}
              >
                {done ? (
                  <span
                    key={pay.n}
                    data-h="tick"
                    style={d(pay.n === 0 ? INTRO_CALC.at + INTRO_CALC.ms + i * 110 : i * 110)}
                    className="grid h-4 w-4 place-items-center rounded-full bg-emerald-600 text-white"
                  >
                    {tick}
                  </span>
                ) : (
                  <span
                    className="ez-spin h-4 w-4 rounded-full border-2 border-ink-900/10 border-t-amber-600"
                    style={{ '--dur': '0.9s' } as React.CSSProperties}
                  />
                )}
                {h}
              </span>
            )
          })}
        </div>
      </Chip>
    </div>
  )
}
