'use client'

import { Icon } from '@/components/ui/Icon'
import { prereg } from './content'

/* ============================================================================
 * The teaser — the ONLY thing that appears on its own.
 *
 * Critically: no backdrop, no focus steal, no scroll lock. It slides into a
 * corner and the page carries on working around it. Someone reading a section
 * can keep reading, click a link, or scroll past it without dealing with it
 * first.
 *
 * That is the whole design constraint. An interstitial that interrupts
 * reading converts worse than it looks like it should, and on a B2B site it
 * mostly teaches people to hunt for the close button.
 * ========================================================================= */
export function PreRegisterTeaser({
  open,
  onExpand,
  onDismiss,
}: {
  open: boolean
  onExpand: () => void
  onDismiss: () => void
}) {
  return (
    <div
      /* aria-hidden while closed so it is not reachable by a screen reader
         before it exists visually. */
      aria-hidden={!open}
      className={`fixed bottom-5 left-5 z-40 w-[min(21rem,calc(100vw-2.5rem))] transition-all duration-500 ease-out ${
        open
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_1px_2px_rgb(11_22_51/0.06),0_30px_60px_-24px_rgb(11_22_51/0.35)] ring-1 ring-ink-900/[0.08]">
        {/* A thin brand rule instead of a filled header — this is a nudge,
            not an announcement, and it should sit quietly next to the page. */}

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="ez-kicker inline-flex items-center gap-2 text-[#8a5a00]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-marigold" />
              {prereg.eyebrow}
            </span>

            <button
              type="button"
              onClick={onDismiss}
              tabIndex={open ? 0 : -1}
              aria-label="Dismiss, do not show this again"
              className="-mr-3 -mt-2.5 grid h-10 w-10 shrink-0 place-items-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
            >
              <Icon name="close" className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-3 font-display text-[1.05rem] font-[650] leading-snug tracking-[-0.02em] text-ink-900 [font-stretch:104%]">
            {prereg.teaserTitle}
          </p>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-600">
            {prereg.teaserLine}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onExpand}
              tabIndex={open ? 0 : -1}
              className="ez-press inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-2.5 text-[0.82rem] font-semibold text-on-accent hover:bg-brand-700"
            >
              See the terms
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onDismiss}
              tabIndex={open ? 0 : -1}
              className="ez-press rounded-full px-3.5 py-2.5 text-[0.82rem] font-semibold text-ink-600 hover:bg-ink-50 hover:text-ink-900"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
