import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
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
    `${policyCount} HR, IT and compliance policies an Indian private limited company needs — across 12 categories, with a recommended rollout order. Free PDF.`,
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
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Policy handbook', path: '/resources/policy-handbook' },
          ]),
        ]}
      />

      {/* ── Hero + gate ──────────────────────────────────────────────────── */}
      <section className="bg-brand-50 py-10 sm:py-14 lg:py-16">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-ink-600">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="font-medium text-ink-900">Policy handbook</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-brand-700 ring-1 ring-brand-200">
                <Icon name="file" className="h-3 w-3" />
                Free resource
              </p>

              <h1 className="mt-4 text-[2rem] font-bold leading-[1.12] sm:text-4xl lg:text-[2.6rem]">
                The {policyCount} policies an Indian company is expected to have
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                Employment, leave, recruitment, payroll, conduct, IT security,
                welfare, operations, exit and statutory compliance — organised
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
              <p className="mt-7 flex items-start gap-2.5 rounded-lg bg-surface px-5 py-4 text-sm leading-relaxed text-ink-600 ring-1 ring-brand-100">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                This is a starting framework, not legal advice. Each policy
                still has to become a company-specific document once you have
                settled headcount, states, industry and working model — and
                some apply only above particular legal thresholds.
              </p>
            </div>

            <div className="lg:pt-10">
              <div className="rounded-xl bg-surface p-6 shadow-floating ring-1 ring-ink-200 sm:p-7">
                <h2 className="text-lg font-bold">Get the PDF</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Two fields. The whole list is on this page either way — the
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
          lede={`Marked entries are the ones EZER runs as a live process rather than a document in a folder — ${operatedCount} of ${policyCount}. The unmarked ones are yours to write; no software writes a code of conduct.`}
          align="left"
        />

        <div className="mt-12 space-y-12">
          {policyCategories.map((category) => (
            <div key={category.n} data-reveal="">
              <div className="flex items-baseline gap-3 border-b border-ink-200 pb-3">
                <span className="font-mono text-sm font-bold text-brand-600">
                  {String(category.n).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-bold">{category.name}</h3>
                <span className="ml-auto text-xs text-ink-600">
                  {category.policies.length} policies
                </span>
              </div>

              <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {category.policies.map((p) => (
                  <li key={p.name}>
                    <p className="text-[0.95rem] font-bold text-ink-900">{p.name}</p>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-ink-600">
                      {p.detail}
                    </p>
                    {p.ezer && (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-1 text-[0.68rem] font-bold text-brand-700 ring-1 ring-brand-100">
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
              className="rounded-xl bg-surface p-6 ring-1 ring-brand-100"
            >
              <p className="inline-flex rounded-full bg-brand-600 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-on-accent">
                {phase.phase}
              </p>
              <h3 className="mt-4 text-lg font-bold">{phase.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {phase.detail}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-xl bg-surface p-6 ring-1 ring-brand-100 sm:p-7">
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
                className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-brand-100"
              >
                {part}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        title="The policies are yours. The operating them is ours."
        lede={`${operatedCount} of these stop being documents and become a running process the day EZER goes live — leave balances, attendance, payroll, statutory filings, full & final and the compliance calendar.`}
      />
    </>
  )
}
