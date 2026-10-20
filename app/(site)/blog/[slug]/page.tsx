import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Button, Arrow } from '@/components/ui/Button'
import { PageTransition } from '@/components/brand/PageTransition'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { getAllPosts, getPost, repoSlugs } from '@/lib/blog'
import { DoodleCluster } from '@/components/graphics/Doodles'
import { site } from '@/site.config'

/* One static route per article — the set is known at build time, so there is
 * no reason to render these on demand. */
export const revalidate = 60

/* Only the repo articles are known at build time. dynamicParams lets a slug
   that exists solely in the database render on first request instead of
   404ing, which is what makes "publish" in the admin take effect without a
   deploy. */
export const dynamicParams = true

export function generateStaticParams() {
  return repoSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getPost(slug)
  if (!article)
    return pageMetadata({
      title: 'Article not found',
      description: 'This article does not exist. See the full list on the EZER blog.',
      path: '/blog',
      noIndex: true,
    })

  return pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${article.slug}`,
  })
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getPost(slug)
  if (!article) notFound()

  const others = (await getAllPosts()).filter((a) => a.slug !== article.slug)

  return (
    <PageTransition kind="editorial">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: article.title, path: `/blog/${article.slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            articleSection: article.category,
            author: { '@type': 'Organization', name: site.name },
            publisher: { '@type': 'Organization', name: site.name },
            mainEntityOfPage: `${site.url}/blog/${article.slug}`,
          },
        ]}
      />

      <article>
        <header className="ez-hero bg-paper pb-14 pt-10 sm:pt-14 lg:pb-20">
          <Container className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute right-6 top-6 hidden xl:block">
              <DoodleCluster set="reading" />
            </div>
            <div className="mx-auto max-w-[68ch] lg:max-w-4xl xl:mx-0 xl:max-w-[50rem]">
              <Link
                href="/blog"
                className="ez-press inline-flex items-center gap-2 text-[0.9rem] font-semibold text-brand-700"
              >
                <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
                <span className="ez-link">All articles</span>
              </Link>

              <p className="ez-kicker mt-8 flex flex-wrap gap-x-4 gap-y-1 text-ink-500">
                <span className="text-brand-600">{article.category}</span>
                <span>{article.readingTime}</span>
                <span>EZER Team</span>
              </p>

              <h1 className="mt-5 text-[2.3rem] leading-[1.04] tracking-[-0.035em] sm:text-[3.2rem] lg:text-[3.9rem]">
                <span className="ez-line"><span>{article.title}</span></span>
              </h1>
              <p className="mt-6 max-w-3xl text-[1.15rem] leading-relaxed text-ink-600 sm:text-xl">
                {article.excerpt}
              </p>
            </div>
          </Container>
        </header>

        <div className="bg-white py-14 sm:py-16 lg:py-20">
          <Container>
            {/* max-w-[68ch]: measure, not a breakpoint. Long-form statutory
                prose is unreadable across a full container width. */}
            <div className="ez-longform mx-auto max-w-[68ch]">
              {article.blocks.map((b, i) => {
                switch (b.t) {
                  case 'h2':
                    return (
                      <h2
                        key={i}
                        className="mt-12 text-[1.6rem] leading-snug text-ink-900 first:mt-0 sm:text-[1.85rem]"
                      >
                        {b.x}
                      </h2>
                    )
                  case 'h3':
                    return (
                      <h3
                        key={i}
                        className="mt-8 text-[1.08rem] font-bold leading-snug text-ink-900"
                      >
                        {b.x}
                      </h3>
                    )
                  case 'p':
                    return (
                      <p
                        key={i}
                        className="mt-4 text-[1.02rem] leading-[1.75] text-ink-800"
                      >
                        {b.x}
                      </p>
                    )
                  /* The one pulled-out claim per article. Bigger and on its
                     own ground, because in the source it is the sentence the
                     rest of the piece is arguing toward. */
                  case 'stat':
                    return (
                      <p
                        key={i}
                        className="my-10 border-l-2 border-marigold pl-6 font-display text-[1.35rem] font-[620] leading-[1.4] tracking-[-0.015em] text-ink-900 [font-stretch:104%] sm:text-[1.5rem]"
                      >
                        {b.x}
                      </p>
                    )
                  /* The pulled-out consequence — bolded lead-in, then what
                     it means. Brand-tinted, because in the source these are
                     the "read this bit twice" lines. */
                  case 'callout':
                    return (
                      <p
                        key={i}
                        className="mt-6 rounded-[18px] bg-paper p-6 text-[1rem] leading-relaxed text-ink-800"
                      >
                        <strong className="font-bold text-ink-900">
                          {b.lead}
                        </strong>{' '}
                        {b.x}
                      </p>
                    )
                  /* The "teams get this wrong" rows. Amber rather than brand:
                     these are warnings, and painting them in the house colour
                     would make them read as product claims. */
                  case 'mistake':
                    return (
                      <p
                        key={i}
                        className="mt-3 flex gap-3 rounded-[14px] bg-amber-50 p-4 text-[0.97rem] leading-relaxed text-ink-800"
                      >
                        <Icon
                          name="alert"
                          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                        />
                        <span>
                          <strong className="font-bold text-ink-900">
                            {b.lead}
                          </strong>{' '}
                          {b.x}
                        </span>
                      </p>
                    )
                  case 'ul':
                  case 'ol': {
                    const List = b.t === 'ol' ? 'ol' : 'ul'
                    return (
                      <List
                        key={i}
                        className={
                          'mt-4 space-y-2.5 pl-6 text-[1.02rem] leading-[1.75] text-ink-800 ' +
                          (b.t === 'ol' ? 'list-decimal' : 'list-disc')
                        }
                      >
                        {b.items.map((item, j) => (
                          <li key={j} className="pl-1.5 marker:text-brand-600">
                            {item}
                          </li>
                        ))}
                      </List>
                    )
                  }
                  /* The rate/ceiling/threshold trio that heads each statutory
                     section. Three figures the reader is scanning for, so
                     they get their own row rather than a sentence. */
                  case 'pills':
                    return (
                      <ul
                        key={i}
                        className="mt-5 grid gap-3 sm:grid-cols-3"
                      >
                        {b.pills.map((pill) => (
                          <li
                            key={pill.label}
                            className="border-t-2 border-ink-900 pt-3"
                          >
                            <span className="block font-display text-[1.5rem] font-[660] leading-tight tracking-[-0.02em] text-ink-900 [font-stretch:106%]">
                              {pill.value}
                            </span>
                            <span className="mt-1 block text-[0.85rem] leading-snug text-ink-700">
                              {pill.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )
                  /* Slab tables and the three-way comparison. The wrapper
                     scrolls on its own so a wide table never makes the whole
                     page scroll sideways on a phone. */
                  case 'table':
                    return (
                      <div
                        key={i}
                        className="mt-6 overflow-x-auto rounded-[16px] ring-1 ring-ink-900/10"
                      >
                        <table className="w-full min-w-[26rem] border-collapse text-left text-[0.95rem]">
                          <tbody>
                            {b.rows.map((row, r) => (
                              <tr
                                key={r}
                                className={
                                  row.head
                                    ? 'bg-paper'
                                    : 'border-t border-ink-900/10'
                                }
                              >
                                {row.cells.map((cell, c) =>
                                  row.head ? (
                                    <th
                                      key={c}
                                      scope="col"
                                      className="px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-500"
                                    >
                                      {cell}
                                    </th>
                                  ) : (
                                    <td
                                      key={c}
                                      className={
                                        'px-4 py-3 text-ink-800 ' +
                                        (c === 0 ? 'font-semibold text-ink-900' : '')
                                      }
                                    >
                                      {cell}
                                    </td>
                                  ),
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                }
              })}

              {/* The article's own closing pitch, tied to what was just
                  read. It sits above the disclaimer, and above the generic
                  band below — a reader who got this far earns the specific
                  ask, not the site-wide one. */}
              <div className="mt-14 rounded-[24px] bg-navy p-8 text-white sm:p-10">
                <h2 className="text-[1.6rem] leading-snug !text-white">
                  {article.cta.title}
                </h2>
                <p className="mt-3 max-w-lg text-[1rem] leading-relaxed text-white/75">
                  {article.cta.body}
                </p>
                <Button href="/book-a-demo" variant="onDark" className="mt-6">
                  {article.cta.label}
                  <Arrow />
                </Button>
              </div>

              <p className="mt-6 text-[0.9rem] leading-relaxed text-ink-500">
                This is general information about Indian payroll and statutory
                rules, not legal or tax advice. Rules are still being notified
                state by state, so check your own position with your consultant
                before you act on it.
              </p>
            </div>
          </Container>
        </div>

        {others.length > 0 && (
          <section className="bg-paper py-14 sm:py-16" aria-label="More articles">
            <Container>
              <h2 className="text-[1.8rem] text-ink-900">Keep reading</h2>
              <ul className="mt-8 grid border-t border-ink-900/10 sm:grid-cols-2 sm:gap-x-10">
                {others.map((a) => (
                  <li
                    key={a.slug}
                    className="group relative border-b border-ink-900/10 py-6"
                  >
                    <p className="ez-kicker text-brand-600">
                      {a.category}
                    </p>
                    <h3 className="mt-2 text-[1.2rem] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
                      <Link
                        href={`/blog/${a.slug}`}
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-brand-600"
                      >
                        {a.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-700">
                      {a.excerpt}
                    </p>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        )}
      </article>

      <CtaBand />
    </PageTransition>
  )
}
