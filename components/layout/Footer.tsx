import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Logo } from './Logo'
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
    <footer className="bg-dark text-on-dark-muted">
      <Container className="py-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          {/* ── Brand, address, contact ─────────────────────────────────── */}
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-dark-faint">
              {site.footerBlurb}
            </p>

            {/* Each block renders only once it is real. An Indian B2B buyer
                reads a missing address as a young company; they read "TODO
                address line 1" as nobody being in charge. */}
            <address className="mt-6 space-y-1 text-sm not-italic leading-relaxed text-on-dark-faint">
              <p className="font-semibold text-white">{displayLegalName}</p>
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
              <dl className="mt-4 space-y-1 text-sm text-on-dark-faint">
                {companyDetails.hasCin && (
                  <div className="flex gap-2">
                    <dt className="text-on-dark-faint">CIN</dt>
                    <dd>{company.cin}</dd>
                  </div>
                )}
                {companyDetails.hasGstin && (
                  <div className="flex gap-2">
                    <dt className="text-on-dark-faint">GSTIN</dt>
                    <dd>{company.gstin}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a
                href={`tel:${contact.phoneE164}`}
                className="flex items-center gap-2 font-semibold text-white hover:text-brand-300"
              >
                <Icon name="phone" className="h-4 w-4" />
                {contact.phoneDisplay}
              </a>
              {/* While the sales mailbox is not live, WhatsApp takes its place
                  rather than the footer advertising an address nobody reads. */}
              {contact.emailsLive ? (
                <a
                  href={`mailto:${contact.salesEmail}`}
                  className="flex items-center gap-2 font-semibold text-white hover:text-brand-300"
                >
                  <Icon name="mail" className="h-4 w-4" />
                  {contact.salesEmail}
                </a>
              ) : (
                <a
                  href={`https://wa.me/${contact.whatsappE164}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-white hover:text-brand-300"
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
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
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
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-on-dark-faint transition-colors hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="sm:col-span-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
                Compliance updates
              </h2>
              <p className="mt-3 max-w-md text-sm text-on-dark-faint">
                Statutory changes that affect Indian payroll — EPF, ESIC, PT slabs,
                TDS. Sent when something actually changes, not on a schedule.
              </p>
              <div className="mt-4 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-dark-faint">
            © {new Date().getFullYear()} {displayLegalName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
