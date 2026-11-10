import Link from 'next/link'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onDarkOutline' | 'ink'
type Size = 'md' | 'lg'

/* Pill buttons with one behaviour shared by every variant: they press in
 * (ez-press scales to .98 on :active) and an `ez-arrow` child leads by 3px
 * on hover. Colour changes are the only other transition. No glow, no shine,
 * nothing that moves while nobody is pointing at it.
 *
 * Contrast (§8.5): white on brand-600 is 5.2:1; navy on paper is 16:1. */
const base =
  'ez-press inline-flex items-center justify-center gap-2 rounded-full font-semibold ' +
  'tracking-[-0.01em] disabled:cursor-not-allowed disabled:opacity-60 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-600'

const variants: Record<Variant, string> = {
  /* Cobalt — the product's own blue. The one loud thing in any view. */
  primary:
    'bg-brand-600 text-on-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(11_22_51/0.18)] ' +
    'hover:bg-brand-700 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_24px_-10px_rgb(37_99_235/0.7)]',
  /* Deep navy — for the closing actions on paper, where a second cobalt
     button would only repeat the first. */
  ink: 'bg-ink-900 text-white hover:bg-brand-700',
  secondary:
    'bg-transparent text-ink-900 ring-1 ring-inset ring-ink-900/15 hover:bg-white hover:ring-ink-900/30',
  ghost: 'text-ink-900 hover:bg-ink-900/5',
  onDark: 'bg-white text-ink-900 hover:bg-brand-50',
  onDarkOutline: 'bg-transparent text-white ring-1 ring-inset ring-white/45 hover:bg-white/10 hover:ring-white/70',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 py-2 text-center text-[0.95rem] leading-tight',
  lg: 'min-h-13 px-7 py-2.5 text-center text-base leading-tight',
}

type Props = {
  children: React.ReactNode
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  disabled,
  onClick,
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    const external = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith('http')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

/* The arrow every primary action carries. Its own component so the hover
 * lead (ez-press .ez-arrow) is wired the same way everywhere. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('ez-arrow h-4 w-4', className)}
    >
      <path d="M3.5 10h13M11.5 5l5 5-5 5" />
    </svg>
  )
}
