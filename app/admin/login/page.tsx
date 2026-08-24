import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'
import { Logo } from '@/components/layout/Logo'

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-ink-900/5 ring-1 ring-ink-200">
          <h1 className="text-xl font-bold">Sign in</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Lead inbox and enquiry data. Staff only.
          </p>
          <div className="mt-6">
            <LoginForm next={next ?? '/admin'} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-400">
          This area is not indexed and is rate-limited.
        </p>
      </div>
    </div>
  )
}
