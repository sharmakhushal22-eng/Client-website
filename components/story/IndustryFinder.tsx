'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { industryCategories } from '@/content/positioning'
import { cn } from '@/lib/cn'

/* ============================================================================
 * The sector index, with a find box.
 *
 * A buyer arrives on this page with one question: is my sector here, and do
 * they know what is different about it? So the page answers it directly:
 * type "warehouse" or "NBFC" and the matching industries light up, the
 * groups holding them stay at full strength, and the rest step back.
 *
 * Everything is in the server HTML; the box only changes emphasis, never
 * removes content, so the full list is always readable and indexable.
 * useDeferredValue keeps typing responsive on a slow phone even though 91
 * items re-render per keystroke.
 * ========================================================================= */
export function IndustryFinder() {
  const [query, setQuery] = useState('')
  const q = useDeferredValue(query.trim().toLowerCase())

  const hits = useMemo(() => {
    if (!q) return null
    const set = new Set<string>()
    for (const c of industryCategories) {
      const catHit = c.name.toLowerCase().includes(q) || c.note.toLowerCase().includes(q)
      for (const i of c.industries) if (catHit || i.toLowerCase().includes(q)) set.add(i)
    }
    return set
  }, [q])

  const count = hits?.size ?? 0

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-ink-900/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <label className="block w-full max-w-md">
          <span className="ez-kicker text-ink-500">Find your sector</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try ‘warehouse’, ‘NBFC’ or ‘hotel’"
            className="mt-3 h-13 w-full rounded-full bg-white px-5 text-[1rem] text-ink-900 ring-1 ring-inset ring-ink-900/12 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </label>
        <p aria-live="polite" className="text-[0.92rem] text-ink-500">
          {hits === null
            ? `${industryCategories.reduce((n, c) => n + c.industries.length, 0)} industries in ${industryCategories.length} groups`
            : count === 0
              ? 'Not listed by name. The rules may still fit, so ask us.'
              : `${count} match${count === 1 ? '' : 'es'}`}
        </p>
      </div>

      <ol className="mt-2">
        {industryCategories.map((c, idx) => {
          const catActive = hits === null || c.industries.some((i) => hits.has(i))
          return (
            <li
              key={c.name}
              className={cn(
                'grid gap-4 border-b border-ink-900/10 py-8 transition-opacity duration-300 lg:grid-cols-12 lg:gap-10',
                !catActive && 'opacity-30',
              )}
            >
              <div className="lg:col-span-5">
                <p className="ez-num ez-kicker text-ink-400">{String(idx + 1).padStart(2, '0')}</p>
                <h2 className="mt-2 text-[1.7rem] leading-tight sm:text-[2rem]">{c.name}</h2>
                <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-brand-700">{c.note}</p>
              </div>
              <ul className="flex flex-wrap content-start gap-2 lg:col-span-7">
                {c.industries.map((i) => {
                  const on = hits?.has(i)
                  return (
                    <li
                      key={i}
                      className={cn(
                        'rounded-full px-3.5 py-1.5 text-[0.88rem] font-medium transition-colors duration-200',
                        on ? 'bg-brand-600 text-white' : 'bg-white text-ink-700 ring-1 ring-ink-900/[0.08]',
                      )}
                    >
                      {i}
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
