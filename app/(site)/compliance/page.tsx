import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Button, Arrow } from '@/components/ui/Button'
import { StatutoryTable } from '@/components/sections/StatutoryTable'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Eyebrow } from '@/components/brand/Bars'
import { ComplianceBand } from '@/components/story/ComplianceBand'
import { GroupShape } from '@/components/story/GroupShape'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { complianceEngine, labourCodes, flags, ruleChanges } from '@/content/positioning'

export const metadata: Metadata = pageMetadata({
  title: 'Statutory compliance & the labour codes',
  description:
    'EPF, ESIC, state-wise Professional Tax, LWF, TDS, gratuity and bonus, all calculated inside the payroll run. Built on the four labour codes and the revised wage definition.',
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
    q: 'Is EZER up to date with the 2026 changes: the ₹25,000 EPF ceiling and the Income-tax Act, 2025?',
    a: 'Yes. Rules are held as configuration with the date they take effect, so the EPF ceiling is ₹15,000 for months before 17 September 2026 and ₹25,000 after it, and salary TDS runs under section 392 of the Income-tax Act, 2025 with the new regime as the default and Form 130 at the end of the tax year. The bonus ceilings the Code on Wages set in August 2026 are applied the same way.',
  },
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
    a: 'Rules are held as configuration per registration, so a notification is applied without waiting for a product release. That is the practical difference between being ready and being told it is on the roadmap. It matters because the codes are being notified by state and by establishment type, in stages, rather than all at once.',
  },
  {
    q: 'Can you show that a deduction was calculated correctly?',
    a: 'Every figure on a payslip opens to show what produced it: the attendance days counted, the salary structure in force that month, the statutory rate and ceiling applied, and the regime or slab used. That trail is the difference between a payroll that is correct and one that can be shown to be correct, which is the only version that survives an inspection or a dispute.',
  },
  {
    q: 'Do you file returns on our behalf?',
    a: 'We produce the filing-ready output against the registration each one belongs to. Filing itself stays with you or your consultant, which is deliberate: the statutory liability is the employer’s and we would rather not sit between you and it.',
  },
]

export default function CompliancePage() {
  const live = flags.complianceEngineLive

  return (
    <PageTransition kind="ledger">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Compliance', path: '/compliance' },
          ]),
          faqSchema(complianceFaqs),
        ]}
      />

      {/* ── Hero: the claim, then the register of what the run produces ── */}
      <PageHero
        kind="product"
        stage="shield"
        stageChips={['EPF', 'ESIC', 'PT', 'LWF', 'TDS', 'Gratuity', 'Bonus']}
        crumbs={[{ name: 'Compliance' }]}
        eyebrow={complianceEngine.eyebrow}
        title={
          live
            ? ['One run.', <span key="b" className="text-ink-400">Every register together.</span>]
            : ['28 states and 8 UTs.', '36 statutory positions.', <span key="c" className="text-brand-600">One payroll run.</span>]
        }
        lede={complianceEngine.lede}
        actions={
          <>
            <Button href="/book-a-demo" size="lg">
              See it on your registrations
              <Arrow />
            </Button>
            <Button href="/industries" variant="secondary" size="lg">
              Rules for your sector
            </Button>
          </>
        }
      >
        <div data-h="fade" style={{ '--d': '560ms' } as React.CSSProperties} className="mt-16 lg:mt-20">
          <p className="ez-kicker text-ink-500">{live ? 'Generated together' : 'Calculated in the run'}</p>
          <dl className="mt-4 grid border-t border-ink-900/10 sm:grid-cols-2 lg:grid-cols-3">
            {complianceEngine.outputs.map((output, i) => (
              <div
                key={output.label}
                className={`border-b border-ink-900/10 py-6 sm:pr-6 ${i % 2 === 1 ? 'sm:border-l sm:pl-6' : ''} ${i % 3 !== 0 ? 'lg:border-l lg:pl-6' : 'lg:border-l-0 lg:pl-0'}`}
              >
                <dt className="font-display text-[1.35rem] font-[640] tracking-[-0.025em] text-ink-900 [font-stretch:106%]">
                  {output.label}
                </dt>
                <dd className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-600">{output.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </PageHero>

      {/* ── The acts, as the band the home page uses ─────────────────────── */}
      <ComplianceBand showLink={false} />

      {/* ── What changed, and when ─────────────────────────────────────────
          Dated, newest first, each with what EZER does about it. The line
          draws itself as the section arrives; the four codes follow once. */}
      <section aria-labelledby="changes-title" className="bg-white py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>What changed, and when</Eyebrow>
              <h2 id="changes-title" className="mt-5 text-[2rem] leading-[1.08] sm:text-[2.6rem] lg:text-[3rem]">
                The law moved four times in a year.
                <span className="text-brand-600"> The rules moved with it.</span>
              </h2>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-600">
                Each change is held as configuration with the date it takes effect, so a month
                before the change is worked out under the old rule and a month after under the new one.
              </p>
            </div>
            <ol data-m="settle" className="ez-timeline relative lg:col-span-8">
              {ruleChanges.map((c, i) => (
                <li key={c.date} style={{ '--i': i } as React.CSSProperties} className="relative grid gap-2 pb-10 pl-10 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <span aria-hidden="true" className="absolute left-0 top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-brand-600 ring-4 ring-brand-50">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  <p className="ez-kicker pt-1.5 text-brand-700">{c.date}</p>
                  <div>
                    <h3 className="font-display text-[1.35rem] font-[650] leading-snug tracking-[-0.025em] text-ink-900 [font-stretch:106%]">{c.what}</h3>
                    <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-600">{c.detail}</p>
                    <p className="mt-3 rounded-[14px] bg-paper px-4 py-3 text-[0.9rem] leading-relaxed text-ink-800">
                      <span className="font-semibold text-brand-700">In EZER: </span>{c.applied}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ── What changed: the four codes, as numbered rows ───────────────── */}
      <section aria-labelledby="codes-title" className="bg-paper py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{labourCodes.eyebrow}</Eyebrow>
            <h2 id="codes-title" className="mt-5 text-[2rem] leading-[1.08] sm:text-[2.6rem] lg:text-[3rem]">
              {labourCodes.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">{labourCodes.lede}</p>
          </div>

          <ol className="mt-14 border-t border-ink-900/15">
            {labourCodes.codes.map((code, i) => (
              <li key={code.name} data-m="rise" className="grid gap-4 border-b border-ink-900/10 py-8 lg:grid-cols-12 lg:gap-10">
                <div className="flex items-baseline gap-5 lg:col-span-5">
                  <span className="ez-num ez-kicker text-brand-600">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-[1.7rem] font-[650] leading-tight tracking-[-0.03em] text-ink-900 [font-stretch:108%] sm:text-[2rem]">
                    {code.name}
                  </h3>
                </div>
                <div className="lg:col-span-7">
                  <p className="ez-kicker text-ink-400">{code.covers}</p>
                  <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-700">{code.what}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-3xl border-l-2 border-marigold pl-6 text-[1.02rem] leading-relaxed text-ink-700">
            {labourCodes.note}
          </p>
          <p className="mt-6 max-w-3xl text-[0.98rem] leading-relaxed text-ink-600">{labourCodes.industryNote}</p>
        </Container>
      </section>

      {/* ── Why multi-state is the hard part ─────────────────────────────── */}
      <GroupShape />

      {/* The act-by-act table. The worked payslip and the audit line live on
          the payroll page, so neither appears twice. */}
      <StatutoryTable parts={['coverage']} />

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
    </PageTransition>
  )
}
