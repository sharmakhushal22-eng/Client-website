import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Scene } from '@/components/scene/Scene'

/* ============================================================================
 * Scene 6: pan-India.
 *
 * The galaxy breaks apart and the dots settle into India. Then every state
 * and union territory is reached in turn from a head office in Mumbai: an
 * arc, a pulse, a ping and the region's name, until all 36 markers are lit
 * (components/scene/ParticleField.tsx, shape "india"). The words say the
 * same thing in numbers, then what actually changes from state to state.
 *
 * This scene's job is GEOGRAPHY. The law is the scene before it; who sees
 * what is the scene after.
 * ========================================================================= */

const counters = [
  ['28', 'states'],
  ['8', 'union territories'],
  ['∞', 'locations, no extra cost'],
] as const

const rules = [
  ['PT', 'Slab by work location'],
  ['LWF', 'Each state’s rate and frequency'],
  ['Leave', 'Shops & Establishments rules'],
  ['Holidays', 'A calendar per location'],
] as const

export function IndiaScene({ index }: { index: number }) {
  return (
    <Scene index={index} tone="sand" labelledBy="india-title">
      <Container className="flex h-full flex-col justify-center py-20 lg:py-0 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="relative order-2 lg:order-1 lg:col-span-7">
            <div
              role="img"
              aria-label="Illustration: a map of India made of dots. From a head office in Mumbai, each of the 28 states and 8 union territories is reached in turn and named, until every one is lit."
              className="relative mx-auto aspect-square w-full max-w-[min(100%,74vh)]"
            >
              <div data-stage="india" data-tone="light" className="absolute inset-0" />
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5">
            <Eyebrow>Pan-India, multi-location</Eyebrow>
            <h2 id="india-title" className="mt-5 text-[2.3rem] leading-[1.04] sm:text-[3rem] lg:text-[min(2.7vw,4.8vh)]">
              Every state. Every UT.
              <br />
              <span className="text-brand-600">Each paid by its own rules.</span>
            </h2>

            <dl data-m="settle" className="mt-5 grid grid-cols-3 gap-2">
              {counters.map(([n, label], i) => (
                <div key={label} style={{ '--i': i } as React.CSSProperties} className="rounded-[18px] bg-white/85 px-3 py-3.5 ring-1 ring-ink-900/[0.06]">
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="ez-num block font-display text-[2rem] font-[700] leading-none tracking-[-0.04em] text-brand-600 [font-stretch:110%]">{n}</span>
                    <span className="mt-1.5 block text-[0.78rem] leading-tight text-ink-600">{label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-600">
              A plant in Gujarat, a mine in Jharkhand, branches from Guwahati to Kochi: each
              employee is paid by the rules of the state they work in. Move someone to
              Bengaluru and the next run applies Karnataka&rsquo;s.
            </p>

            <ul data-m="settle" className="mt-4 flex flex-wrap gap-1.5">
              {rules.map(([k, v], i) => (
                <li key={k} style={{ '--i': i } as React.CSSProperties} className="rounded-full bg-white/80 py-1.5 pl-1.5 pr-3 text-[0.8rem] text-ink-700 ring-1 ring-ink-900/[0.06]">
                  <span className="mr-1.5 rounded-full bg-brand-600 px-2 py-0.5 text-[0.66rem] font-bold uppercase tracking-[0.06em] text-white">{k}</span>
                  {v}
                </li>
              ))}
              <li style={{ '--i': 4 } as React.CSSProperties} className="mt-1.5 flex w-full items-center gap-3 rounded-[14px] bg-navy px-3.5 py-3 text-white">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f2a516] text-navy">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11" /></svg>
                </span>
                <span className="text-[0.86rem] leading-snug">
                  <span className="font-semibold">Pan-India minimum wages tracker.</span>{' '}
                  <span className="text-white/75">Every employee&rsquo;s pay checked against the notified rate for their state, skill and zone.</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </Scene>
  )
}
