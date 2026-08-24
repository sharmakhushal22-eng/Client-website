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
    <section className="bg-white py-12 sm:py-14 lg:py-16" aria-label="Today versus with EZER">
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
            <span className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink-500">
              What
            </span>
            <span className="flex items-center gap-1.5 border-l border-ink-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-amber-700">
              <Icon name="alert" className="h-3.5 w-3.5" />
              Today
            </span>
            <span className="flex items-center gap-1.5 border-l border-ink-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              <Icon name="check" className="h-3.5 w-3.5" />
              With EZER
            </span>
          </div>

          <ul className="divide-y divide-ink-200">
            {todayVsEzer.pairs.map((pair) => (
              <li
                key={pair.area}
                className="grid sm:grid-cols-[13rem_1fr_1fr] sm:items-stretch"
              >
                <div className="flex items-center gap-2.5 bg-ink-50 px-5 py-3 sm:bg-transparent sm:py-5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon name={pair.icon} className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-bold text-ink-900">{pair.area}</h3>
                </div>

                <div className="border-ink-200 px-5 py-4 sm:border-l sm:py-5">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-amber-700 sm:hidden">
                    <Icon name="alert" className="h-3 w-3" />
                    Today
                  </span>
                  <p className="text-[0.82rem] leading-relaxed text-ink-600">
                    {pair.today}
                  </p>
                </div>

                <div className="border-ink-200 bg-emerald-50/40 px-5 py-4 sm:border-l sm:py-5">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-emerald-700 sm:hidden">
                    <Icon name="check" className="h-3 w-3" />
                    With EZER
                  </span>
                  <p className="text-[0.82rem] leading-relaxed text-ink-700">
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
