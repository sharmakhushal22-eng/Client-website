# The marketing-site database — handover

**Owner:** Nayan Ahuja
**Applies to:** `www.ezerhrms.com` (this repo — `sharmakhushal22-eng/Client-website`)
**Not this:** `app.ezerhrms.com`, the HRMS product, which has its own database

Everything the website needs from Postgres is already written: 7 migrations,
774 lines of SQL, all idempotent. Nothing in here asks you to design a schema.
What it asks you to do is **provision a Supabase project, apply the migrations,
set three environment variables, and prove it works** — and it gives you a
command for that last part.

Read §1 and §2 first. They are the only sections where a wrong decision is
expensive.

---

## Contents

| § | Section |
| --- | --- |
| 1 | [Should this be a separate database?](#1-should-this-be-a-separate-database) |
| 2 | [Requirements — the contract](#2-requirements--the-contract) |
| 3 | [Setup, start to finish](#3-setup-start-to-finish) |
| 4 | [Environment variables](#4-environment-variables) |
| 5 | [Schema reference](#5-schema-reference) |
| 6 | [The security model — two gates, not one](#6-the-security-model--two-gates-not-one) |
| 7 | [Data flow: how a lead is saved](#7-data-flow-how-a-lead-is-saved) |
| 8 | [Data flow: the other four paths](#8-data-flow-the-other-four-paths) |
| 9 | [How the admin panel reads it](#9-how-the-admin-panel-reads-it) |
| 10 | [Operations](#10-operations) |
| 11 | [Failure modes and what they look like](#11-failure-modes-and-what-they-look-like) |
| 12 | [Open decisions — not ours to make](#12-open-decisions--not-ours-to-make) |

---

## 1. Should this be a separate database?

**Yes. Provision a new Supabase project for the marketing site, separate from
the HRMS product.** The schema was written on that assumption — it is stated in
the header comment of `001_leads.sql` — and the reasons are not stylistic.

**Blast radius.** The product database holds our customers' employees: names,
salaries, PAN, bank accounts, attendance. The marketing database holds people
who filled in a form asking for a demo. A marketing deploy ships weekly and is
edited by whoever is writing copy that week. Those two things should not be one
`DATABASE_URL` apart. Separate projects mean a mistake on the website cannot
reach payroll data — not "is unlikely to", *cannot*, because the credentials do
not exist in that environment.

**The security postures are opposites.** This database grants `INSERT` to
anonymous visitors and `SELECT` to nobody — anyone on the internet can add a
row and no browser key can read one back. The product database is the reverse:
every read is authenticated and tenant-scoped. Those are contradictory defaults
to hold in one project, and the contradiction is where the leak comes from.

**DPDP.** Prospect contact details and customer employee records are different
categories of personal data with different lawful bases, different retention
clocks and different deletion obligations. Keeping them in one database means
every retention or erasure question has to be answered per-table by someone who
remembers which is which.

**Operationally.** Independent backups, independent restore. If the marketing
site's database needs to be restored to last Tuesday, that must not be a
conversation about payroll. Pausing, resizing or migrating one does not touch
the other.

**The cost.** One extra project. Supabase Free covers this workload
comfortably — a few hundred rows a month and a handful of KB. Budget for Pro
(~$25/mo) only when you want daily backups and no auto-pause, which you
probably do want before this is the system of record for sales.

**The one real argument against**, so you can weigh it: two projects means two
dashboards, two sets of credentials and two things to remember to back up. If
that is genuinely the blocker, the *acceptable* compromise is one project with
a dedicated `marketing` schema and a role that can only see it — **not** both
sets of tables sitting in `public` together. But the migrations here all target
`public`, so that path costs a rewrite. Separate project is cheaper and safer.

> **Do not point this site at the old project.**
> `jcdbrungkfmnysnspbzh.supabase.co` no longer resolves — it was deleted or
> expired. Every reference to it is stale. Since it went away the site has been
> running with **no database at all**: enquiries are validated, emailed if mail
> is configured, and then dropped. There is no backlog of leads waiting in it to
> recover. Assume everything submitted since is lost.

---

## 2. Requirements — the contract

These are the properties the site depends on. `npm run db:verify` asserts
every one of them; if it exits 0 the site works.

**R1 — An anonymous visitor can insert into the four capture tables.**
`website_leads`, `demo_bookings`, `newsletter_subscribers`, `asset_downloads`.
If this fails, the enquiry form shows "something went wrong" to real customers.

**R2 — No browser-side key can read any of them.**
`SELECT` is withheld from `anon` on all four, *and* there is no `SELECT` policy.
The publishable key is public by design — assume it is already scraped. The
worst it may do is add junk rows.

**R3 — `service_role` has full access to everything.**
That key is the admin panel's identity. Without it the panel renders
"permission denied" instead of the lead list.

**R4 — Anonymous visitors can `SELECT` published content only.**
`posts`, `guides`, `authors`, `compliance_calendar`, narrowed by RLS to
`status = 'published' and published_at <= now()`. A draft blog post must not be
readable by guessing its slug.

**R5 — `check_rate_limit()` is callable by `anon` and is `SECURITY DEFINER`.**
It counts rows in `rate_limit_events`, which `anon` deliberately cannot touch
directly. Serverless functions share no memory, so the counter has to live in
Postgres or it is not a limiter at all.

**R6 — Status changes are recorded by trigger, not by application code.**
So a status changed by hand in the Supabase table editor still lands in
`lead_status_history`. The response-time and funnel numbers depend on it.

**R7 — Raw IP addresses are never stored.** Only `ip_hash`, a salted SHA-256.

**R8 — Every migration is idempotent.** `create ... if not exists`,
`drop policy if exists`. Re-running the whole set is always safe, and is the
standard fix for most problems.

**Non-requirements**, so you do not build them: no Supabase Auth users (the
admin panel has its own signed-cookie session), no realtime, no storage buckets,
no edge functions. The site talks to PostgREST over HTTPS and nothing else.

---

## 3. Setup, start to finish

### 3.1 Create the project

Supabase → New project.

| Setting | Value | Why |
| --- | --- | --- |
| Name | `ezer-marketing` | distinguishable from the product project at a glance |
| Region | **South Asia (Mumbai) · `ap-south-1`** | the app runs in Vercel `bom1`; anywhere else adds a round trip to every form submit, and the privacy policy tells visitors their data is processed in India |
| Password | generate and store in the password manager | you need it for `DATABASE_URL`; it is not recoverable, only resettable |
| Plan | Free to start | see §1 on when to move to Pro |

### 3.2 Apply the migrations

```bash
git clone https://github.com/sharmakhushal22-eng/Client-website.git
cd Client-website
npm install
```

Put the connection string in `.env.local`:

```
DATABASE_URL=postgresql://postgres.<ref>:<password>@<region>.pooler.supabase.com:5432/postgres
```

Take it from **Project Settings → Database → Connection string → Session
pooler**. Use the pooler URI, not the direct one — `db.<ref>.supabase.co`
publishes an **AAAA record only**, so on a network without IPv6 it simply does
not resolve. Note the username is `postgres.<ref>`, not `postgres`, and the
region in the hostname must be copied exactly rather than guessed.

```bash
npm run db:push
```

No database password to hand? Dump the SQL and paste it into the dashboard's
SQL editor instead:

```bash
npm run db:push -- --print
```

### 3.3 Prove it works

```bash
npm run db:verify
```

This is the step that matters. `db:push -- --check` only answers "did the
tables get created", which is not the same question as "does the site work" —
a database can have every table and still drop every enquiry, because RLS and
`GRANT`s are two separate gates and both must line up. That exact bug is why
migrations 005 and 006 exist.

`db:verify` asserts behaviour, not shape. It opens a transaction, becomes the
`anon` role, actually inserts a lead, actually tries to read it back, checks
the owner can see what anon wrote, and rolls the whole thing back. It leaves
nothing behind and changes no schema. Expect:

```
  ✓ anon can submit an enquiry
  ✓ anon cannot read enquiries back
  ✓ the owner role can read what anon wrote
  ✓ the test row was rolled back (nothing left behind)

  N checks passed. The database meets its contract.
```

Run it against production too, not just locally. It is safe.

### 3.4 Wire it to the live site

Vercel → project `ezer-hrms-website` → Settings → Environment Variables →
**Production**, then redeploy. See §4 for exactly which three.

Until this is done the site runs as it does today: the admin panel says
"cannot read the database", and enquiries are not saved.

---

## 4. Environment variables

From **Supabase → Project Settings → API keys**.

| Variable | Value | Set where | If missing |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | Vercel + local | nothing is saved; forms show "temporarily unavailable" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publishable key (`sb_publishable_…`) | Vercel + local | as above |
| `SUPABASE_SERVICE_ROLE_KEY` | **secret** key (`sb_secret_…`) | Vercel + local | leads are saved, but the admin panel cannot read them, and the blog CMS cannot write |
| `IP_HASH_SALT` | any long random string | Vercel + local | falls back to a weak default; IP hashes become guessable |
| `DATABASE_URL` | session pooler URI | **local only** | `db:push` / `db:verify` will not run |
| `BOOKING_WEBHOOK_SECRET` | a long random string, also pasted into the calendar provider | Vercel | `/api/webhooks/booking` returns 503 and demo bookings are never stored |
| `NEXT_PUBLIC_CALENDAR_URL` | the cal.com / Calendly embed URL | Vercel | `/book-a-demo` shows the qualifying form instead of a calendar |

`DATABASE_URL` is for migrations and verification from a laptop. **Do not put
it in Vercel.** The app never uses it in production — it reaches Supabase over
HTTPS/IPv4 via PostgREST, and the direct Postgres host is IPv6-only anyway.

The three keys must all come from **the same project**. A service key from one
project against a URL from another produces a confusing "fetch failed" rather
than an auth error.

> **`SUPABASE_SERVICE_ROLE_KEY` bypasses RLS completely.** It is the whole
> database in one string. It belongs in Vercel's encrypted environment
> variables and a password manager — never in the repo, a ticket, a chat
> message, or a screenshot. The repo is **public**.

---

## 5. Schema reference

11 tables in `public`. Full definitions with commentary live in
`supabase/migrations/`; this is the map.

### 5.1 `website_leads` — the important one

Every enquiry from every form on the site. One row per submission.

| Group | Columns | Notes |
| --- | --- | --- |
| Identity | `full_name`, `work_email`, `phone`, `company_name` | email, phone and company are `not null`; `full_name` is collected on the long form only, because the short form is deliberately three fields |
| Qualification | `employee_band`, `designation`, `city`, `state`, `currently_using`, `modules_interest[]`, `timeline`, `message` | `employee_band` is the single best qualifier collected |
| Consent | `consent`, `consent_at`, `consent_text` | the exact wording shown is stored, because "we had consent" is only defensible if you can say what the person agreed to |
| Attribution | `utm_source/medium/campaign/term/content`, `gclid`, `fbclid`, `referrer`, `landing_page`, `form_name` | without this you cannot tell which spend works |
| Request | `ip_hash`, `user_agent` | hash only, never the raw IP |
| Pipeline | `status`, `owner`, `next_action_date` | `status` ∈ New · Contacted · Demo booked · Demo done · Proposal · Won · Lost |
| Reporting | `first_contacted_at` | stamped by trigger the first time status leaves `New`; denormalised so the median-response-time report is one scan, not a join per lead |
| Delivery | `autoreply_sent_at`, `internal_notified_at`, `crm_synced_at` | `null` means that notification never went out — which is exactly what you want to query after a mail outage |
| Spam | `is_spam` | set by hand; nothing writes it automatically |

The enumerated columns are `CHECK` constraints, not Postgres enums —
deliberately, because these lists will change as sales changes its process and
an enum needs an `ALTER TYPE` to grow.

Indexes: `created_at desc` (the default list view), `(status, created_at desc)`
(filtered views), `(owner, next_action_date)` (my-leads), `(ip_hash,
created_at desc)` (rate limiting), `(utm_source, created_at desc)` (campaign
reporting).

### 5.2 The rest

| Table | Holds | Written by |
| --- | --- | --- |
| `lead_notes` | free-text notes against a lead | admin panel |
| `lead_status_history` | every status transition | **trigger**, never application code |
| `demo_bookings` | booked demo slots, outcome, reminder stamps | booking form / scheduler webhook |
| `newsletter_subscribers` | email + double-opt-in and unsubscribe tokens | footer form |
| `asset_downloads` | who downloaded which gated asset | download form |
| `rate_limit_events` | `(bucket, ip_hash, created_at)` counters | `check_rate_limit()` only |
| `posts` | blog posts written in `/admin/posts` | admin panel |
| `guides`, `authors`, `compliance_calendar` | Phase 2 content | nothing yet |

### 5.3 Functions and triggers

| Object | Does |
| --- | --- |
| `check_rate_limit(bucket, ip_hash, limit, window)` | counts recent events, records this one, returns `false` when over. `SECURITY DEFINER` — `anon` calls it but cannot touch the table it reads |
| `prune_rate_limit_events()` | housekeeping. Rows age out of each window on their own, so this is tidiness, not correctness |
| `touch_updated_at()` | `updated_at = now()` on update |
| `log_lead_status_change()` | appends to `lead_status_history` and stamps `first_contacted_at`. In a trigger so a change made in the Supabase table editor is still recorded |
| `advance_lead_on_booking()` | moves a linked lead to `Demo booked`, only from `New`/`Contacted` |

---

## 6. The security model — two gates, not one

This is the part that bites people, so it is worth being explicit.

**A request must pass both `GRANT` and RLS.** They are independent:

- **`GRANT`** decides whether a role may touch the table *at all*.
- **RLS policy** decides *which rows*.

Supabase grants privileges automatically for tables created through the
dashboard. Tables created by running SQL directly — which is how these were
made — **do not** pick them up. So a correct RLS policy plus a missing `GRANT`
gives you `permission denied for table website_leads` on a form that looks
perfectly configured. Migration **005** fixes that for `anon`, **006** for
`service_role`. Both end with a `DO $$` block that raises and fails the
migration if the grants did not land, rather than leaving a silently broken
form to be found by a real customer.

The posture, in one table:

| Role | Capture tables | Internal tables | Content tables |
| --- | --- | --- | --- |
| `anon` | `INSERT` only | nothing | `SELECT` published rows only |
| `authenticated` | same as `anon` | nothing | same as `anon` |
| `service_role` | everything | everything | everything |

There is deliberately **no** `SELECT`, `UPDATE` or `DELETE` policy on the
capture tables. With RLS enabled and no policy, those operations return zero
rows. Withholding the `SELECT` privilege as well is the belt to that braces:
even a policy added by mistake later cannot expose leads to a browser key.

**`anon` is a public key.** It ships in the JavaScript bundle. Assume it is
already extracted. The design assumes that and gives it nothing worth having.

---

## 7. Data flow: how a lead is saved

A visitor submits the hero form, the long enquiry form, or any CTA band. All of
them post to one server action: `submitLead` in `app/actions/leads.ts`.

```
Browser (form, no JS required)
   │  POST — a Next.js server action, same origin
   ▼
submitLead()                                       app/actions/leads.ts
   │
   ├─ 1. Honeypot + time trap ......................... lib/spam.ts
   │     A hidden field that only a bot fills, and a rendered-at timestamp.
   │     A hit returns SUCCESS and writes nothing — a bot told it was blocked
   │     retunes and retries; one told it succeeded usually stops.
   │
   ├─ 2. Server-side validation ...................... lib/validation.ts
   │     Email, phone, company, consent, and every select re-checked against
   │     its allowed list. A <select> is trivially edited in devtools, and the
   │     CHECK constraints would otherwise reject the whole insert.
   │     On failure: field-level errors AND every typed value echoed back, so
   │     a failed submit never loses what the person wrote.
   │
   ├─ 3. Rate limit ....................... check_rate_limit('lead', …, 5, 1h)
   │     Counted in POSTGRES, not in memory. Serverless instances share no
   │     memory, so an in-process Map limits one instance and nothing else.
   │     FAILS OPEN: if the check errors, the submission proceeds. Losing a
   │     real lead is worse than letting spam through, and layers 1, 2 and 4
   │     are still standing.
   │
   ├─ 4. Cloudflare Turnstile ......................... lib/spam.ts
   │     Skipped entirely when TURNSTILE_SECRET_KEY is unset — see §12.
   │
   ├─ 5. Build the row
   │     + UTM/gclid/fbclid/referrer/landing_page from the attribution cookie
   │     + ip_hash = sha256(client IP + IP_HASH_SALT)
   │     + consent_at = now(), consent_text = the exact sentence shown
   │
   ├─ 6. INSERT INTO website_leads          ◀── THE LEAD IS SAVED HERE, FIRST
   │     Before any third-party call. A failing mail provider must never lose
   │     a lead. On error the visitor is told nothing was lost and asked to
   │     retry or call — and the error is logged.
   │
   ├─ 7. Auto-reply to the enquirer  ┐ concurrent, best-effort
   │     Internal notification       ┘ neither can fail the submission
   │
   └─ 8. UPDATE the row with autoreply_sent_at / internal_notified_at
         So "which leads did nobody get notified about" stays a query.
         Needs the row id, so this step runs only on the secret key.
```

**Why the insert comes before the email.** Notification is recoverable — you
can look at the table and chase it. A lost lead is not recoverable, because
nobody knows it existed.

**Why the row id needs the secret key.** Asking PostgREST to return the
inserted row requires `SELECT` privilege, which the publishable key
deliberately does not have (R2). So on the publishable key alone the site does
a plain insert and skips the delivery stamps. **The lead is saved either way** —
only the bookkeeping in step 8 is lost. This is why `SUPABASE_SERVICE_ROLE_KEY`
is listed as required rather than optional.

---

## 8. Data flow: the other four paths

**Newsletter** → `newsletter_subscribers`. Rate-limited on the `newsletter`
bucket. A duplicate address (Postgres `23505`) is reported to the visitor as
success, not as "already subscribed" — the latter confirms to a stranger that a
given address is in our database. Double-opt-in and unsubscribe tokens are
generated by column default; the confirm/unsubscribe flows are not built yet.

**Gated download** → `asset_downloads`, `download` bucket.

**Demo booking** → `demo_bookings`, via `POST /api/webhooks/booking`.

Two things are required, and people set only the first. `NEXT_PUBLIC_CALENDAR_URL`
embeds the calendar on `/book-a-demo`, and that is *all* it does — the booking is
then created inside cal.com or Calendly. Without the webhook it never reaches us
and the table stays empty forever.

Configure it in the provider (cal.com → Settings → Developer → Webhooks, or
Calendly → Integrations → Webhooks):

- URL: `https://www.ezerhrms.com/api/webhooks/booking`
- Secret: the same value as `BOOKING_WEBHOOK_SECRET` in Vercel
- Events: booking created, rescheduled, cancelled

The endpoint **fails closed**: with no secret it returns 503 and writes nothing.
That is the opposite of the form limiter, which fails open — losing an enquiry is
worse than admitting spam, but an unauthenticated writer is not a degraded
service, it is an open door. Signatures are compared with `timingSafeEqual`, and
Calendly's timestamped signatures older than five minutes are refused so a
captured request cannot be replayed. Authentic events we do not store return 200,
because a 4xx makes providers retry forever and eventually disable the hook.

Every write is an upsert on `provider_booking_uid`, which 002 made `unique` for
exactly this: providers retry generously, and a duplicate delivery must update
the row rather than create a second booking for the same slot. Bookings are
matched to an existing lead by email, which fires `advance_lead_on_booking()` —
but only when the booking carries a `lead_id` and the lead is still `New` or
`Contacted`, so it never overwrites a status sales has already moved on.
`lead_id` is nullable because someone can book straight from the calendar embed
without ever submitting a form; those are reconciled by email.

**Blog post** → `posts`, written by the admin at `/admin/posts` on the secret
key, read by the public blog on the publishable key under the "published posts
are public" policy.

The public blog has a **permanent floor**: three articles compiled into
`content/articles.ts` that render with no database, no configuration and no
network. Database posts merge in front of them and win on a slug collision.
Every database path is wrapped, and the query is capped at 4 seconds — measured
against an unreachable host it sat for 7.1s per request, against 0.05–0.6s for
every other page. So losing the database loses the *new* posts, never the blog.

---

## 9. How the admin panel reads it

`/admin` — signed-cookie session (HMAC-SHA256, 8h), no Supabase Auth involved.
Credentials are `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` (scrypt) +
`ADMIN_SESSION_SECRET`. Login attempts are throttled through the same
`check_rate_limit()`, bucket `login`, 8 per 15 minutes — shared across
serverless instances for the same reason the form limiter is.

| Page | Reads |
| --- | --- |
| `/admin` | counts across all tables |
| `/admin/leads` | `website_leads`, newest first, filterable by status |
| `/admin/leads/[id]` | one lead + its notes + its status history |
| `/admin/leads/export` | CSV |
| `/admin/bookings`, `/subscribers`, `/downloads` | those tables |
| `/admin/posts` | `posts` — create, edit, publish, unpublish |
| `/admin/content` | `guides`, `authors`, `compliance_calendar`, read-only |

All of it goes through `lib/admin/db.ts`, which takes whichever route is
configured:

1. **`SUPABASE_SERVICE_ROLE_KEY`** → PostgREST over HTTPS/IPv4. **Preferred**,
   and the only one that works on Vercel.
2. **`DATABASE_URL`** → direct Postgres. Full SQL, but IPv6-only unless you use
   the pooler. Intended for local work.

With neither, every page renders a diagnostic naming the missing variables —
because an admin panel that silently shows "no leads" when it merely cannot
read them is worse than one that says so.

---

## 10. Operations

**Backups.** Free tier gives you very little. Before this is the system of
record for sales, either move to Pro (daily backups, 7-day PITR) or schedule
`pg_dump` somewhere. A lead table with no backup is a resignation letter.

**Auto-pause.** Free projects pause after ~7 days idle. A paused project is
indistinguishable from a deleted one from the site's point of view: forms fail,
the admin shows the connection diagnostic. This is a real risk for a marketing
database that goes quiet over a holiday. Pro does not auto-pause.

**Pruning.** `select public.prune_rate_limit_events();` occasionally. Rows age
out of each window on their own, so this is disk tidiness, not correctness.

**After any schema change:** `npm run db:push && npm run db:verify`.

**Adding a migration:** next number, `008_*.sql`, idempotent, and end it with a
`DO $$` block that raises if the thing you intended did not happen. 005 and 006
are the pattern. Never edit an applied migration — add a new one.

**New table checklist:** enable RLS, add the policy, add the `GRANT`
(migration 006's `alter default privileges` covers `service_role` for anything
created by the migration role from here on, but `anon` still needs an explicit
grant), then add it to the arrays at the top of `scripts/verify-db.mjs` so it
is covered by `db:verify`.

---

## 11. Failure modes and what they look like

| Symptom | Cause | Fix |
| --- | --- | --- |
| `permission denied for table website_leads` on submit | RLS policy present, `GRANT` missing | `npm run db:push` (005) |
| Admin shows `42501 permission denied` | `service_role` grants missing | `npm run db:push` (006) |
| Admin: "cannot read the database" | no `SUPABASE_SERVICE_ROLE_KEY` and no `DATABASE_URL` | §4 |
| Admin: "the database did not answer" / `TypeError: fetch failed` | project paused, deleted, or URL wrong | check the project exists; check the URL matches the key |
| `ENOTFOUND db.<ref>.supabase.co` | IPv6-only host, no IPv6 route | use the **session pooler** URI |
| `Tenant or user not found` | wrong region in the pooler hostname | copy the exact URI from the dashboard; do not assemble it |
| `password authentication failed` | wrong password in `DATABASE_URL` | Project Settings → Database → Reset database password |
| Blog shows only 3 articles | database unreachable — this is the designed fallback | fix the connection; the blog was never down |
| Every submission "rate limited" | `check_rate_limit` missing or not `SECURITY DEFINER` | `npm run db:push`, then `db:verify` |
| Forms work, admin list empty | running on the publishable key only | add `SUPABASE_SERVICE_ROLE_KEY` |

---

## 12. Open decisions — not ours to make

These are business or legal calls. They are listed because they are load-bearing
and currently unanswered, not because they block setup.

1. **Lead retention period.** DPDP requires personal data not be kept longer
   than necessary. Nothing here expires. `/privacy-policy` currently publishes
   `[retention period to be confirmed]` to the public. Once someone decides the
   period, a `008_retention.sql` with a purge function is a ten-line migration —
   but the number is not a developer's to invent.

2. **`TURNSTILE_SECRET_KEY` is unset, and the check fails open.** With no
   secret, `verifyTurnstile()` returns ok. Layers 1–3 still stand, so the form
   is not defenceless, but layer 4 is currently decorative.

3. **Grievance Officer.** `/privacy-policy` ships six visible
   `[… to be confirmed]` gaps. A named officer with contact details is a DPDP
   requirement.

4. **`ADMIN_SESSION_SECRET` is shared between local and production.** A session
   cookie minted from the value in a developer's `.env.local` authenticates
   against the live site. Generate a distinct value for Production.

5. **Erasure requests.** No implemented path for "delete my data". A lead is a
   row in one table plus cascading notes and history, so it is a `DELETE` —
   but who is allowed to run it, and how it is recorded, is undecided.

---

## Quick reference

```bash
npm run db:push              # apply all migrations (idempotent, safe to repeat)
npm run db:push -- --print   # dump the SQL to paste into the dashboard editor
npm run db:push -- --check   # list which tables exist, apply nothing
npm run db:verify            # assert the full contract — run this after any change
```

| File | What |
| --- | --- |
| `supabase/migrations/001_leads.sql` | leads, notes, status history, triggers, RLS |
| `supabase/migrations/002_demo_bookings.sql` | bookings + `advance_lead_on_booking()` |
| `supabase/migrations/003_newsletter_downloads.sql` | subscribers, downloads, `check_rate_limit()` |
| `supabase/migrations/004_content.sql` | posts, guides, authors, compliance calendar |
| `supabase/migrations/005_grants.sql` | `anon` privileges + assertion |
| `supabase/migrations/006_service_role_grants.sql` | `service_role` privileges + assertion |
| `supabase/migrations/007_login_throttle_bucket.sql` | documents the `login` bucket |
| `scripts/apply-migrations.mjs` | the `db:push` runner |
| `scripts/verify-db.mjs` | the `db:verify` contract check |
| `app/actions/leads.ts` | the write path (§7) |
| `lib/admin/db.ts` | the admin read path (§9) |
| `lib/supabase/server.ts` | client construction, key selection |
| `lib/spam.ts` | honeypot, timing, rate limit, Turnstile |
| `DEPLOY.md` | hosting, domains, DNS |
