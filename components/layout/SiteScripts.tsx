'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { captureAttribution } from '@/lib/utm'

/* ============================================================================
 * Attribution capture, and the scroll-reveal animation.
 *
 * The [data-reveal] elements start VISIBLE in CSS; setting data-reveal-ready
 * on <html> is what opts them into being hidden-then-revealed. That way round
 * means the content is never invisible to a crawler, or to a visitor whose JS
 * failed.
 * ========================================================================= */
export function SiteScripts() {
  /* Capture UTM/referrer once, on first landing, before the visitor navigates
   * away from the tagged URL. Deliberately NOT re-run per route. */
  useEffect(() => {
    captureAttribution()
  }, [])

  /* ── The reveal observer ──────────────────────────────────────────────
   *
   * Keyed on pathname, and that is load-bearing rather than tidiness.
   *
   * This effect used to run once with an empty dependency array. It queried
   * [data-reveal] at mount and observed exactly those nodes. On a client-side
   * navigation the App Router swaps the page contents WITHOUT remounting this
   * component, so every element on the new page was unobserved — while
   * data-reveal-ready stayed on <html>, holding all of them at opacity 0.
   *
   * The result: any page reached by clicking a link rendered blank. Not
   * briefly — permanently, because nothing was ever going to mark them
   * revealed. A hard reload looked fine, which is exactly why it survived so
   * long: it only reproduced when you navigated the way a real visitor does.
   *
   * Re-running per route re-queries and re-observes the new page's nodes.
   */
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const all = () =>
      document.querySelectorAll<HTMLElement>(
        '[data-reveal]:not([data-revealed]):not([data-revealed-now])',
      )

    const els = all()
    if (els.length === 0) return

    document.documentElement.setAttribute('data-reveal-ready', '')

    /* Animate only what the reader is positioned to see. Anything already
     * level with or above the fold is snapped: it either was never going to
     * be watched arriving, or it is off-screen, where a transition can be
     * stranded at its start value with no frame to finish in. */
    const inPlayableRange = (el: Element) => {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < window.innerHeight * 1.5
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute(
            inPlayableRange(entry.target) ? 'data-revealed' : 'data-revealed-now',
            '',
          )
          io.unobserve(entry.target)
        }
      },
      /* Positive bottom margin, not negative. A negative one holds the reveal
       * back until an element is already well inside the viewport, so anyone
       * scrolling at a normal speed meets a band of empty page ahead of the
       * content. */
      { rootMargin: '0px 0px 20% 0px', threshold: 0.01 },
    )

    els.forEach((el) => {
      /* Above the fold on arrival — show it now rather than fading in
       * content the reader is already looking at. */
      if (el.getBoundingClientRect().bottom <= 0) {
        el.setAttribute('data-revealed-now', '')
      } else {
        io.observe(el)
      }
    })

    /* The hard failsafe, and the reason the whole thing is now safe to keep.
     *
     * IntersectionObserver only fires for elements the viewport reaches. Any
     * gap — a route change landing mid-page, a fast scroll past a callback, a
     * layout shift — used to mean an element stayed at opacity 0 with nothing
     * left to trigger it. A missed fade is a rounding error; an invisible
     * section is a broken page, so after a short window everything still
     * hidden is simply shown. */
    const failsafe = window.setTimeout(() => {
      all().forEach((el) => el.setAttribute('data-revealed-now', ''))
    }, 1500)

    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [pathname])

  return null
}
