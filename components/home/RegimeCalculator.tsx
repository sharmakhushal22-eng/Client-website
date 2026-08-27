'use client'

import { useId, useMemo, useState } from 'react'
import { taxCalculator } from '@/content/positioning'

/* ============================================================================
 * The old-vs-new regime calculator — a WORKING widget, not a picture of one.
 *
 * This replaced a static SVG mockup sitting in <Illustration>. The mockup was
 * honest about being a drawing, but it was the wrong answer for this section:
 * the whole argument here is "your employees get to see the number on their
 * own salary before they commit", and a drawing of a comparison cannot make
 * that argument — a reader has to take it on faith. Dragging the slider and
 * watching the crossover move IS the pitch.
 *
 * THE ARITHMETIC IS THE REFERENCE'S, unchanged — same slabs, same standard
 * deductions, same ₹12L rebate cutoff, same 4% cess, same ₹2,00,000 assumed
 * old-regime exemptions, same ₹12,500 87A rebate. It is deliberately simple
 * and deliberately labelled illustrative: it ignores surcharge, and it assumes
 * one flat exemption figure that every real employee will differ from. The
 * caption underneath says so, and that caption is not optional decoration —
 * it is what keeps this a demonstration rather than tax advice.
 *
 * No slider library. One <input type="range"> is accessible for free:
 * keyboard-operable, announced with its value, and it works before the JS
 * that styles it arrives.
 * ========================================================================= */

const MIN = 400_000
const MAX = 4_000_000
const STEP = 100_000
const DEFAULT = 1_200_000

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

/** New regime, per the reference: ₹75,000 standard deduction, the 2025 Act's
 *  slab ladder, full rebate to ₹12L of taxable income, then 4% cess. */
function newRegimeTax(gross: number) {
  const income = Math.max(0, gross - 75_000)
  const slabs: [number, number][] = [
    [400_000, 0], [400_000, 0.05], [400_000, 0.1], [400_000, 0.15],
    [400_000, 0.2], [400_000, 0.25], [Infinity, 0.3],
  ]
  let tax = 0
  let remaining = income
  for (const [amt, rate] of slabs) {
    const t = Math.min(remaining, amt)
    tax += t * rate
    remaining -= t
    if (remaining <= 0) break
  }
  if (income <= 1_200_000) tax = 0
  return Math.round(tax * 1.04)
}

/** Old regime: ₹50,000 standard deduction plus the ₹2,00,000 of exemptions the
 *  caption declares, the legacy slabs, the §87A rebate, then 4% cess. */
function oldRegimeTax(gross: number) {
  const taxable = Math.max(0, gross - 50_000 - 200_000)
  const slabs: [number, number][] = [
    [250_000, 0], [250_000, 0.05], [500_000, 0.2], [Infinity, 0.3],
  ]
  let tax = 0
  let remaining = taxable
  for (const [amt, rate] of slabs) {
    const t = Math.min(remaining, amt)
    tax += t * rate
    remaining -= t
    if (remaining <= 0) break
  }
  if (taxable <= 500_000) tax = Math.max(0, tax - 12_500)
  return Math.round(tax * 1.04)
}

export function RegimeCalculator() {
  const [ctc, setCtc] = useState(DEFAULT)
  const sliderId = useId()

  const { oldTax, newTax, verdict, winner } = useMemo(() => {
    const o = oldRegimeTax(ctc)
    const n = newRegimeTax(ctc)
    const diff = o - n
    return {
      oldTax: o,
      newTax: n,
      winner: diff > 0 ? 'new' : diff < 0 ? 'old' : 'tie',
      verdict:
        diff > 0
          ? `New regime saves ${inr(diff)} / year`
          : diff < 0
            ? `Old regime saves ${inr(-diff)} / year`
            : 'Both regimes land the same here',
    }
  }, [ctc])

  const pct = ((ctc - MIN) / (MAX - MIN)) * 100

  return (
    <figure className="w-full">
      <div className="rounded-2xl bg-[#132344] p-6 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.9)] ring-1 ring-[#8296be] sm:p-7">
        <label
          htmlFor={sliderId}
          className="flex flex-wrap items-baseline justify-between gap-2 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-brand-200"
        >
          Annual CTC
          {/* tabular-nums so the figure does not jitter sideways as it
              changes — the eye reads a shifting number as a glitch. */}
          <span className="text-[1.35rem] font-extrabold normal-case tracking-normal tabular-nums text-white">
            {inr(ctc)}
          </span>
        </label>

        <input
          id={sliderId}
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={ctc}
          onChange={(e) => setCtc(Number(e.target.value))}
          aria-label="Annual CTC"
          aria-valuetext={inr(ctc)}
          className="ez-range mt-4 w-full"
          /* The filled portion of the track is painted from this custom
             property rather than a second element, so there is nothing to
             keep in sync with the thumb. The matching rules live in
             globals.css under `input[type='range'].ez-range` — see the note
             there for why the selector is qualified that way. */
          style={{ '--ez-range-pct': `${pct}%` } as React.CSSProperties}
        />

        <div className="mt-2 flex justify-between text-[0.72rem] font-semibold tabular-nums text-on-dark-faint">
          <span>{inr(MIN)}</span>
          <span>{inr(MAX)}</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {([
            ['Old Regime', oldTax, winner === 'old'],
            ['New Regime', newTax, winner === 'new'],
          ] as const).map(([label, amount, isWinner]) => (
            <div
              key={label}
              className={
                'rounded-xl p-4 text-center transition-colors duration-300 ' +
                (isWinner
                  ? 'bg-brand-600/25 ring-1 ring-brand-300'
                  : 'bg-white/5 ring-1 ring-white/15')
              }
            >
              <span className="block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-brand-200">
                {label}
              </span>
              <span className="mt-1.5 block text-[1.6rem] font-extrabold leading-none tabular-nums text-white sm:text-[1.8rem]">
                {inr(amount)}
              </span>
            </div>
          ))}
        </div>

        {/* aria-live, because the numbers above change without the focus
            moving — a keyboard user arrowing the slider would otherwise get
            no feedback at all. One polite region for the verdict rather than
            three, so it announces a sentence instead of three loose figures. */}
        <p
          aria-live="polite"
          className="mt-4 rounded-xl bg-brand-600 px-4 py-3 text-center text-[0.95rem] font-bold text-white"
        >
          {verdict}
        </p>
      </div>

      <figcaption className="mt-3 text-sm leading-relaxed text-on-dark-muted">
        {taxCalculator.illustrativeNote}
      </figcaption>
    </figure>
  )
}
