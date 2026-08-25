'use client'

import { useSyncExternalStore } from 'react'
import { useMounted } from '@/components/forms/HiddenTracking'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/* ============================================================================
 * Light / dark / follow-the-system.
 *
 * Deliberately the SAME contract as the product: the choice is written to
 * `data-ez-theme` on <html> under the key `ezer_theme`. A visitor who picks
 * dark here and then logs into the app meets the setting they already made,
 * which is the entire argument this site is making about the two properties
 * being one company.
 *
 * Three states, not two. "Follow the OS" is a real preference, and a two-way
 * switch silently overrides it — someone on automatic day/night gets pinned
 * to whichever half they last tapped.
 * ========================================================================= */

const KEY = 'ezer_theme'
export type ThemeChoice = 'light' | 'dark' | 'system'

/* Runs from <head> BEFORE React hydrates. Without it the page paints light
 * and then corrects itself once JS runs — a white flash on every load for
 * anyone using dark. Inlined as a string precisely so it can run that early. */
export const themeBootScript = `
(function(){try{
  var c = localStorage.getItem('${KEY}');
  if (c === 'light' || c === 'dark') document.documentElement.setAttribute('data-ez-theme', c);
}catch(e){}})();`

/* One shared subscriber list, so every toggle on the page agrees. */
const listeners = new Set<() => void>()
function subscribeTheme(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function emit() {
  listeners.forEach((l) => l())
}
function clientChoice(): ThemeChoice {
  const v = document.documentElement.getAttribute('data-ez-theme')
  return v === 'light' || v === 'dark' ? v : 'system'
}

const OPTIONS: { value: ThemeChoice; label: string; icon: 'sparkle' | 'clock' | 'settings' }[] = [
  { value: 'light', label: 'Light', icon: 'sparkle' },
  { value: 'dark', label: 'Dark', icon: 'clock' },
  { value: 'system', label: 'System', icon: 'settings' },
]

function apply(choice: ThemeChoice) {
  const root = document.documentElement
  if (choice === 'system') root.removeAttribute('data-ez-theme')
  else root.setAttribute('data-ez-theme', choice)
  try {
    if (choice === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, choice)
  } catch {
    /* Storage blocked — the choice still applies for this page view. */
  }
  emit()
}

export function ThemeToggle({ className }: { className?: string }) {
  /* Subscribed rather than read-into-state in an effect.
   *
   * The stored choice is external state that lives on <html> and in
   * localStorage, so useSyncExternalStore is the right instrument: it gives
   * the server a stable 'system' snapshot and the client the real value on
   * the first client render, with no setState-in-effect and no extra pass. */
  const choice = useSyncExternalStore(subscribeTheme, clientChoice, () => 'system' as ThemeChoice)
  const mounted = useMounted()

  function pick(next: ThemeChoice) {

    /* A view transition cross-fades two bitmaps on the compositor, so the cost
     * does not scale with how much of the page changed — which for a full
     * repaint is the difference between a dissolve and a stutter. */
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => {
        finished: Promise<void>
        ready: Promise<void>
      }
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!doc.startViewTransition || reduced) {
      apply(next)
      return
    }

    /* startViewTransition rejects if one is already running — tap the toggle
     * twice quickly and the second call throws InvalidStateError. Both of its
     * promises must be caught, or an aborted transition surfaces as an
     * unhandled rejection in the console and, in dev, as an error overlay.
     *
     * The theme itself is applied by the callback either way, so a rejected
     * transition costs the animation and nothing else. */
    try {
      const transition = doc.startViewTransition(() => apply(next))
      transition.finished.catch(() => {})
      transition.ready.catch(() => {})
    } catch {
      apply(next)
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md bg-ink-100 p-0.5',
        className,
      )}
    >
      {OPTIONS.map((o) => {
        /* Before mount nothing is marked selected, so the server and client
         * agree. It flickers for one frame at most and never mismatches. */
        const selected = mounted && choice === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            title={`${o.label} theme`}
            onClick={() => pick(o.value)}
            className={cn(
              'grid h-7 w-7 place-items-center rounded transition-colors',
              selected
                ? 'bg-surface text-brand-700 shadow-flat'
                : 'text-ink-600 hover:text-ink-900',
            )}
          >
            <Icon name={o.icon} className="h-3.5 w-3.5" />
            <span className="sr-only">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
