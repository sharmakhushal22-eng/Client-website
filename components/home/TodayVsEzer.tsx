import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { todayVsEzer } from '@/content/positioning'

/* Handoff anchor #simplify — six challenge/solution pairs.
 *
 * Previously six two-column cards stacked in a 2-up grid (~1,285px). Now one
 * comparison table: a labelled row per pair, with the two states side by side.
 * A table is the honest shape for this content — it IS a comparison — and it
 * removes six sets of card padding and six repeated column headers.
 *
 * The header row is sticky-free and rendered once at the top; on mobile the
 * two states stack with their own inline labels.
 */
export function TodayVsEzer() {
  return (
    <section className="bg-surface py-12 sm:py-14 lg:py-16" aria-label="Today versus with EZER">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              {todayVsEzer.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              {todayVsEzer.title}
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-600">
              {todayVsEzer.lede}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-ink-200">
          {/* Column headers — once, not once per card. */}
          <div className="hidden bg-ink-50 sm:grid sm:grid-cols-[13rem_1fr_1fr]">
            <span className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-800">
              What
            </span>
            <span className="flex items-center gap-1.5 border-l border-ink-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-amber-800">
              <Icon name="alert" className="h-3.5 w-3.5" />
              Today
            </span>
            <span className="flex items-center gap-1.5 border-l border-ink-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
              <Icon name="check" className="h-3.5 w-3.5" />
              With EZER
            </span>
          </div>

          <ul className="divide-y divide-ink-200">
            {todayVsEzer.pairs.map((pair, i) => (
              <li
                key={pair.area}
                data-reveal=""
                /* Capped, so the sixth row is not still arriving long after
                   the first — the table should land as a table. */
                style={{ transitionDelay: `${Math.min(i, 5) * 55}ms` }}
                className="ez-vs-row grid sm:grid-cols-[13rem_1fr_1fr] sm:items-stretch"
              >
                <div className="flex items-center gap-2.5 bg-ink-50 px-5 py-3 sm:bg-transparent sm:py-5">
                  <span className="ez-vs-icon grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_4px_10px_-4px_rgba(37,99,235,0.7)]">
                    <Icon name={pair.icon} className="h-4 w-4" />
                  </span>
                  <h3 className="text-[0.95rem] font-bold leading-snug text-ink-900">
                    {pair.area}
                  </h3>
                </div>

                <div className="ez-vs-edge ez-vs-today relative border-ink-200 bg-amber-50/50 px-5 py-4 sm:border-l sm:py-5">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-amber-900 sm:hidden">
                    <Icon name="alert" className="h-3 w-3" />
                    Today
                  </span>
                  <p className="text-[0.9rem] leading-relaxed text-ink-900">
                    {pair.today}
                  </p>
                </div>

                <div className="ez-vs-edge ez-vs-win relative border-ink-200 bg-emerald-50 px-5 py-4 sm:border-l sm:py-5">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-emerald-900 sm:hidden">
                    <Icon name="check" className="h-3 w-3" />
                    With EZER
                  </span>
                  {/* The answer carries the most weight on the row: darkest
                      ink and a touch of extra weight, so a reader skimming
                      only the right-hand column still gets the argument. */}
                  <p className="relative z-10 text-[0.9rem] font-medium leading-relaxed text-ink-900">
                    {pair.withEzer}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
