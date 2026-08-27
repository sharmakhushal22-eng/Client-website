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

  /* Section framing, ported from Website changes.html (#pricing). The figure
     itself stays unpublished — see the note at the top of this file. */
  eyebrow: 'Honest pricing, not tiered feature-gating',
  headline: 'Whether you’re 40 employees or four lakh, you get the same depth',
  lede:
    'No feature-gating designed to force an upsell once you’re locked in. Every ' +
    'module, at every size. One platform, priced per employee per month — the ' +
    'only thing that changes with scale is the support around it.',

  /* The reference's two tiers. Feature lists are verbatim; the rate is not
     rendered while pricing.disclosed is false. */
  tiers: [
    {
      name: 'EZER Platform',
      note: 'Every live module, included — from your first ten hires to your first lakh.',
      features: [
        'Recruitment, onboarding & employee master',
        'Payroll engine with full statutory compliance',
        'Attendance, leave & employee self-service',
        'Multi-company & branch architecture',
        'FBP, investment declaration & reports',
        'Loans, travel claims, HR letters & exit/FNF',
      ],
      cta: { label: 'Request a Demo', href: '/book-a-demo' },
      primary: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      note: 'Same full platform — plus dedicated support for multi-entity groups running at real scale.',
      features: [
        'Everything in EZER Platform',
        'CFO & leadership dashboards',
        'Custom industry rule sets',
        'Dedicated implementation lead & SLA',
      ],
      cta: { label: 'Talk to Us', href: '/contact' },
      primary: false,
    },
  ],

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
