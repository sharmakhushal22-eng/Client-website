/* ============================================================================
 * Form validation, shared by the client (inline, on blur) and the server.
 *
 * Deliberately dependency-free and isomorphic. The same functions run in the
 * browser for the on-blur feedback required by spec §5.2 and again on the
 * server, because §5.3 says never trust the client — client validation is a
 * courtesy to the user, not a security control.
 * ========================================================================= */

export type FieldError = string | null

/* Intentionally permissive. The purpose is to catch typos, not to adjudicate
 * RFC 5322 — an over-strict pattern rejects real addresses and loses leads. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* Spec §5.1: "Reject free-mail domains softly (warn, don't block)." */
const FREE_MAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com',
  'live.com', 'rediffmail.com', 'icloud.com', 'aol.com', 'protonmail.com',
  'proton.me', 'zoho.com', 'ymail.com', 'gmx.com', 'mail.com',
])

export function validateEmail(value: string): FieldError {
  const v = value.trim()
  if (!v) return 'Work email is required.'
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address.'
  return null
}

/** A warning, never an error — the submit still goes through. */
export function freeMailWarning(value: string): FieldError {
  const domain = value.trim().toLowerCase().split('@')[1]
  if (domain && FREE_MAIL_DOMAINS.has(domain)) {
    return 'That looks like a personal address. A work email helps us prepare for the call — but carry on if this is the one you use.'
  }
  return null
}

/* Indian mobile numbers are 10 digits starting 6–9. We accept the number with
 * or without +91, spaces or dashes, and normalise on the way in — a visitor
 * pasting "+91 98765 43210" should not be told it is invalid. */
export function normalisePhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1)
  return digits
}

export function validatePhone(value: string): FieldError {
  const v = normalisePhone(value)
  if (!v) return 'Phone number is required.'
  if (v.length !== 10) return 'Enter a 10-digit mobile number.'
  if (!/^[6-9]/.test(v)) return 'Indian mobile numbers start with 6, 7, 8 or 9.'
  return null
}

export function validateRequired(value: string, label: string): FieldError {
  if (!value || !value.trim()) return `${label} is required.`
  if (value.trim().length < 2) return `${label} looks too short.`
  return null
}

export function validateConsent(checked: boolean): FieldError {
  /* DPDP Act 2023 (§8.7): consent must be explicit and unticked by default,
   * so this genuinely blocks submission rather than warning. */
  return checked ? null : 'Please tick the box so we know we may contact you.'
}

/* Bands match the company-size select in Website changes.html.
 * The top two boundaries moved (500-2000 / 2000+, from 500-1000 / 1000+),
 * so any lead captured before this change carries a band value no longer
 * in this list — BAND_LABELS falls back to the raw value rather than
 * rendering blank, so old records stay readable in the admin. */
export const EMPLOYEE_BANDS = ['<50', '50-200', '200-500', '500-2000', '2000+'] as const
export const DESIGNATIONS = ['HR', 'Finance', 'Founder', 'IT', 'Other'] as const
export const CURRENTLY_USING = ['Excel', 'Another HRMS', 'Outsourced', 'Nothing'] as const
export const TIMELINES = ['Immediately', '1-3 months', 'Just exploring'] as const

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
] as const
