import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Masked } from '@/components/brand/Masked'
import { Arrow } from '@/components/ui/Button'
import { EngineHub } from '@/components/graphics/EngineHub'
import { labourCodes } from '@/content/positioning'

/* ============================================================================
 * Compliance — the page's one dark band.
 *
 * The rest of the home page is paper and white. This is the section an
 * Indian buyer is actually qualifying on, so it gets the change of ground,
 * and its picture is typography: the statutory heads set large, as a wall,
 * because the list itself is the evidence. A buyer who sees LWF and S&E
 * named knows this was written by people who have filed them.
 *
 * Claims stay inside what content/positioning.ts allows. The one-click
 * register generator is behind flags.complianceEngineLive (false), so it is
 * not promised here.
 * ========================================================================= */
/* The three things the engine runs, named the way the company names them. */
const tools = [
  {
    name: 'Compliance engine',
    body: 'Rules for every state, establishment type and Labour Code, held as configuration and applied inside the payroll run. When a notification lands, the rule changes, not the release.',
    tags: ['28 states & 8 UTs', '4 Labour Codes', 'Per establishment'],
    href: '/compliance#statutory',
    cta: 'Every head it covers',
  },
  {
    name: 'Pan-India minimum wages tracker',
    body: 'Every employee’s pay checked against the notified minimum wage for their state, skill category and zone, with any shortfall flagged before the run is released.',
    tags: ['Code on Wages', 'State · skill · zone', 'Before release'],
    href: '/compliance#statutory',
    cta: 'See it in the table',
  },
  {
    name: 'TDS calculator, old vs new regime',
    body: 'Employees see both regimes on their own salary and declarations before they choose. The new regime by default, the old one by opt-out, Form 130 at the end of the tax year.',
    tags: ['Income-tax Act, 2025', 'Both regimes', 'Form 130'],
    href: '/features/ess#regime',
    cta: 'Try the calculator',
  },
] as const

export function ComplianceBand({ showLink = true }: { showLink?: boolean }) {
  return (
    <section data-scene="" aria-labelledby="compliance-title" className="ez-portal relative overflow-hidden bg-navy py-20 text-white sm:py-24 lg:py-32">
      {/* A field of faint stars: the navy reads as a different space, not
          just a darker band. Static dots, one pinging here and there. */}
      <div aria-hidden="true" data-live="" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1.5px)] bg-[size:28px_28px]">
        {[[12, 18], [78, 12], [64, 46], [22, 70], [88, 78], [46, 88]].map(([x, y], i) => (
          <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-[#9db8ff]" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className="ez-ping absolute inset-0 rounded-full bg-[#9db8ff]" style={{ '--d': `${i * 0.9}s`, '--dur': '5s' } as React.CSSProperties} />
          </span>
        ))}
      </div>

      <Container className="relative">
        <div className="max-w-3xl">
          <Eyebrow tone="onDark">Compliance, the way Indian law works</Eyebrow>
          <Masked
            id="compliance-title"
            as="h2"
            className="mt-6 text-[2.4rem] leading-[1.02] !text-white sm:text-[3.3rem] lg:text-[4rem]"
            lines={['Indian payroll law,', <span key="b" className="text-[#9db8ff]">already in the rules.</span>]}
          />
          <p data-m="rise" className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Rules are set per state, per industry and per establishment type, so a
            factory in Pune and a branch in Bengaluru are each calculated the way
            their own law requires.
          </p>
        </div>

        {/* ── The engine ─────────────────────────────────────────────────── */}
        <div data-m="rise" className="mt-14 lg:mt-20">
          <EngineHub particleCore />
        </div>

        {/* ── What runs on it ────────────────────────────────────────────────
            The band used to follow the engine with a wall of the same heads
            in big type and then the four codes again, which the page below
            repeats. It now says what the engine is FOR: three tools. */}
        <div className="mt-16 lg:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h3 className="font-display text-[1.6rem] font-[640] tracking-[-0.03em] text-white [font-stretch:106%] sm:text-[2rem]">
              Three tools, one engine
            </h3>
            {showLink && (
              <Link href="/compliance" className="ez-press inline-flex items-center gap-2 text-[0.95rem] font-semibold text-white">
                <span className="ez-link">See statutory coverage</span>
                <Arrow />
              </Link>
            )}
          </div>
          <div aria-hidden="true" className="mt-6 h-px bg-white/25" data-m="rule" />
          <ul data-m="settle" className="grid gap-4 pt-8 md:grid-cols-3">
            {tools.map((tool, i) => (
              <li key={tool.name} style={{ '--i': i } as React.CSSProperties} className="relative flex flex-col overflow-hidden rounded-[24px] bg-white/[0.05] p-6 ring-1 ring-white/10">
                <span aria-hidden="true" className="font-display text-[3rem] font-[700] leading-none tracking-[-0.05em] text-white/10 [font-stretch:112%]">0{i + 1}</span>
                <p className="mt-3 text-[1.15rem] font-semibold text-white">{tool.name}</p>
                <p className="mt-2 flex-1 text-[0.93rem] leading-relaxed text-white/65">{tool.body}</p>
                <p className="mt-4 flex flex-wrap gap-1.5">
                  {tool.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[0.72rem] font-semibold text-[#9db8ff]">{t}</span>
                  ))}
                </p>
                {tool.href && (
                  <Link href={tool.href} className="ez-press mt-5 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-white">
                    <span className="ez-link">{tool.cta}</span>
                    <Arrow />
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl text-[0.9rem] leading-relaxed text-white/50">{labourCodes.note}</p>
        </div>
      </Container>
    </section>
  )
}
