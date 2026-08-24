import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { industryCategories, industryCount } from '@/content/positioning'

/* ============================================================================
 * 100+ industries in 14 groups — as a tab strip, not fourteen stacked blocks.
 *
 * Stacked, this section ran to ~1,680px to say one thing: "we know your
 * sector's rules." Nobody reads all fourteen; they look for their own. Tabs
 * cost one panel height and make finding yours faster than scrolling.
 *
 * The per-category note is what earns the section: a list of industry names
 * proves nothing, but a line on what is statutorily different about
 * construction (BOCW cess, site-wise establishment) proves somebody has run
 * payroll in it.
 * ========================================================================= */
export function IndustryGrid() {
  const items: TabItem[] = industryCategories.map((category) => ({
    id: category.name,
    label: category.name,
    panel: (
      <div className="rounded-2xl bg-white p-6 ring-1 ring-brand-100 sm:p-7">
        <p className="flex items-start gap-2.5 text-sm font-semibold leading-relaxed text-brand-700">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0" />
          {category.note}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-5">
          {category.industries.map((industry) => (
            <li
              key={industry}
              className="rounded-lg bg-brand-50 px-3 py-1.5 text-[0.8rem] font-medium text-ink-700 ring-1 ring-brand-100"
            >
              {industry}
            </li>
          ))}
        </ul>
      </div>
    ),
  }))

  return (
    <section
      className="border-y border-ink-200 bg-white py-12 sm:py-14"
      aria-label="Industries served"
    >
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              Configured per industry
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              {industryCount} industries, in {industryCategories.length} groups
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-600">
              Establishment type decides which registers apply, which leave
              entitlement follows and which returns are due. That is
              configuration, not a different product — so this is one system,
              set up differently.
            </p>
          </div>

          <p className="max-w-xs text-sm leading-relaxed text-ink-500">
            Not listed? The list is not the constraint — the statutory rules
            are, and those are configuration.
          </p>
        </div>

        <Tabs
          items={items}
          ariaLabel="Industry categories"
          variant="pill"
          className="mt-8"
        />
      </Container>
    </section>
  )
}
