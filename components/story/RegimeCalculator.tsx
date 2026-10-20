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
 * old-regime exemptions, same ₹12,500 old-regime rebate. Tax year 2026-27
 * under the Income-tax Act, 2025, which kept these slabs. Marginal relief
 * just above ₹12L is applied, so the new-regime line never jumps. It is deliberately simple
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
  /* Marginal relief: just above ₹12L, tax may not exceed the income above it. */
  else tax = Math.min(tax, income - 1_200_000)
  return Math.round(tax * 1.04)
}

/** Old regime: ₹50,000 standard deduction plus the ₹2,00,000 of exemptions the
 *  caption declares, the legacy slabs, the rebate to ₹5L, then 4% cess. */
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
      <div className="rounded-[26px] bg-white p-6 shadow-[0_1px_2px_rgb(11_22_51/0.05),0_40px_80px_-40px_rgb(11_22_51/0.35)] ring-1 ring-ink-900/[0.06] sm:p-8">
        <label
          htmlFor={sliderId}
          className="ez-kicker flex flex-wrap items-baseline justify-between gap-2 text-ink-500"
        >
          Annual CTC
          {/* tabular-nums so the figure does not jitter sideways as it
              changes — the eye reads a shifting number as a glitch. */}
          <span className="font-display text-[1.6rem] font-[680] normal-case tracking-[-0.03em] tabular-nums text-ink-900 [font-stretch:108%]">
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
          className="ez-range mt-5 w-full"
          /* The filled portion of the track is painted from this custom
             property; the rules live in globals.css under
             input[type='range'].ez-range. */
          style={{ '--ez-range-pct': `${pct}%` } as React.CSSProperties}
        />

        <div className="mt-2 flex justify-between text-[0.75rem] font-medium tabular-nums text-ink-500">
          <span>{inr(MIN)}</span>
          <span>{inr(MAX)}</span>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {([
            ['Old regime', oldTax, winner === 'old'],
            ['New regime', newTax, winner === 'new'],
          ] as const).map(([label, amount, isWinner]) => (
            <div
              key={label}
              className={
                'rounded-[18px] p-5 transition-colors duration-300 ' +
                (isWinner ? 'bg-brand-50 ring-2 ring-brand-600' : 'bg-paper ring-1 ring-ink-900/[0.06]')
              }
            >
              <span className="ez-kicker block text-ink-500">{label}</span>
              <span className="mt-2 block font-display text-[1.7rem] font-[680] leading-none tracking-[-0.03em] tabular-nums text-ink-900 [font-stretch:108%] sm:text-[1.9rem]">
                {inr(amount)}
              </span>
              <span className="mt-1.5 block text-[0.78rem] text-ink-500">tax for the year</span>
            </div>
          ))}
        </div>

        {/* aria-live, because the numbers above change without the focus
            moving — a keyboard user arrowing the slider would otherwise get
            no feedback at all. */}
        <p
          aria-live="polite"
          className="mt-4 rounded-full bg-ink-900 px-5 py-3 text-center text-[0.95rem] font-semibold text-white"
        >
          {verdict}
        </p>
      </div>

      <figcaption className="mt-3 text-[0.85rem] leading-relaxed text-ink-500">
        {taxCalculator.illustrativeNote}
      </figcaption>
    </figure>
  )
}
