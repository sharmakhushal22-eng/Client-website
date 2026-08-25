/* ============================================================================
 * The coffee framing — how price is talked about while the figure stays
 * unpublished.
 *
 * WHY THIS IS NOT IN site.config.ts
 *
 * The announcement bar is a client component. Anything it imports is bundled
 * and shipped to the browser, so importing `pricing` to reach `pricing.coffee`
 * dragged the whole pricing object — including pricePerEmployee — into the
 * client chunk.
 *
 * Today that leaks nothing: the rate comes from a non-public env var, so what
 * lands in the bundle is the expression rather than a number. But that is a
 * guarantee resting on env-var semantics, not on structure — anyone who later
 * hardcodes the rate back into site.config would silently publish it, and the
 * failure would be invisible in review.
 *
 * Keeping the copy in its own module means the client never has a reason to
 * import pricing at all.
 *
 * ⚠ Keep this honest against whatever PRICE_PER_EMPLOYEE ends up being. A
 * comparison that stops being true is worse than no comparison, because it is
 * the sentence people quote back at you.
 * ========================================================================= */

export const coffee = {
  /* One line, for the announcement bar. */
  bar: 'One coffee a month. Per employee. That is the whole price.',
  barCta: 'Pre-register before it goes public',

  /* The fuller version, for the pricing teaser. */
  headline: 'Priced like a coffee, not like enterprise software',

  /* What the comparison is against, stated so the claim is checkable rather
   * than rhetorical — a reader who thinks "that cannot be right" should be
   * able to see exactly what is being compared. */
  compare: [
    { label: 'One café coffee', detail: 'Once. Gone in ten minutes.' },
    {
      label: 'EZER, per employee',
      detail: 'A full month of payroll, compliance and self-service.',
    },
  ],
} as const
