'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

/* ============================================================================
 * The leave story, played rather than pinned.
 *
 * This used to hold the screen for four scroll-lengths while the steps
 * changed underneath. A first-time visitor could not tell that scrolling
 * moved the story on, so the page felt stuck. Now the scene scrolls like any
 * other, and the story plays itself while it is on screen:
 *
 *   • each step's line fills over STEP_MS, then the next step starts, and
 *     after the fourth it begins again;
 *   • every step is a button, so anyone can jump straight to one;
 *   • it pauses while the pointer is over it or focus is inside it, and the
 *     pause button holds it (WCAG 2.2.2, moving content longer than 5s);
 *   • with prefers-reduced-motion it never plays by itself;
 *   • a request token travels from the phone to whoever holds it next.
 *
 * The step change itself is the same as before: data-step on the stage and
 * .is-on toggled on every [data-show] that lists the step, so the product
 * cards cross-fade exactly as they did. The timing runs on a CSS animation
 * (the filling line) and advances on its animationend, so pausing is exact
 * and costs nothing while idle.
 * ========================================================================= */

export type StoryStep = { who: string; title: string; body: string }

const STEP_MS = 3000

/* prefers-reduced-motion, read live and without an effect. */
const REDUCE = '(prefers-reduced-motion: reduce)'
const subscribeReduce = (cb: () => void) => {
  const m = window.matchMedia(REDUCE)
  m.addEventListener('change', cb)
  return () => m.removeEventListener('change', cb)
}
const useReducedMotion = () =>
  useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false)

export function StoryPlayer({ steps, picture }: { steps: StoryStep[]; picture: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [visible, setVisible] = useState(false)
  const [held, setHeld] = useState(false) // pointer over / focus inside
  const [paused, setPaused] = useState(false) // the button
  const reduced = useReducedMotion()

  const running = visible && !held && !paused && !reduced

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && e.intersectionRatio > 0.45), {
      threshold: [0, 0.45, 0.6],
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Same contract as before: data-step on the stage, .is-on on [data-show].
  useEffect(() => {
    const el = root.current
    if (!el) return
    el.setAttribute('data-step', String(step))
    el.querySelectorAll<HTMLElement>('[data-show]').forEach((p) => {
      p.classList.toggle('is-on', (p.dataset.show ?? '').split(' ').includes(String(step)))
    })
  }, [step])

  const next = useCallback(() => setStep((s) => (s % steps.length) + 1), [steps.length])

  return (
    <div
      ref={root}
      className="ez-stage ez-story grid h-full grid-cols-12 items-center gap-8 pb-10 pt-24"
      data-running={running ? '' : undefined}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false)
      }}
    >
      <div className="col-span-5">
        <p className="ez-kicker flex items-center gap-2.5 text-ink-500">
          <span aria-hidden="true" className="ez-story-live" />
          One leave request, start to finish
        </p>
        <h2 id="story-title" className="mt-5 text-[min(3.4vw,6vh)] leading-[1.02]">
          Here is what
          <br />
          <span className="text-brand-600">easier looks like.</span>
        </h2>

        <ol className="mt-8 border-l border-ink-900/10" aria-label="The four steps">
          {steps.map((s, i) => {
            const n = i + 1
            const on = n === step
            const done = n < step
            return (
              <li key={s.who} className="relative">
                {/* The line beside each step: full when done, filling while
                    it plays, empty after. Its animationend moves the story on. */}
                <span aria-hidden="true" className="absolute -left-px top-0 h-full w-[2px] overflow-hidden">
                  <span
                    key={on ? `run-${step}` : `idle-${n}`}
                    className={`ez-story-line block w-full ${done ? 'is-done' : on ? 'is-on' : ''}`}
                    style={{ '--story-ms': `${STEP_MS}ms` } as React.CSSProperties}
                    onAnimationEnd={on ? next : undefined}
                  />
                </span>
                <button
                  type="button"
                  aria-current={on ? 'step' : undefined}
                  onClick={() => setStep(n)}
                  className="group block w-full py-2.5 pl-6 text-left"
                >
                  <span className="ez-kicker flex items-center gap-3 text-ink-500">
                    <span className={`ez-num grid h-6 w-6 place-items-center rounded-full text-[0.66rem] font-semibold tracking-normal transition-colors duration-300 ${on || done ? 'bg-brand-600 text-white' : 'bg-ink-900/[0.07] text-ink-500 group-hover:bg-ink-900/15'}`}>{n}</span>
                    {s.who}
                  </span>
                  <span className={`mt-1.5 block font-display text-[1.25rem] font-[650] leading-[1.15] tracking-[-0.03em] transition-colors duration-300 [font-stretch:106%] ${on ? 'text-ink-900' : 'text-ink-400 group-hover:text-ink-700'}`}>
                    {s.title}
                  </span>
                </button>
                <div className={`ez-story-body grid pl-6 ${on ? 'is-open' : ''}`}>
                  <p className="overflow-hidden text-[0.98rem] leading-relaxed text-ink-600">
                    <span className="block pb-3">{s.body}</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-5 flex items-center gap-3 text-[0.8rem] text-ink-500">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="ez-press inline-flex h-8 items-center gap-2 rounded-full bg-white px-3 font-semibold text-ink-800 ring-1 ring-ink-900/10 hover:ring-ink-900/25"
          >
            {paused ? (
              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><path d="M3 1.5v9l7-4.5z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>
            )}
            {paused ? 'Play' : 'Pause'}
          </button>
          <span>{reduced ? 'Choose a step to see it.' : 'Plays by itself. Choose any step to jump.'}</span>
        </div>
      </div>

      <div className="col-span-7">
        <div className="relative">
          {picture}
          {/* The request, travelling one hand further on every step. */}
          <svg key={step} aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <path className="ez-story-path" d="M 40 58 C 44 34, 52 30, 55 44" fill="none" stroke="#2563eb" strokeWidth="0.45" strokeDasharray="1.2 1.4" vectorEffect="non-scaling-stroke" />
          </svg>
          <span key={`t-${step}`} aria-hidden="true" className="ez-story-token">
            <span className="sr-only">Request moved</span>
          </span>
        </div>
        <p className="mt-3 text-right text-[0.72rem] text-ink-400">Illustrative · sample data</p>
      </div>
    </div>
  )
}
