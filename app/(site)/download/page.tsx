import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Faq } from '@/components/sections/Faq'
import { Eyebrow } from '@/components/brand/Bars'
import { Icon, type IconName } from '@/components/ui/Icon'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { contact, employeeApp, site } from '@/site.config'
import { AppPhone } from './AppPhone'
import { AppQr } from './AppQr'
import { DownloadPanel, DownloadAgain, CopyLink } from './DownloadActions'

/* ============================================================================
 * The employee app's download page.
 *
 * WHO THIS PAGE IS FOR, which is what makes it different from every other
 * page on the site. Everywhere else is written for someone deciding whether
 * to buy EZER. This is written for someone whose employer has already bought
 * it, who has been sent a WhatsApp message or shown a QR code, and who wants
 * the app on their phone in under a minute. So:
 *
 *   · it opens on the file, not on an argument
 *   · it closes on the download again, not on "book a demo" — a demo is the
 *     wrong ask for an employee, and CtaBand's default would have made it
 *   · the install steps are on the page rather than linked, because the one
 *     thing that stops an Android sideload is the "unknown apps" prompt, and
 *     someone who abandons at that prompt does not come back for a guide
 *
 * It lives in app/(site)/ rather than app/: the header, footer, announcement
 * bar and cookie banner are all in the (site) group's layout. The route group
 * adds no path segment, so the url is still /download.
 *
 * The page is a server component. All of its JavaScript is in
 * DownloadActions.tsx, which is the button, its status, the iPhone note and
 * the copy-link control. The phone, the QR and the prose cost nothing.
 * ========================================================================= */

export const metadata: Metadata = pageMetadata({
  title: 'Download the EZER app',
  description:
    'Get the EZER HRMS employee app for Android. Punch in, apply for leave, download payslips and approve requests from your phone.',
  path: '/download',
})

const features: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'clock',
    title: 'Punch in and out',
    body: 'One tap, with a location check, the shift timer running and your on-time streak.',
  },
  {
    icon: 'calendar',
    title: 'Leave in seconds',
    body: 'Balances, leave or work from home, and where the approval has reached.',
  },
  {
    icon: 'wallet',
    title: 'Payslips and Form 130',
    body: 'Every payslip with its tax worksheet, and your investment declarations.',
  },
  {
    icon: 'check',
    title: 'Approvals on the go',
    body: 'Managers clear leave, claims and requests from the inbox between meetings.',
  },
  {
    icon: 'receipt',
    title: 'Expense claims',
    body: 'Local and outstation travel, bills attached from the camera, no paperwork.',
  },
  {
    icon: 'sparkle',
    title: 'Wall of Fame',
    body: 'Appreciate a colleague, collect badges, see the birthdays and anniversaries.',
  },
]

/* Four steps, because Android asks for one permission the Play Store would
   have handled. Written in the words the phone actually shows. */
const steps: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Download',
    body: (
      <>
        Tap <b className="font-semibold text-ink-900">Download for Android</b>. The file is{' '}
        {employeeApp.sizeLabel}, so use Wi-Fi if you have it.
      </>
    ),
  },
  {
    title: 'Open the file',
    body: 'Tap the finished download in your notifications, or find the .apk in your Downloads folder.',
  },
  {
    title: 'Allow the install',
    body: (
      <>
        Android will ask once. Tap{' '}
        <b className="font-semibold text-ink-900">Settings</b>, turn on{' '}
        <b className="font-semibold text-ink-900">Allow from this source</b>, then go back and tap{' '}
        <b className="font-semibold text-ink-900">Install</b>.
      </>
    ),
  },
  {
    title: 'Sign in',
    body: 'Use the login your HR team gave you. The same one works on the EZER web portal.',
  },
]

const faqs = [
  {
    q: 'Who can use the EZER app?',
    a: 'Employees of companies that run EZER HRMS. Sign in with the details your HR team shared with you, which are the same ones you use on the EZER web portal.',
  },
  {
    q: 'Android says “install unknown apps”. Is that safe?',
    a: `Yes. The app comes straight from ${site.url.replace(/^https?:\/\//, '')} rather than the Play Store, so Android asks you once to allow installs from your browser. The file is published and signed by ${employeeApp.publisher}, and Android shows you that signature before it installs. Only download it from this page.`,
  },
  {
    q: 'Is there an iPhone app?',
    a: 'Not yet. It is on the way to the App Store. Until then, iPhone users get everything the app does by signing in to the EZER employee portal in Safari.',
  },
  {
    q: 'How do I get the next version?',
    a: 'Come back to this page and download it again. Installing it over the old one keeps you signed in, and your data lives on the server, so nothing is lost.',
  },
  {
    q: 'Is my data safe on my phone?',
    a: 'Everything travels over an encrypted connection and stays on EZER’s servers in India. Salary, Aadhaar and bank details are masked, and are shown only to the roles allowed to see them.',
  },
]

export default function DownloadPage() {
  return (
    <PageTransition kind="product">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Download app', path: '/download' },
          ]),
          faqSchema(faqs),
          /* MobileApplication rather than the site-wide SoftwareApplication
             in lib/seo: this page is about an installable Android build, and
             the version, size and publisher are the fields that describe it.
             Free to the employee, hence the zero-price offer, which is the
             only honest way to say "no charge" in this vocabulary. */
          {
            '@context': 'https://schema.org',
            '@type': 'MobileApplication',
            name: `${site.name} employee app`,
            operatingSystem: 'Android',
            applicationCategory: 'BusinessApplication',
            softwareVersion: employeeApp.version,
            fileSize: employeeApp.sizeLabel,
            installUrl: `${site.url}/download`,
            downloadUrl: employeeApp.androidUrl,
            publisher: { '@type': 'Organization', name: employeeApp.publisher },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          },
        ]}
      />

      <PageHero
        kind="product"
        crumbs={[{ name: 'Download app' }]}
        eyebrow={`Employee app · v${employeeApp.version}`}
        title={['Your HR,', <span key="b" className="text-brand-600">in your pocket.</span>]}
        lede="Punch in, apply for leave, download a payslip, clear an approval. The things people used to walk to the HR desk for, on the phone already in their hand."
        actions={<DownloadPanel />}
        aside={<AppPhone />}
      />

      {/* ── What it does ──────────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="What the app does">
        <SectionHeading
          eyebrow="What’s inside"
          title="Everything an employee needs, one tap away"
          lede="The same EZER the company runs on the web, built for a phone and a thumb."
        />
        <ul data-m="settle" className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white text-brand-600 shadow-[0_8px_18px_-10px_rgb(11_22_51/0.35)] ring-1 ring-ink-900/[0.06]">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[1.05rem] font-semibold leading-snug text-ink-900">
                  {f.title}
                </span>
                <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-ink-600">
                  {f.body}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Installing, and the QR for whoever is at a desk ───────────────── */}
      <Section tone="tint" id="install" ariaLabel="How to install on Android">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>Install in about a minute</Eyebrow>
            <h2 className="mt-5 text-[2.1rem] leading-[1.06] sm:text-[2.5rem]">
              How to install it on Android
            </h2>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-600">
              Because the app comes directly from us and not through the Play Store, Android
              asks for one extra permission the first time. It asks once.
            </p>

            <ol data-m="settle" className="mt-10 grid gap-x-10 sm:grid-cols-2">
              {steps.map((s, i) => (
                <li key={s.title} className="border-t border-ink-900/10 py-6">
                  <p className="ez-num ez-kicker text-brand-600">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 text-[1.15rem] font-semibold leading-snug text-ink-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-600">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* The QR is for the other half of the audience: someone reading
              this on a laptop who needs the app on their phone. */}
          <div className="lg:col-span-5">
            <div className="ez-lift rounded-[28px] bg-white p-7 ring-1 ring-ink-900/[0.06] sm:p-8">
              <h3 className="text-[1.3rem] leading-snug">
                On a computer? Scan it with your phone.
              </h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-600">
                Point your phone camera at the code. The download starts on its own, so there is
                nothing to type.
              </p>
              <AppQr className="mt-7" />
              <div className="mt-7 border-t border-ink-900/10 pt-6">
                <p className="text-[0.95rem] leading-relaxed text-ink-600">
                  Sending this to a team? Copy the link and paste it into WhatsApp or an email.
                </p>
                <div className="mt-4">
                  <CopyLink />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Faq
        faqs={faqs}
        eyebrow="Before you install"
        title="Questions people ask first"
        lede={`Still stuck? WhatsApp us on ${contact.whatsappDisplay} and we will sort it out.`}
      />

      {/* ── Closing ───────────────────────────────────────────────────────────
          Not CtaBand. Its ask is "book a demo", which is the right close for
          a page read by a buyer and the wrong one for a page read by an
          employee whose company already bought it. Same cobalt band, same
          type, different ask. */}
      <section aria-labelledby="download-close" className="bg-brand-600 text-white">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="ez-kicker text-white/80">Ready when you are</p>
              <h2
                id="download-close"
                className="mt-4 max-w-xl text-[2.1rem] leading-[1.04] !text-white sm:text-[2.7rem]"
              >
                Get EZER on your phone.
              </h2>
              <p className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-white/80">
                Android, {employeeApp.sizeLabel}, signed by {employeeApp.publisher}. Sign in with
                your company’s EZER login.
              </p>
            </div>
            <div className="w-full shrink-0 sm:w-auto">
              <DownloadAgain />
              <p className="mt-3 text-[0.85rem] text-white/70">
                iPhone app coming soon to the App Store.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
