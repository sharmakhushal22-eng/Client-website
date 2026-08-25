'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

/* NOTE: this component deliberately does NOT import site.config.
 *
 * It is a client component, so anything it imports is bundled and shipped to
 * the browser — a `pricing.disclosed` check around the render would hide the
 * number on screen while leaving it readable in the JS chunk. Every value it
 * needs arrives as a prop, resolved on the server, so an undisclosed rate is
 * never serialised at all. */

/* ============================================================================
 * Headcount calculator.
 *
 * One plan means this stops being a tier-comparison widget and becomes what a
 * buyer actually wants: "what will this cost me, and what is it replacing?"
 *
 * Deliberately indicative rather than a quote. It multiplies headcount by the
 * rate, applies the minimum, and shows the annual figure. It does not pretend
 * to know about multi-entity scope, and it says so — a calculator that
 * produces a number the sales call then contradicts costs more trust than it
 * wins.
 * ========================================================================= */

const MIN = 25
const MAX = 2000
const STEP = 25

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

export function PricingCalculator({
  rate,
  minEmployees,
  annualDiscountPct,
  gstNote,
  planName,
}: {
  /* null while pricing is undisclosed — the number never reaches the client. */
  rate: number | null
  minEmployees: number
  annualDiscountPct: number
  gstNote: string
  planName: string
}) {
  const [headcount, setHeadcount] = useState(250)
  const [annual, setAnnual] = useState(true)

  const figures = useMemo(() => {
    if (rate === null) return null

    /* Monthly billing costs more; the configured discount is what annual
     * billing saves, so the monthly rate is grossed back up from it. */
    const effectiveRate = annual
      ? rate
      : Math.round(rate / (1 - annualDiscountPct / 100))

    /* The minimum is a floor on billable headcount, not on price — a
     * 30-employee company on a 50-employee minimum pays for 50. */
    const billable = Math.max(headcount, minEmployees)
    const monthlyCost = billable * effectiveRate

    /* What annual billing saves against paying monthly for the same year. */
    const monthlyRate = Math.round(rate / (1 - annualDiscountPct / 100))
    const annualSaving = billable * (monthlyRate - rate) * 12

    return {
      effectiveRate,
      billable,
      monthlyCost,
      annualCost: monthlyCost * 12,
      perEmployeePerDay: effectiveRate / 30,
      belowMinimum: headcount < minEmployees,
      annualSaving,
    }
  }, [headcount, annual, rate, minEmployees, annualDiscountPct])

  return (
    <div className="mx-auto max-w-4xl rounded-3xl bg-surface p-6 shadow-xl shadow-ink-900/5 ring-1 ring-ink-200 sm:p-10">
      {/* ── Headcount ──────────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label htmlFor="headcount" className="text-base font-bold text-ink-900">
            How many employees do you have?
          </label>
          <output
            htmlFor="headcount"
            className="text-3xl font-bold tabular-nums text-brand-600"
          >
            {headcount.toLocaleString('en-IN')}
            {headcount === MAX && '+'}
          </output>
        </div>

        <input
          id="headcount"
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={headcount}
          onChange={(e) => setHeadcount(Number(e.target.value))}
          className="mt-5 w-full"
          aria-valuetext={`${headcount} employees`}
        />
        <div className="mt-2 flex justify-between text-xs text-ink-400">
          <span>{MIN}</span>
          <span>{MAX.toLocaleString('en-IN')}+</span>
        </div>
      </div>

      {/* ── Billing toggle ─────────────────────────────────────────────── */}
      <fieldset className="mt-8">
        <legend className="sr-only">Billing cycle</legend>
        <div className="inline-flex rounded-xl bg-ink-100 p-1">
          {[
            { value: false, label: 'Monthly' },
            { value: true, label: `Annual — save ${annualDiscountPct}%` },
          ].map((option) => (
            <label
              key={String(option.value)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600 ${
                annual === option.value
                  ? 'bg-surface text-ink-900 shadow-sm'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              <input
                type="radio"
                name="billing"
                className="sr-only"
                checked={annual === option.value}
                onChange={() => setAnnual(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ── The number ─────────────────────────────────────────────────── */}
      {figures === null ? (
        /* Undisclosed. The slider still works and still asks the qualifying
           question — we just cannot answer it on the page yet, and we say so
           rather than showing a blurred rectangle with no explanation. */
        <div className="mt-8 rounded-2xl bg-brand-50 p-7 text-center ring-1 ring-brand-100 sm:p-9">
          <p className="flex items-baseline justify-center gap-1.5">
            <span
              aria-hidden="true"
              className="select-none text-4xl font-bold text-brand-600 blur-[7px]"
            >
              &#8377;&#8226;&#8226;,&#8226;&#8226;&#8226;
            </span>
            <span className="text-sm text-ink-500">/ month</span>
          </p>

          <p className="mt-4 text-base font-bold text-ink-900">
            Your number for {headcount.toLocaleString('en-IN')} employees is a
            question, not a secret.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
            We have not published the rate yet. Tell us your headcount, states
            and entities and you get it in writing the same day — priced on what
            you actually run, which is more useful than a list price anyway.
          </p>

          <span className="sr-only">
            Pricing is not published yet. Book a demo for a written quote.
          </span>
        </div>
      ) : (
      <>
      <div className="mt-8 grid gap-4 sm:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-brand-600 p-6 text-on-accent sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-200">
            {planName} · everything included
          </p>

          <p className="mt-3">
            <span className="text-4xl font-bold tabular-nums">
              {inr(figures.monthlyCost)}
            </span>
            <span className="ml-1.5 text-sm text-brand-200">/ month</span>
          </p>

          <p className="mt-1.5 text-sm text-brand-100">
            {inr(figures.effectiveRate)} × {figures.billable.toLocaleString('en-IN')}{' '}
            employees
          </p>

          {figures.belowMinimum && (
            <p className="mt-2 text-xs text-brand-200">
              Billed at the {minEmployees}-employee minimum.
            </p>
          )}

          <p className="mt-4 border-t border-white/20 pt-4 text-sm text-brand-100">
            {inr(figures.annualCost)} a year, all in. No implementation fee, no
            per-module charge.
          </p>
        </div>

        {/* The reframe that closes the objection: per employee per day. */}
        <div className="flex flex-col justify-center rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
            Another way to read it
          </p>
          <p className="mt-3">
            <span className="text-3xl font-bold tabular-nums text-ink-900">
              ₹{figures.perEmployeePerDay.toFixed(2)}
            </span>
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
            per employee, per day — to run their payroll, hold their statutory
            record and answer their questions without HR.
          </p>
        </div>
      </div>

      {annual && figures.annualSaving > 0 && (
        <p className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-800">
          <Icon name="check" className="h-4 w-4 shrink-0" />
          Annual billing saves about {inr(figures.annualSaving)} a year at this
          headcount.
        </p>
      )}

      <p className="mt-6 text-center text-sm leading-relaxed text-ink-500">
        Indicative only. {gstNote} Every module is in the figure above —
        what is quoted on the call is migration scope for unusual setups, not a
        longer feature list.
      </p>
      </>
      )}

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/book-a-demo" size="lg">
          Get an exact quote
          <Icon name="arrow-right" className="h-4 w-4" />
        </Button>
        <Button href="/contact" variant="secondary" size="lg">
          Ask a question first
        </Button>
      </div>
    </div>
  )
}
