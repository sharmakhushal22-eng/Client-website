import { cn } from '@/lib/cn'
import { Container } from './Container'

type Tone = 'white' | 'tint' | 'ink' | 'transparent'

const tones: Record<Tone, string> = {
  white: 'bg-surface',
  tint: 'bg-brand-50',
  ink: 'bg-dark text-white',
  /* For sections inside a shared background band — see WorkforceBand. Any
     opaque tone here would paint over the field the band exists to show. */
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
      className={cn('py-12 sm:py-14 lg:py-16', tones[tone], className)}
    >
      <Container>{children}</Container>
    </section>
  )
}

/** Eyebrow + heading + optional lede. One <h2> per section; the page's single
 *  <h1> lives in the hero (spec §8.4). */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'center',
  onDark = false,
  onPattern = false,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: React.ReactNode
  lede?: React.ReactNode
  align?: 'left' | 'center'
  onDark?: boolean
  /* One step darker on the eyebrow and the lede, for sections that sit on
     artwork rather than a flat tone. The default weights are tuned for a flat
     ground; over a pattern the background varies locally, and measured
     worst-case contrast on ink-600 lands right on the 4.5 threshold — passing
     on average and failing where the pattern is darkest. brand-700/ink-700
     costs nothing visually and clears it. */
  onPattern?: boolean
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-xs font-bold uppercase tracking-[0.14em]',
            onDark
              ? 'text-brand-200'
              : onPattern
                ? 'text-brand-700'
                : 'text-brand-600',
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          'text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[2.75rem]',
          onDark && 'text-white',
        )}
      >
        {title}
      </Tag>
      {lede && (
        <p
          className={cn(
            'mt-5 text-lg leading-relaxed',
            onDark ? 'text-on-dark' : onPattern ? 'text-ink-700' : 'text-ink-600',
          )}
        >
          {lede}
        </p>
      )}
    </div>
  )
}
