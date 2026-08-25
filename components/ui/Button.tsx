import Link from 'next/link'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold ' +
  'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-on-accent hover:bg-brand-700 active:bg-brand-800',
  /* Contrast note (§8.5): brand-700 on white is 6.4:1, comfortably past the
     4.5:1 floor. brand-600 text would be 5.1:1 — also fine — but the darker
     tone reads better at small sizes against a white field. */
  secondary:
    'bg-surface text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50 hover:ring-brand-300',
  ghost: 'text-ink-900 hover:bg-ink-100',
  onDark: 'bg-surface text-brand-700 hover:bg-brand-50',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
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
