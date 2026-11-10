import type { Metadata } from 'next'
import Link from 'next/link'
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

/* The title carries the two words someone actually types, "EZER app" and
   "Android", and stays inside the 42 characters pageMetadata asks for so the
   composed title is not cut off in a result. The description is written to be
   read in a search result rather than to hold keywords: it says what the file
   is, what the app does and that it costs nothing, which are the three things
   that decide the click. */
export const metadata: Metadata = pageMetadata({
  title: 'Download the EZER app for Android',
  description:
    'Download the EZER HRMS employee app for Android. Punch in, apply for leave, get payslips and Form 130, and clear approvals from your phone. Free for employees.',
  path: '/download',
})

const features: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'clock',
    title: 'Mark attendance in one tap',
    body: 'Punch in and out with a location check, watch the shift timer run, and keep your on-time streak.',
  },
  {
    icon: 'calendar',
    title: 'Apply for leave in seconds',
    body: 'Your balance, leave or work from home, the holiday list, and exactly where the approval has reached.',
  },
  {
    icon: 'wallet',
    title: 'Payslips and Form 130',
    body: 'Download any month’s payslip with the tax worksheet behind it, and file your investment declarations.',
  },
  {
    icon: 'check',
    title: 'Approvals in your inbox',
    body: 'Managers clear leave, claims and requests between meetings instead of waiting to get back to a desk.',
  },
  {
    icon: 'receipt',
    title: 'Travel and expense claims',
    body: 'Photograph the bill, log a local or outstation trip, and follow the reimbursement to your account.',
  },
  {
    icon: 'sparkle',
    title: 'Your team, and the good days',
    body: 'Appreciate a colleague, collect badges, and see who is in, who is away and whose anniversary it is.',
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
    body: 'Use the login your HR team gave you. It is the same one that works on EZER on the web, so there is nothing new to remember.',
  },
]

/* Six questions, and every one of them is a question somebody actually
   stops to ask on a sideload: who it is for, whether the scary Android
   prompt is safe, whether it costs anything, the iPhone, updates, and
   whether their salary is safe on a phone. They are also the page's long
   tail in search, which is a side effect of answering them properly rather
   than a reason to write them. The FAQPage schema below is built from this
   same array, so what Google is told and what the page says cannot drift. */
const faqs = [
  {
    q: 'Who can use the EZER app?',
    a: 'Anyone employed by a company that runs EZER HRMS. Sign in with the details your HR team gave you, which are the same ones you use on EZER on the web. If you do not have them yet, ask your HR team rather than creating anything here.',
  },
  {
    q: 'Does the EZER app cost anything?',
    a: 'No. The app is included for every employee at a company that runs EZER HRMS. There is nothing to buy, no in-app purchase and no trial that ends.',
  },
  {
    q: 'Android says “install unknown apps”. Is that safe?',
    a: `Yes, and it is worth knowing why it asks. The app comes straight from ${site.url.replace(/^https?:\/\//, '')} rather than from the Play Store, so Android checks once that you meant to install from your browser. The file is signed by ${employeeApp.publisher}, and Android shows you that signature before it installs anything. Download it only from this page.`,
  },
  {
    q: 'Is there an EZER app for iPhone?',
    a: 'Yes. The EZER iOS app launches on the App Store soon. Until it does, iPhone users sign in to EZER in Safari and get the same payslips, leave, attendance and approvals, with the same login. Nothing is missing on the web.',
  },
  {
    q: 'How do I update to a new version?',
    a: 'Come back to this page and download it again, then install it over the one you have. You stay signed in, and because your data lives on the server rather than on the phone, nothing is lost.',
  },
  {
    q: 'Is my salary and personal data safe on my phone?',
    a: 'Everything travels over an encrypted connection and stays on EZER’s servers in India. Salary, Aadhaar and bank details are masked on screen and shown only to the roles allowed to see them, so a borrowed or lost phone does not hand anyone your record.',
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
        /* The headline names the thing and then says what it is for. "The
           EZER app" is what someone types into a search box; "in your
           pocket" is why they would want it. Each line is its own masked
           line in the hero, so both have to stay short enough not to wrap:
           about seventeen characters at this size. */
        eyebrow="Employee app for Android"
        title={['The EZER app,', <span key="b" className="text-brand-600">in your pocket.</span>]}
        lede="Punch in, apply for leave, pull up a payslip, clear an approval. The things people used to walk to the HR desk for, on the phone already in their hand. Free for everyone at a company that runs EZER HRMS."
        actions={<DownloadPanel />}
        aside={<AppPhone />}
      />

      {/* ── What it does ──────────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="What the app does">
        <SectionHeading
          eyebrow="Inside the app"
          title="What you can do in the EZER app"
          lede="The same EZER your company runs on the web, rebuilt for a phone and a thumb. No training, no manual, no separate password."
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

        {/* One link out, for the HR manager who landed here rather than the
            employee. It is also the page's only internal link into the
            product, which is the one a crawler should follow from here. */}
        <p className="mt-12 text-[0.98rem] leading-relaxed text-ink-600">
          Setting EZER up for your company?{' '}
          <Link href="/features/ess" className="ez-link font-semibold text-brand-700">
            See everything employee self-service covers
          </Link>
          , on the web and in the app.
        </p>
      </Section>

      {/* ── Installing, and the QR for whoever is at a desk ───────────────── */}
      <Section tone="tint" id="install" ariaLabel="How to install on Android">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>Install in about a minute</Eyebrow>
            <h2 className="mt-5 text-[2.1rem] leading-[1.06] sm:text-[2.5rem]">
              How to install the EZER app on Android
            </h2>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-600">
              Because the app comes directly from us rather than through the Play Store,
              Android asks for one extra permission the first time. It asks once, and these
              four steps are the whole of it.
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
        title="Questions about the EZER app"
        lede={`Still stuck after all that? WhatsApp us on ${contact.whatsappDisplay} and we will sort it out.`}
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
                the EZER login your company already gave you.
              </p>
            </div>
            <div className="w-full shrink-0 sm:w-auto">
              <DownloadAgain />
              {/* "Soon", and no date. See the note in DownloadActions. */}
              <p className="mt-3 text-[0.85rem] text-white/70">
                The iOS app launches on the App Store soon.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
