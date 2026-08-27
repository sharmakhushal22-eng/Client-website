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
    title: `Understanding India's Four Labour Codes — What Actually Changed`,
    excerpt: `On 21 November 2025, India's four Labour Codes came into effect, folding 29 separate central laws into four. That sounds like a headline, not a payroll problem — until you realise the rules are still rolling out state by state, and the definition of "wages" itself has changed underneath every PF, ESIC and gratuity calculation you run.`,
    blocks: [
      { t: 'p', x: `Here's what the four Codes actually are, what's changed in practice, and what's still in motion.` },
      { t: 'h2', x: `The four Codes, in plain terms` },
      { t: 'h3', x: `1. Code on Wages, 2019` },
      { t: 'p', x: `Consolidates minimum wage, payment of wages, bonus and equal remuneration law into one Code. It also introduces a single, uniform definition of "wages" that now applies across PF, ESIC, gratuity and bonus calculations — more on why that matters below.` },
      { t: 'h3', x: `2. Industrial Relations Code, 2020` },
      { t: 'p', x: `Covers standing orders, retrenchment, layoffs and dispute resolution. It raises the threshold for standing orders and government permission for layoffs/retrenchment from 100 to 300 employees at an establishment — a meaningful change for growing mid-size manufacturers.` },
      { t: 'h3', x: `3. Code on Social Security, 2020` },
      { t: 'p', x: `Brings PF, ESIC, gratuity, maternity benefit and — for the first time — social security provisions for gig and platform workers under one Code.` },
      { t: 'h3', x: `4. Occupational Safety, Health and Working Conditions Code, 2020` },
      { t: 'p', x: `Governs working hours, shift limits, welfare facilities and safety standards, and extends coverage to establishment types that weren't clearly covered before, including some categories of contract and inter-state migrant workers.` },
      { t: 'h2', x: `The change that actually hits your payroll: the new wage definition` },
      { t: 'p', x: `The Code on Wages standardises how "wages" is defined for statutory purposes. The practical effect: Basic pay plus Dearness Allowance must add up to at least 50% of an employee's total remuneration. If allowances (HRA, special allowance, and similar components) push Basic below that 50% mark, the excess gets added back to "wages" for PF, gratuity and ESIC calculation purposes anyway.` },
      { t: 'p', x: `This closes a structuring pattern a lot of Indian companies used — keeping Basic artificially low and allowances high to reduce statutory contribution liability. If your salary structures were built that way, your PF and gratuity base goes up under the new definition, even though the 12% PF rate itself hasn't changed.` },
      { t: 'callout', lead: `What this means in practice:`, x: `a CTC structure that was compliant and cost-efficient under the old rules may now be quietly under-compliant. This is worth an actual audit of your salary structures, not an assumption that nothing changed because the headline rate didn't move.` },
      { t: 'h2', x: `What hasn't changed yet` },
      { t: 'p', x: `The Codes are in effect, but the detailed rules under them — the state-level notifications that fill in implementation specifics — are still being issued in phases. Under the "Repeal and Savings" clause common to all four Codes, the rules framed under the 29 repealed central laws continue to apply until the corresponding new rules are notified. Where the old rules and the new Code conflict, the Code prevails.` },
      { t: 'p', x: `In practice, this means compliance right now is a moving target: the broad framework is set, but state-by-state implementation is still catching up, and it will keep catching up through 2026.` },
      { t: 'h2', x: `What HR and payroll teams should actually do` },
      { t: 'ol', items: [`Audit current salary structures against the 50%-of-remuneration Basic+DA rule — don't assume last year's structure still holds.`, `Track state-level rule notifications for every state you operate in, not just headquarters.`, `Re-check standing order and retrenchment thresholds if your headcount is approaching 300 at any single establishment.`, `Don't wait for a single "final" notification — the rollout is genuinely phased, and treating it as a one-time update will leave gaps.`] },
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
    title: `PF vs ESIC vs PT — A Quick Reference for HR Teams`,
    excerpt: `Three deductions show up on almost every Indian payslip. Three different government bodies. Three different purposes. And three different sets of rules on who's covered and how much gets deducted. Here's the reference we wish someone had handed us on day one.`,
    blocks: [
      { t: 'h2', x: `PF (Provident Fund)` },
      { t: 'p', x: `A retirement savings scheme under the EPF & Miscellaneous Provisions Act, 1952, run by the EPFO.` },
      { t: 'pills', pills: [{ value: `12% + 12%`, label: `Employee + employer, on Basic + DA` }, { value: `₹15,000/mo`, label: `Wage ceiling for mandatory coverage` }, { value: `20+`, label: `Employees for mandatory coverage` }] },
      { t: 'p', x: `Of the employer's 12%, 8.33% routes to the Employees' Pension Scheme (EPS) and the remaining 3.67% to the employee's own EPF account. Above the ₹15,000 ceiling, contribution is voluntary. Filed monthly via the Electronic Challan cum Return (ECR) on the EPFO Unified Portal.` },
      { t: 'h2', x: `ESIC (Employees' State Insurance)` },
      { t: 'p', x: `A health insurance and social security scheme under the ESI Act, 1948 — covers medical treatment, sickness benefit and maternity benefit.` },
      { t: 'pills', pills: [{ value: `0.75% + 3.25%`, label: `Employee + employer, on gross wages` }, { value: `₹21,000/mo`, label: `Gross wage ceiling (₹25,000 for PwD)` }, { value: `10+`, label: `Employees (20 in a few states)` }] },
      { t: 'p', x: `Unlike PF, ESIC is calculated on gross wages, not Basic + DA. Coverage runs in two six-month contribution periods (April–September, October–March); if gross wage crosses the ceiling mid-period, coverage continues until the period ends.` },
      { t: 'h2', x: `PT (Professional Tax)` },
      { t: 'p', x: `A state-level tax under Article 276 of the Constitution — every state that levies it sets its own slabs and schedule.` },
      { t: 'pills', pills: [{ value: `₹2,500/yr`, label: `Constitutional maximum, any state` }, { value: `~20 states`, label: `Levy PT — Delhi, Haryana, UP don't` }, { value: `Both regimes`, label: `PT is deductible under Sec 16(iii)` }] },
      { t: 'h2', x: `Side by side` },
      { t: 'table', rows: [{ head: true, cells: [``, `PF`, `ESIC`, `PT`] }, { head: false, cells: [`Governed by`, `EPFO`, `ESIC`, `State govts`] }, { head: false, cells: [`Calculated on`, `Basic + DA`, `Gross wages`, `Gross (slab)`] }, { head: false, cells: [`Ceiling`, `₹15,000/mo`, `₹21,000/mo`, `₹2,500/yr`] }, { head: false, cells: [`Purpose`, `Retirement`, `Health cover`, `State revenue`] }] },
      { t: 'h2', x: `Where teams actually get this wrong` },
      { t: 'mistake', lead: `Calculating ESIC on Basic instead of gross`, x: `under-deducts and under-reports.` },
      { t: 'mistake', lead: `Assuming PT applies everywhere`, x: `Delhi, Haryana, UP, Rajasthan, Punjab don't levy it.` },
      { t: 'mistake', lead: `Missing the ESIC contribution-period rule`, x: `coverage continues to period end, not from the salary-change date.` },
      { t: 'mistake', lead: `Not separating voluntary PF above the ceiling`, x: `causes Form 16 reconciliation issues later.` },
    ],
    cta: {
      title: `EZER calculates all three automatically, every run`,
      body: `State-aware PT, gross-wage ESIC, ceiling-aware PF — without a separate spreadsheet.`,
      label: `Request a Demo`,
    },
  },
  {
    slug: 'old-vs-new-tax-regime',
    category: 'Tax',
    readingTime: '6 min read',
    title: `Old vs New Tax Regime — Helping Employees Actually Decide`,
    excerpt: `Every salaried employee in India now has to actively choose between two tax regimes, and most make that choice once, on a form, without ever seeing the actual numbers side by side.`,
    blocks: [
      { t: 'stat', x: `Under the new regime, income up to ₹12 lakh is effectively tax-free — thanks to a ₹60,000 rebate under Section 202 of the Income Tax Act, 2025. For salaried employees, the ₹75,000 standard deduction extends that threshold to ₹12.75 lakh gross.` },
      { t: 'h2', x: `The new regime, in numbers` },
      { t: 'table', rows: [{ head: true, cells: [`Slab`, `Rate`] }, { head: false, cells: [`Up to ₹4,00,000`, `Nil`] }, { head: false, cells: [`₹4,00,000–₹8,00,000`, `5%`] }, { head: false, cells: [`₹8,00,000–₹12,00,000`, `10%`] }, { head: false, cells: [`₹12,00,000–₹16,00,000`, `15%`] }, { head: false, cells: [`₹16,00,000–₹20,00,000`, `20%`] }, { head: false, cells: [`₹20,00,000–₹24,00,000`, `25%`] }, { head: false, cells: [`Above ₹24,00,000`, `30%`] }] },
      { t: 'p', x: `Plus a ₹75,000 standard deduction, and minimal other deductions — the main survivor is employer NPS contribution under Section 80CCD(2).` },
      { t: 'h2', x: `The old regime, in numbers` },
      { t: 'table', rows: [{ head: true, cells: [`Slab`, `Rate`] }, { head: false, cells: [`Up to ₹2,50,000`, `Nil`] }, { head: false, cells: [`₹2,50,000–₹5,00,000`, `5%`] }, { head: false, cells: [`₹5,00,000–₹10,00,000`, `20%`] }, { head: false, cells: [`Above ₹10,00,000`, `30%`] }] },
      { t: 'p', x: `Plus a ₹50,000 standard deduction, and the full menu of deductions: 80C (up to ₹1.5 lakh), HRA exemption, 80D health insurance, home loan interest under 24(b), and more.` },
      { t: 'h2', x: `So which one actually wins?` },
      { t: 'h3', x: `New regime tends to win when:` },
      { t: 'p', x: `Little to no HRA, home loan, or 80C investment to claim — common for younger employees or anyone without structured investments yet. Also simpler: no proofs to collect.` },
      { t: 'h3', x: `Old regime tends to win when:` },
      { t: 'p', x: `Significant rent with HRA, a home loan, and maxed-out 80C — combined deductions can outweigh the new regime's lower slabs, particularly in the ₹10–20 lakh range.` },
      { t: 'callout', lead: `The catch:`, x: `the crossover point isn't a fixed number — it shifts with every employee's actual HRA, rent, investments and home loan interest.` },
      { t: 'h2', x: `What HR teams can actually do` },
      { t: 'ul', items: [`Show employees both numbers side by side, from their actual salary structure.`, `Do this before the investment declaration window opens, not after.`, `Remember: salaried employees can switch every year; only business-income filers are limited to switching once.`] },
    ],
    cta: {
      title: `EZER shows this comparison to every employee, automatically`,
      body: `Old vs new, calculated from their real declaration — before they commit, not after.`,
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
