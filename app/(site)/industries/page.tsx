import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Button, Arrow } from '@/components/ui/Button'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { IndustryFinder } from '@/components/story/IndustryFinder'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { industryCategories, industryCount, structure } from '@/content/positioning'
export const metadata: Metadata = pageMetadata({
  title: 'Industries: HRMS & payroll by sector',
  description:
    'Manufacturing, IT/ITES, BFSI, construction, logistics, healthcare, retail and more. Establishment type decides which registers apply, configured per sector rather than one generic template.',
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
    a: 'Almost certainly not. The list is not the constraint. The statutory rules are, and those are configuration. What actually decides whether EZER fits is your establishment type, the states you operate in and how your wages are structured, not the label on your industry. Tell us those three and we will say plainly whether it works.',
  },
  {
    q: 'What actually changes between industries?',
    a: 'Which registers you owe and which rules drive them. A factory falls under the OSH Code, which replaced the Factories Act, with its own registers, shift and overtime rules; a multi-city IT company is under state Shops & Establishments rules with a different leave entitlement in each state; a construction site adds BOCW cess and welfare board registration. The payroll arithmetic is the same. What changes is what has to come out of it.',
  },
  {
    q: 'We operate across several industries under one group. Is that a problem?',
    a: 'It is the normal case, and it is what the structure is built for. Each company in the group holds its own registrations, and each location under it carries its own establishment type, so a group with a corporate office, a factory and a warehouse runs three different statutory regimes in one system rather than three systems.',
  },
  {
    q: 'Do you handle contract labour and principal-employer obligations?',
    a: 'Yes. Contract workers are held against the principal employer they work for, with PF and ESIC attributed per contract, which is what makes the CLRA position reportable rather than reconstructed at audit time.',
  },
]

export default function IndustriesPage() {
  return (
    <PageTransition kind="ledger">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
          ]),
          faqSchema(industryFaqs),
        ]}
      />

      {/* Rounded DOWN to the nearest ten in the eyebrow, so the claim stays
          true as the list changes: 101 reads as "100+", never "101+". The
          exact count sits in the facts beneath. */}
      <PageHero
        kind="product"
        stage="india"
        crumbs={[{ name: 'Industries' }]}
        eyebrow={`${Math.floor(industryCount / 10) * 10}+ industries, one engine`}
        title={['India doesn’t run', 'on one kind', 'of company.', <span key="c" className="text-brand-600">Neither does EZER.</span>]}
        lede="We mapped HR, payroll and compliance challenges across more than 100 Indian industries, from a 12-branch NBFC to a three-shift factory floor, before writing the rules engine. Don’t see your exact industry? It is probably still covered."
        facts={[
          { value: String(industryCount), label: 'Industries mapped' },
          { value: String(industryCategories.length), label: 'Groups, each with its own rules' },
          { value: String(structure.locationTypes.length), label: 'Establishment types modelled' },
          { value: 'Per state', label: 'PT, LWF and leave entitlement' },
        ]}
      />

      <section aria-label="Industries by group" className="bg-paper pb-16 pt-10 sm:pb-24">
        <Container>
          <IndustryFinder />

          <div className="mt-14 grid gap-6 rounded-[28px] bg-white p-8 ring-1 ring-ink-900/[0.06] sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="text-[1.6rem] leading-tight sm:text-[2rem]">Not on the list?</h2>
              <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-ink-600">
                The list is not the constraint. The statutory rules are. Tell us your
                establishment type and the states you operate in, and we will tell you
                plainly whether this fits.
              </p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Button href="/contact" variant="ink" size="lg">
                Ask about your sector
                <Arrow />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Faq
        faqs={industryFaqs}
        tone="tint"
        eyebrow="By sector"
        title="What actually differs between industries"
      />

      <CtaBand
        title="See it set up for your sector"
        lede="Thirty minutes, against your own establishment type and states, not a generic demo company."
      />
    </PageTransition>
  )
}
