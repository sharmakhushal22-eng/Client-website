/* ============================================================================
 * India, as a dot-matrix, with a group's locations lit across states.
 *
 * The shape is a point-in-polygon test over a 0.62° grid, computed at build
 * time (this is a server component; the browser receives plain circles).
 * The outline follows India's official boundary as published by the Survey
 * of India, including the whole of Jammu & Kashmir and Ladakh, plus the
 * Andaman & Nicobar and Lakshadweep islands. At this resolution it is a
 * silhouette, not a survey map, and it is presented as an illustration.
 *
 * Over it: a head office in Mumbai with arcs to branches, plants and depots
 * in other states, each arc carrying a pulse, each site pinging. The point
 * is the one the copy makes — several states, several rule-sets, one
 * operation — so the cities are sample locations, not customers.
 *
 * Loops, so data-live. role="img" with one description.
 * ========================================================================= */

/* [lon, lat], clockwise from the Kutch coast. */
const OUTLINE: [number, number][] = [
  [68.2, 23.7], [68.8, 24.3], [70.0, 24.4], [71.1, 24.6], [70.6, 25.6], [70.1, 26.6],
  [69.5, 27.1], [70.4, 28.0], [71.9, 28.2], [73.0, 29.4], [73.9, 30.2], [74.5, 30.9],
  [74.6, 31.9], [75.2, 32.4], [74.6, 32.8], [73.9, 33.2], [73.5, 33.9], [73.6, 34.8],
  [72.6, 35.4], [72.9, 36.4], [74.0, 36.9], [74.9, 37.1], [75.9, 36.7], [76.8, 35.9],
  [77.9, 35.5], [79.0, 35.8], [80.3, 35.4], [80.0, 34.2], [79.4, 32.8], [78.8, 31.9],
  [79.0, 31.1], [79.9, 30.7], [80.9, 30.2], [80.2, 29.2], [80.1, 28.8], [81.2, 28.4],
  [82.8, 27.5], [84.1, 27.4], [85.2, 26.7], [86.6, 26.5], [88.1, 26.4], [88.1, 27.2],
  [88.2, 27.9], [88.9, 27.3], [89.8, 26.8], [91.2, 26.8], [92.1, 26.9], [91.8, 27.6],
  [92.6, 27.9], [93.8, 28.7], [95.3, 29.3], [96.2, 29.4], [97.4, 28.3], [96.6, 27.6],
  [95.6, 27.0], [95.1, 26.2], [94.6, 25.2], [94.2, 24.2], [93.4, 23.6], [93.2, 22.6],
  [92.7, 22.0], [92.3, 22.7], [92.2, 23.7], [91.6, 24.1], [91.2, 23.6], [91.6, 24.8],
  [90.4, 25.2], [89.8, 25.3], [89.9, 26.1], [88.9, 26.3], [88.4, 26.5], [88.1, 25.6],
  [88.5, 24.8], [88.7, 24.1], [88.9, 23.1], [89.0, 22.0], [88.8, 21.6], [87.8, 21.6],
  [86.8, 21.0], [86.4, 20.2], [85.2, 19.5], [84.3, 18.4], [82.4, 17.0], [81.3, 16.3],
  [80.3, 15.6], [80.1, 13.4], [79.9, 11.8], [79.8, 10.3], [79.0, 9.4], [78.2, 8.8],
  [77.5, 8.1], [76.9, 8.6], [76.3, 9.8], [75.8, 11.2], [75.0, 12.8], [74.4, 14.4],
  [73.8, 15.9], [73.2, 17.6], [72.8, 19.0], [72.8, 20.4], [72.6, 21.1], [72.7, 22.2],
  [72.1, 21.6], [71.0, 20.8], [70.0, 21.0], [69.0, 22.2], [68.9, 22.7], [69.9, 22.9],
  [68.6, 23.2],
]
/* Island groups, as single dots at their positions. */
const ISLANDS: [number, number][] = [
  [92.7, 13.3], [92.8, 12.6], [92.7, 11.9], [92.6, 11.2], [92.7, 10.6], [93.4, 8.2], [93.8, 7.3],
  [72.6, 10.6], [72.9, 11.2], [73.0, 10.1],
]

const LON0 = 67.5
const LAT0 = 37.6
const KX = 10 * 0.93 // a little narrower per degree of longitude at these latitudes
const KY = 10
const W = Math.round((98 - LON0) * KX)
const H = Math.round((LAT0 - 6.5) * KY)
const proj = (lon: number, lat: number) => [(lon - LON0) * KX, (LAT0 - lat) * KY] as const

function inside(lon: number, lat: number) {
  let hit = false
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i]
    const [xj, yj] = OUTLINE[j]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

const STEP = 0.62
const DOTS: (readonly [number, number])[] = (() => {
  const out: (readonly [number, number])[] = []
  for (let lat = LAT0; lat > 6.5; lat -= STEP) {
    for (let lon = LON0; lon < 98; lon += STEP * 1.04) {
      if (inside(lon, lat)) out.push(proj(lon, lat))
    }
  }
  for (const [lon, lat] of ISLANDS) out.push(proj(lon, lat))
  return out
})()

type Site = { name: string; kind: string; lon: number; lat: number; label?: 'l' | 'r' }
const HQ: Site = { name: 'Mumbai', kind: 'Head office', lon: 72.88, lat: 19.08, label: 'l' }
const SITES: Site[] = [
  { name: 'Pune', kind: 'Plant', lon: 73.86, lat: 18.52 },
  { name: 'Ahmedabad', kind: 'Plant', lon: 72.57, lat: 23.02, label: 'l' },
  { name: 'Delhi NCR', kind: 'Branch', lon: 77.21, lat: 28.61, label: 'r' },
  { name: 'Bengaluru', kind: 'Branch', lon: 77.59, lat: 12.97 },
  { name: 'Chennai', kind: 'Depot', lon: 80.27, lat: 13.08, label: 'r' },
  { name: 'Hyderabad', kind: 'Branch', lon: 78.49, lat: 17.39 },
  { name: 'Kolkata', kind: 'Warehouse', lon: 88.36, lat: 22.57, label: 'r' },
  { name: 'Lucknow', kind: 'Branch', lon: 80.95, lat: 26.85 },
  { name: 'Guwahati', kind: 'Depot', lon: 91.74, lat: 26.14 },
]

export function IndiaPulse({
  tone = 'light',
  showLabels = true,
  className = '',
}: {
  tone?: 'light' | 'dark'
  showLabels?: boolean
  className?: string
}) {
  const [hx, hy] = proj(HQ.lon, HQ.lat)
  const dot = tone === 'dark' ? 'rgb(255 255 255 / .2)' : 'rgb(11 22 51 / .16)'
  const arc = tone === 'dark' ? 'rgb(157 184 255 / .28)' : 'rgb(37 99 235 / .22)'
  const label = tone === 'dark' ? 'fill-white' : 'fill-ink-800'
  const sub = tone === 'dark' ? 'fill-white/60' : 'fill-ink-500'

  return (
    <div
      data-live=""
      role="img"
      aria-label="Illustrative map of India with a head office in Mumbai connected to plants, branches, depots and a warehouse in other states."
      className={className}
    >
      <svg viewBox={`-100 -10 ${W + 150} ${H + 20}`} className="h-auto w-full overflow-visible">
        {DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.55} fill={dot} />
        ))}

        {SITES.map((s, i) => {
          const [x, y] = proj(s.lon, s.lat)
          const mx = (hx + x) / 2 - (y - hy) * 0.28
          const my = (hy + y) / 2 + (x - hx) * 0.28 - 12
          const d = `M ${hx} ${hy} Q ${mx} ${my} ${x} ${y}`
          return (
            <g key={s.name}>
              <path d={d} fill="none" stroke={arc} strokeWidth="1.2" />
              <path
                d={d}
                pathLength={100}
                fill="none"
                stroke={tone === 'dark' ? '#9db8ff' : '#2563eb'}
                strokeWidth="2.2"
                strokeLinecap="round"
                className="ez-flow-fade"
                style={{ '--d': `${(i * 0.42).toFixed(2)}s`, '--dur': '3.8s', '--dash': 16 } as React.CSSProperties}
              />
            </g>
          )
        })}

        {SITES.map((s, i) => {
          const [x, y] = proj(s.lon, s.lat)
          return (
            <g key={`n-${s.name}`}>
              <circle cx={x} cy={y} r={4} fill="#2563eb" opacity={0.35} className="ez-ping" style={{ '--d': `${(i * 0.42 + 2.6).toFixed(2)}s`, '--dur': '3.8s' } as React.CSSProperties} />
              <circle cx={x} cy={y} r={3.6} fill={tone === 'dark' ? '#9db8ff' : '#2563eb'} stroke={tone === 'dark' ? '#0b1633' : '#fff'} strokeWidth="1.5" />
              {showLabels && s.label && (
                <text
                  x={s.label === 'r' ? x + 8 : x - 8}
                  y={y + 3.5}
                  textAnchor={s.label === 'r' ? 'start' : 'end'}
                  className={`${label} text-[9px] font-semibold`}
                >
                  {s.name}
                  <tspan className={`${sub} font-normal`}> · {s.kind}</tspan>
                </text>
              )}
            </g>
          )
        })}

        {/* Head office */}
        <circle cx={hx} cy={hy} r={9} fill="#f2a516" opacity={0.4} className="ez-ping" style={{ '--dur': '2.4s' } as React.CSSProperties} />
        <circle cx={hx} cy={hy} r={5.5} fill="#f2a516" stroke={tone === 'dark' ? '#0b1633' : '#fff'} strokeWidth="2" />
        {showLabels && (
          <text x={hx - 10} y={hy + 3.5} textAnchor="end" className={`${label} text-[10px] font-bold`}>
            {HQ.name}
            <tspan className={`${sub} font-normal`}> · {HQ.kind}</tspan>
          </text>
        )}
      </svg>
    </div>
  )
}
