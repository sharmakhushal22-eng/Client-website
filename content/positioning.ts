/* ============================================================================
 * The positioning content — compliance engine, multi-entity, labour codes.
 *
 * This is the material that separates EZER from a payroll bureau: not that it
 * calculates salary, but that it holds several companies and several kinds of
 * location in one operation and produces the statutory position for all of
 * them together.
 *
 * Section order follows the reference handoff (EZER-Website-Developer-Handoff
 * .docx, August 2026): vision & goal → today vs EZER → compliance → modules →
 * access → industries → tax → implementation → pricing.
 * ========================================================================= */

import type { IconName } from '@/components/ui/Icon'

/* ── Feature flags ─────────────────────────────────────────────────────────
 *
 * ⚠ IMPORTANT — read before launch.
 *
 * `complianceEngineLive` gates every claim about generating compliance
 * registers across branches in one run. At the time of writing,
 * app/dashboard/compliance/page.tsx in the product is an EMPTY FILE — the
 * module is not built yet.
 *
 * A buyer who asks to see the register generator on the demo call and finds an
 * empty page loses trust in the compliance claims AND in everything else on
 * the site.
 *
 * Set this to true only once the module actually ships. While it is false the
 * site still leads on multi-entity, multi-location and labour-code coverage —
 * all of which are real today — and simply does not promise the one-click
 * register.
 */
export const flags = {
  complianceEngineLive: false,
  taxCalculatorLive: true,   // employee-facing projection exists in the ESS/TDS module
} as const

/* ── Mission, vision, goals ────────────────────────────────────────────────
 * Handoff anchor #vision-goal: "Mission statement (dark band) + Vision and
 * the three Goal cards."
 *
 * Written to be specific enough to be falsifiable. A mission statement that
 * could belong to any HR software company is worse than no mission statement,
 * because the reader learns nothing and notices that they learned nothing. */
export const visionGoal = {
  mission: {
    eyebrow: 'Our mission',
    /* The dark band. One sentence, and it should be the sentence the company
     * would defend in a room. */
    statement:
      'To make statutory compliance the easiest part of employing people in India — ' +
      'not the part that keeps a finance head awake in the week before the 15th.',
    support:
      'Indian employment law is not difficult so much as plural. Every state adds a ' +
      'variation, every establishment type adds a register, and every labour-code ' +
      'notification moves the ground under a salary structure that was correct when it ' +
      'was built. We think software should absorb that plurality so that the people ' +
      'running HR do not have to hold it in their heads.',
  },

  vision: {
    eyebrow: 'Our vision',
    title: 'One system that knows where every employee actually works',
    body:
      'Not one system per company, and not one spreadsheet per site. A group should be ' +
      'able to see its whole workforce — every entity, every state, every factory floor ' +
      'and warehouse dock — in a single operation, with each person’s statutory position ' +
      'determined by the place they actually work rather than the place the software was ' +
      'first set up.',
  },

  /* Three goal cards. Each is a commitment with a measurable edge to it, so a
   * buyer can hold us to it rather than nod at it. */
  goals: [
    {
      icon: 'shield' as IconName,
      number: '01',
      title: 'Zero statutory surprises',
      body:
        'Every deduction traceable to the rule that produced it, every due date visible ' +
        'before it passes, and every register available in the format its state expects. ' +
        'The measure of success is that an inspection is boring.',
    },
    {
      icon: 'clock' as IconName,
      number: '02',
      title: 'Live in ten working days',
      body:
        'Implementation should be a fortnight, not a quarter. Bulk migration instead of ' +
        'data entry, guided configuration instead of a discovery phase, and one full ' +
        'payroll cycle reconciled in parallel before anything depends on it.',
    },
    {
      icon: 'users' as IconName,
      number: '03',
      title: 'HR out of the answering business',
      body:
        'Most of what reaches an HR inbox is a lookup, not a decision — a payslip, a leave ' +
        'balance, a salary certificate, last year’s Form 16. Those belong to the person ' +
        'asking. What is left is the work worth an HR professional’s day.',
    },
  ],
}

/* ── Today vs with EZER ────────────────────────────────────────────────────
 * Handoff anchor #simplify: "six challenge/solution comparison cards".
 *
 * The discipline here is that the left-hand column must be recognisable
 * enough to sting. Generic pain ("manual processes are inefficient") persuades
 * nobody; the specific version — the ESIC mid-period crossing, the LWF that is
 * half-yearly in one state — tells the reader we have done this before. */
export const todayVsEzer = {
  eyebrow: 'What actually changes',
  title: 'Today, and with EZER',
  lede:
    'Six things that take a week out of every month in a multi-location company. None of ' +
    'them are hard problems. All of them are somebody’s job right now.',

  pairs: [
    {
      icon: 'map-pin' as IconName,
      area: 'Multi-state statutory',
      today:
        'Professional Tax has a different slab in every state that levies it, and LWF is ' +
        'monthly in one state, half-yearly in the next. Somebody keeps the rates in a ' +
        'sheet and remembers to update it.',
      withEzer:
        'Rates are held per state registration and applied by the location the employee ' +
        'actually works at. A rate change is a configuration change, not a product release ' +
        'and not a memory test.',
    },
    {
      icon: 'briefcase' as IconName,
      area: 'Group structure',
      today:
        'One HRMS licence per legal entity, or one workbook per site. The same employee ' +
        'exists three times, a transfer between entities is processed as an exit and a ' +
        're-hire, and consolidated headcount is whatever the last person to build the ' +
        'sheet said it was.',
      withEzer:
        'A group holds companies, a company holds locations, and one employee master runs ' +
        'across all of it. A transfer is a transfer, and it carries its service history, ' +
        'gratuity clock and statutory record with it.',
    },
    {
      icon: 'clock' as IconName,
      area: 'Attendance to payroll',
      today:
        'The biometric device produces a punch log. Payroll needs a day count. Between the ' +
        'two sits somebody reconciling missed punches against leave applications that are ' +
        'still sitting in an email folder.',
      withEzer:
        'Punches import, regularisations run through approval with a trail, overtime ' +
        'calculates on your rules, and the day count reaches the payroll run without ' +
        'anybody retyping it.',
    },
    {
      icon: 'chart' as IconName,
      area: 'Month-end close',
      today:
        'Gross in one tab, EPF in the next, ESIC in a third, PT by state in a fourth, TDS ' +
        'in a fifth. Each handoff is a place for a number to change, so the register is ' +
        'reconciled twice because nobody trusts it the first time.',
      withEzer:
        'One pass. Gross, deductions, employer contributions and every applicable statutory ' +
        'head calculated together, with a variance view against last month so you approve ' +
        'the differences rather than re-checking the whole file.',
    },
    {
      icon: 'shield' as IconName,
      area: 'Wage definition',
      today:
        'The labour codes redrew what counts as wages for PF, gratuity and encashment. A ' +
        'structure built on the old definition is not slightly wrong — it is wrong every ' +
        'month, and backwards, and nobody finds out until somebody asks.',
      withEzer:
        'The revised definition and the 50% rule are modelled against your actual structure ' +
        'before you commit to it, so you see the effect on PF, gratuity and encashment as a ' +
        'number rather than a risk.',
    },
    {
      icon: 'users' as IconName,
      area: 'The HR inbox',
      today:
        'Payslip requests, leave balance queries, a salary certificate for a home loan, a ' +
        're-send of last year’s Form 16. Individually trivial, collectively a part-time job — ' +
        'and each one interrupts the work that actually needed HR judgement.',
      withEzer:
        'Employees serve themselves in the ESS portal: payslips going back years, live leave ' +
        'balances, tax declarations with the effect on take-home shown, letters on request. ' +
        'What reaches HR is what needs a person.',
    },
  ],
}

/* ── The compliance engine ─────────────────────────────────────────────────
 * "Your multiple branches compliance register can generate in one go." */
export const complianceEngine = {
  eyebrow: 'The compliance engine',
  title: 'One run. Every location’s register comes out together.',
  lede:
    'A company operating in four states does not have one statutory position — it has ' +
    'four, and each one is a separate deadline in a separate format. EZER holds every ' +
    'entity and every location in one operation, so the registers are produced together ' +
    'rather than assembled one branch at a time in the week before they are due.',

  /* What is generated. Keep this list honest — add rows as the module ships. */
  outputs: [
    { label: 'Wage and muster registers', detail: 'Per location, in the format the applicable state requires' },
    { label: 'EPF ECR', detail: 'Per registration, ready to file' },
    { label: 'ESIC returns', detail: 'Contribution-period aware' },
    { label: 'Professional Tax', detail: 'State-wise, by work location' },
    { label: 'LWF', detail: 'At each state’s rate and frequency' },
    { label: 'TDS and Form 16', detail: 'Across both regimes' },
  ],

  points: [
    'Consolidated across entities, or split by entity — whichever the filing needs.',
    'Each register carries the registration number it was produced against.',
    'What is filed and what is outstanding, visible in one place.',
  ],
}

/* ── The new labour codes ──────────────────────────────────────────────────
 * Handoff anchor #compliance: "The four Labour Codes, statutory-act chips,
 * industry-configuration note."
 *
 * ⚠ TODO: have whoever owns compliance confirm the current position before
 * launch, including which state rules have actually been notified. The codes
 * changed the definition of "wages" itself, which is why this matters more
 * than a rate change — but the state-level rules are being notified in
 * stages, and a claim that runs ahead of that is one a knowledgeable buyer
 * will catch on the first call. */
export const labourCodes = {
  eyebrow: 'Built for the new labour codes',
  title: 'The definition of “wages” changed. Most payroll setups did not.',
  lede:
    'The four labour codes consolidated twenty-nine central acts and redrew what counts ' +
    'as wages for PF, gratuity and leave encashment. If your salary structure was built ' +
    'around the old definition, the exposure is not a rounding difference — it is every ' +
    'month since, and it compounds quietly.',

  codes: [
    {
      name: 'Code on Wages, 2019',
      covers: 'Minimum wages, payment of wages, bonus, equal remuneration',
      what: 'The revised wage definition and the 50% rule applied to your salary structure, with the effect on PF, gratuity and encashment shown before you commit to it.',
    },
    {
      name: 'Code on Social Security, 2020',
      covers: 'EPF, ESIC, gratuity, maternity benefit',
      what: 'Contributions calculated on the revised wage base, per registration, with the gratuity clock running against the same service record.',
    },
    {
      name: 'Industrial Relations Code, 2020',
      covers: 'Standing orders, notice, retrenchment',
      what: 'Notice periods, retrenchment compensation and settlement rules applied in the full & final calculation rather than worked out beside it.',
    },
    {
      name: 'OSH and Working Conditions Code, 2020',
      covers: 'Registers, returns, working hours, leave',
      what: 'Working-hour limits, overtime treatment and leave entitlement driven by establishment type and the state each location sits in.',
    },
  ],

  note:
    'Rules are being notified by state and by establishment type, in stages. EZER holds ' +
    'them as configuration per registration, so a notification is applied without waiting ' +
    'for a product release — which is the difference between being ready and being told ' +
    'it is on the roadmap.',
}

/* ── Multi-entity, multi-location ──────────────────────────────────────────
 * "Multiple company in single operation" · "corporate office branches factory
 * warehouse". These location types are real — they exist in the product's
 * company-profile module today. */
export const structure = {
  eyebrow: 'One operation, however many companies',
  title: 'Corporate office, branches, factory, warehouse — centrally run',
  lede:
    'Group companies usually end up with one HR system per entity, or one spreadsheet ' +
    'per location, because the software could not express the shape of the business. ' +
    'EZER models the group the way it actually exists: a group holding several companies, ' +
    'each holding several locations, each with its own registrations and its own state.',

  levels: [
    {
      icon: 'briefcase' as IconName,
      name: 'Group',
      detail: 'The parent. Consolidated headcount and cost across every company beneath it.',
    },
    {
      icon: 'shield' as IconName,
      name: 'Company',
      detail: 'Each legal entity, with its own PAN, TAN, CIN, letterhead and statutory registrations.',
    },
    {
      icon: 'map-pin' as IconName,
      name: 'Location',
      detail: 'Corporate office, head office, branch, factory, warehouse or depot — each in its own state, under its own rules.',
    },
  ],

  locationTypes: ['Corporate office', 'Head office', 'Branch', 'Factory', 'Warehouse', 'Depot'],

  points: [
    'One employee master across the group — a transfer between entities is a transfer, not a re-hire.',
    'State-wise PT, LWF and leave entitlement applied by the location the employee actually works at.',
    'Payroll run per entity, reporting consolidated across the group.',
    'Unlimited entities and locations on the same subscription, because charging per entity punishes exactly the companies this is built for.',
  ],
}

/* ── Access & rights ───────────────────────────────────────────────────────
 * Handoff anchor #access: "Multi-company switcher, role list, CFO/leadership
 * card." */
export const access = {
  eyebrow: 'Rights management',
  title: 'Who sees salary, who approves, and who only looks',
  lede:
    'The reason HR data ends up back in spreadsheets is usually that the system could not ' +
    'express who was allowed to see what — so somebody built a sanitised extract, and now ' +
    'there are two versions of the truth. Roles here are defined per entity and per ' +
    'location, not just per module.',

  roles: [
    {
      icon: 'chart' as IconName,
      name: 'CFO and leadership',
      detail:
        'A compliance and cost view across every entity — what is due, what is filed, what is outstanding, and what the group costs by company and by location — without granting access to a single individual salary record. That distinction is usually the thing other systems cannot express.',
      highlight: true,
    },
    {
      icon: 'users' as IconName,
      name: 'HR',
      detail: 'Full operation of the modules they own, scoped to the entities and locations they are actually responsible for — which for a group HR team is rarely all of them.',
    },
    {
      icon: 'briefcase' as IconName,
      name: 'Managers',
      detail: 'Their own team: attendance, leave, claims and approvals, in one queue. No salary visibility unless you explicitly grant it.',
    },
    {
      icon: 'user-plus' as IconName,
      name: 'Employees',
      detail: 'Their own record only, through the self-service portal — payslips, balances, declarations and documents.',
    },
  ],
}

/* ── Industries ────────────────────────────────────────────────────────────
 * Handoff anchor #industries: "100+ industries grid, grouped into 14
 * categories."
 *
 * Naming them matters, because a buyer scanning for their own sector stops
 * when they see it. The `note` on each category is the part that earns the
 * section: it states what is statutorily distinctive about that group, which
 * proves the list is considered rather than scraped from an NIC code table.
 */
export type IndustryCategory = {
  name: string
  /* What is statutorily different about this group. */
  note: string
  industries: string[]
}

export const industryCategories: IndustryCategory[] = [
  {
    name: 'Manufacturing',
    note: 'Factory Act registers, shift patterns, contract labour under CLRA, overtime at statutory rates',
    industries: [
      'Auto Components', 'Textile & Apparel', 'Chemical Manufacturing',
      'Pharma Manufacturing', 'FMCG Manufacturing', 'Electronics Assembly',
      'Steel & Metal Fabrication', 'Plastics & Packaging', 'Food Processing',
      'Leather & Footwear',
    ],
  },
  {
    name: 'IT & Technology',
    note: 'Multi-city Shops & Establishments registration, variable pay, high attrition, full & final volume',
    industries: [
      'IT Services', 'SaaS & Software Products', 'IT-BPM / BPO', 'KPO & Research',
      'Cybersecurity', 'EdTech Platforms', 'FinTech', 'HealthTech',
    ],
  },
  {
    name: 'BFSI',
    note: 'Branch networks across states, strict role separation, audit trail on every change',
    industries: [
      'NBFCs', 'Microfinance Institutions', 'Life & General Insurance',
      'Broking & Wealth Management', 'Cooperative Banks', 'Payment Platforms',
      'Asset Management',
    ],
  },
  {
    name: 'Healthcare & Life Sciences',
    note: 'Round-the-clock rosters, nursing shift patterns, statutory leave across long service',
    industries: [
      'Hospital Chains', 'Diagnostic Lab Chains', 'Pharmacy Chains',
      'Clinics & Nursing Homes', 'Medical Devices', 'Ayurveda & Wellness',
      'Biotech Research',
    ],
  },
  {
    name: 'Retail & Consumer',
    note: 'Store-wise rosters, weekly-off compliance, festival-season headcount spikes',
    industries: [
      'Multi-branch Retail', 'D2C E-commerce', 'Supermarket Chains',
      'Quick Commerce', 'Franchise Businesses', 'Jewellery Retail', 'Cloud Kitchens',
    ],
  },
  {
    name: 'Logistics & Supply Chain',
    note: 'Depot and warehouse establishments across states, driver duty hours, high churn',
    industries: [
      '3PL & Warehousing', 'Courier & Last-mile', 'Freight & Transport',
      'Cold Chain Logistics', 'Fleet Management', 'Shipping & Maritime',
      'Container Handling',
    ],
  },
  {
    name: 'Real Estate & Infrastructure',
    note: 'BOCW cess and welfare board registration, site-wise establishment, migrant-worker records',
    industries: [
      'Real Estate Development', 'EPC Contracting', 'Infrastructure Construction',
      'Interior Fit-out', 'Facility Management', 'Architecture Firms',
    ],
  },
  {
    name: 'Education',
    note: 'Academic-year cycles, gratuity across long service, contract and visiting faculty',
    industries: [
      'K-12 School Groups', 'Higher Education', 'Coaching Institutes',
      'Vocational Training', 'Skill Development', 'Ed-content Studios',
    ],
  },
  {
    name: 'Hospitality & Travel',
    note: 'Split shifts, service-charge treatment, seasonal and outsourced headcount',
    industries: [
      'Hotel Chains', 'Restaurant & QSR Chains', 'Event Management',
      'Catering Services', 'Travel & Tour Operators', 'Co-working Spaces',
    ],
  },
  {
    name: 'Energy & Agriculture',
    note: 'Campaign and seasonal workforces, hazardous-process rules, remote-site establishments',
    industries: [
      'Renewable Energy', 'Power Distribution', 'Oil & Gas Services',
      'Agri-processing', 'Dairy Cooperatives', 'Seed & Fertilizer',
    ],
  },
  {
    name: 'Professional Services',
    note: 'Client-site deployment, partner versus employee treatment, project-linked payroll',
    industries: [
      'Law Firms', 'CA & Accounting Firms', 'Management Consulting',
      'Advertising Agencies', 'Staffing & Flexi-workforce', 'Market Research',
      'Design Studios',
    ],
  },
  {
    name: 'Trade, Media & Emerging',
    note: 'Project-based crews, short engagements, contractor versus employee classification',
    industries: [
      'Import-Export Trading', 'Auto Dealerships', 'Media & Production',
      'Gaming & OTT', 'Security Services', 'Mining & Minerals',
      'Aviation Ground Handling', 'Telecom Infrastructure', 'Data Centers',
      'Waste Management',
    ],
  },
  {
    name: 'Beauty, Fitness & Services',
    note: 'Outlet-wise rosters, commission-linked pay, churn concentrated at lower wage bands',
    industries: [
      'Beauty & Salon Chains', 'Sports & Fitness Chains', 'Housekeeping Services',
      'Courier & Postal Services', 'Print & Publishing', 'Ceramics & Tiles',
      'Drone & Robotics', '3D Printing',
    ],
  },
  {
    name: 'Specialised Manufacturing',
    note: 'Continuous-process shifts and hazardous-process rules under the Factories Act',
    industries: [
      'Semiconductor Assembly', 'Renewable Components', 'Rubber Manufacturing',
      'Glass Manufacturing', 'Paper & Pulp', 'Cement & Building Materials',
    ],
  },
]

/* Total count, computed rather than asserted — so the headline number on the
 * page can never drift out of step with the list beneath it. */
export const industryCount = industryCategories.reduce(
  (total, category) => total + category.industries.length,
  0,
)

/* The condensed set used on the home page, where the full grid would be too
 * much. Kept as a flat list so the existing home-page section still works. */
export const industries = [
  { name: 'Manufacturing', note: 'Factory Act registers, shift patterns, contract labour' },
  { name: 'IT / ITES & GCC', note: 'Multi-city, high attrition, variable pay' },
  { name: 'Retail & e-commerce', note: 'Store-wise rosters, seasonal headcount spikes' },
  { name: 'Logistics & warehousing', note: 'Depot and warehouse establishments' },
  { name: 'Healthcare', note: 'Round-the-clock rosters, statutory leave' },
  { name: 'Construction & infra', note: 'Site-wise registration, BOCW cess' },
  { name: 'Staffing & contract', note: 'Multiple principal employers, PF/ESIC per contract' },
  { name: 'BFSI', note: 'Audit trail, role separation, branch network' },
  { name: 'Pharma & chemicals', note: 'Hazardous process rules, continuous shifts' },
  { name: 'Hospitality', note: 'Split shifts, seasonal headcount' },
]

/* ── The 10-day implementation ─────────────────────────────────────────────
 * Handoff anchor #implementation: "10-day implementation timeline."
 *
 * Broken into named days rather than stated as a bare number. A specific
 * ten-day plan is believable; "10 days" on its own reads as a sales claim, and
 * a CFO discounts it automatically. */
export const implementation = {
  eyebrow: 'Ten days, not two quarters',
  title: 'A ten-day implementation, run by people who have done it before',
  lede:
    'Your employee data is an asset, and moving it is not a data-entry job. The programme ' +
    'is run by an implementation specialist who has taken Indian companies off ' +
    'spreadsheets and off other systems, with a named person accountable for each stage ' +
    'below — and it is included in the subscription rather than quoted as a project.',

  phases: [
    {
      days: 'Days 1–2',
      title: 'Structure and data',
      detail:
        'Map the group: entities, locations, registrations, and which state governs which site. Your employee master, salary structures and opening balances come in by bulk upload — not retyped.',
    },
    {
      days: 'Days 3–5',
      title: 'Rules and access',
      detail:
        'Salary structures, leave policy, shift patterns, state-wise PT and LWF, approval chains, and who is allowed to see what. Configured with you in the room, not left as homework.',
    },
    {
      days: 'Days 6–8',
      title: 'Parallel run',
      detail:
        'We run one full cycle alongside your existing process and reconcile it line by line. You see your own numbers match before anything depends on them — this is the stage that decides whether go-live is calm.',
    },
    {
      days: 'Days 9–10',
      title: 'Training and go-live',
      detail:
        'HR and Finance trained on the modules they own, ESS credentials issued across the workforce, and the first live run signed off together rather than handed over.',
    },
  ],

  promise:
    'Year-to-date figures come across with everything else. Without them the TDS ' +
    'projection for the rest of the year is wrong, and every employee sees it in their ' +
    'Form 16 — which is the migration mistake that is hardest to unwind.',
}

/* ── Employee tax calculator ───────────────────────────────────────────────
 * Handoff anchor #tax: "Old vs New tax-regime calculator (slider)."
 *
 * Note the handoff's own warning: the marketing calculator is a simplified
 * illustrative formula, NOT the production computeTax() engine. Copy here is
 * written so it never claims otherwise. */
export const taxCalculator = {
  eyebrow: 'For your employees',
  title: 'A tax calculator that answers the question they actually ask',
  lede:
    'Every January, HR fields the same question in a hundred variations: “which regime ' +
    'should I pick, and what happens to my take-home if I declare this?” In EZER the ' +
    'employee answers it themselves, against their own salary — and HR stops being the ' +
    'calculator.',

  points: [
    { label: 'Old regime or new', detail: 'Both projected side by side on their actual salary, not a generic example from a blog.' },
    { label: 'What a declaration does', detail: 'The effect on the monthly deduction is shown before they commit to it, which is when people get it right.' },
    { label: 'Across the whole year', detail: 'The projection updates every month as proofs are verified, so March holds no surprises.' },
    { label: 'Decided by them', detail: 'Which means the decision is theirs — and HR is not blamed for it when the last payslip of the year lands.' },
  ],
}
