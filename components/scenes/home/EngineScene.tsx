import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Arrow } from '@/components/ui/Button'
import { Scene } from '@/components/scene/Scene'
import { EngineHub } from '@/components/graphics/EngineHub'
import { ruleChanges } from '@/content/positioning'

/* ============================================================================
 * Scene 5: the engine.
 *
 * Navy, and the only scene that is: arriving here should feel like stepping
 * into the machine room. Every kind of location feeds in on the left;
 * the statutory heads leave on the right; in the middle the particle field
 * becomes a galaxy turning round the core. Under it, the four Labour Codes
 * in one line, and the way to the full coverage.
 *
 * This scene's job is THE LAW (where to work and who sees what are the next
 * two scenes): the Labour Codes and the Income-tax Act, 2025 moved under
 * every Indian payroll, and the dated changes along the foot show the engine
 * keeping up. Copy stays inside what content/positioning.ts allows: these
 * heads are calculated in the run; the one-click register generator is not
 * claimed.
 * ========================================================================= */
export function EngineScene({ index }: { index: number }) {
  return (
    <Scene index={index} tone="navy" labelledBy="engine-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1.5px)] bg-[size:30px_30px]" />
      <Container className="flex h-full flex-col justify-center gap-8 py-20 lg:gap-6 lg:pb-10 lg:pt-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow tone="onDark">The compliance engine</Eyebrow>
            <h2 id="engine-title" className="mt-5 text-[2.3rem] leading-[1.03] !text-white sm:text-[3rem] lg:text-[min(3.6vw,6.2vh)]">
              Four Labour Codes.
              <br />
              A new Income-tax Act.
              <br />
              <span className="text-[#9db8ff]">Already in the rules.</span>
            </h2>
          </div>
          <p className="max-w-md text-[1.02rem] leading-relaxed text-white/70 lg:col-span-5 lg:justify-self-end">
            The law moved under every Indian payroll in 2025 and 2026. EZER holds it as
            configuration, so a factory in Pune, a mine in Jharkhand and a branch in Bengaluru
            are each worked out under the rules in force for them, in the same run.
          </p>
        </div>

        <div data-depth="1" className="mx-auto w-full max-w-[min(100%,calc(62vh*2.27))]">
          <EngineHub particleCore />
        </div>

        <div data-depth="2" className="flex flex-col gap-4 border-t border-white/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <ol data-m="settle" className="flex flex-wrap gap-2" aria-label="Recent rule changes">
            {ruleChanges.slice(0, 4).map((c, i) => (
              <li key={c.date} style={{ '--i': i } as React.CSSProperties} className="flex items-center gap-2 rounded-full bg-white/[0.07] py-1.5 pl-1.5 pr-3.5 text-[0.82rem] text-white/80 ring-1 ring-white/12">
                <span className="shrink-0 whitespace-nowrap rounded-full bg-[#f2a516] px-2 py-0.5 text-[0.68rem] font-bold text-navy">{c.short}</span>
                {c.what}
              </li>
            ))}
          </ol>
          <Link href="/compliance" className="ez-press inline-flex shrink-0 items-center gap-2 text-[0.95rem] font-semibold text-white">
            <span className="ez-link">See statutory coverage</span>
            <Arrow />
          </Link>
        </div>
      </Container>
    </Scene>
  )
}
