/* ============================================================================
 * Attribution capture — spec §5.2.
 *
 * "UTM and referrer captured as hidden fields — without this you cannot tell
 * which channel works."
 *
 * The subtlety: a visitor usually lands on a UTM-tagged URL and then browses
 * for a while before submitting a form, by which point the query string is
 * long gone. So we capture on FIRST landing, persist for the session, and
 * read it back at submit time. First-touch is kept deliberately — it answers
 * "which campaign brought this lead", which is the question you are buying
 * ads to answer.
 * ========================================================================= */

export const UTM_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid',
] as const

export type Attribution = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid?: string
  fbclid?: string
  referrer?: string
  landing_page?: string
}

const STORAGE_KEY = 'ezer_attribution'

/** Call once on first load. Safe to call repeatedly — it will not overwrite
 *  an existing first-touch record with a later, untagged page view. */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return

  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return

    const params = new URLSearchParams(window.location.search)
    const attribution: Attribution = {}

    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) attribution[key] = value.slice(0, 200)
    }

    /* An empty referrer means direct traffic or a stripped referrer policy;
     * a same-origin referrer is an internal navigation and tells us nothing. */
    const ref = document.referrer
    if (ref && !ref.startsWith(window.location.origin)) {
      attribution.referrer = ref.slice(0, 500)
    }

    attribution.landing_page = window.location.pathname.slice(0, 500)

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    /* sessionStorage throws in Safari private mode and when storage is full.
     * Losing attribution is not a reason to break the page. */
  }
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : {}
  } catch {
    return {}
  }
}

/** Server-side extraction from the submitted hidden fields. */
export function attributionFromFormData(form: FormData): Attribution {
  const out: Attribution = {}
  for (const key of UTM_KEYS) {
    const v = form.get(key)
    if (typeof v === 'string' && v) out[key] = v.slice(0, 200)
  }
  const ref = form.get('referrer')
  if (typeof ref === 'string' && ref) out.referrer = ref.slice(0, 500)
  const landing = form.get('landing_page')
  if (typeof landing === 'string' && landing) out.landing_page = landing.slice(0, 500)
  return out
}
