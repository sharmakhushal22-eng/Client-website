/* ============================================================================
 * The company policy handbook — a resource, not a product page.
 *
 * Source: Complete_Company_Policy_Handbook_India_Pvt_Ltd.pdf, a structured
 * framework of the policies an Indian private limited company needs. Its own
 * front matter is worth repeating on the page: it is a starting framework, not
 * legal advice, and each entry has to become a company-specific document.
 *
 * WHY `ezer` IS NOT SET ON EVERY ROW
 *
 * The obvious move is to claim every policy is "handled by EZER". It would
 * also be false, and falsifiable in about ninety seconds by anyone reading
 * carefully — EZER does not run a procurement process or a POSH Internal
 * Committee, and saying otherwise wrecks the compliance claims that ARE true.
 *
 * So each policy is marked with the module that genuinely operates it, or
 * left unmarked. The unmarked ones are the point: a checklist that admits what
 * it does not do is the only kind anybody trusts.
 * ========================================================================= */

export type Policy = {
  name: string
  detail: string
  /** The EZER module that operates this policy, when one genuinely does. */
  ezer?: string
}

export type PolicyCategory = {
  n: number
  name: string
  policies: Policy[]
}

export const policyCategories: PolicyCategory[] = [
  {
    n: 1,
    name: 'Employment & general workplace',
    policies: [
      { name: 'Employment & appointment', detail: 'Employment terms, designation, compensation, probation, working hours and notice period.', ezer: 'Employee master · Letters' },
      { name: 'Probation & confirmation', detail: 'Probation duration, review process, extension and confirmation.', ezer: 'Employee master' },
      { name: 'Working hours & attendance', detail: 'Timings, punctuality, weekly offs, late coming and regularisation.', ezer: 'Attendance' },
      { name: 'Remote / hybrid work', detail: 'Eligibility, approvals, availability, security and equipment.' },
      { name: 'Dress code & workplace etiquette', detail: 'Professional appearance, conduct and respectful communication.' },
    ],
  },
  {
    n: 2,
    name: 'Leave & holidays',
    policies: [
      { name: 'Leave', detail: 'Categories, eligibility, approval workflow, documentation and balances.', ezer: 'Leave' },
      { name: 'Sick leave', detail: 'Illness absence, notification and medical documentation.', ezer: 'Leave' },
      { name: 'Earned / privilege leave', detail: 'Accrual, application, carry-forward and encashment.', ezer: 'Leave · Full & final' },
      { name: 'Maternity / statutory leave', detail: 'Applicable statutory leave and benefits.', ezer: 'Statutory leave' },
      { name: 'Holiday', detail: 'Company, national and regional holidays.', ezer: 'Holidays' },
      { name: 'Leave without pay', detail: 'Circumstances and approval process for unpaid leave.', ezer: 'Leave · Payroll run' },
    ],
  },
  {
    n: 3,
    name: 'Recruitment & onboarding',
    policies: [
      { name: 'Manpower requisition', detail: 'Position creation, business justification, budget approval and hiring authorisation.', ezer: 'Recruitment' },
      { name: 'Recruitment & selection', detail: 'Sourcing, screening, interviews, selection and offer process.', ezer: 'Recruitment' },
      { name: 'Employee referral', detail: 'Referral eligibility, process and incentive conditions.' },
      { name: 'Background verification', detail: 'Reference checks and handling of adverse findings.', ezer: 'Onboarding' },
      { name: 'Internship', detail: 'Duration, stipend, supervision, evaluation, conversion and exit.' },
      { name: 'Onboarding & induction', detail: 'Joining documentation, induction, IT access, assets and payroll setup.', ezer: 'Onboarding' },
    ],
  },
  {
    n: 4,
    name: 'Compensation & benefits',
    policies: [
      { name: 'Compensation & salary', detail: 'Salary structure, pay dates, revisions and confidentiality.', ezer: 'Payroll run' },
      { name: 'Payroll', detail: 'Processing, deductions, payslips, statutory deductions and records.', ezer: 'Payroll run · Payslips' },
      { name: 'Variable pay / incentive', detail: 'Eligibility, targets, calculation, approvals and payout.', ezer: 'Payroll run' },
      { name: 'Bonus', detail: 'Applicable statutory or company bonus arrangements.', ezer: 'Gratuity & bonus' },
      { name: 'Travel & expense', detail: 'Business travel, accommodation, conveyance, approvals and reimbursement.', ezer: 'Travel claims' },
      { name: 'Employee benefits', detail: 'Applicable insurance, wellness and other benefits.', ezer: 'Claims & flexi benefits' },
      { name: 'ESOP / equity', detail: 'Grant, vesting, exercise and related terms, where applicable.' },
    ],
  },
  {
    n: 5,
    name: 'Performance & career',
    policies: [
      { name: 'Performance management (PMS)', detail: 'Goal setting, review cycles, self-assessment, ratings and finalisation.' },
      { name: 'Goal & KPI', detail: 'Measurable goals, ownership and review during the cycle.' },
      { name: 'Promotion', detail: 'Eligibility, performance criteria, approvals and effective dates.', ezer: 'Employee master · Letters' },
      { name: 'Internal transfer / job posting', detail: 'Movement between teams, roles and internal opportunities.', ezer: 'Transfers' },
      { name: 'Learning & development', detail: 'Training, certifications, development plans and reimbursement.' },
      { name: 'Succession planning', detail: 'Identification and development of critical talent and roles.' },
    ],
  },
  {
    n: 6,
    name: 'Conduct & ethics',
    policies: [
      { name: 'Code of conduct', detail: 'Integrity, professionalism, respect and responsible use of company resources.', ezer: 'Policies' },
      { name: 'Anti-harassment & POSH', detail: 'Prevention, reporting and redressal, with the Internal Committee where applicable.' },
      { name: 'Equal opportunity', detail: 'Fair employment practices; prohibits unlawful discrimination.' },
      { name: 'Conflict of interest', detail: 'Outside employment, competing interests and disclosures.' },
      { name: 'Gifts & hospitality', detail: 'Acceptable gifts, entertainment and business courtesies.' },
      { name: 'Whistleblower / speak-up', detail: 'A channel for reporting serious misconduct, fraud or unethical behaviour.' },
      { name: 'Grievance redressal', detail: 'How employees raise concerns, and the escalation process.', ezer: 'Support desk' },
      { name: 'Disciplinary & misconduct', detail: 'Investigation, employee response, documentation and proportionate action.' },
    ],
  },
  {
    n: 7,
    name: 'IT, information security & data',
    policies: [
      { name: 'Information security', detail: 'Protection of company information, systems, credentials and business data.' },
      { name: 'Acceptable use', detail: 'Appropriate use of laptops, internet, email, software and systems.' },
      { name: 'Password & access management', detail: 'Password standards, MFA, access approvals and removal.', ezer: 'Roles & rights' },
      { name: 'Data privacy / personal data', detail: 'Collection, use, access, retention, sharing and protection of personal data.', ezer: 'Roles & rights · Data export' },
      { name: 'Social media', detail: 'Responsible use and protection of confidential company information.' },
      { name: 'BYOD', detail: 'Security requirements for personal devices used for work, where permitted.' },
      { name: 'Company asset', detail: 'Allocation, use, maintenance, return and loss or damage of assets.' },
      { name: 'Joiner-mover-leaver access', detail: 'Creation, modification and revocation of employee system access.', ezer: 'Roles & rights · Transfers' },
    ],
  },
  {
    n: 8,
    name: 'Welfare & workplace safety',
    policies: [
      { name: 'Workplace health & safety', detail: 'Safety responsibilities and incident reporting.' },
      { name: 'Employee well-being', detail: 'Well-being initiatives and support programmes where offered.' },
      { name: 'Emergency & incident response', detail: 'Fire, evacuation, security incidents and other emergencies.' },
      { name: 'Substance abuse', detail: 'Prohibited use of alcohol or drugs at work, subject to applicable law.' },
    ],
  },
  {
    n: 9,
    name: 'Business & operational',
    policies: [
      { name: 'Delegation of authority', detail: 'Who can approve hiring, expenses, purchases and contracts.', ezer: 'Roles & rights' },
      { name: 'Procurement', detail: 'Vendor selection, quotations, approvals and purchase orders.' },
      { name: 'Vendor management', detail: 'Onboarding, due diligence, contracts, performance and offboarding.' },
      { name: 'Records retention', detail: 'Retention, access, archival and secure disposal of company records.', ezer: 'Reports & compliance' },
      { name: 'Business travel', detail: 'Authorisation, travel class, accommodation and expense rules.', ezer: 'Travel claims' },
    ],
  },
  {
    n: 10,
    name: 'Exit & separation',
    policies: [
      { name: 'Resignation & separation', detail: 'Submission, acceptance, notice period and separation workflow.', ezer: 'Full & final' },
      { name: 'Notice period', detail: 'Notice obligations, early release, handover and buyout provisions.', ezer: 'Full & final' },
      { name: 'Absconding / unauthorised absence', detail: 'Escalation and disciplinary process for prolonged absence.', ezer: 'Attendance' },
      { name: 'Termination', detail: 'Separation processes subject to contract and applicable law.', ezer: 'Full & final' },
      { name: 'Exit interview', detail: 'Exit feedback collection and analysis.' },
      { name: 'Full & final settlement', detail: 'Salary, leave encashment, recoveries, benefits and settlement documents.', ezer: 'Full & final' },
      { name: 'Asset recovery & access deactivation', detail: 'Assets returned and system access removed at separation.', ezer: 'Roles & rights' },
      { name: 'Relieving & experience letter', detail: 'Issuance of applicable employment and separation documents.', ezer: 'Letters' },
    ],
  },
  {
    n: 11,
    name: 'Legal & statutory compliance',
    policies: [
      { name: 'Corporate compliance', detail: 'Companies Act, MCA, tax, accounting and statutory records and filings.' },
      { name: 'Employment & labour compliance', detail: 'Employment, wage, working-time, leave and establishment requirements.', ezer: 'Reports & compliance' },
      { name: 'Social security compliance', detail: 'PF, ESI, gratuity, professional tax and labour welfare fund obligations.', ezer: 'EPF · ESIC · PT · LWF' },
      { name: 'POSH compliance', detail: 'Internal Committee, policy, awareness and redressal framework where applicable.' },
      { name: 'Tax & payroll compliance', detail: 'TDS and payroll deductions, deposits and employee tax documentation.', ezer: 'TDS & Form 16' },
      { name: 'Data protection compliance', detail: 'Privacy and data-security controls appropriate to the personal data held.', ezer: 'Roles & rights' },
    ],
  },
  {
    n: 12,
    name: 'HR governance & administration',
    policies: [
      { name: 'Employee handbook', detail: 'Central reference containing employee-facing policies and expectations.', ezer: 'Policies · ESS' },
      { name: 'Policy acknowledgement', detail: 'Employees acknowledge receipt through a controlled process.', ezer: 'Policies · ESS' },
      { name: 'Policy exception process', detail: 'Exceptions require documented approval from the designated authority.' },
      { name: 'Policy review & version control', detail: 'Each policy has an owner, version, effective date and review date.' },
      { name: 'Compliance calendar', detail: 'Requirement, applicability, frequency, due date, owner, evidence and status.', ezer: 'Reports & compliance' },
      { name: 'Document & record control', detail: 'Policies and records stored securely with controlled access and retention.', ezer: 'Data export' },
    ],
  },
]

/* The handbook's own recommended rollout. Reproduced because it is the most
 * immediately useful thing in it: a founder with no policy library needs an
 * order to work in far more than a list. */
export const rolloutPhases = [
  {
    phase: 'Phase 1',
    name: 'Foundation',
    detail:
      'Appointment, code of conduct, leave and attendance, POSH, information security, confidentiality, payroll, grievance, disciplinary and exit.',
  },
  {
    phase: 'Phase 2',
    name: 'Growth',
    detail:
      'Recruitment, onboarding, PMS, compensation, travel and expense, referral, learning and development, remote work and employee benefits.',
  },
  {
    phase: 'Phase 3',
    name: 'Scale',
    detail:
      'Delegation of authority, procurement, vendor management, succession planning, data governance and advanced security.',
  },
]

/* What a finished policy document should contain — straight from the source. */
export const policyDocumentFormat = [
  'Purpose', 'Scope', 'Definitions', 'Policy rules', 'Eligibility',
  'Roles & responsibilities', 'Approval process', 'Exceptions',
  'Records & documentation', 'Confidentiality', 'Non-compliance',
  'Effective date', 'Version', 'Policy owner', 'Review date',
]

export const policyCount = policyCategories.reduce((n, c) => n + c.policies.length, 0)
export const operatedCount = policyCategories.reduce(
  (n, c) => n + c.policies.filter((p) => p.ezer).length,
  0,
)
