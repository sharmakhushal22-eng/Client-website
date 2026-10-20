import { cn } from '@/lib/cn'
import { Doodle, type DoodleKind } from '@/components/graphics/Doodles'
import { PhoneLeave, AttendanceCard } from './LeaveStoryParts'

/* ============================================================================
 * The product picture at the top of each feature page.
 *
 * Drawn in HTML, in the same hand as the home page's cards, so the site's
 * product pictures are one family and stay sharp at any size. Each shows a
 * capability the page itself documents (content/features.ts), with sample
 * data that is internally consistent:
 *
 *   payroll   a payslip for a Pune employee. Basic ₹30,000, HRA at 40% (Pune
 *             is non-metro), gross ₹57,500. Code wages (Basic + special)
 *             are ₹45,500, over half of pay, so no add-back. EPF 12% on the
 *             ₹25,000 wage ceiling in force from 17 Sept 2026 = ₹3,000.
 *             ESIC does not apply above the ₹21,000 ceiling. Maharashtra PT
 *             ₹200. TDS nil (new regime, under the rebate). Net ₹54,300.
 *   attendance  the punch and the attendance week from the leave story
 *   recruitment the seven-step offer flow, part way through
 *   ess       the employee's phone: leave, with the balance on screen
 *   claims    a local trip with the fare calculated, and an outstation
 *             claim moving from the reporting manager to Finance
 *
 * Every picture is role="img" with a single description, and carries the
 * "Illustrative · sample data" line beneath it.
 * ========================================================================= */

const card =
  'rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgb(11_22_51/0.06),0_34px_70px_-34px_rgb(11_22_51/0.42)] ring-1 ring-ink-900/[0.07] sm:p-6'

function Pill({ tone, children }: { tone: 'wait' | 'done' | 'info' | 'stop'; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.7rem] font-semibold',
        tone === 'done' && 'bg-emerald-50 text-emerald-700',
        tone === 'wait' && 'bg-amber-50 text-amber-700',
        tone === 'info' && 'bg-brand-50 text-brand-700',
        tone === 'stop' && 'bg-red-50 text-red-600',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          tone === 'done' && 'bg-emerald-600',
          tone === 'wait' && 'bg-amber-700',
          tone === 'info' && 'bg-brand-600',
          tone === 'stop' && 'bg-red-600',
        )}
      />
      {children}
    </span>
  )
}

function Payslip() {
  const earn: [string, string][] = [
    ['Basic', '30,000'],
    ['HRA · 40% of basic', '12,000'],
    ['Special allowance', '15,500'],
  ]
  const ded: [string, string, string][] = [
    ['EPF', '3,000', '12% of the ₹25,000 wage ceiling'],
    ['ESIC', '0', 'Gross above ₹21,000, not covered'],
    ['Professional Tax', '200', 'Maharashtra slab'],
    ['TDS', '0', 'New regime, projected under rebate'],
  ]
  return (
    <div className={card}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="ez-kicker text-ink-400">Payslip · October 2026</p>
          <p className="mt-2 text-[0.98rem] font-semibold text-ink-900">Ananya R. · Plant, Pune</p>
        </div>
        <Pill tone="done">Released</Pill>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="text-[0.82rem]">
          <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-400">Earnings</p>
          <dl>
          {earn.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-ink-900/[0.06] py-2">
              <dt className="text-ink-600">{k}</dt>
              <dd className="ez-num font-semibold text-ink-900">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between py-2">
            <dt className="font-semibold text-ink-900">Gross</dt>
            <dd className="ez-num font-semibold text-ink-900">57,500</dd>
          </div>
          </dl>
        </div>
        <div className="text-[0.82rem]">
          <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-400">Deductions, with the basis</p>
          <dl>
          {ded.map(([k, v, why]) => (
            <div key={k} className="flex flex-wrap justify-between border-b border-ink-900/[0.06] py-1.5">
              <dt className="text-ink-600">{k}</dt>
              <dd className="ez-num font-semibold text-ink-900">{v}</dd>
              <dd className="w-full text-[0.68rem] text-brand-700">{why}</dd>
            </div>
          ))}
          </dl>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between rounded-[14px] bg-ink-900 px-4 py-3 text-white">
        <div>
          <p className="text-[0.7rem] text-white/60">Employer PF 3,000 · split EPS / EPF</p>
          <p className="text-[0.82rem] font-semibold">Net pay</p>
        </div>
        <p className="ez-num font-display text-[1.6rem] font-[680] leading-none tracking-[-0.03em] [font-stretch:110%]">₹54,300</p>
      </div>
    </div>
  )
}

function Attendance() {
  return (
    <div className="relative">
      <div className="absolute -left-2 -top-6 z-10 w-44 rounded-[18px] bg-ink-900 p-4 text-white shadow-[0_24px_44px_-24px_rgb(11_22_51/0.6)] sm:-left-8">
        <p className="flex items-center gap-1.5 text-[0.72rem] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Punched in
        </p>
        <p className="ez-num mt-1.5 font-display text-[1.9rem] font-[680] leading-none tracking-[-0.03em] [font-stretch:110%]">09:41</p>
        <p className="mt-2 text-[0.72rem] text-white/60">General shift · Pune</p>
      </div>
      <div className="pl-10 pt-16 sm:pl-24">
        <AttendanceCard />
      </div>
    </div>
  )
}

function OfferFlow() {
  const steps: [string, 'done' | 'now' | 'next'][] = [
    ['Interview scorecards in', 'done'],
    ['CTC calculated: in-hand and employer cost', 'done'],
    ['HR Head approval', 'now'],
    ['Digital acceptance', 'next'],
    ['Candidate to employee, one click', 'next'],
  ]
  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="ez-kicker text-ink-400">Offer · Quality Engineer</p>
          <p className="mt-2 text-[0.98rem] font-semibold text-ink-900">Kabir S. · Plant, Pune</p>
        </div>
        <Pill tone="wait">Awaiting approval</Pill>
      </div>
      <ol className="mt-5 space-y-1">
        {steps.map(([label, state], i) => (
          <li key={label} className={cn('flex items-center gap-3 rounded-[10px] px-2 py-2 text-[0.84rem]', state === 'now' && 'bg-brand-50')}>
            <span
              className={cn(
                'ez-num relative grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.68rem] font-semibold',
                state === 'done' && 'bg-emerald-600 text-white',
                state === 'now' && 'bg-brand-600 text-white',
                state === 'next' && 'bg-ink-100 text-ink-400',
              )}
            >
              {state === 'done' ? '✓' : i + 1}
              {state === 'now' && <span className="ez-ping absolute inset-0 rounded-full bg-brand-600/40" />}
            </span>
            <span className={cn(state === 'next' ? 'text-ink-400' : 'text-ink-800', state === 'now' && 'font-semibold text-brand-700')}>
              {label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-ink-900/[0.06] pt-3 text-[0.74rem] text-ink-500">
        On acceptance the record carries straight into onboarding. Nothing is typed twice.
      </p>
    </div>
  )
}

function Claims() {
  return (
    <div className="space-y-3">
      <div className={card}>
        <div className="flex items-center justify-between">
          <p className="ez-kicker text-ink-400">Local trip · today</p>
          <Pill tone="done">Fare calculated</Pill>
        </div>
        <svg viewBox="0 0 300 70" className="mt-4 h-16 w-full overflow-visible" aria-hidden="true">
          <path d="M10 55 C 60 55, 70 15, 120 18 S 190 60, 235 40 S 280 12, 290 14" fill="none" stroke="rgb(11 22 51 / .12)" strokeWidth="6" strokeLinecap="round" />
          <path d="M10 55 C 60 55, 70 15, 120 18 S 190 60, 235 40 S 280 12, 290 14" pathLength={100} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" className="ez-flow" style={{ '--dash': 14, '--dur': '3.4s' } as React.CSSProperties} />
          <circle cx="10" cy="55" r="5" fill="#fff" stroke="#2563eb" strokeWidth="2.5" />
          <circle cx="290" cy="14" r="6" fill="#f2a516" />
          <circle cx="290" cy="14" r="6" fill="#f2a516" className="ez-ping" />
        </svg>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[0.8rem]">
          <div className="rounded-[12px] bg-ink-50 p-3 ring-1 ring-ink-900/[0.05]">
            <p className="text-[0.66rem] uppercase tracking-[0.08em] text-ink-400">Mode</p>
            <p className="font-semibold text-ink-900">Own bike</p>
          </div>
          <div className="rounded-[12px] bg-ink-50 p-3 ring-1 ring-ink-900/[0.05]">
            <p className="text-[0.66rem] uppercase tracking-[0.08em] text-ink-400">Measured</p>
            <p className="ez-num font-semibold text-ink-900">18.4 km</p>
          </div>
          <div className="rounded-[12px] bg-brand-50 p-3 ring-1 ring-brand-600/10">
            <p className="text-[0.66rem] uppercase tracking-[0.08em] text-brand-700">Fare</p>
            <p className="ez-num font-semibold text-brand-700">at policy rate</p>
          </div>
        </div>
      </div>
      <div className={cn(card, 'ml-6 sm:ml-12')}>
        <div className="flex items-center justify-between">
          <p className="ez-kicker text-ink-400">Outstation · Mumbai, 2 nights</p>
          <Pill tone="wait">With Finance</Pill>
        </div>
        <ol className="mt-4 flex items-center gap-2 text-[0.78rem]">
          <li className="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">Submitted</li>
          <li aria-hidden="true" className="h-px flex-1 bg-ink-900/15" />
          <li className="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">Manager ✓</li>
          <li aria-hidden="true" className="h-px flex-1 bg-ink-900/15" />
          <li className="rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">Finance</li>
        </ol>
        <p className="mt-4 flex items-center justify-between border-t border-ink-900/[0.06] pt-3 text-[0.74rem] text-ink-500">
          <span>Hotel bill dated 112 days ago</span>
          <Pill tone="stop">Declined · over 90 days</Pill>
        </p>
      </div>
    </div>
  )
}

const labels: Record<string, string> = {
  payroll:
    'Illustration with sample data: a payslip showing earnings and each deduction with its statutory basis, EPF on the wage ceiling, ESIC not applicable above its ceiling, Maharashtra Professional Tax, and net pay.',
  attendance:
    'Illustration with sample data: an employee punched in at 9:41, and the attendance week with two days of casual leave and the balance going from six days to four.',
  recruitment:
    'Illustration with sample data: an offer flow with scorecards and the CTC calculation complete, waiting on HR Head approval before digital acceptance.',
  ess: 'Illustration with sample data: the leave form on an employee’s phone, with the leave balance shown before the request is sent.',
  claims:
    'Illustration with sample data: a local trip with the distance measured and the fare calculated, and an outstation claim approved by the manager and waiting with Finance, with one bill declined for being older than 90 days.',
}

const corner: Record<string, DoodleKind> = {
  payroll: 'rupee',
  attendance: 'clock',
  recruitment: 'chat',
  ess: 'coffee',
  claims: 'plane',
}

export function FeatureVisual({ slug }: { slug: string }) {
  const picture =
    slug === 'payroll' ? <Payslip /> :
    slug === 'attendance' ? <Attendance /> :
    slug === 'recruitment' ? <OfferFlow /> :
    slug === 'ess' ? <div className="flex justify-center"><PhoneLeave compact /></div> :
    slug === 'claims' ? <Claims /> : null
  if (!picture) return null

  return (
    <div className="relative">
      <Doodle kind={corner[slug] ?? 'spark'} className="absolute -left-12 -top-12 z-10 hidden h-28 w-28 lg:block" />
      <div data-live="" role="img" aria-label={labels[slug]} className="relative rounded-[30px] bg-paper-2 p-5 ring-1 ring-ink-900/[0.05] sm:p-10">
        {picture}
      </div>
      <p className="mt-3 text-right text-[0.72rem] text-ink-400">Illustrative · sample data</p>
    </div>
  )
}
