import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { statutoryCoverage, workedPayslip, auditabilityNote } from '@/content/statutory'

const inr = (n: number) =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`

/* Spec §4.3 — the payroll page's three extras: the statutory coverage table,
 * a worked payslip, and the auditability line. */
export function StatutoryTable() {
  const grossEarnings = workedPayslip.earnings.reduce((s, r) => s + r.amount, 0)
  const totalDeductions = workedPayslip.deductions.reduce((s, r) => s + r.amount, 0)
  const netPay = grossEarnings - totalDeductions

  return (
    <>
      {/* ── Coverage table ───────────────────────────────────────────────── */}
      <Section tone="white" id="statutory" ariaLabel="Statutory coverage">
        <SectionHeading
          eyebrow="Built for India"
          title="What EZER does for each statutory head"
          lede="Not a global payroll tool with an India patch. Each act below is handled inside the run, against configuration that reflects your registrations."
        />

        {/* Wide table scrolls inside its own container rather than making the
            page scroll sideways on a phone (§8.6). */}
        <div className="mt-10 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">
              Statutory acts covered by EZER HRMS, what the system does for each,
              and the basis applied
            </caption>
            <thead>
              <tr className="border-b-2 border-ink-200">
                <th scope="col" className="py-3 pr-4 text-sm font-bold text-ink-900">
                  Act
                </th>
                <th scope="col" className="py-3 pr-4 text-sm font-bold text-ink-900">
                  What the system does
                </th>
                <th scope="col" className="py-3 text-sm font-bold text-ink-900">
                  Basis applied
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
          Rates, ceilings and slabs are configuration, not code — so a statutory
          change is applied without waiting for a product release.
        </p>
      </Section>

      {/* ── Worked payslip ───────────────────────────────────────────────── */}
      <Section tone="tint" ariaLabel="Worked payslip example">
        <SectionHeading
          eyebrow="A worked example"
          title="One payslip, with the arithmetic shown"
          lede="A fictional employee in Pune on a monthly gross of ₹58,000. The figures tie out — that is the whole point of showing them."
        />

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-ink-900/5 ring-1 ring-ink-200">
          {/* Header */}
          <div className="border-b border-ink-200 bg-ink-900 px-6 py-5 text-white sm:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-lg font-bold">{workedPayslip.employee.name}</p>
                <p className="text-sm text-ink-400">
                  {workedPayslip.employee.code} · {workedPayslip.employee.designation}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{workedPayslip.employee.month}</p>
                <p className="text-xs text-ink-400">{workedPayslip.employee.location}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              Paid days: {workedPayslip.employee.paidDays}
            </p>
          </div>

          <div className="grid gap-px bg-ink-200 sm:grid-cols-2">
            {/* Earnings */}
            <div className="bg-white px-6 py-6 sm:px-8">
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
            <div className="bg-white px-6 py-6 sm:px-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
                Deductions
              </h3>
              <dl className="mt-4 space-y-2.5">
                {workedPayslip.deductions.map((row) => (
                  <div key={row.label} className="text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-600">{row.label}</dt>
                      <dd className="shrink-0 font-medium tabular-nums text-ink-900">
                        {inr(row.amount)}
                      </dd>
                    </div>
                    {row.note && (
                      <p className="mt-0.5 text-xs text-ink-400">{row.note}</p>
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
          <div className="flex flex-wrap items-baseline justify-between gap-2 bg-brand-600 px-6 py-5 text-white sm:px-8">
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
                <div key={row.label} className="text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-600">{row.label}</dt>
                    <dd className="shrink-0 font-medium tabular-nums text-ink-900">
                      {inr(row.amount)}
                    </dd>
                  </div>
                  {row.note && <p className="mt-0.5 text-xs text-ink-400">{row.note}</p>}
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
      </Section>

      {/* ── Auditability ─────────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="Auditability">
        <div className="mx-auto max-w-3xl rounded-2xl bg-ink-900 p-8 text-center text-white sm:p-12">
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
    </>
  )
}
