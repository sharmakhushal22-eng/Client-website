import type { Metadata } from 'next'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Icon, type IconName } from '@/components/ui/Icon'
import { FullEnquiryForm } from '@/components/forms/FullEnquiryForm'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { DoodleCluster } from '@/components/graphics/Doodles'
import { company, companyDetails, contact, displayLegalName } from '@/site.config'

export const metadata: Metadata = pageMetadata({
  title: 'Contact us',
  description:
    'Talk to sales, get support, or ask about partnerships. Phone, WhatsApp, an enquiry form and our registered office, with a stated response time.',
  path: '/contact',
})

/* Spec §4.5 — "Separate routes for sales, support and partnership so they
 * don't land in one inbox." Each route gets its own address rather than one
 * shared mailbox with a subject-line convention nobody follows. */
const routes: {
  icon: IconName
  title: string
  body: string
  email: string
  /* Where to send someone while `contact.emailsLive` is false. Every route
   * has to land somewhere that is actually monitored — an unrouted enquiry is
   * worse than an absent one, because the sender thinks they have been heard. */
  fallbackNote: string
}[] = [
  {
    icon: 'briefcase',
    title: 'Sales',
    body: 'Pricing, demos, migration scope, or whether EZER fits what you run today.',
    email: contact.salesEmail,
    fallbackNote: 'Use the enquiry form, or WhatsApp us. Both reach the sales team directly.',
  },
  {
    icon: 'settings',
    title: 'Support',
    body: 'Already a customer? Support is fastest through the in-app support desk, which raises a ticket against your account.',
    email: contact.supportEmail,
    fallbackNote: 'Existing customers: raise it in the in-app support desk. Urgent? Call the number above.',
  },
  {
    icon: 'users',
    title: 'Partnerships',
    body: 'Consultants, CA firms and resellers working with Indian employers.',
    email: contact.partnerEmail,
    fallbackNote: 'Send it through the enquiry form and mark the message “partnership”.',
  },
]

export default function ContactPage() {
  const addr = company.registeredAddress
  const fullAddress = `${addr.line1}, ${addr.line2}, ${addr.city}, ${addr.state} ${addr.pincode}, ${addr.country}`
  const whatsappHref = `https://wa.me/${contact.whatsappE164}?text=${encodeURIComponent(
    contact.whatsappPrefill,
  )}`

  return (
    <PageTransition kind="direct">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />

      <PageHero
        kind="direct"
        decor={<DoodleCluster set="contact" />}
        crumbs={[{ name: 'Contact' }]}
        eyebrow="Contact"
        title={['Tell us what you are', <span key="b" className="text-ink-400">trying to fix.</span>]}
        lede={
          <>
            <p>
              The more you tell us up front about headcount, states and what you are running
              today, the less of the first call is spent establishing it. We reply{' '}
              {contact.responseSla} during business hours.
            </p>
            <p className="mt-3 text-[1rem]">
              Or call{' '}
              <a href={`tel:${contact.phoneE164}`} className="ez-link font-semibold text-brand-700">
                {contact.phoneDisplay}
              </a>{' '}
              directly.
            </p>
          </>
        }
      />

      <Section tone="paper" ariaLabel="Contact form and details" className="ez-static !pt-2">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          {/* ── Form ─────────────────────────────────────────────────────── */}
          <div className="rounded-[28px] bg-white p-6 ring-1 ring-ink-900/[0.06] sm:p-10 lg:col-span-7">
            <h2 className="text-[1.8rem] leading-tight">Send an enquiry</h2>
            <p className="mt-2 text-[0.95rem] text-ink-600">
              Fields marked <span className="text-brand-600">*</span> are required.
              The rest help us prepare, so skip them if you would rather just talk.
            </p>
            <div className="mt-8">
              <FullEnquiryForm formName="contact-page" submitLabel="Send enquiry" />
            </div>
          </div>

          {/* ── Direct channels ─────────────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-5">
            {/* Immediate contact first — someone who wants to phone should not
                have to scroll past a form to find the number. */}
            <div className="rounded-[28px] bg-navy p-7 text-white sm:p-8">
              <h2 className="text-[1.5rem] !text-white">Would rather just talk?</h2>
              <div className="mt-5 space-y-3">
                <a
                  href={`tel:${contact.phoneE164}`}
                  className="ez-press flex items-center gap-3 rounded-[16px] bg-white/[0.06] p-4 ring-1 ring-white/10 transition-colors hover:bg-white/[0.1]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink-900">
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[1rem] font-semibold text-white">
                      {contact.phoneDisplay}
                    </span>
                    <span className="block text-xs text-white/60">
                      {contact.businessHours}
                    </span>
                  </span>
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ez-press flex items-center gap-3 rounded-[16px] bg-white/[0.06] p-4 ring-1 ring-white/10 transition-colors hover:bg-white/[0.1]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1fa855] text-white">
                    <Icon name="whatsapp" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[1rem] font-semibold text-white">WhatsApp</span>
                    <span className="block text-xs text-white/60">
                      Usually the fastest way to reach us
                    </span>
                  </span>
                </a>
              </div>

              <p className="mt-5 flex items-start gap-2 text-sm text-white/70">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-marigold" />
                We respond {contact.responseSla}. If it is outside business hours,
                the next working morning.
              </p>
            </div>

            {/* ── Routes ────────────────────────────────────────────────── */}
            <div className="border-t border-ink-900/10">
              {routes.map((route) => (
                <div
                  key={route.title}
                  className="border-b border-ink-900/10 py-5"
                >
                  <h3 className="flex items-center gap-2 text-[1.02rem] font-semibold text-ink-900">
                    <Icon name={route.icon} className="h-5 w-5 text-brand-600" />
                    {route.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    {route.body}
                  </p>
                  {contact.emailsLive ? (
                    <a
                      href={`mailto:${route.email}`}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
                    >
                      {route.email}
                      <Icon name="arrow-right" className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-relaxed text-brand-700">
                      <Icon name="arrow-right" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {route.fallbackNote}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* ── Office ─────────────────────────────────────────────────
                Renders only once there is a real address. A map pointing at
                "TODO address line 1" is a worse answer than no map. */}
            {companyDetails.hasAddress && (
            <div className="overflow-hidden rounded-[24px] bg-white ring-1 ring-ink-900/[0.06]">
              <div className="p-6">
                <h3 className="flex items-center gap-2 text-base font-bold">
                  <Icon name="map-pin" className="h-5 w-5 text-brand-600" />
                  Registered office
                </h3>
                <address className="mt-3 text-sm not-italic leading-relaxed text-ink-600">
                  <span className="block font-semibold text-ink-900">
                    {displayLegalName}
                  </span>
                  {addr.line1}
                  <br />
                  {addr.line2}
                  <br />
                  {addr.city}, {addr.state} {addr.pincode}
                  <br />
                  {addr.country}
                </address>
                <dl className="mt-3 space-y-0.5 text-xs text-ink-500">
                  {companyDetails.hasCin && (
                    <div className="flex gap-2">
                      <dt>CIN</dt>
                      <dd>{company.cin}</dd>
                    </div>
                  )}
                  {companyDetails.hasGstin && (
                    <div className="flex gap-2">
                      <dt>GSTIN</dt>
                      <dd>{company.gstin}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Spec §4.5 asks for an embedded map. Loaded lazily and only
                  as an iframe from google.com/maps — no Maps JS API key in
                  client code, and nothing is fetched until it scrolls into
                  view (§8.3). */}
              <iframe
                title={`Map showing the registered office of ${company.legalName}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0 border-t border-ink-200"
              />
            </div>
            )}
          </div>
        </div>
      </Section>
    </PageTransition>
  )
}
