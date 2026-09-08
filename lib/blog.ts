import 'server-only'
import { articles, type Article, type ArticleBlock } from '@/content/articles'
import { isDatabaseConfigured, getServiceClient } from '@/lib/supabase/server'
import { accessMode, listRows } from '@/lib/admin/db'

/* ============================================================================
 * THE ONE PLACE THE PUBLIC BLOG GETS ITS POSTS.
 *
 * Two sources, deliberately, and the order matters.
 *
 *   1. content/articles.ts — the three pieces written into the repo. They
 *      render with no database, no configuration and no network, which is why
 *      they stay: the blog must not go blank because Supabase is paused, out
 *      of credit, or deleted. That is not hypothetical here — the project this
 *      site was originally pointed at no longer resolves.
 *
 *   2. public.posts — anything written in the admin panel, but only rows with
 *      status = 'published'. Drafts are invisible to the public reader by
 *      construction rather than by a filter someone might forget.
 *
 * A database post with the same slug as a repo article WINS, so an editor can
 * supersede a shipped piece without a deploy. Everything else is merged and
 * sorted newest first.
 *
 * Every database path is wrapped: if Supabase is unconfigured, unreachable or
 * returns an error, the reader falls back to the repo articles and logs it.
 * A blog that loses its database should lose its NEW posts, not all of them.
 * ========================================================================= */

/** How long a post query may take before the blog gives up and serves the
 *  repo articles alone. */
const DB_TIMEOUT_MS = 4000

export type BlogPost = Article & {
  /** Where this came from, so the admin can tell what it is allowed to edit. */
  source: 'repo' | 'database'
  publishedAt: string | null
}

type PostRow = {
  slug: string
  title: string
  excerpt: string | null
  body_mdx: string
  category: string | null
  reading_minutes: number | null
  published_at: string | null
}

/* ── Body text → the blocks the existing renderer already understands ───────
 *
 * The posts table stores a body as text. Rather than add a Markdown
 * dependency — and with it a sanitiser, a CSP argument about inline HTML, and
 * a second visual language on the same page — the body is parsed into the
 * SAME ArticleBlock union the repo articles use. Posts written in the admin
 * therefore render identically to the ones in the repo, and nothing the
 * author types can become markup: every field below ends up as a React text
 * child, which React escapes.
 *
 * The syntax is deliberately tiny, because an editor should be able to hold
 * all of it in their head:
 *
 *   ## heading        → h2          - item        → ul (consecutive lines)
 *   ### heading       → h3          1. item       → ol (consecutive lines)
 *   anything else     → p
 * ------------------------------------------------------------------------ */
export function parseBody(body: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = []
  let list: { kind: 'ul' | 'ol'; items: string[] } | null = null

  const flush = () => {
    if (list) {
      blocks.push({ t: list.kind, items: list.items })
      list = null
    }
  }

  for (const raw of body.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim()
    if (!line) { flush(); continue }

    const bullet = line.match(/^[-*]\s+(.*)$/)
    const numbered = line.match(/^\d+[.)]\s+(.*)$/)

    if (bullet) {
      if (list?.kind !== 'ul') { flush(); list = { kind: 'ul', items: [] } }
      list.items.push(bullet[1])
      continue
    }
    if (numbered) {
      if (list?.kind !== 'ol') { flush(); list = { kind: 'ol', items: [] } }
      list.items.push(numbered[1])
      continue
    }

    flush()
    if (line.startsWith('### ')) blocks.push({ t: 'h3', x: line.slice(4).trim() })
    else if (line.startsWith('## ')) blocks.push({ t: 'h2', x: line.slice(3).trim() })
    else blocks.push({ t: 'p', x: line })
  }
  flush()
  return blocks
}

/** Rough reading time, only used when the author has not set one. */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200))
}

function rowToPost(r: PostRow): BlogPost {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? '',
    category: r.category ?? 'Article',
    readingTime: `${r.reading_minutes ?? readingMinutes(r.body_mdx)} min read`,
    blocks: parseBody(r.body_mdx),
    /* Repo articles each carry their own closing pitch because it is written
       for that piece. A database post has no such line, so it gets the
       site-wide one rather than an empty band. */
    cta: {
      title: 'See it on your own numbers',
      body: 'Thirty minutes, against your establishment types and states — not a generic demo company.',
      label: 'Book a demo',
    },
    source: 'database',
    publishedAt: r.published_at,
  }
}

const repoPosts: BlogPost[] = articles.map((a) => ({
  ...a,
  source: 'repo',
  publishedAt: null,
}))

/** Published posts from the database, or [] if there is no usable database.
 *
 *  Two routes, because the admin panel accepts two and the public blog must
 *  not go blank on the one the operator happened to choose:
 *
 *    - PostgREST over HTTPS, the normal case. The publishable key is enough:
 *      the "published posts are public" policy in 004_content.sql grants anon
 *      SELECT on exactly the rows a reader may see, so drafts stay invisible
 *      at the database rather than by a filter someone could forget.
 *    - A direct Postgres connection, when DATABASE_URL is the only credential
 *      configured. Without this branch an admin could publish a post, see it
 *      listed as published, and never find it on the site.
 */
async function publishedFromDatabase(): Promise<BlogPost[]> {
  if (isDatabaseConfigured()) {
    try {
      const { data, error } = await getServiceClient()
        .from('posts')
        .select('slug,title,excerpt,body_mdx,category,reading_minutes,published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        /* Bounded, because "the database is gone" must cost a few seconds, not
           a hung render. Measured: with the host unreachable this call sat for
           7.1s per request before the DNS layer gave up, against 0.05–0.6s for
           every other page on the site. The blog has a complete answer without
           the database — the repo articles — so waiting that long to discover
           there is nothing to add is the wrong trade. */
        .abortSignal(AbortSignal.timeout(DB_TIMEOUT_MS))

      if (!error) return (data ?? []).map((r) => rowToPost(r as PostRow))
      console.error('[blog] could not read posts, showing repo articles only:', error.message)
      return []
    } catch (err) {
      console.error('[blog] posts query threw, showing repo articles only:', err)
      return []
    }
  }

  if (accessMode() === 'direct-postgres') {
    try {
      const rows = await listRows<PostRow>('posts', {
        filters: { status: 'published' },
        order: 'published_at',
        limit: 200,
      })
      return rows.map(rowToPost)
    } catch (err) {
      console.error('[blog] direct postgres read failed, showing repo articles only:', err)
    }
  }

  return []
}

/** Everything a reader may see: database posts first, repo articles behind. */
export async function getAllPosts(): Promise<BlogPost[]> {
  const fromDb = await publishedFromDatabase()
  const dbSlugs = new Set(fromDb.map((p) => p.slug))
  return [...fromDb, ...repoPosts.filter((p) => !dbSlugs.has(p.slug))]
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug)
}

/** Slugs known at build time. Database posts are served on demand instead —
 *  see dynamicParams in the route, which is what lets a post published in the
 *  admin appear without a deploy. */
export function repoSlugs(): string[] {
  return repoPosts.map((p) => p.slug)
}
