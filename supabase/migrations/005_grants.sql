-- ============================================================================
-- 005 — Table privileges for the anon role
--
-- RLS policies decide WHICH ROWS a role may touch. They do not grant the
-- privilege to touch the table at all — that is a separate GRANT, and both
-- must line up before a request succeeds.
--
-- Supabase's default privileges on `public` are the opposite of what this
-- site needs, and they cut BOTH ways depending on how the table was made:
--
--   • Historically, tables created by running SQL directly picked up nothing,
--     so an anonymous insert failed with "permission denied for table
--     website_leads" even though the RLS policy allowed it.
--
--   • On a current project the reverse happens. Measured on ezer-marketing
--     immediately after 001–004 ran, `anon` held DELETE, INSERT, REFERENCES,
--     SELECT, TRIGGER, TRUNCATE and UPDATE on EVERY table — leads, lead notes
--     and status history included. RLS still blocked the reads, because there
--     is no SELECT policy, so nothing was exposed through PostgREST. But the
--     privilege had no business existing, and TRUNCATE is not subject to RLS
--     at all: a privilege that RLS cannot restrain is not defence in depth,
--     it is a single point of failure.
--
-- So this migration does not assume either starting state. It REVOKES
-- everything from anon and authenticated, then grants back exactly what each
-- table needs. The posture is then readable in one file instead of inferred
-- from whatever ALTER DEFAULT PRIVILEGES happened to be in force.
--
-- service_role is untouched here — migration 006 is its counterpart.
-- ============================================================================

-- ── Start from nothing ──────────────────────────────────────────────────────
-- Both roles, every table, no exceptions. Everything the site needs is
-- granted back below, so anything NOT listed there is deliberate.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

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
  t text;
begin
  -- Capture tables: INSERT and nothing else.
  foreach t in array array['website_leads','demo_bookings',
                           'newsletter_subscribers','asset_downloads'] loop
    if not has_table_privilege('anon', 'public.' || t, 'INSERT') then
      raise exception 'anon cannot INSERT into % — that form will fail', t;
    end if;
    if has_table_privilege('anon', 'public.' || t, 'SELECT') then
      raise exception 'anon CAN SELECT % — submissions are readable from the browser', t;
    end if;
    if has_table_privilege('anon', 'public.' || t, 'UPDATE')
       or has_table_privilege('anon', 'public.' || t, 'DELETE')
       or has_table_privilege('anon', 'public.' || t, 'TRUNCATE') then
      raise exception 'anon can modify or destroy % — TRUNCATE in particular is not subject to RLS', t;
    end if;
  end loop;

  -- Internal tables: nothing at all.
  foreach t in array array['lead_notes','lead_status_history','rate_limit_events'] loop
    if has_table_privilege('anon', 'public.' || t, 'SELECT')
       or has_table_privilege('anon', 'public.' || t, 'INSERT')
       or has_table_privilege('anon', 'public.' || t, 'UPDATE')
       or has_table_privilege('anon', 'public.' || t, 'DELETE') then
      raise exception 'anon has access to % — that is internal sales data', t;
    end if;
  end loop;

  -- Content tables: SELECT, narrowed further by RLS to published rows only.
  foreach t in array array['posts','guides','authors','compliance_calendar'] loop
    if not has_table_privilege('anon', 'public.' || t, 'SELECT') then
      raise exception 'anon cannot SELECT % — published content will not render', t;
    end if;
    if has_table_privilege('anon', 'public.' || t, 'INSERT')
       or has_table_privilege('anon', 'public.' || t, 'UPDATE')
       or has_table_privilege('anon', 'public.' || t, 'DELETE') then
      raise exception 'anon can WRITE to % — anyone could publish to the site', t;
    end if;
  end loop;
end $$;
