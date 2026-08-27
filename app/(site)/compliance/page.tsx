import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { LabourCodeCards } from '@/components/sections/LabourCodeCards'
import { StatutoryTable } from '@/components/sections/StatutoryTable'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { complianceEngine, labourCodes, structure, flags } from '@/content/positioning'
import { complianceItems } from '@/content/modules'

export const metadata: Metadata = pageMetadata({
  title: 'Statutory compliance & the labour codes',
  description:
    'EPF, ESIC, state-wise Professional Tax, LWF, TDS, gratuity and bonus — calculated inside the payroll run. Built on the four labour codes and the revised wage definition.',
  path: '/compliance',
})

/* ============================================================================
 * The compliance page.
 *
 * Promoted out of a home-page section because it is the single strongest
 * differentiator this company has, and it was previously unlinkable: no URL,
 * so it could not be sent in a sales email, cited by a consultant, or found
 * in search by someone typing "labour code payroll software".
 *
 * The order answers a buyer's questions in the order they actually ask them:
 *   what changed → which acts → what comes out → how it is proved.
 * ========================================================================= */

const complianceFaqs = [
  {
    q: 'Which states do you cover for Professional Tax and LWF?',
    a: 'Every state that levies them. PT slabs and LWF rates are held per state registration and applied by the location the employee actually works at, not by where the company is headquartered. LWF is the one people get caught by: it is monthly in some states, half-yearly in others and annual elsewhere, and the frequency is configured per registration rather than assumed.',
  },
  {
    q: 'How do you handle an employee who crosses the ESIC ceiling mid-period?',
    a: 'They stay covered to the end of that contribution period, which is what the act requires. It is a small rule and the one most spreadsheet-based payrolls get wrong, because it needs the system to remember a state change rather than re-evaluate eligibility every month.',
  },
  {
    q: 'The labour codes are still being notified. What happens when our state notifies?',
    a: 'Rules are held as configuration per registration, so a notification is applied without waiting for a product release. That is the practical difference between being ready and being told it is on the roadmap — and it matters because the codes are being notified by state and by establishment type, in stages, rather than all at once.',
  },
  {
    q: 'Can you show that a deduction was calculated correctly?',
    a: 'Every figure on a payslip opens to show what produced it: the attendance days counted, the salary structure in force that month, the statutory rate and ceiling applied, and the regime or slab used. That trail is the difference between a payroll that is correct and one that can be shown to be correct, which is the only version that survives an inspection or a dispute.',
  },
  {
    q: 'Do you file returns on our behalf?',
    a: 'We produce the filing-ready output — ECR for EPF, contribution files for ESIC, state-wise PT and LWF, TDS and Form 16 — against the registration each one belongs to. Filing itself stays with you or your consultant, which is deliberate: the statutory liability is the employer’s and we would rather not sit between you and it.',
  },
]

export default function CompliancePage() {
  const live = flags.complianceEngineLive

  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Compliance', path: '/compliance' },
          ]),
          faqSchema(complianceFaqs),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-50 py-10 sm:py-14 lg:py-16">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-ink-600">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="font-medium text-ink-900">Compliance</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
                {complianceEngine.eyebrow}
              </p>
              <h1 className="mt-3 text-[2rem] font-bold leading-[1.12] sm:text-4xl lg:text-[2.75rem]">
                {live
                  ? 'One run. Every location’s register together.'
                  : 'Four states is not one statutory position. It is four.'}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                {complianceEngine.lede}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="/book-a-demo" size="lg">
                  See it on your registrations
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Button>
                <Button href="/industries" variant="secondary" size="lg">
                  Rules for your sector
                </Button>
              </div>
            </div>

            {/* What comes out of the run. */}
            <div className="rounded-xl bg-surface p-6 ring-1 ring-brand-100">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
                {live ? 'Generated together' : 'Calculated in the run'}
              </h2>
              <dl className="mt-4 divide-y divide-ink-200">
                {complianceEngine.outputs.map((output) => (
                  <div key={output.label} className="py-2.5">
                    <dt className="text-sm font-bold text-ink-900">
                      {output.label}
                    </dt>
                    <dd className="mt-0.5 text-xs leading-relaxed text-ink-600">
                      {output.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* ── The acts, at a glance ────────────────────────────────────────── */}
      <section className="border-y border-ink-200 bg-surface py-10" aria-label="Acts covered">
        <Container>
          <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
            Calculated inside the payroll run
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {complianceItems.map((item) => (
              <li
                key={item.code}
                className="flex items-center gap-2 rounded-md bg-brand-50 px-3.5 py-2 ring-1 ring-brand-100"
              >
                <span className="text-sm font-bold text-ink-900">{item.code}</span>
                <span className="text-xs text-ink-600">{item.label}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── What changed ─────────────────────────────────────────────────── */}
      <Section tone="tint" ariaLabel="The labour codes">
        <SectionHeading
          eyebrow={labourCodes.eyebrow}
          title={labourCodes.title}
          lede={labourCodes.lede}
          align="left"
        />

        <div className="mt-10">
          <LabourCodeCards />
        </div>

        <p className="mt-6 flex items-start gap-2.5 rounded-lg bg-surface px-5 py-4 text-sm leading-relaxed text-ink-600 ring-1 ring-brand-100">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          {labourCodes.note}
        </p>
      </Section>

      {/* ── Why multi-state is the hard part ─────────────────────────────── */}
      <Section tone="white" ariaLabel="Multi-state and multi-entity">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              {structure.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              {structure.title}
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">
              {structure.lede}
            </p>
          </div>

          <div>
            <ol className="space-y-3">
              {structure.levels.map((level) => (
                <li
                  key={level.name}
                  className="flex items-start gap-4 rounded-xl bg-brand-50 p-5 ring-1 ring-brand-100"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-600 text-on-accent">
                    <Icon name={level.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[1.02rem] font-bold text-ink-900">
                      {level.name}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-600">
                      {level.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <ul className="mt-5 space-y-2.5">
              {structure.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-600"
                >
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* The act-by-act table, the worked payslip and the auditability line —
          previously reachable only from /features/payroll. */}
      <StatutoryTable />

      <Faq
        faqs={complianceFaqs}
        tone="tint"
        eyebrow="Compliance questions"
        title="The ones a knowledgeable buyer asks"
      />

      <CtaBand
        title="Bring your registrations to the call"
        lede="Tell us the states you operate in and the establishment types you hold. We will show you the statutory setup against your own structure rather than a demo company."
      />
    </>
  )
}
