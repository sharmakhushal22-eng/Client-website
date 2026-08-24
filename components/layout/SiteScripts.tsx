'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/utm'

/* Two jobs, both of which must happen once per page load and neither of which
 * justifies its own component:
 *
 *  1. Capture UTM/referrer on first landing (spec §5.2). Must run before the
 *     visitor navigates away from the tagged URL.
 *  2. Arm the scroll-reveal animation. The [data-reveal] elements start
 *     VISIBLE in CSS; setting data-reveal-ready is what opts them into being
 *     hidden-then-revealed. Doing it this way round means the content is
 *     never invisible to a crawler or to a visitor with JS disabled. */
export function SiteScripts() {
  useEffect(() => {
    captureAttribution()

    const els = document.querySelectorAll('[data-reveal]')
    if (els.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    document.documentElement.setAttribute('data-reveal-ready', '')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', '')
            io.unobserve(entry.target)
          }
        }
      },
      /* Positive bottom margin, not negative. The original -10% held the
       * reveal back until an element was already well inside the viewport, so
       * anyone scrolling at a normal speed met a band of empty page ahead of
       * the content. Extending the root box 20% BELOW the fold starts the
       * fade before the element arrives, and it is settled by the time it is
       * actually being read. */
      { rootMargin: '0px 0px 20% 0px', threshold: 0.01 },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
