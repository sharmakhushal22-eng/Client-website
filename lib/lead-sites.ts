/* ============================================================================
 * Which website a lead came from.
 *
 * ONE list, because migration 008 puts a CHECK constraint on the column and
 * the whole point of that constraint is that a typo fails loudly instead of
 * quietly splitting the report into 'besthrms.co' and 'www.besthrms.co'. A
 * second copy of the list somewhere else is exactly how that happens anyway.
 * The admin panel re-exports this rather than declaring its own.
 *
 * Deliberately NOT in lib/admin/db.ts: the public lead action needs it, and
 * that module builds a service-role Supabase client. The list of our own
 * domain names does not belong behind the admin's data layer.
 * ========================================================================= */

export const LEAD_SITES = ['ezerhrms.com', 'besthrms.co'] as const

export type LeadSite = (typeof LEAD_SITES)[number]

/** What the database column defaults to, and what an unrecognised host is
 *  treated as. Kept in sync with the DEFAULT in migration 008. */
export const DEFAULT_LEAD_SITE: LeadSite = 'ezerhrms.com'

/** The site a request's Host header belongs to, or null when it is neither.
 *
 *  Null is a real answer and the caller must handle it: preview deployments
 *  (`*.vercel.app`), `localhost`, and anything else a proxy might pass
 *  through all land here. The lead action omits the column in that case so
 *  the database default applies — writing an unrecognised value instead
 *  would trip the CHECK constraint and fail the insert, and losing a real
 *  enquiry to a labelling question is not a trade worth making (§5.4).
 *
 *  `www.` is stripped because the www and apex hosts are one website, and a
 *  report split across the two would be worse than useless. */
export function leadSiteFromHost(host: string | null | undefined): LeadSite | null {
  if (!host) return null

  const bare = host
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '')       // strip the port — :3100 in development
    .replace(/^www\./, '')

  return (LEAD_SITES as readonly string[]).includes(bare) ? (bare as LeadSite) : null
}
