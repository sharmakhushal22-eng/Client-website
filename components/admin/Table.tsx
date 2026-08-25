import { Icon } from '@/components/ui/Icon'
import { accessDiagnostic } from '@/lib/admin/db'

/** Shown when a page cannot read the database at all. An admin panel that
 *  quietly renders an empty table in this situation is actively misleading —
 *  "no leads yet" and "I cannot see the leads" look identical. */
export function AccessError({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl bg-surface p-8 ring-1 ring-amber-200">
      <h2 className="flex items-center gap-2 text-lg font-bold text-amber-900">
        <Icon name="alert" className="h-5 w-5" />
        Cannot read the database
      </h2>
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl bg-amber-50 p-5 font-mono text-[0.8rem] leading-relaxed text-amber-900">
        {message ?? accessDiagnostic()}
      </pre>
    </div>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-surface p-12 text-center ring-1 ring-ink-200">
      <p className="text-base font-semibold text-ink-900">{title}</p>
      {hint && <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">{hint}</p>}
    </div>
  )
}

export function Panel({
  title,
  count,
  action,
  children,
}: {
  title: string
  count?: number
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-surface ring-1 ring-ink-200">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 px-5 py-4">
        <h2 className="flex items-baseline gap-2 text-base font-bold">
          {title}
          {count !== undefined && (
            <span className="text-sm font-medium tabular-nums text-ink-400">{count}</span>
          )}
        </h2>
        {action}
      </header>
      {/* Wide tables scroll inside their own container so the page body never
          scrolls sideways. */}
      <div className="overflow-x-auto">{children}</div>
    </section>
  )
}

export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-ink-200 px-5 py-2.5 text-left text-[0.7rem] font-bold uppercase tracking-wider text-ink-500 ${className}`}
    >
      {children}
    </th>
  )
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`border-b border-ink-100 px-5 py-3 align-top text-sm text-ink-700 ${className}`}>
      {children}
    </td>
  )
}

const STATUS_TONE: Record<string, string> = {
  New: 'bg-brand-100 text-brand-800',
  Contacted: 'bg-sky-100 text-sky-800',
  'Demo booked': 'bg-indigo-100 text-indigo-800',
  'Demo done': 'bg-violet-100 text-violet-800',
  Proposal: 'bg-amber-100 text-amber-900',
  Won: 'bg-emerald-100 text-emerald-800',
  Lost: 'bg-ink-200 text-ink-600',
}

/** Status as a chip, not just text — the pipeline position is the thing you
 *  scan for, so it has to read at a glance rather than be parsed. */
export function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${
        STATUS_TONE[status] ?? 'bg-ink-100 text-ink-600'
      }`}
    >
      {status}
    </span>
  )
}

/** Dates render on the server, so they must not depend on the viewer's locale
 *  or timezone — that causes a hydration mismatch. Fixed to en-IN / IST, which
 *  is also what the team actually works in. */
export function When({ value }: { value: string | null }) {
  if (!value) return <span className="text-ink-300">—</span>
  const d = new Date(value)
  return (
    <span className="whitespace-nowrap tabular-nums">
      {d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}
      <span className="ml-1.5 text-ink-400">
        {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
      </span>
    </span>
  )
}
