import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { MeshField } from "@/components/ui/MeshField";

/* ============================================================================
 * The four establishment types, shown as themselves.
 *
 * WHAT CHANGED, AND WHY IT IS BETTER
 *
 * This was a two-row marquee of nine office photographs drifting past. The
 * heading said "Corporate offices, plants, warehouses, branches" and the
 * pictures showed none of those things — they were all people at desks in the
 * same kind of room. The motion was also doing the work that the content
 * should have been doing: nine frames moving to disguise that they all said
 * the same thing.
 *
 * These five frames ARE the four establishment types. So the section can now
 * be static, which is the right answer: a reader comparing "does this cover my
 * plant?" wants to look at the plant, not chase it across the screen. A
 * carousel is for when you have more content than room; here there are exactly
 * four types and room for four cards.
 *
 * The remaining motion is entrance and hover only — nothing moves on its own.
 *
 * Each card also carries the act that governs it, because that is the actual
 * claim underneath this section: the same platform runs a head office on
 * Shops & Establishments and a plant on the Factories Act. A picture of a
 * plant with "Factories Act" under it makes that concrete in a way the
 * drifting stock offices never could.
 *
 * The labels are HTML, not the captions that were burned into the supplied
 * files — those are cropped off. Real text is selectable, translatable,
 * announced by a screen reader, sharp at any zoom, and can carry the
 * statutory line beside it.
 *
 * SHARPNESS
 *
 * Every card is the same width on purpose. The aerial used to span two
 * columns, which meant it had to fill 1502 device pixels on a DPR-2 screen
 * from a 379-pixel original — a 3.96x browser upscale, and the blurriest
 * thing on the page. Equal cards need 730, and the files are now prepared at
 * 900 so the browser never upscales at all.
 * ========================================================================= */

type Place = {
  src: string;
  alt: string;
  name: string;
  rule: string;
};

const PLACES: Place[] = [
  {
    src: "corporate-office",
    alt: "An open-plan corporate office floor with rows of workstations",
    name: "Corporate office",
    rule: "Shops & Establishments, and the rules differ by state.",
  },
  {
    src: "executive-area",
    alt: "A boardroom and executive seating area on an upper floor of a head office",
    name: "Head office",
    rule:
      "Where the group sits — entity structure, approval chains and the " +
      "consolidated view across every site.",
  },
  {
    src: "manufacturing-plant",
    alt: "A production line inside a manufacturing plant",
    name: "Manufacturing plant",
    rule: "Factories Act — shift patterns, overtime and the muster roll.",
  },
  {
    src: "warehouse",
    alt: "Palletised stock in a warehouse inventory area",
    name: "Warehouse",
    rule: "Which act applies depends on the state and the activity on site.",
  },
  {
    src: "branch-office",
    alt: "The customer-facing counter inside a branch office",
    name: "Branch office",
    rule: "Its own PT and LWF position, set by the state it sits in.",
  },
  {
    src: "plant-aerial",
    alt: "An aerial view of a manufacturing estate with multiple plant buildings",
    name: "All of them, in one group",
    rule:
      "Each site keeps its own registrations and its own statutory position, " +
      "on one employee master — a transfer is a transfer, not a re-hire.",
  },
].map((p) => ({ ...p, src: `/photos/establishments/${p.src}.webp` }));

export function WorkplaceStrip() {
  return (
    <section
      className="relative overflow-hidden bg-canvas py-12 sm:py-14 lg:py-16"
      aria-label="The establishment types EZER runs"
    >
      {/* The mesh field, plus a light shaft. See MeshField for why this one
          is inlined while the contour and workforce backgrounds are <img>. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <MeshField idPrefix="wsp" />

        {/* A light shaft crossing the field. */}
        <span className="ez-sweep absolute inset-y-0 -left-1/4 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.6),transparent)]" />

        {/* Edge blend into the sections above and below. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-canvas)_0%,transparent_13%,transparent_87%,var(--color-canvas)_100%)]" />
      </div>

      <Container className="relative">
        <div className="relative mx-auto max-w-2xl text-center">
          {/* An EXPLICIT ellipse, not closest-side: this box is wide and
              short, and closest-side sizes the gradient to the SHORT axis, so
              the solid core stops well before the ends of the longest line.

              And a LONG falloff, not a solid core with a quick feather. The
              earlier version held opaque across two thirds of its box and
              faded over the rest — a few dozen pixels, which the eye reads as
              an edge, so the whole block looked pasted onto the background.
              Six stops over a much larger box spreads the transition across
              hundreds of pixels instead. The core is deliberately 0.96 rather
              than solid, so the mesh stays faintly visible through the middle;
              that is what makes it read as part of the field rather than a
              panel laid on top. White stops rather than canvas, because the
              mesh's own base gradient runs white to pale blue and white is
              what it blends into. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[20%] -inset-y-24 rounded-[50%] bg-[radial-gradient(ellipse_58%_62%_at_50%_50%,rgb(255_255_255/0.96)_0%,rgb(255_255_255/0.94)_30%,rgb(255_255_255/0.84)_48%,rgb(255_255_255/0.64)_62%,rgb(255_255_255/0.38)_75%,rgb(255_255_255/0.15)_88%,transparent_100%)]"
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
              Who this is for
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              Corporate offices, plants, warehouses, branches
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-700">
              The same platform runs the head office on Shops &amp;
              Establishments and the plant on the Factories Act — one employee
              master underneath both, and the statutory position worked out per
              registration.
            </p>
          </div>
        </div>

        {/* Six equal cards — a clean three-by-two. Five left the last row
            short; the sixth frame closes it without anything having to span
            two columns and upscale itself into mush. */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLACES.map((place, i) => (
            <li
              key={place.name}
              data-reveal=""
              /* Capped stagger: the cards should arrive as a group, not as a
                 queue the reader waits out. */
              style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
              className="ez-tilt group relative overflow-hidden rounded-2xl bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-16px_rgba(16,24,40,0.3)] ring-1 ring-ink-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_28px_54px_-20px_rgba(16,24,40,0.4)] hover:ring-brand-200"
            >
              <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
                <Image
                  src={place.src}
                  alt={place.alt}
                  fill
                  /* Sources are ~375px wide; a card is never rendered much
                     past that, so these are the honest breakpoints. */
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                {/* A brand wash that lifts on hover, so five frames shot in
                    different light read as one set. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-brand-900/15 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0"
                />
              </div>

              <div className="p-5">
                <h3 className="text-[1.02rem] font-bold text-ink-900">
                  {place.name}
                </h3>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink-700">
                  {place.rule}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
