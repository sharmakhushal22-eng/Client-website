import Link from 'next/link'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { pricing } from '@/site.config'
import { coffee } from '@/content/coffee'
import { PriceReveal } from '@/components/pricing/PriceReveal'

/* Never hide pricing entirely; it costs qualified leads. One plan makes this
 * section unusually easy — there is a single number, and the interesting part
 * is what it does NOT exclude. */
export function PricingTeaser() {

  return (
    <Section tone="white" ariaLabel="Pricing">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-brand-50 ring-1 ring-brand-100">
        <div className="px-7 py-10 text-center sm:px-12">
          <SectionHeading
            eyebrow="Straightforward pricing"
            title={coffee.headline}
          />

          <div className="mt-8">
            <PriceReveal size="xl" align="center" />
            <p className="mt-3 text-sm text-ink-500">
              Billed annually · no minimum headcount ·{' '}
              {pricing.gstNote.replace('All prices are exclusive of ', 'plus ')}
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-600">
            {[
              'No per-module charges',
              'Unlimited entities & locations',
              'Implementation included',
              'No exit fee',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>

          {/* The coffee comparison, stated so it is checkable rather than
              rhetorical — a reader who thinks "that cannot be right" can see
              exactly what is being compared against what. */}
          <div className="mx-auto mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
            {coffee.compare.map((row, i) => (
              <div
                key={row.label}
                className={`rounded-lg p-4 text-left ${
                  i === 0
                    ? 'bg-surface ring-1 ring-ink-200'
                    : 'bg-brand-600 text-on-accent'
                }`}
              >
                <p
                  className={`flex items-center gap-1.5 text-[0.82rem] font-bold ${
                    i === 0 ? 'text-ink-900' : 'text-white'
                  }`}
                >
                  <span aria-hidden="true">{i === 0 ? '☕' : '⚡'}</span>
                  {row.label}
                </p>
                <p
                  className={`mt-1 text-[0.75rem] leading-relaxed ${
                    i === 0 ? 'text-ink-600' : 'text-white/90'
                  }`}
                >
                  {row.detail}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-lg text-[0.95rem] leading-relaxed text-ink-600">
            Tiered pricing puts statutory depth in the top tier. We would rather
            not sell compliance as an upgrade, so there is one rate and one
            product.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/book-a-demo" size="lg">
              {pricing.disclosed ? 'Get a quote' : 'Get your number'}
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              What is included
            </Button>
          </div>

          {pricing.disclosed && (
            <p className="mt-5 text-sm text-ink-500">
              Work out your own cost with the{' '}
              <Link href="/pricing#calculator" className="font-semibold text-brand-700 underline">
                headcount calculator
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </Section>
  )
}
