import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/Section'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Arrow } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { contentHub } from '@/content/articles'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = pageMetadata({
  title: 'Blog: Indian payroll and compliance, explained',
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

/* Revalidated rather than fully static: the list now includes anything
   published from the admin panel, and an editor should not need a deploy to
   see their post appear. Sixty seconds is short enough to feel immediate and
   long enough that the database is not queried on every visit. */
export const revalidate = 60

export default async function BlogPage() {
  const articles = await getAllPosts()

  const [lead, ...rest] = articles

  return (
    <PageTransition kind="editorial">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />

      <PageHero
        kind="product"
        stage="wave"
        stageChips={['Compliance', 'Payroll', 'Tax']}
        crumbs={[{ name: 'Blog' }]}
        eyebrow={contentHub.eyebrow}
        title={contentHub.title}
        lede={contentHub.lede}
      />

      <section aria-label="Articles" className="bg-paper pb-16 sm:pb-24">
        <Container>
          {/* The newest article leads, set large; the rest follow as rows.
              Each row is one link — a stretched target, one tab stop. */}
          {lead && (
            <article data-m="rise" className="group relative grid gap-6 border-t-2 border-ink-900 py-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-8">
                <p className="ez-kicker flex gap-3 text-ink-500">
                  <span className="text-brand-600">{lead.category}</span>
                  <span>{lead.readingTime}</span>
                </p>
                <h2 className="mt-4 text-[2rem] leading-[1.08] sm:text-[2.8rem]">
                  <Link
                    href={`/blog/${lead.slug}`}
                    className="transition-colors after:absolute after:inset-0 group-hover:text-brand-700 focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-brand-600"
                  >
                    {lead.title}
                  </Link>
                </h2>
              </div>
              <div className="lg:col-span-4">
                <p className="text-[1.02rem] leading-relaxed text-ink-600">{lead.excerpt}</p>
                <span className="ez-press mt-5 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-brand-700">
                  Read the article
                  <Arrow />
                </span>
              </div>
            </article>
          )}

          <ul className="border-t border-ink-900/10">
            {rest.map((a) => (
              <li key={a.slug} data-m="rise" className="group relative grid gap-3 border-b border-ink-900/10 py-8 lg:grid-cols-12 lg:gap-10">
                <p className="ez-kicker flex gap-3 text-ink-500 lg:col-span-3 lg:flex-col lg:gap-1 lg:pt-2">
                  <span className="text-brand-600">{a.category}</span>
                  <span>{a.readingTime}</span>
                </p>
                <div className="lg:col-span-8">
                  <h2 className="text-[1.5rem] leading-snug sm:text-[1.8rem]">
                    <Link
                      href={`/blog/${a.slug}`}
                      className="transition-colors after:absolute after:inset-0 group-hover:text-brand-700 focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-brand-600"
                    >
                      {a.title}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-ink-600">{a.excerpt}</p>
                </div>
                <span aria-hidden="true" className="hidden text-ink-400 transition-[color,transform] duration-500 [transition-timing-function:var(--m-settle)] group-hover:translate-x-1 group-hover:text-brand-700 lg:col-span-1 lg:block lg:justify-self-end lg:pt-3">
                  <Arrow className="h-5 w-5" />
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="More on the way" className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Elsewhere"
            title="More on the way"
            lede="Two channels we are building out. Neither is live yet, and we would rather say that than link you to an empty page."
          />
          <ul className="mt-10 grid border-t border-ink-900/10 sm:grid-cols-2">
            {contentHub.channels.map((c, i) => (
              <li key={c.name} className={`border-b border-ink-900/10 py-7 sm:pr-8 ${i % 2 === 1 ? 'sm:border-l sm:pl-8' : ''}`}>
                <p className="flex flex-wrap items-center gap-3">
                  <Icon name={c.icon} className="h-5 w-5 text-brand-600" />
                  <span className="text-[1.1rem] font-semibold text-ink-900">{c.name}</span>
                  <span className="rounded-full bg-marigold/20 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#7a4b00]">{c.status}</span>
                </p>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-600">{c.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </PageTransition>
  )
}
