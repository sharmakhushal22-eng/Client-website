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
  {
    id: 'hire',
    name: 'Hire',
    promise: 'From an approved vacancy to a signed offer, without a spreadsheet.',
    href: '/features/recruitment',
    modules: [
      {
        name: 'Recruitment',
        blurb: 'Manpower requisition workflow, JD generation and a candidate pipeline you can actually see.',
      },
      {
        name: 'Offer letters',
        blurb: 'Generate, send and track offers on your own letterhead, with CTC breakup attached.',
      },
    ],
  },
  {
    id: 'onboard',
    name: 'Onboard',
    promise: 'The new joiner fills in their own details before day one.',
    href: '/features/recruitment',
    modules: [
      {
        name: 'Candidate onboarding portal',
        blurb: 'The candidate enters their own personal, bank, PF and nominee details.',
      },
      {
        name: 'Document collection & verification',
        blurb: 'Collect PAN, Aadhaar, education and past-employment proof, then verify and mark them off.',
      },
      {
        name: 'Bulk employee upload',
        blurb: 'Bring an existing workforce in from a spreadsheet instead of typing it twice.',
      },
    ],
  },
  {
    id: 'manage',
    name: 'Manage',
    promise: 'One employee master across every company and every location.',
    modules: [
      { name: 'Employee master', blurb: 'One record per employee, and one place to change it.' },
      { name: 'Company profile', blurb: 'Group, companies and locations — corporate office, branch, factory, warehouse — each with its own EPF/ESIC/PT/GST registrations.' },
      { name: 'Roles & permissions', blurb: 'Rights per entity and per location — who sees salary, who approves, and who only looks.' },
      { name: 'Policies', blurb: 'Publish policy documents where employees can actually find them.' },
      { name: 'Transfers', blurb: 'Move an employee between locations or entities — a transfer, not a re-hire, with the statutory effect carried across.' },
      { name: 'Holidays', blurb: 'Location-wise holiday calendars, because Maharashtra is not Tamil Nadu.' },
      { name: 'Statutory leave', blurb: 'Leave types that follow the applicable state Shops & Establishments rules.' },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    promise: 'Attendance that feeds payroll directly, with nothing retyped.',
    href: '/features/attendance',
    modules: [
      { name: 'Attendance', blurb: 'Shifts, rosters and daily attendance for every location.' },
      { name: 'Attendance uploads & regularisation', blurb: 'Import from your biometric device; let managers fix what the machine got wrong.' },
      { name: 'Overtime', blurb: 'Calculated on your rules, then carried into the payroll run.' },
      { name: 'Leave', blurb: 'Apply, approve and track balances without an email chain.' },
      { name: 'Attendance reports', blurb: 'Muster roll, late marks, absenteeism, by location and by month.' },
    ],
  },
  {
    id: 'pay',
    name: 'Pay',
    promise: 'Calculated on the labour-code wage definition, and traceable to how.',
    href: '/features/payroll',
    modules: [
      { name: 'Payroll run cycle', blurb: 'Lock attendance, run, review the variance, release. Reversible until you release it.' },
      { name: 'EPF', blurb: 'Employee and employer contribution, EPS split, admin charges, ECR file.' },
      { name: 'ESIC', blurb: 'Wage-ceiling handling, contribution period rules, return-ready output.' },
      { name: 'Professional Tax', blurb: 'State-wise slabs, applied by the employee’s work location.' },
      { name: 'LWF', blurb: 'Labour Welfare Fund at the applicable state frequency and rate.' },
      { name: 'Employer NPS', blurb: 'Employer contribution under 80CCD(2), handled inside the salary structure.' },
      { name: 'TDS', blurb: 'Old and new regime, declarations, proofs, month-on-month projection, Form 16.' },
      { name: 'Arrears', blurb: 'Retrospective increments and their statutory effect, back to the effective month.' },
      { name: 'Payslips', blurb: 'Published to the ESS portal. No more forwarding PDFs from the HR inbox.' },
      { name: 'Full & final', blurb: 'Notice period, leave encashment, gratuity, recoveries, in one settlement.' },
    ],
  },
  {
    id: 'claims',
    name: 'Claims',
    promise: 'Employees claim, Finance approves, payroll picks it up.',
    href: '/features/claims',
    modules: [
      { name: 'Flexi benefits & claims', blurb: 'Declare, claim and substantiate the flexible part of the salary structure.' },
      { name: 'Investment proofs', blurb: 'Collect and verify proofs against declarations, before the TDS projection changes.' },
      { name: 'Travel claims with GPS-measured trips', blurb: 'Distance measured, not estimated — which ends the argument about kilometres.' },
      { name: 'Finance approval queue', blurb: 'One queue for Finance instead of a folder of forwarded emails.' },
    ],
  },
  {
    id: 'serve',
    name: 'Serve',
    promise: 'The HR inbox stops being a helpdesk.',
    href: '/features/ess',
    modules: [
      { name: 'Employee Self-Service portal', blurb: 'Payslips, tax, leave, attendance and documents, self-served.' },
      { name: 'ESS credentials', blurb: 'Issue and manage portal access in bulk.' },
      { name: 'Loans & advances', blurb: 'Request, approve, disburse and recover through payroll automatically.' },
      { name: 'Letters', blurb: 'Offer, confirmation, experience and relieving letters from your templates.' },
    ],
  },
  {
    id: 'control',
    name: 'Control',
    promise: 'The statutory position for every entity, on demand.',
    modules: [
      { name: 'Compliance', blurb: 'What is due, what is filed and what is outstanding — across every registration the group holds.' },
      { name: 'Reports', blurb: 'Salary registers, statutory returns, headcount and cost — per entity or consolidated across the group.' },
      { name: 'Support desk', blurb: 'Employees raise tickets in the portal; HR answers in one place.' },
      { name: 'Data export', blurb: 'Your data, out, whenever you want it. No lock-in.' },
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
  name: string
  blurb: string
  statutory?: boolean
}

export const solutions: Solution[] = [
  { name: 'Recruitment', blurb: 'Manpower requisition, JD generation and a candidate pipeline you can see.' },
  { name: 'Onboarding', blurb: 'The joiner enters their own bank, PF and nominee details before day one.' },
  { name: 'Employee master', blurb: 'One record per person across every entity in the group.' },
  { name: 'Company & locations', blurb: 'Group, companies, and corporate office / branch / factory / warehouse beneath them.' },
  { name: 'Roles & rights', blurb: 'Who sees salary, who approves, and who only looks — per entity and per location.' },
  { name: 'Attendance', blurb: 'Shifts, rosters and biometric import for every location.' },
  { name: 'Leave', blurb: 'Applications, approvals and balances that HR, the manager and payroll all read the same.' },
  { name: 'Overtime', blurb: 'Calculated on your rules, carried straight into the run.', statutory: true },
  { name: 'Payroll run', blurb: 'Lock, calculate, review the variance, release. Reversible until you release it.' },
  { name: 'EPF', blurb: 'Contributions, EPS split, admin and EDLI charges, ECR-ready output.', statutory: true },
  { name: 'ESIC', blurb: 'Wage ceiling and contribution-period rules, including mid-period crossings.', statutory: true },
  { name: 'Professional Tax', blurb: 'State-wise slabs applied by the employee’s work location.', statutory: true },
  { name: 'Labour Welfare Fund', blurb: 'At each state’s own rate and frequency — monthly, half-yearly or annual.', statutory: true },
  { name: 'TDS & Form 16', blurb: 'Both regimes, declarations, verified proofs, monthly projection.', statutory: true },
  { name: 'Gratuity & bonus', blurb: 'Entitlement against completed service, and statutory bonus on the applicable ceiling.', statutory: true },
  { name: 'Full & final', blurb: 'Notice, encashment, gratuity and recoveries settled in one calculation.', statutory: true },
  { name: 'Claims & flexi benefits', blurb: 'Declare, claim and substantiate within the flexible part of the structure.' },
  { name: 'Travel claims', blurb: 'GPS-measured trips, which ends the argument about kilometres.' },
  { name: 'Employee self-service', blurb: 'Payslips, tax, leave, documents and letters, served without HR.' },
  { name: 'Reports & compliance', blurb: 'Registers and returns per entity or consolidated, with full data export.', statutory: true },
]
