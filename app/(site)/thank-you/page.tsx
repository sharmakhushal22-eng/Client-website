import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { ConversionTracker } from '@/components/ConversionTracker'
import { pageMetadata } from '@/lib/seo'
import { contact, booking } from '@/site.config'

/* noIndex: a thank-you page in the search results is a page that fires a
 * conversion event for someone who never converted. */
export const metadata: Metadata = pageMetadata({
  title: 'Thanks — we have your enquiry',
  description: 'We have your enquiry and will be in touch shortly.',
  path: '/thank-you',
  noIndex: true,
})

/* Spec §4.7 — "Not a dead end." Confirm what happens and by when, offer the
 * add-to-calendar link, the brochure, and two or three onward links. */

const nextSteps: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'mail',
    title: 'A confirmation is on its way',
    body: 'Check your inbox — it should arrive within a minute. If it does not, look in spam and mark it as safe, or call us.',
  },
  {
    icon: 'phone',
    title: `We will be in touch ${contact.responseSla}`,
    body: `Someone who knows the product, during ${contact.businessHours}. If your enquiry came in outside those hours, the next working morning.`,
  },
  {
    icon: 'calendar',
    title: 'Then a 30-minute walkthrough',
    body: 'Live product, your salary structure, your states. We will confirm a time that suits you.',
  },
]

const onwardLinks: { href: string; title: string; body: string }[] = [
  {
    href: '/features/payroll',
    title: 'How payroll and compliance work',
    body: 'The statutory coverage table and a worked payslip with the arithmetic shown.',
  },
  {
    href: '/pricing',
    title: 'What it will cost',
    body: 'Tier comparison and a calculator you can run against your own headcount.',
  },
  {
    href: '/features',
    title: 'Every module in the product',
    body: 'The full list, honestly grouped — so you know what you are not getting too.',
  },
]

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams
  const source = from ?? 'unknown'

  return (
    <>
      <ConversionTracker source={source} />

      <section className="bg-brand-50 py-12 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Icon name="check" className="h-8 w-8" />
            </span>
            <h1 className="mt-6 text-[2.1rem] font-bold leading-[1.12] sm:text-4xl">
              Thanks — we have your enquiry
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              Nothing else is needed from you right now. Here is exactly what
              happens next, and by when.
            </p>
          </div>
        </Container>
      </section>

      {/* ── What happens next ────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="What happens next">
        <ol className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
          {nextSteps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl bg-white p-6 ring-1 ring-ink-200/70"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700">
                <Icon name={step.icon} className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-bold leading-snug">
                <span className="text-brand-600">{i + 1}.</span> {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.body}</p>
            </li>
          ))}
        </ol>

        {/* Spec §4.7 — add-to-calendar. Shown only when a calendar is wired
            up, because otherwise there is no confirmed slot to add. */}
        {booking.calendarUrl && (
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl bg-brand-50 p-6 text-center ring-1 ring-brand-100">
            <p className="text-sm text-ink-600">
              Already picked a slot? The calendar invite is in the confirmation
              email, with the meeting link and a reminder 24 hours and 1 hour
              before.
            </p>
          </div>
        )}
      </Section>

      {/* ── Onward links ─────────────────────────────────────────────────── */}
      <Section tone="tint" ariaLabel="While you wait">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">While you wait</h2>
          <p className="mt-3 text-[1.05rem] text-ink-600">
            The three pages most people read before the call.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
          {onwardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl bg-white p-6 ring-1 ring-ink-200/70 transition-shadow hover:shadow-lg hover:shadow-brand-900/5 hover:ring-brand-200"
            >
              <h3 className="flex items-start gap-1.5 text-base font-bold leading-snug">
                {link.title}
                <Icon
                  name="arrow-right"
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{link.body}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-ink-600">
            Something urgent, or want to talk now?
          </p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={`tel:${contact.phoneE164}`} size="lg">
              <Icon name="phone" className="h-4 w-4" />
              {contact.phoneDisplay}
            </Button>
            <Button href="/" variant="secondary" size="lg">
              Back to the home page
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
