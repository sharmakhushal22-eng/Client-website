import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { foundingCustomer, testimonials } from '@/content/home'

/* Handoff §6 — no real customers yet, so the section invites founding
 * customers instead of showing quotes.
 *
 * Renders ONLY while there are no published testimonials. The moment a real
 * quote is published, SocialProof takes over and this steps aside — mutually
 * exclusive by construction rather than by somebody remembering to delete it.
 *
 * Compacted to a single band: the offer as a 2×2 of short rows beside the
 * qualifying panel, rather than a centred heading over a card grid. */
export function FoundingCustomers() {
  const hasRealTestimonials = testimonials.some((t) => t.published)
  if (hasRealTestimonials) return null

  return (
    <section className="bg-white py-12 sm:py-14 lg:py-16" aria-label="Founding customers">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              {foundingCustomer.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              {foundingCustomer.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink-600">
              {foundingCustomer.lede}
            </p>

            <ul className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {foundingCustomer.offer.map((item) => (
                <li key={item.title} className="flex items-start gap-2.5">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    <span className="block text-sm font-bold text-ink-900">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[0.82rem] leading-relaxed text-ink-600">
                      {item.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliberately the loudest thing here: repelling a bad-fit buyer
              early is worth more than the lead. */}
          <div className="flex flex-col justify-center rounded-2xl bg-ink-900 p-7 text-white sm:p-8">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600">
              <Icon name="sparkle" className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-white">
              Is this a good idea for you?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">
              {foundingCustomer.fitNote}
            </p>
            <Button href="/book-a-demo" size="lg" variant="onDark" className="mt-6">
              {foundingCustomer.ctaLabel}
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
