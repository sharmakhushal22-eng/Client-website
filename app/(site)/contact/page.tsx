import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Icon, type IconName } from '@/components/ui/Icon'
import { FullEnquiryForm } from '@/components/forms/FullEnquiryForm'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { company, companyDetails, contact, displayLegalName } from '@/site.config'

export const metadata: Metadata = pageMetadata({
  title: 'Contact us',
  description:
    'Talk to sales, get support, or ask about partnerships. Phone, WhatsApp, an enquiry form and our registered office — with a stated response time.',
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
    fallbackNote: 'Use the enquiry form, or WhatsApp us — both reach the sales team directly.',
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
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />

      <section className="bg-brand-50 py-10 sm:py-14">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              Contact
            </p>
            <h1 className="mt-3 text-[2.1rem] font-bold leading-[1.12] sm:text-5xl">
              Tell us what you are trying to fix
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              The more you tell us up front — headcount, states, what you are
              running today — the less of the first call is spent establishing
              it. We reply {contact.responseSla} during business hours.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white" ariaLabel="Contact form and details">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* ── Form ─────────────────────────────────────────────────────── */}
          <div>
            <h2 className="text-2xl font-bold">Send an enquiry</h2>
            <p className="mt-2 text-[0.95rem] text-ink-600">
              Fields marked <span className="text-brand-600">*</span> are required.
              The rest help us prepare — skip them if you would rather just talk.
            </p>
            <div className="mt-8">
              <FullEnquiryForm formName="contact-page" submitLabel="Send enquiry" />
            </div>
          </div>

          {/* ── Direct channels ─────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Immediate contact first — someone who wants to phone should not
                have to scroll past a form to find the number. */}
            <div className="rounded-2xl bg-brand-50 p-7 ring-1 ring-brand-100">
              <h2 className="text-lg font-bold">Would rather just talk?</h2>
              <div className="mt-5 space-y-3">
                <a
                  href={`tel:${contact.phoneE164}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-ink-200 transition-shadow hover:shadow-md"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700">
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink-900">
                      {contact.phoneDisplay}
                    </span>
                    <span className="block text-xs text-ink-500">
                      {contact.businessHours}
                    </span>
                  </span>
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-ink-200 transition-shadow hover:shadow-md"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#25D366]/15 text-[#128C7E]">
                    <Icon name="whatsapp" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink-900">WhatsApp</span>
                    <span className="block text-xs text-ink-500">
                      Usually the fastest way to reach us
                    </span>
                  </span>
                </a>
              </div>

              <p className="mt-5 flex items-start gap-2 text-sm text-ink-600">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                We respond {contact.responseSla}. If it is outside business hours,
                the next working morning.
              </p>
            </div>

            {/* ── Routes ────────────────────────────────────────────────── */}
            <div className="space-y-3">
              {routes.map((route) => (
                <div
                  key={route.title}
                  className="rounded-2xl bg-white p-5 ring-1 ring-ink-200"
                >
                  <h3 className="flex items-center gap-2 text-base font-bold">
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
            <div className="overflow-hidden rounded-2xl ring-1 ring-ink-200">
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
    </>
  )
}
