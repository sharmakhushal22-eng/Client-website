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
  /* The reference's full tab label ("Recruitment & ATS"). `name` stays the
     site's own short form, for the compact places the long label will not
     fit. */
  label: string
  /* blurb is '' where the reference bullet has no natural lead-in to split
     on; the whole sentence is then the name and nothing renders beneath. */
  modules: { name: string; blurb: string }[]
  /* The status rows from the reference's per-area mock panel. Illustrative
     figures — captioned as such where they render. */
  mock: { label: string; value: string; state: 'ok' | 'pend' }[]
  /* Set once a /features/<slug> detail page exists. */
  href?: string
}

export const moduleGroups: ModuleGroup[] = [
  /* The eight areas from Website changes.html (#modules) — tab labels,
     headings, bullets and mock rows, all verbatim. */
  {
    id: 'hire',
    name: 'Hire',
    /* The reference's own tab label, kept verbatim. */
    label: 'Recruitment & ATS',
    promise: 'Easy hiring and talent management',
    href: '/features/recruitment',
    modules: [
      {
        name: 'Sourcing and job posting, with Naukri integration for the Indian market',
        blurb: '',
      },
      {
        name: 'Structured interview scorecards, so panels score candidates the same way',
        blurb: '',
      },
      {
        name: 'A 7-step offer flow',
        blurb: 'CTC calculator to HR Head approval to digital acceptance',
      },
      {
        name: 'One-click candidate-to-employee conversion',
        blurb: 'no re-keying the same data twice',
      },
    ],
    mock: [
      { label: 'Applications sourced (Naukri + direct)', value: '128', state: 'ok' },
      { label: 'Interview scorecards completed', value: '34', state: 'ok' },
      { label: 'Offers — CTC calculator to digital acceptance', value: '9 in flow', state: 'pend' },
      { label: 'Candidate → employee, one click', value: 'Enabled', state: 'ok' },
    ],
  },
  {
    id: 'plan',
    name: 'Plan',
    /* The reference's own tab label, kept verbatim. */
    label: 'CTC Planning & Manpower Budgeting',
    promise: 'Know the cost before you make the offer',
    modules: [
      {
        name: 'Model a CTC structure and see in-hand pay, employer cost and statutory impact together',
        blurb: 'before an offer goes out',
      },
      {
        name: 'Headcount plans by department, branch or company, so hiring has a budget to hire against, not a guess',
        blurb: '',
      },
      {
        name: 'Planned versus actual cost visible as offers are made and people join',
        blurb: 'not reconciled after the fact at quarter-end',
      },
      {
        name: 'Every approved CTC structure flows straight into payroll and the employee\'s ESS',
        blurb: 'no re-entry when someone joins',
      },
    ],
    mock: [
      { label: 'Headcount budget — Engineering, FY26-27', value: '42 / 50 planned', state: 'ok' },
      { label: 'Open offers against budget', value: '5 pending', state: 'pend' },
      { label: 'CTC structure → payroll', value: 'Synced automatically', state: 'ok' },
    ],
  },
  {
    id: 'onboard',
    name: 'Onboard',
    /* The reference's own tab label, kept verbatim. */
    label: 'Onboarding',
    promise: 'Onboarding, without the paper chase',
    href: '/features/ess',
    modules: [
      {
        name: 'Aadhaar e-KYC built into the candidate\'s own onboarding link',
        blurb: '',
      },
      {
        name: 'Statutory forms auto-filled',
        blurb: 'PF Form 11, Form 2 (Revised), Form III Gratuity',
      },
      {
        name: 'Multi-department approval',
        blurb: 'IT, Admin and Payroll sign off in parallel, not in sequence',
      },
      {
        name: 'Employee code generated automatically the moment onboarding completes',
        blurb: '',
      },
    ],
    mock: [
      { label: 'IT Setup — Asset issued', value: 'Done', state: 'ok' },
      { label: 'Admin — ID card', value: 'Done', state: 'ok' },
      { label: 'Payroll — Bank & PF details', value: 'Awaiting', state: 'pend' },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    /* The reference's own tab label, kept verbatim. */
    label: 'Attendance & Leave',
    promise: 'Attendance that doesn\'t need daily follow-up',
    href: '/features/attendance',
    modules: [
      {
        name: 'Punch in / punch out from the employee\'s own self-service home screen',
        blurb: '',
      },
      {
        name: 'Missed-punch alerts sent automatically over WhatsApp and email, next day',
        blurb: '',
      },
      {
        name: 'Leave policies configured per company, per location, per employee grade',
        blurb: '',
      },
      {
        name: 'Attendance flows straight into the payroll run',
        blurb: 'no separate export-import step',
      },
    ],
    mock: [
      { label: 'Punch IN — 09:41 AM', value: 'Logged', state: 'ok' },
      { label: 'Missed punch — yesterday', value: 'WhatsApp sent', state: 'pend' },
      { label: 'Leave balance — Casual', value: '6 days', state: 'ok' },
    ],
  },
  {
    id: 'pay',
    name: 'Pay',
    /* The reference's own tab label, kept verbatim. */
    label: 'Payroll & Statutory',
    promise: 'Payroll that already knows the law',
    href: '/features/payroll',
    modules: [
      {
        name: 'Pro-rata, EPF, ESIC and Professional Tax calculated automatically, every run',
        blurb: '',
      },
      {
        name: 'Arrears and month-wise TDS projection built into the engine, not bolted on',
        blurb: '',
      },
      {
        name: 'A 16-report reporting suite, with column-level access',
        blurb: 'sensitive fields masked by role',
      },
      {
        name: 'One run, every company, every branch',
        blurb: 'no separate spreadsheet per location',
      },
    ],
    mock: [
      { label: 'Multi-company payroll run', value: 'Run complete', state: 'ok' },
      { label: 'TDS projection — FY 26-27', value: 'Updated', state: 'ok' },
      { label: 'Aadhaar & bank fields', value: 'Masked · role-based', state: 'pend' },
    ],
  },
  {
    id: 'ess',
    name: 'Self-service',
    /* The reference's own tab label, kept verbatim. */
    label: 'Employee Self-Service',
    promise: 'Self-service employees actually use',
    href: '/features/ess',
    modules: [
      {
        name: 'Old vs new tax regime, compared side by side, before they decide',
        blurb: '',
      },
      {
        name: 'Flexible benefit choices',
        blurb: 'car & driver, meal card, telephone, LTA and more',
      },
      {
        name: 'A five-step investment declaration wizard, not a 40-field form',
        blurb: '',
      },
      {
        name: 'Every payslip carries the full income-tax worksheet',
        blurb: 'never a mystery number',
      },
    ],
    mock: [
      { label: 'Investment declarations submitted', value: 'On time', state: 'ok' },
      { label: 'Regime comparison shown', value: 'Before filing', state: 'ok' },
      { label: 'Flexi benefit heads available', value: '6 options', state: 'pend' },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    /* The reference's own tab label, kept verbatim. */
    label: 'Travel & Reimbursement',
    promise: 'Travel claims that don\'t wait for month-end',
    href: '/features/claims',
    modules: [
      {
        name: 'Local travel',
        blurb: 'pick a mode, end the trip, fare calculates instantly',
      },
      {
        name: 'Outstation trips',
        blurb: 'reporting manager approves, then finance, on the same record',
      },
      {
        name: 'Group travel',
        blurb: 'limits pool automatically across everyone on the trip',
      },
      {
        name: 'Bills older than 90 days are declined automatically, no manual policing needed',
        blurb: '',
      },
    ],
    mock: [
      { label: 'Local trips — fare auto-calculated', value: 'Live', state: 'ok' },
      { label: 'Outstation approvals — RM → Finance', value: 'In flow', state: 'pend' },
      { label: 'Group travel — pooled limits', value: 'Enabled', state: 'ok' },
    ],
  },
  {
    id: 'exit',
    name: 'Exit',
    /* The reference's own tab label, kept verbatim. */
    label: 'Exit & Full-and-Final',
    promise: 'Exit, on the same engine that ran payroll',
    modules: [
      {
        name: 'Full-and-final settlement calculated from the same payroll data',
        blurb: 'no re-entry',
      },
      {
        name: 'Access closes automatically from the date of leaving',
        blurb: 'no lingering logins',
      },
      {
        name: 'Gratuity, leave encashment and dues settled against one record',
        blurb: '',
      },
      {
        name: 'Every exit produces a clean, auditable trail for compliance review',
        blurb: '',
      },
    ],
    mock: [
      { label: 'FNF settlement — initiated', value: 'Calculated', state: 'ok' },
      { label: 'System access', value: 'Revoked', state: 'ok' },
      { label: 'Exit trail', value: 'Logged', state: 'ok' },
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
