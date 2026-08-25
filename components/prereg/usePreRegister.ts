'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useMounted } from '@/components/forms/HiddenTracking'

/* ============================================================================
 * All the pre-registration state in one place, so the pieces that render it
 * stay presentational.
 *
 * THE RULE THIS ENCODES: the automatic appearance must never block the page.
 *
 * The first version auto-opened the full panel behind a backdrop, which is
 * the pattern everyone hates — you are three paragraphs into a section and
 * the site takes the page away from you. So there are now two distinct
 * states:
 *
 *   teaser  — appears on its own, no backdrop, page stays fully interactive
 *   panel   — opens ONLY on a deliberate click, and may block
 *
 * Nothing automatic ever reaches the second state.
 * ========================================================================= */

const KEY_DISMISSED = 'ezer_prereg_dismissed'   // never auto-show again
const KEY_DONE      = 'ezer_prereg_submitted'   // they registered; stand down

const AUTO_AFTER_MS = 30_000
const AUTO_AFTER_SCROLL = 0.3

/* Pages where the offer would be tone-deaf: someone mid-conversion, or who
 * has just converted. The panel's own form lands on /thank-you. */
const SUPPRESSED = new Set(['/thank-you', '/book-a-demo'])

function read(key: string) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    /* Private mode with storage blocked. Never let this throw — a storage
     * failure must not take the page down with it. */
    return false
  }
}
function write(key: string) {
  try {
    localStorage.setItem(key, '1')
  } catch {
    /* Same. Worst case the teaser appears again next visit. */
  }
}

export type PreRegisterState = ReturnType<typeof usePreRegister>

export function usePreRegister() {
  const mounted = useMounted()
  const pathname = usePathname()
  const suppressed = SUPPRESSED.has(pathname)

  const [teaserOpen, setTeaserOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  /* Once true, nothing auto-appears again for the rest of the session. */
  const settled = useRef(false)

  /* ── The automatic appearance ─────────────────────────────────────────
   * Deliberately not on arrival. It waits for a signal that someone is
   * actually reading — a third of the way down, or half a minute in. */
  useEffect(() => {
    if (!mounted || suppressed || settled.current) return
    if (read(KEY_DISMISSED) || read(KEY_DONE)) return

    let fired = false
    const fire = () => {
      if (fired) return
      fired = true
      settled.current = true
      setTeaserOpen(true)
    }

    const timer = window.setTimeout(fire, AUTO_AFTER_MS)

    /* Scroll depth, WITHOUT measuring the document on every event.
     *
     * This used to read documentElement.scrollHeight inside the handler.
     * Reading scrollHeight forces a synchronous layout, and scroll fires many
     * times a second — so every scroll on a 12,000px page triggered a full
     * relayout, which is exactly the "site feels laggy" symptom.
     *
     * Now the threshold is computed ONCE as a pixel offset, and the handler
     * only compares window.scrollY against it — a cached number, no layout.
     * It is recomputed on resize, which is the only thing that can move it. */
    let threshold = 0
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      threshold = max > 0 ? max * AUTO_AFTER_SCROLL : Number.POSITIVE_INFINITY
    }
    measure()

    /* Coalesce to one check per frame. Scroll can fire far more often than
     * the browser paints, and there is no value in answering the same
     * question twice within a frame. */
    let queued = false
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        if (window.scrollY > threshold) fire()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [mounted, suppressed])

  /* ── Actions ──────────────────────────────────────────────────────────── */

  /** Teaser → panel. The only route to a blocking surface. */
  const expand = useCallback(() => {
    setTeaserOpen(false)
    setPanelOpen(true)
  }, [])

  /** Dismiss the teaser. Remembered, so it never auto-appears again. */
  const dismissTeaser = useCallback(() => {
    settled.current = true
    setTeaserOpen(false)
    write(KEY_DISMISSED)
  }, [])

  /** Close the panel. Does NOT mark dismissed — closing a thing you opened
   *  on purpose is not the same as rejecting the offer. */
  const closePanel = useCallback(() => setPanelOpen(false), [])

  /** Open from the always-present tab. */
  const openPanel = useCallback(() => {
    settled.current = true
    setTeaserOpen(false)
    setPanelOpen(true)
  }, [])

  /** They registered — stand down permanently. */
  const markSubmitted = useCallback(() => {
    settled.current = true
    setPanelOpen(false)
    setTeaserOpen(false)
    write(KEY_DONE)
  }, [])

  return {
    ready: mounted && !suppressed,
    teaserOpen,
    panelOpen,
    expand,
    dismissTeaser,
    closePanel,
    openPanel,
    markSubmitted,
  }
}
