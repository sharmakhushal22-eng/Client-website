import type { MetadataRoute } from 'next'
import { site } from '@/site.config'

/* Spec §8.4 — robots.txt present, sitemap declared. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /* /thank-you is noindex in its own metadata too; disallowing it here
         * as well keeps it out of crawl budget entirely. /actions is the
         * server-action namespace and has nothing to crawl. */
        disallow: ['/thank-you', '/api/'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
