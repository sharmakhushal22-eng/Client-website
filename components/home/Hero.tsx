import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { EngineWidget } from '@/components/home/EngineWidget'
import { trustBadges } from '@/site.config'
import { flags, structure } from '@/content/positioning'

/* Spec §4.1 §2 — H1, one-line subhead, two CTAs, product screenshot.
 * "Above the fold on a 360px phone. No carousel."
 *
 * The H1 is the company's own headline claim: India's first HRMS, payroll and
 * HR compliance engine. The subhead carries the differentiator that follows
 * from it — every location's compliance position produced together, rather
 * than assembled branch by branch. */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_70%_-10%,rgba(37, 99, 235,0.16),transparent)]"
      />

      <Container className="relative py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              <span aria-hidden="true">🇮🇳</span>
              Built for the new labour codes
            </p>

            {/* The page's single <h1> — spec §8.4. */}
            <h1 className="mt-5 max-w-[15ch] text-[1.95rem] font-bold leading-[1.08] sm:max-w-none sm:text-[2.6rem] lg:text-[2.95rem]">
              India&rsquo;s first HRMS, payroll and{' '}
              <span className="text-brand-600">HR compliance engine</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
              {flags.complianceEngineLive ? (
                <>
                  Corporate office, branches, factory, warehouse — run centrally, across
                  every company you operate. Generate the compliance register for all of
                  them in <strong className="font-semibold text-ink-900">one go</strong>.
                </>
              ) : (
                <>
                  Corporate office, branches, factory, warehouse — every company you
                  operate, run centrally. One employee master, state-wise statutory rules,
                  and the whole group&rsquo;s position in{' '}
                  <strong className="font-semibold text-ink-900">one place</strong>.
                </>
              )}
            </p>

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
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-ink-600 ring-1 ring-brand-100"
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
                    className="flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-600 ring-1 ring-brand-100"
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
