import { Container } from '@/components/ui/Container'
import { Button, Arrow } from '@/components/ui/Button'
import { booking, contact } from '@/site.config'

/* ============================================================================
 * The closing band, on every page.
 *
 * The particle field's last formation: the dots that have been a globe, an
 * orbit, India and a galaxy on the way down the page come together as the
 * name, set in white on cobalt, and the line underneath finishes it: as in
 * easier. The band opens out of a pill shape as it arrives (.ez-pill-open).
 * ========================================================================= */
export function FinalCall({
  eyebrow = 'See it on your own data',
  title,
  lede = 'A 30-minute walkthrough on your own companies, states and statutory setup. Not a slide deck.',
  showPhone = true,
}: {
  eyebrow?: string
  title?: React.ReactNode
  lede?: string
  showPhone?: boolean
}) {
  return (
    <section data-scene="" aria-labelledby="final-title" className="ez-pill-open relative overflow-hidden bg-brand-600 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_255_255/0.16),transparent_60%)]" />
      <Container className="relative py-20 text-center sm:py-24 lg:py-28">
        {/* The name, made of the particles. */}
        <div aria-hidden="true" className="relative mx-auto h-[min(20vw,12rem)] w-full max-w-[44rem]">
          <div data-stage="word" data-tone="white" className="absolute inset-0" />
        </div>
        <p className="ez-kicker mt-8 text-white">{eyebrow}</p>
        <h2 id="final-title" className="mx-auto mt-4 max-w-4xl text-[2.4rem] leading-[1] !text-white sm:text-[3.4rem] lg:text-[4.2rem]">
          {title ?? (
            <>
              <span className="sr-only">EZER, </span>
              As in <span className="text-[#ffd27a]">easier.</span>
            </>
          )}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white">{lede}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
          <Button href="/book-a-demo" variant="onDark" size="lg">
            Book a demo
            <Arrow />
          </Button>
          {showPhone && (
            <Button href={`tel:${contact.phoneE164}`} size="lg" variant="onDarkOutline">
              Call {contact.phoneDisplay}
            </Button>
          )}
        </div>
        <p className="mt-8 text-[0.9rem] text-white">{booking.reassurance}</p>
      </Container>
    </section>
  )
}
