import type { Metadata } from 'next'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { SiteScripts } from '@/components/layout/SiteScripts'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { PreRegister } from '@/components/prereg/PreRegister'
import { PreRegisterProvider } from '@/components/prereg/PreRegisterProvider'
import { JsonLd, organizationSchema, softwareApplicationSchema } from '@/lib/seo'
import { site } from '@/site.config'

/* The public marketing site's chrome. Everything under app/(site) gets it;
 * /admin does not. The route group adds no path segment, so URLs are
 * unchanged. */

export const metadata: Metadata = {
  authors: [{ name: site.name }],
  keywords: [
    'HRMS software India',
    'payroll software India',
    'HR compliance engine India',
    'labour codes payroll software',
    'multi entity payroll India',
    'EPF ESIC compliance software',
    'attendance management system India',
    'compliance register generation India',
  ],
  formatDetection: { telephone: true, address: false, email: false },
  openGraph: { type: 'website', locale: 'en_IN', siteName: site.name, url: site.url },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-surface">
      {/* Skip link — spec §8.5. Hidden until focused, and the first thing a
          keyboard user reaches on every page. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-accent"
      >
        Skip to content
      </a>

      <JsonLd schemas={[organizationSchema(), softwareApplicationSchema()]} />

      <PreRegisterProvider>
        {/* The announcement bar sits ABOVE the header deliberately: the header
            is sticky, so the bar scrolls away and does not eat a strip of
            every screen for the rest of the visit. */}
        <AnnouncementBar />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />

        <WhatsAppButton />
        <PreRegister />
      </PreRegisterProvider>

      <CookieConsent />
      <SiteScripts />
    </div>
  )
}
