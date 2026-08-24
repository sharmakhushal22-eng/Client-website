'use client'

import { useSyncExternalStore } from 'react'
import { captureAttribution, readAttribution, UTM_KEYS, type Attribution } from '@/lib/utm'

/* ============================================================================
 * Hidden fields carrying attribution and the anti-bot timestamp — spec §5.2
 * and §5.3.
 *
 * ── Why this is not an effect ──────────────────────────────────────────────
 *
 * The obvious implementations both fail, and both fail silently:
 *
 *   1. Compute during render. On a statically generated page that yields the
 *      BUILD time — hours or days old — so the 3-second time trap passes for
 *      every bot. Same for a lazy useState initialiser, which also runs during
 *      the prerender.
 *
 *   2. Write to the input from an effect via a ref. The effect does run and
 *      does write — but the input is uncontrolled with defaultValue="", and
 *      React resets it to "" on the very next re-render (which happens as soon
 *      as the parent's mounted flag flips after hydration). The value is gone
 *      before anyone can submit, and nothing warns you: every real submission
 *      then arrives with an empty rendered_at and is rejected as a bot.
 *
 * So the client snapshot is captured once at module evaluation — which happens
 * when the page's JS loads, i.e. the moment the visitor actually got the form —
 * and surfaced through useSyncExternalStore. React then RENDERS the values, so
 * nothing can clobber them, and no effect or setState is involved.
 * ========================================================================= */

type Snapshot = { renderedAt: number; attribution: Attribution }

const SERVER_SNAPSHOT: Snapshot = { renderedAt: 0, attribution: {} }

let clientSnapshot: Snapshot | null = null

/** Must return a STABLE reference — useSyncExternalStore re-renders forever if
 *  getSnapshot returns a new object each call. */
function getClientSnapshot(): Snapshot {
  if (clientSnapshot === null) {
    /* Idempotent: it will not overwrite a first-touch record already stored,
     * so calling it here as well as in SiteScripts is safe. Calling it here
     * matters because SiteScripts sits later in the tree and its effect can
     * run after this form has already read storage. */
    captureAttribution()
    clientSnapshot = { renderedAt: Date.now(), attribution: readAttribution() }
  }
  return clientSnapshot
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT
}

/* No external store to subscribe to — the value never changes after load. */
const subscribe = () => () => {}

export function HiddenTracking({ formName }: { formName: string }) {
  const { renderedAt, attribution } = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )

  return (
    <>
      <input type="hidden" name="form_name" value={formName} readOnly />
      <input
        type="hidden"
        name="rendered_at"
        value={renderedAt || ''}
        readOnly
      />

      {UTM_KEYS.map((key) => (
        <input key={key} type="hidden" name={key} value={attribution[key] ?? ''} readOnly />
      ))}
      <input type="hidden" name="referrer" value={attribution.referrer ?? ''} readOnly />
      <input
        type="hidden"
        name="landing_page"
        value={attribution.landing_page ?? ''}
        readOnly
      />

      {/* Honeypot. Positioned off-screen rather than display:none — some bots
          skip fields that are display:none but fill anything they can read.
          aria-hidden and tabIndex keep it away from real users entirely. */}
      <div
        className="pointer-events-none absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={`hp-${formName}`}>Company website</label>
        <input
          id={`hp-${formName}`}
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
    </>
  )
}

/** True once the client snapshot is available, i.e. rendered_at is populated.
 *  The submit button stays disabled until then, because a submit carrying an
 *  empty rendered_at is rejected as a bot. */
export function useMounted(): boolean {
  const { renderedAt } = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )
  return renderedAt > 0
}
