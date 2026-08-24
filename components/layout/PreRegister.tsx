'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ShortLeadForm } from '@/components/forms/ShortLeadForm'
import { useMounted } from '@/components/forms/HiddenTracking'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/* ============================================================================
 * Founding-customer pre-registration — a side tab that opens a panel.
 *
 * Why a side tab rather than a modal: a modal that interrupts reading is the
 * single most disliked pattern in B2B, and it converts worse than it looks
 * like it should. A permanent edge tab is always available, never blocks the
 * page, and the reader opens it when they are ready. It also survives the
 * thing modals do not — a second visit.
 *
 * The offer is deliberately the founding-customer one from the home page
 * rather than a generic "get updates", because that is the only genuinely
 * scarce thing this company has to offer right now.
 *
 * Behaviour:
 *   · The tab is always present once mounted.
 *   · The panel auto-opens ONCE per visitor, after they have shown intent —
 *     scrolled past the fold and stayed a while — never on arrival.
 *   · Dismissal is remembered, so it never auto-opens at them again.
 *   · Esc closes it; focus moves into the panel on open and back to the tab
 *     on close.
 * ========================================================================= */

const STORAGE_KEY = 'ezer_prereg_dismissed'
const AUTO_OPEN_AFTER_MS = 25_000
const AUTO_OPEN_AFTER_SCROLL = 0.28

export function PreRegister() {
  /* The site's existing hook — a useSyncExternalStore snapshot rather than a
   * setState-in-effect, which keeps this out of the cascading-render path. */
  const mounted = useMounted()
  const [open, setOpen] = useState(false)
  const [autoOpened, setAutoOpened] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const tabRef = useRef<HTMLButtonElement>(null)

  /* Pages where asking again would be tone-deaf: someone who has just
   * submitted, or is mid-submission, should not be pitched the same offer.
   * /thank-you especially — the panel's own form lands them there. */
  const pathname = usePathname()
  const suppressed =
    pathname === '/thank-you' || pathname === '/book-a-demo'

  /* Auto-open once, and only for someone who is actually reading. */
  useEffect(() => {
    if (!mounted || suppressed) return
    if (autoOpened) return

    let dismissed = false
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      /* Private browsing with storage disabled — treat as not dismissed, but
         never let a storage error stop the page working. */
    }
    if (dismissed) return

    let fired = false
    const fire = () => {
      if (fired) return
      fired = true
      setAutoOpened(true)
      setOpen(true)
    }

    const timer = window.setTimeout(fire, AUTO_OPEN_AFTER_MS)

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0 && window.scrollY / max > AUTO_OPEN_AFTER_SCROLL) fire()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [mounted, autoOpened, suppressed])

  /* Esc to close, and move focus into the panel when it opens. */
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)

    /* Focus the first REAL field rather than the close button, which is what
     * plain DOM order would give us. This is a form panel — the reader opened
     * it to type, and landing on "close" invites them to do the opposite.
     *
     * The exclusions matter more than they look. The lead form carries a
     * honeypot (`company_website`) that is a plain text input, kept out of the
     * tab order with tabindex="-1" inside an aria-hidden wrapper. Focusing it
     * would put the cursor in a spam trap: anything a real person typed there
     * gets their submission rejected as a bot. */
    const panel = panelRef.current
    const real = (sel: string) =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(sel)).filter(
            (el) => !el.closest('[aria-hidden="true"]'),
          )
        : []

    /* Prefer the first real field over DOM order — the close button sits
     * first in the markup, and landing there is the opposite of the intent. */
    const target =
      real('input:not([type="hidden"]):not([tabindex="-1"])')[0] ??
      real('button, [href]')[0]

    target?.focus({ preventScroll: true })

    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function close() {
    setOpen(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* Storage unavailable — the panel simply may auto-open again later. */
    }
    tabRef.current?.focus({ preventScroll: true })
  }

  if (!mounted || suppressed) return null

  return (
    <>
      {/* ── The edge tab ───────────────────────────────────────────────── */}
      <button
        ref={tabRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="prereg-panel"
        className={cn(
          'group fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 translate-x-0 items-center gap-2 rounded-l-xl bg-brand-600 py-4 pl-3 pr-2.5 text-white shadow-lg shadow-brand-900/20 transition-all hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:flex',
          open && 'pointer-events-none opacity-0',
        )}
      >
        <Icon name="sparkle" className="h-4 w-4 shrink-0" />
        <span
          className="text-xs font-bold uppercase tracking-[0.12em]"
          style={{ writingMode: 'vertical-rl' }}
        >
          Pre-register
        </span>
      </button>

      {/* Mobile: a compact bar above the WhatsApp button rather than a side
          tab, which has nowhere to live on a 360px screen. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-controls="prereg-panel"
        aria-expanded={open}
        className={cn(
          'fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-900/25 lg:hidden',
          open && 'pointer-events-none opacity-0',
        )}
      >
        <Icon name="sparkle" className="h-4 w-4" />
        Pre-register
      </button>

      {/* ── Backdrop ───────────────────────────────────────────────────── */}
      <div
        onClick={close}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* ── The panel ──────────────────────────────────────────────────── */}
      <div
        id="prereg-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prereg-title"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out',
          'sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[26rem] sm:rounded-l-3xl sm:rounded-tr-none',
          open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full',
        )}
      >
        <div className="relative p-7 sm:p-8">
          <button
            type="button"
            onClick={close}
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
            aria-label="Close pre-registration"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-brand-700 ring-1 ring-brand-100">
            <Icon name="sparkle" className="h-3 w-3" />
            Founding customers
          </span>

          <h2 id="prereg-title" className="mt-4 text-[1.4rem] font-bold leading-snug">
            Get in before the price is public
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            We are onboarding a small number of founding customers before
            general launch. Pre-register and you get the things that stop being
            available once we are at scale.
          </p>

          <ul className="mt-5 space-y-2.5 border-y border-ink-200 py-5">
            {[
              'Your rate held for the founding term',
              'Implementation run by the people who built the engine',
              'Your statutory edge cases built because you asked',
              'First look at the labour-code tooling as it ships',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-5">
            {/* Reuses the site's lead pipeline, so a pre-registration lands in
                the same Supabase table and the same admin inbox as every other
                enquiry — tagged by form_name so it can be told apart. */}
            <ShortLeadForm
              formName="pre-registration"
              cta="Pre-register my company"
            />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            No obligation and no credit card. We will call once to understand
            what you run — if it is not a fit, we will say so.
          </p>
        </div>
      </div>
    </>
  )
}
