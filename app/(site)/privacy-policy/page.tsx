import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalLayout } from '@/components/legal/LegalLayout'
import { pageMetadata } from '@/lib/seo'
import { company, contact, orPending, registeredOfficeLine, site } from '@/site.config'

export const metadata: Metadata = pageMetadata({
  title: 'Privacy policy',
  description:
    'What personal data this website collects, why, how long it is kept, and how to exercise your rights under the DPDP Act 2023.',
  path: '/privacy-policy',
})

/* Spec §8.7 — DPDP Act 2023 requires: a stated purpose of collection, explicit
 * unticked consent, a NAMED grievance officer with contact details, and a
 * working data-deletion route. All four appear below. */
export default function PrivacyPolicyPage() {

  return (
    <LegalLayout
      title="Privacy policy"
      updated="20 August 2026"
      intro={`How ${orPending(company.legalName, 'registered entity to be confirmed')} handles personal data collected through ${site.url}. This policy covers the marketing website only — data inside the EZER HRMS product is governed by the agreement with your employer.`}
    >
      <h2>1. Who we are</h2>
      <p>
        {orPending(company.legalName, 'registered entity to be confirmed')}{' '}
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates EZER
        HRMS. Our registered office is at {registeredOfficeLine}. Our CIN is{' '}
        {orPending(company.cin, 'CIN to be confirmed')}.
      </p>
      <p>
        For personal data collected through this website, we are the Data
        Fiduciary under the Digital Personal Data Protection Act, 2023.
      </p>

      <h2>2. What we collect, and why</h2>
      <p>
        We collect only what an enquiry needs. There is no account to create on
        this website and no profile built about you.
      </p>
      <table>
        <thead>
          <tr>
            <th>What</th>
            <th>Why</th>
            <th>Basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name, work email, phone, company name</td>
            <td>To respond to your enquiry and arrange a demo</td>
            <td>Your consent</td>
          </tr>
          <tr>
            <td>Headcount, role, city/state, current system, timeline</td>
            <td>To prepare a relevant demo rather than a generic one</td>
            <td>Your consent</td>
          </tr>
          <tr>
            <td>Campaign source, referring page, landing page</td>
            <td>To understand which channels bring genuine enquiries</td>
            <td>Legitimate use</td>
          </tr>
          <tr>
            <td>A one-way hash of your IP address</td>
            <td>To rate-limit form submissions and prevent abuse</td>
            <td>Legitimate use</td>
          </tr>
          <tr>
            <td>Analytics about page usage</td>
            <td>To see which pages help and which do not</td>
            <td>Your consent, given through the cookie banner</td>
          </tr>
        </tbody>
      </table>
      <p>
        We store a hash of your IP address, not the address itself. The hash lets
        us count submissions from the same source; it cannot be reversed back
        into an address.
      </p>

      <h2>3. Consent</h2>
      <p>
        The consent checkbox on our forms is unticked by default and must be
        ticked by you. We record the date and time you gave consent and the exact
        wording you agreed to. You may withdraw consent at any time by writing to{' '}
        <a href={`mailto:${contact.privacyEmail}`}>{contact.privacyEmail}</a>;
        withdrawal does not affect anything done before you withdrew it.
      </p>

      <h2>4. What we do not do</h2>
      <ul>
        <li>We do not sell personal data, and we do not share it for anyone else&rsquo;s marketing.</li>
        <li>We do not add you to a mailing list because you asked for a demo. Newsletter signup is separate and requires you to confirm by email.</li>
        <li>We do not use enquiry data to train machine-learning models.</li>
        <li>We do not load analytics or advertising cookies before you accept them.</li>
      </ul>

      <h2>5. Who else sees it</h2>
      <p>
        We use a small number of processors, each contractually bound to use the
        data only to provide their service to us:
      </p>
      <ul>
        <li><strong>Supabase</strong> — database hosting for enquiry records.</li>
        <li><strong>Resend</strong> — sending the confirmation email to you and the notification to our team.</li>
        <li><strong>Vercel</strong> — website hosting and delivery.</li>
        <li><strong>Google Analytics and Microsoft Clarity</strong> — website analytics, loaded only with your consent.</li>
        <li><strong>Cal.com or Calendly</strong> — demo scheduling, if you book a slot.</li>
      </ul>
      <p>
        {/* TODO: confirm this list matches what is actually deployed, and add
            any processor introduced later. An incomplete list is the most
            common defect in a privacy policy. */}
        We will update this list if we add a processor.
      </p>

      <h2>6. Where it is stored, and for how long</h2>
      <p>
        Enquiry data is stored in {company.dataResidency}. We keep enquiry records
        for 24 months from your last interaction with us, after which they are
        deleted. Records relating to a customer relationship are kept for as long
        as that relationship lasts and for any period the law requires afterwards.
      </p>

      <h2>7. Your rights</h2>
      <p>Under the DPDP Act 2023 you may:</p>
      <ul>
        <li>ask what personal data of yours we hold, and get a copy;</li>
        <li>have inaccurate data corrected, and incomplete data completed;</li>
        <li>have your data erased;</li>
        <li>withdraw consent you previously gave;</li>
        <li>nominate someone to exercise these rights if you are unable to; and</li>
        <li>complain to the Data Protection Board of India.</li>
      </ul>
      <p>
        To exercise any of these, write to{' '}
        <a href={`mailto:${contact.privacyEmail}`}>{contact.privacyEmail}</a> with
        the email address or phone number you used. We will respond within 30
        days. Deletion requests are actioned within 30 days unless we are required
        by law to retain something, in which case we will tell you what and why.
      </p>

      <h2>8. Grievance officer</h2>
      <p>
        As required by the DPDP Act 2023, our grievance officer is:
      </p>
      <ul>
        <li><strong>{orPending(company.grievanceOfficer.name, 'grievance officer to be appointed')}</strong></li>
        <li>Email: <a href={`mailto:${company.grievanceOfficer.email}`}>{company.grievanceOfficer.email}</a></li>
        <li>Phone: {company.grievanceOfficer.phone}</li>
        <li>Address: {registeredOfficeLine}</li>
      </ul>

      <h2>9. Security</h2>
      <p>
        The site is served over HTTPS. Enquiry records are held in a database
        separate from the EZER HRMS product database, with row-level security
        that permits new enquiries to be written but never read from a browser.
        Access to enquiry data inside our company is limited to the people who
        respond to enquiries.
      </p>

      <h2>10. Children</h2>
      <p>
        This is a business website and is not directed at children. We do not
        knowingly collect personal data of anyone under 18.
      </p>

      <h2>11. Changes</h2>
      <p>
        If we change this policy we will update the date at the top. If a change
        materially affects how we use data we already hold, we will contact you
        before it takes effect.
      </p>
      <p>
        Related: <Link href="/cookie-policy">Cookie policy</Link> ·{' '}
        <Link href="/terms">Terms of service</Link>
      </p>
    </LegalLayout>
  )
}
