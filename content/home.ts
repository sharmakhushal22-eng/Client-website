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
  /* Ported from Website changes.html (#testimonials). */
  eyebrow: 'Early, by design',
  title: 'Be one of EZER’s first case studies',
  lede:
    'EZER is newly built — which means the roadmap still bends toward what our ' +
    'first companies actually need, instead of what a five-year-old product has ' +
    'already locked in.',

  offer: [
    {
      title: 'Your feedback shapes the roadmap',
      detail: 'Not the other way around.',
    },
    {
      title: 'Direct access to the founder and implementation team',
      detail: 'Not a ticket queue.',
    },
    {
      title: 'See EZER run against your own payroll data',
      detail: 'In the demo, before you commit to anything.',
    },
  ],

  fitNote:
    'This suits a company that wants influence over the product and can tolerate ' +
    'being early. If you need a vendor with two hundred reference customers and a ' +
    'Gartner listing, we are not that yet — and we would rather say so now than ' +
    'on the third call.',
  ctaLabel: 'Talk to Us About Early Access',
}

/* ── FAQs ──────────────────────────────────────────────────────────────────
 * Also feeds FAQPage schema, so these are written to be answers rather than
 * deflections — a schema-eligible answer that dodges the question is worse
 * than no schema. */
export const homeFaqs = [
  /* Ported verbatim from Website changes.html (#faq). */
  {
    q: 'Is our data safe, and where is it stored?',
    a: 'Your data is hosted in India. Sensitive fields — full Aadhaar number, bank account details — are masked by default and visible only to the specific roles that need them (HR Manager, Payroll Manager, Admin, Super Admin); everyone else sees a masked version, on every screen and every report export.',
  },
  {
    q: 'We’re already on another HRMS mid-year — can we still switch?',
    a: 'Yes. The 10-day implementation program is built around migrating existing employee, CTC and compliance data, not starting from a blank sheet. Your implementation professional maps what you already have before anything moves.',
  },
  {
    q: 'How large can EZER actually go — and can it run multiple group companies?',
    a: 'There is no headcount ceiling. Multi-company is core to how EZER is built, not an add-on bolted on later — one login, separate books and separate statutory registers per company, from the first run. The same architecture that runs one 40-person startup runs a group of dozens of entities totalling lakhs of employees across hundreds of corporate offices, branches, plants and warehouses.',
  },
  {
    q: 'What if our branches sit in different states or industries?',
    a: 'Compliance rules are configured per branch and per industry — minimum wage, PT and shift rules differ by state and establishment type, and EZER accounts for that instead of applying one template everywhere.',
  },
  {
    q: 'Do employees need training to use it?',
    a: 'Employee self-service is built to be self-explanatory — punch in/out, apply leave, check a payslip, declare investments. Formal training for your HR and payroll team is covered on Days 9–10 of implementation.',
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


/* ============================================================================
 * The announcement bar — ported from Website changes.html.
 *
 * This replaced the pricing pre-register hook that used to sit here. The
 * pre-register flow keeps its own edge tab, pill and teaser, so it lost no
 * entry point; the bar meanwhile gained the one message that is genuinely
 * time-bound. A bar that scrolls away should carry the thing that is only
 * true this year.
 * ========================================================================= */
export const announcement = {
  text:
    'New Labour Codes are in effect. A new Income Tax Act just replaced the ' +
    'old one. 2026 is the year Indian payroll compliance changes',
  ctaLabel: 'see what’s changing',
  /* The explainer, not the product page: someone reading this bar wants to
     know what changed, not to be sold to mid-sentence. */
  ctaHref: '/blog/labour-codes-explained',
} as const

/* The hero's scale row, ported from Website changes.html.
 *
 * "Data hosted in India" is the reference's fourth chip and is deliberately
 * absent here: the trust badges immediately below already carry it, in the
 * more specific form the product can actually stand behind ("Data stored in
 * India — Mumbai"). Two chips saying the same thing one line apart reads as
 * padding. */
export const heroScale = [
  'Startups to lakh-employee groups',
  'Hundreds of branches, plants & office types',
  '100+ industries mapped',
] as const
