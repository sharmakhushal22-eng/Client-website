import type { Metadata } from 'next'
import { site, company, companyDetails, contact, displayLegalName, pricing } from '@/site.config'

/* ============================================================================
 * SEO helpers — spec §8.4.
 *
 * Title ≤ 60 characters, description ≤ 155, canonical on every page, OG and
 * Twitter cards, and the four Schema.org types the spec names.
 * ========================================================================= */

export function pageMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
}: {
  /* Passed WITHOUT the brand suffix — the template adds it. Keep the raw
   * title under ~42 chars so the composed title stays inside 60. */
  title: string
  description: string
  path: string
  ogImage?: string
  noIndex?: boolean
}): Metadata {
  const url = `${site.url}${path}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: 'en_IN',
      type: 'website',
      images: [{ url: ogImage ?? `${site.url}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${site.name}`,
      description,
      images: [ogImage ?? `${site.url}/opengraph-image`],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

/* ── JSON-LD ─────────────────────────────────────────────────────────────── */

export function organizationSchema() {
  const addr = company.registeredAddress
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    /* Falls back to the brand name while the registered entity is unknown.
     * Emitting a placeholder here is the worst version of the mistake: it is
     * the string a search engine indexes as the company's legal name, and it
     * outlives the fix. */
    name: displayLegalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}/icon.png`,
    description: site.description,
    foundingDate: String(company.foundedYear),
    /* Omitted entirely rather than emitted with placeholder parts — a
     * PostalAddress reading "TODO" is worse than no address at all. */
    ...(companyDetails.hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: [addr.line1, addr.line2].filter(Boolean).join(', '),
            addressLocality: addr.city,
            addressRegion: addr.state,
            postalCode: addr.pincode,
            addressCountry: 'IN',
          },
        }
      : {}),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: contact.phoneE164,
        contactType: 'sales',
        ...(contact.emailsLive ? { email: contact.salesEmail } : {}),
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
      {
        '@type': 'ContactPoint',
        telephone: contact.phoneE164,
        contactType: 'customer support',
        ...(contact.emailsLive ? { email: contact.supportEmail } : {}),
        areaServed: 'IN',
      },
    ],
  }
}

export function softwareApplicationSchema() {
  const plan = pricing.plan
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: site.name,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Human Resource Management Software',
    operatingSystem: 'Web browser',
    description: site.description,
    url: site.url,
    /* Only emitted once a real price is in site.config. An offers block with
     * a placeholder number is worse than no offers block — it is what Google
     * shows in the result. */
    /* Omitted entirely while the rate is undisclosed. An offers block is the
     * one place a "hidden" price becomes a public one — it is what Google
     * renders in the result snippet. */
    ...(pricing.disclosed && plan.pricePerEmployee
      ? {
          offers: {
            '@type': 'Offer',
            price: String(plan.pricePerEmployee),
            priceCurrency: 'INR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: String(plan.pricePerEmployee),
              priceCurrency: 'INR',
              unitText: 'per employee per month',
            },
          },
        }
      : {}),
    featureList: [
      'Payroll processing',
      'EPF, ESIC, Professional Tax and LWF compliance',
      'TDS and Form 16',
      'Attendance and leave management',
      'Recruitment and onboarding',
      'Employee self-service portal',
      'Claims, travel and reimbursements',
      'Full and final settlement',
    ],
  }
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  }
}

/** Renders one or more JSON-LD blocks.
 *
 *  The content is built from site.config and page content, never from user
 *  input, so serialising it into a script tag is safe — but `<` is escaped
 *  anyway so a stray angle bracket in copy can never close the tag early. */
export function JsonLd({ schemas }: { schemas: object[] }) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}
