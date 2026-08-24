'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '../actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

const initial: LoginState = {}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initial)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="w-full rounded-xl bg-white px-4 py-3 text-[0.95rem] text-ink-900 ring-1 ring-inset ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl bg-white px-4 py-3 text-[0.95rem] text-ink-900 ring-1 ring-inset ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
      </div>

      <SubmitButton pending={pending} pendingLabel="Signing in…">
        Sign in
      </SubmitButton>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium leading-relaxed text-red-700">
          {state.error}
        </p>
      )}
    </form>
  )
}
