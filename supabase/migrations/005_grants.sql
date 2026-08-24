-- ============================================================================
-- 005 — Table privileges for the anon role
--
-- RLS policies decide WHICH ROWS a role may touch. They do not grant the
-- privilege to touch the table at all — that is a separate GRANT, and both
-- must line up before a request succeeds.
--
-- Supabase grants these automatically for tables created through the
-- dashboard or the API. Tables created by running SQL directly, as these
-- were, do not pick them up — so an anonymous insert fails with
-- "permission denied for table website_leads" even though the RLS policy
-- allows it. This migration closes that gap explicitly.
--
-- Being explicit is better than relying on default privileges anyway: the
-- security posture is now readable in one file instead of inferred from
-- whatever ALTER DEFAULT PRIVILEGES happened to be in force.
-- ============================================================================

-- ── Capture tables: INSERT only, never SELECT ───────────────────────────────
-- Spec §8.7: "anonymous inserts allowed, reads never". Withholding the SELECT
-- privilege is the belt to the RLS braces — even a policy added by mistake
-- later cannot expose these rows to the anon key.
grant insert on public.website_leads          to anon, authenticated;
grant insert on public.demo_bookings          to anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant insert on public.asset_downloads        to anon, authenticated;

-- ── Content tables: SELECT only ─────────────────────────────────────────────
-- The RLS policies on these already narrow reads to published rows.
grant select on public.posts                to anon, authenticated;
grant select on public.guides               to anon, authenticated;
grant select on public.authors              to anon, authenticated;
grant select on public.compliance_calendar  to anon, authenticated;

-- ── Deliberately NOT granted to anon ────────────────────────────────────────
--   lead_notes, lead_status_history  — internal sales data
--   rate_limit_events                — reached only through check_rate_limit(),
--                                      which is SECURITY DEFINER and already
--                                      has EXECUTE granted in migration 003
--
-- Nothing below revokes anything, so re-running is safe.

-- ── Sanity check ────────────────────────────────────────────────────────────
-- Fails the migration loudly if the grants did not land, rather than leaving a
-- silently broken enquiry form to be discovered by a real visitor.
do $$
declare
  can_insert boolean;
  can_select boolean;
begin
  select has_table_privilege('anon', 'public.website_leads', 'INSERT') into can_insert;
  select has_table_privilege('anon', 'public.website_leads', 'SELECT') into can_select;

  if not can_insert then
    raise exception 'anon cannot INSERT into website_leads — the enquiry form will fail';
  end if;
  if can_select then
    raise exception 'anon CAN SELECT website_leads — leads are readable from the browser';
  end if;
end $$;
