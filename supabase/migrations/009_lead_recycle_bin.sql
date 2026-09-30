-- ============================================================================
-- 009 — The recycle bin: leads are retired, never destroyed
--
-- Deleting a lead from the admin panel used to remove the row, and with it —
-- by the cascades in 001 — every note and every status change anyone had
-- recorded against that enquiry. One mis-click, and a conversation the sales
-- team had been having for a month was gone with nothing to restore it from.
--
-- So a delete now sets deleted_at. The row stays, its notes and history stay
-- attached, and it can be put back. Two columns rather than a separate
-- deleted_leads table, deliberately: moving a row between tables breaks the
-- foreign keys pointing at it, and a restore then has to invent new ids for
-- the notes. Nothing moves, so nothing breaks.
--
-- THE PART THAT IS NOT A UI DECISION
--
-- The admin panel must not be able to destroy a lead, and the way to mean
-- that is to take the privilege away rather than to hide a button. The panel
-- authenticates as service_role; migration 006 granted that role DELETE on
-- every table in the schema. This revokes it on this one table.
--
-- After this, a DELETE on website_leads from the application fails with
-- 42501 no matter what the code asks for — a bug, a stray script, or someone
-- with the admin password and bad intentions all hit the same wall. Removing
-- a lead for good becomes a deliberate act by someone with database access,
-- in the Supabase SQL editor, as the table owner:
--
--     delete from public.website_leads where id = '…';
--
-- 006 grants DELETE to service_role across the schema, so it must run BEFORE
-- this file. It does: migrations apply in filename order, and nothing here is
-- re-granted afterwards. Re-running the whole set is still safe.
--
-- The other tables are untouched. This one holds the enquiries the business
-- is built on; the newsletter list does not need the same ceremony.
-- ============================================================================

alter table public.website_leads
  add column if not exists deleted_at timestamptz;

alter table public.website_leads
  add column if not exists deleted_by text;

comment on column public.website_leads.deleted_at is
  'When this lead was moved to the recycle bin. NULL means it is live. Rows are never removed by the application — see migration 009.';
comment on column public.website_leads.deleted_by is
  'The admin who moved it to the recycle bin.';

-- The inbox reads "everything not deleted, newest first" on every page load,
-- and the bin reads the opposite. A partial index for each, so neither has to
-- scan rows belonging to the other.
create index if not exists website_leads_live_idx
  on public.website_leads (created_at desc)
  where deleted_at is null;

create index if not exists website_leads_binned_idx
  on public.website_leads (deleted_at desc)
  where deleted_at is not null;

-- ── The guarantee ───────────────────────────────────────────────────────────
revoke delete on public.website_leads from service_role;
revoke delete on public.website_leads from anon, authenticated;

-- ── Sanity check ────────────────────────────────────────────────────────────
-- Fails the migration loudly rather than leaving a panel that still believes
-- it can destroy a lead, or one that cannot retire one.
do $$
begin
  if has_table_privilege('service_role', 'public.website_leads', 'DELETE') then
    raise exception 'service_role can still DELETE website_leads — the recycle bin is not enforced';
  end if;

  if not has_table_privilege('service_role', 'public.website_leads', 'UPDATE') then
    raise exception 'service_role cannot UPDATE website_leads — nothing could be binned or restored';
  end if;

  if not has_table_privilege('service_role', 'public.website_leads', 'SELECT') then
    raise exception 'service_role cannot SELECT website_leads — the admin panel will not work';
  end if;
end $$;
