import type { NextConfig } from 'next'

/* Content-Security-Policy — spec §8.7.
 *
 * Kept deliberately tight because this site loads no third-party script until
 * the visitor accepts cookies (§8.7, cookie consent must gate scripts BEFORE
 * they load). The analytics hosts below are listed so that the consent-gated
 * loader can inject them later without a CSP violation; nothing fetches them
 * until consent is given.
 *
 * 'unsafe-inline' on style-src is unavoidable: Next.js inlines critical CSS
 * and React inlines style attributes. Scripts do NOT get 'unsafe-inline' —
 * Next's own bootstrap runs from a nonce-free external chunk plus 'self'. */
const isDev = process.env.NODE_ENV === 'development'

/* React's development build uses eval() to reconstruct stack traces across the
 * server/client boundary. Production never does — so 'unsafe-eval' is added in
 * dev only, and the deployed policy stays strict. */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  isDev && "'unsafe-eval'",
  'https://www.googletagmanager.com',
  'https://www.clarity.ms',
  'https://challenges.cloudflare.com',
]
  .filter(Boolean)
  .join(' ')

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://c.clarity.ms",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.clarity.ms",
  "frame-src 'self' https://cal.com https://app.cal.com https://calendly.com https://www.google.com https://challenges.cloudflare.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  /* PRODUCTION ONLY.
   *
   * Over http://localhost this directive rewrites every request to https,
   * where nothing is listening — the page simply fails to load. Chrome
   * exempts localhost; Safari does not, so the site appears to "crash" in
   * Safari while working fine in Chrome. */
  !isDev && 'upgrade-insecure-requests',
]
  .filter(Boolean)
  .join('; ')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          /* HSTS is PRODUCTION ONLY, and the reason is worth spelling out.
           *
           * Sent over http://localhost, Safari records the pin against
           * "localhost" itself — for the full max-age, and with
           * includeSubDomains. Every other local project on that machine is
           * then forced to https and breaks too, and it keeps breaking long
           * after this header is removed, because the pin lives in the
           * browser rather than in the response.
           *
           * Clearing it is a manual step (see README), so the only safe move
           * is never to send it off a secure origin in the first place. */
          ...(isDev
            ? []
            : [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]),
        ],
      },
    ]
  },
}

export default nextConfig
