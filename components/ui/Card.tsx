import { cn } from '@/lib/cn'

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: React.ReactNode
  className?: string
  interactive?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-6 ring-1 ring-ink-200/70',
        interactive &&
          'transition-shadow duration-200 hover:shadow-lg hover:shadow-brand-900/5 hover:ring-brand-200',
        className,
      )}
    >
      {children}
    </div>
  )
}
