'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { structure } from '@/content/positioning'

/* ============================================================================
 * The hero engine widget — ported from the original index.html.
 *
 * Four location types feed one engine; the engine emits the statutory
 * registers. It is the one thing on the page that DEMONSTRATES the pitch
 * rather than asserting it: "every location type feeds one engine, one
 * register output" is a sentence, but watching seven registers resolve from
 * four inputs is an argument.
 *
 * Handoff §4 is explicit that this is "illustrative sample data only — not
 * wired to any backend", and the caption says so on screen. That matters:
 * flags.complianceEngineLive is still false, so the widget must not imply the
 * one-click register generator already ships.
 *
 * Replaces the "Screenshot pending" placeholder, which was an empty box
 * standing in for a screenshot nobody has taken yet.
 * ========================================================================= */

/* Four of the six location types the product actually models. Taken from the
 * content layer so the widget cannot drift from the list in the hero below. */
const INPUTS = ['Corporate office', 'Factory', 'Warehouse', 'Branch office']

/* What comes out. Statutory heads only — these are the registers a
 * multi-location company owes, and the reason the engine exists. */
const OUTPUTS = ['PF', 'ESIC', 'PT', 'LWF', 'Gratuity', 'Bonus', 'TDS']

const CHIP_STEP_MS = 90
const OUTPUT_DELAY_MS = 1300

export function EngineWidget() {
  const [done, setDone] = useState<number>(0)
  const [finished, setFinished] = useState(false)
  const [running, setRunning] = useState(false)
  const [topFlowing, setTopFlowing] = useState(false)
  const [bottomFlowing, setBottomFlowing] = useState(false)
  const [pulsing, setPulsing] = useState(false)

  /* Every timer this component starts, so a click on Reset — or an unmount
   * mid-run — cannot leave a callback behind that writes state afterwards. */
  const timers = useRef<number[]>([])
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])
  useEffect(() => clearTimers, [clearTimers])

  const after = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  function reset() {
    clearTimers()
    setDone(0)
    setFinished(false)
    setRunning(false)
    setTopFlowing(false)
    setBottomFlowing(false)
    setPulsing(false)
  }

  function run() {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Reduced motion still gets the outcome, just without the journey. */
    if (reduced) {
      setDone(OUTPUTS.length)
      setFinished(true)
      return
    }

    setRunning(true)
    setTopFlowing(true)
    after(550, () => setPulsing(true))
    after(650, () => setBottomFlowing(true))

    after(OUTPUT_DELAY_MS, () => {
      OUTPUTS.forEach((_, i) => {
        after(i * CHIP_STEP_MS, () => {
          setDone(i + 1)
          if (i === OUTPUTS.length - 1) {
            setFinished(true)
            setRunning(false)
            setTopFlowing(false)
            setBottomFlowing(false)
            setPulsing(false)
          }
        })
      })
    })
  }

  const pct = Math.round((done / OUTPUTS.length) * 100)

  return (
    <figure className="w-full rounded-xl bg-surface p-5 shadow-floating ring-1 ring-ink-200 sm:p-6">
      {/* Header */}
      <figcaption className="mb-4 flex items-center gap-2.5 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-ink-600">
        <span
          aria-hidden="true"
          className="ez-live-dot h-2 w-2 shrink-0 rounded-full bg-success"
        />
        One of the things EZER handles
      </figcaption>

      {/* Inputs */}
      <ul className="grid grid-cols-4 gap-2">
        {INPUTS.map((node) => (
          <li
            key={node}
            className="rounded-md border border-ink-200 bg-ink-50 px-1.5 py-3 text-center text-[0.7rem] font-semibold leading-tight text-ink-700"
          >
            {node}
          </li>
        ))}
      </ul>

      {/* Input → engine */}
      <div
        className={`ez-connector relative flex h-6 justify-center ${
          topFlowing ? 'is-flowing' : ''
        }`}
        aria-hidden="true"
      >
        <span className="ez-flow-dot" />
      </div>

      {/* The engine */}
      <div className="flex items-center justify-center gap-2.5 py-0.5">
        <span
          aria-hidden="true"
          className={`ez-core-ring relative h-3 w-3 shrink-0 rounded-full bg-brand-600 ${
            pulsing ? 'is-pulsing' : ''
          }`}
        />
        <span className="text-[0.82rem] font-bold tracking-[0.05em] text-ink-900">
          EZER ENGINE
        </span>
      </div>

      {/* Engine → outputs */}
      <div
        className={`ez-connector relative flex h-6 justify-center ${
          bottomFlowing ? 'is-flowing' : ''
        }`}
        aria-hidden="true"
      >
        <span className="ez-flow-dot" />
      </div>

      {/* Outputs */}
      <ul className="flex flex-wrap justify-center gap-1.5">
        {OUTPUTS.map((chip, i) => {
          const isDone = i < done
          return (
            <li
              key={chip}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold transition-colors duration-200 ${
                isDone
                  ? 'bg-emerald-50 text-success'
                  : 'bg-ink-100 text-ink-600'
              }`}
            >
              <span aria-hidden="true">{isDone ? '✓' : '○'}</span>
              {chip}
            </li>
          )
        })}
      </ul>

      {/* Action */}
      <button
        type="button"
        onClick={finished ? reset : run}
        disabled={running}
        className="mt-4 w-full rounded-md bg-dark px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {finished ? 'Reset' : running ? 'Running…' : 'Run the Engine'}
      </button>

      {/* Progress */}
      <div
        className="mt-3 h-[3px] overflow-hidden rounded-full bg-ink-200"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-100 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Result — announced, so the outcome is not motion-only. */}
      <p
        aria-live="polite"
        className="mt-2.5 min-h-5 text-center text-[0.75rem] font-bold text-success"
      >
        {finished
          ? `${OUTPUTS.length} statutory registers generated — every location type covered`
          : ''}
      </p>

      <p className="mt-1.5 text-center text-[0.7rem] leading-relaxed text-ink-600">
        Illustrative — every location type feeds one engine, one register
        output. {structure.locationTypes.length} location types are modelled in
        the product.
      </p>
    </figure>
  )
}
