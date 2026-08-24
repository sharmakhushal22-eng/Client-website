-- ============================================================================
-- 001 — Enquiry leads and the sales pipeline
--
-- Spec §5 (lead capture) and §7 (internal lead management).
--
-- This database is a SEPARATE Supabase project from the HRMS product. It holds
-- no employee data, no payroll data and no PII belonging to a customer's staff
-- — only the contact details of people who asked us about the product. Keeping
-- it separate means a marketing deploy can never reach the payroll tables.
-- ============================================================================

create extension if not exists pgcrypto;

-- ── Enumerated domains ──────────────────────────────────────────────────────
-- Modelled as CHECK constraints rather than Postgres enums: an enum needs an
-- ALTER TYPE (and, historically, a transaction boundary) to add a value, and
-- these lists WILL grow as sales changes its process.

create table if not exists public.website_leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- ── Identity (short form: email, phone, company are the 3 required) ──────
  full_name         text,
  work_email        text not null,
  phone             text not null,
  company_name      text not null,

  -- ── Qualification ───────────────────────────────────────────────────────
  -- employee_band is, per spec §5.1, the single best qualifier we collect.
  employee_band     text check (employee_band in
                      ('<50', '50-200', '200-500', '500-1000', '1000+')),
  designation       text check (designation in
                      ('HR', 'Finance', 'Founder', 'IT', 'Other')),
  city              text,
  state             text,
  currently_using   text check (currently_using in
                      ('Excel', 'Another HRMS', 'Outsourced', 'Nothing')),
  modules_interest  text[] not null default '{}',
  timeline          text check (timeline in
                      ('Immediately', '1-3 months', 'Just exploring')),
  message           text,

  -- ── Consent (DPDP Act 2023, spec §8.7) ──────────────────────────────────
  -- Unticked by default in the UI; we record WHEN it was given and the exact
  -- wording shown, because "we had consent" is only defensible if you can say
  -- what the person actually agreed to.
  consent           boolean not null default false,
  consent_at        timestamptz,
  consent_text      text,

  -- ── Attribution (spec §5.2 — without this you cannot tell what works) ────
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_term          text,
  utm_content       text,
  gclid             text,
  fbclid            text,
  referrer          text,
  landing_page      text,
  form_name         text not null default 'unknown',

  -- ── Request metadata ────────────────────────────────────────────────────
  -- ip_hash, never the raw IP: it is enough to rate-limit and to spot abuse,
  -- but it is not a stored identifier we would have to justify under DPDP.
  ip_hash           text,
  user_agent        text,

  -- ── Pipeline (spec §7) ──────────────────────────────────────────────────
  status            text not null default 'New' check (status in
                      ('New', 'Contacted', 'Demo booked', 'Demo done',
                       'Proposal', 'Won', 'Lost')),
  owner             text,
  next_action_date  date,

  -- ── Response-time reporting (spec §7, §1.3: median ≤ 15 min) ────────────
  -- Denormalised onto the row so the report is a single scan, not a join to
  -- the history table for every lead.
  first_contacted_at timestamptz,

  -- ── Delivery bookkeeping (spec §5.4) ────────────────────────────────────
  -- The lead row is written BEFORE any third-party call, so these start null
  -- and get filled in as the side effects succeed. A null here means "that
  -- notification never went out" — which is exactly what you want to be able
  -- to query after an outage.
  autoreply_sent_at      timestamptz,
  internal_notified_at   timestamptz,
  crm_synced_at          timestamptz,

  is_spam           boolean not null default false
);

comment on table public.website_leads is
  'Enquiries from the marketing website. Separate project from the HRMS — contains no employee or payroll data.';
comment on column public.website_leads.ip_hash is
  'SHA-256 of (client IP + server salt). Used for rate limiting only; the raw IP is never stored.';
comment on column public.website_leads.first_contacted_at is
  'Set when status first leaves New. Denormalised from lead_status_history so the response-time report is one scan.';

-- Sales opens this list sorted by newest-first, filtered by status.
create index if not exists website_leads_created_at_idx
  on public.website_leads (created_at desc);
create index if not exists website_leads_status_idx
  on public.website_leads (status, created_at desc);
create index if not exists website_leads_owner_idx
  on public.website_leads (owner, next_action_date)
  where owner is not null;
-- Rate limiting queries this constantly (spec §5.3: 5 per IP per hour).
create index if not exists website_leads_ip_hash_idx
  on public.website_leads (ip_hash, created_at desc);
-- Campaign reporting.
create index if not exists website_leads_utm_source_idx
  on public.website_leads (utm_source, created_at desc)
  where utm_source is not null;

-- ── Notes ───────────────────────────────────────────────────────────────────
create table if not exists public.lead_notes (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.website_leads(id) on delete cascade,
  author      text not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists lead_notes_lead_id_idx
  on public.lead_notes (lead_id, created_at desc);

-- ── Status history ──────────────────────────────────────────────────────────
-- Every transition, appended by trigger. This is what makes the response-time
-- report and the funnel conversion rates in spec §1.3 computable at all.
create table if not exists public.lead_status_history (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.website_leads(id) on delete cascade,
  from_status text,
  to_status   text not null,
  changed_by  text,
  changed_at  timestamptz not null default now()
);

create index if not exists lead_status_history_lead_id_idx
  on public.lead_status_history (lead_id, changed_at);

-- ── Triggers ────────────────────────────────────────────────────────────────

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists website_leads_touch on public.website_leads;
create trigger website_leads_touch
  before update on public.website_leads
  for each row execute function public.touch_updated_at();

-- Record the transition and stamp first_contacted_at the first time a lead
-- moves off New. Done in a trigger rather than in application code so that a
-- status changed straight from the Supabase table editor is still recorded.
create or replace function public.log_lead_status_change()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from old.status then
    insert into public.lead_status_history (lead_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, new.owner);

    if old.status = 'New' and new.first_contacted_at is null then
      new.first_contacted_at = now();
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists website_leads_log_status on public.website_leads;
create trigger website_leads_log_status
  before update on public.website_leads
  for each row execute function public.log_lead_status_change();

-- ── Row Level Security (spec §8.7) ──────────────────────────────────────────
-- The rule is: anonymous visitors may INSERT, and nobody may SELECT.
--
-- In practice the server actions in this app use the service-role key, which
-- bypasses RLS entirely — so these policies are defence in depth. They mean
-- that even if the anon key leaks (it is a public key; assume it will), the
-- worst an attacker can do is add junk rows, never read a single lead.

alter table public.website_leads      enable row level security;
alter table public.lead_notes         enable row level security;
alter table public.lead_status_history enable row level security;

drop policy if exists "anon may submit a lead" on public.website_leads;
create policy "anon may submit a lead"
  on public.website_leads
  for insert
  to anon
  with check (true);

-- Deliberately NO select / update / delete policy on any of the three tables.
-- With RLS enabled and no policy, those operations return zero rows for anon
-- and authenticated alike. Reads happen only through the service-role key,
-- server-side, behind the lead inbox's own auth.
