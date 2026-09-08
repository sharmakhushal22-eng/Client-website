import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import { accessMode, listRows } from '@/lib/admin/db'
import { AccessError, Panel, Th, Td, When, EmptyState } from '@/components/admin/Table'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Content' }

/* The content tables that have no editor of their own, on one page, so nothing
 * in the database is invisible from here. Blog posts are NOT in this list any
 * more: they have a real editor at /admin/posts, and a second read-only view of
 * the same rows is the kind of duplicate that goes stale and then misleads. */
const TABLES = [
  { table: 'guides', title: 'Guides',
    cols: [['title','Title'],['slug','Slug'],['gated','Gated'],['status','Status'],['published_at','Published']] },
  { table: 'authors', title: 'Authors',
    cols: [['name','Name'],['slug','Slug'],['role','Role'],['created_at','Added']] },
  { table: 'compliance_calendar', title: 'Compliance calendar',
    cols: [['act','Act'],['obligation','Obligation'],['state','State'],['frequency','Frequency'],['due_day','Due day']] },
] as const

export default async function ContentPage() {
  await requireAdmin()
  if (accessMode() === 'none') return <AccessError />

  const results = await Promise.all(
    TABLES.map(async (t) => {
      try {
        const order = t.table === 'compliance_calendar' ? 'act' : 'created_at'
        return { ...t, rows: await listRows<Record<string, unknown>>(t.table, { limit: 200, order }), error: null as string | null }
      } catch (e) {
        return { ...t, rows: [], error: e instanceof Error ? e.message : String(e) }
      }
    }),
  )

  const firstError = results.find((r) => r.error)?.error
  if (firstError) return <AccessError message={firstError} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content</h1>
        <p className="mt-1 text-sm text-ink-500">
          Guides, authors and the compliance calendar — read-only. Blog posts are
          written and published under{' '}
          <Link href="/admin/posts" className="font-semibold text-brand-700 underline">
            Blog posts
          </Link>.
        </p>
      </div>

      {results.map((t) => (
        <Panel key={t.table} title={t.title} count={t.rows.length}>
          {t.rows.length === 0 ? (
            <EmptyState title={`No rows in ${t.table}`} hint="Populate when content moves out of the repo." />
          ) : (
            <table className="w-full min-w-[48rem] border-collapse">
              <thead>
                <tr>{t.cols.map(([, label]) => <Th key={label}>{label}</Th>)}</tr>
              </thead>
              <tbody>
                {t.rows.map((row, i) => (
                  <tr key={String(row.id ?? i)} className="hover:bg-brand-50/50">
                    {t.cols.map(([key]) => {
                      const v = row[key]
                      return (
                        <Td key={key}>
                          {v === null || v === undefined || v === ''
                            ? <span className="text-ink-300">—</span>
                            : typeof v === 'boolean' ? (v ? '✓' : '—')
                            : typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)
                              ? <When value={v} />
                              : String(v)}
                        </Td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      ))}
    </div>
  )
}
