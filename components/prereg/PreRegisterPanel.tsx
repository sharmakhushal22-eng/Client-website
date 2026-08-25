'use client'

import { useEffect, useRef } from 'react'
import { ShortLeadForm } from '@/components/forms/ShortLeadForm'
import { Icon } from '@/components/ui/Icon'
import { prereg } from './content'

/* ============================================================================
 * The full offer. Reached ONLY by a deliberate click — from the teaser, the
 * edge tab, or the mobile pill. Nothing automatic opens this.
 *
 * Because the visitor asked for it, it is allowed to take the foreground:
 * backdrop, focus move, Esc to close. That trade is only acceptable when they
 * initiated it, which is the entire reason the teaser exists separately.
 * ========================================================================= */
export function PreRegisterPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  /* Esc closes; focus moves in on open and is trapped inside while it is up. */
  useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([type="hidden"]):not([tabindex="-1"]), select, textarea',
            ),
          ).filter((el) => !el.closest('[aria-hidden="true"]'))
        : []

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      /* Keep Tab inside the dialog — otherwise focus wanders onto the page
       * behind the backdrop, where it cannot be seen. */
      const f = focusables()
      if (f.length === 0) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)

    /* Lock the page behind the panel.
     *
     * This is the one place a scroll lock is correct. The teaser must never
     * lock — it appears uninvited, so it has to leave the page working. The
     * panel is different: the visitor asked for it, it covers the page, and
     * without this a wheel gesture over the backdrop scrolls the content
     * behind it, which reads as the site coming apart.
     *
     * The scrollbar's width is added back as padding, or removing it shifts
     * the whole layout sideways the instant the panel opens. */
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPadding = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    /* Focus the first real field, not the close button that DOM order would
     * give us — and never the honeypot, which is a plain text input kept out
     * of the tab order. Anything typed into that gets the submission
     * rejected as a bot. */
    const target =
      panel?.querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([tabindex="-1"])',
      ) ?? closeRef.current
    target?.focus({ preventScroll: true })

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
    }
  }, [open, onClose])

  return (
    <>
      {/* Backdrop — only ever present because the visitor asked for it. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prereg-title"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-xl bg-white shadow-floating transition-transform duration-300 ease-out sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[27rem] sm:rounded-l-xl sm:rounded-tr-none ${
          open
            ? 'translate-y-0 sm:translate-x-0'
            : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
        }`}
      >
        {/* Header band — the one saturated surface, so the offer reads as
            distinct from the form beneath it. */}
        <div className="relative bg-gradient-to-br from-brand-700 to-brand-600 px-7 pb-7 pt-6 text-white">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md text-white/70 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="Close"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em]">
            <Icon name="sparkle" className="h-3 w-3" />
            {prereg.eyebrow}
          </span>

          <h2 id="prereg-title" className="mt-3.5 text-[1.35rem] font-bold leading-snug text-white">
            {prereg.panelTitle}
          </h2>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-white/90">
            {prereg.panelLead}
          </p>
        </div>

        <div className="p-7">
          <ul className="space-y-3.5">
            {prereg.benefits.map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <Icon name={b.icon} className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.85rem] font-bold text-ink-900">
                    {b.title}
                  </span>
                  <span className="mt-0.5 block text-[0.78rem] leading-relaxed text-ink-600">
                    {b.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-ink-200 pt-6">
            {/* Reuses the site's lead pipeline, so a pre-registration lands in
                the same Supabase table and admin inbox as every other
                enquiry — tagged by form_name so it can be told apart. */}
            <ShortLeadForm formName="pre-registration" cta={prereg.cta} />
          </div>

          {/* The urgency line, given its own surface so it is read rather
              than skimmed past with the small print. */}
          <p className="mt-5 flex items-start gap-2.5 rounded-md bg-amber-50 p-3.5 text-[0.75rem] leading-relaxed text-amber-900 ring-1 ring-amber-200">
            <Icon name="clock" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
            {prereg.urgency}
          </p>

          <p className="mt-4 text-[0.72rem] leading-relaxed text-ink-600">
            {prereg.reassurance}
          </p>

          <p className="mt-4 rounded-md bg-ink-50 p-3.5 text-[0.72rem] leading-relaxed text-ink-600 ring-1 ring-ink-200">
            <strong className="font-bold text-ink-900">Is this for you?</strong>{' '}
            {prereg.fitNote}
          </p>
        </div>
      </div>
    </>
  )
}
