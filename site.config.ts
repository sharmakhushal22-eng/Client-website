/* ============================================================================
 * site.config.ts — every value on this site that is a business fact.
 *
 * Sourced from EZER-Website-Developer-Handoff.docx (August 2026) where the
 * handoff states a fact. Anything the handoff does not state is still marked
 * TODO — those are placeholders nobody could invent responsibly.
 *
 * Search for "TODO" to find them all.
 * ========================================================================= */

export const site = {
  name: 'EZER HRMS',
  /* Handoff §1: intended domain is ezerhrms.com. Override with
   * NEXT_PUBLIC_SITE_URL rather than editing code. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ezerhrms.com',

  /* The product application — a separate codebase, deliberately on a separate
   * host. Handoff §1: "Do not merge the two." It is live today on Vercel;
   * point NEXT_PUBLIC_APP_URL at app.ezerhrms.com once that DNS is cut over. */
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://ezer-hrms-chi.vercel.app',

  /* The product's own tagline, from the HRMS login screen — kept identical so
   * the two properties read as one company. */
  tagline: "India's Intelligent HR Platform",

  /* The headline claim. Note it is a "first" claim: a competitor can contest
   * it publicly, so make sure someone is comfortable defending it. */
  headline: "India's first HRMS, payroll and HR compliance engine",

  positioning:
    'EZER runs payroll and statutory compliance for Indian companies that operate ' +
    'in more than one place — corporate office, branches, factories, warehouses, ' +
    'across more than one legal entity — from a single system built on the new ' +
    'labour codes rather than retrofitted to them.',

  description:
    'EZER HRMS is an Indian HR, payroll and compliance engine. Run every company ' +
    'in the group from one operation, apply each state’s rules at the location ' +
    'they belong to, and hold the statutory position for all of them in one place.',
} as const

/* ── Contact ───────────────────────────────────────────────────────────────
 * Handoff §1 and §8: one number carries both call and WhatsApp sitewide.
 * Handoff §6 records that no contact inbox existed at handoff time; §7 lists
 * "set up a real contact inbox (e.g. hello@ezerhrms.com)" as a launch task. */
export const contact = {
  phoneDisplay: '+91 87967 46222',
  phoneE164: '+918796746222',
  whatsappE164: '918796746222',           // wa.me format, no +

  /* ⚠ Handoff §6: at handoff time NO contact inbox existed — the site ran on
   * phone and WhatsApp alone, and §7 lists "set up a real contact inbox" as a
   * launch task.
   *
   * While `emailsLive` is false, the site does not publish a single mailto:
   * link. This is deliberate. A published address that nobody reads loses
   * enquiries silently, which is the same failure the handoff flags about the
   * WhatsApp-only form: the lead is gone and there is no record anywhere.
   *
   * Flip this to true only when all four mailboxes below exist AND somebody
   * is rostered to read them. */
  emailsLive: false,

  salesEmail: 'sales@ezerhrms.com',       // TODO confirm the mailbox exists
  supportEmail: 'support@ezerhrms.com',   // TODO confirm
  partnerEmail: 'partners@ezerhrms.com',  // TODO confirm
  privacyEmail: 'privacy@ezerhrms.com',   // TODO confirm

  businessHours: 'Monday to Saturday, 9:30 am – 6:30 pm IST',
  /* Do not publish a number nobody is rostered to meet. */
  responseSla: 'within 4 business hours',

  whatsappPrefill:
    "Hi, I'd like to see EZER HRMS for my company.",
} as const

/* ── Legal entity ──────────────────────────────────────────────────────────
 * Indian B2B buyers check for a registered address, CIN and GST before a
 * first call. An address-less footer reads as a shell company.
 *
 * The handoff does not carry any of these, so they remain TODO. */
export const company = {
  legalName: 'TODO Private Limited',      // TODO registered entity name
  cin: 'TODO',                            // TODO Corporate Identity Number
  gstin: 'TODO',                          // TODO GST number
  registeredAddress: {
    line1: 'TODO address line 1',
    line2: 'TODO address line 2',
    city: 'TODO',
    state: 'TODO',
    pincode: 'TODO',
    country: 'India',
  },
  /* DPDP Act 2023 requires a NAMED grievance officer with reachable contact
   * details, not a generic inbox. */
  grievanceOfficer: {
    name: 'TODO full name',
    email: 'grievance@ezerhrms.com',      // TODO confirm
    phone: contact.phoneDisplay,
  },
  /* Confirmed from the product's own login screen: "Data stored in India —
   * Mumbai Server". IT gatekeepers ask this first. */
  dataResidency: 'India (Mumbai)',
  foundedYear: 2024,                      // TODO confirm
} as const

/* ── Brand pillars ─────────────────────────────────────────────────────────
 * The EZER acronym, taken verbatim from the product's login screen. Reusing
 * it means a visitor who sees the marketing site and then logs into the app
 * meets the same four promises rather than two different pitches. */
export const ezerPillars = [
  {
    letter: 'E',
    title: 'Empower Employees',
    desc: 'Self-service · ESS · Anytime anywhere',
  },
  {
    letter: 'Z',
    title: 'Zero Compliance Risk',
    desc: 'EPF · ESIC · PT · Factory Act · All Indian HR law complied',
  },
  {
    letter: 'E',
    title: 'Efficient Payroll',
    desc: 'AI-powered · Zero errors · Auto salary processing',
  },
  {
    letter: 'R',
    title: 'Retain Top Talent',
    desc: 'Hire to retire · Engage · Recognize',
  },
] as const

/* ── Trust badges ──────────────────────────────────────────────────────────
 * These three already appear on the product's login screen, so they are the
 * company's stated public position rather than claims invented for this site.
 *
 * ⚠ TODO before launch: confirm the SOC 2 Type 2 certification is current and
 * that you can produce the report on request. An expired or aspirational
 * certification claim is the one thing on this page that could become a legal
 * problem. Set `verified` to false and the badge stops rendering. */
export const trustBadges = [
  { icon: 'lock' as const, label: 'SOC 2 Type 2 compliant', verified: true },
  { icon: 'map-pin' as const, label: 'Data stored in India — Mumbai', verified: true },
  { icon: 'shield' as const, label: 'DPDP Act 2023 compliant', verified: true },
] as const

/* Handoff §6: the YouTube channel and LinkedIn page were both still
 * placeholders. Blank strings hide the links rather than rendering a dead
 * one, which is the worse of the two failures. */
export const social = {
  linkedin: '',   // TODO real company page
  twitter: '',
  youtube: '',    // TODO real channel
} as const

/* ── Pricing ───────────────────────────────────────────────────────────────
 * ONE PLAN. This is a positioning decision, not a packaging convenience.
 *
 * Tiered HRMS pricing puts statutory compliance in the upper tier, which
 * means the smallest customer — the one least able to absorb a PF notice —
 * gets the weakest compliance. EZER prices the whole product at one rate and
 * lets headcount do the scaling.
 *
 * Handoff §6 records the current per-employee figure as "carried over from
 * earlier market benchmarking — confirm this is the final number before it's
 * public." The figure itself is not in this file; it comes from
 * PRICE_PER_EMPLOYEE in .env.local, because this repo is public.
 * ⚠ CONFIRM BEFORE LAUNCH. */
export const pricing = {
  /* ⚠ NOT PUBLIC YET.
   *
   * While this is false the site shows that a price EXISTS but never renders
   * the figure. That is a real guarantee, not a CSS blur: the number is not in
   * the HTML, not in the client JS bundle, and not in the JSON-LD offers block.
   * A blur alone would be cosmetic — anyone could read it from view-source, and
   * Google would still index it.
   *
   * Flip to true only once the rate is signed off (handoff §6 flags the
   * current figure as carried over benchmarking, unconfirmed). Everything else
   * on the pricing page — the one-plan argument, what is included, the
   * calculator UI — keeps working either way. */
  disclosed: false,

  currency: '₹',
  annualDiscountPct: 20,
  minEmployees: 50,
  gstNote: 'All prices are exclusive of 18% GST.',

  plan: {
    id: 'complete',
    name: 'EZER Complete',
    tagline: 'The entire product. Every module, every statutory head, one rate.',
    /* Per employee per month, on annual billing.
     *
     * Deliberately NOT a literal. This repository is public, and a number
     * committed to source is readable forever — git history keeps it even
     * after the line is deleted. The rate lives in .env.local, which is
     * gitignored.
     *
     * Null when unset, which every consumer already handles: the pricing page
     * and calculator fall back to their undisclosed state rather than break.
     *
     * ⚠ handoff §6 — the figure is carried over from earlier benchmarking and
     * is still unconfirmed. Set PRICE_PER_EMPLOYEE and flip `disclosed` only
     * once it is signed off. */
    pricePerEmployee: Number(process.env.PRICE_PER_EMPLOYEE) || null,
    minEmployees: 50,
    implementationFee: 0,
    bestFor: 'Any company from 50 employees, in any number of states',

    /* Deliberately grouped rather than a flat list of forty modules. A buyer
     * scanning for "is my thing in here" finds the group, not the bullet. */
    includes: [
      { group: 'Hire & onboard', detail: 'Requisition workflow, candidate pipeline, offer letters, onboarding portal, document verification' },
      { group: 'Employee master', detail: 'One record per person across every entity, transfers, policies, letters, roles and rights' },
      { group: 'Time', detail: 'Shifts, rosters, biometric import, regularisation, overtime, leave, location holiday calendars' },
      { group: 'Payroll', detail: 'Full run cycle, arrears, loans, payslips, full & final settlement' },
      { group: 'Statutory', detail: 'EPF, ESIC, Professional Tax, LWF, TDS both regimes, Form 16, gratuity, bonus, employer NPS' },
      { group: 'Claims', detail: 'Flexi benefits, investment proofs, GPS-measured travel claims, Finance approval queue' },
      { group: 'Self-service', detail: 'ESS portal, payslips, tax declarations, leave, documents, support desk' },
      { group: 'Control', detail: 'Compliance position, reports per entity or consolidated, full data export' },
    ],

    /* The commercial promises, stated as the things a buyer is usually
     * charged for elsewhere. */
    guarantees: [
      'Implementation, configuration and migration — included, not quoted separately',
      'Unlimited legal entities and locations on the same subscription',
      'Every module included. Nothing is gated behind a higher plan',
      'Training for your HR and Finance team, and ESS rollout to employees',
      'Product updates for the life of the subscription',
      'Your data exportable at any time, and on exit, at no charge',
    ],
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'When procurement, security review and integration get involved.',
    bestFor: 'Groups above ~2,000 employees, or where IT owns the decision',
    /* Everything in the plan, plus: */
    adds: [
      'Single sign-on and directory sync',
      'Custom approval chains and delegation matrices',
      'Bespoke reports and API access to your own data',
      'Dedicated implementation manager and a named support contact',
      'Security review, DPA and vendor-onboarding paperwork',
      'Volume rate on headcount',
    ],
  },

  /* Be explicit about the boundary. Every unpleasant surprise in a software
   * contract is something that was on it and never stated. */
  included: [
    'Implementation and configuration of your salary structures, leave policy and shift patterns',
    'Migration of employee master, salary structures, opening leave balances and year-to-date payroll',
    'One full payroll cycle run in parallel with your existing process, reconciled line by line',
    'Training for your HR and Finance team, and ESS credentials issued to employees',
    'All product updates during your subscription',
    'Support over phone, WhatsApp and the in-app support desk',
  ],
  notIncluded: [
    'Custom development, bespoke reports and API access (Enterprise)',
    'Integration with systems we do not already connect to',
    'On-site training and travel, quoted separately',
    'Statutory filing fees and challan amounts payable to the government',
    'GST, charged at the applicable rate',
  ],
} as const

/* ── Trust bar ─────────────────────────────────────────────────────────────
 * Handoff §6: "No real customers yet." Until there are, this section falls
 * back to the product's own certifications, which are true today.
 *
 * showClientLogos stays false until you have WRITTEN permission from the
 * customer whose logo you are about to publish. */
export const trust = {
  showClientLogos: false,
  stats: [
    { value: 'TODO', label: 'companies run payroll on EZER' },  // TODO
    { value: 'TODO', label: 'employees paid every month' },     // TODO
    { value: 'TODO', label: 'states covered for PT and LWF' },  // TODO
  ],
  clientLogos: [] as Array<{ name: string; src: string }>,
}

/* ── Booking ───────────────────────────────────────────────────────────────
 * Leave calendarUrl empty and /book-a-demo falls back to the qualifying form
 * alone, which still captures the lead — so the page works before the
 * calendar exists. */
export const booking = {
  calendarUrl: process.env.NEXT_PUBLIC_CALENDAR_URL ?? '',  // TODO
  durationMinutes: 30,
  whatHappens: [
    'Thirty minutes in the live product. Not a slide deck, and not a recorded video.',
    'We ask first: how many entities, which states, how many employees, what you run payroll on today.',
    'Then we show your case — your salary structure, your statutory setup, your locations.',
    'A product specialist joins, and a compliance specialist too if payroll is the focus.',
    'You leave with a written summary and an indicative number the same day.',
  ],
  reassurance:
    "No obligation, no credit card, and we won't add you to a mailing list without asking.",
} as const

/* ── Analytics ─────────────────────────────────────────────────────────────
 * Handoff §7 lists analytics as a launch task. These load ONLY after cookie
 * consent. Leave blank to disable entirely. */
export const analytics = {
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? '',            // TODO 'G-XXXXXXX'
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? '',    // TODO
} as const

/* ── Placeholder guards ────────────────────────────────────────────────────
 *
 * The legal-entity block above is still TODO, and until somebody fills it in
 * the site must not print it. This is not tidiness — before this guard existed
 * the footer rendered "TODO Private Limited" on every page AND emitted it as
 * the Organization name in JSON-LD, which is the string a search engine would
 * have indexed as the company's legal name.
 *
 * Anything that renders company details checks these first. Fill in
 * site.config and they light up on their own; no component needs editing. */
const looksPlaceholder = (value: string) =>
  !value || value.trim() === '' || value.toUpperCase().includes('TODO')

export const companyDetails = {
  /* Is the registered-entity name usable? */
  hasLegalName: !looksPlaceholder(company.legalName),
  hasCin: !looksPlaceholder(company.cin),
  hasGstin: !looksPlaceholder(company.gstin),
  hasAddress: !(
    [
      company.registeredAddress.line1,
      company.registeredAddress.city,
      company.registeredAddress.state,
      company.registeredAddress.pincode,
    ] as string[]
  ).some(looksPlaceholder),
} as const

/* What to show as the entity name while the real one is unknown: the brand,
 * which is at least true. */
export const displayLegalName = companyDetails.hasLegalName
  ? company.legalName
  : site.name

/* For legal pages, which cannot simply hide a clause the way marketing copy
 * hides a section — a privacy policy with the controller's name omitted is not
 * a shorter policy, it is an invalid one.
 *
 * So instead of printing the raw token, unknown values render as an explicit
 * bracketed placeholder. It reads as a deliberate gap to the lawyer reviewing
 * the draft, rather than as a leaked developer note to a customer. These pages
 * also carry a "pending legal review" banner until `needsReview={false}`. */
export const orPending = (value: string, label = 'to be confirmed') =>
  looksPlaceholder(value) ? `[${label}]` : value

/* The registered office as one line, or a single bracketed placeholder — so a
 * legal page never renders "TODO address line 1, TODO address line 2, TODO". */
export const registeredOfficeLine = companyDetails.hasAddress
  ? [
      company.registeredAddress.line1,
      company.registeredAddress.line2,
      company.registeredAddress.city,
      `${company.registeredAddress.state} ${company.registeredAddress.pincode}`,
      company.registeredAddress.country,
    ]
      .filter(Boolean)
      .join(', ')
  : '[registered office to be confirmed]'

/* ── Public pricing surface ────────────────────────────────────────────────
 * The ONLY price value any component may read. It is null until the rate is
 * disclosed, so a component cannot accidentally render the real figure — and
 * because server components resolve this before render, the number never
 * reaches the browser at all. */
export const publicPricePerEmployee: number | null = pricing.disclosed
  ? pricing.plan.pricePerEmployee
  : null
