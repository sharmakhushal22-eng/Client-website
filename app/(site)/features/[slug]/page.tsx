import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/Section'
import { Button, Arrow } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Eyebrow } from '@/components/brand/Bars'
import { FeatureVisual } from '@/components/story/FeatureVisual'
import { RegimeCalculator } from '@/components/story/RegimeCalculator'
import { flags, taxCalculator } from '@/content/positioning'
import { ScreenshotFrame } from '@/components/ui/ScreenshotFrame'
import { StatutoryTable } from '@/components/sections/StatutoryTable'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { featurePages, getFeaturePage } from '@/content/features'

const demoLabel: Record<string, string> = {
  payroll: 'payroll',
  attendance: 'attendance',
  recruitment: 'hiring',
  ess: 'self-service',
  claims: 'claims',
}

/* Every feature page is known at build time, so they prerender as static
 * HTML — no server work per request (§8.3). */
export function generateStaticParams() {
  return featurePages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getFeaturePage(slug)
  if (!page) return {}

  return pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: `/features/${page.slug}`,
  })
}

/* Spec §4.3 skeleton, identical across all five pages:
 * 1 hero · 2 the problem · 3 what it does · 4 screenshots
 * 5 who it's for · 6 related modules · 7 CTA */
export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getFeaturePage(slug)
  if (!page) notFound()

  return (
    <PageTransition kind="product">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Features', path: '/features' },
            { name: page.name, path: `/features/${page.slug}` },
          ]),
          faqSchema(page.faqs),
        ]}
      />

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <PageHero
        kind="product"
        crumbs={[{ name: 'Features', href: '/features' }, { name: page.name }]}
        eyebrow={page.eyebrow}
        title={page.name}
        lede={
          <>
            <p className="font-medium text-ink-900">{page.promise}</p>
            <p className="mt-4 text-[1.05rem] leading-relaxed">{page.intro}</p>
          </>
        }
        actions={
          <>
            <Button href={`/book-a-demo?module=${page.slug}`} size="lg">
              {/* The module's own name, not its first word: the first word
                  produced "See employee in a demo" on the self-service page. */}
              See {demoLabel[page.slug] ?? 'it'} in a demo
              <Arrow />
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              See pricing
            </Button>
          </>
        }
        aside={
          page.screenshots[0]?.src ? (
            <ScreenshotFrame src={page.screenshots[0].src} alt={page.screenshots[0].alt} priority />
          ) : (
            <FeatureVisual slug={page.slug} />
          )
        }
      />

      {/* ── 2. The problem ───────────────────────────────────────────────── */}
      <section aria-label="The problem" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Eyebrow>Without a system</Eyebrow>
              <h2 className="mt-5 text-[2rem] leading-[1.06] sm:text-[2.5rem]">How this gets done today</h2>
            </div>
            <div data-m="rise" className="space-y-5 lg:col-span-7 lg:col-start-6">
              {page.problem.map((para, i) => (
                <p
                  key={para}
                  className={i === 0 ? 'text-[1.3rem] leading-[1.55] text-ink-800' : 'text-[1.05rem] leading-relaxed text-ink-600'}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3. What it does ──────────────────────────────────────────────── */}
      <section aria-label="Capabilities" className="bg-paper py-16 sm:py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="What it does" title={`Inside ${page.name.toLowerCase()}`} />
          <ol data-m="settle" className="mt-12 grid gap-x-10 sm:grid-cols-2">
            {page.capabilities.map((cap, i) => (
              <li key={cap.title} className="border-t border-ink-900/10 py-7">
                <p className="ez-num ez-kicker text-brand-600">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-[1.2rem] font-semibold leading-snug text-ink-900">{cap.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-600">{cap.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Payroll carries three extras the other pages do not — spec §4.3. */}
      {page.slug === 'payroll' && <StatutoryTable />}

      {/* Self-service carries the one working calculator on the site: the
          employee's own old-versus-new comparison, before they declare. */}
      {page.slug === 'ess' && flags.taxCalculatorLive && (
        <section id="regime" aria-labelledby="regime-title" className="bg-white py-16 sm:py-20 lg:py-28">
          <Container>
            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <Eyebrow>{taxCalculator.eyebrow}</Eyebrow>
                <h2 id="regime-title" className="mt-5 text-[2.1rem] leading-[1.06] sm:text-[2.7rem]">
                  {taxCalculator.title}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-ink-600">{taxCalculator.lede}</p>
                <dl className="mt-8 border-t border-ink-900/10">
                  {taxCalculator.points.map((p) => (
                    <div key={p.label} className="border-b border-ink-900/10 py-4">
                      <dt className="text-[1rem] font-semibold text-ink-900">{p.label}</dt>
                      <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink-600">{p.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 lg:sticky lg:top-28">
                <RegimeCalculator />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── 4. On screen ─────────────────────────────────────────────────────
          Real screenshots render the moment they exist. Until then the
          captions stand alone as "what the demo will show you": a placeholder
          frame on a page meant to sell the product read as unfinished. */}
      {page.screenshots.length > 1 && (
        <section aria-label="What you will see" className="bg-white py-16 sm:py-20 lg:py-24">
          <Container>
            <SectionHeading eyebrow="On the demo call" title="What you will see working" />
            {page.screenshots.slice(1).some((s) => s.src) ? (
              <div className="mt-12 space-y-16">
                {page.screenshots.slice(1).filter((s) => s.src).map((shot, i) => (
                  <div key={shot.title} data-m="wipe" className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className={i % 2 === 1 ? 'lg:order-last' : ''}>
                      <h3 className="text-xl font-semibold sm:text-2xl">{shot.title}</h3>
                      <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-600">{shot.caption}</p>
                    </div>
                    <ScreenshotFrame src={shot.src} alt={shot.alt} />
                  </div>
                ))}
              </div>
            ) : (
              <ol data-m="settle" className="mt-12 grid gap-x-10 lg:grid-cols-3">
                {page.screenshots.slice(1).map((shot) => (
                  <li key={shot.title} className="border-t-2 border-ink-900 pt-6">
                    <h3 className="font-display text-[1.35rem] font-[640] leading-snug tracking-[-0.02em] text-ink-900 [font-stretch:104%]">
                      {shot.title}
                    </h3>
                    <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-600">{shot.caption}</p>
                  </li>
                ))}
              </ol>
            )}
          </Container>
        </section>
      )}

      {/* ── 5. Who it's for ──────────────────────────────────────────────── */}
      <section aria-label="Who it is for" className="bg-paper-2 py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Who it’s for" title="What each person gets out of it" />
          <dl data-m="settle" className="mt-12 grid border-t border-ink-900/10 sm:grid-cols-2 lg:grid-cols-4">
            {page.personas.map((persona, i) => (
              <div
                key={persona.role}
                className={`border-b border-ink-900/10 py-7 pr-6 lg:border-b-0 ${i > 0 ? 'lg:border-l lg:pl-7' : ''} ${i % 2 === 1 ? 'sm:border-l sm:pl-7 lg:pl-7' : ''}`}
              >
                <dt className="flex items-center gap-3 text-[1.05rem] font-semibold text-ink-900">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-700 ring-1 ring-ink-900/[0.06]">
                    <Icon name={persona.icon} className="h-4 w-4" />
                  </span>
                  {persona.role}
                </dt>
                <dd className="mt-3 text-[0.98rem] leading-relaxed text-ink-600">{persona.benefit}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── 6. Related modules (internal links — SEO + discovery) ────────── */}
      <section aria-label="Related modules" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Works with"
            title="The modules this connects to"
            lede="These are not integrations. They are the same system reading the same data."
          />
          <ul className="mt-12 border-t border-ink-900/10">
            {page.related.map((rel) => (
              <li key={rel.slug} className="border-b border-ink-900/10">
                <Link
                  href={`/features/${rel.slug}`}
                  className="group grid items-baseline gap-2 py-6 sm:grid-cols-12 sm:gap-6"
                >
                  <span className="font-display text-[1.6rem] font-[640] leading-tight tracking-[-0.03em] text-ink-900 transition-colors [font-stretch:106%] group-hover:text-brand-700 sm:col-span-5 sm:text-[2rem]">
                    {rel.name}
                  </span>
                  <span className="text-[1rem] text-ink-600 sm:col-span-6">{rel.blurb}</span>
                  <span className="hidden justify-self-end text-ink-400 transition-[color,transform] duration-500 [transition-timing-function:var(--m-settle)] group-hover:translate-x-1 group-hover:text-brand-700 sm:col-span-1 sm:block">
                    <Arrow className="h-5 w-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Faq faqs={page.faqs} tone="tint" eyebrow="Questions" title={`About ${page.name.toLowerCase()}`} />

      {/* ── 7. CTA — for this specific module ────────────────────────────── */}
      <CtaBand
        title={`See ${page.name.toLowerCase()} on your own data`}
        lede={`Tell us your headcount and your states, and we will walk through ${page.name.toLowerCase()} against your actual setup rather than a generic demo account.`}
      />
    </PageTransition>
  )
}
