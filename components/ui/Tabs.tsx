'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/cn'

/* ============================================================================
 * A tab strip that collapses a tall stack into one panel-height section.
 *
 * This is the main lever for page length. Six stacked cards cost six card
 * heights; six tabs cost one. The information is identical — the reader
 * chooses which slice to read instead of scrolling past five they did not
 * want.
 *
 * Keyboard behaviour follows the WAI-ARIA tabs pattern: arrows move between
 * tabs, Home/End jump to the ends, and only the active tab is in the tab
 * order.
 * ========================================================================= */

export type TabItem = {
  id: string
  label: string
  /* Optional second line in the tab button — used where the label alone is
   * too terse to choose from. */
  hint?: string
  panel: React.ReactNode
}

export function Tabs({
  items,
  ariaLabel,
  onDark = false,
  variant = 'pill',
  className,
}: {
  items: TabItem[]
  ariaLabel: string
  onDark?: boolean
  /* 'pill'   — horizontal chips, good for 3–8 short labels
   * 'sidebar'— vertical list beside the panel, good for longer labels */
  variant?: 'pill' | 'sidebar'
  className?: string
}) {
  const [active, setActive] = useState(0)
  const uid = useId()

  const move = (e: React.KeyboardEvent, i: number) => {
    const keys: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: items.length - 1,
    }
    const next = keys[e.key]
    if (next === undefined) return
    e.preventDefault()
    const clamped = (next + items.length) % items.length
    setActive(clamped)
    document.getElementById(`${uid}-tab-${clamped}`)?.focus()
  }

  const tabButtons = items.map((item, i) => {
    const selected = i === active
    return (
      <button
        key={item.id}
        id={`${uid}-tab-${i}`}
        role="tab"
        type="button"
        aria-selected={selected}
        aria-controls={`${uid}-panel-${i}`}
        tabIndex={selected ? 0 : -1}
        onClick={() => setActive(i)}
        onKeyDown={(e) => move(e, i)}
        className={cn(
          'cursor-pointer rounded-xl text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
          variant === 'pill'
            ? 'px-4 py-2.5 text-sm font-semibold'
            : 'w-full px-4 py-3',
          selected
            ? onDark
              ? 'bg-brand-600 text-white'
              : 'bg-brand-600 text-white shadow-sm'
            : onDark
              ? 'text-ink-300 hover:bg-white/10 hover:text-white'
              : 'text-ink-600 hover:bg-brand-50 hover:text-ink-900',
        )}
      >
        <span className={variant === 'sidebar' ? 'block text-sm font-bold' : ''}>
          {item.label}
        </span>
        {item.hint && variant === 'sidebar' && (
          <span
            className={cn(
              'mt-0.5 block text-xs leading-snug',
              selected ? 'text-brand-100' : onDark ? 'text-ink-500' : 'text-ink-500',
            )}
          >
            {item.hint}
          </span>
        )}
      </button>
    )
  })

  if (variant === 'sidebar') {
    return (
      <div className={cn('grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-10', className)}>
        <div
          role="tablist"
          aria-label={ariaLabel}
          aria-orientation="vertical"
          className={cn(
            'flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0',
            onDark ? '' : '',
          )}
        >
          {tabButtons}
        </div>

        {items.map((item, i) => (
          <div
            key={item.id}
            id={`${uid}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${i}`}
            hidden={i !== active}
            className={i === active ? 'min-w-0' : undefined}
          >
            {i === active && item.panel}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          'flex flex-wrap gap-1.5 rounded-2xl p-1.5',
          onDark ? 'bg-white/10' : 'bg-brand-50 ring-1 ring-brand-100',
        )}
      >
        {tabButtons}
      </div>

      {items.map((item, i) => (
        <div
          key={item.id}
          id={`${uid}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${i}`}
          hidden={i !== active}
          className={i === active ? 'mt-7' : undefined}
        >
          {i === active && item.panel}
        </div>
      ))}
    </div>
  )
}
