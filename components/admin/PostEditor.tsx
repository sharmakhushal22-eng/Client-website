'use client'

import { useActionState, useRef, useState } from 'react'
import Link from 'next/link'
import { createPost, updatePost, type PostFormState } from '@/app/admin/posts/actions'
import { PostImport, type ImportedDraft } from '@/components/admin/PostImport'
import { htmlToMarkup, pdfTextToMarkup, tidyBlockSpacing } from '@/lib/import/markup'

/* The one form, used for both new and existing posts. Two forms would drift:
   a field added to "new" and forgotten on "edit" is the classic way an editor
   loses work they thought they had saved.

   The fields are CONTROLLED, where they used to be defaultValue only. Two
   things need that: the file import writes into them, and a failed submit now
   keeps what was typed instead of the browser restoring stale defaults. */

export type PostDraft = {
  id?: string
  slug?: string
  title?: string
  excerpt?: string
  body_mdx?: string
  category?: string
  status?: string
  published_at?: string | null
}

const field =
  'w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 ' +
  'placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200'
const label = 'block text-xs font-bold uppercase tracking-[0.1em] text-ink-700'

export function PostEditor({ post }: { post?: PostDraft }) {
  const editing = Boolean(post?.id)
  const [state, action, pending] = useActionState<PostFormState, FormData>(
    editing ? updatePost : createPost,
    null,
  )

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [category, setCategory] = useState(post?.category ?? 'Article')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [body, setBody] = useState(post?.body_mdx ?? '')
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  /* ── Paste ───────────────────────────────────────────────────────────────
   *
   * Word, Google Docs and every web page put TWO things on the clipboard: the
   * plain text and the HTML. Pasting used to take the plain text, which is
   * why a pasted article arrived as one undifferentiated block and the
   * headings and bullets had to be typed back in by hand.
   *
   * So when the clipboard carries HTML, it is converted — through the same
   * code the file import uses, so a document pasted and the same document
   * uploaded come out identical. Plain text is left to the browser: it has
   * nothing to convert, and intercepting it would only break the undo stack.
   * ------------------------------------------------------------------------ */
  function insertIntoBody(text: string) {
    const el = bodyRef.current
    if (!el) { setBody((b) => (b ? `${b}\n\n${text}` : text)); return }

    /* execCommand is deprecated but is still the only way to insert text and
       keep the browser's own undo history — a paste the editor cannot undo
       with ctrl+Z is worse than one that lost its formatting. React sees the
       resulting input event and setBody runs from onChange as usual. */
    el.focus()
    let inserted = false
    try {
      inserted = document.execCommand('insertText', false, text)
    } catch {
      inserted = false
    }
    if (inserted) return

    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? start
    const next = el.value.slice(0, start) + text + el.value.slice(end)
    setBody(next)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + text.length
    })
  }

  function onBodyPaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    const html = event.clipboardData.getData('text/html')
    if (!html.trim()) return               // plain text — let the browser do it

    const { body: converted } = htmlToMarkup(html)
    if (!converted.trim()) return          // nothing we could make of it

    event.preventDefault()
    /* Blank line before, so a paste into the middle of a draft starts its own
       block rather than continuing the paragraph it landed in. */
    const el = bodyRef.current
    const before = el ? el.value.slice(0, el.selectionStart ?? 0) : body
    const lead = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : ''
    insertIntoBody(`${lead}${converted}`)
  }

  /** A title or excerpt pasted out of a document arrives with its line breaks
   *  attached. In a single-line input those become spaces at best and a
   *  silently truncated value at worst. */
  function pasteAsOneLine(
    event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    set: (value: string) => void,
  ) {
    const text = event.clipboardData.getData('text/plain')
    if (!/\s{2,}|\n/.test(text)) return
    event.preventDefault()
    const el = event.currentTarget
    const clean = text.replace(/\s+/g, ' ').trim()
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? start
    set(el.value.slice(0, start) + clean + el.value.slice(end))
  }

  /** Text copied out of a PDF viewer arrives with a line break at the end of
   *  every visual line, which renders as a paragraph per line. This is the
   *  same re-wrapping the PDF import does, offered as a button because by the
   *  time someone notices, the text is already in the box. */
  function tidyBody() {
    const el = bodyRef.current
    const selection =
      el && (el.selectionEnd ?? 0) > (el.selectionStart ?? 0)
        ? { start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 }
        : null

    if (selection) {
      const chunk = body.slice(selection.start, selection.end)
      const fixed = pdfTextToMarkup(chunk).body
      setBody(body.slice(0, selection.start) + fixed + body.slice(selection.end))
      return
    }
    setBody(pdfTextToMarkup(body).body)
  }

  function applyImport(draft: ImportedDraft, mode: 'replace' | 'append') {
    if (mode === 'append') {
      setBody((current) =>
        tidyBlockSpacing([...current.split('\n'), '', ...draft.body.split('\n')]),
      )
      /* Title and excerpt are not appended — two titles joined is nobody's
         intention. They fill only what is still empty. */
      if (!title && draft.title) setTitle(draft.title)
      if (!excerpt && draft.excerpt) setExcerpt(draft.excerpt)
      return
    }

    setBody(draft.body)
    if (draft.title) setTitle(draft.title)
    if (draft.excerpt) setExcerpt(draft.excerpt)
  }

  const words = body.trim() ? body.trim().split(/\s+/).length : 0

  return (
    <div className="space-y-5">
      <PostImport
        hasContent={Boolean(title.trim() || excerpt.trim() || body.trim())}
        onApply={applyImport}
      />

      <form action={action} className="space-y-5">
        {editing && <input type="hidden" name="id" defaultValue={post?.id} />}
        {post?.published_at && (
          <input type="hidden" name="published_at" defaultValue={post.published_at} />
        )}

        <div>
          <label className={label} htmlFor="title">Title</label>
          <input id="title" name="title" required value={title}
            onChange={(e) => setTitle(e.target.value)}
            onPaste={(e) => pasteAsOneLine(e, setTitle)}
            className={`${field} mt-1.5`} placeholder="What the post is called" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="slug">URL slug</label>
            <input id="slug" name="slug" value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={`${field} mt-1.5`} placeholder="left blank = built from the title" />
            <p className="mt-1 text-xs text-ink-500">
              Lives at <code className="font-mono">/blog/&lt;slug&gt;</code>. Changing it on a
              published post breaks any existing link to it.
            </p>
          </div>
          <div>
            <label className={label} htmlFor="category">Category</label>
            <input id="category" name="category" value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${field} mt-1.5`} />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            onPaste={(e) => pasteAsOneLine(e, setExcerpt)}
            className={`${field} mt-1.5`} placeholder="One or two lines, shown on the blog index" />
          <p className="mt-1 text-xs text-ink-500">
            {excerpt.length}/300 characters.
          </p>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <label className={label} htmlFor="body">Body</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-500">
                {words.toLocaleString('en-IN')} words
              </span>
              <button type="button" onClick={tidyBody} disabled={!body.trim()}
                className="text-xs font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800 disabled:opacity-40">
                Tidy up line breaks
              </button>
            </div>
          </div>
          <textarea id="body" name="body" rows={18} required ref={bodyRef} value={body}
            onChange={(e) => setBody(e.target.value)}
            onPaste={onBodyPaste}
            className={`${field} mt-1.5 font-mono text-[0.8rem] leading-relaxed`}
            placeholder={'## A heading\n\nA paragraph. Leave a blank line between paragraphs.\n\n- a bullet\n- another bullet\n\n1. a numbered point\n\n| Slab | Rate |\n| --- | --- |\n| Up to ₹3L | Nil |'} />
          <p className="mt-1 text-xs leading-relaxed text-ink-500">
            Plain text. <code className="font-mono">##</code> makes a heading,
            {' '}<code className="font-mono">###</code> a sub-heading,
            {' '}<code className="font-mono">-</code> a bullet,
            {' '}<code className="font-mono">1.</code> a numbered list, and a row of
            {' '}<code className="font-mono">| cell | cell |</code> a table — put
            {' '}<code className="font-mono">| --- | --- |</code> under the first row to make it a
            header. Everything else is a paragraph. No HTML — it renders with the same styling as
            the existing articles, and nothing typed here can become markup.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-500">
            Pasting from Word, Google Docs or a web page keeps the headings, lists and tables.
            Text copied out of a PDF often breaks mid-sentence — paste it, then use
            {' '}<span className="font-semibold">Tidy up line breaks</span> (it works on a
            selection if you only need to fix part of it).
          </p>
        </div>

        <div>
          <label className={label} htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={post?.status ?? 'draft'}
            className={`${field} mt-1.5`}>
            <option value="draft">Draft — not visible on the website</option>
            <option value="published">Published — live on /blog</option>
            <option value="archived">Archived — taken down</option>
          </select>
        </div>

        {state?.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
            Saved. Published posts appear on the blog within a minute.
          </p>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={pending}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
            {pending ? 'Saving…' : editing ? 'Save changes' : 'Create post'}
          </button>
          <Link href="/admin/posts" className="text-sm font-semibold text-ink-600 hover:text-ink-900">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
