import { Fragment } from "react";

/* ============================================================================
 * Words that rise into place, one after another.
 *
 * The single highest-impact piece of motion on the page, and the reason the
 * reference hero does not feel static without a photograph behind it.
 *
 * Split per WORD rather than per character. Per-character is the fashionable
 * version and it is worse here: a 12-word headline becomes 60-odd animating
 * nodes, it reads as decoration rather than as language arriving, and a
 * screen reader announces the fragments. Words keep it legible and keep the
 * node count in double figures.
 *
 * No aria-hidden and no visually-hidden duplicate. The separating spaces are
 * plain text nodes BETWEEN the spans, never inside them: .ez-word is
 * inline-block to be transformable, and an inline-block trims whitespace at
 * its own edges — a space inside the span silently disappears, and the
 * heading reads as "BuiltforeverykindofIndiancompany" to a screen reader and
 * to anyone who copies it. Kept outside, the heading's text is
 * byte-for-byte the original string — screen readers
 * concatenate inline spans and announce one sentence. (The duplicate-copy
 * trick is needed for per-CHARACTER splits, where spans cut words in half.
 * Here it only put the headline in the DOM twice, which is worse for search
 * engines and makes selecting the headline copy it twice.)
 * ========================================================================= */

export function RisingWords({
  text,
  className,
  /* Where this heading's stagger starts, so a second line can continue the
   * sequence rather than restarting it. */
  startDelay = 0,
  step = 55,
}: {
  text: string;
  className?: string;
  startDelay?: number;
  step?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className="ez-word"
            style={{ animationDelay: `${startDelay + i * step}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}
