import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { site } from '@/site.config'
import { themeBootScript } from '@/components/layout/ThemeToggle'

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
  /* Two values, so the browser chrome matches the theme rather than fighting
     it — a blue address bar above a near-black page reads as a rendering bug. */
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1216' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${dmSans.variable} h-full antialiased`}
      /* The theme boot script below writes data-ez-theme onto this element
       * BEFORE React hydrates, so the client sees an attribute the server
       * never rendered and React reports a mismatch it cannot patch up.
       *
       * This is the one situation suppressHydrationWarning exists for: a
       * deliberate, pre-hydration DOM mutation. It only suppresses this
       * element's own attributes — one level, not the subtree — so a genuine
       * mismatch anywhere inside still reports normally.
       *
       * The alternative is rendering the attribute server-side, which cannot
       * work: the choice lives in localStorage, which the server cannot read,
       * and reading it after hydration is what causes the white flash the
       * boot script exists to prevent. */
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme BEFORE first paint. Without it, anyone on
            dark gets a white flash on every navigation while React catches
            up — the single most visible way a theme toggle looks cheap.
            dangerouslySetInnerHTML is the documented way to inline this; the
            content is a build-time constant, never user input. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
