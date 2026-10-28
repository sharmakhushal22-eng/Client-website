import { Section, SectionHeading } from '@/components/ui/Section'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { Arrow } from '@/components/ui/Button'
import { statutoryCoverage, workedPayslip, auditabilityNote } from '@/content/statutory'

const inr = (n: number) =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`

/* Spec §4.3 — three statutory extras: the coverage table, a worked payslip,
 * and the auditability line.
 *
 * Each page takes only its own parts, so none of them appears twice on the
 * site: /compliance carries the act-by-act table (every "#statutory" link
 * points there), /features/payroll carries the payslip and the audit line. */
type Part = 'coverage' | 'payslip' | 'audit'

export function StatutoryTable({ parts = ['coverage', 'payslip', 'audit'] }: { parts?: Part[] }) {
  const grossEarnings = workedPayslip.earnings.reduce((s, r) => s + r.amount, 0)
  const totalDeductions = workedPayslip.deductions.reduce((s, r) => s + r.amount, 0)
  const netPay = grossEarnings - totalDeductions

  return (
    <>
      {/* ── Coverage table ───────────────────────────────────────────────── */}
      {parts.includes('coverage') && (
      <Section tone="white" id="statutory" ariaLabel="Statutory coverage">
        <SectionHeading
          eyebrow="Built for India"
          title="What EZER does for each statutory head"
          lede="Under the law as it now stands: the four Labour Codes, in force since 21 November 2025, and the Income-tax Act, 2025, from 1 April 2026. Each head below is handled inside the run, against configuration that reflects your registrations."
        />

        {/* On a phone each head is its own card: a three-column table at
            46rem hid two of its columns off the right edge, with nothing to
            say they were there. */}
        <ul className="mt-8 space-y-3 md:hidden">
          {statutoryCoverage.map((row) => (
            <li key={row.act} className="rounded-[18px] bg-paper p-5 ring-1 ring-ink-900/[0.06]">
              <p className="text-base font-semibold text-brand-700">{row.act}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{row.fullName}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{row.whatItDoes}</p>
              <p className="mt-3 border-t border-ink-900/[0.08] pt-3 text-sm font-medium leading-relaxed text-ink-900">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500">Wages applied</span>
                {row.basis}
              </p>
            </li>
          ))}
        </ul>

        {/* Tablet and up: the table, scrolling inside its own container
            rather than making the page scroll sideways (§8.6). */}
        <div className="mt-10 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">
              Statutory acts covered by EZER HRMS, what the system does for each,
              and the wages and rates applied, under the law as it now stands
            </caption>
            <thead>
              <tr className="border-b-2 border-ink-200">
                <th scope="col" className="py-3 pr-4 text-sm font-bold text-ink-900">
                  Head and governing law
                </th>
                <th scope="col" className="py-3 pr-4 text-sm font-bold text-ink-900">
                  What the system does
                </th>
                <th scope="col" className="py-3 text-sm font-bold text-ink-900">
                  Wages applied
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {statutoryCoverage.map((row) => (
                <tr key={row.act} className="align-top">
                  <th scope="row" className="py-5 pr-4 font-semibold">
                    <span className="block text-base text-brand-700">{row.act}</span>
                    <span className="mt-1 block text-xs font-normal leading-relaxed text-ink-500">
                      {row.fullName}
                    </span>
                  </th>
                  <td className="py-5 pr-4 text-sm leading-relaxed text-ink-600">
                    {row.whatItDoes}
                  </td>
                  <td className="py-5 text-sm font-medium leading-relaxed text-ink-900">
                    {row.basis}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-ink-500">
          Rates, ceilings and slabs are configuration, not code, so a statutory
          change is applied without waiting for a product release.
        </p>
      </Section>
      )}

      {/* ── Worked payslip ───────────────────────────────────────────────── */}
      {parts.includes('payslip') && (
      <Section tone="tint" ariaLabel="Worked payslip example">
        <SectionHeading
          eyebrow="A worked example"
          title="One payslip, with the arithmetic shown"
          lede="A fictional employee in Pune on a monthly gross of ₹58,000. The figures tie out, which is the whole point of showing them."
        />

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl bg-surface shadow-xl shadow-ink-900/5 ring-1 ring-ink-200">
          {/* Header */}
          <div className="border-b border-ink-200 bg-dark px-6 py-5 text-white sm:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-lg font-bold">{workedPayslip.employee.name}</p>
                <p className="text-sm text-white/65">
                  {workedPayslip.employee.code} · {workedPayslip.employee.designation}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{workedPayslip.employee.month}</p>
                <p className="text-xs text-white/65">{workedPayslip.employee.location}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/65">
              Paid days: {workedPayslip.employee.paidDays}
            </p>
          </div>

          <div className="grid gap-px bg-ink-200 sm:grid-cols-2">
            {/* Earnings */}
            <div className="bg-surface px-6 py-6 sm:px-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
                Earnings
              </h3>
              <dl className="mt-4 space-y-2.5">
                {workedPayslip.earnings.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 text-sm">
                    <dt className="text-ink-600">{row.label}</dt>
                    <dd className="shrink-0 font-medium tabular-nums text-ink-900">
                      {inr(row.amount)}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex justify-between gap-4 border-t border-ink-200 pt-3 text-sm font-bold">
                <span>Gross earnings</span>
                <span className="tabular-nums">{inr(grossEarnings)}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-surface px-6 py-6 sm:px-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
                Deductions
              </h3>
              <dl className="mt-4 space-y-2.5">
                {workedPayslip.deductions.map((row) => (
                  <div key={row.label} className="flex flex-wrap justify-between gap-x-4 text-sm">
                    <dt className="text-ink-600">{row.label}</dt>
                    <dd className="shrink-0 font-medium tabular-nums text-ink-900">
                      {inr(row.amount)}
                    </dd>
                    {row.note && (
                      <dd className="mt-0.5 w-full text-xs text-ink-500">{row.note}</dd>
                    )}
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex justify-between gap-4 border-t border-ink-200 pt-3 text-sm font-bold">
                <span>Total deductions</span>
                <span className="tabular-nums">{inr(totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 bg-brand-600 px-6 py-5 text-on-accent sm:px-8">
            <span className="text-sm font-semibold uppercase tracking-wide">Net pay</span>
            <span className="text-2xl font-bold tabular-nums">{inr(netPay)}</span>
          </div>

          {/* Employer cost + notes */}
          <div className="border-t border-ink-200 px-6 py-6 sm:px-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
              Employer contributions
            </h3>
            <dl className="mt-3 space-y-2">
              {workedPayslip.employerContributions.map((row) => (
                <div key={row.label} className="flex flex-wrap justify-between gap-x-4 text-sm">
                  <dt className="text-ink-600">{row.label}</dt>
                  <dd className="shrink-0 font-medium tabular-nums text-ink-900">
                    {inr(row.amount)}
                  </dd>
                  {row.note && <dd className="mt-0.5 w-full text-xs text-ink-500">{row.note}</dd>}
                </div>
              ))}
            </dl>

            <ul className="mt-5 space-y-1.5 border-t border-ink-200 pt-4">
              {workedPayslip.notes.map((note) => (
                <li key={note} className="flex items-start gap-2 text-xs leading-relaxed text-ink-500">
                  <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {!parts.includes('coverage') && (
          <p className="mt-8 text-center">
            <Link href="/compliance#statutory" className="ez-press inline-flex items-center gap-2 text-[0.95rem] font-semibold text-brand-700">
              <span className="ez-link">Every statutory head, act by act</span>
              <Arrow />
            </Link>
          </p>
        )}
      </Section>
      )}

      {/* ── Auditability ─────────────────────────────────────────────────── */}
      {parts.includes('audit') && (
      <Section tone="white" ariaLabel="Auditability">
        <div className="mx-auto max-w-3xl rounded-2xl bg-dark p-8 text-center text-white sm:p-12">
          <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-brand-300">
            <Icon name="shield" className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
            Every number traces back
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-200">
            {auditabilityNote}
          </p>
        </div>
      </Section>
      )}
    </>
  )
}
