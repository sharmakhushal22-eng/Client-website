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
