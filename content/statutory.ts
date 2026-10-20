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
  /* The governing law AS IT STANDS: since 21 November 2025 the four Labour
     Codes have replaced the old central acts, and since 1 April 2026 the
     Income-tax Act, 2025 has replaced the 1961 Act. */
  fullName: string
  /* What the SYSTEM does — the column heading the spec asks for. */
  whatItDoes: string
  /* The wage base and rates applied, stated plainly. Verify before launch. */
  basis: string
}

/* Positions checked on 20 October 2026 against current notifications:
 *   EPF ceiling ₹25,000 from 17 Sept 2026 (S.O. 5109(E)), EPF/EPS/EDLI
 *     Schemes, 2026 in force from mid-2026;
 *   ESIC ₹21,000 continues under the Code (savings clause);
 *   Bonus: eligibility ₹21,000, calculation on ₹7,000 or the minimum wage,
 *     whichever is higher (notified 25 Aug 2026);
 *   Salary TDS under section 392 of the Income-tax Act, 2025; Form 130
 *     replaces Form 16; "tax year" replaces FY/AY; the new regime is the
 *     default.
 * Deliberately NOT stated, because sources still disagree: the quarterly
 * return form number, the EPS pensionable-wage cap after 17 Sept 2026, and
 * how September 2026 itself is split. */
export const statutoryCoverage: StatutoryRow[] = [
  {
    act: 'EPF',
    fullName: 'Code on Social Security, 2020, Chapter III, with the EPF, EPS and EDLI Schemes, 2026',
    whatItDoes:
      'Calculates employee and employer contributions, splits the employer share between EPS and EPF, applies the wage ceiling for eligible members, adds admin and EDLI charges, and produces ECR-ready output.',
    basis: '12% employee · 12% employer, split EPS/EPF · ₹25,000 wage ceiling from 17 Sept 2026 (₹15,000 before) · wages as defined in section 2(88), with the 50% rule',
  },
  {
    act: 'ESIC',
    fullName: 'Code on Social Security, 2020, Chapter IV (replaces the ESI Act, 1948)',
    whatItDoes:
      'Applies the wage ceiling, keeps employees who cross it mid-contribution-period covered to the end of that period, and produces return-ready output.',
    basis: '0.75% employee · 3.25% employer · ₹21,000 wage ceiling (₹25,000 for persons with disabilities) · wages as defined in section 2(88)',
  },
  {
    act: 'PT',
    fullName: 'State Professional Tax Acts',
    whatItDoes:
      'Holds slabs per state, applies them by the employee’s work location, and handles the states with a different rate in a specific month.',
    basis: 'Gross salary against each state’s slabs · ₹2,500 per year constitutional maximum',
  },
  {
    act: 'LWF',
    fullName: 'State Labour Welfare Fund Acts',
    whatItDoes:
      'Applies the contribution at the rate and frequency the relevant state requires, which may be monthly, half-yearly or annual, per registration.',
    basis: 'Each state’s rate, wage band and frequency',
  },
  {
    act: 'Minimum wages',
    fullName: 'Code on Wages, 2019, Chapter II (replaces the Minimum Wages Act, 1948)',
    whatItDoes:
      'The pan-India minimum wages tracker: checks every employee’s pay against the notified minimum wage for their state, skill category and zone, and flags any shortfall before the run is released.',
    basis: 'Floor wage and the rates notified by each appropriate Government, by state, skill and zone',
  },
  {
    act: 'TDS',
    fullName: 'Income-tax Act, 2025, section 392 (salary), with the Income-tax Rules, 2026',
    whatItDoes:
      'Runs the new regime by default and the old one where an employee opts out, takes declarations and verified proofs, projects tax across the rest of the tax year, and issues Form 130 (formerly Form 16).',
    basis: 'Taxable salary · new regime by default, old by opt-out · monthly projection · Form 130',
  },
  {
    act: 'NPS',
    fullName: 'Employer contribution under the Income-tax Act, 2025',
    whatItDoes:
      'Handles the employer NPS contribution inside the salary structure, with the correct treatment in the tax computation for each regime.',
    basis: 'Employer contribution, configurable per structure · up to 14% of salary in the new regime',
  },
  {
    act: 'Gratuity',
    fullName: 'Code on Social Security, 2020, Chapter V (replaces the Payment of Gratuity Act, 1972)',
    whatItDoes:
      'Calculates the entitlement on exit against completed service, including pro-rata gratuity for fixed-term employees, and includes it in the full & final settlement.',
    basis: '15 days’ wages per completed year · 5 years’ service (fixed-term: pro rata, without the 5-year condition) · wages as defined in section 2(88)',
  },
  {
    act: 'Bonus',
    fullName: 'Code on Wages, 2019, Chapter IV (replaces the Payment of Bonus Act, 1965)',
    whatItDoes:
      'Determines eligibility and calculates the statutory bonus against the two ceilings the Code now sets.',
    basis: '8.33% minimum to 20% maximum · eligible up to ₹21,000 a month · calculated on ₹7,000 or the minimum wage, whichever is higher',
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
 * the ₹15,000 ceiling in force for August 2026 (it rose to ₹25,000 on
 * 17 September 2026). Code wages here are Basic + Special Allowance, which is
 * above 50% of pay, so no add-back applies; ESIC not applicable (gross above the ₹21,000
 * ceiling), PT at the Maharashtra rate for this slab.
 *
 * ⚠ TODO: verify the figures with compliance before launch, and regenerate
 * from an actual demo-company payslip once the demo company exists (§9). */
export const workedPayslip = {
  employee: {
    name: 'Priya Deshmukh',
    code: 'EZ-1042',
    designation: 'Senior Executive, Finance',
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
    { label: 'EPF employee contribution', amount: 1800, note: '12% of the ₹15,000 ceiling in force for August 2026' },
    { label: 'Professional Tax', amount: 200, note: 'Maharashtra slab for this gross' },
    { label: 'TDS', amount: 4350, note: 'Projected across the remaining year' },
  ],
  employerContributions: [
    { label: 'EPF employer contribution', amount: 1800, note: '3.67% EPF + 8.33% EPS on ceiling wage' },
    { label: 'EPF admin & EDLI charges', amount: 225, note: 'Employer cost, not an employee deduction' },
  ],
  notes: [
    'ESIC does not apply: the gross is above the ₹21,000 wage ceiling.',
    'From 17 September 2026 the EPF wage ceiling is ₹25,000, so the same employee’s October payslip carries EPF on ₹25,000.',
    'Employer contributions are shown for transparency. They are a cost to the company, not a deduction from the employee.',
  ],
}

export const auditabilityNote =
  'Every figure on a payslip can be opened to show what produced it: the attendance days counted, the salary structure in force that month, the statutory rate and ceiling applied, and the regime or slab used. That trail is the difference between a payroll that is correct and one that can be shown to be correct. Only the second kind survives an audit or a dispute.'
