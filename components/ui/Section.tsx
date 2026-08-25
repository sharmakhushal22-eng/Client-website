import { cn } from '@/lib/cn'
import { Container } from './Container'

type Tone = 'white' | 'tint' | 'ink'

const tones: Record<Tone, string> = {
  white: 'bg-surface',
  tint: 'bg-brand-50',
  ink: 'bg-dark text-white',
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
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: React.ReactNode
  lede?: React.ReactNode
  align?: 'left' | 'center'
  onDark?: boolean
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
            onDark ? 'text-brand-300' : 'text-brand-600',
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
            onDark ? 'text-ink-200' : 'text-ink-600',
          )}
        >
          {lede}
        </p>
      )}
    </div>
  )
}
