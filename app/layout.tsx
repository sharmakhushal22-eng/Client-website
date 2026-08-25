import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { site } from '@/site.config'

/* Root layout — deliberately minimal.
 *
 * It carries only what EVERY route needs: the document, the typeface and the
 * stylesheet. The marketing chrome (header, footer, cookie banner, WhatsApp
 * button) lives in app/(site)/layout.tsx, so the admin panel does not inherit
 * a public nav bar and a floating WhatsApp button over its lead tables. */

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'HR, Payroll & Compliance Engine for India | EZER HRMS',
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
