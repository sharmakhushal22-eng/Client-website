'use client'

import { cn } from '@/lib/cn'

/* Spec §5.2 — "Disabled submit button while sending, with a spinner." */
export function SubmitButton({
  pending,
  disabled,
  children,
  pendingLabel = 'Sending…',
  className,
  onDark = false,
}: {
  pending: boolean
  disabled?: boolean
  children: React.ReactNode
  pendingLabel?: string
  className?: string
  onDark?: boolean
}) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      /* aria-busy so a screen reader announces the change of state, not just
         the visual spinner. */
      aria-busy={pending}
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5',
        'text-base font-semibold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-70',
        onDark
          ? 'bg-white text-brand-700 hover:bg-brand-50'
          : 'bg-brand-600 text-white hover:bg-brand-700',
        className,
      )}
    >
      {pending && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {pending ? pendingLabel : children}
    </button>
  )
}
