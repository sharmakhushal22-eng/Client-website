import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Masked } from '@/components/brand/Masked'
import { access, structure } from '@/content/positioning'
import { IndiaPulse } from '@/components/graphics/IndiaPulse'
import { LiveCharts } from '@/components/graphics/LiveCharts'

/* ============================================================================
 * Group → company → location, and who sees what.
 *
 * Indian businesses are very often a group of related companies, each with
 * its own PAN, TAN and registrations, running corporate offices, plants,
 * warehouses and branches in different states (content/positioning.ts →
 * structure). This section draws that shape once, as a diagram, rather
 * than describing it in a paragraph.
 *
 * The diagram is sample structure, not a customer: three numbered companies,
 * the product's own location types, state codes for where they sit.
 * ========================================================================= */

const companies = [
  { name: 'Company 1', kind: 'Manufacturing', places: ['Head office · MH', 'Plant · MH', 'Plant · GJ'] },
  { name: 'Company 2', kind: 'Logistics', places: ['Warehouse · MH', 'Depot · KA', 'Depot · TN'] },
  { name: 'Company 3', kind: 'Retail', places: ['Corporate office · KA', 'Branch · KA', 'Branch · DL'] },
]

export function GroupShape() {
  return (
    <section aria-labelledby="group-title" className="bg-paper py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow>One operation, however many companies</Eyebrow>
            <Masked
              id="group-title"
              as="h2"
              className="mt-6 text-[2.3rem] leading-[1.04] sm:text-[3rem] lg:text-[3.4rem]"
              lines={['Shaped like', 'your group,', <span key="c" className="text-ink-400">not one office.</span>]}
            />
            <ul data-m="settle" className="mt-9 space-y-4">
              {structure.points.map((point) => (
                <li key={point} className="flex gap-3.5 text-[1rem] leading-relaxed text-ink-700">
                  <span aria-hidden="true" className="mt-[0.72em] h-[2px] w-4 shrink-0 rounded-full bg-brand-600" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* ── The diagram ───────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div
              role="img"
              aria-label="Diagram, sample structure: one group holding three companies, each with its own registrations and its own locations in different states."
              className="rounded-[28px] bg-white p-6 ring-1 ring-ink-900/[0.06] sm:p-9"
            >
              <div className="mx-auto w-fit rounded-full bg-ink-900 px-5 py-2.5 text-center text-white">
                <p className="text-[0.95rem] font-semibold">Your group</p>
                <p className="text-[0.7rem] text-white/60">Consolidated headcount and cost</p>
              </div>

              {/* Connectors: one trunk, one bar, three drops — with pulses
                  running down them from the group to each company. */}
              <svg data-live="" aria-hidden="true" viewBox="0 0 600 48" preserveAspectRatio="none" className="mx-auto hidden h-12 w-full overflow-visible sm:block">
                {[100, 300, 500].map((x, i) => {
                  const d = `M 300 0 V 20 Q 300 24 ${x === 300 ? 300 : x > 300 ? 304 : 296} 24 H ${x} V 48`
                  return (
                    <g key={x}>
                      <path d={x === 300 ? 'M 300 0 V 48' : d} fill="none" stroke="rgb(11 22 51 / .18)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                      <path d={x === 300 ? 'M 300 0 V 48' : d} pathLength={100} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="ez-flow" style={{ '--d': `${i * 0.6}s`, '--dur': '2.4s', '--dash': 18 } as React.CSSProperties} />
                    </g>
                  )
                })}
              </svg>

              <div data-m="settle" className="mt-6 grid gap-4 sm:mt-0 sm:grid-cols-3">
                {companies.map((c) => (
                  <div key={c.name} className="rounded-[18px] bg-paper p-4 ring-1 ring-ink-900/[0.06]">
                    <p className="text-[0.92rem] font-semibold text-ink-900">{c.name}</p>
                    <p className="text-[0.74rem] text-ink-500">{c.kind}</p>
                    <p className="ez-kicker mt-3 text-[0.6rem] text-ink-400">PAN · TAN · PF · ESIC</p>
                    <ul className="mt-3 space-y-1.5">
                      {c.places.map((p) => (
                        <li key={p} className="rounded-[9px] bg-white px-2.5 py-1.5 text-[0.74rem] font-medium text-ink-700 ring-1 ring-ink-900/[0.06]">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-right text-[0.72rem] text-ink-400">Sample structure</p>
            </div>
          </div>
        </div>

        {/* ── Every state ─────────────────────────────────────────────────── */}
        <div className="mt-20 grid items-center gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div data-m="rise" className="relative rounded-[30px] bg-white p-6 ring-1 ring-ink-900/[0.06] sm:p-10">
              <IndiaPulse />
              <p className="mt-2 text-right text-[0.72rem] text-ink-400">Illustrative · sample locations</p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <h3 className="font-display text-[1.7rem] font-[640] leading-tight tracking-[-0.03em] text-ink-900 [font-stretch:106%] sm:text-[2.1rem]">
              28 states, 8 union territories. Each paid by its own rules.
            </h3>
            <p className="mt-4 text-[1rem] leading-relaxed text-ink-600">
              Professional Tax, Labour Welfare Fund, minimum wages and leave entitlement
              follow the state the employee actually works in, not where the head office
              sits, for any number of locations. A transfer from Pune to Bengaluru changes
              the rules the next payroll applies, without anyone setting them again.
            </p>
            <ul data-m="settle" className="mt-7 space-y-3">
              {[
                ['PT', 'Slab applied by work location'],
                ['LWF', 'Monthly, half-yearly or annual, per state'],
                ['Leave', 'Entitlement per state Shops & Establishments rules'],
                ['Min. wage', 'Checked by state, skill and zone'],
                ['Holidays', 'Location-wise holiday calendars'],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center gap-4 rounded-[16px] bg-white px-4 py-3 ring-1 ring-ink-900/[0.06]">
                  <span className="grid h-9 min-w-9 place-items-center rounded-full bg-brand-50 px-2 text-[0.74rem] font-bold text-brand-700">{k}</span>
                  <span className="text-[0.95rem] text-ink-700">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Roles, and the view at the top ───────────────────────────────── */}
        <div className="mt-20 grid items-start gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h3 className="font-display text-[1.7rem] font-[640] leading-tight tracking-[-0.03em] text-ink-900 [font-stretch:106%] sm:text-[2.1rem]">
              One login. Everyone sees exactly what their role needs.
            </h3>
            <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-ink-600">
              Aadhaar and bank details stay masked except for the roles that need
              them, on every screen and in every export.
            </p>
            <dl data-m="settle" className="mt-8 grid border-t border-ink-900/10 sm:grid-cols-2 sm:gap-x-8">
              {access.roles.map((role) => (
                <div key={role.name} className="border-b border-ink-900/10 py-5">
                  <dt className="flex items-center gap-2 text-[1rem] font-semibold text-ink-900">
                    {role.name}
                    {'highlight' in role && role.highlight && (
                      <span className="rounded-full bg-marigold/20 px-2 py-0.5 text-[0.66rem] font-semibold text-[#7a4b00]">Leadership</span>
                    )}
                  </dt>
                  <dd className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-600">{role.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:sticky lg:top-28 lg:col-span-6">
            <div data-m="rise">
              <LiveCharts />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
