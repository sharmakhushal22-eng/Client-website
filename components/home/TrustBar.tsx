import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { trust, trustBadges } from '@/site.config'

/* Spec §4.1 §3 — client logos, or "Trusted by X companies · Y employees paid
 * every month". "If no logos yet, use numbers instead of fake logos."
 *
 * Three states, degrading in order, so the section is never embarrassing:
 *
 *   1. Client logos, once §12.6 is answered and you have WRITTEN permission.
 *   2. The headline numbers, once someone fills them into site.config.
 *   3. The product's own certifications — which are real today, and are what
 *      the IT-gatekeeper persona in §2 is looking for anyway.
 *
 * State 3 exists because the alternative was rendering the literal word TODO
 * three times across the fold. A placeholder that ships is worse than a
 * smaller section that is true. */
export function TrustBar() {
  const hasLogos = trust.showClientLogos && trust.clientLogos.length > 0
  const liveStats = trust.stats.filter((s) => s.value && s.value !== 'TODO')
  const hasStats = liveStats.length > 0

  return (
    <section className="border-y border-ink-200 bg-white py-10" aria-label="Why teams trust EZER">
      <Container>
        {hasLogos ? (
          <>
            <p className="text-center text-sm font-medium text-ink-500">
              Trusted by HR and Finance teams across India
            </p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {trust.clientLogos.map((logo) => (
                <li key={logo.name}>
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={132}
                    height={40}
                    className="h-8 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                </li>
              ))}
            </ul>
          </>
        ) : hasStats ? (
          <dl className="grid gap-8 text-center sm:grid-cols-3">
            {liveStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-3xl font-bold text-brand-600 sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-ink-500">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="flex flex-col items-center gap-5 text-center">
            <p className="text-sm font-medium text-ink-500">
              Built, hosted and supported in India
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {trustBadges
                .filter((badge) => badge.verified)
                .map((badge) => (
                  <li
                    key={badge.label}
                    className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-brand-100"
                  >
                    <Icon name={badge.icon} className="h-4 w-4 text-brand-600" />
                    {badge.label}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  )
}
