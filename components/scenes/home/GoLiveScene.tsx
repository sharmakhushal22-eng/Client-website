import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Scene } from '@/components/scene/Scene'
import { implementation } from '@/content/positioning'

/* ============================================================================
 * Scene 9: live in ten days.
 *
 * The particles stand up as ten columns, one per day, rising left to right
 * to the marigold column that is go-live. The plan itself sits beside them
 * as five phases, each numbered by its days. One person owns all of it.
 * ========================================================================= */
export function GoLiveScene({ index }: { index: number }) {
  return (
    <Scene index={index} tone="sand" labelledBy="golive-title">
      <Container className="flex h-full flex-col justify-center py-20 lg:py-0 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Eyebrow>Going live</Eyebrow>
            <h2 id="golive-title" className="mt-5 text-[2.3rem] leading-[1.04] sm:text-[3rem] lg:text-[min(3.4vw,5.8vh)]">
              Live in ten days.
              <br />
              <span className="text-ink-400">One person owns it.</span>
            </h2>
            <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-ink-600">
              A dedicated implementation professional maps your employee, CTC and compliance
              data, runs a parallel payroll against your numbers, and is accountable until
              you are live.
            </p>
            <ol data-m="settle" className="mt-8 divide-y divide-ink-900/[0.08] border-y border-ink-900/[0.08]">
              {implementation.phases.map((p, i) => (
                <li key={p.days} className="flex items-baseline gap-4 py-3">
                  <span className="ez-kicker w-[5.8rem] shrink-0 text-brand-600">{p.days.replace('–', ' to ').replace('Day', 'Days')}</span>
                  <span>
                    <span className="block text-[0.98rem] font-semibold text-ink-900">{p.title}</span>
                    <span className="block text-[0.86rem] text-ink-500">{p.detail}</span>
                  </span>
                  {i === implementation.phases.length - 1 && (
                    <span className="ml-auto shrink-0 rounded-full bg-marigold px-2.5 py-0.5 text-[0.7rem] font-bold text-navy">Live</span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative mx-auto h-[min(56vh,30rem)] w-full max-w-[40rem]">
              <div data-stage="bars" data-tone="light" className="absolute inset-x-0 bottom-10 top-0" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 grid grid-cols-10">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={`ez-kicker text-center ${i === 9 ? 'text-[#8a5a00]' : 'text-ink-400'}`}>
                    {i === 9 ? 'Live' : `D${i + 1}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Scene>
  )
}
