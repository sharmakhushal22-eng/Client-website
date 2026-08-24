/* Copy for the home page sections. Kept out of the components so a
 * non-developer can edit wording without touching JSX. */

/* ── The problem, in the buyer's words ─────────────────────────────────────
 *
 * Framed around the multi-location, multi-entity buyer the product is actually
 * positioned for. A single-office company does not feel most of these; a group
 * running a corporate office, two factories and a warehouse feels all four
 * every month.
 *
 * Each one is written to be recognised rather than agreed with. "Manual
 * processes are inefficient" persuades nobody. "LWF is half-yearly in one
 * state and monthly in the next" tells the reader we have done this. */
export const problems = [
  {
    stat: '4 states',
    title: 'Four states means four statutory positions',
    body: 'PT slabs differ, LWF differs in both rate and frequency, and leave entitlement follows each state’s Shops & Establishments rules. Four separate deadlines, four separate formats, and one person holding the calendar.',
  },
  {
    stat: 'Per entity',
    title: 'One system per company, or one sheet per site',
    body: 'Group companies end up with the same employee existing several times over. A transfer between entities becomes an exit and a re-hire — losing the service history the gratuity clock runs on — and consolidated headcount is whatever the last person to build the sheet said it was.',
  },
  {
    stat: 'Manual',
    title: 'Registers are assembled branch by branch',
    body: 'Someone pulls each location’s data, formats it to that state’s requirement, and files it. The month it is missed is the month nobody notices — until the inspection, when the gap is a year old.',
  },
  {
    stat: 'New codes',
    title: 'The wage definition changed under you',
    body: 'The labour codes redrew what counts as wages for PF, gratuity and encashment. A structure built on the old definition is not slightly wrong — it is wrong every month, and backwards, and it compounds while everyone assumes it is fine.',
  },
]

/* Superseded by `implementation` in content/positioning.ts, which carries the
 * company's actual ten-day programme. Kept exported (empty) so nothing that
 * still imports it breaks; delete once you are sure nothing does. */
export const howItWorks: { step: number; title: string; body: string; detail: string }[] = []

/* ── Outcomes ──────────────────────────────────────────────────────────────
 * "Must be defensible; do not invent."
 *
 * TODO: every number here is a placeholder, and the section hides itself while
 * they are. Replace only with figures you can defend from a real
 * implementation — an invented ROI claim is the fastest way to lose a CFO in
 * the first call, and the CFO is who this section exists for. */
export const outcomes = [
  { value: 'TODO', label: 'days saved per payroll cycle', note: 'TODO — source' },
  { value: 'TODO', label: 'fewer payslip queries to HR', note: 'TODO — source' },
  { value: 'TODO', label: 'faster monthly statutory filing', note: 'TODO — source' },
]

/* ── Testimonials ──────────────────────────────────────────────────────────
 * Handoff §6: "No real customers yet, so the section invites 'founding
 * customers' instead of showing quotes — replace once real testimonials
 * exist."
 *
 * The section hides itself automatically while `published` is false on every
 * entry, and the founding-customer panel below renders in its place. Fill
 * these in and set `published: true`, and the panel steps aside. */
export const testimonials = [
  {
    published: false,
    quote: 'TODO — a real quote, in the customer’s own words, about a specific outcome.',
    name: 'TODO',
    designation: 'TODO',
    company: 'TODO',
    photo: '',
  },
  {
    published: false,
    quote: 'TODO — ideally one that names a number: days saved, queries avoided.',
    name: 'TODO',
    designation: 'TODO',
    company: 'TODO',
    photo: '',
  },
  {
    published: false,
    quote: 'TODO — one from a Finance signatory carries more weight than three from HR.',
    name: 'TODO',
    designation: 'TODO',
    company: 'TODO',
    photo: '',
  },
]

/* ── Founding customers ────────────────────────────────────────────────────
 * What stands where testimonials will eventually go.
 *
 * The strategic argument for this panel: a new product with no logos has two
 * options — invent social proof, or be straight about being early and make
 * being early worth something. The first is a credibility bomb that goes off
 * on the first reference call. The second attracts the kind of buyer who is
 * useful to have first, because they will tell you what is wrong.
 *
 * Everything offered below must be something the company will actually
 * honour. Do not list a commitment nobody has agreed to. */
export const foundingCustomer = {
  eyebrow: 'Where the testimonials will go',
  title: 'We would rather say this than invent a quote',
  lede:
    'EZER is early. We have no customer logos to show you yet, and putting up three ' +
    'invented testimonials would be both easy and disqualifying — a buyer who spots a ' +
    'fabricated quote stops believing the compliance claims too. So here is the honest ' +
    'version, and what being early is worth.',

  /* The offer. Each item is a commitment, not a benefit statement. */
  offer: [
    {
      title: 'The roadmap is partly yours',
      detail:
        'Founding customers get direct access to the people building the product, and the statutory edge cases you bring — your state, your establishment type, your wage structure — get built because you asked.',
    },
    {
      title: 'Implementation led by the founders',
      detail:
        'Not a partner, not a reseller, not a support queue. The people who designed the calculation engine run your parallel payroll run and sit with your team on go-live.',
    },
    {
      title: 'Pricing held for the term',
      detail:
        'Your rate is fixed for the length of the founding term, including through the versions that add more than you signed up for.',
    },
    {
      title: 'A reference relationship, not a testimonial request',
      detail:
        'If it works, we will ask you to say so — later, in your own words, and only about things you actually experienced. If it does not, your data leaves in standard formats at no charge.',
    },
  ],

  /* Qualifying line — this panel should attract the right buyer and repel the
   * wrong one. Being early is genuinely not for everybody. */
  fitNote:
    'This suits a company that wants influence over the product and can tolerate being ' +
    'early. If you need a vendor with two hundred reference customers and a Gartner ' +
    'listing, we are not that yet — and we would rather say so now than on the third call.',

  ctaLabel: 'Talk about a founding engagement',
}

/* ── FAQs ──────────────────────────────────────────────────────────────────
 * Also feeds FAQPage schema, so these are written to be answers rather than
 * deflections — a schema-eligible answer that dodges the question is worse
 * than no schema. */
export const homeFaqs = [
  {
    q: 'How long does implementation actually take?',
    a: 'Ten working days, run as a defined programme: structure and data on days 1–2, rules and access on days 3–5, a full parallel payroll run on days 6–8, and training plus go-live on days 9–10. The parallel run is the part that matters — you watch your own numbers reconcile against your existing process before anything depends on the new system. Implementation is included in the subscription rather than quoted separately.',
  },
  {
    q: 'We run several companies across several states. Does that work in one system?',
    a: 'That is what it is built for, and it is the reason most companies come to us. A group holds several companies, each with its own PAN, TAN, CIN, letterhead and statutory registrations, and each company holds its own locations — corporate office, branch, factory, warehouse or depot. Professional Tax, LWF and leave entitlement are applied by the state each location sits in, while headcount and cost consolidate across the group. Entities and locations are unlimited on the same subscription.',
  },
  {
    q: 'Do you handle the new labour codes?',
    a: 'Yes. The codes redrew the definition of wages for PF, gratuity and leave encashment, so a salary structure built on the old definition is wrong every month rather than slightly off. We model the effect on your actual structure before you commit to it, and hold the rules as configuration per registration — because they are being notified by state and by establishment type, in stages, rather than all at once.',
  },
  {
    q: 'Can our CFO see the compliance position without seeing individual salaries?',
    a: 'Yes. Roles are defined per entity and per location, not just per module, so leadership gets what is due, what is filed and what the group costs, without access to individual salary records. That distinction is usually the thing other systems cannot express — and it is why a sanitised spreadsheet ends up being maintained alongside them.',
  },
  {
    q: 'What happens to our existing data?',
    a: 'It comes across in the bulk upload during days 1–2 — employee master, salary structures, opening leave balances and year-to-date payroll figures. The year-to-date figures matter more than anything else: without them the TDS projection for the rest of the year is wrong, and every employee sees the mismatch in their Form 16. Migration is part of implementation, not a separate engagement.',
  },
  {
    q: 'What does it cost, and is anything gated behind a higher plan?',
    a: 'One plan, one rate per employee per month, and nothing gated. Tiering an HRMS means tiering compliance — the statutory depth always ends up in the upper tier, which leaves the company least able to absorb a PF notice with the weakest coverage. We would rather charge one rate. Entities, locations, modules, implementation and migration are all in it.',
  },
  {
    q: 'Is there a minimum contract, and can we get our data out?',
    a: 'Subscriptions are annual. You can export your data at any time during the subscription and on exit — employee master, payroll history, statutory records, documents — in standard formats, at no charge. A system you cannot leave is one you should not enter.',
  },
]

/* ── Product tour ──────────────────────────────────────────────────────────
 * Real screenshots only.
 *
 * TODO: `src` is empty on every entry, so the tour renders a labelled
 * placeholder frame instead of a fabricated dashboard. Build a demo company
 * with fictional names, salaries and PAN/Aadhaar values BEFORE any screenshot
 * is taken — a real screenshot with real employee data is a DPDP problem, and
 * a mocked-up one is a credibility problem. Captions are written; drop the
 * images in and they appear. */
export const productTour = [
  {
    src: '',
    alt: 'EZER HRMS compliance view showing statutory position across entities and locations',
    title: 'Every entity, every location, one view',
    caption:
      'What is due and what is filed, for every registration the group holds. Not one screen per company, and not a spreadsheet somebody maintains on the side.',
  },
  {
    src: '',
    alt: 'EZER HRMS payslip with EPF, ESIC and Professional Tax deductions itemised',
    title: 'A payslip that explains itself',
    caption:
      'Earnings, deductions and employer contributions itemised, each with the statutory basis beside it. When an employee asks why the PF changed, the payslip has already answered.',
  },
  {
    src: '',
    alt: 'EZER HRMS statutory compliance dashboard listing EPF, ESIC and PT due dates',
    title: 'What is due, and what is filed',
    caption:
      'EPF, ESIC, PT and TDS obligations for every registration you hold, with due dates and filing status. Nothing is due only in somebody’s head.',
  },
  {
    src: '',
    alt: 'EZER HRMS employee self-service portal showing payslips and leave balance',
    title: 'Employees serve themselves',
    caption:
      'Payslips, tax declarations, leave balances, attendance and documents in the ESS portal — which is where most of the HR inbox goes to die.',
  },
]
