import type { IconName } from '@/components/ui/Icon'

/* ============================================================================
 * The content hub — ported from Website changes.html (#content-hub).
 *
 * In the reference these three articles live in hidden <template> elements and
 * are cloned into a modal on click. Here they are real routes under /blog,
 * which is the same content doing more work: a modal cannot be linked, cited,
 * shared or indexed, and compliance explainers are exactly the kind of page
 * people arrive on from a search.
 *
 * Blocks are read from the reference's own elements — headings, paragraphs,
 * lists, stat callouts and TABLES. The tables matter: two of these articles
 * carry slab tables and a three-way comparison, and any extraction that
 * flattens a <tr> to text turns "Slab | Rate" into an unreadable run.
 *
 * Body text is verbatim. Only the container changed.
 * ========================================================================= */

export type ArticleBlock =
  | { t: 'h2' | 'h3' | 'p' | 'stat'; x: string }
  /* A bold lead-in plus prose. Kept as two fields rather than one joined
     string, because the source bolds the lead-in and flattening it loses
     the emphasis it was given on purpose. */
  | { t: 'callout' | 'mistake'; lead: string; x: string }
  | { t: 'ul' | 'ol'; items: string[] }
  | { t: 'pills'; pills: { value: string; label: string }[] }
  | { t: 'table'; rows: { head: boolean; cells: string[] }[] }

export type Article = {
  slug: string
  category: string
  readingTime: string
  title: string
  excerpt: string
  blocks: ArticleBlock[]
  /* The article's own closing pitch, from the reference. Kept per-article
     rather than falling back to the site-wide band, because "EZER tracks
     every notification as it lands" only makes sense at the end of the
     Labour Codes piece. */
  cta: { title: string; body: string; label: string }
}

export const articles: Article[] = [
  {
    slug: 'labour-codes-explained',
    category: 'Compliance',
    readingTime: '7 min read',
    title: `Understanding India's Four Labour Codes: What Actually Changed`,
    excerpt: `On 21 November 2025, India's four Labour Codes came into effect, folding 29 separate central laws into four. That sounds like a headline, not a payroll problem, until you realise the rules are still rolling out state by state, and the definition of "wages" itself has changed underneath every PF, ESIC and gratuity calculation you run.`,
    blocks: [
      { t: 'p', x: `Here's what the four Codes actually are, what's changed in practice, and what's still in motion.` },
      { t: 'h2', x: `The four Codes, in plain terms` },
      { t: 'h3', x: `1. Code on Wages, 2019` },
      { t: 'p', x: `Consolidates minimum wage, payment of wages, bonus and equal remuneration law into one Code. It also introduces a single, uniform definition of "wages" that now applies across PF, ESIC, gratuity and bonus calculations. More on why that matters below.` },
      { t: 'h3', x: `2. Industrial Relations Code, 2020` },
      { t: 'p', x: `Covers standing orders, retrenchment, layoffs and dispute resolution. It raises the threshold for standing orders and government permission for layoffs/retrenchment from 100 to 300 employees at an establishment, a meaningful change for growing mid-size manufacturers.` },
      { t: 'h3', x: `3. Code on Social Security, 2020` },
      { t: 'p', x: `Brings PF, ESIC, gratuity, maternity benefit and, for the first time, social security provisions for gig and platform workers under one Code.` },
      { t: 'h3', x: `4. Occupational Safety, Health and Working Conditions Code, 2020` },
      { t: 'p', x: `Governs working hours, shift limits, welfare facilities and safety standards, and extends coverage to establishment types that weren't clearly covered before, including some categories of contract and inter-state migrant workers.` },
      { t: 'h2', x: `The change that actually hits your payroll: the new wage definition` },
      { t: 'p', x: `The Code on Wages standardises how "wages" is defined for statutory purposes. The practical effect: Basic pay plus Dearness Allowance must add up to at least 50% of an employee's total remuneration. If allowances (HRA, special allowance, and similar components) push Basic below that 50% mark, the excess gets added back to "wages" for PF, gratuity and ESIC calculation purposes anyway.` },
      { t: 'p', x: `This closes a structuring pattern a lot of Indian companies used: keeping Basic artificially low and allowances high to reduce statutory contribution liability. If your salary structures were built that way, your PF and gratuity base goes up under the new definition, even though the 12% PF rate itself hasn't changed.` },
      { t: 'callout', lead: `What this means in practice:`, x: `a CTC structure that was compliant and cost-efficient under the old rules may now be quietly under-compliant. This is worth an actual audit of your salary structures, not an assumption that nothing changed because the headline rate didn't move.` },
      { t: 'h2', x: `What hasn't changed yet` },
      { t: 'p', x: `The Codes are in effect, but the detailed rules under them (the state-level notifications that fill in implementation specifics) are still being issued in phases. Under the "Repeal and Savings" clause common to all four Codes, the rules framed under the 29 repealed central laws continue to apply until the corresponding new rules are notified. Where the old rules and the new Code conflict, the Code prevails.` },
      { t: 'p', x: `In practice, this means compliance right now is a moving target: the broad framework is set, but state-by-state implementation is still catching up, and it will keep catching up through 2026.` },
      { t: 'h2', x: `What HR and payroll teams should actually do` },
      { t: 'ol', items: [`Audit current salary structures against the 50%-of-remuneration Basic+DA rule. Don't assume last year's structure still holds.`, `Track state-level rule notifications for every state you operate in, not just headquarters.`, `Re-check standing order and retrenchment thresholds if your headcount is approaching 300 at any single establishment.`, `Don't wait for a single "final" notification. The rollout is genuinely phased, and treating it as a one-time update will leave gaps.`] },
    ],
    cta: {
      title: `EZER tracks every notification as it lands`,
      body: `Your compliance engine stays current without your team manually chasing state gazettes.`,
      label: `Request a Demo`,
    },
  },
  {
    slug: 'pf-esic-pt-reference',
    category: 'Payroll',
    readingTime: '6 min read',
    title: `PF vs ESIC vs PT: A Quick Reference for HR Teams`,
    excerpt: `Three deductions show up on almost every Indian payslip. Three different government bodies. Three different purposes. And three different sets of rules on who's covered and how much gets deducted. Here's the reference we wish someone had handed us on day one.`,
    blocks: [
      { t: 'h2', x: `PF (Provident Fund)` },
      { t: 'p', x: `A retirement savings scheme run by the EPFO. Since 21 November 2025 it sits in Chapter III of the Code on Social Security, 2020, and in 2026 the EPF, EPS and EDLI Schemes, 2026 replaced the 1952, 1995 and 1976 schemes.` },
      { t: 'pills', pills: [{ value: `12% + 12%`, label: `Employee + employer, on wages as the Code defines them` }, { value: `₹25,000/mo`, label: `Wage ceiling from 17 Sept 2026 (was ₹15,000)` }, { value: `20+`, label: `Employees for mandatory coverage` }] },
      { t: 'p', x: `Of the employer's 12%, 8.33% routes to the Employees' Pension Scheme, up to the pensionable-wage limit, and the rest to the employee's own EPF account. On 17 September 2026 the mandatory wage ceiling rose to ₹25,000 a month, its first revision since 2014, so employees earning ₹15,001 to ₹25,000 are now covered as of right. Above the ceiling, contribution is voluntary. Filed monthly via the Electronic Challan cum Return (ECR) on the EPFO Unified Portal.` },
      { t: 'callout', lead: `What counts as wages changed too:`, x: `under the Codes, Basic, DA and retaining allowance must make up at least half of total pay. If the excluded allowances (HRA, conveyance and the like) come to more than half, the excess is added back to wages for PF, ESIC and gratuity.` },
      { t: 'h2', x: `ESIC (Employees' State Insurance)` },
      { t: 'p', x: `A health insurance and social security scheme, now under Chapter IV of the Code on Social Security, 2020 (the ESI Act, 1948 was repealed on 21 November 2025). It covers medical treatment, sickness benefit and maternity benefit.` },
      { t: 'pills', pills: [{ value: `0.75% + 3.25%`, label: `Employee + employer, on wages` }, { value: `₹21,000/mo`, label: `Wage ceiling, unchanged (₹25,000 for PwD)` }, { value: `10+`, label: `Employees (20 in a few states)` }] },
      { t: 'p', x: `ESIC's ceiling decides who is covered at all, and the contribution is worked out on the employee's wages for the period. Coverage runs in two six-month contribution periods (April–September, October–March); if wages cross the ceiling mid-period, coverage continues until the period ends.` },
      { t: 'h2', x: `PT (Professional Tax)` },
      { t: 'p', x: `A state-level tax under Article 276 of the Constitution. Every state that levies it sets its own slabs and schedule.` },
      { t: 'pills', pills: [{ value: `₹2,500/yr`, label: `Constitutional maximum, any state` }, { value: `~20 states`, label: `Levy PT. Delhi, Haryana, UP don't` }, { value: `Both regimes`, label: `PT is deductible under Sec 16(iii)` }] },
      { t: 'h2', x: `Side by side` },
      { t: 'table', rows: [{ head: true, cells: [``, `PF`, `ESIC`, `PT`] }, { head: false, cells: [`Governed by`, `Code on Social Security`, `Code on Social Security`, `State PT Acts`] }, { head: false, cells: [`Calculated on`, `Code wages (50% rule)`, `Wages for the period`, `Gross (slab)`] }, { head: false, cells: [`Ceiling`, `₹25,000/mo`, `₹21,000/mo`, `₹2,500/yr`] }, { head: false, cells: [`Purpose`, `Retirement`, `Health cover`, `State revenue`] }] },
      { t: 'h2', x: `Where teams actually get this wrong` },
      { t: 'mistake', lead: `Leaving ₹15,000 as the PF ceiling in the payroll master`, x: `from 17 September 2026, everyone earning up to ₹25,000 is mandatorily covered.` },
      { t: 'mistake', lead: `Calculating ESIC on Basic alone`, x: `under-deducts and under-reports.` },
      { t: 'mistake', lead: `Assuming PT applies everywhere`, x: `Delhi, Haryana, UP, Rajasthan, Punjab don't levy it.` },
      { t: 'mistake', lead: `Missing the ESIC contribution-period rule`, x: `coverage continues to period end, not from the salary-change date.` },
      { t: 'mistake', lead: `Not separating voluntary PF above the ceiling`, x: `causes Form 130 (formerly Form 16) reconciliation issues later.` },
    ],
    cta: {
      title: `EZER calculates all three automatically, every run`,
      body: `State-aware PT, Code-wage ESIC, the new ₹25,000 PF ceiling, without a separate spreadsheet.`,
      label: `Request a Demo`,
    },
  },
  {
    slug: 'old-vs-new-tax-regime',
    category: 'Tax',
    readingTime: '6 min read',
    title: `Old vs New Tax Regime: Helping Employees Actually Decide`,
    excerpt: `Every salaried employee in India now has to actively choose between two tax regimes, and most make that choice once, on a form, without ever seeing the actual numbers side by side.`,
    blocks: [
      { t: 'stat', x: `Under the new regime, income up to ₹12 lakh is effectively tax-free, thanks to a rebate of up to ₹60,000. For salaried employees, the ₹75,000 standard deduction extends that threshold to ₹12.75 lakh gross.` },
      { t: 'p', x: `Since 1 April 2026 all of this sits in the Income-tax Act, 2025, which replaced the 1961 Act. Three things change for payroll: the new regime is the default and the old one is an opt-out, the financial and assessment year are replaced by a single tax year, and the annual salary TDS certificate is Form 130 rather than Form 16. The slabs below carried over unchanged into tax year 2026-27.` },
      { t: 'h2', x: `The new regime, in numbers` },
      { t: 'table', rows: [{ head: true, cells: [`Slab`, `Rate`] }, { head: false, cells: [`Up to ₹4,00,000`, `Nil`] }, { head: false, cells: [`₹4,00,000–₹8,00,000`, `5%`] }, { head: false, cells: [`₹8,00,000–₹12,00,000`, `10%`] }, { head: false, cells: [`₹12,00,000–₹16,00,000`, `15%`] }, { head: false, cells: [`₹16,00,000–₹20,00,000`, `20%`] }, { head: false, cells: [`₹20,00,000–₹24,00,000`, `25%`] }, { head: false, cells: [`Above ₹24,00,000`, `30%`] }] },
      { t: 'p', x: `Plus a ₹75,000 standard deduction, and minimal other deductions. The main survivor is the employer's NPS contribution, allowed up to 14% of salary.` },
      { t: 'h2', x: `The old regime, in numbers` },
      { t: 'table', rows: [{ head: true, cells: [`Slab`, `Rate`] }, { head: false, cells: [`Up to ₹2,50,000`, `Nil`] }, { head: false, cells: [`₹2,50,000–₹5,00,000`, `5%`] }, { head: false, cells: [`₹5,00,000–₹10,00,000`, `20%`] }, { head: false, cells: [`Above ₹10,00,000`, `30%`] }] },
      { t: 'p', x: `Plus a ₹50,000 standard deduction, and the full menu of deductions: investments under what used to be section 80C (up to ₹1.5 lakh), HRA exemption, health insurance (the old 80D), home loan interest, and more. The 2025 Act renumbered these sections; the limits carried over.` },
      { t: 'h2', x: `So which one actually wins?` },
      { t: 'h3', x: `New regime tends to win when:` },
      { t: 'p', x: `Little to no HRA, home loan, or 80C-style investment to claim. Common for younger employees or anyone without structured investments yet. Also simpler: no proofs to collect.` },
      { t: 'h3', x: `Old regime tends to win when:` },
      { t: 'p', x: `Significant rent with HRA, a home loan, and maxed-out 80C-style investments. Combined deductions can outweigh the new regime's lower slabs, particularly in the ₹10–20 lakh range.` },
      { t: 'callout', lead: `The catch:`, x: `the crossover point isn't a fixed number. It shifts with every employee's actual HRA, rent, investments and home loan interest.` },
      { t: 'h2', x: `What HR teams can actually do` },
      { t: 'ul', items: [`Show employees both numbers side by side, from their actual salary structure.`, `Do this before the investment declaration window opens, not after.`, `Remember: salaried employees can switch every year; only business-income filers are limited to switching once.`, `Show the regime that was applied on Form 130 at year end, so nobody is surprised by it.`] },
    ],
    cta: {
      title: `EZER shows this comparison to every employee, automatically`,
      body: `Old vs new, calculated from their real declaration, before they commit, not after.`,
      label: `Request a Demo`,
    },
  },
]

export const contentHub = {
  eyebrow: 'Where we show our work',
  title: 'Blog, videos and updates from the team building EZER',
  lede:
    'Compliance changes fast in India. This is where we break down what changed, ' +
    'what it means for your payroll, and how EZER handles it.',
  channels: [
    {
      name: 'On YouTube',
      status: 'Coming soon',
      detail: 'Product walkthroughs and Indian payroll explainers',
      icon: 'play' as IconName,
    },
    {
      name: 'On LinkedIn',
      status: 'Coming soon',
      detail: 'Build updates and compliance notes from the team',
      icon: 'linkedin' as IconName,
    },
  ],
} as const

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}
