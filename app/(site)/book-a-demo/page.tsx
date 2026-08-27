import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { FullEnquiryForm } from '@/components/forms/FullEnquiryForm'
import { CalendarEmbed } from '@/components/booking/CalendarEmbed'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { booking, contact } from '@/site.config'

export const metadata: Metadata = pageMetadata({
  title: 'Book a demo',
  description:
    'A 30-minute live walkthrough against your own salary structure, states and statutory setup. No obligation, no credit card.',
  path: '/book-a-demo',
})

/* Spec §4.6 — short qualifying form, then the calendar, then confirmation.
 * The page must say what will happen on the call: duration, who joins, what
 * they will see, and that it is a live walkthrough of their own scenario. */
export default function BookADemoPage() {
  const hasCalendar = Boolean(booking.calendarUrl)

  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Book a demo', path: '/book-a-demo' },
          ]),
        ]}
      />

      <section className="bg-brand-50 py-10 sm:py-14">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              Book a demo
            </p>
            <h1 className="mt-3 text-[2.1rem] font-bold leading-[1.12] sm:text-5xl">
              {booking.durationMinutes} minutes, on your own scenario
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              Tell us a little about your company. We&rsquo;ll show you EZER
              configured for your industry and branch structure — not a generic
              script. Not a slide deck and not a recorded tour: we open the
              live product, set it up the way your company is set up, and run
              the parts you actually care about.
            </p>

            {/* The three-step summary. It sits above the fold on purpose —
                these are the questions a reader answers before deciding
                whether to give us a phone number, and burying them under the
                form answers them too late. */}
            <ol className="mt-7 grid gap-3 sm:grid-cols-3">
              {booking.steps.map((step, i) => (
                <li
                  key={step}
                  data-reveal=""
                  style={{ transitionDelay: `${i * 70}ms` }}
                  className="rounded-xl bg-surface p-4 ring-1 ring-brand-100"
                >
                  <span className="text-xs font-bold tracking-[0.1em] text-brand-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-1.5 text-[0.92rem] font-semibold leading-snug text-ink-900">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <Section tone="white" ariaLabel="Book a demo">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* ── What will happen ─────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-2xl font-bold">What happens on the call</h2>
            <ol className="mt-6 space-y-4">
              {booking.whatHappens.map((item, i) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-ink-600">
                    {item}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100">
              <p className="flex items-start gap-2.5 text-sm font-medium leading-relaxed text-ink-900">
                <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                {booking.reassurance}
              </p>
            </div>

            <div className="mt-6 space-y-2 text-sm text-ink-600">
              <p className="flex items-center gap-2">
                <Icon name="clock" className="h-4 w-4 text-brand-600" />
                {booking.durationMinutes} minutes · {contact.businessHours}
              </p>
              <p className="flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 text-brand-600" />
                Prefer to call?{' '}
                <a
                  href={`tel:${contact.phoneE164}`}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {contact.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          {/* ── Qualifying form ─────────────────────────────────────────── */}
          <div>
            <div className="rounded-2xl bg-surface p-6 ring-1 ring-ink-200 sm:p-8">
              <h2 className="text-xl font-bold">
                {hasCalendar ? 'First, a few details' : 'Request a slot'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {hasCalendar
                  ? 'So the right person joins and the demo is set up for your headcount and states. The calendar is below.'
                  : `Tell us when suits and we will confirm a slot ${contact.responseSla}.`}
              </p>
              <div className="mt-6">
                <FullEnquiryForm
                  formName="book-a-demo"
                  submitLabel={hasCalendar ? 'Continue to the calendar' : 'Request a demo'}
                  compact={hasCalendar}
                />
              </div>
            </div>

            {hasCalendar && (
              <div className="mt-8">
                <h2 className="text-xl font-bold">Pick a time</h2>
                <p className="mt-2 text-sm text-ink-600">
                  Times shown in your local timezone. You will get a calendar
                  invite with the meeting link straight away.
                </p>
                <div className="mt-5">
                  <CalendarEmbed />
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  )
}
