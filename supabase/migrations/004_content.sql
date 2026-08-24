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
