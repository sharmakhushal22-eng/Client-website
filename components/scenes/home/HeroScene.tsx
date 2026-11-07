import { Container } from '@/components/ui/Container'
import { Button, Arrow } from '@/components/ui/Button'
import { Eyebrow } from '@/components/brand/Bars'
import { Scene } from '@/components/scene/Scene'
import { HeroLiveChips } from './HeroLiveChips'
import { payrollMonth } from './hero-clock'

/* ============================================================================
 * Scene 1: Work, made easier.
 *
 * The promise on the left, set as large as one screen allows. On the right,
 * the particle field forms a slowly turning globe: one platform holding the
 * whole of a company's people. Four glass chips orbit it, each a moment the
 * product already handles. They change state once as the page opens, then
 * keep taking in new sample records (HeroLiveChips) so the globe reads as a
 * working platform rather than a still.
 *
 * The words are server-rendered. The entrance is the .ez-hero keyframes
 * (site.css), the globe is the shared ParticleField, the chips float on
 * CSS. The headline is in the HTML from the first byte.
 * ========================================================================= */

/* The payroll month the cards open on. Evaluated when the page is built; the
 * client corrects it on load if the build is from an earlier month. */
const BUILD_MONTH = payrollMonth(Date.now())

function d(ms: number) {
  return { '--d': `${ms}ms` } as React.CSSProperties
}

export function HeroScene() {
  return (
    <Scene index={0} tone="paper" labelledBy="hero-title" className="ez-hero">
      <Container className="relative flex h-full flex-col justify-center pb-14 pt-10 lg:pb-14 lg:pt-20">
        <div className="grid items-center gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          {/* ── Words ───────────────────────────────────────────────────── */}
          <div className="relative z-10 lg:col-span-6">
            <Eyebrow animate>HRMS · Payroll · Compliance, for India</Eyebrow>
            <h1
              id="hero-title"
              className="ez-display mt-6 text-[clamp(3.6rem,19vw,6rem)] text-ink-900 sm:text-[clamp(5rem,14vw,7.25rem)] lg:text-[min(8vw,12.6vh)]"
            >
              <span className="ez-line"><span>Work,</span></span>
              <span className="ez-line"><span>made</span></span>
              <span className="ez-line">
                <span>
                  <span className="relative inline-block text-brand-600">
                    easier.
                    <svg aria-hidden="true" viewBox="0 0 300 24" preserveAspectRatio="none" className="ez-swash pointer-events-none absolute -bottom-[0.06em] left-[0.02em] h-[0.16em] w-[96%] text-marigold">
                      <path d="M3 15 C 70 6, 160 4, 297 12" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" pathLength={1} />
                    </svg>
                  </span>
                </span>
              </span>
            </h1>
            {/* Not animated: the page's largest text block, so its LCP. */}
            <p className="mt-7 max-w-[31rem] text-[1.12rem] leading-[1.6] text-ink-600 sm:text-[1.2rem]">
              Hiring, attendance, payroll and India&rsquo;s statutory compliance on one
              employee record. For your tenth hire, and for a group of companies with lakhs
              of people across states.
            </p>
            <div data-h="fade" style={d(360)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/book-a-demo" size="lg">
                Book a demo
                <Arrow />
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                See a request travel
              </Button>
            </div>
            <p data-h="fade" style={d(520)} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem] text-ink-500">
              <span>SOC 2 Type 2</span>
              <span aria-hidden="true" className="text-ink-300">/</span>
              <span>DPDP Act 2023</span>
              <span aria-hidden="true" className="text-ink-300">/</span>
              <span>Live in 10 days</span>
            </p>
          </div>

          {/* ── The globe and its moments ───────────────────────────────── */}
          <div className="relative lg:col-span-6">
            <div
              role="img"
              aria-label="Illustration with sample data: a turning globe of dots representing one platform, with a payroll run being calculated and made ready for review, a feed of HR activity such as approvals and new joiners, employees punching in, and statutory heads calculated."
              data-live=""
              className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-[min(40rem,74vh)]"
            >
              <div data-stage="globe" data-tone="light" className="absolute inset-[6%]" />

              <HeroLiveChips month={BUILD_MONTH} />
            </div>
          </div>
        </div>

        {/* A quiet cue that the page continues downward, scene by scene. */}
        <div aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex" data-live="">
          <span className="ez-kicker text-ink-400">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-ink-900/10">
            <span className="ez-sweep-down absolute inset-x-0 top-0 h-4 bg-brand-600" />
          </span>
        </div>
      </Container>
    </Scene>
  )
}
