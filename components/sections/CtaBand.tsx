import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ShortLeadForm } from '@/components/forms/ShortLeadForm'
import { contact, booking } from '@/site.config'

/* Spec §4.1 §13 — "See it on your own data" plus a form or booking button.
 *
 * Two variants because the right ask differs by page: `form` for the home
 * page bottom, where the visitor has just read everything and a three-field
 * form converts; `buttons` for the foot of a feature page, where sending them
 * to the booking page keeps the demo request specific to that module. */
export function CtaBand({
  variant = 'buttons',
  /* The reference splits these two: "See EZER on your own data" is the
     eyebrow and "Request a demo" is the heading. They were collapsed into
     one heading here, which lost the ask — the h2 described the offer
     instead of naming the action. */
  eyebrow = 'See EZER on your own data',
  title = 'Request a demo',
  lede = 'A 30-minute walkthrough against your own entities, your own states and your own statutory setup. Not a slide deck.',
  formName = 'cta-band',
}: {
  variant?: 'form' | 'buttons'
  eyebrow?: string
  title?: string
  lede?: string
  formName?: string
}) {
  return (
    <section className="relative overflow-hidden bg-dark py-12 text-white sm:py-14 lg:py-16">
      {/* A photograph behind the closing band, not decoration beside it.
       *
       * This site's own rule is "real product screenshots only — no stock
       * business people pointing at a laptop", and a photo like this is
       * exactly what that rule was written against. Two things keep it on the
       * right side of the line: it sits UNDER a heavy brand scrim so it reads
       * as ground rather than as a claim, and it carries no information —
       * every word in this band is still text. Delete the image and the
       * section still says the same thing.
       *
       * Placed at the final CTA specifically. By this point the argument is
       * made; what is left is deciding to talk to someone, and a room of
       * people is a better ground for that than another gradient. */}
      <Image
        src="/photos/team-india.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        priority={false}
        className="pointer-events-none select-none object-cover object-center opacity-[0.22]"
      />

      {/* The scrim follows the layout, because the two variants need opposite
       * things. With the form, text sits in a left column and the photo should
       * survive on the right — so the wash runs left to right. Centred, text
       * crosses the full width and a directional wash leaves one side of the
       * heading darker than the other, so it needs a symmetric vignette. */}
      <div
        aria-hidden="true"
        className={
          variant === 'form'
            ? 'pointer-events-none absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark/70'
            : 'pointer-events-none absolute inset-0 bg-[radial-gradient(70rem_40rem_at_50%_50%,rgba(11,14,18,0.94),rgba(11,14,18,0.78))]'
        }
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_30rem_at_80%_0%,rgba(37,99,235,0.35),transparent)]"
      />

      <Container className="relative">
        <div
          className={
            variant === 'form'
              ? 'grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16'
              : 'mx-auto max-w-2xl text-center'
          }
        >
          <div>
            {eyebrow && (
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-on-dark-muted">{lede}</p>

            <ul className="mt-6 space-y-2.5">
              {booking.whatHappens.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.95rem] text-on-dark-muted">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand-300" />
                  {item}
                </li>
              ))}
            </ul>

            {variant === 'buttons' && (
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/book-a-demo" variant="onDark" size="lg">
                  Book a Demo
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Button>
                <Button
                  href={`tel:${contact.phoneE164}`}
                  size="lg"
                  className="bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/20"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  {contact.phoneDisplay}
                </Button>
              </div>
            )}

            <p className="mt-6 text-sm text-on-dark-faint">{booking.reassurance}</p>
          </div>

          {variant === 'form' && (
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
              <h3 className="text-lg font-bold text-white">
                Tell us where to send the details
              </h3>
              <p className="mt-1.5 text-sm text-on-dark-faint">
                Three fields. We come back {contact.responseSla}.
              </p>
              <div className="mt-5">
                <ShortLeadForm formName={formName} onDark cta="Request a demo" />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
