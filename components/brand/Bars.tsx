import { cn } from '@/lib/cn'

/* The three bars of the E: EZER's one recurring shape.
 *
 * Sized by font-size (everything inside is em), coloured by currentColor.
 * `animate` settles the bars to their resting widths once, on mount — used
 * in the hero and on page heroes, where it plays with the first paint. */
export function Bars({
  className,
  animate = false,
}: {
  className?: string
  animate?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      data-animate={animate ? '' : undefined}
      className={cn('ez-bars', className)}
    >
      <span />
      <span />
      <span />
    </span>
  )
}

/* An eyebrow: the bars, then a short mono label. Used at the head of every
 * section in place of the old uppercase-blue line, so section starts share
 * one mark across the site. */
export function Eyebrow({
  children,
  className,
  tone = 'brand',
  animate = false,
}: {
  children: React.ReactNode
  className?: string
  tone?: 'brand' | 'onDark' | 'ink'
  animate?: boolean
}) {
  return (
    <p
      className={cn(
        'ez-kicker flex items-center gap-2.5',
        tone === 'onDark' ? 'text-white/70' : tone === 'ink' ? 'text-ink-500' : 'text-ink-500',
        className,
      )}
    >
      <Bars
        animate={animate}
        className={cn(
          'text-[0.9rem]',
          tone === 'onDark' ? 'text-marigold' : 'text-brand-600',
        )}
      />
      <span>{children}</span>
    </p>
  )
}
