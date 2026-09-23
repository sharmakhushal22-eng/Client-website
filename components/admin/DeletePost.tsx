'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { deletePost, type DeleteState } from '@/app/admin/posts/actions'

/* ============================================================================
 * Delete a post — armed, then fired.
 *
 * The first click only ARMS it. That is not ceremony: this control sits in a
 * table row an inch from Publish, and the action behind it is the only one in
 * the panel with nothing behind it afterwards. A plain button here would be
 * one slip away from losing a post that took an afternoon.
 *
 * Deliberately not window.confirm(). A native dialog blocks the page, reads
 * as a browser warning rather than as part of this app, cannot say WHICH post
 * in a way that survives a long title, and cannot explain what a published
 * URL does next. This says it in the row, in the app's own voice.
 *
 * Escape cancels, and the confirm button takes focus when it appears, so the
 * keyboard path is: tab to Delete, enter, escape — or enter again to mean it.
 * ========================================================================= */

type Props = {
  id: string
  slug: string
  title: string
  status: string
  /** `row` is the compact control in the list; `page` is the wider one at the
   *  bottom of the editor, where there is room to explain. */
  variant?: 'row' | 'page'
}

export function DeletePost({ id, slug, title, status, variant = 'row' }: Props) {
  const [armed, setArmed] = useState(false)
  const [state, action, pending] = useActionState<DeleteState, FormData>(deletePost, null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  /* A failed delete disarms itself. Leaving it armed under an error message
     invites a second blind click at the thing that just refused.

     Adjusted during render rather than in an effect: this is state reacting to
     other state, which React handles in the same pass, where an effect would
     paint the armed panel first and then yank it away. */
  const [handledError, setHandledError] = useState<string | undefined>(undefined)
  if (state?.error !== handledError) {
    setHandledError(state?.error)
    if (state?.error) setArmed(false)
  }

  useEffect(() => {
    if (armed) confirmRef.current?.focus()
  }, [armed])

  if (!armed) {
    return (
      <div className={variant === 'page' ? 'space-y-2' : undefined}>
        <button
          type="button"
          onClick={() => setArmed(true)}
          className={
            variant === 'page'
              ? 'rounded-lg px-3.5 py-2 text-sm font-bold text-red-700 ring-1 ring-red-200 hover:bg-red-50'
              : 'text-xs font-semibold text-ink-500 hover:text-red-700'
          }
        >
          Delete
        </button>
        {state?.error && (
          <p role="alert" className="mt-1 max-w-sm text-xs leading-relaxed text-red-700">
            {state.error}
          </p>
        )}
      </div>
    )
  }

  const live = status === 'published'

  return (
    <form
      action={action}
      onKeyDown={(e) => { if (e.key === 'Escape') setArmed(false) }}
      className={
        'rounded-lg bg-red-50 px-3 py-2.5 text-left ring-1 ring-red-200 ' +
        (variant === 'page' ? 'max-w-xl' : 'min-w-[17rem]')
      }
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="confirm_id" value={id} />
      <input type="hidden" name="slug" value={slug} />

      <p className="text-xs leading-relaxed text-red-900">
        Delete <span className="font-bold">{title}</span>?{' '}
        {live ? (
          <>
            It is live at <code className="font-mono">/blog/{slug}</code>. That page will start
            returning 404 and any link to it breaks.
          </>
        ) : (
          'It is not published, so no reader loses anything.'
        )}{' '}
        <span className="font-semibold">This cannot be undone.</span>
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          ref={confirmRef}
          type="submit"
          disabled={pending}
          className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-800 disabled:opacity-60"
        >
          {pending ? 'Deleting…' : 'Delete permanently'}
        </button>
        <button
          type="button"
          onClick={() => setArmed(false)}
          disabled={pending}
          className="px-2 py-1.5 text-xs font-semibold text-ink-700 hover:text-ink-900"
        >
          Cancel
        </button>
        {live && (
          <span className="text-[0.7rem] text-red-800">
            Unpublish instead to take it down and keep it.
          </span>
        )}
      </div>
    </form>
  )
}
