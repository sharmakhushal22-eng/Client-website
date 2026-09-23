'use client'

import { useRef, useState } from 'react'

/* ============================================================================
 * Upload a document, get a filled-in post.
 *
 * The import NEVER saves and never overwrites without being told to. It fills
 * the form the editor is already looking at, they read it, they submit. Two
 * consequences worth keeping:
 *
 *   - when there is already work in the form, the result waits behind a
 *     Replace / Add to the end choice instead of landing on top of it. An
 *     import that ate forty minutes of typing would be used exactly once.
 *   - warnings are shown after applying, not instead of it. "The images were
 *     left out" is something to know while reading the draft, not a reason to
 *     refuse the draft.
 * ========================================================================= */

export type ImportedDraft = {
  title: string
  excerpt: string
  body: string
  warnings: string[]
  format: string
  filename: string
}

/** What the file picker offers. Anything else can still be dropped on it, and
 *  the server answers with what to do about that format by name — which is
 *  more use than a picker that silently refuses to show the file. */
const ACCEPT = '.docx,.pdf,.md,.markdown,.mdx,.txt,.html,.htm,.rtf'

type Props = {
  /** True when the form already holds something an import would destroy. */
  hasContent: boolean
  onApply: (draft: ImportedDraft, mode: 'replace' | 'append') => void
}

export function PostImport({ hasContent, onApply }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<ImportedDraft | null>(null)
  const [applied, setApplied] = useState<ImportedDraft | null>(null)
  const [dragging, setDragging] = useState(false)

  async function handleFile(file: File) {
    setError(null)
    setPending(null)
    setApplied(null)
    setBusy(file.name)

    try {
      const data = new FormData()
      data.append('file', file)
      const response = await fetch('/admin/posts/import', { method: 'POST', body: data })

      /* An expired session never reaches the route: proxy.ts redirects the
         POST to /admin/login, and fetch follows it. What comes back is a
         login page — HTML, and often a 500, because a re-POSTed form is not
         a server action. Neither of those is a problem with the file, so
         neither should be reported as one. */
      if (response.redirected || /text\/html/.test(response.headers.get('content-type') ?? '')) {
        throw new Error(
          'Your session has expired. Open /admin/login in another tab, sign in, then upload again — ' +
            'anything already typed into this form is still here.',
        )
      }

      /* A 413 from the platform itself also arrives as HTML, so the parse is
         guarded — the editor should not see "Unexpected token <" where a size
         limit belongs. */
      let payload: Partial<ImportedDraft> & { error?: string }
      try {
        payload = await response.json()
      } catch {
        throw new Error(
          response.status === 413
            ? 'That file is too large to upload. The limit is 4 MB.'
            : `The import failed (HTTP ${response.status}).`,
        )
      }

      if (!response.ok) throw new Error(payload.error ?? 'That file could not be read.')

      const draft = payload as ImportedDraft
      if (hasContent) setPending(draft)
      else apply(draft, 'replace')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That file could not be read.')
    } finally {
      setBusy(null)
      /* Cleared so choosing the same file twice fires change again — the
         second attempt after an edit is the normal case, not a rare one. */
      if (input.current) input.current.value = ''
    }
  }

  function apply(draft: ImportedDraft, mode: 'replace' | 'append') {
    onApply(draft, mode)
    setPending(null)
    setApplied(draft)
  }

  return (
    <section
      aria-labelledby="import-heading"
      className="rounded-xl border border-dashed border-ink-300 bg-ink-50/60 p-4"
    >
      <h2 id="import-heading" className="text-xs font-bold uppercase tracking-[0.1em] text-ink-700">
        Start from a file
      </h2>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files?.[0]
          if (file) void handleFile(file)
        }}
        className={`mt-3 rounded-lg border-2 border-dashed px-4 py-5 text-center transition ${
          dragging ? 'border-brand-500 bg-brand-50' : 'border-ink-200 bg-white'
        }`}
      >
        <p className="text-sm text-ink-700">
          Drop a document here, or{' '}
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={Boolean(busy)}
            className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800 disabled:opacity-60"
          >
            choose a file
          </button>
          .
        </p>
        <p className="mt-1.5 text-xs text-ink-500">
          Word (.docx), PDF, Markdown, plain text, HTML or RTF — up to 4 MB. Headings,
          bullets, numbered lists and tables are kept. Images, fonts and colours are not.
        </p>

        <input
          ref={input}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleFile(file)
          }}
        />
      </div>

      {busy && (
        <p className="mt-3 text-sm text-ink-600" role="status">
          Reading <span className="font-semibold">{busy}</span>…
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}

      {/* The form already has content, so the editor decides what happens to
          it. Defaulting either way would be wrong: replacing loses work,
          appending quietly doubles a document they meant to re-import. */}
      {pending && (
        <div className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          <p>
            Read <span className="font-semibold">{pending.filename}</span> ({pending.format}) —{' '}
            {wordCount(pending.body).toLocaleString('en-IN')} words. There is already something in
            this form.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => apply(pending, 'replace')}
              className="rounded-lg bg-ink-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-ink-800"
            >
              Replace what is there
            </button>
            <button
              type="button"
              onClick={() => apply(pending, 'append')}
              className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-ink-800 ring-1 ring-ink-300 hover:bg-ink-50"
            >
              Add to the end
            </button>
            <button
              type="button"
              onClick={() => setPending(null)}
              className="px-2 py-1.5 text-xs font-semibold text-ink-600 hover:text-ink-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {applied && (
        <div className="mt-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-200">
          <p>
            <span className="font-semibold">{applied.filename}</span> ({applied.format}) —{' '}
            {wordCount(applied.body).toLocaleString('en-IN')} words. Read it through below, then
            save. Nothing has been saved yet.
          </p>
          {applied.warnings.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.8rem] text-emerald-800">
              {applied.warnings.map((w) => <li key={w}>{w}</li>)}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}

function wordCount(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean)
  return words.length
}
