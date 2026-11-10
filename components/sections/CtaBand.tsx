import { Container } from '@/components/ui/Container'
import { Button, Arrow } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ShortLeadForm } from '@/components/forms/ShortLeadForm'
import { FinalCall } from '@/components/story/FinalCall'
import { contact, booking } from '@/site.config'

/* Spec §4.1 §13 — "See it on your own data" plus a form or booking button.
 *
 * Every page closes on the same cobalt band, so the last thing any visitor
 * sees is the same ask in the same place. Two variants because the right
 * ask differs by page:
 *
 *   buttons  the default — straight to the booking page, which keeps the
 *            demo request specific to the module the visitor was reading
 *   form     three fields in the band itself, for pages read end to end
 *
 * The photograph, the Ken Burns drift, the blurred scrim and the tilting
 * glass panel this band used to carry are gone. A solid field and large
 * type carry the ask; nothing behind it moves. */
export function CtaBand({
  variant = 'buttons',
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
  if (variant === 'buttons') {
    return <FinalCall eyebrow={eyebrow} title={title} lede={lede} />
  }

  return (
    <section aria-labelledby="cta-title" className="ez-pill-open relative overflow-hidden bg-brand-600 text-white">
      <Container className="relative py-20 sm:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="ez-kicker text-white">{eyebrow}</p>
            <h2 id="cta-title" className="mt-5 text-[2.5rem] leading-[1] !text-white sm:text-[3.4rem]">
              {title}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white">{lede}</p>
            <ul className="mt-8 space-y-3">
              {booking.whatHappens.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-3 text-[1rem] text-white">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-[#ffd27a]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/book-a-demo" variant="onDark" size="lg">
                Book a demo
                <Arrow />
              </Button>
              <Button href={`tel:${contact.phoneE164}`} variant="onDarkOutline" size="lg">
                Call {contact.phoneDisplay}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-[24px] bg-white p-6 text-ink-700 shadow-[0_40px_80px_-40px_rgb(11_22_51/0.6)] sm:p-8">
              <h3 className="font-display text-[1.3rem] font-[650] tracking-[-0.02em] text-ink-900 [font-stretch:104%]">
                Tell us where to send the details
              </h3>
              <p className="mt-1.5 text-sm text-ink-500">
                Three fields. We come back {contact.responseSla}.
              </p>
              <div className="mt-5">
                <ShortLeadForm formName={formName} cta="Request a demo" />
              </div>
              <p className="mt-5 text-[0.8rem] text-ink-500">{booking.reassurance}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
