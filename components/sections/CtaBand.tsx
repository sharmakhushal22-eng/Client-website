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
  title = 'See it on your own data',
  lede = 'A 30-minute walkthrough against your own entities, your own states and your own statutory setup. Not a slide deck.',
  formName = 'cta-band',
}: {
  variant?: 'form' | 'buttons'
  title?: string
  lede?: string
  formName?: string
}) {
  return (
    <section className="relative overflow-hidden bg-dark py-12 text-white sm:py-14 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_30rem_at_80%_0%,rgba(37, 99, 235,0.35),transparent)]"
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
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
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
