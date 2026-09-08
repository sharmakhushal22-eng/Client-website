import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { accessMode, listRows } from '@/lib/admin/db'
import { AccessError, Panel, Th, Td, EmptyState, StatusChip, When } from '@/components/admin/Table'
import { explainDbError } from '@/lib/admin/explain'
import { setPostStatus } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Blog posts' }

/* The post list. Publish and unpublish happen here rather than only inside the
 * editor, because taking something down is the action you want to be one click
 * away when it matters. */

type Row = {
  id: string
  slug: string
  title: string
  status: string
  category: string | null
  published_at: string | null
  updated_at: string | null
}

export default async function PostsPage() {
  await requireAdmin()
  if (accessMode() === 'none') return <AccessError />

  let rows: Row[] = []
  let error: string | null = null
  try {
    rows = await listRows<Row>('posts', { limit: 200, order: 'updated_at' })
  } catch (err) {
    error = explainDbError(err, 'Could not load posts')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Blog posts</h1>
          <p className="mt-1 text-sm text-ink-600">
            Published posts appear on{' '}
            <Link href="/blog" className="font-semibold text-brand-700 underline">/blog</Link>{' '}
            within a minute. The three articles written into the repo are always there and are
            not editable here.
          </p>
        </div>
        <Link href="/admin/posts/new"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
          New post
        </Link>
      </div>

      {error ? (
        <AccessError message={error} />
      ) : rows.length === 0 ? (
        <EmptyState title="No posts yet"
          hint="Use “New post”. Until then the blog shows the three articles that ship with the site." />
      ) : (
        <Panel title="All posts" count={rows.length}>
          <table className="w-full min-w-[44rem] border-collapse">
            <thead>
              <tr>
                <Th>Title</Th><Th>Slug</Th><Th>Status</Th><Th>Published</Th><Th>Updated</Th><Th>&nbsp;</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <Td>
                    <Link href={`/admin/posts/${r.id}`} className="font-semibold text-brand-700 hover:underline">
                      {r.title}
                    </Link>
                  </Td>
                  <Td><code className="font-mono text-xs">{r.slug}</code></Td>
                  <Td><StatusChip status={r.status} /></Td>
                  <Td><When value={r.published_at} /></Td>
                  <Td><When value={r.updated_at} /></Td>
                  <Td>
                    <form action={setPostStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="slug" value={r.slug} />
                      {r.published_at && <input type="hidden" name="published_at" value={r.published_at} />}
                      <input type="hidden" name="status" value={r.status === 'published' ? 'draft' : 'published'} />
                      <button type="submit" className="text-xs font-semibold text-ink-600 hover:text-brand-700">
                        {r.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  )
}
