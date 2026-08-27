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
  /* Copy ported verbatim from Website changes.html (#vision-goal). The design,
     colours and animation around it are the site's own. */
  /* The reference opens this section with "Why EZER exists / Mission" and
     only then reaches Vision. Both were being flattened into one block here,
     which lost the mission statement entirely — the sentence that says who
     the product is for and what it replaces. */
  why: {
    eyebrow: 'Why EZER exists',
    label: 'Mission',
    statement:
      'EZER exists to give every Indian company — a 40-person startup or a ' +
      'group running lakhs of employees across hundreds of offices, plants ' +
      'and branches — an HR and payroll system that gets India’s compliance ' +
      'right by default, not bolted on afterward, as an adjustment to ' +
      'software built for another market first.',
    support:
      'We replace the spreadsheets, the WhatsApp groups, and the ' +
      'half-accurate manual PF and ESIC calculations that Indian companies ' +
      'of every size still run their HR on, with one system that gets it ' +
      'right the first time.',
  },

  mission: {
    eyebrow: 'Vision',
    statement:
      'A future where compliance is simply correct, by default',
    support:
      'A future where no HR or payroll team in India spends their month ' +
      'firefighting PF mismatches, ESIC errors, or manually recalculated TDS — ' +
      'where compliance is simply correct, by default, for every company, ' +
      'regardless of size.',
  },

  vision: {
    eyebrow: 'What we are building',
    title: 'India’s HR future, on one platform',
    body:
      'We are building India’s HR future: a single platform that carries a ' +
      'company from the first job posting to the final settlement, priced ' +
      'honestly enough that a 40-person startup can afford exactly the same ' +
      'depth a lakh-employee group gets.',
  },

  goals: [
    {
      number: '01',
      icon: 'shield' as const,
      title: 'Product goal',
      body:
        'Ship a complete recruit-to-payroll platform that any Indian company can ' +
        'run its entire HR function on — a first-time founder hiring employee ' +
        'number ten, or a group consolidating lakhs of employees across hundreds ' +
        'of establishments. One login, one source of truth, nothing stitched ' +
        'together from five different vendors.',
    },
    {
      number: '02',
      icon: 'chart' as const,
      title: 'Market goal',
      body:
        'Become the default HR platform for Indian business at every scale — ' +
        'startups outgrowing spreadsheets, and large multi-entity groups whose ' +
        'compliance reality is too specific for enterprise software built for a ' +
        'global market first.',
    },
    {
      number: '03',
      icon: 'users' as const,
      title: 'Company goal',
      body:
        'Grow EZER from a single HRMS product into a family of connected work ' +
        'products — HRMS, Payroll, Performance Management, and Expense ' +
        'Management — all under one brand, one login, one company record.',
    },
  ],
} as const

export const todayVsEzer = {
  /* Ported from Website changes.html (#simplify) — the six pairs, verbatim. */
  eyebrow: 'The realistic challenges, and how we solve them',
  title: 'Six things every Indian company deals with — and what changes with EZER',
  lede:
    'Not hypothetical problems. This is what actually happens on spreadsheets, ' +
    'WhatsApp groups, and tiered software built for someone else’s company size.',

  pairs: [
    {
      icon: 'briefcase' as IconName,
      area: 'One platform, not five vendors',
      today:
        'Five separate vendors for recruitment, payroll, compliance and attendance — ' +
        'none of them talking to each other.',
      withEzer:
        'One platform across the entire employee lifecycle — hire, onboard, manage, ' +
        'pay, comply.',
    },
    {
      icon: 'shield' as IconName,
      area: 'Statutory calculation',
      today:
        'PF, ESIC, PT, LWF and TDS manually cross-checked by an accountant against a ' +
        'spreadsheet, every month.',
      withEzer:
        'Calculated correctly by the system itself, every month — not manually ' +
        'reconciled after the fact.',
    },
    {
      icon: 'wallet' as IconName,
      area: 'Pricing and feature gates',
      today:
        'Tiered feature-gating designed to force an upsell once you’re locked in and ' +
        'dependent on the tool.',
      withEzer:
        'A 40-person startup gets exactly the same depth as a lakh-employee group. ' +
        'Priced per employee, per month.',
    },
    {
      icon: 'user-plus' as IconName,
      area: 'Onboarding paperwork',
      today:
        'HR retyping a new hire’s Aadhaar and PAN details into three different forms ' +
        'by hand.',
      withEzer:
        'The new hire uploads their documents; EZER reads them and fills the forms. ' +
        'HR reviews instead of retyping.',
    },
    {
      icon: 'users' as IconName,
      area: 'Who the tools are built for',
      today:
        'Leave, attendance and payslip tools built desktop-first, for the HR team — ' +
        'not for the employees who use them daily.',
      withEzer:
        'Built mobile-first for employees, because they’re the ones checking leave ' +
        'balance and payslips from their phone.',
    },
    {
      icon: 'map-pin' as IconName,
      area: 'Group structure',
      today:
        'Software that treats your retail arm, manufacturing arm and trading arm as if ' +
        'they were one legal entity.',
      withEzer:
        'Built around the reality that Indian businesses are often a group of related ' +
        'companies, each with its own compliance identity.',
    },
  ],
} as const

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
  /* Ported from Website changes.html (#compliance). */
  eyebrow: 'Compliance, the way Indian law actually works',
  title:
    'Built for the new Labour Codes — configured to your industry, not just your headcount',
  lede:
    'Labour law compliance in India was never one law — it’s dozens, state by ' +
    'state, industry by industry. EZER’s compliance engine is where that ' +
    'complexity gets absorbed, not passed on to your HR team.',
  note:
    'The four Labour Codes have been in effect since November 2025, and ' +
    'state-level rules are still being notified in phases. EZER tracks each ' +
    'notification as it lands, so your registers keep reflecting the rules that ' +
    'actually apply to you — not last year’s.',

  codes: [
    {
      name: 'Code on Wages',
      covers: 'Minimum wage, payment of wages, bonus, equal remuneration',
      what:
        'Minimum wage, payment of wages, bonus and equal remuneration — feeds ' +
        'directly into how EZER calculates every payslip.',
    },
    {
      name: 'Industrial Relations Code',
      covers: 'Standing orders, retrenchment, dispute resolution',
      what:
        'Standing orders, retrenchment and dispute resolution — tracked at the ' +
        'establishment level for every branch and factory.',
    },
    {
      name: 'Code on Social Security',
      covers: 'PF, ESIC, gratuity, maternity benefit',
      what:
        'PF, ESIC, gratuity and maternity benefit — registers and contributions ' +
        'generate automatically from attendance and payroll.',
    },
    {
      name: 'OSH & Working Conditions Code',
      covers: 'Working hours, shift limits, welfare facilities',
      what:
        'Working hours, shift limits and welfare facilities — configured per ' +
        'establishment type, from an office to a factory floor.',
    },
  ],

  industryNote:
    'Rules apply differently to an IT office, a factory, a warehouse and a BFSI ' +
    'branch. EZER’s compliance engine is configured per industry and per ' +
    'establishment type — never a single generic template stretched across your ' +
    'whole company.',
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
  /* Ported from Website changes.html (#access). */
  eyebrow: 'Built for how Indian groups actually operate',
  title:
    'Multiple companies, one login. Everyone sees exactly what their role needs.',
  lede:
    'A fast-growing startup runs on EZER from day one. A large group running ' +
    'dozens of companies, lakhs of employees combined, and hundreds of branches, ' +
    'plants and office types — runs on the same platform, one entity at a time, ' +
    'consolidated under a single login.',

  roles: [
    {
      icon: 'chart' as IconName,
      name: 'CFO & Leadership View',
      detail:
        'Consolidated compliance and cost visibility across every company and ' +
        'branch — without wading into transaction-level HR data. Filing status, ' +
        'headcount cost and risk flags, on one screen.',
      highlight: true,
    },
    {
      icon: 'users' as IconName,
      name: 'HR Head',
      detail: 'Full access, all companies.',
    },
    {
      icon: 'wallet' as IconName,
      name: 'Payroll Manager',
      detail: 'Payroll & statutory, all branches.',
    },
    {
      icon: 'map-pin' as IconName,
      name: 'Branch HR Executive',
      detail: 'Own branch only.',
    },
    {
      icon: 'briefcase' as IconName,
      name: 'IT / Admin Manager',
      detail: 'Onboarding & assets only.',
    },
    {
      icon: 'shield' as IconName,
      name: 'Finance Executive',
      detail: 'Cost reports, masked PII.',
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
  /* Ported from Website changes.html (#implementation). */
  eyebrow: 'Go live without the chaos',
  title:
    'A 10-day implementation program, with one person accountable for your data',
  lede:
    'Your employee master, CTC structures and compliance history are company ' +
    'assets — not a spreadsheet to be rekeyed by whoever’s free that week. A ' +
    'dedicated EZER implementation professional maps your existing data and owns ' +
    'the go-live, start to finish.',

  phases: [
    {
      days: 'Day 1–2',
      title: 'Kickoff & mapping',
      detail: 'Company and branch setup, existing data reviewed.',
    },
    {
      days: 'Day 3–4',
      title: 'Statutory profiles',
      detail: 'Compliance rules configured per branch and industry.',
    },
    {
      days: 'Day 5–6',
      title: 'Employee master',
      detail: 'Employee and CTC data migrated and verified.',
    },
    {
      days: 'Day 7–8',
      title: 'Parallel run',
      detail: 'Payroll run validated against your existing numbers.',
    },
    {
      days: 'Day 9–10',
      title: 'Training & go-live',
      detail: 'Team trained, access rolled out, you’re live.',
    },
  ],

  promise:
    'Year-to-date figures come across with everything else. Without them the TDS ' +
    'projection for the rest of the year is wrong, and every employee sees it in ' +
    'their Form 16 — which is the migration mistake that is hardest to unwind.',
} as const

export const taxCalculator = {
  /* Ported from Website changes.html (#tax). */
  eyebrow: 'For your employees, not just your HR team',
  title: 'Old regime or new? Let the numbers decide.',
  lede:
    'Every EZER employee gets this comparison before they declare — not after ' +
    'Form 16 arrives and it’s too late to change anything. Drag the slider to ' +
    'see how it works.',

  points: [
    {
      label: 'Old regime or new',
      detail:
        'Both projected side by side on their actual salary, not a generic example from a blog.',
    },
    {
      label: 'What a declaration does',
      detail:
        'The effect on the monthly deduction is shown before they commit to it, which is when people get it right.',
    },
    {
      label: 'Across the whole year',
      detail:
        'The projection updates every month as proofs are verified, so March holds no surprises.',
    },
    {
      label: 'Decided by them',
      detail:
        'Which means the decision is theirs — and HR is not blamed for it when the last payslip of the year lands.',
    },
  ],

  /* The reference runs an illustrative slider at ₹12,00,000 CTC assuming
     ₹2,00,000 of old-regime exemptions. Kept as the caption on the
     illustration rather than as a live control. */
  illustrativeNote:
    'Illustrative example — assumes ₹2,00,000 in standard exemptions and ' +
    'deductions under the old regime (HRA, 80C, etc). Your EZER dashboard ' +
    'calculates the exact number from each employee’s real declaration.',
}
