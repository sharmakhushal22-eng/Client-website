import { articles } from '@/content/articles'
import { policyCategories, policyCount, operatedCount } from '@/content/policy-handbook'
import { visionGoal } from '@/content/positioning'
import { contact, ezerPillars } from '@/site.config'

/* ============================================================================
 * The Company menu's preview panes, built on the SERVER.
 *
 * This exists because of what happened when it did not. The previews were
 * assembled inside Header.tsx, which is a client component — so importing
 * content/articles, content/policy-handbook and content/positioning to read
 * four titles and three category names shipped ALL of them to the browser:
 * an 80 KB chunk carrying the full text of three blog articles and the
 * details of all 75 policies, downloaded on every page of the site, to
 * render a hover menu.
 *
 * The values still come from the real content, so they cannot drift — the
 * handbook row counts the policies rather than claiming a number. They are
 * just reduced to the handful of strings the menu actually renders before
 * they cross into the client, by the one server component that renders the
 * header. About a kilobyte instead of eighty.
 *
 * KEEP THIS FILE OUT OF ANY CLIENT COMPONENT. Importing it from one would
 * pull the whole content layer back into the bundle and undo the point of it.
 * ========================================================================= */

export type NavPreview = {
  eyebrow: string
  title: string
  blurb: string
  bullets: string[]
  cta: string
}

/** Keyed by the menu row's href. */
export function companyPreviews(): Record<string, NavPreview> {
  return {
    '/about': {
      eyebrow: 'Why EZER exists',
      title: 'Built for Indian compliance first',
      blurb: visionGoal.why.support,
      bullets: ezerPillars.map((p) => p.title),
      cta: 'Read about us',
    },
    '/blog': {
      eyebrow: 'Compliance explainers',
      title: `${articles.length} articles for Indian HR teams`,
      blurb:
        'What actually changed, what it costs you, and what to tell employees — ' +
        'written for the person who has to run the payroll.',
      bullets: articles.map((a) => a.title),
      cta: 'Read the blog',
    },
    '/resources/policy-handbook': {
      eyebrow: 'Free resource',
      title: `${policyCount} policies, ${policyCategories.length} areas`,
      blurb:
        'The policy library an Indian company is expected to have, grouped by ' +
        `area. ${operatedCount} of them are operated inside EZER rather than ` +
        'filed and forgotten.',
      bullets: policyCategories.slice(0, 3).map((c) => c.name),
      cta: 'Open the handbook',
    },
    '/contact': {
      eyebrow: 'Talk to us',
      title: 'Sales, support and partnerships',
      blurb: `One number, answered by people who know the product. We reply ${contact.responseSla}.`,
      bullets: [
        `Call ${contact.phoneDisplay}`,
        `WhatsApp ${contact.whatsappDisplay}`,
        contact.businessHours,
      ],
      cta: 'Open contact',
    },
  }
}

/** The policy count, for the row's one-line description. Derived, so adding a
 *  policy updates the nav without anyone remembering to. */
export const navPolicyCount = policyCount
