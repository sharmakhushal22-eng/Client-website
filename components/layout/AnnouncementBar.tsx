'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { announcement } from '@/content/home'

/* ============================================================================
 * The strip above the header.
 *
 * It carries the compliance-deadline message, which is the one claim on this
 * site that is only true this year — the Labour Codes came into effect and a
 * Income-tax Act, 2025 replaced the 1961 one. A bar that scrolls away should
 * carry the thing with a shelf life, and nothing else here has one.
 *
 * It used to carry the coffee pricing hook. That moved out rather than being
 * lost: pre-registration keeps its own edge tab, pill and teaser, so it has
 * three persistent entry points without this strip.
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

/* Rendered on the SERVER, always, and hidden before first paint for anyone
 * who has dismissed it.
 *
 * It used to render nothing until hydration and then appear, which pushed
 * the whole page down by the bar's height a second or two after it had
 * painted: measured as most of the home page's layout shift (CLS 0.15 at
 * baseline). The visibility decision now happens in ANNOUNCE_GATE, a
 * one-line script that runs inline before the bar is parsed and sets
 * html[data-announce-dismissed]; CSS hides the bar from that attribute. A
 * returning visitor who closed it never sees it, a new one sees it in the
 * first frame, and nothing moves either way. */
export const ANNOUNCE_GATE = `try{if(localStorage.getItem('${KEY}')==='1')document.documentElement.setAttribute('data-announce-dismissed','')}catch(e){}`

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)

  const dismiss = useCallback(() => {
    setDismissed(true)
    document.documentElement.setAttribute('data-announce-dismissed', '')
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* Storage blocked — it simply shows again next visit. */
    }
  }, [])

  if (dismissed) return null

  return (
    <div className="ez-announce relative bg-navy text-white">
      <div className="mx-auto flex max-w-content items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 pr-12 sm:px-6 lg:px-8">
        <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center text-[0.8rem] leading-snug">
          <span className="hidden rounded-full bg-marigold px-2 py-0.5 text-[0.66rem] font-bold uppercase tracking-[0.08em] text-navy sm:inline">
            2026
          </span>
          <span className="hidden font-medium text-white/90 sm:inline">{announcement.text}</span>
          <span className="font-medium text-white/90 sm:hidden">{announcement.short}</span>

          {/* The action is the point of the bar. Without it this is just a
              claim nobody can act on. */}
          <Link
            href={announcement.ctaHref}
            className="group inline-flex items-center gap-1 rounded-sm font-semibold text-white underline decoration-white/40 underline-offset-[3px] transition-colors hover:decoration-white"
          >
            {announcement.ctaLabel}
            <Icon
              name="arrow-right"
              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </p>
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 sm:right-3 place-items-center rounded-md text-white/70 transition-colors hover:bg-white/15 hover:text-white"
      >
        <Icon name="close" className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
