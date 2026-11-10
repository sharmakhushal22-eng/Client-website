import { Icon, type IconName } from '@/components/ui/Icon'

/* ============================================================================
 * The compliance engine, drawn: every kind of location feeds one core, and
 * the statutory heads come out the other side.
 *
 * Inputs are the product's own location types; outputs are the heads the
 * payroll run calculates (content/modules.ts → complianceItems). Pulses run
 * in along the left wires, the core turns, pulses run out along the right
 * ones — a picture of "one run, every location", without promising the
 * register generator that flags.complianceEngineLive still holds back.
 *
 * Desktop: left → core → right, curved wires. Below md: top → core →
 * bottom, so it reads the same way on a phone without shrinking the labels.
 * Loops, so data-live; decorative, so aria-hidden (the band's text says it).
 * ========================================================================= */

const inputs: { label: string; icon: IconName }[] = [
  { label: 'Corporate office', icon: 'briefcase' },
  { label: 'Factory', icon: 'settings' },
  { label: 'Mine', icon: 'pickaxe' },
  { label: 'Warehouse', icon: 'map-pin' },
  { label: 'Branch', icon: 'users' },
]
/* The heads the run works out, under the law as it now stands. Minimum
   wages is the pan-India tracker: every employee's pay checked against the
   notified rate for their state, skill and zone. */
const outputs = ['EPF', 'ESIC', 'Professional Tax', 'LWF', 'TDS', 'Gratuity', 'Bonus', 'Minimum wages']

const W = 1000
const H = 440
const CX = W / 2
const CY = H / 2

export function EngineHub({ particleCore = false }: { particleCore?: boolean }) {
  const inY = inputs.map((_, i) => 50 + i * ((H - 100) / (inputs.length - 1)))
  const outY = outputs.map((_, i) => 26 + i * ((H - 52) / (outputs.length - 1)))
  const inX = 210
  const outX = W - 190

  return (
    <div data-live="" aria-hidden="true" className="select-none">
      {/* ── Desktop ────────────────────────────────────────────────────── */}
      <div className="relative hidden md:block" style={{ aspectRatio: `${W} / ${H}` }}>
        {particleCore && <div data-stage="vortex" data-tone="dark" className="absolute left-[22%] top-[18%] h-[64%] w-[56%]" />}
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <radialGradient id="ez-core-glow">
              <stop offset="0%" stopColor="#2563eb" stopOpacity=".55" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
          </defs>

          {inY.map((y, i) => {
            const d = `M ${inX} ${y} C ${inX + 150} ${y}, ${CX - 170} ${CY}, ${CX - 70} ${CY}`
            return (
              <g key={`in-${i}`}>
                <path d={d} fill="none" stroke="rgb(255 255 255 / .14)" strokeWidth="1.5" />
                <path d={d} pathLength={100} fill="none" stroke="#9db8ff" strokeWidth="3" strokeLinecap="round" className="ez-flow" style={{ '--d': `${i * 0.55}s`, '--dur': '2.8s', '--dash': 12 } as React.CSSProperties} />
              </g>
            )
          })}
          {outY.map((y, i) => {
            const d = `M ${CX + 70} ${CY} C ${CX + 170} ${CY}, ${outX - 150} ${y}, ${outX} ${y}`
            return (
              <g key={`out-${i}`}>
                <path d={d} fill="none" stroke="rgb(255 255 255 / .14)" strokeWidth="1.5" />
                <path d={d} pathLength={100} fill="none" stroke="#f2a516" strokeWidth="3" strokeLinecap="round" className="ez-flow" style={{ '--d': `${1.4 + i * 0.24}s`, '--dur': '2.8s', '--dash': 12 } as React.CSSProperties} />
              </g>
            )
          })}

          {/* The core. With particleCore the particle field forms a galaxy
              here instead, and only a bright centre is drawn. */}
          {particleCore ? (
            <>
              <circle cx={CX} cy={CY} r={58} fill="#0b1633" />
              <circle cx={CX} cy={CY} r={58} fill="none" stroke="rgb(157 184 255 / .5)" strokeWidth="1.2" />
              <circle cx={CX} cy={CY} r={58} fill="rgb(37 99 235 / .45)" className="ez-ping" style={{ '--dur': '3.2s' } as React.CSSProperties} />
            </>
          ) : (
            <>
              <circle cx={CX} cy={CY} r={150} fill="url(#ez-core-glow)" className="ez-glow" style={{ '--dur': '3.2s' } as React.CSSProperties} />
              <g className="ez-spin" style={{ '--dur': '24s' } as React.CSSProperties}>
                <circle cx={CX} cy={CY} r={96} fill="none" stroke="rgb(157 184 255 / .55)" strokeWidth="1.5" strokeDasharray="3 10" />
                <circle cx={CX + 96} cy={CY} r={5} fill="#9db8ff" />
              </g>
              <g className="ez-spin-rev" style={{ '--dur': '40s' } as React.CSSProperties}>
                <circle cx={CX} cy={CY} r={118} fill="none" stroke="rgb(255 255 255 / .12)" strokeWidth="1" strokeDasharray="1 7" />
                <circle cx={CX} cy={CY - 118} r={4} fill="#f2a516" />
              </g>
              <circle cx={CX} cy={CY} r={70} fill="#2563eb" />
              <circle cx={CX} cy={CY} r={70} fill="none" stroke="rgb(255 255 255 / .35)" strokeWidth="1.5" />
              <circle cx={CX} cy={CY} r={70} fill="rgb(37 99 235 / .5)" className="ez-ping" style={{ '--dur': '2.8s' } as React.CSSProperties} />
            </>
          )}
        </svg>

        {/* Core label */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <p className="font-display text-[1.35rem] font-[760] leading-none tracking-[-0.03em] [font-stretch:118%]">EZER</p>
          <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/80">Rules engine</p>
        </div>

        {/* Inputs */}
        {inputs.map((n, i) => (
          <div key={n.label} className="absolute -translate-y-1/2" style={{ left: 0, width: `${(inX / W) * 100}%`, top: `${(inY[i] / H) * 100}%` }}>
            <div className="flex items-center gap-3 rounded-[16px] bg-white/[0.06] px-4 py-2.5 ring-1 ring-white/12">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-[#9db8ff]">
                <Icon name={n.icon} className="h-4 w-4" />
              </span>
              <span className="text-[0.88rem] font-semibold text-white">{n.label}</span>
            </div>
          </div>
        ))}

        {/* Outputs */}
        {outputs.map((o, i) => (
          <div key={o} className="absolute -translate-y-1/2" style={{ left: `${(outX / W) * 100}%`, width: `${((W - outX) / W) * 100}%`, top: `${(outY[i] / H) * 100}%` }}>
            <div className="ml-3 flex items-center justify-between gap-2 rounded-full bg-white/[0.06] py-1.5 pl-4 pr-1.5 ring-1 ring-white/12">
              <span className="truncate text-[0.82rem] font-semibold text-white">{o}</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f2a516] text-navy">
                <Icon name="check" className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Phone ──────────────────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-2">
          {inputs.map((n, i) => (
            <div key={n.label} className={`${i === inputs.length - 1 ? 'col-span-2 justify-center ' : ''}flex items-center gap-2 rounded-[14px] bg-white/[0.06] px-3 py-2.5 ring-1 ring-white/12`}>
              <Icon name={n.icon} className="h-4 w-4 shrink-0 text-[#9db8ff]" />
              <span className="truncate text-[0.8rem] font-semibold text-white">{n.label}</span>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 200 150" className="mx-auto my-1 block h-40 w-full overflow-visible">
          {[30, 65, 100, 135, 170].map((x, i) => (
            <g key={x}>
              <path d={`M ${x} 0 C ${x} 30, 100 25, 100 52`} fill="none" stroke="rgb(255 255 255 / .14)" />
              <path d={`M ${x} 0 C ${x} 30, 100 25, 100 52`} pathLength={100} fill="none" stroke="#9db8ff" strokeWidth="2.5" strokeLinecap="round" className="ez-flow" style={{ '--d': `${i * 0.5}s`, '--dur': '2.4s', '--dash': 14 } as React.CSSProperties} />
            </g>
          ))}
          <g className="ez-spin" style={{ '--dur': '24s' } as React.CSSProperties}>
            <circle cx={100} cy={75} r={34} fill="none" stroke="rgb(157 184 255 / .55)" strokeDasharray="2 6" />
          </g>
          <circle cx={100} cy={75} r={24} fill="#2563eb" />
          <circle cx={100} cy={75} r={24} fill="rgb(37 99 235 / .5)" className="ez-ping" />
          <text x={100} y={79} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800">EZER</text>
          {[30, 70, 100, 130, 170].map((x, i) => (
            <g key={x}>
              <path d={`M 100 98 C 100 125, ${x} 120, ${x} 150`} fill="none" stroke="rgb(255 255 255 / .14)" />
              <path d={`M 100 98 C 100 125, ${x} 120, ${x} 150`} pathLength={100} fill="none" stroke="#f2a516" strokeWidth="2.5" strokeLinecap="round" className="ez-flow" style={{ '--d': `${1.2 + i * 0.3}s`, '--dur': '2.4s', '--dash': 14 } as React.CSSProperties} />
            </g>
          ))}
        </svg>
        <div className="flex flex-wrap justify-center gap-2">
          {outputs.map((o) => (
            <span key={o} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.78rem] font-semibold text-white ring-1 ring-white/12">
              {o} <span className="text-[#f2a516]">✓</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
