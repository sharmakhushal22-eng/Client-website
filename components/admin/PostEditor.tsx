'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createPost, updatePost, type PostFormState } from '@/app/admin/posts/actions'

/* The one form, used for both new and existing posts. Two forms would drift:
   a field added to "new" and forgotten on "edit" is the classic way an editor
   loses work they thought they had saved. */

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

  return (
    <form action={action} className="space-y-5">
      {editing && <input type="hidden" name="id" defaultValue={post?.id} />}
      {post?.published_at && (
        <input type="hidden" name="published_at" defaultValue={post.published_at} />
      )}

      <div>
        <label className={label} htmlFor="title">Title</label>
        <input id="title" name="title" required defaultValue={post?.title}
          className={`${field} mt-1.5`} placeholder="What the post is called" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="slug">URL slug</label>
          <input id="slug" name="slug" defaultValue={post?.slug}
            className={`${field} mt-1.5`} placeholder="left blank = built from the title" />
          <p className="mt-1 text-xs text-ink-500">
            Lives at <code className="font-mono">/blog/&lt;slug&gt;</code>. Changing it on a
            published post breaks any existing link to it.
          </p>
        </div>
        <div>
          <label className={label} htmlFor="category">Category</label>
          <input id="category" name="category" defaultValue={post?.category ?? 'Article'}
            className={`${field} mt-1.5`} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt}
          className={`${field} mt-1.5`} placeholder="One or two lines, shown on the blog index" />
      </div>

      <div>
        <label className={label} htmlFor="body">Body</label>
        <textarea id="body" name="body" rows={18} required defaultValue={post?.body_mdx}
          className={`${field} mt-1.5 font-mono text-[0.8rem] leading-relaxed`}
          placeholder={'## A heading\n\nA paragraph. Leave a blank line between paragraphs.\n\n- a bullet\n- another bullet\n\n1. a numbered point'} />
        <p className="mt-1 text-xs leading-relaxed text-ink-500">
          Plain text. <code className="font-mono">##</code> makes a heading,
          {' '}<code className="font-mono">###</code> a sub-heading,
          {' '}<code className="font-mono">-</code> a bullet and
          {' '}<code className="font-mono">1.</code> a numbered list. Everything else is a
          paragraph. No HTML — it renders with the same styling as the existing
          articles, and nothing typed here can become markup.
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
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
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
  )
}
