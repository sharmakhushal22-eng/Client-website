'use client'

import { useEffect, useLayoutEffect } from 'react'
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

  /* ── The motion primitives ([data-m]) ─────────────────────────────────
   *
   * Same contract as the reveal above, for the redesign's five primitives
   * (rise, mask, wipe, settle, rule — styled in app/(site)/site.css):
   * visible until this runs, anything already on screen is shown without
   * animating, everything below the fold animates once as it arrives, and a
   * failsafe shows whatever is still hidden.
   *
   * A LAYOUT effect, so the on-screen check and the opt-in happen before the
   * browser paints. After a client navigation data-m-ready is already on
   * <html>; as a passive effect, the new page's visible blocks would paint
   * hidden for a frame and then pop in.
   *
   * One observer per page, unobserving as it goes, so the cost after the
   * last reveal is zero. */
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const pending = () =>
      document.querySelectorAll<HTMLElement>('[data-m]:not([data-in]):not([data-in-now])')

    const els = pending()
    if (els.length === 0) return

    /* Decide what is on screen BEFORE opting the page into hidden start
     * states, so nothing the reader can already see blinks out and back. */
    const vh = window.innerHeight
    const visibleNow: HTMLElement[] = []
    const later: HTMLElement[] = []
    els.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < vh * 0.92 && r.bottom > 0) visibleNow.push(el)
      else if (r.bottom <= 0) visibleNow.push(el)
      else later.push(el)
    })
    visibleNow.forEach((el) => el.setAttribute('data-in-now', ''))
    document.documentElement.setAttribute('data-m-ready', '')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-in', '')
          io.unobserve(entry.target)
        }
      },
      /* Fires a little before the element is fully in, so the motion is
       * already under way when the reader's eye arrives. */
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    later.forEach((el) => io.observe(el))

    /* Longer than the reveal failsafe: these sit further down long pages,
     * and only a reader who never scrolls is waiting on it. */
    const failsafe = window.setTimeout(() => {
      pending().forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top > window.innerHeight * 1.5) return
        el.setAttribute('data-in-now', '')
      })
    }, 4000)

    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [pathname])

  /* ── Live graphics ([data-live]) ──────────────────────────────────────
   *
   * Orbits, pulses and live charts loop, so they must only run while they
   * can be seen. One observer marks each [data-live] block data-playing
   * while it is on screen (with a margin, so it is already moving when it
   * arrives) and removes the mark when it leaves; the CSS pauses every
   * animation inside a block without it. Reduced motion stops them in CSS,
   * so nothing to do here for that case. */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-live]')
    if (els.length === 0) return
    document.documentElement.setAttribute('data-live-ready', '')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.setAttribute('data-playing', '')
          else e.target.removeAttribute('data-playing')
        }
      },
      { rootMargin: '15% 0px 15% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
