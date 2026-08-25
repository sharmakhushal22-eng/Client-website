import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ScreenshotFrame } from '@/components/ui/ScreenshotFrame'
import { StatutoryTable } from '@/components/sections/StatutoryTable'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { featurePages, getFeaturePage } from '@/content/features'

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
    <>
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
      <section className="bg-brand-50 py-10 sm:py-14 lg:py-16">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-500">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/features" className="hover:text-brand-700">
              Features
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="font-medium text-ink-900">{page.name}</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
                {page.eyebrow}
              </p>
              <h1 className="mt-3 text-[2rem] font-bold leading-[1.14] sm:text-[2.75rem]">
                {page.name}
              </h1>
              <p className="mt-4 text-xl font-medium leading-snug text-brand-700">
                {page.promise}
              </p>
              <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-600">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={`/book-a-demo?module=${page.slug}`} size="lg">
                  See {page.name.split(' ')[0].toLowerCase()} in a demo
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Button>
                <Button href="/pricing" variant="secondary" size="lg">
                  See pricing
                </Button>
              </div>
            </div>

            <ScreenshotFrame
              src={page.screenshots[0]?.src}
              alt={page.screenshots[0]?.alt ?? `${page.name} in EZER HRMS`}
              priority
            />
          </div>
        </Container>
      </section>

      {/* ── 2. The problem ───────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="The problem">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
            Without a system
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            How this gets done today
          </h2>
          {page.problem.map((para) => (
            <p key={para} className="mt-4 text-[1.05rem] leading-relaxed text-ink-600">
              {para}
            </p>
          ))}
        </div>
      </Section>

      {/* ── 3. What it does ──────────────────────────────────────────────── */}
      <Section tone="tint" ariaLabel="Capabilities">
        <SectionHeading
          eyebrow="What it does"
          title={`Inside ${page.name.toLowerCase()}`}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {page.capabilities.map((cap, i) => (
            <div
              key={cap.title}
              data-reveal=""
              style={{ transitionDelay: `${(i % 2) * 60}ms` }}
              className="flex items-start gap-4 rounded-2xl bg-surface p-6 ring-1 ring-ink-200/70"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700">
                <Icon name="check" className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-bold leading-snug">{cap.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{cap.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Payroll carries three extras the other pages do not — spec §4.3. */}
      {page.slug === 'payroll' && <StatutoryTable />}

      {/* ── 4. Screenshot walkthrough ────────────────────────────────────── */}
      {page.screenshots.length > 1 && (
        <Section tone="white" ariaLabel="Screenshots">
          <SectionHeading eyebrow="See it working" title="On screen" />
          <div className="mt-10 space-y-14">
            {page.screenshots.slice(1).map((shot, i) => (
              <div
                key={shot.title}
                data-reveal=""
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
              >
                <div className={i % 2 === 1 ? 'lg:order-last' : ''}>
                  <h3 className="text-xl font-bold sm:text-2xl">{shot.title}</h3>
                  <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-600">
                    {shot.caption}
                  </p>
                </div>
                <ScreenshotFrame src={shot.src} alt={shot.alt} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── 5. Who it's for ──────────────────────────────────────────────── */}
      <Section tone="tint" ariaLabel="Who it is for">
        <SectionHeading eyebrow="Who it’s for" title="What each person gets out of it" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {page.personas.map((persona) => (
            <div
              key={persona.role}
              className="rounded-2xl bg-surface p-6 text-center ring-1 ring-ink-200/70"
            >
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700">
                <Icon name={persona.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold">{persona.role}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {persona.benefit}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 6. Related modules (internal links — SEO + discovery) ────────── */}
      <Section tone="white" ariaLabel="Related modules">
        <SectionHeading
          eyebrow="Works with"
          title="The modules this connects to"
          lede="These are not integrations. They are the same system reading the same data."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {page.related.map((rel) => (
            <Link
              key={rel.slug}
              href={`/features/${rel.slug}`}
              className="group rounded-2xl bg-surface p-6 ring-1 ring-ink-200/70 transition-shadow hover:shadow-lg hover:shadow-brand-900/5 hover:ring-brand-200"
            >
              <h3 className="flex items-center gap-1.5 text-base font-bold">
                {rel.name}
                <Icon
                  name="arrow-right"
                  className="h-4 w-4 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{rel.blurb}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Faq
        faqs={page.faqs}
        tone="tint"
        eyebrow="Questions"
        title={`About ${page.name.toLowerCase()}`}
      />

      {/* ── 7. CTA — for this specific module ────────────────────────────── */}
      <CtaBand
        title={`See ${page.name.toLowerCase()} on your own data`}
        lede={`Tell us your headcount and your states, and we will walk through ${page.name.toLowerCase()} against your actual setup rather than a generic demo account.`}
      />
    </>
  )
}
