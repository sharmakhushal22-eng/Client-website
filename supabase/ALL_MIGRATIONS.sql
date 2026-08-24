
-- ======================================================================
-- 001_leads.sql
-- ======================================================================

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

-- ======================================================================
-- 002_demo_bookings.sql
-- ======================================================================

-- ============================================================================
-- 002 — Demo bookings
--
-- Spec §4.6 (/book-a-demo) and §5.4 items 5–6.
--
-- The booking calendar itself lives in Cal.com or Calendly; this table is our
-- own copy of what was booked. Two reasons to keep it rather than relying on
-- the scheduling tool: the no-show rate in §1.3 has to be computable without
-- an export, and a booking has to be joinable to the lead that produced it.
-- ============================================================================

create table if not exists public.demo_bookings (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Nullable: someone can book straight from the calendar embed without ever
  -- submitting our form. We reconcile by email in that case.
  lead_id           uuid references public.website_leads(id) on delete set null,

  -- ── Who booked ──────────────────────────────────────────────────────────
  full_name         text not null,
  work_email        text not null,
  phone             text,
  company_name      text,
  employee_band     text,

  -- ── The slot ────────────────────────────────────────────────────────────
  slot_start        timestamptz not null,
  slot_end          timestamptz not null,
  timezone          text not null default 'Asia/Kolkata',
  meeting_url       text,
  assigned_to       text,

  -- ── Scheduler linkage ───────────────────────────────────────────────────
  -- provider_booking_uid is what the webhook sends us; unique so a retried or
  -- duplicated webhook delivery updates the row instead of creating a second.
  provider              text check (provider in ('cal.com', 'calendly', 'manual')),
  provider_booking_uid  text unique,
  calendar_event_id     text,

  -- ── Reminders (spec §5.4 item 5: 24h and 1h) ────────────────────────────
  reminder_24h_sent_at  timestamptz,
  reminder_1h_sent_at   timestamptz,

  -- ── Outcome (spec §1.3: no-show rate ≤ 25%) ─────────────────────────────
  outcome           text not null default 'Scheduled' check (outcome in
                      ('Scheduled', 'Held', 'No-show', 'Cancelled', 'Rescheduled')),
  rescheduled_from  uuid references public.demo_bookings(id) on delete set null,
  outcome_notes     text,

  constraint demo_bookings_slot_order check (slot_end > slot_start)
);

comment on table public.demo_bookings is
  'Our own record of demo slots booked. Mirrors Cal.com/Calendly so no-show rate and lead attribution stay queryable.';

create index if not exists demo_bookings_slot_start_idx
  on public.demo_bookings (slot_start);
create index if not exists demo_bookings_lead_id_idx
  on public.demo_bookings (lead_id);
create index if not exists demo_bookings_email_idx
  on public.demo_bookings (lower(work_email));
create index if not exists demo_bookings_outcome_idx
  on public.demo_bookings (outcome, slot_start desc);

-- Reminder sweeps ask "which upcoming bookings still need a reminder?".
-- Partial index keeps that scan tiny however large the history grows.
create index if not exists demo_bookings_reminders_pending_idx
  on public.demo_bookings (slot_start)
  where outcome = 'Scheduled'
    and (reminder_24h_sent_at is null or reminder_1h_sent_at is null);

drop trigger if exists demo_bookings_touch on public.demo_bookings;
create trigger demo_bookings_touch
  before update on public.demo_bookings
  for each row execute function public.touch_updated_at();

-- Booking a demo should move the originating lead along the pipeline. Done
-- here so it happens whether the booking arrived via our form or a webhook.
create or replace function public.advance_lead_on_booking()
returns trigger
language plpgsql
as $$
begin
  if new.lead_id is not null then
    update public.website_leads
       set status = 'Demo booked'
     where id = new.lead_id
       and status in ('New', 'Contacted');
  end if;
  return new;
end;
$$;

drop trigger if exists demo_bookings_advance_lead on public.demo_bookings;
create trigger demo_bookings_advance_lead
  after insert on public.demo_bookings
  for each row execute function public.advance_lead_on_booking();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.demo_bookings enable row level security;

drop policy if exists "anon may book a demo" on public.demo_bookings;
create policy "anon may book a demo"
  on public.demo_bookings
  for insert
  to anon
  with check (true);

-- No select policy: a visitor must not be able to enumerate who else booked.

-- ======================================================================
-- 003_newsletter_downloads.sql
-- ======================================================================

-- ============================================================================
-- 003 — Newsletter subscribers, gated asset downloads, rate limiting
--
-- Spec §1.2 conversions 4 and 5, and §5.3 (spam protection).
-- ============================================================================

-- ── Newsletter / compliance updates ─────────────────────────────────────────
-- Double opt-in. An address is only mailable once confirmed_at is set: an
-- unconfirmed row is a claim that someone typed an address, not permission to
-- write to it. This is both the DPDP position and the thing that keeps the
-- sending domain out of spam folders.
create table if not exists public.newsletter_subscribers (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  email               text not null,
  full_name           text,

  confirm_token       text not null unique default encode(gen_random_bytes(24), 'hex'),
  confirmed_at        timestamptz,
  unsubscribe_token   text not null unique default encode(gen_random_bytes(24), 'hex'),
  unsubscribed_at     timestamptz,

  source              text,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  ip_hash             text
);

-- Case-insensitive uniqueness: Nayan@x.com and nayan@x.com are one person.
create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

-- The send list: confirmed and not unsubscribed.
create index if not exists newsletter_subscribers_mailable_idx
  on public.newsletter_subscribers (confirmed_at)
  where confirmed_at is not null and unsubscribed_at is null;

comment on column public.newsletter_subscribers.confirmed_at is
  'Null until the double opt-in link is clicked. Never mail a row where this is null.';

-- ── Gated downloads (brochure, pricing sheet, guides) ───────────────────────
-- Deliberately NOT unique per (email, asset): the same person downloading the
-- pricing sheet three times in a week is a strong buying signal and we want to
-- see all three, not one row with a counter.
create table if not exists public.asset_downloads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  email         text not null,
  full_name     text,
  company_name  text,
  phone         text,

  asset_slug    text not null,
  asset_title   text,

  lead_id       uuid references public.website_leads(id) on delete set null,

  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  referrer      text,
  ip_hash       text
);

create index if not exists asset_downloads_email_idx
  on public.asset_downloads (lower(email), created_at desc);
create index if not exists asset_downloads_asset_idx
  on public.asset_downloads (asset_slug, created_at desc);

-- ── Rate limiting (spec §5.3: max 5 submissions per IP per hour) ────────────
--
-- Serverless functions share no memory, so an in-process counter would reset
-- on every cold start and would not be shared between concurrent instances.
-- The counter therefore has to live in the database.
create table if not exists public.rate_limit_events (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  bucket      text not null,   -- 'lead' | 'newsletter' | 'download' | 'booking'
  ip_hash     text not null
);

create index if not exists rate_limit_events_lookup_idx
  on public.rate_limit_events (bucket, ip_hash, created_at desc);

comment on table public.rate_limit_events is
  'Sliding-window counter for form endpoints. Pruned by prune_rate_limit_events(); safe to truncate.';

-- Returns true when the caller is UNDER the limit (and records the attempt),
-- false when they have exceeded it.
--
-- SECURITY DEFINER so it can be granted to anon without also granting table
-- access. search_path is pinned — without it, a caller-controlled search_path
-- could shadow the table name and make the function operate on something else.
create or replace function public.check_rate_limit(
  p_bucket   text,
  p_ip_hash  text,
  p_limit    int  default 5,
  p_window   interval default '1 hour'
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  attempts int;
begin
  select count(*) into attempts
    from public.rate_limit_events
   where bucket = p_bucket
     and ip_hash = p_ip_hash
     and created_at > now() - p_window;

  if attempts >= p_limit then
    return false;
  end if;

  insert into public.rate_limit_events (bucket, ip_hash)
  values (p_bucket, p_ip_hash);

  return true;
end;
$$;

-- Housekeeping. Call from a scheduled job (pg_cron, or a Vercel cron hitting a
-- route handler); nothing breaks if it never runs, the table just grows.
create or replace function public.prune_rate_limit_events()
returns void
language sql
as $$
  delete from public.rate_limit_events where created_at < now() - interval '2 days';
$$;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.newsletter_subscribers enable row level security;
alter table public.asset_downloads        enable row level security;
alter table public.rate_limit_events      enable row level security;

drop policy if exists "anon may subscribe" on public.newsletter_subscribers;
create policy "anon may subscribe"
  on public.newsletter_subscribers
  for insert to anon with check (true);

drop policy if exists "anon may record a download" on public.asset_downloads;
create policy "anon may record a download"
  on public.asset_downloads
  for insert to anon with check (true);

-- rate_limit_events gets no policy at all. Anon reaches it only through
-- check_rate_limit(), which runs as the definer — so a visitor can spend
-- their own quota but cannot read or forge anyone else's.
grant execute on function public.check_rate_limit(text, text, int, interval) to anon;

-- ======================================================================
-- 004_content.sql
-- ======================================================================

-- ============================================================================
-- 004 — Content: blog posts, guides, compliance calendar
--
-- Spec §3.2 (Phase 2 routes) and §8.1.
--
-- Note on timing: §8.1 says content is Markdown/MDX in the repo at launch and
-- only moves to a database when a non-developer must publish weekly. These
-- tables exist so that move is a data migration rather than a schema design
-- exercise — the Phase 1 site still renders from MDX. Nothing here is on the
-- critical path to launch.
--
-- The compliance calendar is the exception worth loading early: §3.2 flags it
-- as a strong SEO asset, and it is reference data, not editorial content.
-- ============================================================================

-- ── Authors ─────────────────────────────────────────────────────────────────
create table if not exists public.authors (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  role        text,
  bio         text,
  avatar_url  text,
  linkedin_url text,
  created_at  timestamptz not null default now()
);

-- ── Blog posts ──────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  slug          text not null unique,
  title         text not null,
  excerpt       text,
  body_mdx      text not null,
  cover_image   text,
  cover_alt     text,

  author_id     uuid references public.authors(id) on delete set null,
  category      text,
  tags          text[] not null default '{}',
  reading_minutes int,

  -- ── SEO (spec §8.4) ─────────────────────────────────────────────────────
  seo_title     text check (char_length(seo_title) <= 60),
  seo_desc      text check (char_length(seo_desc) <= 155),
  og_image      text,
  canonical_url text,

  status        text not null default 'draft'
                  check (status in ('draft', 'published', 'archived')),
  published_at  timestamptz
);

comment on column public.posts.seo_title is
  'Constrained to 60 chars in the database, not just the CMS UI — spec §8.4. Google truncates past that anyway.';

-- The public listing: published, newest first.
create index if not exists posts_published_idx
  on public.posts (published_at desc)
  where status = 'published';
create index if not exists posts_category_idx
  on public.posts (category, published_at desc)
  where status = 'published';
create index if not exists posts_tags_idx on public.posts using gin (tags);

-- ── Guides (downloadable, optionally gated) ─────────────────────────────────
create table if not exists public.guides (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  slug          text not null unique,
  title         text not null,
  description   text,
  cover_image   text,
  pdf_url       text,
  page_count    int,

  -- When true the PDF is only handed over after an email is captured into
  -- asset_downloads. asset_downloads.asset_slug references this slug.
  gated         boolean not null default true,

  seo_title     text check (char_length(seo_title) <= 60),
  seo_desc      text check (char_length(seo_desc) <= 155),

  status        text not null default 'draft'
                  check (status in ('draft', 'published', 'archived')),
  published_at  timestamptz
);

create index if not exists guides_published_idx
  on public.guides (published_at desc)
  where status = 'published';

-- ── Compliance calendar ─────────────────────────────────────────────────────
-- India statutory due dates. Reference data rather than editorial content, and
-- the single best organic-traffic asset on the Phase 2 list.
--
-- due_day + due_month model a recurring obligation (EPF ECR is the 15th of
-- every month → due_day 15, due_month null). due_date is for one-off dates
-- that do not recur on a fixed rule.
create table if not exists public.compliance_calendar (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  act           text not null,            -- 'EPF' | 'ESIC' | 'PT' | 'TDS' | ...
  obligation    text not null,            -- 'ECR filing and contribution payment'
  description   text,

  -- Null state means "applies across India". PT and LWF are state-specific,
  -- which is exactly why this column has to exist.
  state         text,

  frequency     text not null check (frequency in
                  ('Monthly', 'Quarterly', 'Half-yearly', 'Annual', 'One-time')),
  due_day       int check (due_day between 1 and 31),
  due_month     int check (due_month between 1 and 12),
  due_date      date,

  penalty_note  text,
  reference_url text,
  is_active     boolean not null default true
);

create index if not exists compliance_calendar_lookup_idx
  on public.compliance_calendar (act, state, due_month, due_day)
  where is_active;

comment on table public.compliance_calendar is
  'India statutory due dates. state is null for pan-India obligations; PT and LWF are state-specific.';

-- ── updated_at triggers ─────────────────────────────────────────────────────
drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

drop trigger if exists guides_touch on public.guides;
create trigger guides_touch before update on public.guides
  for each row execute function public.touch_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- Content is the one place where anonymous SELECT is correct — but only for
-- rows that are actually published. A draft post must not be readable just
-- because someone guessed its slug.
alter table public.authors             enable row level security;
alter table public.posts               enable row level security;
alter table public.guides              enable row level security;
alter table public.compliance_calendar enable row level security;

drop policy if exists "published posts are public" on public.posts;
create policy "published posts are public"
  on public.posts for select to anon
  using (status = 'published' and published_at <= now());

drop policy if exists "published guides are public" on public.guides;
create policy "published guides are public"
  on public.guides for select to anon
  using (status = 'published' and published_at <= now());

drop policy if exists "authors are public" on public.authors;
create policy "authors are public"
  on public.authors for select to anon using (true);

drop policy if exists "compliance calendar is public" on public.compliance_calendar;
create policy "compliance calendar is public"
  on public.compliance_calendar for select to anon using (is_active);

-- No insert/update/delete policies anywhere: authoring happens through the
-- service-role key behind an authenticated admin surface.
