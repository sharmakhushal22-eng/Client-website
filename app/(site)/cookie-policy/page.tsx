import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalLayout } from '@/components/legal/LegalLayout'
import { pageMetadata } from '@/lib/seo'
import { contact } from '@/site.config'

export const metadata: Metadata = pageMetadata({
  title: 'Cookie policy',
  description:
    'Which cookies this site sets, what each one does, and how to change your choice. Nothing non-essential loads before you accept it.',
  path: '/cookie-policy',
})

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie policy"
      updated="20 August 2026"
      intro="This site uses very few cookies, and none of the optional ones load until you accept them. Here is the complete list."
    >
      <h2>1. How consent works here</h2>
      <p>
        When you first visit, a banner asks whether you accept analytics cookies.
        Until you choose, <strong>no analytics or advertising script is loaded at
        all</strong> — the tags are not sitting dormant on the page waiting to be
        switched on; they are simply not there. If you choose &ldquo;Essential
        only&rdquo;, they are never loaded.
      </p>
      <p>
        Your choice is remembered in your browser&rsquo;s local storage so we do
        not ask again on every page.
      </p>

      <h2>2. Essential storage</h2>
      <p>
        These are needed for the site to work and cannot be switched off. None of
        them track you across other websites.
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Purpose</th>
            <th>Kept for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>ezer_cookie_consent</code></td>
            <td>Remembers whether you accepted or declined analytics cookies</td>
            <td>Until you clear your browser storage</td>
          </tr>
          <tr>
            <td><code>ezer_attribution</code></td>
            <td>
              Remembers which campaign or link brought you to the site, so that
              if you submit an enquiry we know which channel it came from
            </td>
            <td>The current browser session only</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Analytics cookies — only with your consent</h2>
      <p>
        If you accept, we load two analytics tools. Both tell us how pages are
        used; neither is used to build an advertising profile of you.
      </p>
      <table>
        <thead>
          <tr>
            <th>Set by</th>
            <th>Purpose</th>
            <th>Kept for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google Analytics 4</td>
            <td>
              Which pages are visited, how visitors arrive, and which pages lead
              to an enquiry. IP addresses are anonymised.
            </td>
            <td>Up to 2 years</td>
          </tr>
          <tr>
            <td>Microsoft Clarity</td>
            <td>
              Aggregated heatmaps and session recordings that show where people
              get stuck. Form input is masked.
            </td>
            <td>Up to 1 year</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Embedded third-party content</h2>
      <p>
        Two pages embed content from another provider, and each may set its own
        cookies once loaded:
      </p>
      <ul>
        <li>
          The <Link href="/book-a-demo">demo booking page</Link> embeds a
          scheduling calendar, so that you can pick a slot without leaving the
          site.
        </li>
        <li>
          The <Link href="/contact">contact page</Link> embeds a map showing our
          registered office.
        </li>
      </ul>
      <p>
        Both are loaded lazily — they are not fetched until you scroll to them.
      </p>

      <h2>5. Changing your mind</h2>
      <p>
        To change your choice, clear this site&rsquo;s data in your browser
        settings; the banner will appear again on your next visit. You can also
        block or delete cookies entirely in your browser — the site will continue
        to work, including the enquiry forms.
      </p>

      <h2>6. Questions</h2>
      <p>
        Write to <a href={`mailto:${contact.privacyEmail}`}>{contact.privacyEmail}</a>.
        See also our <Link href="/privacy-policy">privacy policy</Link>.
      </p>
    </LegalLayout>
  )
}
