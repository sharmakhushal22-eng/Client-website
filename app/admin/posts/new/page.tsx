import { requireAdmin } from '@/lib/admin/auth'
import { accessMode } from '@/lib/admin/db'
import { AccessError } from '@/components/admin/Table'
import { PostEditor } from '@/components/admin/PostEditor'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'New post' }

export default async function NewPostPage() {
  await requireAdmin()
  if (accessMode() === 'none') return <AccessError />
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-bold text-ink-900">New post</h1>
      <PostEditor />
    </div>
  )
}
