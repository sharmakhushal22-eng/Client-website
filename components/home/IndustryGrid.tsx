import Link from "next/link";
import { Container } from "@/components/ui/Container";
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
      className="relative overflow-hidden border-y border-ink-200 bg-surface py-12 sm:py-14 lg:py-16"
      aria-label="Industries served"
    >
      {/* ── The contour field, and the motion it does not ship with ────────
       *
       * The file is 40 stroked contour paths and 59KB of path data, static.
       * Inlining it to draw the contours individually would put all of that
       * in the document; the layer moves as a whole instead, and the effects
       * are built from four CSS elements on top.
       *
       * A plain <img> because it is an SVG — Next will not optimise SVG
       * without dangerouslyAllowSVG, and there is nothing to optimise. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="ez-parallax absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/contour-light.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="ez-contour absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        {/* Glows drifting over the contours, on different periods. */}
        <span
          className="ez-drift-a absolute h-[36rem] w-[36rem] rounded-full blur-3xl"
          style={{
            top: "-22%",
            right: "4%",
            background:
              "radial-gradient(circle, rgba(37,99,235,.16), transparent 70%)",
          }}
        />
        <span
          className="ez-drift-b absolute h-[30rem] w-[30rem] rounded-full blur-3xl"
          style={{
            bottom: "-24%",
            left: "3%",
            background:
              "radial-gradient(circle, rgba(103,232,249,.16), transparent 70%)",
          }}
        />

        {/* A light shaft crossing the field. */}
        <span className="ez-sweep absolute inset-y-0 -left-1/4 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.55),transparent)]" />

        {/* Lifts the whole field toward the page white so the contours read
            as a watermark rather than as a picture the text is sitting on. */}
        <span className="absolute inset-0 bg-surface/25" />
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-surface)_0%,transparent_14%,transparent_86%,var(--color-surface)_100%)]" />
      </div>

      <Container className="relative">
        <div className="relative mx-auto max-w-3xl text-center">
          <span
            aria-hidden="true"
            /* An EXPLICIT ellipse, not closest-side. This box is wide and
               short, and closest-side sizes the gradient to the SHORT axis —
               so the solid core was a narrow vertical band that had already
               faded out by the time it reached the left and right ends of the
               text. The lede is the widest line here and was the one still
               sitting on contour strokes. Sizing both axes independently is
               the fix. */
            className="pointer-events-none absolute -inset-x-[22%] -inset-y-28 rounded-[50%] bg-[radial-gradient(ellipse_58%_62%_at_50%_50%,rgb(255_255_255/0.97)_0%,rgb(255_255_255/0.95)_30%,rgb(255_255_255/0.86)_48%,rgb(255_255_255/0.66)_62%,rgb(255_255_255/0.4)_75%,rgb(255_255_255/0.16)_88%,transparent_100%)]"
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
              {/* Rounded DOWN to the nearest ten, so the claim stays true as
                the list changes — 101 reads as "100+", never "101+", which
                sounds like it was counted rather than mapped. */}
              {Math.floor(industryCount / 10) * 10}+ industries, one engine
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] text-ink-900 sm:text-4xl">
              India doesn&rsquo;t run on one kind of company.
              <br className="hidden sm:block" /> Neither does EZER.
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-700">
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
            <p className="mt-3 text-[0.92rem] font-semibold text-ink-700">
              {industryCount} industries mapped and counting — new sector
              rule-sets ship as EZER&rsquo;s client base grows.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {industryCategories.map((category, i) => (
            <div
              key={category.name}
              data-reveal=""
              style={{ transitionDelay: `${(i % 3) * 45}ms` }}
              className="ez-tilt relative rounded-2xl border-t-2 border-brand-600 bg-surface/95 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_12px_28px_-14px_rgba(16,24,40,0.28)] ring-1 ring-ink-200/70 backdrop-blur-sm hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_26px_50px_-18px_rgba(16,24,40,0.38)] hover:ring-brand-200"
            >
              <h3 className="text-[0.98rem] font-bold text-ink-900">
                {category.name}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {category.industries.map((industry) => (
                  <li
                    key={industry}
                    className="rounded-md bg-brand-50 px-2.5 py-1 text-[0.74rem] font-medium text-ink-800 ring-1 ring-brand-100"
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
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[14%] -inset-y-16 rounded-[50%] bg-[radial-gradient(ellipse_58%_62%_at_50%_50%,rgb(255_255_255/0.96)_0%,rgb(255_255_255/0.94)_30%,rgb(255_255_255/0.84)_48%,rgb(255_255_255/0.62)_62%,rgb(255_255_255/0.36)_75%,rgb(255_255_255/0.14)_88%,transparent_100%)]"
          />
          <p className="relative flex items-start gap-2.5 px-2 text-sm leading-relaxed text-ink-700">
            <Icon
              name="shield"
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"
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
