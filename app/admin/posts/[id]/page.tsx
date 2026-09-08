import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { accessMode, getRow } from '@/lib/admin/db'
import { AccessError } from '@/components/admin/Table'
import { explainDbError } from '@/lib/admin/explain'
import { PostEditor, type PostDraft } from '@/components/admin/PostEditor'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Edit post' }

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  if (accessMode() === 'none') return <AccessError />

  const { id } = await params

  /* getRow throws when the database cannot be reached, and an uncaught throw
     here is a 500 — a blank error page for what is really "the database is
     down", which tells the operator nothing and looks like a broken editor. */
  let post: PostDraft | null
  try {
    post = await getRow<PostDraft>('posts', id)
  } catch (err) {
    return <AccessError message={explainDbError(err, 'Could not load this post')} />
  }
  if (!post) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-bold text-ink-900">Edit post</h1>
      <PostEditor post={post} />
    </div>
  )
}
