import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalLayout } from '@/components/legal/LegalLayout'
import { pageMetadata } from '@/lib/seo'
import { company, contact, orPending, registeredOfficeLine, site } from '@/site.config'

export const metadata: Metadata = pageMetadata({
  title: 'Privacy policy',
  description:
    'What personal data EZER HRMS collects, in which of its two roles, why, how long it is kept, and how to exercise your rights under the DPDP Act 2023.',
  path: '/privacy-policy',
})

/* ============================================================================
 * Ported from the company's own policy document (EZER-Privacy-Policy, v1.0).
 *
 * The wording below is the company's legal text, reproduced rather than
 * paraphrased — a privacy policy is a legal instrument and a rewrite of it is
 * a different instrument.
 *
 * WHAT WAS DELIBERATELY NOT CARRIED OVER
 *
 * The source opens with a box headed "Draft — complete these before
 * publishing (then delete this box)". That box is an instruction to the
 * author, not policy, so it is not on the page. Its substance is not lost:
 * LegalLayout's needsReview banner already says the same thing to a reader,
 * and every item it lists is still visible below as a bracketed gap.
 *
 * WHY THE GAPS ARE VISIBLE RATHER THAN FILLED
 *
 * The source leaves twelve placeholders open. Inventing values for them would
 * be the one genuinely dangerous thing to do here: a retention period is a
 * commitment, a grievance officer is a statutory appointment, and an email
 * address that nobody monitors is worse than an admitted gap. So they render
 * through orPending() as "[to be confirmed]", which reads as a deliberate
 * hole to the lawyer reviewing this and cannot be mistaken for a fact by a
 * customer. See site.config for the same convention on the entity details.
 *
 * The two infrastructure placeholders are handled differently again — see the
 * note above Section 7.
 * ========================================================================= */

/* Matches orPending()'s output, for the values that have no config entry
 * because they were never decided rather than merely not carried. */
const pending = (label: string) => `[${label}]`

const RETENTION_ENQUIRY = pending('retention period to be confirmed')
const RETENTION_EXPORT = pending('export window to be confirmed')
const RESPONSE_WINDOW = pending('response window to be confirmed')
const PRIVACY_EMAIL = orPending(company.privacyEmail, 'privacy email to be confirmed')

export default function PrivacyPolicyPage() {
  const entity = orPending(company.legalName, 'registered entity to be confirmed')

  return (
    <LegalLayout
      title="Privacy policy"
      updated="30 August 2026"
      intro={`How ${entity}, which operates EZER HRMS, handles personal data — both on this website and inside the product. Version 1.0, written against the Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025.`}
    >
      <h2>1. Who we are</h2>
      <p>
        {entity}{' '}
        {/* Explicit: JSX drops the space between an expression and the text
            after it when the two are split by a line break, which is what
            welded the entity name to the opening bracket here. */}
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), a
        private limited company incorporated in India under the Companies Act,
        2013, having CIN {orPending(company.cin, 'CIN to be confirmed')} and its
        registered office at {registeredOfficeLine}, is the entity responsible
        for the personal data described in this policy.
      </p>
      <p>
        EZER HRMS (&ldquo;EZER&rdquo;) is the HR and payroll product operated by{' '}
        {entity}, available at {site.url}. References to &ldquo;EZER&rdquo; in
        this policy mean the product; the legal entity accountable for it is{' '}
        {entity}.
      </p>
      <p>
        This policy explains what personal data we collect, why, who we share it
        with, how long we keep it, and the rights you have under the Digital
        Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;) and the
        Digital Personal Data Protection Rules, 2025, notified on 13 November
        2025.
      </p>
      <p>
        In this policy, &ldquo;you&rdquo; or &ldquo;Data Principal&rdquo; means
        the individual the personal data relates to. &ldquo;Personal data&rdquo;
        means any data about an individual who is identifiable by or in relation
        to that data.
      </p>

      <h2>2. Our two roles — please read this first</h2>
      <p>
        EZER handles personal data in two very different capacities, and your
        rights are exercised differently in each. This distinction matters more
        than anything else in this policy.
      </p>

      <h3>Role 1 — Data Fiduciary: our website and our own business contacts</h3>
      <p>
        When you visit our website, request a demo, or contact us, we decide why
        and how your data is used. Here EZER is the Data Fiduciary, and you
        exercise your rights directly with us using the contact details in
        Section 22.
      </p>

      <h3>
        Role 2 — Data Processor: employee data inside a customer&rsquo;s EZER
        account
      </h3>
      <p>
        When a company subscribes to EZER and loads its employee records — salary
        structures, attendance, PF and ESIC details, investment declarations —
        that company is the Data Fiduciary, not us. It decides what to collect
        and why. EZER only processes that data on its written instructions, as a
        Data Processor.
      </p>
      <p>
        <strong>
          If you are an employee of a company that uses EZER: your employer
          controls your data, not us.
        </strong>{' '}
        Please send requests to access, correct or erase your records to your
        employer&rsquo;s HR or grievance contact. If you approach us directly, we
        will refer you to your employer and, where appropriate, notify them of
        your request — we are not permitted to alter their records on our own
        initiative.
      </p>

      <h2>3. Personal data we collect</h2>

      <h3>3.1 When you request a demo or contact us</h3>
      <p>Our demo form collects only what you type into it:</p>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Required?</th>
            <th>Why we need it</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Full name</td>
            <td>Yes</td>
            <td>To address you correctly and know who we are speaking to</td>
          </tr>
          <tr>
            <td>Phone number</td>
            <td>Yes</td>
            <td>To contact you about the demo you requested</td>
          </tr>
          <tr>
            <td>Work email</td>
            <td>Yes</td>
            <td>To send the demo invitation and follow-up</td>
          </tr>
          <tr>
            <td>Company name</td>
            <td>Yes</td>
            <td>To prepare a demo relevant to your organisation</td>
          </tr>
          <tr>
            <td>Your role and company size</td>
            <td>No</td>
            <td>To pitch at the right level of detail</td>
          </tr>
          <tr>
            <td>Free-text message</td>
            <td>No</td>
            <td>To answer anything specific you ask</td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>How the form works today, stated plainly:</strong> submitting the
        demo form does not send data to an EZER server. It opens WhatsApp on your
        device with a pre-filled message that you choose to send to{' '}
        {contact.phoneDisplay}. Your message therefore passes through WhatsApp
        (Meta Platforms) and is governed by WhatsApp&rsquo;s own privacy policy in
        addition to ours. Nothing is stored by us until you actually send that
        message.
      </p>

      <h3>3.2 When you simply browse the website</h3>
      <p>
        The website sets no cookies, uses no analytics or advertising trackers,
        and stores nothing in your browser. Two things still happen
        automatically:
      </p>
      <ul>
        <li>
          Our hosting provider records standard server logs (IP address,
          timestamp, page requested, browser type) for security and reliability.
        </li>
        <li>
          Fonts load from Google Fonts, so your IP address is visible to Google
          when a page loads. See Section 7.
        </li>
      </ul>

      <h3>3.3 Employee data inside the EZER product</h3>
      <p>
        Where a customer uses EZER for HR and payroll, the account may contain
        identity and contact details, employment and salary information,
        attendance and leave records, statutory identifiers such as PAN, Aadhaar,
        UAN and ESIC numbers, bank account details for salary credit, and
        investment declarations. This data is collected and controlled by the
        employer — see Section 2.
      </p>

      <h2>4. Why we use your data</h2>
      <p>
        Where EZER is the Data Fiduciary, we use personal data only for these
        specified purposes:
      </p>
      <ul>
        <li>To respond to a demo request or enquiry you sent us</li>
        <li>To arrange, run and follow up on a product demonstration</li>
        <li>To provide, support and administer the EZER service to a customer</li>
        <li>
          To send service and compliance updates relevant to a customer&rsquo;s
          use of EZER
        </li>
        <li>To keep our systems secure and to investigate misuse</li>
        <li>
          To comply with a legal obligation, or to establish or defend a legal
          claim
        </li>
      </ul>
      <p>
        We do not sell personal data, and we do not use it for behavioural
        advertising or automated decisions that produce legal effects.
      </p>

      <h2>5. Consent and how to withdraw it</h2>
      <p>
        Under the DPDP Act, consent must be free, specific, informed,
        unconditional and unambiguous, given by a clear affirmative action, and
        limited to the data necessary for the stated purpose. When you fill in
        our demo form and send the message, you consent to us contacting you
        about that request.
      </p>
      <p>
        You may withdraw consent at any time, and it must be as easy to withdraw
        as it was to give. Write to {PRIVACY_EMAIL} or call{' '}
        <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a> and ask us
        to stop. On withdrawal we will stop processing and erase your data within
        a reasonable period, unless we are required by law to retain it.
        Withdrawal does not affect processing already carried out lawfully before
        you withdrew.
      </p>

      <h2>6. Children&rsquo;s and persons with disability data</h2>
      <p>
        Our website and the EZER product are intended for businesses and are not
        directed at children. We do not knowingly collect personal data of anyone
        under 18 through this website.
      </p>
      <p>
        Where processing of a child&rsquo;s data is required, the DPDP Act obliges
        us to obtain verifiable consent of a parent or lawful guardian, and
        prohibits tracking, behavioural monitoring and targeted advertising
        directed at children. The same consent requirement applies to a person
        with disability who has a lawful guardian. If you believe a child&rsquo;s
        data has reached us, contact us and we will erase it.
      </p>

      {/* The source names two infrastructure recipients as [Hosting provider]
          and [Cloud/database provider]. They are described by role here rather
          than named, which is not a gap being papered over: naming the specific
          provider and region publicly narrows the search for anyone probing the
          infrastructure, and the same decision was already taken for the
          data-residency line in site.config. The disclosure a reader needs —
          that a hosting provider and a cloud provider receive this data, and
          what reaches them — is fully made. */}
      <h2>7. Who we share data with</h2>
      <p>
        We share personal data only with service providers who process it on our
        instructions under contract, and only as far as needed:
      </p>
      <table>
        <thead>
          <tr>
            <th>Recipient</th>
            <th>What reaches them</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>WhatsApp / Meta Platforms</td>
            <td>The demo message you choose to send</td>
            <td>It is the channel our contact form uses</td>
          </tr>
          <tr>
            <td>Google (Google Fonts)</td>
            <td>Your IP address and browser details</td>
            <td>Fonts are served from Google&rsquo;s CDN</td>
          </tr>
          <tr>
            <td>Our website hosting provider</td>
            <td>Server logs</td>
            <td>To host and secure the website</td>
          </tr>
          <tr>
            <td>Our cloud infrastructure and database provider</td>
            <td>Customer account and HR data</td>
            <td>To run the EZER product</td>
          </tr>
        </tbody>
      </table>
      <p>
        We may also disclose data where required by law, court order, or a lawful
        request from a government agency. We do not sell or rent personal data to
        anyone.
      </p>

      <h2>8. Where data is stored and cross-border transfers</h2>
      <p>
        Personal data processed through the EZER product is hosted in{' '}
        {company.dataResidency}.
      </p>
      <p>
        Some third-party services listed in Section 7 may process limited
        technical data outside India. The DPDP Act permits transfer of personal
        data outside India except to countries the Central Government restricts
        by notification; we will comply with any such restriction, and with any
        additional obligations that apply to us if we are ever designated a
        Significant Data Fiduciary.
      </p>

      <h2>9. How we protect data</h2>
      <p>
        We are required to take reasonable security safeguards to prevent a
        personal data breach. Ours include:
      </p>
      <ul>
        <li>Encryption of data in transit (HTTPS/TLS) and at rest</li>
        <li>
          Role-based access control, so a user sees only the records their role
          requires
        </li>
        <li>
          Masking of sensitive fields such as full Aadhaar and bank account
          numbers, except for the specific roles that need them
        </li>
        <li>
          Access logging and monitoring, with logs retained for at least one year
          as required under the DPDP Rules
        </li>
        <li>Contractual security obligations on every processor we engage</li>
      </ul>
      <p>
        No system is perfectly secure. We commit to reasonable, current
        safeguards and to telling you promptly if something goes wrong — see
        Section 14.
      </p>

      <h2>10. How long we keep data</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Retention</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Demo enquiries that do not convert</td>
            <td>{RETENTION_ENQUIRY} from last contact, then erased</td>
          </tr>
          <tr>
            <td>Customer account and HR data</td>
            <td>
              For the term of the subscription, plus {RETENTION_EXPORT} for
              export, then erased or returned
            </td>
          </tr>
          <tr>
            <td>Server and access logs</td>
            <td>At least 1 year, as required by the DPDP Rules</td>
          </tr>
          <tr>
            <td>Records we must keep by law (tax, statutory)</td>
            <td>For the period the relevant law requires</td>
          </tr>
        </tbody>
      </table>
      <p>
        We erase personal data when the purpose is no longer being served, or
        when you withdraw consent, unless retention is required by law.
      </p>

      <h2>11. Your rights as a Data Principal</h2>
      <p>Under the DPDP Act you have the right to:</p>
      <ul>
        <li>
          <strong>Access</strong> — a summary of the personal data we hold about
          you, how we are processing it, and who we have shared it with.
        </li>
        <li>
          <strong>Correction, completion, updating and erasure</strong> — to have
          inaccurate or misleading data corrected, incomplete data completed, and
          data erased where it is no longer needed and no law requires us to keep
          it.
        </li>
        <li>
          <strong>Grievance redressal</strong> — a readily available means of
          raising a complaint with us, which we must respond to. See Section 13.
        </li>
        <li>
          <strong>Nomination</strong> — to nominate another individual to
          exercise these rights on your behalf if you die or become
          incapacitated.
        </li>
      </ul>
      <p>
        To exercise any of these, write to {PRIVACY_EMAIL}. We may need to verify
        your identity first. We will respond within {RESPONSE_WINDOW}. These
        rights are free of charge.
      </p>
      <p>
        If your data sits inside your employer&rsquo;s EZER account, send the
        request to your employer — see Section 2.
      </p>

      <h2>12. Your duties as a Data Principal</h2>
      <p>
        The DPDP Act also places duties on individuals. You must not impersonate
        another person when providing data, must not suppress material
        information, must not register a false or frivolous grievance or
        complaint, and must provide only verifiably authentic information when
        exercising the right to correction or erasure. Breaching these duties can
        attract a penalty under the Act.
      </p>

      <h2>13. Grievance redressal</h2>
      <p>
        If you are unhappy with how we handle your personal data, contact our
        Grievance Officer first. We are obliged to respond and will do so within{' '}
        {RESPONSE_WINDOW}.
      </p>
      <h3>Grievance Officer</h3>
      <ul>
        <li>
          Name: {orPending(company.grievanceOfficer.name, 'name to be confirmed')}{' '}
          · Designation:{' '}
          {orPending(
            company.grievanceOfficer.designation,
            'designation to be confirmed',
          )}
        </li>
        <li>
          Email:{' '}
          {orPending(
            company.grievanceOfficer.email,
            'grievance email to be confirmed',
          )}
        </li>
        <li>
          Phone:{' '}
          <a href={`tel:${contact.phoneE164}`}>
            {company.grievanceOfficer.phone}
          </a>
        </li>
        <li>
          Address: {entity}, {registeredOfficeLine}
        </li>
      </ul>
      <p>
        <strong>Escalation.</strong> If we do not respond, or you are not
        satisfied with our response, you may complain to the Data Protection
        Board of India, which is constituted and accepting complaints. Please
        raise the matter with us first — the Board expects you to have exhausted
        our grievance process.
      </p>

      <h2>14. If there is a data breach</h2>
      <p>
        If a personal data breach occurs, we will notify the Data Protection
        Board of India and every affected Data Principal without delay, in plain
        language, describing the nature and extent of the breach, its likely
        consequences, the measures we have taken, and what you can do to protect
        yourself. A detailed report follows to the Board within 72 hours, as the
        DPDP Rules require.
      </p>

      <h2>15. Cookies and tracking</h2>
      <p>
        This website currently sets no cookies and runs no analytics, advertising
        or tracking scripts. If we add analytics later, we will update this policy
        and obtain consent where the law requires it before any non-essential
        tracking begins.
      </p>

      <h2>16. Marketing communications and opt-out</h2>
      <p>
        If you give us your contact details, we may send you product updates,
        compliance notes and event invitations relevant to HR and payroll in
        India. Every such message carries a one-click unsubscribe, and you can
        also write to {PRIVACY_EMAIL} at any time to stop.
      </p>
      <p>
        Opting out of marketing does not stop service messages — for example,
        notices about billing, security, downtime, or a change to this policy —
        which we must send to customers while their subscription is active.
      </p>

      <h2>17. Job applicants</h2>
      <p>
        If you apply for a role at EZER, we collect the personal data in your
        application: name, contact details, CV, work history, education and
        anything else you choose to send. We use it only to assess your
        application, to communicate with you about it, and to meet our
        record-keeping obligations.
      </p>
      <p>
        We keep applications for {RETENTION_ENQUIRY} so we can consider you for
        future openings, unless you ask us to erase them sooner. Write to{' '}
        {PRIVACY_EMAIL} to withdraw an application or have your data erased.
      </p>

      <h2>18. Customers — Data Processing Agreement</h2>
      <p>
        Where EZER acts as a Data Processor for a customer (see Section 2), our
        processing is governed by a written Data Processing Agreement forming
        part of the subscription contract. That agreement sets out:
      </p>
      <ul>
        <li>
          The scope, nature and purpose of processing, and the categories of Data
          Principals involved
        </li>
        <li>
          Our obligation to process only on the customer&rsquo;s documented
          instructions
        </li>
        <li>
          Security safeguards, confidentiality undertakings and personnel
          controls
        </li>
        <li>
          The approved sub-processors we may engage, and notice before we change
          them
        </li>
        <li>
          Our duty to assist the customer in responding to Data Principal
          requests and to breach obligations
        </li>
        <li>Return or deletion of the customer&rsquo;s data on termination</li>
      </ul>
      <p>
        Existing and prospective customers can request a copy of the current DPA
        and our sub-processor list from {PRIVACY_EMAIL}.
      </p>

      <h2>19. Third-party links</h2>
      <p>
        Our website and product may link to sites we do not operate. We are not
        responsible for their content or their privacy practices, and this policy
        does not apply to them. Please read the privacy policy of any site you
        visit from ours.
      </p>

      <h2>20. Governing law and jurisdiction</h2>
      <p>
        This policy is governed by the laws of India. Disputes arising from it
        are subject to the exclusive jurisdiction of the courts at Gurugram,
        Haryana, without prejudice to your statutory right to complain to the
        Data Protection Board of India under Section 13.
      </p>

      <h2>21. Changes to this policy</h2>
      <p>
        We may update this policy as our product, our processors, or the law
        changes. The &ldquo;last updated&rdquo; date at the top will always
        reflect the current version. Where a change materially affects how we use
        your personal data, we will notify you and, where required, obtain fresh
        consent.
      </p>

      <h2>22. Contact us</h2>
      <h3>{entity}</h3>
      <ul>
        <li>
          Operator of {site.name} · CIN:{' '}
          {orPending(company.cin, 'CIN to be confirmed')}
        </li>
        <li>Registered office: {registeredOfficeLine}</li>
        <li>Privacy: {PRIVACY_EMAIL}</li>
        <li>
          Phone:{' '}
          <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a>
        </li>
        <li>
          Web: <Link href="/">{site.url}</Link>
        </li>
      </ul>
      <p>
        See also our <Link href="/terms">terms of use</Link>. This policy is
        provided for transparency and does not constitute legal advice. It should
        be reviewed by qualified legal counsel before publication.
      </p>
    </LegalLayout>
  )
}
