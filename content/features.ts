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
  /* A kit illustration for the page hero, used while real screenshots do not
     exist yet. Rendered by <Illustration>, which labels it as drawn — never
     by <ScreenshotFrame>, which would present it as the running product. */
  illustration?: { src: string; alt: string; ratio?: string }
  personas: Persona[]
  related: { slug: string; name: string; blurb: string }[]
  faqs: { q: string; a: string }[]
}

const ALL_RELATED = {
  payroll: { slug: 'payroll', name: 'Payroll & compliance', blurb: 'EPF, ESIC, PT, LWF, TDS and Form 130 in the run.' },
  attendance: { slug: 'attendance', name: 'Attendance & leave', blurb: 'Shifts, overtime and regularisation feeding payroll.' },
  recruitment: { slug: 'recruitment', name: 'Recruitment & onboarding', blurb: 'Requisition to signed offer to day one.' },
  ess: { slug: 'ess', name: 'Employee self-service', blurb: 'Payslips, leave and documents, self-served.' },
  claims: { slug: 'claims', name: 'Claims & travel', blurb: 'Flexi benefits, proofs and GPS-measured trips.' },
  performance: { slug: 'performance', name: 'Performance & learning', blurb: 'KRA cycles, ratings, PIPs and a learning studio.' },
  analytics: { slug: 'analytics', name: 'People analytics', blurb: 'An AI briefing, manager notes and live reports.' },
  engagement: { slug: 'engagement', name: 'Engagement', blurb: 'Wall of Fame, Fun Zone, inbox and insights.' },
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
      'Run Indian payroll with EPF, ESIC, Professional Tax, LWF and TDS calculated in the same pass. Arrears, Form 130, payslips and full & final included.',
    eyebrow: 'Pay',
    name: 'Payroll & statutory compliance',
    promise: 'One run. Every statutory number calculated, and every one traceable.',
    intro:
      'Payroll is where an HRMS either earns its keep or creates a second job. EZER calculates gross, deductions, employer contributions and every applicable statutory head in a single pass, from the attendance you already captured and against the salary structure you already configured.',
    problem: [
      'Without a system, month-end is a chain of spreadsheets. Attendance comes off a biometric export, the salary sheet is built by hand, and EPF, ESIC, PT and TDS are each worked out in their own tab.',
      'Every one of those handoffs is a place for a number to change. The register is reconciled twice because nobody quite trusts it the first time, and when an employee disputes a deduction there is no calculation to point at, only a cell.',
    ],
    capabilities: [
      { title: 'A run you can reverse', body: 'Lock attendance, calculate, review the variance against last month, then release. Nothing is final until you release it, so a mistake found on the 29th is a re-run, not a correction cycle.' },
      { title: 'EPF, exactly as the act requires', body: 'Employee and employer contribution, the EPS split, admin and EDLI charges, and wage-ceiling handling for members above and below the limit. ECR-ready output.' },
      { title: 'ESIC with contribution-period rules', body: 'The wage ceiling, mid-period crossings and the rule that an employee who crosses mid-period stays covered to the end of it. All handled, rather than left to whoever remembers.' },
      { title: 'Professional Tax, state by state', body: 'PT slabs configured per state and applied by the employee’s work location, so a company operating in five states runs one payroll, not five.' },
      { title: 'LWF at the right frequency', body: 'Labour Welfare Fund varies by state in both rate and frequency: monthly, half-yearly or annual. Configured once per state registration.' },
      { title: 'TDS across both regimes', body: 'The new regime by default and the old one where an employee opts out, under the Income-tax Act, 2025. Declarations, verified proofs, a month-on-month projection that updates as the tax year progresses, and Form 130 (formerly Form 16) at the end of it.' },
      { title: 'Arrears that reach backwards', body: 'A retrospective increment recalculates the affected months and carries its statutory effect with it, rather than being dropped in as a lump sum that breaks the PF reconciliation.' },
      { title: 'Full & final in one settlement', body: 'Notice period, leave encashment, gratuity, loan recovery and pending claims resolved together, with the statutory deductions applied to the settlement itself.' },
    ],
    illustration: {
      src: '/kit/mockups/mockup-payslip.svg',
      ratio: 'aspect-[7/8]',
      alt:
        'A payslip showing earnings, deductions and the statutory basis for each: EPF, ESIC and Professional Tax.',
    },
    screenshots: [
      /* Real captures from the live product's demo company (fictional
         names and figures). The third entry used to promise a statutory
         filing dashboard with due dates and filing status; that screen is
         the Compliance Engine, which the product still marks "not built
         yet", so it was replaced with screens that exist today. */
      { src: '/product/analytics-pay-light.webp', alt: 'Payroll cost for the month: cost to company, gross, net, employer statutory contributions and every deduction head', title: 'The payroll, split the way Finance asks', caption: 'Cost to company, gross and net, employer PF, ESIC and gratuity, and every deduction from TDS to LWF and loan EMIs.' },
      { src: '/product/ess-flexi-light.webp', alt: 'An employee’s salary structure in self-service, with Basic, HRA, bonus, PF, professional tax and LWF, monthly and annual', title: 'A salary structure the employee can read', caption: 'Each component and each statutory deduction, monthly and annual, on the employee’s own screen. The PF question is answered before it reaches HR.' },
      { src: '/product/ctc-calculator-light.webp', alt: 'CTC calculator applying the state minimum wage, EPF ceiling, gratuity and statutory bonus to a ₹12 lakh CTC', title: 'Offers that respect the law before they go out', caption: 'State minimum wage, the EPF ceiling, metro HRA, gratuity and statutory bonus applied to the breakup as it is built.' },
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
      { q: 'What happens to year-to-date figures when we migrate mid-year?', a: 'They come across with the migration. This matters more than most other data: without accurate year-to-date earnings and tax deducted, the TDS projection for the remaining months is wrong, and every employee sees a mismatch in their Form 130.' },
      { q: 'Is the calculation auditable?', a: 'Every component on a payslip can be opened to show the inputs it was derived from: the attendance days, the salary structure in force that month, the statutory rate applied and the ceiling logic used. That trail is what makes a payroll defensible in an audit rather than merely correct.' },
    ],
  },

  /* ── Attendance ──────────────────────────────────────────────────────── */
  {
    slug: 'attendance',
    seoTitle: 'Attendance & Leave Management System',
    seoDescription:
      'Shift rosters, biometric imports, regularisation, overtime and leave balances that feed payroll directly, with no retyping between attendance and salary.',
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
      { title: 'Regularisation with an approval trail', body: 'A missed punch is raised by the employee, approved by the manager, and recorded with who approved it and when, rather than settled in a corridor.' },
      { title: 'Overtime on your rules', body: 'Configure how overtime is earned and at what rate, then let it carry into the payroll run as a calculated component.' },
      { title: 'Leave with balances that reconcile', body: 'Apply, approve, track. Balances, accruals, carry-forward and encashment follow the policy you configured, and the same balance appears to the employee, the manager and payroll.' },
      { title: 'Statutory leave by state', body: 'Leave entitlements that follow the applicable state Shops & Establishments rules, rather than one policy applied everywhere and reconciled later.' },
      { title: 'Holiday calendars per location', body: 'A Maharashtra location and a Tamil Nadu location do not share a holiday list. Neither should their attendance.' },
      { title: 'Reports that answer the question', body: 'Muster roll, late marks, absenteeism and shift coverage, by location and by month, exportable.' },
    ],
    illustration: {
      src: '/kit/specialized/anim-punch-in.svg',
      ratio: 'aspect-[6/5]',
      alt:
        'An employee punching in from the portal against their shift.',
    },
    screenshots: [
      { src: '/product/ess-home-light.webp', alt: 'Employee home with a punch-in clock, leave balance, monthly attendance and this week’s attendance', title: 'Punch in from the first screen', caption: 'Shift, punch, the week’s attendance and who on the team is in, before the employee has clicked anything.' },
      { src: '/product/ess-attendance-light.webp', alt: 'Monthly attendance calendar with present, absent, half-day, overtime and loss-of-pay counts', title: 'The month at a glance', caption: 'Every day colour-coded by status, with overtime and loss of pay counted as the month goes.' },
      { src: '/product/leave-config-light.webp', alt: 'Leave configuration listing each leave type with its rules: paid, half-day, encashable, lapsing and approver', title: 'Leave policy as configuration', caption: 'Add a leave type, set who approves it and whether it lapses or encashes. No release, no ticket.' },
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
      'Hiring usually ends where the HRMS begins, which is why the same details get typed twice. Here the candidate’s own submission becomes the employee record, so day one starts with the data already in place.',
    problem: [
      'A vacancy is approved over email, candidates are tracked in a spreadsheet, the offer is drafted in Word, and the joiner arrives with a folder of photocopies that somebody types into the payroll system.',
      'Every step is a retype, and the PAN that was mistyped in week one surfaces eleven months later in a Form 130.',
    ],
    capabilities: [
      { title: 'Manpower requisition workflow', body: 'A vacancy is raised, routed for approval and tracked, so the headcount being recruited for is the headcount that was actually sanctioned.' },
      { title: 'Job description generation', body: 'Draft a JD from the role and requirement rather than starting from the last one somebody saved.' },
      { title: 'A candidate pipeline you can see', body: 'Applications, stages, interview outcomes and status in one view, instead of one recruiter’s spreadsheet.' },
      { title: 'Offer letters on your letterhead', body: 'Generate the offer with the CTC breakup attached, send it, and track whether it was opened, accepted or is still sitting there.' },
      { title: 'The candidate fills in their own details', body: 'Personal details, bank account, PF and nominee information are entered by the joiner in their own portal. They are the only person who knows them accurately.' },
      { title: 'Document collection and verification', body: 'PAN, Aadhaar, education and past-employment proof collected against a checklist, then verified and marked off. You can see what is still missing before day one.' },
      { title: 'Bulk employee upload', body: 'Bringing an existing workforce in is a spreadsheet upload, not a data-entry project.' },
      { title: 'Straight into the employee master', body: 'On joining, the verified record becomes the employee record. Nothing is retyped, so nothing is mistyped.' },
    ],
    illustration: {
      src: '/kit/scenes/scene-candidate-offer.svg',
      ratio: 'aspect-[15/11]',
      alt:
        'A candidate reviewing an offer, with the old-versus-new regime comparison shown before they accept.',
    },
    screenshots: [
      { src: '/product/recruitment-light.webp', alt: 'Recruitment dashboard showing the five hiring stages, next steps, requisitions and candidates by stage', title: 'Where every candidate actually is', caption: 'Applied, AI screened, interviews, shortlisted, offer sent. Rejections are kept apart, and the next steps are listed most urgent first.' },
      { src: '/product/onboarding-light.webp', alt: 'Onboarding overview with joiners in progress, pending actions and AI-flagged high-risk joinings', title: 'Every joiner, and what is still pending', caption: 'Onboarding links go out in one click, and the joinings that are drifting are flagged with the reason.' },
      { src: '/product/onboarding-compliance-light.webp', alt: 'Onboarding compliance tracker with EPF Form 11, Form 2, bank, policy, laptop, ID card and background-check status', title: 'PF forms and paperwork, tracked', caption: 'Form 11, Form 2, bank, policy acknowledgement, assets and BGV, per joiner, plus an immigration tracker for overseas staff.' },
    ],
    personas: [
      { role: 'HR', benefit: 'Day one starts with a complete, verified record already in the system.', icon: 'users' },
      { role: 'Hiring managers', benefit: 'Raise a requisition and see the pipeline without chasing the recruiter.', icon: 'briefcase' },
      { role: 'Candidates', benefit: 'One portal for the offer, the documents and the details.', icon: 'user-plus' },
      { role: 'Finance', benefit: 'Recruitment is against sanctioned headcount, visible before the offer goes out.', icon: 'chart' },
    ],
    related: [ALL_RELATED.payroll, ALL_RELATED.ess, ALL_RELATED.attendance],
    faqs: [
      { q: 'Can we move an existing workforce in without retyping it?', a: 'Yes, that is what the bulk upload is for. Employee master data, salary structures and opening leave balances come in from a spreadsheet, and we help map the columns during implementation.' },
      { q: 'Do offer letters use our own letterhead and format?', a: 'Yes. Letter templates and letterheads are configured per legal entity, so a group with several companies issues each offer on the right one.' },
    ],
  },

  /* ── ESS ─────────────────────────────────────────────────────────────── */
  {
    slug: 'ess',
    seoTitle: 'Employee Self-Service Portal',
    seoDescription:
      'Payslips, tax declarations, leave balances, attendance, documents and letters, served to employees directly, so the HR inbox stops being a helpdesk.',
    eyebrow: 'Serve',
    name: 'Employee self-service',
    promise: 'The questions HR answers every month, answered without HR.',
    intro:
      'Most of what lands in an HR inbox is a lookup, not a decision. The ESS portal hands those lookups to the person asking, which is both faster for them and the single biggest reduction in HR workload the system delivers.',
    problem: [
      'A payslip request, a leave balance query, a salary certificate for a home loan, a request to re-send last year’s Form 16 or Form 130. Individually trivial; collectively, a part-time job.',
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
      /* Was "Support desk ... arrives as a ticket". The product's Support
         module is marked "not built yet"; what ships is the inbox with
         department desks, so that is what this describes. */
      { title: 'HR desks in the inbox', body: 'When the answer needs a person, the employee writes to the HR, Payroll, Finance or IT desk, and it reaches the team that owns it rather than one person’s email.' },
    ],
    illustration: {
      src: '/kit/specialized/mockup-ess-portal.svg',
      ratio: 'aspect-[16/9]',
      alt:
        'The employee self-service portal: payslips, leave balance, attendance and documents.',
    },
    screenshots: [
      { src: '/product/ess-home-light.webp', alt: 'Employee self-service home with punch-in, leave balance, attendance, team status and pending actions', title: 'Everything an employee asks for', caption: 'Punch in, leave balance, attendance and anything waiting on them, all on the first screen.' },
      { src: '/product/ess-flexi-light.webp', alt: 'Employee flexi and TDS calculator showing the salary structure and four guided steps to a TDS report', title: 'Declarations, with the consequence shown', caption: 'Salary, flexi, investments, then the tax under both regimes. The employee sees what a declaration does before committing to it.' },
      { src: '/product/ess-insights-light.webp', alt: 'Employee insights with an AI-written summary of the month, punctuality and leave charts', title: 'Their own month, in three lines', caption: 'Each employee gets a private summary of their attendance, leave, pay and growth, written from their own figures.' },
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
      { q: 'Can employees see previous years’ payslips and tax certificates?', a: 'Yes. History stays available in the portal, Form 16 for earlier years and Form 130 from tax year 2026-27 onwards, which removes most of the re-send requests that come in during loan and visa applications.' },
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
      'Reimbursements are small amounts and large amounts of administration. The cost is not the money. It is the approvals scattered across email and the argument about how far it actually was.',
    problem: [
      'Flexi claims arrive as scanned bills attached to messages. Travel claims arrive as a distance the claimant estimated. Finance approves them in an inbox, and payroll finds out about them last.',
      'Nobody can say what has been claimed this year against a declared limit until someone builds the sheet that says so.',
    ],
    capabilities: [
      { title: 'Flexi benefits, declared then claimed', body: 'Employees declare against the flexible part of their salary structure, then claim and substantiate within it, with the remaining limit visible as they go.' },
      { title: 'Investment proofs against declarations', body: 'Proofs are collected and verified against what was declared, before the TDS projection changes rather than after.' },
      { title: 'Travel distance measured, not estimated', body: 'Trips are GPS-measured, which ends the annual argument about kilometres and removes the need for anyone to adjudicate it.' },
      { title: 'One Finance approval queue', body: 'Everything awaiting Finance in one place, with the supporting document attached to the claim rather than to a forwarded email.' },
      { title: 'Approval chains that match your delegation', body: 'Route by amount, by department or by claim type, so a routine claim does not need the same signature as an unusual one.' },
      { title: 'Straight into payroll', body: 'An approved claim becomes a payroll component in the next run, without a separate instruction to whoever processes salary.' },
      { title: 'A year-to-date position, always', body: 'What has been claimed, against what was declared, against what the limit allows, for any employee at any point in the year.' },
    ],
    illustration: {
      src: '/kit/features/anim-gps-claim.svg',
      ratio: 'aspect-[16/9]',
      alt:
        'A travel claim being re-measured server-side against the submitted GPS trail and priced from the policy rate card.',
    },
    screenshots: [
      { src: '/product/ess-travel-light.webp', alt: 'Travel and expenses home with local, domestic and international trips and other expenses', title: 'Four ways to claim', caption: 'Local trip, domestic, international, or a bill with no trip. Each one routes to the manager, then to Finance.' },
      { src: '/product/flexi-claims-light.webp', alt: 'Flexi claims review with approval, submission window and limits tabs, component filters and an AI flag on each bill', title: 'An AI check on every bill', caption: 'Bills that do not match their claim are flagged before anyone approves them, and approvals flow on to payroll.' },
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
  /* ── Performance & learning ─────────────────────────────────────────────
   * Added 22 Nov 2026. Both modules are live in the admin app (Performance,
   * Learning) and in ESS (Performance, Learning). Every capability below was
   * seen on a running screen. */
  {
    slug: 'performance',
    seoTitle: 'Performance Management & LMS Software',
    seoDescription:
      'KRA-based review cycles, self and manager ratings, HOD finalisation, PIPs and a learning studio with courses, paths, quizzes and mandatory training.',
    eyebrow: 'Grow',
    name: 'Performance & learning',
    promise: 'Reviews and learning that run on a calendar, not on reminders.',
    intro:
      'A review cycle fails in the same place every time: half the company never writes its goals, and the ratings are rushed in the last week. EZER runs the cycle as seven visible stages, tells HR exactly who is stuck where, and keeps learning, including the training you are obliged to run, on the same employee record.',
    problem: [
      'The appraisal starts as an email with a spreadsheet attached. Goals come back in five formats, some managers rate and some do not, and by the time HR chases the last department the next quarter has already begun.',
      'Training sits somewhere else again: a shared drive of slides and an attendance sheet. When an auditor asks who completed the safety or data-privacy course, the honest answer is that nobody knows.',
    ],
    capabilities: [
      { title: 'Seven stages, one cycle', body: 'KRA setting, one-to-one, weightage lock, self rating, manager review, HOD finalisation and result. Each stage has its dates and its owner, and the employee always sees what is owed next.' },
      { title: 'Your cycle, your rules', body: 'Monthly, quarterly, half-yearly or annual. The policy builder sets the rating scale, the number of KRAs, the weightage rules and the approval chain, per company.' },
      { title: 'A tracker that tells you who to chase', body: 'Everyone in the cycle by stage: not started, draft, submitted, in review, finalised. HR chases from one list instead of forty emails.' },
      { title: 'Ratings summary and publishing', body: 'The distribution against your scale, by company and department. Results reach employees only when HR publishes them, and acknowledgement is tracked.' },
      { title: 'Improvement plans with a paper trail', body: 'The manager raises a PIP, the HR manager reviews it, HR starts it and the employee is notified and acknowledges. A manager cannot start one alone, and every step is on record.' },
      { title: 'EZER Learn, a learning app people open', body: 'A catalogue to browse, featured courses, and picks for each person’s role and team. It opens from the HR app with no second login, on a phone or a laptop.' },
      { title: 'XP, streaks and badges', body: 'Levels, a weekly goal, day streaks and seventeen badges such as Quiz ace, Early bird and Path finisher, so finishing a course feels like progress.' },
      { title: 'A studio to build courses', body: 'Video, slides, documents and quizzes with pass marks and attempts. Drafts go for review, published courses keep their versions, and paths group courses into one programme.' },
      { title: 'Rules that assign learning', body: 'Assign by role, department or joining date, and let rules give new joiners and people who move teams the right courses on their own. Courses can need a manager’s approval or another course first.' },
      { title: 'Live sessions, recorded', body: 'Webinars on Zoom, Meet or Teams with invitations, reminders, attendance and the recording, counted towards the course.' },
      { title: 'Mandatory training, with proof', body: 'Policy, safety and data-privacy courses with due dates and yearly renewal. Overdue learners are flagged, and every certificate carries a number and a verification code.' },
      { title: 'Learning before day one', body: 'Preboarding courses go to candidates on a private link before they start, and carry over when they join.' },
    ],
    screenshots: [
      { src: '/product/pms-cycle-light.webp', alt: 'Performance cycle overview showing how many people have not started, are in review or are finalised', title: 'Where the whole cycle stands', caption: 'One sentence on what is blocking the cycle, and everyone in it by stage, in the order the work happens.' },
      { src: '/product/ess-performance-light.webp', alt: 'Employee performance view with a seven-stage review cycle and an overdue prompt to write KRAs', title: 'The employee knows what is owed', caption: 'Seven stages with dates, and the next action with its deadline. Managers approve KRAs and rate their team from the same screen.' },
      { src: '/tour/manager-6.webp', alt: 'A manager’s team view listing each report’s KRAs, one-to-one and self-rating status, ordered by deadline', title: 'Managers rate in deadline order', caption: 'KRA approval, one-to-ones, team ratings and PIP requests in tabs, with the team ordered by whose deadline cannot move.' },
      { src: '/tour/lms-0.webp', alt: 'EZER Learn home with progress counters and a featured compliance course', title: 'A learning home people come back to', caption: 'What is due and overdue, featured courses, and picks for their role and team, with streaks and badges a tap away.' },
      { src: '/tour/lms-studio-4.webp', alt: 'Learning Studio certificates list with certificate numbers, scores, issue and expiry dates', title: 'Certificates anyone can verify', caption: 'Every completion leaves a certificate with a number, the score, an expiry date and a verification code.' },
    ],
    personas: [
      { role: 'HR', benefit: 'A cycle that finishes on time, because the tracker says who to chase.', icon: 'users' },
      { role: 'Managers', benefit: 'Approve KRAs, log one-to-ones and rate the team in one place.', icon: 'briefcase' },
      { role: 'Employees', benefit: 'Clear goals, a clear deadline and a published result, not a surprise.', icon: 'user-plus' },
      { role: 'Leadership', benefit: 'A ratings distribution by department, and proof that mandatory training happened.', icon: 'chart' },
    ],
    related: [ALL_RELATED.analytics, ALL_RELATED.engagement, ALL_RELATED.ess],
    faqs: [
      { q: 'Is the rating linked to increments?', a: 'EZER can run the cycle as a developmental review: each employee is told on their own screen that the rating is not tied to pay, and recognition is a certificate, a nomination or an award. If your increments follow the rating, bring your current process to the demo and we will show how it fits.' },
      { q: 'Can different companies in the group run different cycles?', a: 'Yes. Each company can have its own frequency, rating scale and approval chain, while HR sees all of them from one place.' },
      { q: 'Do we need a separate LMS?', a: 'Not for most companies. EZER Learn covers courses, paths, quizzes, certificates, live sessions, automatic assignment and mandatory training, with XP and badges for the learner, on the same employee record as everything else.' },
    ],
  },

  /* ── People analytics ───────────────────────────────────────────────── */
  {
    slug: 'analytics',
    seoTitle: 'People Analytics & HR Reports Software',
    seoDescription:
      'People analytics across attrition, attendance, hiring, performance and payroll cost, with an AI executive briefing, weekly manager notes and live reports.',
    eyebrow: 'Insights',
    name: 'People analytics',
    promise: 'Not more charts. The reason behind the number, and what to do about it.',
    intro:
      'Every HRMS has a dashboard. The question leadership actually asks is why attrition moved, or why Monday punctuality fell, and that answer usually takes an analyst a week. EZER reads the month for you and says what changed, the likely causes, and three things to do, from your own data.',
    problem: [
      'Month-end reporting means exporting from four places and reconciling them in Excel. By the time the deck is ready, the numbers are three weeks old and the meeting has moved on.',
      'Managers see none of it. They find out their team’s attendance has slipped when HR raises it, not when they could still have done something.',
    ],
    capabilities: [
      { title: 'Nine pulse metrics', body: 'Headcount, joiners, exits, annualised attrition, on-time punch-ins, leave per person, open positions, monthly payroll cost and review completion, each with its trend.' },
      { title: 'Seven lenses', body: 'Workforce, attrition and retention, attendance and leave, performance and learning, hiring, and pay and cost. Any period, any company, department, location or employment type.' },
      { title: 'A “Why?” on every number', body: 'Open any metric to see the figures behind it and what moved it, rather than taking a tile on trust.' },
      { title: 'An AI executive briefing', body: 'What changed this month against the last, the likely causes, and three things to do, each with an owner and a timeframe. Every figure it quotes is checked against the data.' },
      { title: 'A Monday note for every manager', body: 'A team health score out of 100, who is out, what is waiting on them, and the one thing to start with this week.' },
      { title: 'A private summary for every employee', body: 'Their own month in three lines, with charts of their attendance, leave, pay and growth that only they can see.' },
      { title: 'Live reports with masking', body: 'Employee, salary, leave, tax and statutory reports, pulled live, with bank and identity fields masked by role.' },
      { title: 'Email digests and access control', body: 'Choose who sees analytics at all, and send the briefing to leadership on a schedule.' },
    ],
    screenshots: [
      { src: '/product/analytics-pulse-light.webp', alt: 'People analytics pulse with headcount, joiners, exits, attrition, punctuality, leave days and payroll cost', title: 'Nine numbers, each with a “Why?”', caption: 'The pulse of the whole group, sliced by period, company, department, location and employment type.' },
      { src: '/product/analytics-briefing-light.webp', alt: 'AI executive briefing listing what changed, likely causes and three things to do', title: 'The month, read for you', caption: 'What changed, why it probably changed, and three things to do, with an owner and a deadline on each.' },
      { src: '/product/ess-insights-team-light.webp', alt: 'Manager insights with a Monday note, a team health score and today’s attendance for the team', title: 'Every manager gets a Monday note', caption: 'A health score, who is out, and the one thing to start with, written from the team’s own figures.' },
    ],
    personas: [
      { role: 'Leadership', benefit: 'A briefing that says what changed and what to do, ready to forward.', icon: 'chart' },
      { role: 'HR', benefit: 'The monthly deck without the monthly export.', icon: 'users' },
      { role: 'Managers', benefit: 'Their team’s health every Monday, before it becomes HR’s problem.', icon: 'briefcase' },
      { role: 'Employees', benefit: 'Their own month, privately, in plain language.', icon: 'user-plus' },
    ],
    related: [ALL_RELATED.performance, ALL_RELATED.payroll, ALL_RELATED.attendance],
    faqs: [
      { q: 'Where does the AI get its numbers?', a: 'Only from your own EZER data for the period you choose. Each briefing lists the figures it is based on, and the numbers it quotes are checked against them before it is shown.' },
      { q: 'Can a manager see other teams?', a: 'No. A manager sees their own reporting line. A head of department sees their department. Access to the group-wide analytics is granted separately by HR.' },
      { q: 'Can we export the data?', a: 'Yes. Every lens and report downloads, and your data stays exportable at any time.' },
    ],
  },

  /* ── Engagement ─────────────────────────────────────────────────────── */
  {
    slug: 'engagement',
    seoTitle: 'Employee Engagement & Recognition App',
    seoDescription:
      'A Wall of Fame with shoutouts and private notes, birthdays and anniversaries, a Fun Zone of fourteen games, and an inbox with HR, Payroll and IT desks.',
    eyebrow: 'Engage',
    name: 'Engagement',
    promise: 'A workplace app employees open because they want to, not because HR asked.',
    intro:
      'Self-service only works if people open it. EZER puts the everyday human moments, recognition, birthdays, new joiners and a five-minute break, in the same app as leave and payslips, so it becomes the place people already are when HR needs them.',
    problem: [
      'Recognition happens in a WhatsApp group and is gone by the next morning. Birthdays are remembered by whoever keeps the list. New joiners are introduced in an email nobody reads.',
      'And when an employee has a question, it goes to whichever HR person they know, which is why one person’s inbox ends up being the company’s helpdesk.',
    ],
    capabilities: [
      { title: 'A Wall of Fame', body: 'Public shoutouts tagged with a company value, or a private note only the colleague sees. Recognition is thanks, and it says so: it never touches pay.' },
      { title: 'Birthdays, anniversaries and new joiners', body: 'Across every company in the group, with a one-tap wish or welcome.' },
      { title: 'Fun Zone', body: 'Fourteen short games, from trivia on your own policies to minesweeper, played solo, against the computer or live against a colleague. Nothing is scored towards anything.' },
      { title: 'An inbox with desks', body: 'Employees write to HR, Payroll, Finance, Leave, Performance, Recruitment, Exit or IT, and the question reaches the team that owns it.' },
      { title: 'Broadcasts', body: 'Announcements land in the app employees already open, not in an email they skim.' },
      { title: 'Org chart and directory', body: 'Reporting lines drawn from the employee master, and a directory with one-tap call and WhatsApp.' },
      { title: 'Personal insights', body: 'Each employee’s own month in three lines, with one gentle nudge, such as setting goals before a review closes.' },
      { title: 'Moderation built in', body: 'Anything an employee reports from the social features reaches HR for review.' },
    ],
    screenshots: [
      { src: '/product/ess-social-light.webp', alt: 'Social page with the Wall of Fame, shoutouts, private notes, recent recognitions and a most-recognised podium', title: 'Recognition people can see', caption: 'A shoutout on the wall, or a note only they see. Birthdays, anniversaries and new joiners sit alongside.' },
      { src: '/product/ess-funzone-light.webp', alt: 'Fun Zone with fourteen games including tic-tac-toe, memory match, EZER trivia and spin the wheel', title: 'A five-minute break, inside the HR app', caption: 'Fourteen games, three of them playable live against a colleague.' },
      { src: '/product/ess-inbox-light.webp', alt: 'Employee inbox with messages, Wall of Fame, broadcasts and department desks', title: 'Questions go to a desk, not a person', caption: 'HR, Payroll, Finance, Leave, Performance, Recruitment, Exit and IT, each with its own queue.' },
    ],
    personas: [
      { role: 'Employees', benefit: 'Recognition, wishes and answers in the same app as their leave.', icon: 'user-plus' },
      { role: 'HR', benefit: 'Self-service adoption that does not need chasing.', icon: 'users' },
      { role: 'Managers', benefit: 'A quick way to thank someone in front of everyone.', icon: 'briefcase' },
      { role: 'Leadership', benefit: 'A culture you can see, not just describe.', icon: 'chart' },
    ],
    related: [ALL_RELATED.ess, ALL_RELATED.analytics, ALL_RELATED.performance],
    faqs: [
      { q: 'How do we keep it professional?', a: 'Anything an employee reports from the social features (a comment, a shoutout, a message) lands in a review queue for HR, and recognition carries a visible note that it never affects pay. Which parts you roll out, and when, is agreed during implementation.' },
      { q: 'Is recognition linked to rewards?', a: 'Not today: a shoutout is thanks, and the app says so. Award cycles and nominations (RNR) are on the roadmap and labelled as coming.' },
      { q: 'Does it work on a phone?', a: 'Yes. The employee app is responsive and works in any phone browser, in light or dark mode.' },
    ],
  },
]

export function getFeaturePage(slug: string): FeaturePage | undefined {
  return featurePages.find((p) => p.slug === slug)
}
