import { Container } from "@/components/ui/Container";
import { MeshField } from "@/components/ui/MeshField";
import { SectionHeading } from "@/components/ui/Section";

/* ============================================================================
 * "See it working" — three animated scenes from the EZER Visual Kit.
 *
 * These are the kit's `product/` (blue, #2563EB) variants, which is the same
 * hex this site already runs. The kit also ships a violet `marketing/` set;
 * its own BRAND-AUDIT.md flags that shipping both is the reason the pitch and
 * the product currently read as two companies, and recommends blue. That
 * matches the decision already made here, so the violet set is not used.
 *
 * WHY <img> AND NOT INLINE SVG
 *
 * Each file carries its own <style> block with the animation in it, so it
 * animates as a plain <img> with no JavaScript and no inlining — and, more
 * importantly, its @media (prefers-reduced-motion: reduce) rule travels with
 * it. Inlining them into the page would mean 3 × ~6KB of markup in the HTML
 * and hand-porting three reduced-motion blocks. As images they are cached,
 * lazy-loaded and self-contained.
 *
 * The scene files are the ones drawn from the app export, so the figures in
 * them — 398 employees, ₹4.82 Cr, the Factories Act rule set — are EZER's
 * own instance rather than invented numbers. CLAIMS.md lists those as
 * publishable today. The kit's chart/ files are NOT used anywhere: they ship
 * with placeholder benchmarks that its README says to replace before
 * publishing, and invented benchmarks on a live B2B site are a liability.
 * ========================================================================= */

const SCENES = [
  {
    src: "/kit/scenes/scene-payroll-close.svg",
    /* Descriptive, because the picture is carrying an argument rather than
       decorating one. A screen reader user should get the claim, not "image". */
    alt:
      "A payroll run closing for October — 398 employees, ₹4.82 crore net " +
      "payable, progressing to issued.",
    title: "The month closes in one pass",
    body:
      "Gross, deductions, employer contributions and every applicable statutory " +
      "head calculated together, with a variance view against last month. You " +
      "approve the differences rather than re-checking the whole file.",
  },
  {
    src: "/kit/scenes/scene-factory-punch.svg",
    alt: "A shop-floor punch-in against a Factories Act rule set, shift 09:30 to 18:30.",
    title: "The rule set follows the location",
    body:
      "A plant runs on the Factories Act and a branch office on Shops & " +
      "Establishments. Both sit in the same company, on the same employee " +
      "master, and the shift rules applied are the ones the location actually " +
      "falls under.",
  },
  {
    src: "/kit/scenes/scene-field-claim.svg",
    alt:
      "A field employee submitting a travel claim from a phone, with the GPS " +
      "trail drawn beside them.",
    title: "The claimed distance is not the paid distance",
    body:
      "Field staff see live distance on the phone, and that number never " +
      "reaches the claim. The server re-measures the submitted trail on its " +
      "own, prices it from the policy rate card, and flags implausible speeds " +
      "or gaps in the trail before anyone approves it.",
  },
];

export function InPractice() {
  return (
    <section
      className="relative overflow-hidden bg-surface py-12 sm:py-14 lg:py-16"
      aria-label="EZER in practice"
    >
      {/* The mesh field. Second instance on this page, hence the idPrefix —
          two copies sharing gradient ids would silently paint from whichever
          appeared first. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <MeshField idPrefix="prc" />
        <span className="ez-sweep absolute inset-y-0 -left-1/4 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.6),transparent)]" />
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-surface)_0%,transparent_13%,transparent_87%,var(--color-surface)_100%)]" />
      </div>

      <Container className="relative">
        <div className="relative">
          {/* Explicit ellipse, and NO negative z-index — at -z-10 a clearing
              drops behind the section's own artwork instead of sitting behind
              its sibling text, because this wrapper is z-index:auto and
              creates no stacking context. Paint order does it: clearing
              first, content after, both positioned. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[24%] -inset-y-28 rounded-[50%] bg-[radial-gradient(ellipse_56%_60%_at_50%_50%,rgb(247_250_254/0.88)_0%,rgb(247_250_254/0.85)_32%,rgb(247_250_254/0.74)_50%,rgb(247_250_254/0.55)_64%,rgb(247_250_254/0.33)_77%,rgb(247_250_254/0.13)_89%,transparent_100%)]"
          />
          <div className="relative">
            <SectionHeading
              eyebrow="In practice"
              title="What it actually looks like on a working month"
              lede="Three of the moments the platform is built around — not screenshots of a settings page."
              onPattern
            />
          </div>
        </div>

        <ul className="mt-12 grid gap-8 lg:grid-cols-3">
          {SCENES.map((scene, i) => (
            <li
              key={scene.title}
              data-reveal=""
              style={{ transitionDelay: `${i * 90}ms` }}
              className="ez-tilt group relative flex flex-col overflow-hidden rounded-2xl bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-16px_rgba(16,24,40,0.3)] ring-1 ring-ink-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_28px_54px_-20px_rgba(16,24,40,0.4)] hover:ring-brand-200"
            >
              {/* Plain <img>, not next/image: these are SVGs whose animation
                  and reduced-motion rule live inside the file. Routing an SVG
                  through the image optimizer is a no-op at best, and the
                  optimizer is the thing that silently failed on the brand
                  mark earlier in this build. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scene.src}
                alt={scene.alt}
                width={600}
                height={430}
                loading="lazy"
                decoding="async"
                /* Fixed 3:2 box with object-contain. The three source files
                   are 600x420, 560x440 and 600x440 — left to their natural
                   heights the artwork bottoms out at three different points
                   and the headings below refuse to line up across the row. */
                className="aspect-[3/2] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-ink-900">
                  {scene.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-700">
                  {scene.body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* The travel-claim flow is built but has never been run end to end —
            travel_claims is empty. So the copy above describes how it works
            and this line keeps it honest, rather than implying a track record
            that does not exist yet. */}
        <p className="relative mx-auto mt-8 max-w-3xl text-center text-[0.82rem] leading-relaxed text-ink-600">
          Illustrative. Figures shown are from EZER&rsquo;s own instance — three
          companies, 398 employees — not a customer&rsquo;s.
        </p>
      </Container>
    </section>
  );
}
