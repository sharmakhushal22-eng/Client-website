import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PricingCalculator } from '@/components/pricing/PricingCalculator'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { pricing, publicPricePerEmployee } from '@/site.config'
import { PriceReveal } from '@/components/pricing/PriceReveal'

export const metadata: Metadata = pageMetadata({
  title: 'Pricing — one plan, every module',
  description:
    'One plan for the whole of EZER HRMS — every statutory module, unlimited entities, implementation and migration included. Pricing shared on the demo call.',
  path: '/pricing',
})


const pricingFaqs = [
  {
    q: 'Why is there only one plan?',
    a: 'Because tiering an HRMS means tiering compliance, and that is the wrong thing to sell. In a three-tier model the statutory depth — multi-state Professional Tax, LWF frequency, contribution-period handling, labour-code wage definitions — always lands in the upper tier. The company least able to absorb a PF notice ends up with the weakest coverage. We would rather charge one rate and let headcount do the scaling.',
  },
  {
    q: 'Is GST included in this price?',
    a: 'No. The price is exclusive of GST, charged at the applicable rate on your invoice. We state it this way round deliberately — a price that quietly includes tax is the one that causes an argument at the first invoice.',
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
    a: `You are billed on active employees, so joiners and exits are reflected at the next billing date rather than requiring a contract change. The ${pricing.minEmployees}-employee minimum is a floor on billable headcount — below it, you pay for the minimum.`,
  },
  {
    q: 'Does each legal entity or location cost extra?',
    a: 'No. Entities, locations and statutory registrations are unlimited on the same subscription. This is the charge most often buried elsewhere, and it is the one that punishes exactly the companies EZER is built for — a group running a corporate office, two factories and a warehouse should not pay four times.',
  },
  {
    q: 'Can we get our data out if we leave?',
    a: 'Yes, at any point, and there is no charge for it. Employee master, payroll history, statutory records and documents export in standard formats. We consider an exit route a feature: a system you cannot leave is one you should not enter.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'Not at the moment, and the reason is honest rather than commercial. Payroll cannot be meaningfully evaluated on sample data — the value only shows up when it is running against your salary structures, your states and your registrations. So we demo against your own scenario instead, and during implementation we run one full cycle in parallel with your existing process before you cut over. You see your own numbers reconcile before anything depends on them.',
  },
]

export default function PricingPage() {
  const plan = pricing.plan
  const enterprise = pricing.enterprise

  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
          faqSchema(pricingFaqs),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-50 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              Pricing
            </p>
            <h1 className="mt-3 text-[2.1rem] font-bold leading-[1.12] sm:text-5xl">
              One plan. Everything in it.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              Most HRMS pricing puts compliance in the expensive tier — which
              means the company least able to absorb a PF notice gets the
              weakest protection. We do not sell it that way. Every module,
              every statutory head and every entity is in one rate, and
              headcount does the scaling.
            </p>
          </div>
        </Container>
      </section>

      {/* ── The plan ─────────────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="Plan">
        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          {/* Complete */}
          <div
            data-reveal=""
            className="relative flex flex-col rounded-3xl bg-ink-900 p-7 text-white ring-2 ring-brand-600 sm:p-9"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
              <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Everything included
              </span>
            </div>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-on-dark-muted">
              {plan.tagline}
            </p>

            <div className="mt-7 border-y border-white/15 py-7">
              <PriceReveal onDark size="xl" />
              <p className="mt-3 text-sm text-on-dark-faint">
                Billed annually · minimum {plan.minEmployees} employees ·{' '}
                {pricing.gstNote.replace('All prices are exclusive of ', 'plus ')}
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-300">
                No implementation fee. No per-module charge. No per-entity
                charge.
              </p>
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-brand-300">
              What that covers
            </p>
            <ul className="mt-4 flex-1 space-y-3">
              {plan.includes.map((item) => (
                <li key={item.group} className="flex items-start gap-3 text-sm">
                  <Icon
                    name="check"
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-300"
                  />
                  <span>
                    <span className="font-semibold text-white">
                      {item.group}
                    </span>
                    <span className="mt-0.5 block leading-relaxed text-on-dark-muted">
                      {item.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Button href="/book-a-demo" size="lg" variant="onDark" className="mt-8 w-full">
              Book a demo
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
          </div>

          {/* Commercial guarantees + Enterprise */}
          <div className="flex flex-col gap-6">
            <div
              data-reveal=""
              className="rounded-3xl bg-brand-50 p-7 ring-1 ring-brand-100"
            >
              <h3 className="text-base font-bold text-ink-900">
                Things you are usually charged for
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Each of these is a line item somewhere else. Here they are part
                of the rate.
              </p>
              <ul className="mt-5 space-y-3">
                {plan.guarantees.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700"
                  >
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-reveal=""
              className="flex flex-1 flex-col rounded-3xl bg-white p-7 ring-1 ring-ink-200"
            >
              <h3 className="text-xl font-bold text-ink-900">{enterprise.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {enterprise.tagline}
              </p>

              <p className="mt-5 text-3xl font-bold text-ink-900">Talk to us</p>
              <p className="mt-1.5 text-sm text-ink-500">{enterprise.bestFor}</p>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-brand-600">
                Everything in {plan.name}, plus
              </p>
              <ul className="mt-4 flex-1 space-y-2.5">
                {enterprise.adds.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-600"
                  >
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                href="/contact"
                size="lg"
                variant="secondary"
                className="mt-7 w-full"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Calculator ───────────────────────────────────────────────────── */}
      <Section tone="tint" id="calculator" ariaLabel="Cost calculator">
        <SectionHeading
          eyebrow="Work it out"
          title={pricing.disclosed ? 'What it costs at your headcount' : 'Start with your headcount'}
          lede={pricing.disclosed
            ? 'Drag the slider. One rate, so there is only one number to read.'
            : 'Set your headcount — it is the first thing we ask on the call, and it is what your quote is priced on.'}
        />
        <div className="mt-10">
          <PricingCalculator
            rate={publicPricePerEmployee}
            minEmployees={plan.minEmployees}
            annualDiscountPct={pricing.annualDiscountPct}
            gstNote={pricing.gstNote}
            planName={plan.name}
          />
        </div>
      </Section>

      {/* ── Included / not included ─────────────────────────────────────── */}
      <Section tone="white" ariaLabel="What is included">
        <SectionHeading
          eyebrow="No surprises"
          title="What the price covers — and what it does not"
          lede="The second list matters more than the first. Every unpleasant surprise in a software contract is something that was on it and never stated."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50 p-7 ring-1 ring-emerald-100">
            <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-900">
              <Icon name="check" className="h-5 w-5" />
              Included
            </h3>
            <ul className="mt-5 space-y-3">
              {pricing.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-emerald-900">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-amber-50 p-7 ring-1 ring-amber-100">
            <h3 className="flex items-center gap-2 text-lg font-bold text-amber-900">
              <Icon name="alert" className="h-5 w-5" />
              Not included
            </h3>
            <ul className="mt-5 space-y-3">
              {pricing.notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-amber-900">
                  <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Faq
        faqs={pricingFaqs}
        tone="tint"
        eyebrow="Pricing questions"
        title="Before you ask us"
      />

      <CtaBand
        title="Get a quote against your actual setup"
        lede="Headcount, states, entities and what you are migrating from. Thirty minutes, and you leave with a written number."
      />
    </>
  )
}
