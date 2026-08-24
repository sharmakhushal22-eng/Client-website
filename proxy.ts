import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/admin/session'

/* Gate every /admin route except the login page itself.
 *
 * Next.js 16 renamed this file convention from `middleware.ts` to `proxy.ts`
 * and the exported function from `middleware` to `proxy`. Same request
 * lifecycle, same `config.matcher` — only the names changed.
 *
 * This is the first line of defence, not the only one: each admin page also
 * calls requireAdmin(). The proxy alone is too easy to defeat with a matcher
 * typo, and the cost of getting it wrong here is every lead in the database. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  const admin = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
    process.env.ADMIN_SESSION_SECRET,
  )

  if (!admin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    /* Remember where they were headed so login can return them there. */
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
