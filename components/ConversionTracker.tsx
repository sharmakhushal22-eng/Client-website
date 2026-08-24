'use client'

import { useEffect } from 'react'

/* ============================================================================
 * Conversion tracking — spec §4.7 ("Conversion tracking fires here") and §6
 * ("Fire only after cookie consent").
 *
 * Those two requirements together are the whole design: this pushes the event
 * onto the dataLayer and calls gtag only if the tag is ALREADY on the page —
 * and the tag is only on the page if the visitor accepted analytics cookies
 * (see CookieConsent). It never loads a script itself. A visitor who declined
 * converts silently, which is the correct outcome, not a bug to work around.
 * ========================================================================= */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function ConversionTracker({ source }: { source: string }) {
  useEffect(() => {
    /* dataLayer may exist without a tag having loaded, which is harmless —
     * the events queue and are discarded. */
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push({ event: 'generate_lead', lead_source: source })

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'enquiry',
        event_label: source,
      })
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: source })
    }
  }, [source])

  return null
}
