import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { industryCategories, industryCount } from '@/content/positioning'

/* ============================================================================
 * 100+ industries, all fourteen groups visible at once.
 *
 * This was a tab strip, and tabs were the wrong instrument. The whole claim is
 * BREADTH — "we mapped a hundred industries before writing the rules engine" —
 * and tabs show one group of nine chips at a time, so the section rendered as
 * a big empty panel and read as though there was nothing in it. The number in
 * the heading and the evidence on screen contradicted each other.
 *
 * Laid out flat, the same content becomes a wall of capability you take in
 * without reading, which is exactly how a breadth claim should land. It costs
 * more vertical space than the tabs did and earns it.
 *
 * Chips are deliberately un-interactive: they are evidence, not navigation.
 * Making a hundred of them clickable would promise a hundred pages.
 * ========================================================================= */
export function IndustryGrid() {
  return (
    <section
      className="border-y border-ink-200 bg-surface py-12 sm:py-14 lg:py-16"
      aria-label="Industries served"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
            {/* Rounded DOWN to the nearest ten, so the claim stays true as
                the list changes — 101 reads as "100+", never "101+", which
                sounds like it was counted rather than mapped. */}
            {Math.floor(industryCount / 10) * 10}+ industries, one engine
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
            India doesn&rsquo;t run on one kind of company.
            <br className="hidden sm:block" /> Neither does EZER.
          </h2>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-600">
            We mapped HR, payroll and compliance challenges across more than a
            hundred Indian industries — from a twelve-branch NBFC to a
            three-shift factory floor — before writing the rules engine. This is
            who EZER was built for. Don&rsquo;t see your exact industry?
            It&rsquo;s probably still covered.
          </p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {industryCategories.map((category, i) => (
            <div
              key={category.name}
              data-reveal=""
              style={{ transitionDelay: `${(i % 3) * 45}ms` }}
            >
              <h3 className="border-t-2 border-brand-600 pt-3 text-[0.98rem] font-bold text-ink-900">
                {category.name}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {category.industries.map((industry) => (
                  <li
                    key={industry}
                    className="rounded-md bg-brand-50 px-2.5 py-1 text-[0.74rem] font-medium text-ink-700 ring-1 ring-brand-100"
                  >
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The line that turns a list into an argument. Naming a hundred
            sectors proves nothing on its own; saying what differs between them
            is the part that shows we have run payroll in them. */}
        <p className="mx-auto mt-12 flex max-w-3xl items-start gap-2.5 rounded-lg bg-brand-50 px-5 py-4 text-sm leading-relaxed text-ink-700 ring-1 ring-brand-100">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          Rules apply differently to an IT office, a factory, a warehouse and a
          BFSI branch. EZER&rsquo;s compliance engine is configured per industry
          and per establishment type — never a single generic template stretched
          across your whole company.
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-base font-semibold text-brand-700 hover:text-brand-800"
          >
            What changes between sectors
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
