import { cn } from '@/lib/cn'

/* ============================================================================
 * <SceneStack> and <Scene>: the stacked, full-screen chapters.
 *
 * Styling and the stacking itself live in app/(site)/scenes.css. These
 * components only wire the names: every scene declares its own view
 * timeline (--sc<i>) and points at the next one's, which drives its
 * recede as the next scene slides over it. The stack puts every name in
 * timeline-scope so the siblings can see each other.
 *
 * A scene with `pin` holds the screen for that many steps: it is followed
 * by an invisible track of step markers (one per step after the first),
 * scrolled past underneath while the scene stays put. Components inside
 * read the markers to change what they show.
 * ========================================================================= */

export type Tone = 'paper' | 'white' | 'sand' | 'navy' | 'cobalt'

export function SceneStack({ count, children, className }: { count: number; children: React.ReactNode; className?: string }) {
  const names = Array.from({ length: count }, (_, i) => `--sc${i}`).join(', ')
  return (
    <div className={cn('ez-stack', className)} style={{ timelineScope: names } as React.CSSProperties}>
      {children}
    </div>
  )
}

export function Scene({
  index,
  last = false,
  tone = 'paper',
  id,
  label,
  labelledBy,
  pin,
  pinId,
  className,
  children,
}: {
  index: number
  last?: boolean
  tone?: Tone
  id?: string
  label?: string
  labelledBy?: string
  pin?: number
  pinId?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <>
      <section
        id={id}
        data-scene=""
        data-next={last ? undefined : ''}
        aria-label={label}
        aria-labelledby={labelledBy}
        className={cn('ez-scene', `ez-scene-tone-${tone}`, className)}
        style={{ '--self': `--sc${index}`, '--next': `--sc${index + 1}` } as React.CSSProperties}
      >
        {children}
      </section>
      {pin && pin > 1 && (
        <div aria-hidden="true" className="ez-pin-track" data-pin-track={pinId}>
          {Array.from({ length: pin - 1 }, (_, i) => (
            <div key={i} data-pin-step={i + 2} />
          ))}
        </div>
      )}
    </>
  )
}
