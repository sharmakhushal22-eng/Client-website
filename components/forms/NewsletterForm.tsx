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
      <p className="flex items-start gap-2 text-sm text-ink-200">
        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
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
          className="min-w-0 flex-1 rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white ring-1 ring-inset ring-white/20 placeholder:text-ink-400 focus:ring-2 focus:ring-brand-400"
        />
        <button
          type="submit"
          disabled={pending || !mounted}
          className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Subscribe'}
        </button>
      </div>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-300">
          {state.message}
        </p>
      )}
    </form>
  )
}
