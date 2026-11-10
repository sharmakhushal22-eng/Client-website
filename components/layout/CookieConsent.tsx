'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { analytics } from '@/site.config'

/* ============================================================================
 * Cookie consent — spec §8.7.
 *
 * "Cookie consent banner that actually gates non-essential scripts before
 * they load." The emphasis is the spec's, and it is the part most banners get
 * wrong: they fire GA on page load and then ask permission afterwards, which
 * is decorative rather than functional.
 *
 * Here nothing analytics-related is injected until a choice is recorded. The
 * script tags are created in JS, on accept — there is no <Script> tag sitting
 * in the tree waiting to be enabled.
 * ========================================================================= */

const STORAGE_KEY = 'ezer_cookie_consent'
type Choice = 'accepted' | 'rejected'

function loadAnalytics() {
  if (analytics.ga4Id) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.ga4Id}`
    document.head.appendChild(s)

    const inline = document.createElement('script')
    inline.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${analytics.ga4Id}', { anonymize_ip: true });
    `
    document.head.appendChild(inline)
  }

  if (analytics.clarityId) {
    const s = document.createElement('script')
    s.textContent = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window,document,"clarity","script","${analytics.clarityId}");
    `
    document.head.appendChild(s)
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      /* Storage blocked. Treat as "not yet decided" and show the banner —
       * never as implicit consent. */
    }

    if (stored === 'accepted') {
      loadAnalytics()
      return
    }
    if (stored === 'rejected') return

    /* Deliberately delayed. Showing the banner in the same frame as the hero
     * makes it part of the Largest Contentful Paint measurement and pushes
     * the layout around while the page is still settling (§8.3, CLS < 0.1). */
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const decide = (choice: Choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      /* If we cannot remember the choice we will ask again next visit, which
       * is the safe failure. */
    }
    if (choice === 'accepted') loadAnalytics()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="ez-toast fixed inset-x-3 bottom-3 z-[60] rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgb(11_22_51/0.06),0_30px_60px_-24px_rgb(11_22_51/0.35)] ring-1 ring-ink-900/[0.08] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[23rem]"
    >
      <p className="text-[0.84rem] leading-relaxed text-ink-600">
        We use essential cookies to make this site work. With your permission we
        would also like to use analytics cookies to understand which pages are
        useful. Nothing non-essential loads until you choose.{' '}
        <Link href="/cookie-policy" className="font-semibold text-brand-700 underline">
          Cookie policy
        </Link>
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => decide('accepted')}
          className="ez-press flex-1 rounded-full bg-ink-900 px-4 py-2.5 text-[0.84rem] font-semibold text-white hover:bg-brand-700"
        >
          Allow analytics
        </button>
        <button
          type="button"
          onClick={() => decide('rejected')}
          className="ez-press flex-1 rounded-full px-4 py-2.5 text-[0.84rem] font-semibold text-ink-900 ring-1 ring-inset ring-ink-900/15 hover:bg-ink-50"
        >
          Essential only
        </button>
      </div>
    </div>
  )
}
