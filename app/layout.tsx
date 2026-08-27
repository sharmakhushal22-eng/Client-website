import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/site.config";

/* Root layout — deliberately minimal.
 *
 * It carries only what EVERY route needs: the document, the typeface and the
 * stylesheet. The marketing chrome (header, footer, cookie banner, WhatsApp
 * button) lives in app/(site)/layout.tsx, so the admin panel does not inherit
 * a public nav bar and a floating WhatsApp button over its lead tables. */

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    /* Verbatim from the reference's <title> and og:title.
       NOTE for whoever ships this: "India's 1st HRMS" is a comparative
       superlative. It is the company's own published claim, carried across
       on request — but it is the one line on this site that could draw an
       ASCI complaint, and it should be substantiated or softened before
       launch. Nothing else here asserts a ranking. */
    default: "EZER HRMS — India's 1st HRMS, Payroll & Compliance Engine",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
};

export const viewport: Viewport = {
  /* One value. The site renders light regardless of the OS setting, so a
     dark-scheme variant would tint the mobile browser chrome near-black above
     a page that is still white — the exact rendering-bug look the two-value
     version existed to avoid. */
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      /* Light mode, hard-coded. The site offers no theme choice, so the
       * attribute is rendered server-side and never touched again: no boot
       * script, no localStorage read, no pre-hydration DOM mutation — and so
       * none of the hydration-warning suppression that used to be required
       * here, and no white flash to prevent.
       *
       * The PRODUCT still has light, dark and eye-comfort modes. The site
       * describes them rather than demonstrating them on itself. */
      data-ez-theme="light"
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
