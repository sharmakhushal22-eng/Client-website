import { cn } from '@/lib/cn'
import { Container } from './Container'
import { Eyebrow } from '@/components/brand/Bars'

type Tone = 'white' | 'tint' | 'paper' | 'ink' | 'transparent'

/* Grounds, in the site's palette. `tint` was a pale blue wash; it is now the
 * warm sand (paper-2), so a tinted section reads as a change of scene rather
 * than as a highlighted one. `ink` is the deep navy band. */
const tones: Record<Tone, string> = {
  white: 'bg-white',
  tint: 'bg-paper-2',
  paper: 'bg-paper',
  ink: 'bg-navy text-white',
  /* For sections inside a shared background band. Any opaque tone here
     would paint over the field the band exists to show. */
  transparent: '',
}

export function Section({
  children,
  tone = 'white',
  className,
  id,
  ariaLabel,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
  id?: string
  ariaLabel?: string
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn('py-16 sm:py-20 lg:py-24', tones[tone], className)}
    >
      <Container>{children}</Container>
    </section>
  )
}

/** Eyebrow + heading + optional lede. One <h2> per section; the page's single
 *  <h1> lives in the hero (spec §8.4).
 *
 *  Left-aligned by default: the site sets its section openings like an
 *  editorial page, against the left edge of the grid. `center` remains for
 *  the few places a centred block is genuinely the composition. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  onDark = false,
  onPattern = false,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: React.ReactNode
  lede?: React.ReactNode
  align?: 'left' | 'center'
  onDark?: boolean
  /* Kept for API compatibility; the new grounds are flat, so it no longer
     needs to darken anything. */
  onPattern?: boolean
  as?: 'h1' | 'h2' | 'h3'
}) {
  void onPattern
  return (
    <div className={cn('max-w-3xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
      {eyebrow && (
        <Eyebrow
          tone={onDark ? 'onDark' : 'brand'}
          className={align === 'center' ? 'justify-center' : undefined}
        >
          {eyebrow}
        </Eyebrow>
      )}
      <Tag
        className={cn(
          'mt-5 text-[2.1rem] leading-[1.06] sm:text-[2.7rem] lg:text-[3.1rem]',
          onDark && '!text-white',
        )}
      >
        {title}
      </Tag>
      {lede && (
        <p
          className={cn(
            'mt-5 text-lg leading-relaxed',
            align === 'center' && 'mx-auto max-w-2xl',
            onDark ? 'text-white/75' : 'text-ink-600',
          )}
        >
          {lede}
        </p>
      )}
    </div>
  )
}
