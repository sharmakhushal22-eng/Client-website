import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Brand } from './Brand'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { company, companyDetails, contact, displayLegalName, site, social } from '@/site.config'

/* Spec §4.1 §14 — sitemap links, address, GST/CIN, phone, email, socials,
 * legal links, copyright. The full registered address is not decoration: for
 * an Indian B2B buyer it is the difference between a company and a landing
 * page. */

const columns = [
  {
    title: 'Product',
    links: [
      ['/features', 'All features'],
      ['/features/payroll', 'Payroll & compliance'],
      ['/features/attendance', 'Attendance & leave'],
      ['/features/recruitment', 'Recruitment & onboarding'],
      ['/features/ess', 'Employee self-service'],
      ['/features/claims', 'Claims & travel'],
    ],
  },
  {
    /* Mirrors the header: compliance and industries are qualifying questions,
       not product sub-topics, so they get their own column rather than being
       buried under Product. */
    title: 'Solutions',
    links: [
      ['/compliance', 'Statutory compliance'],
      ['/industries', 'Industries'],
      ['/resources/policy-handbook', 'Policy handbook'],
      ['/pricing', 'Pricing'],
      ['/book-a-demo', 'Book a demo'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['/about', 'About EZER'],
      ['/blog', 'Blog'],
      ['/contact', 'Contact'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['/privacy-policy', 'Privacy policy'],
      ['/terms', 'Terms of service'],
      ['/cookie-policy', 'Cookie policy'],
    ],
  },
]

export function Footer() {
  const addr = company.registeredAddress

  return (
    <footer className="relative overflow-hidden bg-paper-2 text-ink-600">
      <Container className="relative pb-10 pt-16 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          {/* ── Brand, address, contact ─────────────────────────────────── */}
          <div>
            {/* Bigger than the header: the footer has vertical room, and
                one control is all it takes to use it. */}
            <Brand size="text-[1.45rem]" />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-600">
              {site.footerBlurb}
            </p>

            {/* Each block renders only once it is real. An Indian B2B buyer
                reads a missing address as a young company; they read "TODO
                address line 1" as nobody being in charge. */}
            <address className="mt-6 space-y-1 text-sm not-italic leading-relaxed text-ink-500">
              <p className="font-semibold text-ink-900">{displayLegalName}</p>
              {companyDetails.hasAddress && (
                <>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>
                    {addr.city}, {addr.state} {addr.pincode}, {addr.country}
                  </p>
                </>
              )}
            </address>

            {(companyDetails.hasCin || companyDetails.hasGstin) && (
              <dl className="mt-4 space-y-1 text-sm text-ink-500">
                {companyDetails.hasCin && (
                  <div className="flex gap-2">
                    <dt className="text-ink-400">CIN</dt>
                    <dd>{company.cin}</dd>
                  </div>
                )}
                {companyDetails.hasGstin && (
                  <div className="flex gap-2">
                    <dt className="text-ink-400">GSTIN</dt>
                    <dd>{company.gstin}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a
                href={`tel:${contact.phoneE164}`}
                className="flex items-center gap-2 font-semibold text-ink-900 hover:text-brand-700"
              >
                <Icon name="phone" className="h-4 w-4" />
                {contact.phoneDisplay}
              </a>
              {/* While the sales mailbox is not live, WhatsApp takes its place
                  rather than the footer advertising an address nobody reads. */}
              {contact.emailsLive ? (
                <a
                  href={`mailto:${contact.salesEmail}`}
                  className="flex items-center gap-2 font-semibold text-ink-900 hover:text-brand-700"
                >
                  <Icon name="mail" className="h-4 w-4" />
                  {contact.salesEmail}
                </a>
              ) : (
                <a
                  href={`https://wa.me/${contact.whatsappE164}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-ink-900 hover:text-brand-700"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp us
                </a>
              )}
            </div>

            {social.linkedin && (
              <div className="mt-5 flex gap-2">
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink-900 ring-1 ring-ink-900/10 transition-colors hover:text-brand-700"
                >
                  <Icon name="linkedin" className="h-5 w-5" title="EZER HRMS on LinkedIn" />
                </a>
              </div>
            )}
          </div>

          {/* ── Sitemap + newsletter ────────────────────────────────────── */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="ez-kicker !font-mono !text-[0.7rem] !font-medium !tracking-[0.08em] text-ink-400">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="ez-link text-[0.93rem] text-ink-700 transition-colors hover:text-ink-900"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="sm:col-span-3">
              <h2 className="ez-kicker !font-mono !text-[0.7rem] !font-medium !tracking-[0.08em] text-ink-400">
                Compliance updates
              </h2>
              <p className="mt-3 max-w-md text-[0.93rem] text-ink-600">
                Statutory changes that affect Indian payroll: EPF, ESIC, PT slabs,
                TDS. Sent when something actually changes, not on a schedule.
              </p>
              <div className="mt-4 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────── */}
        <div className="mt-14 flex flex-col gap-4 border-t border-ink-900/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-500">
            © {new Date().getFullYear()} {displayLegalName}. All rights reserved.
          </p>
          <p className="text-sm text-ink-500">EZER, as in easier.</p>
        </div>
      </Container>

      {/* The wordmark, once more, at the width of the page — the hero opens on
          it and the footer closes on it. Cut by the bottom edge. Static. */}
      <div aria-hidden="true" className="pointer-events-none relative h-[12vw] select-none overflow-hidden">
        <div
          data-word="EZER"
          className="ez-wordmark absolute inset-x-0 top-0 text-center font-display text-[24vw] font-[860] leading-[0.8] tracking-[-0.06em] text-ink-900/[0.06] [font-stretch:125%]"
        />
      </div>
    </footer>
  )
}
