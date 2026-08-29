import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { currentAdmin } from '@/lib/admin/auth'
import { accessMode } from '@/lib/admin/db'
import { logout } from './actions'
import { Brand } from '@/components/layout/Brand'
import { Icon, type IconName } from '@/components/ui/Icon'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · EZER Admin' },
  robots: { index: false, follow: false },
}

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin', label: 'Overview', icon: 'chart' },
  { href: '/admin/leads', label: 'Leads', icon: 'users' },
  { href: '/admin/bookings', label: 'Demo bookings', icon: 'calendar' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: 'mail' },
  { href: '/admin/downloads', label: 'Downloads', icon: 'download' },
  { href: '/admin/content', label: 'Content', icon: 'file' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await currentAdmin()

  /* The login page renders inside this layout too, but has no session — and
   * must not show the nav shell. */
  const pathname = (await headers()).get('x-pathname') ?? ''
  if (!admin || pathname.endsWith('/admin/login')) {
    return <>{children}</>
  }

  const mode = accessMode()

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-surface">
        <div className="mx-auto flex max-w-[85rem] flex-wrap items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <Brand showTagline={false} size="text-[1.1rem]" />
            <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-brand-700">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink-500 sm:inline">{admin}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-ink-600 ring-1 ring-ink-200 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <nav
          aria-label="Admin sections"
          className="mx-auto flex max-w-[85rem] gap-1 overflow-x-auto px-5 pb-2 sm:px-6"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <Icon name={item.icon} className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {mode === 'none' && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-[85rem] px-5 py-3 sm:px-6">
            <p className="flex items-start gap-2 text-sm font-medium text-amber-900">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              No database read access — see the panel below for what to add.
            </p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-[85rem] px-5 py-8 sm:px-6">{children}</main>
    </div>
  )
}
