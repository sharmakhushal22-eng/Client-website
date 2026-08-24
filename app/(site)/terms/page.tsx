import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalLayout } from '@/components/legal/LegalLayout'
import { pageMetadata } from '@/lib/seo'
import { company, contact, orPending, registeredOfficeLine, site } from '@/site.config'

export const metadata: Metadata = pageMetadata({
  title: 'Terms of service',
  description:
    'The terms governing use of the EZER HRMS marketing website. Use of the product itself is governed by your separate subscription agreement.',
  path: '/terms',
})

export default function TermsPage() {
  const addr = company.registeredAddress

  return (
    <LegalLayout
      title="Terms of service"
      updated="20 August 2026"
      intro={`These terms govern your use of ${site.url}. They are not the terms of the EZER HRMS product — if your company subscribes, that is governed by a separate subscription agreement.`}
    >
      <h2>1. Scope</h2>
      <p>
        This website is published by{' '}
        {orPending(company.legalName, 'registered entity to be confirmed')},
        registered office {registeredOfficeLine}, CIN{' '}
        {orPending(company.cin, 'CIN to be confirmed')}. By using the site you
        accept these terms.
      </p>
      <p>
        <strong>This site is marketing material, not the product.</strong> Access
        to the EZER HRMS application is governed by the subscription agreement
        signed between us and your employer, which prevails over anything on this
        website in the event of a conflict.
      </p>

      <h2>2. What you may do</h2>
      <p>
        You may read, print and share pages of this site for the purpose of
        evaluating EZER HRMS. You may quote short extracts with attribution.
      </p>

      <h2>3. What you may not do</h2>
      <ul>
        <li>Copy or republish substantial parts of the site as your own material.</li>
        <li>Use our name, logo or screenshots in a way that suggests we endorse you.</li>
        <li>Submit enquiry forms with false details, or automate submissions.</li>
        <li>Attempt to gain unauthorised access to any part of the site or its infrastructure.</li>
        <li>Use the site in any way that breaks Indian law.</li>
      </ul>

      <h2>4. Accuracy of information</h2>
      <p>
        We keep the descriptions of the product on this site accurate and update
        them as the product changes. Product capability statements describe what
        EZER HRMS does at the time of writing, not a commitment about future
        versions.
      </p>
      <p>
        Statutory rates, ceilings and thresholds referred to on this site
        (including on the payroll page) are given for illustration. Statutory
        positions change. Nothing on this site is legal, tax or accounting
        advice, and you should not rely on it as a substitute for professional
        advice on your own obligations.
      </p>

      <h2>5. Pricing shown on this site</h2>
      <p>
        Prices on the <Link href="/pricing">pricing page</Link> and the figures
        produced by the calculator are indicative. They are exclusive of GST and
        do not account for multi-entity setups, additional locations or migration
        scope. A binding price is the one in a written quotation from us.
      </p>

      <h2>6. Enquiries and demos</h2>
      <p>
        Submitting an enquiry does not create a contract. Booking a demo is an
        appointment, not an order. We may decline to provide a demo, and either
        of us may reschedule or cancel.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The content, design, screenshots and the EZER name and marks on this site
        belong to {orPending(company.legalName, 'registered entity to be confirmed')} or our licensors. Nothing on this site
        transfers any of those rights to you.
      </p>

      <h2>8. Third-party links</h2>
      <p>
        Where we link to another site or embed a third-party service (such as a
        scheduling calendar or a map), we do not control it and are not
        responsible for its content or its handling of your data.
      </p>

      <h2>9. Availability</h2>
      <p>
        We try to keep this site available but do not guarantee it. We may change,
        suspend or withdraw any part of it without notice. Availability
        commitments for the EZER HRMS product, where they exist, are in the
        subscription agreement — not here.
      </p>

      <h2>10. Liability</h2>
      <p>
        To the extent permitted by law, we are not liable for indirect or
        consequential loss arising from use of this website, or for loss arising
        from reliance on information on it. Nothing in these terms limits
        liability that cannot be limited by law.
      </p>

      <h2>11. Privacy</h2>
      <p>
        How we handle personal data collected through this site is set out in the{' '}
        <Link href="/privacy-policy">privacy policy</Link> and the{' '}
        <Link href="/cookie-policy">cookie policy</Link>.
      </p>

      <h2>12. Governing law</h2>
      <p>
        {/* TODO: confirm the jurisdiction with legal — it should normally match
            the registered office in site.config. */}
        These terms are governed by the laws of India. The courts at{' '}
        {orPending(`${addr.city}, ${addr.state}`, 'jurisdiction to be confirmed')}{' '}
        have exclusive jurisdiction over any dispute arising from them.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these terms:{' '}
        {contact.emailsLive && (
          <>
            <a href={`mailto:${contact.salesEmail}`}>{contact.salesEmail}</a>, or{' '}
          </>
        )}
        {contact.phoneDisplay} during {contact.businessHours}, or through the{' '}
        <a href="/contact">contact form</a>.
      </p>
    </LegalLayout>
  )
}
