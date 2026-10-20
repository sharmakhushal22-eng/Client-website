import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/Section'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Button, Arrow } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PricingCalculator } from '@/components/pricing/PricingCalculator'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { pricing, publicPricePerEmployee } from '@/site.config'
import { PriceReveal } from '@/components/pricing/PriceReveal'

export const metadata: Metadata = pageMetadata({
  title: 'Pricing: one plan, every module',
  description:
    'One plan for the whole of EZER HRMS, with every statutory module, unlimited entities, implementation and migration included. Pricing shared on the demo call.',
  path: '/pricing',
})


const pricingFaqs = [
  {
    q: 'Why is there only one plan?',
    a: 'Because tiering an HRMS means tiering compliance, and that is the wrong thing to sell. In a three-tier model the statutory depth always lands in the upper tier: multi-state Professional Tax, LWF frequency, contribution-period handling, labour-code wage definitions. The company least able to absorb a PF notice ends up with the weakest coverage. We would rather charge one rate and let headcount do the scaling.',
  },
  {
    q: 'Is GST included in this price?',
    a: 'No. The price is exclusive of GST, charged at the applicable rate on your invoice. We state it this way round deliberately, because a price that quietly includes tax is the one that causes an argument at the first invoice.',
  },
  {
    q: 'Is there really no implementation fee?',
    a: 'No implementation fee. Configuration, data migration, the parallel payroll run and training are part of the subscription. We take the view that an implementation charge is a fee for making the product work, which is a strange thing to invoice for separately.',
  },
  {
    q: 'What is the contract length?',
    a: 'Subscriptions are annual, and the rate on this page is the annual-billing rate. Monthly billing is available at the higher rate shown when you switch the toggle in the calculator.',
  },
  {
    q: 'What happens if our headcount changes mid-cycle?',
    a: 'You are billed on active employees, so joiners and exits are reflected at the next billing date rather than requiring a contract change. There is no minimum headcount. Ten employees or ten thousand, you pay for the people you actually employ.',
  },
  {
    q: 'Does each legal entity or location cost extra?',
    a: 'No. Entities, locations and statutory registrations are unlimited on the same subscription. This is the charge most often buried elsewhere, and it is the one that punishes exactly the companies EZER is built for. A group running a corporate office, two factories and a warehouse should not pay four times.',
  },
  {
    q: 'Can we get our data out if we leave?',
    a: 'Yes, at any point, and there is no charge for it. Employee master, payroll history, statutory records and documents export in standard formats. We consider an exit route a feature: a system you cannot leave is one you should not enter.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'Not at the moment, and the reason is honest rather than commercial. Payroll cannot be meaningfully evaluated on sample data. The value only shows up when it is running against your salary structures, your states and your registrations. So we demo against your own scenario instead, and during implementation we run one full cycle in parallel with your existing process before you cut over. You see your own numbers reconcile before anything depends on them.',
  },
]

export default function PricingPage() {
  const plan = pricing.plan
  const enterprise = pricing.enterprise

  return (
    <PageTransition kind="product">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
          faqSchema(pricingFaqs),
        ]}
      />

      <PageHero
        kind="product"
        stage="cube"
        stageChips={['Every module', 'Unlimited entities', 'Implementation', 'Migration', 'Training', 'Data export']}
        crumbs={[{ name: 'Pricing' }]}
        eyebrow="Pricing"
        title={['One plan.', <span key="b" className="text-ink-400">Everything in it.</span>]}
        lede="Most HRMS pricing puts compliance in the expensive tier, so the company least able to absorb a PF notice gets the weakest protection. We do not sell it that way. Every module, every statutory head and every entity is in one rate, and headcount does the scaling."
      />

      {/* ── The plan ─────────────────────────────────────────────────────── */}
      <section aria-label="Plan" className="bg-paper pb-16 sm:pb-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12">
            <div data-m="rise" className="relative flex flex-col overflow-hidden rounded-[30px] bg-navy p-7 text-white sm:p-10 lg:col-span-7">
              <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-6 w-56 space-y-5 opacity-[0.07]">
                <div className="h-8 rounded-full bg-white" />
                <div className="h-8 w-[72%] rounded-full bg-white" />
                <div className="h-8 rounded-full bg-white" />
              </div>
              <div className="relative flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-[2rem] !text-white">{plan.name}</h2>
                <span className="rounded-full bg-marigold px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-navy">
                  Everything included
                </span>
              </div>
              <p className="relative mt-3 max-w-lg text-[1.02rem] leading-relaxed text-white/70">{plan.tagline}</p>

              <div className="relative mt-8 border-y border-white/15 py-8">
                <PriceReveal onDark size="xl" />
                <p className="mt-3 text-sm text-white/60">
                  Billed annually
                  {plan.minEmployees ? ` · minimum ${plan.minEmployees} employees` : ''} ·{' '}
                  {pricing.gstNote.replace('All prices are exclusive of ', 'plus ')}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#ffd27a]">
                  No implementation fee. No per-module charge. No per-entity charge.
                </p>
              </div>

              <p className="ez-kicker relative mt-8 text-white/60">What that covers</p>
              <dl className="relative mt-5 grid flex-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                {plan.includes.map((item) => (
                  <div key={item.group}>
                    <dt className="flex items-center gap-2.5 text-[0.98rem] font-semibold text-white">
                      <span aria-hidden="true" className="h-[2px] w-3.5 rounded-full bg-marigold" />
                      {item.group}
                    </dt>
                    <dd className="mt-1 pl-6 text-[0.88rem] leading-relaxed text-white/60">{item.detail}</dd>
                  </div>
                ))}
              </dl>

              <div className="relative mt-10">
                <Button href="/book-a-demo" size="lg" variant="onDark">
                  Book a demo
                  <Arrow />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <div data-m="rise" style={{ '--d': '80ms' } as React.CSSProperties} className="rounded-[30px] bg-white p-7 ring-1 ring-ink-900/[0.06] sm:p-9">
                <h3 className="font-display text-[1.35rem] font-[640] tracking-[-0.02em] text-ink-900 [font-stretch:104%]">
                  Things you are usually charged for
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">
                  Each of these is a line item somewhere else. Here they are part of the rate.
                </p>
                <ul className="mt-6 divide-y divide-ink-900/[0.07] border-y border-ink-900/[0.07]">
                  {plan.guarantees.map((item) => (
                    <li key={item} className="flex items-start gap-3 py-3 text-[0.95rem] leading-relaxed text-ink-700">
                      <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div data-m="rise" style={{ '--d': '160ms' } as React.CSSProperties} className="flex flex-1 flex-col rounded-[30px] bg-paper-2 p-7 sm:p-9">
                <h3 className="font-display text-[1.35rem] font-[640] tracking-[-0.02em] text-ink-900 [font-stretch:104%]">
                  {enterprise.name}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">{enterprise.tagline}</p>
                <p className="ez-kicker mt-6 text-ink-500">Everything in {plan.name}, plus</p>
                <ul className="mt-4 flex-1 space-y-2.5">
                  {enterprise.adds.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink-700">
                      <span aria-hidden="true" className="mt-[0.72em] h-[2px] w-3.5 shrink-0 rounded-full bg-brand-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href="/contact" variant="secondary" size="lg">
                    Talk to sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Calculator ───────────────────────────────────────────────────── */}
      <section id="calculator" aria-label="Cost calculator" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Work it out"
            title={pricing.disclosed ? 'What it costs at your headcount' : 'Start with your headcount'}
            lede={pricing.disclosed
              ? 'Drag the slider. One rate, so there is only one number to read.'
              : 'Set your headcount. It is the first thing we ask on the call, and it is what your quote is priced on.'}
          />
          <div className="mt-12">
            <PricingCalculator
              rate={publicPricePerEmployee}
              minEmployees={plan.minEmployees}
              annualDiscountPct={pricing.annualDiscountPct}
              gstNote={pricing.gstNote}
              planName={plan.name}
            />
          </div>
        </Container>
      </section>

      {/* ── Included / not included ─────────────────────────────────────── */}
      <section aria-label="What is included" className="bg-paper py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="No surprises"
            title="What the price covers, and what it does not"
            lede="The second list matters more than the first. Every unpleasant surprise in a software contract is something that was on it and never stated."
          />
          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-10">
            <div>
              <h3 className="flex items-center gap-2.5 border-b-2 border-ink-900 pb-4 text-[1.1rem] font-semibold text-ink-900">
                <Icon name="check" className="h-5 w-5 text-emerald-600" />
                Included
              </h3>
              <ul data-m="settle" className="divide-y divide-ink-900/[0.08]">
                {pricing.included.map((item) => (
                  <li key={item} className="py-4 text-[0.98rem] leading-relaxed text-ink-700">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2.5 border-b-2 border-ink-900 pb-4 text-[1.1rem] font-semibold text-ink-900">
                <Icon name="alert" className="h-5 w-5 text-amber-700" />
                Not included
              </h3>
              <ul data-m="settle" className="divide-y divide-ink-900/[0.08]">
                {pricing.notIncluded.map((item) => (
                  <li key={item} className="py-4 text-[0.98rem] leading-relaxed text-ink-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <Faq faqs={pricingFaqs} tone="tint" eyebrow="Pricing questions" title="Before you ask us" />

      <CtaBand
        title="Get a quote against your actual setup"
        lede="Headcount, states, entities and what you are migrating from. Thirty minutes, and you leave with a written number."
      />
    </PageTransition>
  )
}
