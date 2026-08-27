import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { trust, trustBadges } from "@/site.config";

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
  const hasLogos = trust.showClientLogos && trust.clientLogos.length > 0;
  const liveStats = trust.stats.filter((s) => s.value && s.value !== "TODO");
  const hasStats = liveStats.length > 0;

  return (
    <section
      className="border-y border-ink-200 bg-surface py-10"
      aria-label="Why teams trust EZER"
    >
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
          /* dt carries the label and dd the figure, and flex-col-reverse puts
             the figure on top visually. The previous markup had the label in a
             sr-only <dt> AND again inside the <dd>, so a screen reader read
             every label twice — "new Labour Codes covered, 4, new Labour Codes
             covered". One label, in the element that means "term". */
          <dl
            className={
              'grid gap-6 ' +
              /* Derived, not hardcoded. This was sm:grid-cols-3 with three
                 stats in the config; adding the fourth left one card
                 stranded on its own row. Reading the count means the row
                 stays whole whichever way the list is edited. */
              (liveStats.length % 4 === 0
                ? 'sm:grid-cols-2 lg:grid-cols-4'
                : liveStats.length % 3 === 0
                  ? 'sm:grid-cols-3'
                  : 'sm:grid-cols-2')
            }
          >
            {liveStats.map((stat, i) => (
              <div
                key={stat.label}
                data-reveal=""
                style={{ transitionDelay: `${i * 110}ms` }}
                className="ez-tilt group relative flex flex-col-reverse items-center gap-2 rounded-2xl bg-surface px-5 py-7 text-center shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-16px_rgba(16,24,40,0.28)] ring-1 ring-ink-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_26px_50px_-18px_rgba(16,24,40,0.38)] hover:ring-brand-200"
              >
                {/* min-h reserves TWO lines for every label. The card is
                    flex-col-reverse, so a label that wraps grows upward and
                    drags its own figure up with it — "Employees per company
                    or group" wraps at four-across and sat 16px above the
                    other three. Reserving the space keeps the row of figures
                    on one line whatever the labels do. */}
                <dt className="flex min-h-[2.75em] items-start justify-center text-[0.72rem] font-bold uppercase leading-snug tracking-[0.13em] text-ink-700">
                  {stat.label}
                </dt>

                <dd className="relative">
                  {/* The halo sits behind the figure, not on it — scaling the
                      number itself would drag the label around beneath it. */}
                  <span
                    aria-hidden="true"
                    className="ez-stat-glow pointer-events-none absolute left-1/2 top-1/2 h-[2.6em] w-[2.6em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.22),transparent)] blur-md"
                  />
                  <span className="ez-stat-figure relative block bg-gradient-to-b from-brand-600 to-brand-800 bg-clip-text text-[2.35rem] font-extrabold leading-none tracking-[-0.02em] text-transparent [text-wrap:balance] sm:text-[2.7rem]">
                    {stat.value}
                  </span>
                  <span
                    aria-hidden="true"
                    className="ez-stat-rule mx-auto mt-3 block h-[3px] w-10 origin-left rounded-full bg-gradient-to-r from-brand-600 to-brand-300 transition-all duration-300 group-hover:w-16"
                  />
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
                    <Icon
                      name={badge.icon}
                      className="h-4 w-4 text-brand-600"
                    />
                    {badge.label}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
