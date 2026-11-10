import { cn } from '@/lib/cn'

/* ============================================================================
 * Line doodles of the everyday things HR software is actually for: an
 * approval flying off, a leave day ticked, a clock, a salary, a shield, a
 * question, the paperwork, the coffee that gets through month-end.
 *
 * Each draws itself in once when it scrolls into view ([data-m="draw"],
 * every stroke carries pathLength=1) and then floats very slightly
 * (ez-bob, inside a [data-live] wrapper so it pauses off screen). A few
 * have one extra moving part: the clock's hands turn, the coffee steams,
 * the plane's trail shimmers.
 *
 * Ink strokes on paper with one soft colour blob behind, so they read as a
 * hand in the margin rather than as icons. Decorative, aria-hidden.
 * ========================================================================= */

export type DoodleKind = 'plane' | 'calendar' | 'clock' | 'rupee' | 'shield' | 'chat' | 'docs' | 'coffee' | 'spark'

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const k = (n: number) => ({ '--k': n }) as React.CSSProperties

function Art({ kind }: { kind: DoodleKind }) {
  switch (kind) {
    case 'plane':
      return (
        <>
          <circle cx="70" cy="56" r="34" fill="rgb(242 165 22 / .18)" stroke="none" />
          <path {...S} pathLength={1} style={k(0)} d="M16 60 L104 24 L76 98 L58 70 Z" />
          <path {...S} pathLength={1} style={k(1)} d="M58 70 L104 24" />
          <path {...S} pathLength={1} style={k(2)} d="M58 70 L56 90 L68 80" />
          <path fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" className="ez-glow" d="M14 62 C -4 72, -2 98, 18 100 C 32 101, 34 86, 24 84" />
        </>
      )
    case 'calendar':
      return (
        <>
          <circle cx="62" cy="66" r="34" fill="rgb(37 99 235 / .10)" stroke="none" />
          <rect {...S} pathLength={1} style={k(0)} x="22" y="30" width="76" height="68" rx="12" />
          <path {...S} pathLength={1} style={k(1)} d="M22 50 H98" />
          <path {...S} pathLength={1} style={k(2)} d="M42 20 V38 M78 20 V38" />
          <path {...S} pathLength={1} style={k(3)} stroke="#2563eb" strokeWidth="3.2" d="M44 74 L56 86 L80 62" />
        </>
      )
    case 'clock':
      return (
        <>
          <circle cx="60" cy="62" r="36" fill="rgb(242 165 22 / .16)" stroke="none" />
          <circle {...S} pathLength={1} style={k(0)} cx="60" cy="60" r="40" />
          <path {...S} pathLength={1} style={k(1)} d="M60 24 V30 M96 60 H90 M60 96 V90 M24 60 H30" />
          <g className="ez-hand" style={{ transformOrigin: '60px 60px', '--dur': '48s' } as React.CSSProperties}>
            <path {...S} strokeWidth="3" d="M60 60 V38" />
          </g>
          <g className="ez-hand" style={{ transformOrigin: '60px 60px', '--dur': '6s' } as React.CSSProperties}>
            <path fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" d="M60 60 L84 60" />
          </g>
          <circle cx="60" cy="60" r="3.5" fill="currentColor" />
        </>
      )
    case 'rupee':
      return (
        <>
          <circle cx="64" cy="64" r="34" fill="rgb(37 99 235 / .10)" stroke="none" />
          <circle {...S} pathLength={1} style={k(0)} cx="60" cy="60" r="40" />
          <circle {...S} pathLength={1} style={k(1)} strokeWidth="1.6" cx="60" cy="60" r="31" />
          <path {...S} pathLength={1} style={k(2)} stroke="#2563eb" strokeWidth="3" d="M46 42 H76 M46 53 H76 M50 42 C 70 42, 70 65, 50 65 H46 L72 82" />
        </>
      )
    case 'shield':
      return (
        <>
          <circle cx="56" cy="62" r="34" fill="rgb(242 165 22 / .16)" stroke="none" />
          <path {...S} pathLength={1} style={k(0)} d="M60 16 L94 28 V56 C94 80 79 96 60 104 C41 96 26 80 26 56 V28 Z" />
          <path {...S} pathLength={1} style={k(1)} stroke="#2563eb" strokeWidth="3.2" d="M44 60 L56 72 L78 48" />
        </>
      )
    case 'chat':
      return (
        <>
          <circle cx="62" cy="54" r="34" fill="rgb(37 99 235 / .10)" stroke="none" />
          <path {...S} pathLength={1} style={k(0)} d="M26 26 H94 A12 12 0 0 1 106 38 V70 A12 12 0 0 1 94 82 H58 L38 98 V82 H26 A12 12 0 0 1 14 70 V38 A12 12 0 0 1 26 26 Z" />
          <circle cx="42" cy="54" r="4" fill="currentColor" className="ez-glow" style={{ '--d': '0s', '--dur': '1.8s' } as React.CSSProperties} />
          <circle cx="60" cy="54" r="4" fill="currentColor" className="ez-glow" style={{ '--d': '.3s', '--dur': '1.8s' } as React.CSSProperties} />
          <circle cx="78" cy="54" r="4" fill="#2563eb" className="ez-glow" style={{ '--d': '.6s', '--dur': '1.8s' } as React.CSSProperties} />
        </>
      )
    case 'docs':
      return (
        <>
          <circle cx="60" cy="64" r="34" fill="rgb(242 165 22 / .16)" stroke="none" />
          <path {...S} pathLength={1} style={k(0)} d="M38 22 H72 L88 38 V94 A6 6 0 0 1 82 100 H38 A6 6 0 0 1 32 94 V28 A6 6 0 0 1 38 22 Z" />
          <path {...S} pathLength={1} style={k(1)} d="M72 22 V38 H88" />
          <path {...S} pathLength={1} style={k(2)} d="M44 56 H76 M44 68 H76 M44 80 H62" />
          <path {...S} pathLength={1} style={k(3)} stroke="#2563eb" d="M24 34 V100 A8 8 0 0 0 32 108 H76" />
        </>
      )
    case 'coffee':
      return (
        <>
          <circle cx="58" cy="70" r="32" fill="rgb(37 99 235 / .10)" stroke="none" />
          <path {...S} pathLength={1} style={k(0)} d="M28 52 H84 V78 A22 22 0 0 1 62 100 H50 A22 22 0 0 1 28 78 Z" />
          <path {...S} pathLength={1} style={k(1)} d="M84 60 H92 A10 10 0 0 1 92 80 H84" />
          <g className="ez-bob" style={{ '--bob': '-6px', '--dur': '3s' } as React.CSSProperties}>
            <path fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" className="ez-glow" style={{ '--dur': '2.4s' } as React.CSSProperties} d="M44 40 C 38 32, 50 28, 44 18" />
            <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="ez-glow" style={{ '--dur': '2.4s', '--d': '.8s' } as React.CSSProperties} d="M60 40 C 54 32, 66 28, 60 18" />
          </g>
        </>
      )
    case 'spark':
      return (
        <path {...S} pathLength={1} style={k(0)} stroke="#f2a516" strokeWidth="3" d="M60 20 C 62 48, 72 58, 100 60 C 72 62, 62 72, 60 100 C 58 72, 48 62, 20 60 C 48 58, 58 48, 60 20 Z" />
      )
  }
}

export function Doodle({
  kind,
  className,
  delay = 0,
  float = true,
}: {
  kind: DoodleKind
  className?: string
  delay?: number
  float?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      data-m="draw"
      className={cn('pointer-events-none block select-none text-ink-800', className)}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      <span data-live="" className="block">
        <span
          className={cn('block', float && 'ez-bob')}
          style={{ '--d': `${-(delay % 3000) / 1000}s`, '--dur': '7s', '--bob': '-10px' } as React.CSSProperties}
        >
          <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
            <Art kind={kind} />
          </svg>
        </span>
      </span>
    </span>
  )
}

/* Ready-made groupings for the margins of page heroes, so each page's
 * corner says something about that page rather than repeating one motif. */
export function DoodleCluster({
  set,
  className,
}: {
  set: 'reading' | 'contact' | 'compliance' | 'celebrate' | 'paper' | 'demo'
  className?: string
}) {
  const layouts: Record<typeof set, [DoodleKind, string, number][]> = {
    reading: [['docs', 'left-24 top-0 h-44 w-44', 0], ['chat', 'left-0 top-40 h-32 w-32', 300], ['coffee', 'left-52 top-48 h-28 w-28', 500], ['spark', 'left-4 top-6 h-10 w-10', 700]],
    contact: [['plane', 'left-10 top-0 h-44 w-44', 0], ['chat', 'left-48 top-36 h-32 w-32', 300], ['spark', 'left-0 top-40 h-10 w-10', 600]],
    demo: [['calendar', 'left-28 top-0 h-40 w-40', 0], ['clock', 'left-0 top-32 h-32 w-32', 300], ['spark', 'left-60 top-40 h-10 w-10', 600]],
    compliance: [['shield', 'left-16 top-0 h-40 w-40', 0], ['docs', 'left-48 top-28 h-32 w-32', 300], ['spark', 'left-0 top-32 h-10 w-10', 600]],
    celebrate: [['plane', 'left-20 top-0 h-44 w-44', 0], ['spark', 'left-0 top-10 h-12 w-12', 300], ['spark', 'left-60 top-40 h-9 w-9', 500], ['calendar', 'left-4 top-40 h-28 w-28', 400]],
    paper: [['docs', 'left-10 top-0 h-36 w-36', 0], ['shield', 'left-40 top-24 h-28 w-28', 300]],
  }
  return (
    <div aria-hidden="true" className={cn('relative h-72 w-80', className)}>
      {layouts[set].map(([kind, pos, delay], i) => (
        <Doodle key={i} kind={kind} delay={delay} className={cn('absolute', pos)} />
      ))}
    </div>
  )
}
