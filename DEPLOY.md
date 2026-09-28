# EZER marketing site — deploy runbook

Two properties, one domain, **separate hosts** (the "Option A" split):

| Host | Serves | Repo | Vercel project |
| --- | --- | --- | --- |
| `www.ezerhrms.com` | this marketing site | `sharmakhushal22-eng/Client-website` | `ezer-hrms-website` |
| `ezerhrms.com` | redirect → `www` | — | (same project) |
| `app.ezerhrms.com` | the HRMS product | `sharmakhushal22-eng/ezer-hrms` | `ezer-hrms` (already live) |

Both projects live in the Vercel team **`khushal-sharma-s-projects`**, which is
where `ezer-hrms` already was — one billing and access boundary for both.

Why separate hosts rather than one hostname split by path: both apps own `/api`,
the product authenticates with Supabase cookies, and this site sends
`X-Frame-Options: DENY` plus a strict CSP on every response. Two origins keep
those boundaries clean and need no code change — `site.url` and `appUrl` in
`site.config.ts` already assume exactly this shape.

---

## 1. Create the Vercel project

Vercel → **Add New → Project** → import `sharmakhushal22-eng/Client-website`.

- **Framework**: Next.js (auto-detected)
- **Production branch**: ⚠ set this deliberately. All current work is on
  `Demo`; `main` is stale and predates it. Either point production at `Demo`,
  or merge `Demo` → `main` first and use `main`.
- **Region**: already pinned to `bom1` (Mumbai) by `vercel.json` — closest to
  the audience, and it keeps request data in India, which is what the privacy
  policy tells visitors.

Put it in the **same Vercel account/team as `ezer-hrms`**, so both properties
sit under one billing and access boundary.

---

## 2. Environment variables

Set in Vercel → Settings → Environment Variables (Production **and** Preview).

**Nothing here is required for the site to boot.** Every one of these gates a
feature: leave it unset and that feature stays dormant rather than breaking.
That is deliberate — see the notes in `site.config.ts`.

| Variable | Set it to | If unset |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.ezerhrms.com` | falls back to the same value — safe either way |
| `NEXT_PUBLIC_APP_URL` | `https://app.ezerhrms.com` | no link to the product is rendered |
| `NEXT_PUBLIC_GA4_ID` | GA4 measurement ID | no analytics — **see §5** |
| `NEXT_PUBLIC_CLARITY_ID` | Clarity project ID | no session recording — **see §5** |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | the marketing project's Supabase | enquiries are not stored server-side; the forms still hand off to WhatsApp |

> **Database setup is its own document.** Provisioning the Supabase project,
> applying the migrations, the schema, the data flow and how to verify it all
> live in [`docs/DATABASE.md`](docs/DATABASE.md). Production currently has none
> of the three Supabase variables, so enquiries are not being saved.

| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET` | admin credentials | `/admin` cannot be logged into (it already redirects to the login page) |
| `RESEND_API_KEY` + `EMAIL_FROM`, or the `GMAIL_*` set | transactional email | no notification email is sent |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile | forms run without a captcha |
| `NEXT_PUBLIC_CALENDAR_URL` | booking embed URL | `/book-a-demo` shows its fallback |
| `IP_HASH_SALT` | any long random string | IP hashing falls back to a weaker default |

**`PRICE_PER_EMPLOYEE` — do not set.** `pricing.disclosed` is `false` and the
rate must not reach a public page. The repo is public.

---

## 3. Domains and DNS — GoDaddy

The domain is registered at **GoDaddy**. Keep DNS there and add records; do
**not** switch the nameservers to Vercel.

> **Why not switch nameservers.** Moving nameservers hands the whole zone to
> Vercel, which silently drops any MX records the domain has — so if email on
> `@ezerhrms.com` is ever set up at GoDaddy, or already is, it stops being
> delivered and nothing reports an error. Adding three records keeps mail and
> everything else where it is. Check for existing MX records before touching
> anything.

### 3.1 Add the domains in Vercel first

Do this before editing DNS, so Vercel can show you the values to paste and can
verify the moment the records resolve.

On the **marketing** project (`Client-website`) → Settings → Domains:
1. Add `www.ezerhrms.com` — set as **primary**
2. Add `ezerhrms.com` — choose **redirect to `www.ezerhrms.com`**

On the **product** project (`ezer-hrms`) → Settings → Domains:
3. Add `app.ezerhrms.com`

### 3.2 Then add the records at GoDaddy

GoDaddy → **My Products → Domains → ezerhrms.com → DNS → Manage Zones**.

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| `A` | `@` | `76.76.21.21` | 600 |
| `A` | `www` | `76.76.21.21` | 600 |
| `CNAME` | `app` | `cname.vercel-dns.com` | 600 |

`www` is an **A record, not a CNAME** — that is what Vercel actually asked for
once the domain was attached (`A www.ezerhrms.com 76.76.21.21`), rather than
the CNAME this file predicted before the project existed.

⚠ **Use whatever Vercel prints on its Domains screen over the values above.**
They are the long-standing defaults, but Vercel assigns different targets to
some accounts and regions, and a stale value here fails verification with no
useful error.

**Measured starting state** (checked against live DNS on 5 Sep 2026):

| Record | Now | Action |
| --- | --- | --- |
| nameservers | `ns45/ns46.domaincontrol.com` | leave alone — GoDaddy DNS, as intended |
| `@` (apex) | no `A` record | **add** `A → 76.76.21.21` |
| `www` | `CNAME → ezerhrms.com` (GoDaddy default) | **edit this record** → `cname.vercel-dns.com` |
| `app` | absent | **add** `CNAME → cname.vercel-dns.com` |
| `MX` | none — no email on the domain yet | see the note in §5 about the privacy policy |

**GoDaddy specifics that trip people up:**

- The existing `CNAME www → ezerhrms.com` must be **edited**, not left in place
  alongside a new one. GoDaddy will accept a second `www` entry and then answer
  with whichever it likes, so the site resolves intermittently — the worst kind
  of failure, because it looks like it works.
- Do **not** use GoDaddy's **Forwarding** feature to send apex → www. It
  answers before Vercel does, breaks the HTTPS certificate check on the apex,
  and Vercel's own redirect already does the job properly.
- The apex is an `A` record because GoDaddy does not support `ALIAS`/`ANAME`
  at the root.
- GoDaddy's default TTL is 1 hour. Drop it to 600s **before** you start, so a
  mistake costs ten minutes instead of an hour.

Propagation is usually minutes, occasionally up to a few hours. Vercel issues
the TLS certificates automatically once the records resolve.

### 3.3 The move to besthrms.co — September 2026

The marketing site moved to **`besthrms.co`**. Everything in §3.1 and §3.2
above still describes how `ezerhrms.com` was set up and is kept because that
domain is still attached — it now redirects rather than serves.

**Canonical is the apex, `https://besthrms.co`.** Three hostnames funnel into
it with a 301, so there is exactly one address search engines can index:

```
www.besthrms.co  ─301─┐
ezerhrms.com     ─301─┼─→  https://besthrms.co
www.ezerhrms.com ─301─┘
```

`app.ezerhrms.com` is **untouched**. That is the product, a different Vercel
project, and §8.1 says the two properties stay apart. The move is the
marketing site's alone.

**Records to set at GoDaddy** — *besthrms.co* is registered there too
(created 12 Sep 2026, nameservers `ns55/ns56.domaincontrol.com`). Keep DNS at
GoDaddy for the reason in §3, and set:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| `A` | `@` | `216.150.1.1` | 600 |
| `A` | `@` | `216.150.16.1` | 600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 600 |

⚠ **Two A records on the apex, and note the values are NOT `76.76.21.21`.**
That is the address §3.2 used for `ezerhrms.com`; Vercel now hands out
`216.150.1.1` / `216.150.16.1` for this project. Read the values off Vercel's
own Domains screen — or `vercel domains verify besthrms.co` — rather than
copying either table, for the reason already given in §3.2.

**Measured starting state** (live DNS, 28 Sep 2026):

| Record | Was | Action |
| --- | --- | --- |
| nameservers | `ns55/ns56.domaincontrol.com` | leave alone |
| `@` (apex) | `A → 15.197.148.33`, `A → 3.33.130.190` | **replace** with the two Vercel A records |
| `www` | `CNAME → besthrms.co` (GoDaddy default) | **edit** → `cname.vercel-dns.com` |
| `MX` | none | nothing to preserve — mail is on `ezerhrms@gmail.com` |

> Those two apex addresses are **GoDaddy's parking**, which is why the domain
> already answered 200 with a for-sale-style page. Turn Forwarding off in
> GoDaddy's domain settings as well as deleting the records: leaving it on
> re-adds them, and forwarding answers before Vercel does, which breaks the
> certificate check on the apex (§3.2 makes the same point about apex → www).

**Cutover order. This part matters more than the records.**

> **Done, 28 Sep 2026.** All five steps below were carried out and verified:
> every route 200s on `besthrms.co`, all three old hostnames 301 with the path
> preserved (`ezerhrms.com/pricing` → `besthrms.co/pricing`), canonicals,
> `og:url`, all 21 sitemap entries and the robots `Host` line read
> `besthrms.co`, HSTS and the rest of the header set are intact on the new
> hostname, and `app.ezerhrms.com` still answers 200.

1. Add both hostnames to the Vercel project, `www` as a 301 to the apex.
   *Done — neither serves anything until DNS moves, so this is free.*
2. Fix DNS at GoDaddy. `besthrms.co` starts serving the site. For a short
   while both domains serve it and the canonical still says
   `www.ezerhrms.com`, which is correct: the old address is still the
   published one.
3. **Only once `https://besthrms.co` actually loads**, set
   `NEXT_PUBLIC_SITE_URL=https://besthrms.co` in Vercel → Production and
   **redeploy**. It is inlined at build time, so nothing moves without a new
   build. This is the step that moves every canonical, `og:url`, the sitemap
   and the robots `Host` line.
4. Switch `ezerhrms.com` and `www.ezerhrms.com` to a 301 to `besthrms.co`.
5. Re-submit the sitemap in Search Console and add `besthrms.co` as a
   property, keeping the old one so the redirects can be seen being followed.

Doing 3 before 2 points every canonical at a domain that does not resolve,
which is the one way to turn a domain move into lost rankings.

**The TLS certificate did not issue itself.** Worth knowing, because it looks
exactly like a broken DNS change and it is not. DNS propagated in under a
minute, `vercel domains verify besthrms.co` reported
`configured-correctly`, and the site served fine over **HTTP** — our own CSP
header came back on port 80, so Vercel was plainly answering. But HTTPS
refused the handshake (`SSL_ERROR_SYSCALL`) for six minutes with no
certificate and no error anywhere. There were no CAA records to blame. The fix
was to ask for it explicitly:

```bash
vercel certs issue besthrms.co www.besthrms.co
```

HTTPS was live within seconds of that. If a newly attached domain serves on
port 80 but not 443, do not go back and re-check the DNS — issue the
certificate.

## 4. Verify after the first deploy

```bash
curl -sI https://ezerhrms.com            # expect 30x → https://www.ezerhrms.com
curl -sI https://www.ezerhrms.com        # expect 200
curl -s  https://www.ezerhrms.com/robots.txt   # Host + Sitemap must say www.ezerhrms.com
curl -s  https://www.ezerhrms.com/sitemap.xml | head
curl -sI https://app.ezerhrms.com        # expect 200 — the product
```

Check `robots.txt` and the canonical tags name the real domain. They are built
from `NEXT_PUBLIC_SITE_URL`, so if that is wrong every canonical is wrong.

---

## 5. Blockers to clear BEFORE going live

Found by the pre-launch regression pass. The first two are the ones that
matter legally.

1. **`/privacy-policy` and `/cookie-policy` contradict each other.** The
   privacy policy says the site "stores nothing in your browser" and "runs no
   analytics". The cookie policy names Google Analytics 4 and Microsoft
   Clarity. The site does store `ezer_cookie_consent` and `ezer_attribution`.
   Deciding §2's GA4/Clarity variables settles which page is wrong.
2. **The Grievance Officer is `[to be confirmed]`.** A named officer with
   contact details is required by the DPDP Act, and the page currently ships
   six visible `[… to be confirmed]` gaps.
3. **All three legal pages still show the amber "pending legal review"
   banner.** Remove it via `needsReview={false}` only after a lawyer has
   actually reviewed them.
4. **No email address anywhere on the site.** Phone and WhatsApp only. A
   privacy policy that says "write to us" needs an address to write to.
5. **The privacy policy discloses a Google Fonts IP flow that does not
   happen** — `next/font` self-hosts; measured zero requests to Google.
6. `sharp` carries 3 high-severity libvips CVEs. Exposure is low (all images
   are local and static) but the fix moves Next off its pinned version, so
   decide it deliberately.
7. **`"India's 1st HRMS"` is in the `<title>`** — an unverifiable comparative
   superlative in the most visible text the site publishes.

---

## 6. Everyday workflow after launch

```bash
git push origin <production-branch>   # Vercel builds and deploys automatically
```

Same model as `ezer-hrms`. Preview deployments are created for every other
branch and pull request.
