import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";

/* ============================================================================
 * THE BRAND — emblem, wordmark and tagline as ONE entity.
 *
 * Treat this as a single object. It has exactly one control: `size`. Change
 * that and the emblem, the name, the tagline, the gap between them and the
 * alignment offset all move together, in proportion, with the E still
 * bracketing the wordmark's cap and the tagline's baseline.
 *
 * HOW THAT IS GUARANTEED
 *
 * `size` is set as the root font-size, and every dimension below is written
 * in `em`. Not one pixel or rem value appears inside the lockup. em resolves
 * against that single root, so the whole thing is one scalable drawing rather
 * than six numbers that have to be kept in step by hand — which is what it
 * was, and why each adjustment kept breaking the alignment.
 *
 * The ratios are measured, not chosen. With the wordmark as 1em:
 *
 *     emblem height   2.7548em
 *     gap             0.4699em
 *     text offset     0.9175em
 *     wordmark        1em
 *     tagline         0.3759em
 *
 * WHERE THE EMBLEM RATIO COMES FROM
 *
 * ezer-mark-tight.png is 162x240 and carries 48px of TRANSPARENT PADDING at
 * the top, so its box is always larger than its ink. Measured from the file:
 * the E and its swoosh occupy rows 103-224 — 50.8% of the image height,
 * starting 42.9% down it. The people cluster sits above.
 *
 * So for the E alone to span the wordmark's cap down to the tagline's
 * baseline, the image box must be that span / 0.508, and must be placed so
 * the 42.9% mark lands on the cap. 2.7548em and 0.9175em are those two
 * numbers solved at the current type sizes. Do not round them.
 *
 * TO RESIZE: change `size` only.
 * ========================================================================= */

/** The emblem alone — people, orbit and the leaf-form E. */
export function BrandMark({
  className = "h-[2.7548em] w-auto",
}: {
  className?: string;
}) {
  return (
    <Image
      src="/brand/ezer-mark-tight.png"
      alt=""
      aria-hidden="true"
      width={162}
      height={240}
      /* The one image guaranteed to be in the viewport on every page, so it
         is never lazy — a header logo that pops in is the first thing a
         visitor sees go wrong. */
      priority
      /* Straight from /public, no optimizer round trip. A fixed small brand
         asset gains nothing from the resizer and costs a request. */
      unoptimized
      className={`${className} select-none object-contain`}
    />
  );
}

export function Brand({
  onDark = false,
  showTagline = true,
  /* THE one control. Any CSS length, or a responsive font-size utility
     string — because everything inside is em, a single responsive class here
     rescales the entire lockup at each breakpoint. */
  size = "text-[1.05rem] lg:text-[1.02rem] xl:text-[1.33rem]",
  href = "/",
}: {
  onDark?: boolean;
  /* false in /admin, where the chrome is deliberately plain. */
  showTagline?: boolean;
  size?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      /* items-start, not center: the emblem is positioned by the offset
         below, not centred against the text. Centring is what let the E
         drift off the cap line. */
      className={`group inline-flex shrink-0 items-start gap-[0.4699em] ${size}`}
      aria-label={`${site.name} — home`}
    >
      <BrandMark className="h-[2.7548em] w-auto shrink-0 transition-transform duration-200 group-hover:scale-[1.05]" />

      {/* The offset that does the alignment: it drops the text so the
          wordmark's cap meets the top of the E. See the header note. */}
      <span className="mt-[0.9175em] whitespace-nowrap leading-tight">
        {/* Set the way the artwork sets it: EZER in ink, HRMS in brand blue. */}
        <span
          className={`block text-[1em] font-extrabold uppercase leading-[1.25] tracking-[-0.015em] ${
            onDark ? "text-white" : "text-ink-900"
          }`}
        >
          Ezer{" "}
          <span className={onDark ? "text-brand-400" : "text-brand-600"}>
            HRMS
          </span>
        </span>

        {showTagline && (
          /* Tracked out so a small line reads as a considered second element
             rather than shrunken body copy. The tracking is em of the
             TAGLINE, so it scales with the lockup too.

             DARKER AND HEAVIER, and the weight is the part doing the work.
             Contrast was already 7.6:1 on white and 10.6:1 on the footer —
             both well past the 4.5:1 floor — so the colour was never what
             made it hard to read. At the header's size this line renders
             around 8px, and below roughly 10px a 400-weight stroke thins out
             until it greys regardless of what colour it is nominally set in.
             600 puts ink back in the stems; ink-800 and full-strength
             on-dark then sharpen what is there.

             Weight and colour do not move the baseline, so the emblem
             alignment solved in the header note is untouched. */
          <span
            className={`block text-[0.3759em] font-semibold uppercase leading-[1.45] tracking-[0.115em] ${
              onDark ? "text-on-dark" : "text-ink-800"
            }`}
          >
            {site.tagline}
          </span>
        )}
      </span>
    </Link>
  );
}

/** The full stacked lockup, for places with vertical room. */
export function BrandLockup({
  onDark = false,
  className = "h-24 w-auto",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={onDark ? "/brand/ezer-lockup-dark.png" : "/brand/ezer-lockup.png"}
      alt={`${site.name} — People · Process · Performance`}
      width={900}
      height={575}
      className={`${className} select-none object-contain`}
    />
  );
}
