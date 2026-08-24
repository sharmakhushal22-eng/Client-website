/* ============================================================================
 * Statutory coverage table and a worked payslip — spec §4.3.
 *
 * "Payroll page must additionally carry: the statutory coverage table (each
 * act, what the system does), a worked example of a payslip, and a line on
 * how the calculation is auditable."
 *
 * ⚠ TODO before launch: have someone who owns compliance verify every rate,
 * ceiling and threshold on this page against the position in force. Statutory
 * figures change, and a wrong number here is quoted back at you in a demo by
 * the one buyer who knows. The product itself holds these as configuration —
 * this page is a description of coverage, not the source of the rates.
 * ========================================================================= */

export type StatutoryRow = {
  act: string
  fullName: string
  /* What the SYSTEM does — the column heading the spec asks for. */
  whatItDoes: string
  /* Current position, stated plainly. Verify before launch. */
  basis: string
}

export const statutoryCoverage: StatutoryRow[] = [
  {
    act: 'EPF',
    fullName: 'Employees’ Provident Funds & Miscellaneous Provisions Act, 1952',
    whatItDoes:
      'Calculates employee and employer contributions, splits the employer share between EPS and EPF, applies the wage ceiling for eligible members, adds admin and EDLI charges, and produces ECR-ready output.',
    basis: '12% employee · 12% employer, split EPS/EPF · ₹15,000 wage ceiling',
  },
  {
    act: 'ESIC',
    fullName: 'Employees’ State Insurance Act, 1948',
    whatItDoes:
      'Applies the wage ceiling, handles employees who cross it mid-contribution-period by keeping them covered to the end of that period, and produces return-ready output.',
    basis: '0.75% employee · 3.25% employer · ₹21,000 wage ceiling',
  },
  {
    act: 'PT',
    fullName: 'State Professional Tax Acts',
    whatItDoes:
      'Holds slabs per state, applies them by the employee’s work location, and handles the states with a different rate in a specific month.',
    basis: 'State-wise slabs · ₹2,500 per year constitutional maximum',
  },
  {
    act: 'LWF',
    fullName: 'State Labour Welfare Fund Acts',
    whatItDoes:
      'Applies the contribution at the rate and frequency the relevant state requires — which may be monthly, half-yearly or annual — per registration.',
    basis: 'State-wise rate and frequency',
  },
  {
    act: 'TDS',
    fullName: 'Income Tax Act, 1961 — salary TDS',
    whatItDoes:
      'Runs both the old and new regime, takes declarations and verified proofs, projects tax across the remaining months of the year, and issues Form 16.',
    basis: 'Old and new regime · monthly projection · Form 16',
  },
  {
    act: 'NPS',
    fullName: 'Employer contribution under section 80CCD(2)',
    whatItDoes:
      'Handles the employer NPS contribution inside the salary structure, with the correct treatment in the tax computation.',
    basis: 'Employer contribution, configurable per structure',
  },
  {
    act: 'Gratuity',
    fullName: 'Payment of Gratuity Act, 1972',
    whatItDoes:
      'Calculates the entitlement on exit against completed service, and includes it in the full & final settlement.',
    basis: '15 days’ wages per completed year, after 5 years of service',
  },
  {
    act: 'Bonus',
    fullName: 'Payment of Bonus Act, 1965',
    whatItDoes:
      'Determines eligibility and calculates the statutory bonus against the applicable ceiling.',
    basis: 'Statutory minimum to maximum, on the applicable wage ceiling',
  },
  {
    act: 'S&E',
    fullName: 'State Shops & Establishments Acts',
    whatItDoes:
      'Drives statutory leave entitlement and holiday rules by the state each location sits in.',
    basis: 'State-wise leave and holiday entitlements',
  },
]

/* ── Worked payslip example ──────────────────────────────────────────────
 *
 * Deliberately a single, consistent example rather than round numbers: the
 * point is to show that the arithmetic ties out, which round numbers hide.
 *
 * Employee: fictional. Monthly gross ₹58,000, Maharashtra location, EPF on
 * ₹15,000 ceiling basis, ESIC not applicable (gross above the ₹21,000
 * ceiling), PT at the Maharashtra rate for this slab.
 *
 * ⚠ TODO: verify the figures with compliance before launch, and regenerate
 * from an actual demo-company payslip once the demo company exists (§9). */
export const workedPayslip = {
  employee: {
    name: 'Priya Deshmukh',
    code: 'EZ-1042',
    designation: 'Senior Executive — Finance',
    location: 'Pune, Maharashtra',
    month: 'August 2026',
    paidDays: '31 of 31',
  },
  earnings: [
    { label: 'Basic', amount: 23200 },
    { label: 'House Rent Allowance', amount: 11600 },
    { label: 'Conveyance Allowance', amount: 1600 },
    { label: 'Special Allowance', amount: 21600 },
  ],
  deductions: [
    { label: 'EPF — employee contribution', amount: 1800, note: '12% of ₹15,000 ceiling wage' },
    { label: 'Professional Tax', amount: 200, note: 'Maharashtra slab for this gross' },
    { label: 'TDS', amount: 4350, note: 'Projected across the remaining year' },
  ],
  employerContributions: [
    { label: 'EPF — employer contribution', amount: 1800, note: '3.67% EPF + 8.33% EPS on ceiling wage' },
    { label: 'EPF admin & EDLI charges', amount: 225, note: 'Employer cost, not an employee deduction' },
  ],
  notes: [
    'ESIC does not apply: the gross is above the ₹21,000 wage ceiling.',
    'Employer contributions are shown for transparency. They are a cost to the company, not a deduction from the employee.',
  ],
}

export const auditabilityNote =
  'Every figure on a payslip can be opened to show what produced it: the attendance days counted, the salary structure in force that month, the statutory rate and ceiling applied, and the regime or slab used. That trail is the difference between a payroll that is correct and one that can be shown to be correct — which is the only version that survives an audit or a dispute.'
