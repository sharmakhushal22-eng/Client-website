import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { moduleGroups, solutions } from '@/content/modules'

/* ============================================================================
 * The module deep-dive and the full solution list, in one section.
 *
 * Replaces ModuleGrid + SolutionGrid (~2,160px stacked). The handoff itself
 * specified a tabbed deep-dive here; building it as two stacked grids was the
 * thing that made this part of the page long.
 *
 * The sidebar variant is used because the group names need a line of context
 * to choose between — "Control" alone does not tell you what is in it.
 * ========================================================================= */

const groupIcons: Record<string, IconName> = {
  hire: 'briefcase',
  plan: 'chart',
  onboard: 'user-plus',
  manage: 'users',
  time: 'clock',
  pay: 'wallet',
  claims: 'receipt',
  serve: 'sparkle',
  control: 'shield',
}

export function ModuleExplorer() {
  const totalModules = moduleGroups.reduce((n, g) => n + g.modules.length, 0)
  const statutoryCount = solutions.filter((s) => s.statutory).length

  const items: TabItem[] = moduleGroups.map((group) => ({
    id: group.id,
    label: group.name,
    hint: group.promise,
    panel: (
      <div className="rounded-2xl bg-surface p-6 ring-1 ring-ink-200 sm:p-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">
            <Icon name={groupIcons[group.id]} className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-bold">{group.name}</h3>
          <p className="text-[0.92rem] leading-relaxed text-ink-600">
            {group.promise}
          </p>
        </div>

        {/* Three columns keeps even the ten-module Pay panel short. */}
        <ul className="mt-5 grid gap-x-7 gap-y-3 border-t border-ink-200 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {group.modules.map((m) => (
            <li key={m.name} className="flex items-start gap-2.5">
              <Icon name="check" className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-500" />
              <span>
                <span className="block text-sm font-bold text-ink-900">{m.name}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                  {m.blurb}
                </span>
              </span>
            </li>
          ))}
        </ul>

        {group.href && (
          <Link
            href={group.href}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            See {group.name.toLowerCase()} in detail
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    ),
  }))

  return (
    <section className="bg-brand-50 py-12 sm:py-14 lg:py-16" aria-label="Modules">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              One system, not five
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              Everything HR runs on, in one place
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-600">
              {totalModules} modules across {moduleGroups.length} areas, sharing
              one employee master — so a change made once is a change made
              everywhere.
            </p>
          </div>

          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            See every module in detail
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>

        <Tabs
          items={items}
          ariaLabel="Module groups"
          variant="pill"
          className="mt-7"
        />

        {/* The scannable index, for the reader hunting one named thing. Kept
            flat and small — it is a lookup, not a feature pitch. */}
        <details className="group mt-8 rounded-2xl bg-surface ring-1 ring-ink-200">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-sm font-bold text-ink-900">
            <span>
              All {solutions.length} solutions — {statutoryCount} of them
              statutory
            </span>
            <Icon
              name="chevron-down"
              className="h-4 w-4 shrink-0 text-brand-600 transition-transform group-open:rotate-180"
            />
          </summary>

          <ul className="grid gap-x-6 gap-y-3 border-t border-ink-200 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s) => (
              <li key={s.name}>
                <span className="flex items-start gap-1.5 text-[0.82rem] font-bold text-ink-900">
                  {s.name}
                  {s.statutory && (
                    <span className="mt-0.5 shrink-0 rounded bg-brand-50 px-1 py-0.5 text-[0.55rem] font-bold uppercase tracking-wide text-brand-700 ring-1 ring-brand-100">
                      Stat
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-[0.72rem] leading-snug text-ink-500">
                  {s.blurb}
                </span>
              </li>
            ))}
          </ul>
        </details>
      </Container>
    </section>
  )
}
