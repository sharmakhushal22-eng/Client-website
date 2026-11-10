import { cn } from '@/lib/cn'
import { Doodle, type DoodleKind } from '@/components/graphics/Doodles'


/* ============================================================================
 * The product picture at the top of each feature page.
 *
 * Drawn in HTML, in the same hand as the home page's cards, so the site's
 * product pictures are one family and stay sharp at any size. Each shows a
 * capability the page itself documents (content/features.ts), with sample
 * data that is internally consistent:
 *
 *   payroll   the salary calculator, as the product's Flexi & TDS screen
 *             lays it out. Monthly: Basic ₹50,000, HRA at 40% (Pune is
 *             non-metro) ₹20,000, special ₹30,000, gross ₹1,00,000. Basic is
 *             half of pay, so no Code-on-Wages add-back. Employer EPF 12% on
 *             the ₹25,000 ceiling = ₹3,000; gratuity 4.81% of basic = ₹2,405;
 *             CTC ₹1,05,405 a month, ₹12,64,860 a year. Employee EPF ₹3,000,
 *             Maharashtra PT ₹200. New regime: ₹12,00,000 less the ₹75,000
 *             standard deduction is ₹11,25,000, under the ₹12 lakh rebate,
 *             so TDS is nil. Take-home ₹96,800.
 *             (The worked payslip further down the page is a different
 *             employee and a different picture: this one is the CTC view.)
 *   attendance  today's shifts at one plant, and the exceptions they
 *             produced: a missed punch, a late mark, overtime to payroll
 *   recruitment the seven-step offer flow, part way through
 *   ess       the employee's phone: investment proofs against what was
 *             declared, ₹21,600 + ₹1,08,000 = ₹1,29,600
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

function SalaryCalculator() {
  const steps = ['Salary', 'Flexi', 'Investments', 'TDS']
  const rows: [string, string, string][] = [
    ['Basic', '50,000', '6,00,000'],
    ['HRA · 40% of basic', '20,000', '2,40,000'],
    ['Special allowance', '30,000', '3,60,000'],
    ['Employer EPF · on ₹25,000', '3,000', '36,000'],
    ['Gratuity · 4.81% of basic', '2,405', '28,860'],
  ]
  return (
    <div className={card}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="ez-kicker text-ink-400">Salary calculator · FY 2026-27</p>
          <p className="mt-2 text-[0.98rem] font-semibold text-ink-900">Arjun P. · Finance, Pune</p>
        </div>
        <Pill tone="info">New regime</Pill>
      </div>

      <ol className="mt-4 flex items-center gap-1.5 text-[0.7rem] font-semibold">
        {steps.map((st, i) => (
          <li key={st} className="flex min-w-0 flex-1 items-center gap-1.5">
            <span
              className={cn(
                'grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.62rem]',
                i < 3 ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700 ring-1 ring-brand-600/30',
              )}
            >
              {i < 3 ? '✓' : i + 1}
            </span>
            <span className={cn('truncate', i < 3 ? 'hidden text-ink-700 sm:inline' : 'text-brand-700')}>{st}</span>
            {i < steps.length - 1 && <span aria-hidden="true" className="hidden h-px flex-1 bg-ink-900/15 sm:block" />}
          </li>
        ))}
      </ol>

      <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
        {[
          ['CTC / yr', '₹12,64,860', 'text-brand-700'],
          ['Gross / mo', '₹1,00,000', 'text-ink-900'],
          ['In-hand / mo', '₹96,800', 'text-emerald-700'],
        ].map(([k, v, tone]) => (
          <div key={k} className="min-w-0 rounded-[12px] bg-ink-50 px-2.5 py-2.5 ring-1 ring-ink-900/[0.06] sm:px-3">
            <p className="whitespace-nowrap text-[0.58rem] font-medium uppercase tracking-[0.02em] text-ink-400 sm:text-[0.62rem] sm:tracking-[0.06em]">{k}</p>
            <p className={cn('ez-num mt-0.5 whitespace-nowrap text-[0.78rem] font-semibold sm:text-[1rem]', tone)}>{v}</p>
          </div>
        ))}
      </div>

      <table className="mt-4 w-full text-[0.8rem]">
        <thead>
          <tr className="text-[0.64rem] uppercase tracking-[0.08em] text-ink-400">
            <th className="pb-1.5 text-left font-semibold">Component</th>
            <th className="pb-1.5 text-right font-semibold">Monthly</th>
            <th className="pb-1.5 text-right font-semibold">Annual</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, m, a]) => (
            <tr key={k} className="border-t border-ink-900/[0.06]">
              <td className="py-1.5 pr-2 text-ink-600">{k}</td>
              <td className="ez-num py-1.5 text-right font-semibold text-ink-900">{m}</td>
              <td className="ez-num py-1.5 pl-2 text-right text-ink-500">{a}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-[14px] bg-ink-900 px-4 py-3 text-white">
        <div>
          <p className="text-[0.66rem] text-white/60">Taxable ₹11,25,000 after standard deduction</p>
          <p className="text-[0.82rem] font-semibold">TDS this year</p>
        </div>
        <div className="text-right">
          <p className="ez-num font-display text-[1.5rem] font-[680] leading-none tracking-[-0.03em] [font-stretch:110%]">₹0</p>
          <p className="mt-1 text-[0.64rem] text-[#ffd27a]">Under the ₹12 lakh rebate</p>
        </div>
      </div>
    </div>
  )
}

function Attendance() {
  const shifts: [string, string, number, number][] = [
    ['General', '09:30 – 18:30', 112, 118],
    ['Shift A', '06:00 – 14:00', 42, 45],
  ]
  return (
    <div className="relative">
      <div className="absolute -left-2 -top-6 z-10 w-44 rounded-[18px] bg-ink-900 p-4 text-white shadow-[0_24px_44px_-24px_rgb(11_22_51/0.6)] sm:-left-8">
        <p className="flex items-center gap-1.5 text-[0.72rem] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Punched in
        </p>
        <p className="ez-num mt-1.5 font-display text-[1.9rem] font-[680] leading-none tracking-[-0.03em] [font-stretch:110%]">09:41</p>
        <p className="mt-2 text-[0.72rem] text-white/60">Inside the Pune geofence</p>
      </div>
      <div className="pl-10 pt-16 sm:pl-24">
        <div className={card}>
          <div className="flex items-center justify-between gap-3">
            <p className="ez-kicker text-ink-400">Plant, Pune · today</p>
            <Pill tone="done">Live</Pill>
          </div>
          <div className="mt-4 space-y-3">
            {shifts.map(([name, time, inNow, rostered]) => (
              <div key={name} className="text-[0.8rem]">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-ink-900">{name} <span className="font-normal text-ink-400">{time}</span></span>
                  <span className="ez-num text-ink-600"><b className="text-ink-900">{inNow}</b> of {rostered} in</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-ink-100">
                  <div className="ez-panel-bar h-full rounded-full bg-brand-600" style={{ width: `${(inNow / rostered) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-ink-400">Needs a look</p>
          <ul className="mt-1 divide-y divide-ink-900/[0.06] text-[0.78rem]">
            <li className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0"><span className="block font-semibold text-ink-900">Missed punch-out</span><span className="text-ink-500">Rahul D. · yesterday</span></span>
              <Pill tone="wait">Regularise</Pill>
            </li>
            <li className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0"><span className="block font-semibold text-ink-900">Late by 18 min</span><span className="text-ink-500">Sneha P. · grace 2 of 3 used</span></span>
              <Pill tone="info">Late mark</Pill>
            </li>
            <li className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0"><span className="block font-semibold text-ink-900">Overtime 2h 10m</span><span className="text-ink-500">Imran K. · Shift A</span></span>
              <Pill tone="done">To payroll</Pill>
            </li>
          </ul>
        </div>
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

function ProofsPhone() {
  const rows: [string, string, string, 'done' | 'wait'][] = [
    ['80C', 'PPF and ELSS', '₹21,600', 'done'],
    ['HRA', 'Rent, 12 months', '₹1,08,000', 'wait'],
  ]
  return (
    <div className="mx-auto w-[15.5rem] rounded-[2.6rem] bg-ink-900 p-[7px] shadow-[0_40px_70px_-30px_rgb(11_22_51/0.55)]">
      <div className="relative overflow-hidden rounded-[2.2rem] bg-white">
        <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[0.62rem] font-semibold text-ink-900">
          <span className="ez-num">9:41</span>
          <span className="h-[18px] w-16 rounded-full bg-ink-900" />
          <span className="flex gap-0.5">
            <span className="h-2 w-0.5 rounded bg-ink-900" />
            <span className="h-2.5 w-0.5 rounded bg-ink-900" />
            <span className="h-3 w-0.5 rounded bg-ink-900" />
          </span>
        </div>
        <div className="px-4 pb-5 pt-3">
          <p className="text-[0.68rem] font-medium text-ink-400">Payroll · FY 2026-27</p>
          <p className="font-display text-[1.15rem] font-[650] tracking-[-0.02em] text-ink-900 [font-stretch:104%]">
            Investment proofs
          </p>
          <div className="mt-3 rounded-[14px] bg-brand-50 p-3 ring-1 ring-brand-600/10">
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-brand-700">Declared</p>
            <p className="ez-num font-display text-[1.35rem] font-[680] leading-tight tracking-[-0.03em] text-ink-900">₹1,29,600</p>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-[0.66rem]">
              <p className="rounded-[8px] bg-white px-2 py-1.5"><span className="block text-ink-400">Proven</span><b className="ez-num text-emerald-700">₹21,600</b></p>
              <p className="rounded-[8px] bg-white px-2 py-1.5"><span className="block text-ink-400">Pending</span><b className="ez-num text-amber-700">₹1,08,000</b></p>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {rows.map(([code, what, amt, tone]) => (
              <li key={code} className="flex items-center gap-2.5 rounded-[12px] bg-ink-50 px-3 py-2 ring-1 ring-ink-900/[0.06]">
                <span className="rounded-full bg-white px-1.5 py-0.5 text-[0.6rem] font-bold text-brand-700 ring-1 ring-brand-600/20">{code}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.7rem] font-semibold text-ink-900">{what}</span>
                  <span className="ez-num text-[0.64rem] text-ink-500">{amt}</span>
                </span>
                <Pill tone={tone}>{tone === 'done' ? 'Verified' : 'Due'}</Pill>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex h-10 items-center justify-center rounded-full bg-brand-600 text-[0.76rem] font-semibold text-white">
            Upload rent receipts
          </div>
          <p className="mt-2 text-center text-[0.62rem] text-ink-400">Proofs close 31 Mar 2027</p>
        </div>
      </div>
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
    'Illustration with sample data: a salary calculator showing an annual CTC of ₹12,64,860 broken into basic, HRA, special allowance, employer EPF and gratuity, a monthly take-home of ₹96,800, and nil TDS under the new regime.',
  attendance:
    'Illustration with sample data: an employee punched in at 9:41 inside the geofence, two shifts at a Pune plant with how many are in against the roster, and three exceptions: a missed punch-out to regularise, a late mark, and overtime sent to payroll.',
  recruitment:
    'Illustration with sample data: an offer flow with scorecards and the CTC calculation complete, waiting on HR Head approval before digital acceptance.',
  ess: 'Illustration with sample data: investment proofs on an employee’s phone, ₹1,29,600 declared, the 80C proof verified and the rent receipts still due before 31 March 2027.',
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
    slug === 'payroll' ? <SalaryCalculator /> :
    slug === 'attendance' ? <Attendance /> :
    slug === 'recruitment' ? <OfferFlow /> :
    slug === 'ess' ? <ProofsPhone /> :
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
