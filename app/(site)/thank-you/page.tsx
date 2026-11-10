import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionHeading } from '@/components/ui/Section'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Button, Arrow } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { ConversionTracker } from '@/components/ConversionTracker'
import { pageMetadata } from '@/lib/seo'
import { DoodleCluster } from '@/components/graphics/Doodles'
import { contact, booking } from '@/site.config'

/* noIndex: a thank-you page in the search results is a page that fires a
 * conversion event for someone who never converted. */
export const metadata: Metadata = pageMetadata({
  title: 'Thanks, we have your enquiry',
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
    body: 'Check your inbox. It should arrive within a minute. If it does not, look in spam and mark it as safe, or call us.',
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
    body: 'The full list, honestly grouped, so you know what you are not getting too.',
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
    <PageTransition kind="direct">
      <ConversionTracker source={source} />

      <PageHero
        kind="editorial"
        decor={<DoodleCluster set="celebrate" />}
        eyebrow="Enquiry received"
        title={['Thanks.', <span key="b" className="text-ink-400">We have it from here.</span>]}
        lede="Nothing else is needed from you right now. Here is exactly what happens next, and by when."
      >
        <ol data-h="fade" style={{ '--d': '420ms' } as React.CSSProperties} className="mt-14 grid border-t-2 border-ink-900 sm:grid-cols-3">
          {nextSteps.map((step, i) => (
            <li key={step.title} className={`border-b border-ink-900/10 py-7 sm:border-b-0 sm:pr-7 ${i > 0 ? 'sm:border-l sm:pl-7' : ''}`}>
              <p className="flex items-center gap-3">
                <span className="ez-num grid h-8 w-8 place-items-center rounded-full bg-ink-900 text-[0.78rem] font-semibold text-white">{i + 1}</span>
                <Icon name={step.icon} className="h-4 w-4 text-ink-400" />
              </p>
              <h2 className="mt-4 text-[1.3rem] leading-snug">{step.title}</h2>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-600">{step.body}</p>
            </li>
          ))}
        </ol>

        {/* Spec §4.7 — add-to-calendar. Shown only when a calendar is wired
            up, because otherwise there is no confirmed slot to add. */}
        {booking.calendarUrl && (
          <p className="mt-8 max-w-2xl border-l-2 border-marigold pl-5 text-[0.95rem] text-ink-600">
            Already picked a slot? The calendar invite is in the confirmation email, with
            the meeting link and a reminder 24 hours and 1 hour before.
          </p>
        )}
      </PageHero>

      {/* ── Onward links ─────────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="While you wait">
        <SectionHeading eyebrow="While you wait" title="The three pages most people read before the call" />
        <ul className="mt-10 border-t border-ink-900/10">
          {onwardLinks.map((link) => (
            <li key={link.href} className="border-b border-ink-900/10">
              <Link href={link.href} className="group grid items-baseline gap-2 py-6 sm:grid-cols-12 sm:gap-6">
                <span className="font-display text-[1.5rem] font-[640] leading-tight tracking-[-0.03em] text-ink-900 transition-colors [font-stretch:106%] group-hover:text-brand-700 sm:col-span-5">
                  {link.title}
                </span>
                <span className="text-[1rem] text-ink-600 sm:col-span-6">{link.body}</span>
                <span aria-hidden="true" className="hidden justify-self-end text-ink-400 transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-brand-700 sm:col-span-1 sm:block">
                  <Arrow className="h-5 w-5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="mr-4 text-[0.98rem] text-ink-600">Something urgent?</p>
          <Button href={`tel:${contact.phoneE164}`} size="lg">
            <Icon name="phone" className="h-4 w-4" />
            {contact.phoneDisplay}
          </Button>
          <Button href="/" variant="secondary" size="lg">
            Back to the home page
          </Button>
        </div>
      </Section>
    </PageTransition>
  )
}
