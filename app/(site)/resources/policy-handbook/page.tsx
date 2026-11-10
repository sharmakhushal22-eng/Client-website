import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { PageTransition } from '@/components/brand/PageTransition'
import { Eyebrow } from '@/components/brand/Bars'
import { AssetDownloadForm } from '@/components/forms/AssetDownloadForm'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import {
  policyCategories,
  rolloutPhases,
  policyDocumentFormat,
  policyCount,
  operatedCount,
} from '@/content/policy-handbook'

export const metadata: Metadata = pageMetadata({
  title: 'The company policy handbook for Indian companies',
  description:
    `${policyCount} HR, IT and compliance policies an Indian private limited company needs, across 12 categories, with a recommended rollout order. Free PDF.`,
  path: '/resources/policy-handbook',
})

/* ============================================================================
 * A resource page, not a product page.
 *
 * The handbook is genuinely useful on its own — that is the whole reason it
 * works as a lead magnet. So the full list is on the page in the open, and
 * the gate is on the PDF, not on the knowledge. Gating the content itself
 * would mean ranking for none of it and giving a visitor no reason to trust
 * the trade.
 *
 * The "runs in EZER" marks are the commercial argument, made by showing
 * rather than claiming: here is everything you need, and here is the part a
 * system can actually operate for you. Roughly two in five. The rest are
 * documents somebody in your company has to write, and saying so is what
 * makes the marked ones believable.
 * ========================================================================= */
export default function PolicyHandbookPage() {
  return (
    <PageTransition kind="editorial">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Policy handbook', path: '/resources/policy-handbook' },
          ]),
        ]}
      />

      {/* ── Hero + gate ──────────────────────────────────────────────────── */}
      <section className="ez-hero bg-paper pb-16 pt-10 sm:pt-14 lg:pb-24">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 text-[0.85rem] text-ink-500">
            <Link href="/" className="ez-link hover:text-ink-900">
              Home
            </Link>
            <span className="mx-2 text-ink-300" aria-hidden="true">/</span>
            <span className="font-medium text-ink-900">Policy handbook</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Eyebrow animate>Free resource</Eyebrow>

              <h1 className="mt-6 text-[2.5rem] leading-[1] tracking-[-0.04em] sm:text-[3.4rem] lg:text-[4rem]">
                <span className="ez-line"><span>The {policyCount} policies</span></span>
                <span className="ez-line"><span className="text-ink-400">an Indian company</span></span>
                <span className="ez-line"><span className="text-ink-400">is expected to have.</span></span>
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                Employment, leave, recruitment, payroll, conduct, IT security,
                welfare, operations, exit and statutory compliance, organised
                into 12 categories, with a recommended order to build them in.
              </p>

              <ul className="mt-7 space-y-2.5">
                {[
                  `${policyCount} policies across 12 categories`,
                  'A three-phase rollout order, so you know what to write first',
                  'The 15 sections a finished policy document should contain',
                  `Which ${operatedCount} of them a system can actually operate for you`,
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-ink-700">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* The source's own caveat, carried over rather than quietly
                  dropped. It is the honest framing and it costs nothing. */}
              <p className="mt-8 border-l-2 border-marigold pl-5 text-[0.95rem] leading-relaxed text-ink-600">
                This is a starting framework, not legal advice. Each policy
                still has to become a company-specific document once you have
                settled headcount, states, industry and working model, and
                some apply only above particular legal thresholds.
              </p>
            </div>

            <div data-h="card" style={{ '--d': '240ms' } as React.CSSProperties} className="lg:col-span-5 lg:pt-10">
              <div className="rounded-[28px] bg-white p-6 shadow-[0_1px_2px_rgb(11_22_51/0.05),0_40px_80px_-40px_rgb(11_22_51/0.35)] ring-1 ring-ink-900/[0.06] sm:p-9">
                <h2 className="text-[1.6rem] leading-tight">Get the PDF</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Two fields. The whole list is on this page either way, so the
                  PDF is just the version you can circulate.
                </p>
                <div className="mt-5">
                  <AssetDownloadForm slug="policy-handbook" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── The full list ────────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="The policies">
        <SectionHeading
          eyebrow="The full list"
          title="Every policy, and who operates it"
          lede={`Marked entries are the ones EZER runs as a live process rather than a document in a folder: ${operatedCount} of ${policyCount}. The unmarked ones are yours to write; no software writes a code of conduct.`}
          align="left"
        />

        <div className="mt-12 space-y-12">
          {policyCategories.map((category) => (
            <div key={category.n} data-reveal="">
              <div className="flex items-baseline gap-4 border-b-2 border-ink-900 pb-4">
                <span className="ez-num ez-kicker text-brand-600">
                  {String(category.n).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[1.4rem] font-[640] leading-tight tracking-[-0.03em] text-ink-900 [font-stretch:106%] sm:text-[1.6rem]">{category.name}</h3>
                <span className="ml-auto shrink-0 whitespace-nowrap text-[0.82rem] text-ink-500">
                  {category.policies.length} policies
                </span>
              </div>

              <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {category.policies.map((p) => (
                  <li key={p.name}>
                    <p className="text-[1rem] font-semibold text-ink-900">{p.name}</p>
                    <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-600">
                      {p.detail}
                    </p>
                    {p.ezer && (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[0.7rem] font-semibold text-brand-700">
                        <Icon name="check" className="h-3 w-3" />
                        {p.ezer}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Rollout order ────────────────────────────────────────────────── */}
      <Section tone="tint" ariaLabel="Rollout order">
        <SectionHeading
          eyebrow="Where to start"
          title="You do not write all of them at once"
          lede="The most useful thing in the handbook is the order. A company with no policy library needs a first ten, not a list of seventy-five."
          align="left"
        />

        <ol className="mt-10 grid gap-5 lg:grid-cols-3">
          {rolloutPhases.map((phase, i) => (
            <li
              key={phase.phase}
              data-reveal=""
              style={{ transitionDelay: `${i * 45}ms` }}
              className="border-t-2 border-ink-900 pt-6"
            >
              <p className="ez-kicker text-brand-600">
                {phase.phase}
              </p>
              <h3 className="mt-3 font-display text-[1.45rem] font-[640] tracking-[-0.025em] text-ink-900 [font-stretch:104%]">{phase.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {phase.detail}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-[24px] bg-white p-7 ring-1 ring-ink-900/[0.06] sm:p-9">
          <h3 className="text-base font-bold">
            What a finished policy document contains
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
            The handbook is a list of titles. Each one becomes a real document
            only when it carries all fifteen of these.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {policyDocumentFormat.map((part) => (
              <li
                key={part}
                className="rounded-full bg-paper px-3 py-1.5 text-[0.82rem] font-medium text-ink-700"
              >
                {part}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        title="The policies are yours. The operating them is ours."
        lede={`${operatedCount} of these stop being documents and become a running process the day EZER goes live: leave balances, attendance, payroll, statutory filings, full & final and the compliance calendar.`}
      />
    </PageTransition>
  )
}
