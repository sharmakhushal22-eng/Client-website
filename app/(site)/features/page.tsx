import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ComplianceBand } from '@/components/story/ComplianceBand'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Eyebrow } from '@/components/brand/Bars'
import { Arrow } from '@/components/ui/Button'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { moduleGroups, solutions, complianceItems } from '@/content/modules'

export const metadata: Metadata = pageMetadata({
  title: 'Features: every module in one system',
  description:
    'Recruitment, onboarding, attendance, payroll, statutory compliance, claims, self-service and reporting. The full module list, honestly grouped.',
  path: '/features',
})

/* Spec §4.2 — intro on the "one system, not five" pillar, a grid of module
 * groups each linking to its detail page, the full module list honestly
 * grouped, and a CTA band. */
export default function FeaturesPage() {
  const totalModules = moduleGroups.reduce((n, g) => n + g.modules.length, 0)
  const live = solutions.filter((x) => !x.coming).length

  return (
    <PageTransition kind="product">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Features', path: '/features' },
          ]),
        ]}
      />

      <PageHero
        kind="product"
        stage="helix"
        stageChips={moduleGroups.map((g) => g.name)}
        crumbs={[{ name: 'Features' }]}
        eyebrow="The product"
        title={['One employee', 'master.', <span key="b" className="text-ink-400">Every entity.</span>]}
        lede={
          <>
            <p>
              Group companies usually end up with a recruitment tool, an attendance system,
              a payroll bureau and a reimbursement process in email, and then all of that again
              for the next entity. The same employee exists several times over, and no two
              records agree.
            </p>
            <p className="mt-4">
              EZER is one system across the whole group. A change to an employee is made once.
              Attendance becomes payroll input without an export, and the statutory position
              for every company and state follows from the data.
            </p>
          </>
        }
        facts={[
          { value: String(moduleGroups.length), label: 'Areas, one record beneath them' },
          { value: String(totalModules), label: 'Capabilities across those areas' },
          { value: String(live), label: 'Solutions live today' },
          { value: String(complianceItems.length), label: 'Statutory heads handled' },
        ]}
      />

      {/* ── The areas, as a catalogue ───────────────────────────────────── */}
      <section aria-label="Product areas" className="bg-paper pb-16 pt-8 sm:pb-24">
        <Container>
          <ol className="border-t border-ink-900/10">
            {moduleGroups.map((group, i) => (
              <li key={group.id} data-m="rise" className="grid gap-6 border-b border-ink-900/10 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
                <div className="lg:col-span-5">
                  <p className="ez-num ez-kicker text-brand-600">{String(i + 1).padStart(2, '0')} · {group.label}</p>
                  <h2 className="mt-4 text-[2.2rem] leading-none sm:text-[2.8rem]">{group.name}</h2>
                  <p className="mt-4 max-w-sm text-[1.1rem] leading-snug text-ink-600">{group.promise}</p>
                  {group.href && (
                    <Link
                      href={group.href}
                      className="ez-press mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-brand-700"
                    >
                      <span className="ez-link">Read more about {group.name.toLowerCase()}</span>
                      <Arrow />
                    </Link>
                  )}
                </div>
                <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:col-span-7">
                  {group.modules.map((m) => (
                    <li key={m.name} className="flex gap-3.5">
                      <span aria-hidden="true" className="mt-[0.7em] h-[2px] w-4 shrink-0 rounded-full bg-brand-600" />
                      <span className="text-[0.98rem] leading-relaxed text-ink-800">
                        {m.name}
                        {m.blurb && <span className="text-ink-500">: {m.blurb}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── The twenty solutions, for the reader scanning for one thing ── */}
      <section aria-labelledby="solutions-title" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>Looking for one thing?</Eyebrow>
              <h2 id="solutions-title" className="mt-5 text-[2.1rem] leading-[1.06] sm:text-[2.7rem]">
                Every solution, by name
              </h2>
            </div>
            <p className="max-w-lg self-end text-[1rem] leading-relaxed text-ink-600 lg:col-span-6 lg:col-start-7">
              Statutory solutions are marked. Anything still on the roadmap is labelled as
              coming, rather than being listed as if they had shipped.
            </p>
          </div>
          <ul data-m="settle" className="mt-12 grid border-t border-ink-900/10 md:grid-cols-2 md:gap-x-10">
            {solutions.map((x) => (
              <li key={x.n} className="flex gap-5 border-b border-ink-900/10 py-5">
                <span className="ez-num ez-kicker w-6 shrink-0 pt-1 text-ink-400">{x.n}</span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-[1.02rem] font-semibold text-ink-900">
                    {x.name}
                    {x.statutory && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[0.66rem] font-semibold text-brand-700">Statutory</span>
                    )}
                    {x.coming && (
                      <span className="rounded-full bg-marigold/20 px-2 py-0.5 text-[0.66rem] font-semibold text-[#7a4b00]">Coming</span>
                    )}
                  </p>
                  <p className="mt-1 text-[0.94rem] leading-relaxed text-ink-600">{x.blurb}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ComplianceBand />

      <CtaBand
        title="Which of these do you actually need?"
        lede="Tell us your headcount, your states and what is breaking today. We will show you the parts that matter and skip the rest."
      />
    </PageTransition>
  )
}
