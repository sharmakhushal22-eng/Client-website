import DownloadClient from './DownloadClient'
import { pageMetadata } from '@/lib/seo'

/* The employee app's download page.
 *
 * Lives under app/(site)/ rather than app/ — the handover put it at
 * app/download, which on this codebase would render with no header, no
 * footer, no announcement bar and no cookie banner, because all of that is in
 * the (site) route group's layout rather than the root one. The route group
 * adds no path segment, so the public URL is still /download.
 *
 * Metadata goes through pageMetadata() like every other page, so the canonical
 * follows NEXT_PUBLIC_SITE_URL instead of being hardcoded to the production
 * host. A canonical pinned to ezerhrms.com on a preview deployment tells
 * Google the preview IS the live page. */

export const metadata = pageMetadata({
  title: 'Download the EZER app',
  description:
    'Get the EZER HRMS employee app for Android. Punch in, apply for leave, download payslips and approve requests from your phone.',
  path: '/download',
})

export default function DownloadPage() {
  return <DownloadClient />
}
