import type { IconName } from '@/components/ui/Icon'

/* ============================================================================
 * Feature detail page content — spec §4.3.
 *
 * Every page uses the same seven-part skeleton so they stay consistent and
 * can be produced quickly:
 *   1 hero · 2 the problem · 3 what it does · 4 screenshots
 *   5 who it's for · 6 related modules · 7 CTA
 *
 * Capability bullets describe what the product actually does today. Anything
 * aspirational belongs on a roadmap, not here — spec §4.2.
 * ========================================================================= */

export type Persona = { role: string; benefit: string; icon: IconName }

export type FeaturePage = {
  slug: string
  /* ≤ 42 chars so the composed <title> stays inside 60 (§8.4). */
  seoTitle: string
  seoDescription: string
  eyebrow: string
  name: string
  promise: string
  intro: string
  problem: string[]
  capabilities: { title: string; body: string }[]
  screenshots: { src?: string; alt: string; title: string; caption: string }[]
  personas: Persona[]
  related: { slug: string; name: string; blurb: string }[]
  faqs: { q: string; a: string }[]
}

const ALL_RELATED = {
  payroll: { slug: 'payroll', name: 'Payroll & compliance', blurb: 'EPF, ESIC, PT, LWF, TDS and Form 16 in the run.' },
  attendance: { slug: 'attendance', name: 'Attendance & leave', blurb: 'Shifts, overtime and regularisation feeding payroll.' },
  recruitment: { slug: 'recruitment', name: 'Recruitment & onboarding', blurb: 'Requisition to signed offer to day one.' },
  ess: { slug: 'ess', name: 'Employee self-service', blurb: 'Payslips, leave and documents, self-served.' },
  claims: { slug: 'claims', name: 'Claims & travel', blurb: 'Flexi benefits, proofs and GPS-measured trips.' },
}

export const featurePages: FeaturePage[] = [
  /* ── Payroll ─────────────────────────────────────────────────────────────
   * Spec §4.3: "This page will do the heaviest selling." It additionally
   * carries the statutory coverage table, a worked payslip example and the
   * auditability line — all rendered by the payroll route. */
  {
    slug: 'payroll',
    seoTitle: 'Payroll & Statutory Compliance Software',
    seoDescription:
      'Run Indian payroll with EPF, ESIC, Professional Tax, LWF and TDS calculated in the same pass. Arrears, Form 16, payslips and full & final included.',
    eyebrow: 'Pay',
    name: 'Payroll & statutory compliance',
    promise: 'One run. Every statutory number calculated, and every one traceable.',
    intro:
      'Payroll is where an HRMS either earns its keep or creates a second job. EZER calculates gross, deductions, employer contributions and every applicable statutory head in a single pass — from the attendance you already captured, against the salary structure you already configured.',
    problem: [
      'Without a system, month-end is a chain of spreadsheets. Attendance comes off a biometric export, the salary sheet is built by hand, and EPF, ESIC, PT and TDS are each worked out in their own tab.',
      'Every one of those handoffs is a place for a number to change. The register is reconciled twice because nobody quite trusts it the first time, and when an employee disputes a deduction there is no calculation to point at — only a cell.',
    ],
    capabilities: [
      { title: 'A run you can reverse', body: 'Lock attendance, calculate, review the variance against last month, then release. Nothing is final until you release it, so a mistake found on the 29th is a re-run, not a correction cycle.' },
      { title: 'EPF, exactly as the act requires', body: 'Employee and employer contribution, the EPS split, admin and EDLI charges, and wage-ceiling handling for members above and below the limit. ECR-ready output.' },
      { title: 'ESIC with contribution-period rules', body: 'The wage ceiling, mid-period crossings and the rule that an employee who crosses mid-period stays covered to the end of it — handled, not left to whoever remembers.' },
      { title: 'Professional Tax, state by state', body: 'PT slabs configured per state and applied by the employee’s work location, so a company operating in five states runs one payroll, not five.' },
      { title: 'LWF at the right frequency', body: 'Labour Welfare Fund varies by state in both rate and frequency — monthly, half-yearly, annual. Configured once per state registration.' },
      { title: 'TDS across both regimes', body: 'Old and new regime, declarations, verified proofs, a month-on-month projection that updates as the year progresses, and Form 16 at the end of it.' },
      { title: 'Arrears that reach backwards', body: 'A retrospective increment recalculates the affected months and carries its statutory effect with it, rather than being dropped in as a lump sum that breaks the PF reconciliation.' },
      { title: 'Full & final in one settlement', body: 'Notice period, leave encashment, gratuity, loan recovery and pending claims resolved together, with the statutory deductions applied to the settlement itself.' },
    ],
    screenshots: [
      { alt: 'Payroll run screen showing the month-on-month variance review before release', title: 'Review the variance, not the register', caption: 'The run shows what changed since last month and why — joiners, exits, arrears, attendance impact. You approve the differences.' },
      { alt: 'Payslip showing earnings, deductions, EPF, ESIC and Professional Tax with the statutory basis for each', title: 'A payslip that explains itself', caption: 'Each deduction carries its basis. When an employee asks why PF changed, the payslip answers before HR has to.' },
      { alt: 'Statutory compliance dashboard listing EPF, ESIC, PT and TDS due dates and filing status', title: 'What is due, and what is filed', caption: 'Every registration you hold, with due dates and filing status. Nothing is due only in someone’s head.' },
    ],
    personas: [
      { role: 'HR', benefit: 'Month-end closes in hours. Statutory heads are calculated, not assembled.', icon: 'users' },
      { role: 'Finance', benefit: 'Every figure traces to its calculation. The audit question has an answer on screen.', icon: 'chart' },
      { role: 'Employees', benefit: 'Payslips arrive in the portal with each deduction explained.', icon: 'user-plus' },
      { role: 'Managers', benefit: 'Cost by department and location, without asking HR for an extract.', icon: 'briefcase' },
    ],
    related: [ALL_RELATED.attendance, ALL_RELATED.claims, ALL_RELATED.ess],
    faqs: [
      { q: 'Can you handle multiple states and multiple entities?', a: 'Yes. Professional Tax and LWF are configured per state registration and applied by the employee’s work location. Multiple legal entities each keep their own EPF, ESIC and PT registrations, their own letterhead and their own statutory calendar, while HR works in one system.' },
      { q: 'What happens to year-to-date figures when we migrate mid-year?', a: 'They come across with the migration. This matters more than most other data: without accurate year-to-date earnings and tax deducted, the TDS projection for the remaining months is wrong, and every employee sees a mismatch in their Form 16.' },
      { q: 'Is the calculation auditable?', a: 'Every component on a payslip can be opened to show the inputs it was derived from — the attendance days, the salary structure in force that month, the statutory rate applied and the ceiling logic used. That trail is what makes a payroll defensible in an audit rather than merely correct.' },
    ],
  },

  /* ── Attendance ──────────────────────────────────────────────────────── */
  {
    slug: 'attendance',
    seoTitle: 'Attendance & Leave Management System',
    seoDescription:
      'Shift rosters, biometric imports, regularisation, overtime and leave balances that feed payroll directly — no retyping between attendance and salary.',
    eyebrow: 'Time',
    name: 'Attendance & leave',
    promise: 'Attendance that becomes payroll input without anyone retyping it.',
    intro:
      'Attendance only matters because it determines pay. EZER treats it that way: shifts, rosters, imports and regularisations all resolve into the day count that the payroll run reads directly.',
    problem: [
      'The biometric machine produces a punch log. Payroll needs a day count. Between the two sits somebody with a spreadsheet, reconciling missed punches against leave applications sitting in an email folder.',
      'By the time it is settled, half the month’s regularisations were approved verbally and the leave balance nobody trusts is the one on the register.',
    ],
    capabilities: [
      { title: 'Shifts and rosters by location', body: 'Define shift patterns, weekly offs and location-specific rules. Night shifts crossing midnight are handled as one shift, not two half days.' },
      { title: 'Import from your existing device', body: 'Upload the punch log from the biometric system you already have. There is no hardware to replace to start using this.' },
      { title: 'Regularisation with an approval trail', body: 'A missed punch is raised by the employee, approved by the manager, and recorded with who approved it and when — not settled in a corridor.' },
      { title: 'Overtime on your rules', body: 'Configure how overtime is earned and at what rate, then let it carry into the payroll run as a calculated component.' },
      { title: 'Leave with balances that reconcile', body: 'Apply, approve, track. Balances, accruals, carry-forward and encashment follow the policy you configured, and the same balance appears to the employee, the manager and payroll.' },
      { title: 'Statutory leave by state', body: 'Leave entitlements that follow the applicable state Shops & Establishments rules, rather than one policy applied everywhere and reconciled later.' },
      { title: 'Holiday calendars per location', body: 'A Maharashtra location and a Tamil Nadu location do not share a holiday list. Neither should their attendance.' },
      { title: 'Reports that answer the question', body: 'Muster roll, late marks, absenteeism and shift coverage, by location and by month, exportable.' },
    ],
    screenshots: [
      { alt: 'Monthly attendance grid showing shifts, leave and regularisation status per employee', title: 'The month at a glance', caption: 'Every employee, every day, colour-coded by status — with the exceptions surfaced rather than buried.' },
      { alt: 'Leave application and approval screen with the running balance shown', title: 'One balance, seen by everyone', caption: 'The employee, the approving manager and payroll all read the same number.' },
    ],
    personas: [
      { role: 'HR', benefit: 'Attendance closes without a reconciliation spreadsheet.', icon: 'users' },
      { role: 'Managers', benefit: 'Approve regularisations and leave in one queue, with the balance visible.', icon: 'briefcase' },
      { role: 'Employees', benefit: 'Apply for leave and see the balance without asking anyone.', icon: 'user-plus' },
      { role: 'Finance', benefit: 'Overtime and loss-of-pay arrive in payroll already calculated.', icon: 'chart' },
    ],
    related: [ALL_RELATED.payroll, ALL_RELATED.ess, ALL_RELATED.claims],
    faqs: [
      { q: 'Do we need to replace our biometric devices?', a: 'No. Attendance is imported from the punch log your existing devices already produce, so you can start without touching the hardware.' },
      { q: 'Can different locations have different shift and holiday rules?', a: 'Yes, and they generally must. Shift patterns, weekly offs, holiday calendars and statutory leave entitlements are all set per location, because the applicable Shops & Establishments rules differ by state.' },
    ],
  },

  /* ── Recruitment ─────────────────────────────────────────────────────── */
  {
    slug: 'recruitment',
    seoTitle: 'Recruitment & Employee Onboarding Software',
    seoDescription:
      'Manpower requisition workflow, candidate pipeline, offer letters with CTC breakup, and an onboarding portal where the joiner enters their own details.',
    eyebrow: 'Hire & Onboard',
    name: 'Recruitment & onboarding',
    promise: 'From an approved vacancy to a joiner already in the employee master.',
    intro:
      'Hiring usually ends where the HRMS begins — which is why the same details get typed twice. Here the candidate’s own submission becomes the employee record, so day one starts with the data already in place.',
    problem: [
      'A vacancy is approved over email, candidates are tracked in a spreadsheet, the offer is drafted in Word, and the joiner arrives with a folder of photocopies that somebody types into the payroll system.',
      'Every step is a retype, and the PAN that was mistyped in week one surfaces eleven months later in a Form 16.',
    ],
    capabilities: [
      { title: 'Manpower requisition workflow', body: 'A vacancy is raised, routed for approval and tracked — so the headcount being recruited for is the headcount that was actually sanctioned.' },
      { title: 'Job description generation', body: 'Draft a JD from the role and requirement rather than starting from the last one somebody saved.' },
      { title: 'A candidate pipeline you can see', body: 'Applications, stages, interview outcomes and status in one view, instead of one recruiter’s spreadsheet.' },
      { title: 'Offer letters on your letterhead', body: 'Generate the offer with the CTC breakup attached, send it, and track whether it was opened, accepted or is still sitting there.' },
      { title: 'The candidate fills in their own details', body: 'Personal details, bank account, PF and nominee information are entered by the joiner in their own portal — which is also the only person who knows them accurately.' },
      { title: 'Document collection and verification', body: 'PAN, Aadhaar, education and past-employment proof collected against a checklist, then verified and marked off. You can see what is still missing before day one.' },
      { title: 'Bulk employee upload', body: 'Bringing an existing workforce in is a spreadsheet upload, not a data-entry project.' },
      { title: 'Straight into the employee master', body: 'On joining, the verified record becomes the employee record. Nothing is retyped, so nothing is mistyped.' },
    ],
    screenshots: [
      { alt: 'Candidate pipeline board showing applicants by recruitment stage', title: 'Where every candidate actually is', caption: 'Stages, owners and outcomes in one place — including the ones that have gone quiet.' },
      { alt: 'Candidate onboarding portal where the joiner enters personal, bank and PF details', title: 'The joiner does the typing', caption: 'And they get it right, because it is their own bank account and their own PAN.' },
    ],
    personas: [
      { role: 'HR', benefit: 'Day one starts with a complete, verified record already in the system.', icon: 'users' },
      { role: 'Hiring managers', benefit: 'Raise a requisition and see the pipeline without chasing the recruiter.', icon: 'briefcase' },
      { role: 'Candidates', benefit: 'One portal for the offer, the documents and the details.', icon: 'user-plus' },
      { role: 'Finance', benefit: 'Recruitment is against sanctioned headcount, visible before the offer goes out.', icon: 'chart' },
    ],
    related: [ALL_RELATED.payroll, ALL_RELATED.ess, ALL_RELATED.attendance],
    faqs: [
      { q: 'Can we move an existing workforce in without retyping it?', a: 'Yes — that is what the bulk upload is for. Employee master data, salary structures and opening leave balances come in from a spreadsheet, and we help map the columns during implementation.' },
      { q: 'Do offer letters use our own letterhead and format?', a: 'Yes. Letter templates and letterheads are configured per legal entity, so a group with several companies issues each offer on the right one.' },
    ],
  },

  /* ── ESS ─────────────────────────────────────────────────────────────── */
  {
    slug: 'ess',
    seoTitle: 'Employee Self-Service Portal',
    seoDescription:
      'Payslips, tax declarations, leave balances, attendance, documents and letters — served to employees directly, so the HR inbox stops being a helpdesk.',
    eyebrow: 'Serve',
    name: 'Employee self-service',
    promise: 'The questions HR answers every month, answered without HR.',
    intro:
      'Most of what lands in an HR inbox is a lookup, not a decision. The ESS portal hands those lookups to the person asking, which is both faster for them and the single biggest reduction in HR workload the system delivers.',
    problem: [
      'A payslip request, a leave balance query, a salary certificate for a home loan, a request to re-send last year’s Form 16. Individually trivial; collectively, a part-time job.',
      'And because each one interrupts something else, the work that actually needed HR judgement is the work that gets delayed.',
    ],
    capabilities: [
      { title: 'Payslips, published not emailed', body: 'Every month’s payslip is in the portal, including the ones from before the employee lost the email.' },
      { title: 'Tax declarations and proofs', body: 'Employees declare their investments and upload proofs themselves, against a deadline you set, and see the effect on their projected tax.' },
      { title: 'Leave balance and applications', body: 'The same balance HR and payroll see. Apply, track and check without sending anyone a message.' },
      { title: 'Attendance and regularisation', body: 'See your own attendance, raise a regularisation for a missed punch, and watch it move through approval.' },
      { title: 'Documents in one place', body: 'Personal documents, policies and issued letters, available without a request.' },
      { title: 'Loans and advances', body: 'Request, track approval, and see the recovery schedule running through payroll.' },
      { title: 'Letters on request', body: 'Offer, confirmation, experience and relieving letters generated from your templates rather than drafted individually.' },
      { title: 'Support desk', body: 'When the answer genuinely needs a person, the question arrives as a ticket rather than as the fourth message in a thread.' },
    ],
    screenshots: [
      { alt: 'Employee self-service portal home showing payslips, leave balance and pending actions', title: 'Everything an employee asks for', caption: 'Payslips, balances, declarations and documents — on the first screen.' },
      { alt: 'Tax declaration screen showing investment declarations and projected tax for the year', title: 'Declarations, with the consequence shown', caption: 'The employee sees what a declaration does to their monthly deduction, which is when they get it right.' },
    ],
    personas: [
      { role: 'HR', benefit: 'The routine inbox drops away. What is left needs a person.', icon: 'users' },
      { role: 'Employees', benefit: 'Answers at any hour, without asking anyone for them.', icon: 'user-plus' },
      { role: 'Managers', benefit: 'Approvals in a queue rather than scattered across email.', icon: 'briefcase' },
      { role: 'Finance', benefit: 'Declarations and proofs arrive on time, so the TDS projection is right.', icon: 'chart' },
    ],
    related: [ALL_RELATED.payroll, ALL_RELATED.claims, ALL_RELATED.attendance],
    faqs: [
      { q: 'How do employees get access?', a: 'ESS credentials are issued in bulk from the HR side, so an entire workforce can be onboarded to the portal at once rather than one account at a time.' },
      { q: 'Can employees see previous years’ payslips and Form 16?', a: 'Yes. History stays available in the portal, which removes most of the re-send requests that come in during loan and visa applications.' },
    ],
  },

  /* ── Claims ──────────────────────────────────────────────────────────── */
  {
    slug: 'claims',
    seoTitle: 'Claims, Travel & Reimbursement Software',
    seoDescription:
      'Flexi benefit claims, investment proof verification, travel claims with GPS-measured distance, and a single Finance approval queue that feeds payroll.',
    eyebrow: 'Claims',
    name: 'Claims, travel & reimbursements',
    promise: 'Employees claim, Finance approves once, payroll picks it up.',
    intro:
      'Reimbursements are small amounts and large amounts of administration. The cost is not the money — it is the approvals scattered across email and the argument about how far it actually was.',
    problem: [
      'Flexi claims arrive as scanned bills attached to messages. Travel claims arrive as a distance the claimant estimated. Finance approves them in an inbox, and payroll finds out about them last.',
      'Nobody can say what has been claimed this year against a declared limit until someone builds the sheet that says so.',
    ],
    capabilities: [
      { title: 'Flexi benefits, declared then claimed', body: 'Employees declare against the flexible part of their salary structure, then claim and substantiate within it — with the remaining limit visible as they go.' },
      { title: 'Investment proofs against declarations', body: 'Proofs are collected and verified against what was declared, before the TDS projection changes rather than after.' },
      { title: 'Travel distance measured, not estimated', body: 'Trips are GPS-measured, which ends the annual argument about kilometres and removes the need for anyone to adjudicate it.' },
      { title: 'One Finance approval queue', body: 'Everything awaiting Finance in one place, with the supporting document attached to the claim rather than to a forwarded email.' },
      { title: 'Approval chains that match your delegation', body: 'Route by amount, by department or by claim type, so a routine claim does not need the same signature as an unusual one.' },
      { title: 'Straight into payroll', body: 'An approved claim becomes a payroll component in the next run, without a separate instruction to whoever processes salary.' },
      { title: 'A year-to-date position, always', body: 'What has been claimed, against what was declared, against what the limit allows — for any employee, at any point in the year.' },
    ],
    screenshots: [
      { alt: 'Finance approval queue showing pending flexi and travel claims with attached proofs', title: 'One queue for Finance', caption: 'Pending claims, the supporting document, and the year-to-date position — in the place the decision is made.' },
      { alt: 'Travel claim showing a GPS-measured trip route and calculated distance', title: 'The distance is measured', caption: 'Which is a shorter conversation than the one about whether it was really 140 kilometres.' },
    ],
    personas: [
      { role: 'Employees', benefit: 'Claim in the portal and see the remaining limit before claiming.', icon: 'user-plus' },
      { role: 'Finance', benefit: 'One queue, with proof attached. Approved claims flow to payroll.', icon: 'chart' },
      { role: 'HR', benefit: 'Declarations, proofs and limits reconcile without a separate sheet.', icon: 'users' },
      { role: 'Managers', benefit: 'Approve team claims against a policy, not against a guess.', icon: 'briefcase' },
    ],
    related: [ALL_RELATED.payroll, ALL_RELATED.ess, ALL_RELATED.attendance],
    faqs: [
      { q: 'How is travel distance measured?', a: 'Trips are measured by GPS rather than entered by the claimant, so the distance on the claim is the distance travelled. In practice this removes the most common source of dispute in reimbursement.' },
      { q: 'Do approved claims need re-entering into payroll?', a: 'No. An approved claim becomes a component in the next payroll run directly, which is the point at which most reimbursement processes otherwise break.' },
    ],
  },
]

export function getFeaturePage(slug: string): FeaturePage | undefined {
  return featurePages.find((p) => p.slug === slug)
}
