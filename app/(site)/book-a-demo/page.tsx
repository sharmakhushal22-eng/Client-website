import type { Metadata } from 'next'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Icon } from '@/components/ui/Icon'
import { FullEnquiryForm } from '@/components/forms/FullEnquiryForm'
import { CalendarEmbed } from '@/components/booking/CalendarEmbed'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { DoodleCluster } from '@/components/graphics/Doodles'
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
    <PageTransition kind="direct">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Book a demo', path: '/book-a-demo' },
          ]),
        ]}
      />

      <PageHero
        kind="direct"
        decor={<DoodleCluster set="demo" />}
        crumbs={[{ name: 'Book a demo' }]}
        eyebrow="Book a demo"
        title={[`${booking.durationMinutes} minutes,`, <span key="b" className="text-ink-400">on your own scenario.</span>]}
        lede="Tell us a little about your company. We open the live product, set it up the way your company is set up, and run the parts you actually care about. Not a slide deck, and not a recorded tour."
      >
        {/* The three-step summary. Above the fold on purpose: these are the
            questions a reader answers before deciding whether to give us a
            phone number. */}
        <ol data-h="fade" style={{ '--d': '480ms' } as React.CSSProperties} className="mt-10 grid border-t border-ink-900/10 sm:grid-cols-3">
          {booking.steps.map((step, i) => (
            <li key={step} className={`border-b border-ink-900/10 py-5 sm:border-b-0 sm:pr-6 ${i > 0 ? 'sm:border-l sm:pl-6' : ''}`}>
              <span className="ez-num ez-kicker text-brand-600">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-2 text-[1rem] font-semibold leading-snug text-ink-900">{step}</p>
            </li>
          ))}
        </ol>
      </PageHero>

      <Section tone="paper" ariaLabel="Book a demo" className="ez-static !pt-4">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ── What will happen ─────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <h2 className="text-[1.8rem] leading-tight">What happens on the call</h2>
            <ol className="mt-6 space-y-4">
              {booking.whatHappens.map((item, i) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span className="ez-num mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-ink-600">
                    {item}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-8 border-l-2 border-marigold pl-5">
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
          <div className="lg:col-span-7">
            <div className="rounded-[28px] bg-white p-6 ring-1 ring-ink-900/[0.06] sm:p-10">
              <h2 className="text-[1.6rem] leading-tight">
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
    </PageTransition>
  )
}
