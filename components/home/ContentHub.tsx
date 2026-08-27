import Link from 'next/link'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { articles, contentHub } from '@/content/articles'

/* ============================================================================
 * The content hub, on the home page.
 *
 * Three article cards and the two channels — the same block as the reference
 * document, except the cards are links to real routes rather than triggers
 * that clone a hidden <template> into a modal. Same copy, addressable.
 *
 * "From the blog" is a heading in the reference; here the section heading
 * already says it, so the label would be a second title for one list.
 * ========================================================================= */
export function ContentHub() {
  return (
    <Section tone="white" id="content-hub">
      <SectionHeading
        eyebrow={contentHub.eyebrow}
        title={contentHub.title}
        lede={contentHub.lede}
      />

      <h3 className="mt-10 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-brand-700">
        From the blog
      </h3>

      <ul className="mt-4 grid gap-5 lg:grid-cols-3">
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

            <h3 className="mt-4 text-[1.08rem] font-bold leading-snug text-ink-900">
              {/* Stretched link — the whole card is the target, so this is one
                  tab stop rather than a card plus a redundant "read more". */}
              <Link
                href={`/blog/${a.slug}`}
                className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
              >
                {a.title}
              </Link>
            </h3>

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

      <ul className="mt-5 grid gap-5 sm:grid-cols-2">
        {contentHub.channels.map((c) => (
          <li
            key={c.name}
            data-reveal=""
            className="flex items-center gap-4 rounded-2xl bg-surface/70 p-5 ring-1 ring-ink-200"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Icon name={c.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[0.98rem] font-bold text-ink-900">
                  {c.name}
                </h3>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-amber-800 ring-1 ring-amber-200">
                  {c.status}
                </span>
              </div>
              <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-700">
                {c.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
