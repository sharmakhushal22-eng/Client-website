# EZER HRMS — marketing & enquiry website

The public site that sits in front of the HRMS product. It does three jobs and
is judged on them: **explain** the product, **convince** the visitor it is
credible, and **capture** them as a demo booking, callback or enquiry.

Built to `EZER_HRMS_WEBSITE_REQUIREMENTS.md` (v1.0). Section references
throughout the code point back to it.

> **This is not the product.** It is a separate Next.js app, a separate Vercel
> project and a **separate Supabase database**. A marketing deploy must never be
> able to break the payroll app — §12.7.

---

## Quick start

```bash
npm install
cp .env.local.example .env.local     # then fill it in — see below
npm run db:push                      # apply migrations to your new Supabase project
npm run dev
```

The site runs without any environment variables at all — forms will report that
they are unavailable rather than crash, and the booking calendar falls back to
the qualifying form. That is deliberate, so a fresh clone is never broken.

---

## Before this can go live

Two things gate launch. Neither is code.

### 1. Fill in `site.config.ts`

Every business fact on the site lives in that one file. Search it for `TODO`:

| What | Why it matters |
|---|---|
| Sales/support/partner mailboxes | Phone and WhatsApp are set (+91 87967 46222). Email stays hidden sitewide until `contact.emailsLive` is true — see below |
| Registered entity name, CIN, GSTIN, address | §4.8 — Indian B2B buyers check before a first call |
| Named grievance officer | **Legally required** under the DPDP Act 2023 (§8.7) |
| Per-employee price, minimum headcount, annual discount | The rate is set via `PRICE_PER_EMPLOYEE` in `.env.local`, never in source — this repo is public. The handoff flags the current figure as unconfirmed; settle it before launch, then set `pricing.disclosed = true` |
| Trust-bar numbers (`trust.stats`) | §4.1 §3 — use real numbers, never invented logos |
| Cal.com / Calendly URL | Leave blank and `/book-a-demo` still captures the lead |

### 2. Produce the content that is currently held back

The site is written to **hide** unfinished content rather than ship a
placeholder, because §11 will not pass with "no lorem ipsum, no placeholder
screenshots". These sections render nothing until you supply the real thing:

- **Testimonials** (`content/home.ts`) — hidden while `published: false`.
- **ROI outcomes** (`content/home.ts`) — hidden while the values are `TODO`.
  §4.1 §10: "Must be defensible; do not invent."
- **Team photos** (`app/about/page.tsx`) — same pattern.
- **Product screenshots** — `ScreenshotFrame` renders a clearly-unfinished
  placeholder instead of a fabricated dashboard. Per §9, build a demo company
  with fictional names, salaries and PAN/Aadhaar values *first*, then drop the
  images in and set `src` in `content/home.ts` and `content/features.ts`.
- **Legal pages** — three drafts, each showing an on-page "pending legal
  review" banner. A lawyer reviews them, then you pass `needsReview={false}`.
- **Statutory rates** (`content/statutory.ts`) — have whoever owns compliance
  verify every rate and ceiling. A wrong figure here gets quoted back at you.

---

## Environment

See `.env.local.example` for the annotated list. The ones that matter:

| Variable | Effect if missing |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` + either key | Forms report unavailable instead of saving |
| `SUPABASE_SERVICE_ROLE_KEY` | Writes still work on the publishable key; only reads (the future lead inbox) need this |
| `DATABASE_URL` | `npm run db:push` cannot run (use `-- --print` instead) |
| `RESEND_API_KEY` **or** `GMAIL_USER`+`GMAIL_APP_PASSWORD` | Lead still saves; both emails are skipped. Verify with `npm run email:test you@example.com` |
| `IP_HASH_SALT` | Falls back to a dev salt — **set this in production** |
| `TURNSTILE_SECRET_KEY` | CAPTCHA layer skipped; the other three still apply |
| `NEXT_PUBLIC_CALENDAR_URL` | `/book-a-demo` shows the form without a calendar |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID` | Analytics disabled entirely |

`SUPABASE_SERVICE_ROLE_KEY` is server-only. `lib/supabase/server.ts` imports
`server-only`, so the **build fails** if anyone imports it into a client
component — it cannot leak to the browser by accident (§8.7).

---

## Database

A **new Supabase project**, separate from the HRMS one. Four migrations in
`supabase/migrations/`:

| File | Tables |
|---|---|
| `001_leads.sql` | `website_leads`, `lead_notes`, `lead_status_history` |
| `002_demo_bookings.sql` | `demo_bookings` |
| `003_newsletter_downloads.sql` | `newsletter_subscribers`, `asset_downloads`, `rate_limit_events` |
| `004_content.sql` | `authors`, `posts`, `guides`, `compliance_calendar` |

Apply them with `npm run db:push` — it uses the `pg` driver directly, so it
needs neither `psql` installed nor an interactive `supabase login`. It reads
`DATABASE_URL` from `.env.local`.

`npm run db:push -- --check` lists which tables exist without changing
anything; `npm run db:push -- --print` dumps the SQL to paste into the
dashboard SQL editor. Every migration is idempotent, so re-running is safe.

**RLS posture** (§8.7): anonymous visitors may `INSERT` into the lead,
booking, subscriber and download tables and may `SELECT` **only published**
content rows. There is no read policy on any lead table — so even if the anon
key leaks (it is public; assume it will), no enquiry can be read from a
browser. Reads happen server-side through the service-role key.

`004_content.sql` is ahead of the site: §8.1 says content stays as MDX in the
repo at launch. The tables exist so that move is later a data migration rather
than a schema design exercise. The compliance calendar is worth loading early —
§3.2 flags it as the strongest organic-traffic asset on the Phase 2 list.

---

## What is built

All of Phase 1 (§10):

```
/                      Home — all 14 sections in §4.1 order
/features              Hub — 8 groups, 40 modules
/features/payroll      + statutory table, worked payslip, auditability (§4.3)
/features/attendance
/features/recruitment
/features/ess
/features/claims
/pricing               one plan + Enterprise · monthly/annual toggle · headcount calculator
/about                 Story · EZER pillars · company details
/contact               Full enquiry form · sales/support/partner routes · map
/book-a-demo           Qualifying form → calendar embed
/thank-you             noindex · conversion tracking fires here
/privacy-policy /terms /cookie-policy
404 · sitemap.xml · robots.txt · OG image · favicon
```

### Email (§5.4 items 2–3)

Two providers, first one configured wins:

1. **Resend** — `RESEND_API_KEY` + `EMAIL_FROM`. Spec §6's recommendation. The
   domain in `EMAIL_FROM` must be verified in Resend.
2. **Gmail SMTP** — `GMAIL_USER` + `GMAIL_APP_PASSWORD`, the same mechanism the
   HRMS product already uses, so you can reuse existing credentials. The App
   Password is a 16-character Google credential, not the account password.

Neither configured? Leads still save — only the notifications are skipped.
That ordering is deliberate (§5.4 item 1): the row is committed before any
third-party call, so a mail outage can never cost a lead.

```bash
npm run email:test -- --check          # report configuration, send nothing
npm run email:test you@example.com     # send one real test message
```

> The internal notification goes to `contact.salesEmail` in `site.config.ts`,
> which is still `sales@ezerhrms.com`. Point it at a mailbox someone actually
> watches before launch, or the alerts go nowhere.

### Admin panel (§7)

`/admin` — sign-in, lead inbox with the §7 status pipeline, per-lead notes and
history, demo bookings, subscribers, downloads, content tables, and CSV export.

```bash
npm run admin:password              # generate a password, print it once
npm run admin:password -- 'my pw'   # or hash one you chose
```

Auth is a scrypt password hash plus an HMAC-signed, httpOnly session cookie —
no user table, no third-party auth. `proxy.ts` gates `/admin/*`, and every
page *also* calls `requireAdmin()`, because a matcher typo must not be the only
thing standing between the internet and every lead in the database.

> **The hash uses `:` separators, not `$`.** Next loads `.env` through dotenv,
> which expands `$VAR` — a `scrypt$salt$hash` value arrives in the process as
> the literal string `"scrypt"`, and every login fails with no clue why.

**Reading data needs elevated access.** The publishable key can insert but
never select (that is the point of §8.7), so the panel needs one of:

| | |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY=sb_secret_…` | **Preferred.** HTTPS over IPv4 — works locally and on Vercel |
| `DATABASE_URL` | Direct Postgres. `db.<ref>.supabase.co` is **IPv6-only**; use the Session pooler URI on IPv4 networks |

With neither, every page renders the reason instead of an empty table — "no
leads yet" and "I cannot read the leads" must never look the same.

### Lead capture (§5)

The submit path in `app/actions/leads.ts` follows §5.4 exactly: **the lead row
is committed before any third-party call**, so a mail or CRM outage can never
lose a lead. The auto-reply and the internal notification run concurrently
afterwards, and their success is stamped back onto the row — which makes "which
leads did nobody get notified about" a query rather than a guess.

Four layers of spam protection (§5.3), cheapest first:

1. **Honeypot** — a field named `company_website`, off-screen and
   `aria-hidden`. Named plausibly, because a bot skips a field called
   `honeypot`.
2. **Time trap** — rejects submissions under 3 seconds. The timestamp is
   stamped on the **client after mount**, not at render: on a statically
   generated page a render-time timestamp is the *build* time, which would let
   every bot through.
3. **Rate limit** — 5 per IP per hour, counted in Postgres because serverless
   instances share no memory. **Fails open**: losing a real lead is worse than
   letting spam through, and three other layers still stand.
4. **Turnstile** — invisible, skipped entirely when unconfigured.

A rejected bot is told it **succeeded**. One told it was blocked retunes and
retries; one told it worked usually stops.

IP addresses are stored as a salted SHA-256 hash, never raw — enough to rate
limit, not a stored identifier to justify under DPDP.

### Attribution (§5.2)

Captured on **first landing** into `sessionStorage`, not at submit time — by
the time someone fills in a form the UTM query string is long gone. First-touch
is kept deliberately: it answers "which campaign produced this lead", which is
the question the ad spend exists to answer.

### Cookie consent (§8.7)

The banner **genuinely gates** the scripts. GA4 and Clarity are created in JS
on accept; there is no dormant tag in the tree waiting to be switched on. A
visitor who declines converts silently, which is correct.

---

## Design

Palette matches the product (§8.2) so a demo does not feel like a different
company — `#7C3AED` purple, `#1E1B4B` navy, `#F5B800` gold accent. The logo
mark, the `ezer hrms` wordmark, the "India's Intelligent HR Platform" tagline,
the EZER pillars and the three trust badges are all lifted from the product's
own login screen rather than invented here.

Typeface is **DM Sans**, matching the app, self-hosted via `next/font`.

Light theme only — dark mode is explicitly not required at launch.

Mobile-first (§8.6): designed at 360px, because most Indian B2B traffic is
mobile. Wide tables scroll inside their own container so the page body never
scrolls sideways.

Accessibility (§8.5): one `<h1>` per page, skip-to-content link, labels tied to
every input, `role="alert"` on errors, visible `:focus-visible` rings, no
information carried by colour alone, and `prefers-reduced-motion` honoured —
the FAQ accordion is `<details>`/`<summary>`, so it needs no JS and its answers
are in the HTML for crawlers even when collapsed.

---

## Verified

```
✓ All 19 routes return 200; unknown paths 404
✓ Every title ≤ 60 chars, every description ≤ 155 (§8.4)
✓ Exactly one <h1> per page
✓ Organization, SoftwareApplication, FAQPage, BreadcrumbList JSON-LD present
✓ Canonicals on every page; /thank-you noindex and out of the sitemap
✓ CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy all served
✓ 'unsafe-eval' present in dev only, absent in production
✓ Service-role key absent from every client chunk
✓ No analytics script in the HTML before consent
✓ Honeypot, time-trap and UTM fields present in forms
✓ Consent checkbox unticked by default
✓ Home page 942 KB uncompressed — inside the 1.2 MB budget (§8.3)
✓ `npm run build`, `npx tsc --noEmit` and `npx eslint .` all clean
```

**Not yet verified — needs the real environment:** an end-to-end form submit
against a live Supabase project, the auto-reply and internal notification
actually arriving, a calendar booking producing a real invite, and Lighthouse
on deployed hardware. These are the first four items on the §11 launch
checklist and all need credentials this build does not have.

---

## Deploying

Separate Vercel project from the HRMS app (§8.1). `vercel.json` pins the
`bom1` (Mumbai) region so server actions run close to Indian visitors and to
the database.

Set `NEXT_PUBLIC_SITE_URL` to the canonical host and decide `www` vs apex,
301-ing one to the other (§8.4).
