-- ============================================================================
-- 006 — Table privileges for service_role
--
-- The secret key (sb_secret_… / service_role) bypasses RLS, but RLS and
-- GRANTs are separate gates: bypassing the first does nothing if the second
-- was never opened. Tables created by running SQL directly do not inherit
-- Supabase's default privileges, so service_role had none — every admin read
-- returned 42501 "permission denied", with PostgREST helpfully suggesting
-- exactly this GRANT.
--
-- Migration 005 did the same job for anon. This is its counterpart.
-- ============================================================================

-- Full access on every table: this role is the admin panel's identity, and
-- the panel legitimately reads leads, writes notes and updates statuses.
grant select, insert, update, delete
  on all tables in schema public
  to service_role;

-- lead_notes has a uuid default, but rate_limit_events uses bigserial, whose
-- INSERT needs the sequence too.
grant usage, select on all sequences in schema public to service_role;

grant execute on all functions in schema public to service_role;

-- Tables added by a LATER migration would otherwise miss out and reproduce
-- this exact bug. Default privileges close that for anything created from
-- here on by the migration role.
alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;
alter default privileges in schema public
  grant usage, select on sequences to service_role;

-- ── Sanity check ────────────────────────────────────────────────────────────
-- Fails loudly rather than leaving an admin panel that cannot read.
do $$
begin
  if not has_table_privilege('service_role', 'public.website_leads', 'SELECT') then
    raise exception 'service_role still cannot SELECT website_leads — the admin panel will not work';
  end if;
  -- anon must remain unable to read. Migration 005 asserts this too; repeating
  -- it here guards against a broad GRANT above having caught anon by mistake.
  if has_table_privilege('anon', 'public.website_leads', 'SELECT') then
    raise exception 'anon can now SELECT website_leads — leads are readable from the browser';
  end if;
end $$;
