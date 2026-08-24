import { requireAdmin } from '@/lib/admin/auth'
import { accessMode, listRows } from '@/lib/admin/db'
import { AccessError, Panel, Th, Td, When, EmptyState } from './Table'

export type Column = {
  key: string
  label: string
  /** 'when' formats an ISO timestamp; 'bool' renders a tick or dash. */
  kind?: 'text' | 'when' | 'bool' | 'email'
}

/** One shared reader for every simple table in the admin panel, so adding a
 *  table is a column list rather than another page of boilerplate. */
export async function DataTable({
  table, title, columns, description, order = 'created_at', emptyHint,
}: {
  table: string
  title: string
  columns: Column[]
  description?: string
  order?: string
  emptyHint?: string
}) {
  await requireAdmin()
  if (accessMode() === 'none') return <AccessError />

  let rows: Record<string, unknown>[] = []
  let error: string | null = null
  try {
    rows = await listRows<Record<string, unknown>>(table, { limit: 500, order })
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }
  if (error) return <AccessError message={error} />

  const render = (col: Column, row: Record<string, unknown>) => {
    const v = row[col.key]
    if (v === null || v === undefined || v === '') return <span className="text-ink-300">—</span>
    if (col.kind === 'when') return <When value={String(v)} />
    if (col.kind === 'bool') return v ? '✓' : <span className="text-ink-300">—</span>
    if (col.kind === 'email') {
      return <a href={`mailto:${v}`} className="text-brand-700 hover:underline">{String(v)}</a>
    }
    if (Array.isArray(v)) return v.length ? v.join(', ') : <span className="text-ink-300">—</span>
    return String(v)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>

      <Panel title={title} count={rows.length}>
        {rows.length === 0 ? (
          <EmptyState title={`Nothing in ${table} yet`} hint={emptyHint} />
        ) : (
          <table className="w-full min-w-[52rem] border-collapse">
            <thead>
              <tr>{columns.map((c) => <Th key={c.key}>{c.label}</Th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={String(row.id ?? i)} className="transition-colors hover:bg-brand-50/50">
                  {columns.map((c) => <Td key={c.key}>{render(c, row)}</Td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  )
}
