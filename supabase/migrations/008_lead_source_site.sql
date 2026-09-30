-- ============================================================================
-- 008 — Which website a lead came from
--
-- Two sites now write to website_leads: this one (ezerhrms.com) and the
-- parent company's site (besthrms.co). form_name hints at it, but it is a
-- per-form label, not a site, and sales should not have to know that
-- 'besthrms-demo' means the other website. So each row says it outright.
--
-- The default is 'ezerhrms.com', which does two jobs: every existing row is
-- correct the moment the column exists, and this site's insert path needs no
-- change at all — so there is no deploy-order race between this migration
-- and the code. besthrms.co sets the column explicitly.
--
-- A CHECK rather than free text, like the other enumerated columns in 001:
-- a typo in one site's code should fail loudly in testing, not quietly split
-- the report into 'besthrms.co' and 'www.besthrms.co'. Adding a third site
-- means extending this list.
-- ============================================================================

alter table public.website_leads
  add column if not exists source_site text not null default 'ezerhrms.com';

alter table public.website_leads
  drop constraint if exists website_leads_source_site_check;
alter table public.website_leads
  add constraint website_leads_source_site_check
  check (source_site in ('ezerhrms.com', 'besthrms.co'));

comment on column public.website_leads.source_site is
  'Website the enquiry was submitted on: ezerhrms.com | besthrms.co.';

-- Backfill: besthrms.co went live on 30 Sep 2026 writing form_name
-- 'besthrms-demo' before this column existed.
update public.website_leads
   set source_site = 'besthrms.co'
 where form_name = 'besthrms-demo'
   and source_site <> 'besthrms.co';

-- The admin inbox filters by site, newest first.
create index if not exists website_leads_source_site_idx
  on public.website_leads (source_site, created_at desc);
