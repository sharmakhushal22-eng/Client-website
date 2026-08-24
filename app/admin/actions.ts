'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  verifyPassword, isAdminConfigured,
  loginThrottleKey, checkLoginThrottle, clearLoginThrottle, requireAdmin,
} from '@/lib/admin/auth'
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from '@/lib/admin/session'
import { updateRow, insertRow } from '@/lib/admin/db'

export type LoginState = { error?: string }

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return {
      error:
        'Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and ' +
        'ADMIN_SESSION_SECRET in .env.local — run `npm run admin:password` to generate them.',
    }
  }

  const throttleKey = await loginThrottleKey()
  const throttle = checkLoginThrottle(throttleKey)
  if (!throttle.ok) {
    return { error: `Too many attempts. Try again in about ${throttle.retryInMin} minutes.` }
  }

  const email = String(form.get('email') ?? '').trim().toLowerCase()
  const password = String(form.get('password') ?? '')

  const expectedEmail = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase()
  const passwordOk = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH ?? '')

  /* Both checks always run, and the message never says which one failed —
   * "no such user" tells an attacker which addresses are worth attacking. */
  if (email !== expectedEmail || !passwordOk) {
    return { error: 'Those details do not match. Check the email and password.' }
  }

  clearLoginThrottle(throttleKey)

  const token = await signSession(email, process.env.ADMIN_SESSION_SECRET!)
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  const next = String(form.get('next') ?? '/admin')
  /* Only ever redirect within this site — an open redirect here would be a
   * ready-made phishing vector aimed at the people who hold the leads. */
  redirect(next.startsWith('/admin') ? next : '/admin')
}

export async function logout() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

export async function setLeadStatus(formData: FormData) {
  const admin = await requireAdmin()
  const id = String(formData.get('id'))
  const status = String(formData.get('status'))
  await updateRow('website_leads', id, { status, owner: admin })
  revalidatePath(`/admin/leads/${id}`)
  revalidatePath('/admin/leads')
}

export async function setLeadOwner(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id'))
  const owner = String(formData.get('owner') ?? '').trim() || null
  const next = String(formData.get('next_action_date') ?? '').trim() || null
  await updateRow('website_leads', id, { owner, next_action_date: next })
  revalidatePath(`/admin/leads/${id}`)
}

export async function addLeadNote(formData: FormData) {
  const admin = await requireAdmin()
  const id = String(formData.get('id'))
  const body = String(formData.get('body') ?? '').trim()
  if (!body) return
  await insertRow('lead_notes', { lead_id: id, author: admin, body })
  revalidatePath(`/admin/leads/${id}`)
}
