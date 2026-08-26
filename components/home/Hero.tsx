import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { EngineWidget } from '@/components/home/EngineWidget'
import { trustBadges } from '@/site.config'
import { structure } from '@/content/positioning'
import { brandPromises } from '@/content/lifecycle'

/* Spec §4.1 §2 — H1, one-line subhead, two CTAs, product screenshot.
 * "Above the fold on a 360px phone. No carousel."
 *
 * The H1 carries the repositioning: any size, all consolidated. It replaced
 * "India's first HRMS…" — a "first" claim is falsifiable by any competitor
 * with a screenshot, and it put the compliance claims, which are true and much
 * harder won, in the same basket as it.
 *
 * The subhead does the work the old H1 was doing: every establishment type and
 * every state, held in one place rather than assembled branch by branch. */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-50">
      {/* The photograph sits on the RIGHT of the hero, bleeding off the edge,
       * with the engine widget floating in front of it.
       *
       * The crop is anchored to 78% across, not the centre. Centred, the
       * widget landed squarely over two of the four faces, which reads as an
       * accident rather than a composition. Pushed right, the card overlaps
       * background and the figures it does not cover stay whole.
       *
       * It also leaves the left half — where the H1, the lede and both CTAs
       * live — on flat ground, so nothing that has to be read is ever fighting
       * a photograph.
       *
       * Hidden below lg. On a phone the hero is already a full screen of text
       * and the photo would push the primary CTA below the fold, which is the
       * one thing the hero cannot afford. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
        <Image
          src="/photos/team-lobby.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 0px, 46vw"
          /* NOT priority. It is decorative and sits behind a scrim, so it is
           * not the LCP element — the H1 is. Marking it priority would emit a
           * preload that competes with the headline for the first connection,
           * and would fetch it on phones where the panel is display:none. */
          loading="lazy"
          className="select-none object-cover object-[78%_22%]"
        />

        {/* Two scrims. The horizontal one dissolves the photo's left edge into
         * the page so it reads as part of the hero rather than as a pasted-in
         * rectangle; the vertical one keeps the top clear of the header and
         * the bottom clear of the trust badges. */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-50 via-brand-50/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/85 via-transparent to-brand-50/95" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_70%_-10%,rgba(37,99,235,0.16),transparent)]"
      />

      <Container className="relative py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              <span aria-hidden="true">🇮🇳</span>
              India&rsquo;s most proactive HRMS — every industry, every
              establishment type
            </p>

            {/* The page's single <h1> — spec §8.4. */}
            <h1 className="mt-5 text-[1.95rem] font-bold leading-[1.08] sm:text-[2.6rem] lg:text-[2.95rem]">
              Built for every kind of Indian company.{' '}
              <span className="text-brand-600">
                From one employee to any number
              </span>{' '}
              — all consolidated.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
              One employee or several lakh, one office or hundreds of branches,
              plants and warehouses — it all consolidates into one platform.
              Recruitment, CTC and manpower planning, payroll, statutory
              compliance and employee experience, across every establishment
              type, every industry, every state.
            </p>

            {/* The product's own three promises, from the redesign. Kept as a
                quiet row rather than a headline: they are reassurance for
                someone already reading, not the reason to start. */}
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5">
              {brandPromises.map((promise) => (
                <li
                  key={promise}
                  className="flex items-center gap-1.5 text-[0.82rem] font-medium text-ink-600"
                >
                  <Icon name="check" className="h-3.5 w-3.5 text-emerald-600" />
                  {promise}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/book-a-demo" size="lg">
                Book a Demo
                <Icon name="arrow-right" className="h-4 w-4" />
              </Button>
              <Button href="/pricing" variant="secondary" size="lg">
                See Pricing
              </Button>
            </div>

            {/* The location types are the proof of the claim above, and they are
                real in the product today — so they sit in the hero rather than
                being described further down. */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                One system across
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {structure.locationTypes.map((type) => (
                  <li
                    key={type}
                    className="rounded-lg bg-surface px-3 py-1.5 text-xs font-medium text-ink-600 ring-1 ring-brand-100"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {trustBadges
                .filter((badge) => badge.verified)
                .map((badge) => (
                  <li
                    key={badge.label}
                    className="flex items-center gap-1.5 rounded-lg bg-surface/70 px-3 py-1.5 text-xs font-medium text-ink-600 ring-1 ring-brand-100"
                  >
                    <Icon name={badge.icon} className="h-3.5 w-3.5 text-brand-600" />
                    {badge.label}
                  </li>
                ))}
            </ul>
          </div>

          <div className="lg:pl-4">
            {/* The engine widget, not a screenshot placeholder. It shows the
                claim the hero makes — four location types, one engine, every
                register — instead of standing in for a picture nobody has
                taken yet. Ported from the original index.html. */}
            <EngineWidget />
            <p className="mt-4 text-center text-sm leading-relaxed text-ink-500 lg:text-left">
              Operating in more than one state?{' '}
              <Link href="/contact" className="font-semibold text-brand-700 underline">
                Tell us where — we&rsquo;ll set the demo up on your structure
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
