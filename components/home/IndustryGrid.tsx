import Link from "next/link";
import { IndustryMarquee } from './IndustryMarquee'
import { Container } from "@/components/ui/Container";
import { LatticePlate } from "@/components/sections/LatticePlate";
import { Icon } from "@/components/ui/Icon";
import { industryCategories, industryCount } from "@/content/positioning";

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
      className="relative isolate overflow-hidden border-y border-white/10 bg-dark py-14 text-white sm:py-16 lg:py-20"
      aria-label="Industries served"
    >
      <LatticePlate />

      <Container className="relative">
        <div className="relative mx-auto max-w-3xl text-center">
          {/* No local scrim: see the note on the plate above. */}
          <div className="relative">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-brand-200 [text-shadow:0_1px_3px_rgb(7_12_24/0.95),0_2px_14px_rgb(7_12_24/0.85)]">
              {/* Rounded DOWN to the nearest ten, so the claim stays true as
                the list changes — 101 reads as "100+", never "101+", which
                sounds like it was counted rather than mapped. */}
              {Math.floor(industryCount / 10) * 10}+ industries, one engine
            </p>
            <h2 className="mt-3 text-[2rem] font-bold leading-[1.14] text-white [text-shadow:0_1px_2px_rgb(7_12_24/1),0_3px_10px_rgb(7_12_24/0.98),0_6px_28px_rgb(7_12_24/0.95)] sm:text-[2.6rem]">
              India doesn&rsquo;t run on one kind of company.
              <br className="hidden sm:block" /> Neither does EZER.
            </h2>
            <p className="mt-5 text-[1.06rem] leading-relaxed text-white [text-shadow:0_1px_3px_rgb(7_12_24/1),0_2px_14px_rgb(7_12_24/0.95)]">
              We mapped HR, payroll and compliance challenges across more than 100
            Indian industries — from a 12-branch NBFC to a three-shift factory
            floor — before writing the rules engine. This is who we built EZER
            for. Don&rsquo;t see your exact industry below? It&rsquo;s probably
            still covered.
            </p>
            {/* The exact count, from the list itself. The eyebrow above
                rounds down on purpose; this line is where the real number
                belongs, because "and counting" is what makes it a promise
                rather than a boast. */}
            <p className="mt-3 text-[0.92rem] font-semibold text-brand-200 [text-shadow:0_1px_3px_rgb(7_12_24/0.95),0_2px_14px_rgb(7_12_24/0.85)]">
              {industryCount}{' '}
              {/* Explicit {' '}: the space between the expression and the
                  text was being eaten, rendering "101industries". */}
              industries mapped and counting — new sector rule-sets ship as
              EZER&rsquo;s client base grows.
            </p>
          </div>
        </div>

        {/* The drifting rows sit between the heading and the cards, which is
            exactly where the reference puts them: breadth at a glance first,
            then the structured list for anyone who wants to find their own
            sector in it. */}
        <IndustryMarquee onDark />

        <div className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {industryCategories.map((category, i) => (
            <div
              key={category.name}
              data-reveal=""
              style={{ transitionDelay: `${(i % 3) * 45}ms` }}
              className="ez-lattice-card relative overflow-hidden rounded-2xl border border-white/15 border-t-2 border-t-brand-500 bg-[#0b1730] p-5 shadow-[0_14px_30px_-16px_rgba(0,0,0,0.85),inset_0_1px_0_rgb(255_255_255/0.1)] backdrop-blur-md"
            >
              <h3 className="relative z-10 text-[1.05rem] font-bold tracking-[-0.01em] text-white">
                {category.name}
              </h3>
              <ul className="relative z-10 mt-3 flex flex-wrap gap-1.5">
                {category.industries.map((industry) => (
                  <li
                    key={industry}
                    /* The pills were 1.25:1 against the card — WCAG wants 3:1
                       before a boundary is perceivable at all, so a hundred of
                       them read as one grey mass rather than as a list of
                       named sectors. A real fill, a real edge and a size that
                       is not fine print. */
                    className="ez-chip rounded-md border border-white/30 bg-white/[0.17] px-2.5 py-1 text-[0.79rem] font-semibold text-white"
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
        {/* A clearing, not a card. This was an opaque white panel with a ring
            and a drop shadow — the most obviously pasted-on element in the
            section, because a hard-edged rectangle on a flowing contour field
            has no way to belong to it. The same long six-stop falloff used on
            the headers lets the contours run through the note instead; the
            icon and the narrow measure still set it apart as an aside. */}
        <div className="relative mx-auto mt-12 max-w-3xl">
          {/* No local scrim here either — same reason. */}
          <p className="relative flex items-start gap-2.5 rounded-xl border border-white/15 bg-[#0b1730] px-5 py-4 text-[0.92rem] leading-relaxed text-on-dark backdrop-blur-md">
            <Icon
              name="shield"
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-300"
            />
            Rules apply differently to an IT office, a factory, a warehouse and
            a BFSI branch. EZER&rsquo;s compliance engine is configured per
            industry and per establishment type — never a single generic
            template stretched across your whole company.
          </p>
        </div>

        {/* This is the section's only outbound action, and as a bare text link
            it disappeared under fourteen cards that all carry depth. A filled
            pill gives it the weight the position deserves. It does not compete
            with "Book a Demo" in the header — different action, different place,
            and this one is the natural next step for someone who has just
            scanned a hundred industries looking for their own. */}
        <div className="mt-10 text-center">
          <Link
            href="/industries"
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-brand-600 to-brand-700 px-7 py-3.5 text-base font-bold text-white shadow-[0_1px_2px_rgba(16,24,40,0.06),0_14px_28px_-10px_rgba(37,99,235,0.55)] ring-1 ring-brand-700/40 transition-all duration-300 hover:-translate-y-0.5 hover:from-brand-500 hover:to-brand-600 hover:shadow-[0_2px_4px_rgba(16,24,40,0.08),0_22px_40px_-12px_rgba(37,99,235,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
          >
            {/* A sheen that crosses the button on hover, clipped to the pill. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            >
              <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100" />
            </span>
            <span className="relative">What changes between sectors</span>
            <Icon name="arrow-right" className="ez-bob relative h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
