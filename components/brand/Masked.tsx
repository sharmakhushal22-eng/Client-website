import { cn } from '@/lib/cn'

/* A heading set as masked lines: each line rises out of its own baseline as
 * the heading scrolls in (data-m="mask", styled in app/(site)/site.css).
 *
 * The line breaks are authored, not left to the browser, which is the point:
 * a display headline should break where it reads best, and the mask needs a
 * box per line to clip. On narrow screens the lines still wrap within
 * themselves; they never merge.
 *
 * Reserved for section headlines that open a chapter. Body headings stay
 * still. */
export function Masked({
  lines,
  as: Tag = 'h2',
  className,
  delay,
  id,
}: {
  lines: React.ReactNode[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  delay?: number
  id?: string
}) {
  return (
    <Tag
      id={id}
      data-m="mask"
      className={className}
      style={delay ? ({ '--d': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className="ez-line"
          style={i ? ({ '--li': i } as React.CSSProperties) : undefined}
        >
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

/* The small framing every product picture on the site shares: a caption in
 * mono above a frame, and an honest note that the picture is illustrative.
 * Keeping the label in one place means no mockup can quietly drop it. */
export function Figure({
  label,
  note = 'Illustrative · sample data',
  children,
  className,
}: {
  label: string
  note?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure className={cn('relative', className)}>
      <figcaption className="ez-kicker mb-3 flex items-center justify-between gap-4 text-ink-500">
        <span>{label}</span>
        <span className="text-ink-400 normal-case tracking-normal">{note}</span>
      </figcaption>
      {children}
    </figure>
  )
}
