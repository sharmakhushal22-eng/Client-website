/* ============================================================================
 * The product's actual modules.
 *
 * Spec §4.2 is explicit: "Actual product modules (do not invent beyond
 * these)." Every entry below maps to a real route in the HRMS app. If you add
 * something here that does not exist, the demo call becomes an apology.
 * ========================================================================= */

export type ModuleGroup = {
  id: string
  name: string
  /* Spec §2.2 pillar this group ladders up to. */
  promise: string
  modules: { name: string; blurb: string }[]
  /* Set once a /features/<slug> detail page exists. */
  href?: string
}

export const moduleGroups: ModuleGroup[] = [
  /* The eight areas from Website changes.html (#modules), with their
     headings as the promise line and their bullets as the modules. */
  {
    id: 'hire',
    name: 'Hire',
    promise: 'Easy hiring and talent management',
    href: '/features/recruitment',
    modules: [
      {
        name: 'Sourcing and job posting',
        blurb: 'Sourcing and job posting, with Naukri integration for the Indian market',
      },
      {
        name: 'Structured interview scorecards',
        blurb: 'Structured interview scorecards, so panels score candidates the same way',
      },
      {
        name: 'A 7-step offer flow',
        blurb: 'A 7-step offer flow — CTC calculator to HR Head approval to digital acceptance',
      },
      {
        name: 'One-click candidate-to-employee conversion',
        blurb: 'One-click candidate-to-employee conversion — no re-keying the same data twice',
      },
    ],
  },
  {
    id: 'plan',
    name: 'Plan',
    promise: 'Know the cost before you make the offer',
    modules: [
      {
        name: 'Model a CTC structure and see in-hand pay',
        blurb: 'Model a CTC structure and see in-hand pay, employer cost and statutory impact together — before an offer goes out',
      },
      {
        name: 'Headcount plans by department',
        blurb: 'Headcount plans by department, branch or company, so hiring has a budget to hire against, not a guess',
      },
      {
        name: 'Planned versus actual cost visible as offers are made and ',
        blurb: 'Planned versus actual cost visible as offers are made and people join — not reconciled after the fact at quarter-end',
      },
      {
        name: 'Every approved CTC structure flows straight into payroll a',
        blurb: 'Every approved CTC structure flows straight into payroll and the employee\'s ESS — no re-entry when someone joins',
      },
    ],
  },
  {
    id: 'onboard',
    name: 'Onboard',
    promise: 'Onboarding, without the paper chase',
    href: '/features/recruitment',
    modules: [
      {
        name: 'Aadhaar e-KYC built into the candidate\'s own onboarding li',
        blurb: 'Aadhaar e-KYC built into the candidate\'s own onboarding link',
      },
      {
        name: 'Statutory forms auto-filled',
        blurb: 'Statutory forms auto-filled — PF Form 11, Form 2 (Revised), Form III Gratuity',
      },
      {
        name: 'Multi-department approval',
        blurb: 'Multi-department approval — IT, Admin and Payroll sign off in parallel, not in sequence',
      },
      {
        name: 'Employee code generated automatically the moment onboardin',
        blurb: 'Employee code generated automatically the moment onboarding completes',
      },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    promise: 'Attendance that doesn\'t need daily follow-up',
    href: '/features/attendance',
    modules: [
      {
        name: 'Punch in / punch out from the employee\'s own self-service ',
        blurb: 'Punch in / punch out from the employee\'s own self-service home screen',
      },
      {
        name: 'Missed-punch alerts sent automatically over WhatsApp and e',
        blurb: 'Missed-punch alerts sent automatically over WhatsApp and email, next day',
      },
      {
        name: 'Leave policies configured per company',
        blurb: 'Leave policies configured per company, per location, per employee grade',
      },
      {
        name: 'Attendance flows straight into the payroll run',
        blurb: 'Attendance flows straight into the payroll run — no separate export-import step',
      },
    ],
  },
  {
    id: 'pay',
    name: 'Pay',
    promise: 'Payroll that already knows the law',
    href: '/features/payroll',
    modules: [
      {
        name: 'Pro-rata',
        blurb: 'Pro-rata, EPF, ESIC and Professional Tax calculated automatically, every run',
      },
      {
        name: 'Arrears and month-wise TDS projection built into the engin',
        blurb: 'Arrears and month-wise TDS projection built into the engine, not bolted on',
      },
      {
        name: 'A 16-report reporting suite',
        blurb: 'A 16-report reporting suite, with column-level access — sensitive fields masked by role',
      },
      {
        name: 'One run',
        blurb: 'One run, every company, every branch — no separate spreadsheet per location',
      },
    ],
  },
  {
    id: 'serve',
    name: 'Serve',
    promise: 'Self-service employees actually use',
    href: '/features/ess',
    modules: [
      {
        name: 'Old vs new tax regime',
        blurb: 'Old vs new tax regime, compared side by side, before they decide',
      },
      {
        name: 'Flexible benefit choices',
        blurb: 'Flexible benefit choices — car & driver, meal card, telephone, LTA and more',
      },
      {
        name: 'A five-step investment declaration wizard',
        blurb: 'A five-step investment declaration wizard, not a 40-field form',
      },
      {
        name: 'Every payslip carries the full income-tax worksheet',
        blurb: 'Every payslip carries the full income-tax worksheet — never a mystery number',
      },
    ],
  },
  {
    id: 'claims',
    name: 'Claims',
    promise: 'Travel claims that don\'t wait for month-end',
    href: '/features/claims',
    modules: [
      {
        name: 'Local travel',
        blurb: 'Local travel — pick a mode, end the trip, fare calculates instantly',
      },
      {
        name: 'Outstation trips',
        blurb: 'Outstation trips — reporting manager approves, then finance, on the same record',
      },
      {
        name: 'Group travel',
        blurb: 'Group travel — limits pool automatically across everyone on the trip',
      },
      {
        name: 'Bills older than 90 days are declined automatically',
        blurb: 'Bills older than 90 days are declined automatically, no manual policing needed',
      },
    ],
  },
  {
    id: 'exit',
    name: 'Exit',
    promise: 'Exit, on the same engine that ran payroll',
    modules: [
      {
        name: 'Full-and-final settlement calculated from the same payroll',
        blurb: 'Full-and-final settlement calculated from the same payroll data — no re-entry',
      },
      {
        name: 'Access closes automatically from the date of leaving',
        blurb: 'Access closes automatically from the date of leaving — no lingering logins',
      },
      {
        name: 'Gratuity',
        blurb: 'Gratuity, leave encashment and dues settled against one record',
      },
      {
        name: 'Every exit produces a clean',
        blurb: 'Every exit produces a clean, auditable trail for compliance review',
      },
    ],
  },
]

/* Spec §4.1 §7 — the compliance strip. Called out as "the single highest-
 * credibility element for an Indian buyer", so it appears on the home page,
 * the features hub and the payroll page. */
export const complianceItems = [
  { code: 'EPF', label: 'Provident Fund' },
  { code: 'ESIC', label: 'Employees’ State Insurance' },
  { code: 'PT', label: 'Professional Tax, state-wise' },
  { code: 'LWF', label: 'Labour Welfare Fund' },
  { code: 'TDS', label: 'Tax deducted at source' },
  { code: 'Form 16', label: 'Annual tax certificate' },
  { code: 'Gratuity', label: 'Payment of Gratuity Act' },
  { code: 'Bonus', label: 'Payment of Bonus Act' },
  { code: 'S&E', label: 'Shops & Establishments' },
]

/* ── The twenty solutions ──────────────────────────────────────────────────
 * Handoff anchor #modules: "Seven-tab module deep-dive, plus the full
 * 20-solution grid below it."
 *
 * The grouped tabs above are for a reader who wants to understand the shape of
 * the product. This grid is for the other reader — the one scanning for one
 * specific thing, who will leave if they cannot find it in ten seconds.
 * Every entry maps to a real route in the HRMS app.
 *
 * `statutory: true` marks the ones a compliance-led buyer is actually here
 * for, so the grid can surface them visually. */
export type Solution = {
  /* The reference numbers these 01-20 and shows the number on the card. */
  n: string
  name: string
  blurb: string
  statutory?: boolean
  /* The reference marks 18-20 "Coming". Preserved rather than dropped: a
     roadmap item shown AS a roadmap item is honest; the same item shown as
     shipped is not. */
  coming?: boolean
}

export const solutions: Solution[] = [
  { n: '01', name: 'Recruitment & Hiring', blurb: 'AI-screened resumes, structured interview pipeline, offers sent and accepted digitally.', },
  { n: '02', name: 'Employee Onboarding', blurb: 'New hires fill in their own details; AI reads uploaded Aadhaar and PAN and fills the rest.', },
  { n: '03', name: 'Employee Master Record', blurb: 'One accurate record for every employee — not five spreadsheets that all disagree.', },
  { n: '04', name: 'Payroll Engine', blurb: 'Pro-rata pay, EPF, ESIC and Professional Tax, calculated automatically every month.', statutory: true, },
  { n: '05', name: 'Statutory Compliance', blurb: 'EPF, ESIC, PT, LWF and TDS — handled correctly, state by state.', statutory: true, },
  { n: '06', name: 'Attendance & Shift Management', blurb: 'Punches, shifts and rotations tracked without a separate biometric-only system.', statutory: true, },
  { n: '07', name: 'Leave Management', blurb: 'Leave types, balances and approvals that actually follow each state\'s real rules.', statutory: true, },
  { n: '08', name: 'Employee Self-Service', blurb: 'Leave, payslips and personal details — from an employee\'s own phone, any time.', },
  { n: '09', name: 'Multi-Company & Branch Architecture', blurb: 'A group of companies, each with its own compliance identity, on one platform.', },
  { n: '10', name: 'Flexible Benefits (FBP)', blurb: 'Employees structure part of their salary the way that suits their own tax position.', statutory: true, },
  { n: '11', name: 'Investment Declaration', blurb: 'Old tax regime versus new, compared side by side, before an employee commits.', statutory: true, },
  { n: '12', name: 'Reports & Analytics', blurb: 'Real headcount, payroll and compliance reporting — not a manually reconciled Excel file.', },
  { n: '13', name: 'Role-Based Access', blurb: 'The right person sees the right data. Nothing more, nothing less.', },
  { n: '14', name: 'Loan Management', blurb: 'Employee loans, EMI schedules and payroll recovery, tracked in one place.', },
  { n: '15', name: 'Travel & Expense Claims', blurb: 'Trip approval, claim submission and reimbursement — without an email chain.', },
  { n: '16', name: 'HR Letters', blurb: 'Offer, experience and relieving letters — generated instantly, not typed each time.', },
  { n: '17', name: 'Exit & Full-and-Final Settlement', blurb: 'A clean, calculated exit process, not a spreadsheet rebuilt from memory.', statutory: true, },
  { n: '18', name: 'Performance Management', blurb: 'Goal-setting, reviews and ratings, connected directly to compensation.', coming: true, },
  { n: '19', name: 'WhatsApp & Mobile Notifications', blurb: 'Leave approvals and attendance alerts delivered where employees already are.', coming: true, },
  { n: '20', name: 'EZER AI Assistant', blurb: 'Ask a question about your own leave balance or payslip, get an answer instantly.', coming: true, },
]
