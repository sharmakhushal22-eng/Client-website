'use client'

import { useCallback, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useMounted } from '@/components/forms/HiddenTracking'
import { coffee } from '@/content/coffee'

/* ============================================================================
 * The strip above the header.
 *
 * It carries the coffee framing, which is the only thing on the site that
 * gives a price signal while the figure itself stays unpublished. That is
 * what earns it the most valuable strip of the page.
 *
 * Two things it deliberately does NOT do:
 *
 *   · It does not stick. The header is sticky; this scrolls away with the
 *     rest of the page. A permanently pinned promo eats vertical space on
 *     every screen and starts reading as furniture within about ten seconds.
 *
 *   · It does not come back once closed. Dismissal is remembered, in the same
 *     spirit as the pre-registration teaser — this site asks once.
 * ========================================================================= */

const KEY = 'ezer_announce_dismissed'

export function AnnouncementBar({ onOpenPreRegister }: { onOpenPreRegister?: () => void }) {
  const mounted = useMounted()
  const [dismissed, setDismissed] = useState(false)

  const alreadyDismissed = (() => {
    if (!mounted) return true
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })()

  const dismiss = useCallback(() => {
    setDismissed(true)
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* Storage blocked — it simply shows again next visit. */
    }
  }, [])

  if (!mounted || dismissed || alreadyDismissed) return null

  return (
    <div className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 text-white">
      <div className="mx-auto flex max-w-content items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 pr-12 sm:px-6 lg:px-8">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[0.8rem] leading-snug">
          <span aria-hidden="true" className="text-sm">
            ☕
          </span>
          <span className="font-bold">{coffee.bar}</span>

          {/* The action is the point of the bar. Without it this is just a
              claim nobody can act on. */}
          {onOpenPreRegister && (
            <button
              type="button"
              onClick={onOpenPreRegister}
              className="group inline-flex items-center gap-1 rounded-sm font-bold text-white underline decoration-white/50 underline-offset-2 transition-colors hover:decoration-white"
            >
              {coffee.barCta}
              <Icon
                name="arrow-right"
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
              />
            </button>
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-white/70 transition-colors hover:bg-white/15 hover:text-white"
      >
        <Icon name="close" className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
