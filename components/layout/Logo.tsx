import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";

/* ============================================================================
 * The EZER logo — now the real one.
 *
 * What was here before was a stand-in I drew: a blue tile with an E of three
 * bars and a gold dot. It was never the brand, and its own comment carried a
 * TODO saying so. This renders the actual mark.
 *
 * WHY THE EMBLEM IS AN IMAGE AND THE WORDMARK IS TEXT
 *
 * The supplied artwork is a STACKED lockup — emblem, then EZER, then HRMS
 * between rules, then PEOPLE · PROCESS · PERFORMANCE — at roughly 1.57:1.
 * Dropped whole into a 40px header bar it would come out about 63px wide and
 * the tagline would be sub-pixel. Stacked lockups are for footers, OG cards
 * and print, not for a horizontal nav.
 *
 * So the header takes the emblem (which is square, and is the part that
 * carries recognition) and sets the wordmark as live text beside it. That
 * also means the wordmark is crisp at every zoom level, recolours itself for
 * dark mode, and is selectable and readable by a screen reader — none of
 * which a flattened PNG of the same words would be.
 *
 * The full lockup is still shipped at /brand/ezer-lockup.png and is used
 * where there is vertical room for it.
 *
 * DARK MODE
 *
 * The emblem is bright blue throughout and needs no variant — it reads on
 * white and on the dark bands equally. Only the wordmark changes, and it
 * changes in CSS. (The dark LOCKUP file exists for the same reason: its ZER
 * and tagline are near-black navy, which disappears on a dark ground.)
 * ========================================================================= */

/** The emblem alone — people, orbit and the leaf-form E. */
export function LogoMark({
  className = "h-10 w-auto",
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
      /* Straight from /public, no optimizer round trip. The source is already
         a 180px square weighing 30KB and it renders at 40px; running a fixed
         small brand asset through the resizer adds a request and a cache
         entry to save nothing. */
      unoptimized
      className={`${className} select-none object-contain`}
    />
  );
}

export function Logo({
  onDark = false,
  showTagline = true,
}: {
  onDark?: boolean;
  /* true      — always shown (the footer, which has room)
   * false     — never (admin chrome, deliberately plain)
   * 'exceptLg'— shown, but not through the crowded lg band (the header)
   *
   * It used to be off in the header entirely, on the grounds that the nav is
   * crowded. But the emblem is 48px and portrait, and one line of type beside
   * it left an obvious band of empty space under the name — the tagline is
   * the second line the lockup was drawn with, and putting it back is what
   * squares the text block against the mark.
   *
   * The lg carve-out is measured, not taste: see the note on the span. */
  showTagline?: boolean | "exceptLg";
}) {
  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center gap-2.5 xl:items-start"
      aria-label={`${site.name} — home`}
    >
      {/* Sized by HEIGHT, not forced into a square: the ink is portrait,
          roughly 2:3.

          THE xl SIZE IS DERIVED, NOT PICKED. Measuring the artwork, the E
          and its swoosh occupy rows 103-224 of the 240px image — 50.8% of
          the box, starting at 42.9% down it. The rest is the people cluster
          above, plus 48px of transparent padding at the top, which is why
          the emblem read as small: a 48px box was only ever showing ~35px
          of ink.

          For the E alone to span the cap of EZER down to the baseline of
          INDIA — a measured 28.5px at the type sizes below — the image box
          has to be 28.5 / 0.508 = 56px. Hence h-14 at xl.

          Not applied below xl: 56px is 88% of the 64px mobile bar, which
          leaves the emblem touching both edges. Those widths keep the older
          centred arrangement. */}
      <LogoMark className="h-11 w-auto shrink-0 transition-transform duration-200 group-hover:scale-[1.05] xl:h-14" />
      {/* The offset that does the alignment.

          The E starts 42.9% down the emblem: 0.429 x 56 = 24.0px from its
          top. EZER's cap sits 0.27em below its own line-box top, which at
          1.33rem is 5.7px. So the text block starts 24.0 - 5.7 = 18.3px
          lower than the emblem — 1.15rem. Anything else and the E floats
          against the type instead of bracketing it. */}
      <span className="whitespace-nowrap leading-tight xl:mt-[1.15rem]">
        {/* Set the way the artwork sets it: EZER in ink, HRMS in brand blue.
            Uppercase with tight tracking to echo the heavy geometric
            wordmark, rather than the lowercase "ezer hrms" that was here
            when the mark was a placeholder. */}
        {/* Sized against two things that were both measured, not guessed.
 
            Against the EMBLEM: the two-line text block comes out 43px
            against the 48px mark, so it sits inside the mark's height rather
            than overhanging it. 1.9rem put the block at 52px — 107% — which
            is what made the type look like it was bursting out of the
            lockup.

            Against the NAV: items there are 15.2px. At 1.9rem the wordmark
            was exactly 2x that and read as shouting; 1.55rem is about 1.6x,
            which is the ratio a wordmark normally holds over the navigation
            beside it.

            The lg step down is not cosmetic. Measured at that breakpoint the
            header already needs ~1032px of content in the 960px available:
            logo 158 + nav 510 + phone and CTA 364. It is over-subscribed
            there BEFORE any of this, and every item carries shrink-0, so a
            larger logo pushes an existing overflow further. */}
        <span
          className={`block text-[1.35rem] font-extrabold uppercase tracking-[-0.015em] lg:text-[1.3rem] xl:text-[1.33rem] ${
            onDark ? "text-white" : "text-ink-900"
          }`}
        >
          Ezer{" "}
          <span className={onDark ? "text-brand-400" : "text-brand-600"}>
            HRMS
          </span>
        </span>
        {showTagline && (
          /* Tracked out and sized to sit under the wordmark rather than
             compete with it: the letter-spacing is what makes a small line
             read as a considered second element instead of shrunken body
             copy. It scales with the wordmark across the same breakpoints so
             the two-line block stays proportioned at each one. */
          <span
            /* HIDDEN AT lg ONLY, and that is measured, not taste.
             *
             * The tagline is the WIDER of the two lines — tracked-out
             * uppercase beats the wordmark even at 1.9rem — so it, not the
             * name, sets the logo's width. Showing it takes the header logo
             * from 158px to 212px, and at lg the header already needs about
             * 1032px of content in the 960px available. 54px more would make
             * a live overflow materially worse.
             *
             * So: visible on mobile, where the nav is behind a hamburger and
             * there is room; hidden through the crowded lg band, which is
             * exactly what the header does today; back at xl, where it fits.
             */
            className={`block text-[0.52rem] uppercase tracking-[0.11em] xl:text-[0.5rem] xl:tracking-[0.115em] ${
              showTagline === "exceptLg" ? "lg:hidden xl:block" : ""
            } ${onDark ? "text-on-dark-muted" : "text-ink-600"}`}
          >
            {site.tagline}
          </span>
        )}
      </span>
    </Link>
  );
}

/** The full stacked lockup, for places with vertical room. */
export function LogoLockup({
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
