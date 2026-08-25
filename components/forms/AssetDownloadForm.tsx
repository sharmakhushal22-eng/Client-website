'use client'

import { useActionState } from 'react'
import { requestAssetDownload, type DownloadState } from '@/app/actions/downloads'
import { TextField } from './Field'
import { HiddenTracking, useMounted } from './HiddenTracking'
import { SubmitButton } from './SubmitButton'
import { Icon } from '@/components/ui/Icon'

const initial: DownloadState = { status: 'idle' }

/* ============================================================================
 * The gate on a downloadable asset.
 *
 * Two fields, not the full enquiry form. The exchange has to feel proportional
 * — asking for headcount, states and current system in return for a PDF reads
 * as a bait-and-switch, and people either abandon or type nonsense, which
 * poisons the leads table either way.
 *
 * On success the file is revealed rather than auto-downloaded. A download that
 * starts on its own is indistinguishable from a drive-by, and on a work laptop
 * it often lands somewhere the person never finds.
 * ========================================================================= */
export function AssetDownloadForm({
  slug,
  cta = 'Send me the handbook',
}: {
  slug: string
  cta?: string
}) {
  const [state, action, pending] = useActionState(requestAssetDownload, initial)
  const mounted = useMounted()

  /* Derived, not stored. useActionState holds the result until the next
   * submit, so mirroring it into local state via an effect would add a render
   * pass and a second source of truth for no gain. */
  const href = state.status === 'success' ? state.href : null

  if (href) {
    return (
      <div className="rounded-lg bg-emerald-50 p-6 text-center ring-1 ring-emerald-100">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-emerald-600 text-white">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-base font-bold text-emerald-900">
          Your copy is ready
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-emerald-900/80">
          75 policies across 12 categories, with the recommended rollout order.
        </p>
        <a
          href={href}
          download
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          <Icon name="download" className="h-4 w-4" />
          Download the PDF
        </a>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="asset_slug" value={slug} />
      <HiddenTracking formName={`download-${slug}`} />

      {/* Uncontrolled, matching every other form here: the server is the
          validator, and TextField renders whatever it sends back. Duplicating
          the rules on the client would mean two places to keep in step. */}
      <TextField
        name="work_email"
        label="Work email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@company.com"
      />

      <TextField
        name="company_name"
        label="Company name"
        required
        autoComplete="organization"
        placeholder="Your company"
      />

      {state.status === 'error' && state.message && (
        <p role="alert" className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          {state.message}
        </p>
      )}

      <SubmitButton pending={pending} disabled={!mounted} className="w-full">
        {cta}
      </SubmitButton>

      <p className="text-xs leading-relaxed text-ink-600">
        We will email you the handbook and, occasionally, something else worth
        reading about Indian payroll compliance. Unsubscribe in one click.
      </p>
    </form>
  )
}
