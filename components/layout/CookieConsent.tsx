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
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl bg-white p-5 shadow-2xl shadow-ink-900/20 ring-1 ring-ink-200 sm:inset-x-6 sm:bottom-6"
    >
      <p className="text-sm leading-relaxed text-ink-600">
        We use essential cookies to make this site work. With your permission we
        would also like to use analytics cookies to understand which pages are
        useful. Nothing non-essential loads until you choose.{' '}
        <Link href="/cookie-policy" className="font-semibold text-brand-700 underline">
          Cookie policy
        </Link>
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => decide('accepted')}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Accept analytics cookies
        </button>
        <button
          type="button"
          onClick={() => decide('rejected')}
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-100"
        >
          Essential only
        </button>
      </div>
    </div>
  )
}
