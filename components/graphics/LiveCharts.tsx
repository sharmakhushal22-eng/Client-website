/* ============================================================================
 * The CFO and leadership view, as a live card.
 *
 * content/positioning.ts names this role: "consolidated compliance and cost
 * visibility across every company and branch ... filing status, headcount
 * cost and risk flags, on one screen". So the card shows exactly those
 * three things, moving the way a dashboard does when data is flowing:
 * headcount bars by company breathing between values, a cost line drawing
 * itself across the year, a filing donut sweeping to its share.
 *
 * Sample data, labelled. Loops, so data-live.
 * ========================================================================= */

const companies = [
  { name: 'Co. 1', a: 0.62, b: 0.78 },
  { name: 'Co. 2', a: 0.44, b: 0.52 },
  { name: 'Co. 3', a: 0.7, b: 0.94 },
  { name: 'Co. 4', a: 0.3, b: 0.4 },
]

const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
const cost = [38, 41, 40, 46, 49, 47, 53]

export function LiveCharts({ className = '' }: { className?: string }) {
  const w = 300
  const h = 110
  const max = 60
  const pts = cost.map((v, i) => [(i / (cost.length - 1)) * w, h - (v / max) * h] as const)
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L ${w} ${h} L 0 ${h} Z`
  const [lx, ly] = pts[pts.length - 1]

  return (
    <div
      data-live=""
      role="img"
      aria-label="Illustration with sample data: a leadership dashboard showing headcount by company, payroll cost rising from April to October, and statutory filings mostly complete."
      className={`rounded-[26px] bg-white p-6 shadow-[0_1px_2px_rgb(11_22_51/0.05),0_40px_80px_-40px_rgb(11_22_51/0.35)] ring-1 ring-ink-900/[0.06] sm:p-7 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="ez-kicker text-ink-500">Leadership view · whole group</p>
          <p className="mt-1.5 text-[1rem] font-semibold text-ink-900">October, consolidated</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-700">
          <span className="relative flex h-1.5 w-1.5">
            <span className="ez-ping absolute inset-0 rounded-full bg-emerald-600" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-600" />
          </span>
          Live
        </span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-[1.15fr_1fr]">
        {/* Headcount by company */}
        <div>
          <p className="text-[0.74rem] font-medium text-ink-500">Headcount by company</p>
          <div className="mt-3 flex h-28 items-end gap-3 border-b border-ink-900/10">
            {companies.map((c, i) => (
              <div key={c.name} className="flex h-full flex-1 flex-col items-center justify-end">
                <div
                  className="ez-breathe-bar w-full rounded-t-[8px] bg-[linear-gradient(180deg,#2563eb,#3b82f6)]"
                  style={{ height: '100%', transform: `scaleY(${c.b})`, '--a': c.a, '--b': c.b, '--d': `${i * -0.7}s`, '--dur': `${4 + i * 0.6}s` } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            {companies.map((c) => (
              <span key={c.name} className="flex-1 text-center text-[0.68rem] text-ink-500">{c.name}</span>
            ))}
          </div>
        </div>

        {/* Filing status donut */}
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 42 42" className="h-28 w-28 shrink-0 -rotate-90">
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgb(11 22 51 / .08)" strokeWidth="5" />
            <circle
              cx="21" cy="21" r="15.9" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round"
              pathLength={100} strokeDasharray="100 100"
              className="ez-donut"
              style={{ strokeDashoffset: 14, '--from': 60, '--to': 14, '--dur': '7s' } as React.CSSProperties}
            />
          </svg>
          <div>
            <p className="font-display text-[1.6rem] font-[680] leading-none tracking-[-0.03em] text-ink-900 [font-stretch:108%]">86%</p>
            <p className="mt-1 text-[0.74rem] leading-snug text-ink-500">of October&rsquo;s filings done, 3 due this week</p>
          </div>
        </div>
      </div>

      {/* Payroll cost, drawing itself */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <p className="text-[0.74rem] font-medium text-ink-500">Payroll cost, this financial year</p>
          <p className="text-[0.74rem] font-semibold text-emerald-700">+12.8% since April</p>
        </div>
        <svg viewBox={`0 -8 ${w} ${h + 26}`} className="mt-2 h-auto w-full overflow-visible">
          <defs>
            <linearGradient id="ez-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity=".18" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.5, 1].map((t) => (
            <line key={t} x1="0" x2={w} y1={h * t} y2={h * t} stroke="rgb(11 22 51 / .06)" />
          ))}
          <path d={area} fill="url(#ez-area)" />
          <path d={line} pathLength={1} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ez-line-loop" style={{ '--dur': '7s' } as React.CSSProperties} />
          <circle cx={lx} cy={ly} r="9" fill="rgb(37 99 235 / .25)" className="ez-ping" />
          <circle cx={lx} cy={ly} r="4" fill="#2563eb" stroke="#fff" strokeWidth="2" />
          {months.map((m, i) => (
            <text key={m} x={(i / (months.length - 1)) * w} y={h + 16} textAnchor="middle" className="fill-ink-400 text-[9px]">
              {m}
            </text>
          ))}
        </svg>
      </div>
      <p className="mt-3 text-right text-[0.7rem] text-ink-400">Illustrative · sample data</p>
    </div>
  )
}
