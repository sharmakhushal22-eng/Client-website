import type { MetadataRoute } from 'next'
import { featurePages } from '@/content/features'
import { site } from '@/site.config'

/* Auto-generated sitemap — spec §8.4.
 *
 * Generated from the same content modules the pages render from, so adding a
 * feature page adds it here too. /thank-you is deliberately absent: it is
 * noindex, and a thank-you page in the index fires a conversion event for
 * someone who never converted. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: Array<{
    path: string
    priority: number
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  }> = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
    /* Both promoted out of home-page sections. They are the two qualifying
       questions an Indian buyer searches for by name, so they carry the same
       priority as the product hub. */
    { path: '/compliance', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/industries', priority: 0.8, changeFrequency: 'monthly' },
    /* A resource, not a sales page — but it is the strongest organic target
       on the site: "HR policy list India" has real volume and no good result. */
    { path: '/resources/policy-handbook', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/book-a-demo', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...featurePages.map((page) => ({
      url: `${site.url}/features/${page.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
