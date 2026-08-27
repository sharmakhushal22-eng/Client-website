import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { moduleGroups, solutions } from "@/content/modules";
import { ModuleSections } from "./ModuleSections";

/* ============================================================================
 * The module deep-dive and the full solution list, in one section.
 *
 * Replaces ModuleGrid + SolutionGrid (~2,160px stacked). The handoff itself
 * specified a tabbed deep-dive here; building it as two stacked grids was the
 * thing that made this part of the page long.
 *
 * The tabbed panel that used to sit here is gone. The groups hold between two
 * and ten modules, and one shared panel can only be one height — sized for
 * Pay's ten, Hire's two floated in a mostly empty card. It also hid eight of
 * nine areas behind labels like "Control", which do not say what is inside.
 * <ModuleSections> gives each area its own row and its own height, opening on
 * hover and on click. See that file for how the hover is gated.
 * ========================================================================= */

export function ModuleExplorer() {
  const totalModules = moduleGroups.reduce((n, g) => n + g.modules.length, 0);

  return (
    <section
      className="bg-brand-50 py-12 sm:py-14 lg:py-16"
      aria-label="Modules"
    >
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              One platform, hire to retire
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              Every HR and payroll function in one place — not stitched
              together from six tools
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-600">
              Recruitment, talent retention, CTC and manpower planning,
              payroll, employee self-service and exit — on one employee record,
              not six. {totalModules} modules across {moduleGroups.length}{' '}
              areas, sharing one employee master, so a change made once is a
              change made everywhere.
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

        <ModuleSections groups={moduleGroups} />

        {/* The scannable index, for the reader hunting one named thing. Kept
            flat and small — it is a lookup, not a feature pitch. */}
        <details className="group mt-8 rounded-2xl bg-surface ring-1 ring-ink-200">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-sm font-bold text-ink-900">
            <span>
              All {solutions.length} solutions, one login
              <span className="ml-2 font-medium text-ink-600">
                The complete list — including what&rsquo;s shipping next.
              </span>
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
                  {/* The reference numbers these 01–20 on the card face. */}
                  <span className="mt-px shrink-0 font-mono text-[0.62rem] font-bold text-ink-400">
                    {s.n}
                  </span>
                  {s.name}
                  {s.coming && (
                    <span className="mt-0.5 shrink-0 rounded bg-amber-50 px-1 py-0.5 text-[0.55rem] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
                      Coming
                    </span>
                  )}
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
  );
}
