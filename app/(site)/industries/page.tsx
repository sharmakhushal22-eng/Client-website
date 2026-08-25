import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { industryCategories, industryCount } from '@/content/positioning'

export const metadata: Metadata = pageMetadata({
  title: 'Industries — HRMS & payroll by sector',
  description:
    'Manufacturing, IT/ITES, BFSI, construction, logistics, healthcare, retail and more. Establishment type decides which registers apply — configured per sector, not one generic template.',
  path: '/industries',
})

/* ============================================================================
 * The industries page.
 *
 * Promoted out of a home-page tab strip for a reason the home page could not
 * serve: someone searching "HRMS for manufacturing India" or "payroll
 * software for staffing company" needs a URL to land on. A tab inside a
 * section is invisible to that search and unlinkable in a sales email.
 *
 * Here the full grid is laid out rather than tabbed — on a dedicated page the
 * reader arrived to scan the list, so hiding thirteen of fourteen categories
 * behind tabs would be working against them. The home page keeps the tabs,
 * where length is the constraint.
 * ========================================================================= */

const industryFaqs = [
  {
    q: 'Our industry is not on the list. Does that mean you cannot help?',
    a: 'Almost certainly not. The list is not the constraint — the statutory rules are, and those are configuration. What actually decides whether EZER fits is your establishment type, the states you operate in and how your wages are structured, not the label on your industry. Tell us those three and we will say plainly whether it works.',
  },
  {
    q: 'What actually changes between industries?',
    a: 'Which registers you owe and which rules drive them. A factory falls under the Factories Act with its own registers, shift and overtime rules; a multi-city IT company is under state Shops & Establishments rules with a different leave entitlement in each state; a construction site adds BOCW cess and welfare board registration. The payroll arithmetic is the same — what changes is what has to come out of it.',
  },
  {
    q: 'We operate across several industries under one group. Is that a problem?',
    a: 'It is the normal case, and it is what the structure is built for. Each company in the group holds its own registrations, and each location under it carries its own establishment type — so a group with a corporate office, a factory and a warehouse runs three different statutory regimes in one system rather than three systems.',
  },
  {
    q: 'Do you handle contract labour and principal-employer obligations?',
    a: 'Yes. Contract workers are held against the principal employer they work for, with PF and ESIC attributed per contract, which is what makes the CLRA position reportable rather than reconstructed at audit time.',
  },
]

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
          ]),
          faqSchema(industryFaqs),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-50 py-10 sm:py-14 lg:py-16">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-ink-600">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="font-medium text-ink-900">Industries</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
                Configured per industry
              </p>
              <h1 className="mt-3 text-[2rem] font-bold leading-[1.12] sm:text-4xl lg:text-[2.75rem]">
                {industryCount} industries, in {industryCategories.length} groups
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                We mapped HR, payroll and compliance challenges across more than
                a hundred Indian industries — from a twelve-branch NBFC to a
                three-shift factory floor — before writing the rules engine.
                Establishment type decides which registers apply, which leave
                entitlement follows and which returns are due, so everything
                below is one system set up differently.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 ring-1 ring-brand-100">
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span>
                  <strong className="font-bold text-ink-900">
                    Not on the list?
                  </strong>{' '}
                  The list is not the constraint — the statutory rules are.
                  Tell us your establishment type and the states you operate
                  in, and we will tell you plainly whether this fits.
                </span>
              </p>
              <Button href="/contact" variant="secondary" className="mt-5 w-full">
                Ask about your sector
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── The full grid ────────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="Industries by category">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {industryCategories.map((category, i) => (
            <div
              key={category.name}
              data-reveal=""
              style={{ transitionDelay: `${(i % 3) * 45}ms` }}
            >
              <h2 className="border-t-2 border-brand-600 pt-3.5 text-[1.05rem] font-bold text-ink-900">
                {category.name}
              </h2>

              {/* The line that earns the section. A list of industry names
                  proves nothing — anyone can paste an NIC code table. Saying
                  what is statutorily different about construction proves
                  somebody has run payroll in it. */}
              <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-brand-700">
                <Icon name="shield" className="mt-0.5 h-3 w-3 shrink-0" />
                {category.note}
              </p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {category.industries.map((industry) => (
                  <li
                    key={industry}
                    className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-ink-700 ring-1 ring-brand-100"
                  >
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Faq
        faqs={industryFaqs}
        tone="tint"
        eyebrow="By sector"
        title="What actually differs between industries"
      />

      <CtaBand
        title="See it set up for your sector"
        lede="Thirty minutes, against your own establishment type and states — not a generic demo company."
      />
    </>
  )
}
