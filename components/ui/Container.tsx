import { cn } from '@/lib/cn'

/** Max content width ~1200px with a consistent gutter — spec §8.2. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[75rem] px-5 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}
