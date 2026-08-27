import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { MeshField } from '@/components/ui/MeshField'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { articles, getArticle } from '@/content/articles'
import { site } from '@/site.config'

/* One static route per article — the set is known at build time, so there is
 * no reason to render these on demand. */
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
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
  const article = getArticle(slug)
  if (!article) notFound()

  const others = articles.filter((a) => a.slug !== article.slug)

  return (
    <>
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
        <header className="relative overflow-hidden bg-canvas py-14 sm:py-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <MeshField idPrefix="art" />
            <span className="ez-sweep absolute inset-y-0 -left-1/4 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.6),transparent)]" />
            <span className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-canvas)_0%,transparent_13%,transparent_88%,var(--color-canvas)_100%)]" />
          </div>

          <Container className="relative">
            <div className="relative mx-auto max-w-3xl">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-[16%] -inset-y-20 rounded-[50%] bg-[radial-gradient(ellipse_58%_62%_at_50%_50%,rgb(255_255_255/0.96)_0%,rgb(255_255_255/0.94)_30%,rgb(255_255_255/0.84)_48%,rgb(255_255_255/0.64)_62%,rgb(255_255_255/0.38)_75%,rgb(255_255_255/0.15)_88%,transparent_100%)]"
              />
              <div className="relative">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-brand-700 hover:text-brand-800"
                >
                  <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
                  All articles
                </Link>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.78rem] font-bold uppercase tracking-[0.1em]">
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700 ring-1 ring-brand-100">
                    {article.category}
                  </span>
                  <span className="text-ink-500">{article.readingTime}</span>
                  <span className="text-ink-500">EZER Team</span>
                </div>

                <h1
                  data-reveal=""
                  className="mt-4 text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[2.6rem]"
                >
                  {article.title}
                </h1>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-700">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </Container>
        </header>

        <div className="bg-surface py-12 sm:py-14 lg:py-16">
          <Container>
            {/* max-w-[68ch]: measure, not a breakpoint. Long-form statutory
                prose is unreadable across a full container width. */}
            <div className="mx-auto max-w-[68ch]">
              {article.blocks.map((b, i) => {
                switch (b.t) {
                  case 'h2':
                    return (
                      <h2
                        key={i}
                        className="mt-11 text-[1.35rem] font-bold leading-snug text-ink-900 first:mt-0 sm:text-[1.45rem]"
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
                        className="mt-8 rounded-2xl border-l-4 border-brand-600 bg-brand-50 p-6 text-[1.06rem] font-semibold leading-relaxed text-ink-900"
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
                        className="mt-6 rounded-2xl bg-brand-50 p-5 text-[1rem] leading-relaxed text-ink-800 ring-1 ring-brand-100"
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
                        className="mt-3 flex gap-3 rounded-xl border-l-4 border-amber-400 bg-amber-50/70 p-4 text-[0.97rem] leading-relaxed text-ink-800"
                      >
                        <Icon
                          name="alert"
                          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                        />
                        <span>
                          <strong className="font-bold text-ink-900">
                            {b.lead}
                          </strong>{' '}
                          — {b.x}
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
                            className="rounded-xl bg-canvas p-4 ring-1 ring-ink-200"
                          >
                            <span className="block text-[1.15rem] font-bold leading-tight text-brand-700">
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
                        className="mt-5 overflow-x-auto rounded-2xl ring-1 ring-ink-200"
                      >
                        <table className="w-full min-w-[26rem] border-collapse text-left text-[0.95rem]">
                          <tbody>
                            {b.rows.map((row, r) => (
                              <tr
                                key={r}
                                className={
                                  row.head
                                    ? 'bg-brand-50'
                                    : 'border-t border-ink-200'
                                }
                              >
                                {row.cells.map((cell, c) =>
                                  row.head ? (
                                    <th
                                      key={c}
                                      scope="col"
                                      className="px-4 py-3 text-[0.8rem] font-bold uppercase tracking-[0.08em] text-brand-800"
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
              <div className="ez-tilt mt-12 rounded-2xl bg-brand-600 p-7 text-center shadow-[0_20px_45px_-22px_rgba(37,99,235,0.9)]">
                <h2 className="text-[1.2rem] font-bold leading-snug text-white">
                  {article.cta.title}
                </h2>
                <p className="mx-auto mt-2.5 max-w-lg text-[0.95rem] leading-relaxed text-brand-50">
                  {article.cta.body}
                </p>
                <Button href="/book-a-demo" variant="onDark" className="group mt-5">
                  {article.cta.label}
                  <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>

              <p className="mt-6 rounded-2xl bg-canvas p-6 text-[0.92rem] leading-relaxed text-ink-700 ring-1 ring-ink-200">
                This is general information about Indian payroll and statutory
                rules, not legal or tax advice. Rules are still being notified
                state by state — check your own position with your consultant
                before you act on it.
              </p>
            </div>
          </Container>
        </div>

        {others.length > 0 && (
          <section className="bg-canvas py-12 sm:py-14" aria-label="More articles">
            <Container>
              <h2 className="text-[1.15rem] font-bold text-ink-900">
                Keep reading
              </h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                {others.map((a) => (
                  <li
                    key={a.slug}
                    className="ez-tilt group relative rounded-2xl bg-surface p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-16px_rgba(16,24,40,0.3)] ring-1 ring-ink-200 transition hover:ring-brand-200"
                  >
                    <p className="text-[0.78rem] font-bold uppercase tracking-[0.1em] text-brand-700">
                      {a.category}
                    </p>
                    <h3 className="mt-2 text-[1.05rem] font-bold leading-snug text-ink-900">
                      <Link
                        href={`/blog/${a.slug}`}
                        className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
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
    </>
  )
}
