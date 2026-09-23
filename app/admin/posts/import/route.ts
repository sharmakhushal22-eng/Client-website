import { NextResponse } from 'next/server'
import { currentAdmin } from '@/lib/admin/auth'
import { extractDocument, ImportError, MAX_UPLOAD_BYTES } from '@/lib/import/extract'

/* ============================================================================
 * POST /admin/posts/import — a file in, a filled-in draft back.
 *
 * WHY A ROUTE HANDLER AND NOT A SERVER ACTION. Every other write in the admin
 * panel is an action; this one cannot be. Server actions carry a 1 MB body
 * limit by default, and raising it raises it for every action in the app,
 * including the public lead forms — a spam surface bought to solve an admin
 * problem. A route handler takes the upload on its own terms and nothing else
 * changes.
 *
 * It writes nothing. The response is a draft the editor still has to read and
 * submit, so the worst an import can do is waste someone's time.
 * ========================================================================= */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  /* requireAdmin() redirects, which is right for a page and wrong here: a
     302 to an HTML login page arrives at fetch() as an unparseable success.
     Say 401 and let the client say "your session expired". */
  if (!(await currentAdmin())) {
    return NextResponse.json(
      { error: 'Your session has expired. Open /admin/login in another tab, sign in, then try again.' },
      { status: 401 },
    )
  }

  /* Server actions check the origin themselves; a route handler does not, so
     this one does. Nothing here is destructive, but an admin-only endpoint
     that any site can POST to is not a habit worth keeping. */
  const origin = request.headers.get('origin')
  if (origin) {
    const host = request.headers.get('host')
    let originHost = ''
    try { originHost = new URL(origin).host } catch { originHost = '' }
    if (!originHost || originHost !== host) {
      return NextResponse.json({ error: 'Rejected: cross-site request.' }, { status: 403 })
    }
  }

  let file: File | null = null
  try {
    const form = await request.formData()
    const entry = form.get('file')
    if (entry instanceof File) file = entry
  } catch {
    /* The body limit is enforced by the platform before we see it, and the
       failure surfaces here as a malformed multipart body. */
    return NextResponse.json(
      { error: `That upload was too large to receive. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.` },
      { status: 413 },
    )
  }

  if (!file) return NextResponse.json({ error: 'No file was attached.' }, { status: 400 })

  try {
    return NextResponse.json(await extractDocument(file))
  } catch (err) {
    if (err instanceof ImportError) {
      /* 422: the request was fine, the document was not. Distinguished from
         500 so the client can show the message rather than "server error". */
      return NextResponse.json({ error: err.message }, { status: 422 })
    }
    console.error('[admin] post import failed:', err)
    return NextResponse.json(
      { error: 'That file could not be read. Try a .docx or paste the text into the body instead.' },
      { status: 500 },
    )
  }
}
