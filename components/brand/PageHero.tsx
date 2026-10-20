import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from './Bars'
import { cn } from '@/lib/cn'
import type { ShapeName } from '@/lib/particles/shapes'

/* ============================================================================
 * The opening of every inner page.
 *
 * One component so the site's pages share a frame — breadcrumb, eyebrow,
 * display headline, one paragraph, actions — while each kind of page gets
 * its own composition and its own entrance:
 *
 *   product    split: words left, the product picture right. The picture
 *              rises in after the headline. Feature pages, pricing.
 *   ledger     the headline set very large across the grid, with a ruled
 *              row of facts beneath it. Compliance, industries.
 *   editorial  a narrow reading measure, nothing beside it. About, blog,
 *              the handbook, legal.
 *   direct     compact. The form below it is the point, so the hero gets out
 *              of the way. Contact, book a demo.
 *
 * The entrance reuses the home hero's keyframes (.ez-hero in site.css): the
 * headline lines rise out of their baselines and the rest settles in after.
 * Pure CSS, so it plays at first paint on a hard load; on a client-side
 * navigation the page's view transition plays alongside it.
 *
 * `title` takes an array to set the line breaks by hand — each entry is one
 * masked line. A plain string is one line that wraps naturally.
 * ========================================================================= */
export type Crumb = { name: string; href?: string }

export function PageHero({
  kind = 'product',
  crumbs = [],
  eyebrow,
  title,
  lede,
  actions,
  aside,
  facts,
  tone = 'paper',
  decor,
  stage,
  stageChips = [],
  children,
}: {
  kind?: 'product' | 'ledger' | 'editorial' | 'direct'
  crumbs?: Crumb[]
  eyebrow?: string
  title: React.ReactNode | React.ReactNode[]
  lede?: React.ReactNode
  actions?: React.ReactNode
  aside?: React.ReactNode
  facts?: { value: string; label: string }[]
  tone?: 'paper' | 'white' | 'navy'
  /* Moving doodles for the hero's empty corner (desktop only). */
  decor?: React.ReactNode
  /* A particle formation for the right-hand side (product kind), with
     optional glass chips floating round it. Replaces `aside` when given. */
  stage?: ShapeName
  stageChips?: string[]
  children?: React.ReactNode
}) {
  const lines = Array.isArray(title) ? title : [title]
  if (stage) {
    kind = 'product'
    aside = (
      <div data-live="" aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[min(34rem,70vh)]">
        <div data-stage={stage} data-tone="light" className="absolute inset-[4%]" />
        {stageChips.map((c, i) => {
          const a = (i / stageChips.length) * Math.PI * 2 - Math.PI / 2.6
          return (
            <div
              key={c}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + 47 * Math.cos(a)}%`, top: `${50 + 45 * Math.sin(a)}%` }}
            >
              <div data-h="card" style={{ '--d': `${400 + i * 110}ms` } as React.CSSProperties}>
                <div className="ez-bob" style={{ '--dur': `${6 + (i % 4)}s`, '--d': `${-i}s`, '--bob': '-8px' } as React.CSSProperties}>
                  <span className="ez-glass block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold text-ink-800">{c}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  const dark = tone === 'navy'

  const titleSize = {
    product: 'text-[2.7rem] sm:text-[3.6rem] lg:text-[4.4rem]',
    ledger: 'text-[2.9rem] sm:text-[4.4rem] lg:text-[5.8rem]',
    editorial: 'text-[2.6rem] sm:text-[3.6rem] lg:text-[4.6rem]',
    direct: 'text-[2.4rem] sm:text-[3.2rem] lg:text-[3.8rem]',
  }[kind]

  const pad = {
    product: 'pt-10 pb-16 sm:pt-14 lg:pb-24',
    ledger: 'pt-10 pb-0 sm:pt-14',
    editorial: 'pt-10 pb-16 sm:pt-14 lg:pb-20',
    direct: 'pt-10 pb-10 sm:pt-12 lg:pb-12',
  }[kind]

  const words = (
    <div>
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className={cn('mb-8 text-[0.85rem]', dark ? 'text-white/60' : 'text-ink-500')}>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className={cn('ez-link', dark ? 'hover:text-white' : 'hover:text-ink-900')}>
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.name} className="flex items-center gap-2">
                <span aria-hidden="true" className={dark ? 'text-white/30' : 'text-ink-300'}>/</span>
                {c.href ? (
                  <Link href={c.href} className={cn('ez-link', dark ? 'hover:text-white' : 'hover:text-ink-900')}>
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className={cn('font-medium', dark ? 'text-white' : 'text-ink-900')}>
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {eyebrow && (
        <Eyebrow animate tone={dark ? 'onDark' : 'brand'}>
          {eyebrow}
        </Eyebrow>
      )}

      <h1
        className={cn(
          'mt-6 leading-[0.98] tracking-[-0.04em]',
          titleSize,
          dark && '!text-white',
          kind === 'ledger' && '[font-stretch:112%] font-[680]',
        )}
      >
        {lines.map((line, i) => (
          <span key={i} className="ez-line">
            <span>{line}</span>
          </span>
        ))}
      </h1>

      {lede && (
        /* Painted in the first frame: the lede is usually the LCP element,
           so it is never held behind a fade. */
        <div
          className={cn(
            'mt-7 text-[1.15rem] leading-relaxed sm:text-xl sm:leading-[1.55]',
            kind === 'ledger' ? 'max-w-2xl' : 'max-w-[38rem]',
            dark ? 'text-white/75' : 'text-ink-600',
          )}
        >
          {lede}
        </div>
      )}

      {actions && (
        <div
          data-h="fade"
          style={{ '--d': '360ms' } as React.CSSProperties}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        >
          {actions}
        </div>
      )}
    </div>
  )

  return (
    <section
      data-scene=""
      className={cn(
        'ez-hero relative overflow-hidden',
        tone === 'paper' && 'bg-paper',
        tone === 'white' && 'bg-white',
        tone === 'navy' && 'bg-navy text-white',
      )}
    >
      <Container className={cn('relative', pad)}>
        {decor && (
          <div aria-hidden="true" className="pointer-events-none absolute right-8 top-10 hidden lg:block">
            {decor}
          </div>
        )}
        {kind === 'product' && aside ? (
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">{words}</div>
            <div data-h="card" style={{ '--d': '240ms' } as React.CSSProperties} className="lg:col-span-6">
              {aside}
            </div>
          </div>
        ) : kind === 'editorial' ? (
          <div className="max-w-4xl">{words}</div>
        ) : (
          words
        )}

        {facts && facts.length > 0 && (
          <dl
            data-h="fade"
            style={{ '--d': '560ms' } as React.CSSProperties}
            className={cn(
              'mt-16 grid grid-cols-2 border-t sm:grid-cols-4',
              dark ? 'border-white/15' : 'border-ink-900/10',
            )}
          >
            {facts.map((f, i) => (
              <div
                key={f.label}
                className={cn(
                  'py-6 pr-4',
                  i % 2 === 1 && 'border-l pl-5',
                  i > 1 && 'border-t sm:border-t-0',
                  i > 0 && 'sm:border-l sm:pl-6',
                  dark ? 'border-white/15' : 'border-ink-900/10',
                )}
              >
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className={cn('block font-display text-[1.9rem] font-[680] leading-none tracking-[-0.04em] [font-stretch:110%] sm:text-[2.3rem]', dark ? 'text-white' : 'text-ink-900')}>
                    {f.value}
                  </span>
                  <span className={cn('mt-2 block text-[0.92rem] leading-snug', dark ? 'text-white/60' : 'text-ink-500')}>
                    {f.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
        {children}
      </Container>
    </section>
  )
}
