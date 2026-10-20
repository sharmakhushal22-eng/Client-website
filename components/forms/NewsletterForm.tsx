'use client'

import { useActionState } from 'react'
import { subscribeToNewsletter, type SubscribeState } from '@/app/actions/leads'
import { HiddenTracking, useMounted } from './HiddenTracking'
import { Icon } from '@/components/ui/Icon'

const initial: SubscribeState = { status: 'idle' }

/** Footer newsletter signup — spec §1.2 conversion 5. */
export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeToNewsletter, initial)
  const mounted = useMounted()

  if (state.status === 'success') {
    return (
      <p className="flex items-start gap-2 text-sm text-ink-700">
        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        {state.message}
      </p>
    )
  }

  return (
    <form action={action} className="relative space-y-2">
      {/* Same component the enquiry forms use, so the timestamp, attribution
          and honeypot behave identically here. */}
      <HiddenTracking formName="newsletter-footer" />
      <input type="hidden" name="source" value="footer" readOnly />

      <label htmlFor="newsletter_email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter_email"
          type="email"
          name="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="h-11 min-w-0 flex-1 rounded-full bg-white px-4 text-sm text-ink-900 ring-1 ring-inset ring-ink-900/10 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
        <button
          type="submit"
          disabled={pending || !mounted}
          className="ez-press h-11 shrink-0 rounded-full bg-ink-900 px-5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Subscribe'}
        </button>
      </div>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}
    </form>
  )
}
