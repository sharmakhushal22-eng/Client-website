'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { insertRow, updateRow } from '@/lib/admin/db'
import { readingMinutes } from '@/lib/blog'

/* ============================================================================
 * Create, edit and publish blog posts.
 *
 * Every action calls requireAdmin() FIRST. Server actions are public POST
 * endpoints — Next gives each one an id and anyone who has it can invoke it —
 * so the gate belongs in the action itself, not only on the page that renders
 * the form.
 *
 * Writes go through insertRow/updateRow, the same helpers the lead inbox uses,
 * which go out on the service key. Nothing here builds SQL by hand.
 * ========================================================================= */

export type PostFormState = { error?: string; ok?: boolean } | null

/** URL-safe, lowercase, no runs of hyphens. Derived from the title when the
 *  author leaves it blank, because a slug is the one field people forget and
 *  the one that cannot be changed painlessly afterwards. */
export async function slugify(input: string): Promise<string> {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function read(form: FormData) {
  const title = String(form.get('title') ?? '').trim()
  const body = String(form.get('body') ?? '').trim()
  const rawSlug = String(form.get('slug') ?? '').trim()
  return {
    title,
    body,
    rawSlug,
    excerpt: String(form.get('excerpt') ?? '').trim(),
    category: String(form.get('category') ?? '').trim() || 'Article',
    status: String(form.get('status') ?? 'draft').trim(),
  }
}

/** The checks that must hold for BOTH create and edit. Returned rather than
 *  thrown so the form can show them next to the fields the author typed. */
function validate(v: ReturnType<typeof read>): string | null {
  if (v.title.length < 4) return 'Give the post a title of at least 4 characters.'
  if (v.title.length > 140) return 'Titles over 140 characters get truncated everywhere. Shorten it.'
  if (v.body.length < 40) return 'The body is too short to publish. Write at least a paragraph.'
  if (v.excerpt.length > 300) return 'The excerpt is a summary, not the article — keep it under 300 characters.'
  if (!['draft', 'published', 'archived'].includes(v.status)) return 'Unknown status.'
  return null
}

export async function createPost(
  _prev: PostFormState,
  form: FormData,
): Promise<PostFormState> {
  await requireAdmin()
  const v = read(form)
  const problem = validate(v)
  if (problem) return { error: problem }

  const slug = v.rawSlug ? await slugify(v.rawSlug) : await slugify(v.title)
  if (!slug) return { error: 'Could not build a URL from that title. Set the slug by hand.' }

  try {
    await insertRow('posts', {
      slug,
      title: v.title,
      excerpt: v.excerpt || null,
      body_mdx: v.body,
      category: v.category,
      reading_minutes: readingMinutes(v.body),
      status: v.status,
      /* Stamped only when it actually goes public, so "published_at" never
         claims a date for something no reader could reach. */
      published_at: v.status === 'published' ? new Date().toISOString() : null,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    /* The slug is the one unique column, so this is the collision worth
       naming rather than showing a raw Postgres error. */
    if (/duplicate|unique/i.test(msg)) {
      return { error: `A post with the URL "${slug}" already exists. Choose a different slug.` }
    }
    return { error: `Could not save: ${msg}` }
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  redirect('/admin/posts')
}

export async function updatePost(
  _prev: PostFormState,
  form: FormData,
): Promise<PostFormState> {
  await requireAdmin()
  const id = String(form.get('id') ?? '')
  if (!id) return { error: 'Missing post id.' }

  const v = read(form)
  const problem = validate(v)
  if (problem) return { error: problem }

  const slug = v.rawSlug ? await slugify(v.rawSlug) : await slugify(v.title)

  const patch: Record<string, unknown> = {
    slug,
    title: v.title,
    excerpt: v.excerpt || null,
    body_mdx: v.body,
    category: v.category,
    reading_minutes: readingMinutes(v.body),
    status: v.status,
    updated_at: new Date().toISOString(),
  }
  /* Set the publish date the first time it goes live and never move it
     afterwards — an edit is not a republish, and a shifting date breaks the
     ordering readers see. */
  if (v.status === 'published' && !form.get('published_at')) {
    patch.published_at = new Date().toISOString()
  }

  try {
    await updateRow('posts', id, patch)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (/duplicate|unique/i.test(msg)) {
      return { error: `Another post already uses the URL "${slug}".` }
    }
    return { error: `Could not save: ${msg}` }
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  return { ok: true }
}

/** Publish / unpublish / archive from the list, without opening the editor. */
export async function setPostStatus(form: FormData) {
  await requireAdmin()
  const id = String(form.get('id') ?? '')
  const status = String(form.get('status') ?? '')
  const slug = String(form.get('slug') ?? '')
  if (!id || !['draft', 'published', 'archived'].includes(status)) return

  const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status === 'published' && !form.get('published_at')) {
    patch.published_at = new Date().toISOString()
  }
  await updateRow('posts', id, patch)

  revalidatePath('/blog')
  if (slug) revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin/posts')
}
