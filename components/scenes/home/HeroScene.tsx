import { Container } from '@/components/ui/Container'
import { Button, Arrow } from '@/components/ui/Button'
import { Eyebrow } from '@/components/brand/Bars'
import { Scene } from '@/components/scene/Scene'

/* ============================================================================
 * Scene 1: Work, made easier.
 *
 * The promise on the left, set as large as one screen allows. On the right,
 * the particle field forms a slowly turning globe: one platform holding the
 * whole of a company's people. Four glass chips orbit it, each a moment the
 * product already handles, each changing state once as the page opens.
 *
 * Everything here is server-rendered. The entrance is the .ez-hero keyframes
 * (site.css), the globe is the shared ParticleField, the chips float on
 * CSS. The headline is in the HTML from the first byte.
 * ========================================================================= */

function d(ms: number) {
  return { '--d': `${ms}ms` } as React.CSSProperties
}

function Chip({
  className,
  delay,
  float,
  children,
}: {
  className: string
  delay: number
  float: string
  children: React.ReactNode
}) {
  return (
    <div className={`absolute ${className}`}>
      <div data-h="card" style={d(delay)}>
        <div className="ez-bob" style={{ '--dur': float, '--bob': '-10px' } as React.CSSProperties}>
          <div className="ez-glass rounded-[18px] px-4 py-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

function Swap({ was, now, at }: { was: React.ReactNode; now: React.ReactNode; at: number }) {
  return (
    <span className="inline-grid">
      <span data-h="was" style={d(at)} className="[grid-area:1/1]">{was}</span>
      <span data-h="now" style={d(at + 120)} className="[grid-area:1/1]">{now}</span>
    </span>
  )
}

const tick = (
  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
)

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
              aria-label="Illustration with sample data: a turning globe of dots representing one platform, with a payroll run ready for review, a leave request approved, an employee punched in, and statutory heads calculated."
              data-live=""
              className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-[min(40rem,74vh)]"
            >
              <div data-stage="globe" data-tone="light" className="absolute inset-[6%]" />

              <Chip className="left-[-4%] top-[10%]" delay={500} float="7s">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-500">Payroll · October</p>
                <p className="mt-1 text-[0.92rem] font-semibold text-ink-900">890 people · 4 locations</p>
                <p className="mt-1.5 text-[0.74rem] font-semibold">
                  <Swap
                    at={2100}
                    was={<span className="text-amber-700">● Calculating</span>}
                    now={<span className="text-emerald-700">● Ready for review</span>}
                  />
                </p>
              </Chip>

              <Chip className="right-[-2%] top-[30%]" delay={700} float="8.5s">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fbe7c2] text-[0.7rem] font-bold text-[#7a4b00]">AR</span>
                  <div>
                    <p className="text-[0.8rem] font-semibold text-ink-900">Casual leave · 2 days</p>
                    <p className="text-[0.72rem] font-semibold">
                      <Swap at={2500} was={<span className="text-amber-700">Waiting on Rohan M.</span>} now={<span className="text-emerald-700">Approved by Rohan M.</span>} />
                    </p>
                  </div>
                </div>
              </Chip>

              <Chip className="bottom-[14%] left-[2%]" delay={900} float="6.5s">
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90" aria-hidden="true">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(11 22 51 / .08)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" pathLength={100} strokeDasharray="100 100" className="ez-sweep-ring" style={{ '--dur': '12s' } as React.CSSProperties} />
                  </svg>
                  <div>
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-ink-500">Punched in</p>
                    <p className="ez-num font-display text-[1.35rem] font-[680] leading-none tracking-[-0.03em] text-ink-900 [font-stretch:110%]">09:41</p>
                  </div>
                </div>
              </Chip>

              <Chip className="bottom-[2%] right-[8%]" delay={1100} float="9s">
                <div className="flex items-center gap-1.5">
                  {['EPF', 'ESIC', 'PT', 'TDS'].map((h, i) => (
                    <span key={h} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 py-1 pl-1 pr-2 text-[0.7rem] font-semibold text-emerald-700">
                      <span data-h="tick" style={d(1800 + i * 110)} className="grid h-4 w-4 place-items-center rounded-full bg-emerald-600 text-white">{tick}</span>
                      {h}
                    </span>
                  ))}
                </div>
              </Chip>
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
