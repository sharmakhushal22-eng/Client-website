import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { MeshField } from '@/components/ui/MeshField'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { articles, contentHub } from '@/content/articles'

export const metadata: Metadata = pageMetadata({
  title: 'Blog — Indian payroll and compliance, explained',
  description:
    'What changed in the four Labour Codes, how PF, ESIC and PT actually differ, and how to help employees choose between the old and new tax regime.',
  path: '/blog',
})

/* ============================================================================
 * The content hub index.
 *
 * In the source document these three articles live inside hidden <template>
 * elements and are cloned into a modal. Real routes instead: a modal has no
 * URL, so it cannot be linked in a sales email, cited by a consultant, or
 * found by someone searching "new wage definition PF" — which is the entire
 * reason to write a compliance explainer.
 *
 * The article text itself is unchanged.
 * ========================================================================= */

export default function BlogPage() {
  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />

      {/* The mesh field, same treatment as the workplace strip — this page is
          otherwise a plain list and needs the same ground the rest of the
          site sits on. */}
      <section className="relative overflow-hidden bg-canvas py-14 sm:py-16 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <MeshField idPrefix="blg" />
          <span className="ez-sweep absolute inset-y-0 -left-1/4 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.6),transparent)]" />
          <span className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-canvas)_0%,transparent_13%,transparent_87%,var(--color-canvas)_100%)]" />
        </div>

        <Container className="relative">
          <div className="relative mx-auto max-w-2xl text-center">
            {/* The same long-falloff clearing used elsewhere on artwork — an
                explicit ellipse, because closest-side sizes to the short axis
                of a wide box and stops before the ends of the longest line. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[20%] -inset-y-24 rounded-[50%] bg-[radial-gradient(ellipse_58%_62%_at_50%_50%,rgb(255_255_255/0.96)_0%,rgb(255_255_255/0.94)_30%,rgb(255_255_255/0.84)_48%,rgb(255_255_255/0.64)_62%,rgb(255_255_255/0.38)_75%,rgb(255_255_255/0.15)_88%,transparent_100%)]"
            />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
                {contentHub.eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[2.75rem]">
                {contentHub.title}
              </h1>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-700">
                {contentHub.lede}
              </p>
            </div>
          </div>

          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {articles.map((a, i) => (
              <li
                key={a.slug}
                data-reveal=""
                style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
                className="ez-tilt group relative flex flex-col rounded-2xl bg-surface p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-16px_rgba(16,24,40,0.3)] ring-1 ring-ink-200 transition hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_28px_54px_-20px_rgba(16,24,40,0.4)] hover:ring-brand-200"
              >
                <div className="flex items-center gap-3 text-[0.78rem] font-bold uppercase tracking-[0.1em]">
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700 ring-1 ring-brand-100">
                    {a.category}
                  </span>
                  <span className="text-ink-500">{a.readingTime}</span>
                </div>

                <h2 className="mt-4 text-[1.12rem] font-bold leading-snug text-ink-900">
                  {/* The whole card is the target, via the stretched link —
                      one tab stop rather than a card and a redundant "read
                      more" beside it. */}
                  <Link
                    href={`/blog/${a.slug}`}
                    className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
                  >
                    {a.title}
                  </Link>
                </h2>

                <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-ink-700">
                  {a.excerpt}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-brand-700">
                  Read the article
                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Elsewhere"
          title="More on the way"
          lede="Two channels we are building out. Neither is live yet, and we would rather say that than link you to an empty page."
        />
        <ul className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          {contentHub.channels.map((c) => (
            <li
              key={c.name}
              data-reveal=""
              className="rounded-2xl bg-canvas p-6 ring-1 ring-ink-200"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <h3 className="text-[1.02rem] font-bold text-ink-900">
                  {c.name}
                </h3>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-amber-800 ring-1 ring-amber-200">
                  {c.status}
                </span>
              </div>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-700">
                {c.detail}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  )
}
