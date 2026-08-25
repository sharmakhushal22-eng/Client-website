'use server'

import {
  checkHoneypotAndTiming,
  checkRateLimit,
  getIpHash,
  verifyTurnstile,
} from '@/lib/spam'
import { attributionFromFormData } from '@/lib/utm'
import { getServiceClient, isDatabaseConfigured } from '@/lib/supabase/server'
import { validateEmail, validateRequired } from '@/lib/validation'

/* ============================================================================
 * Gated asset download.
 *
 * Writes to asset_downloads, which has existed since migration 003 with an
 * admin view already built — but nothing ever wrote to it. This is the first
 * gated asset, so this is the action that fills it.
 *
 * Note what it does NOT do: it does not put the file behind an authenticated
 * URL. The PDF sits in /public and the "gate" is social, not technical —
 * anyone determined can find the path. That is the right trade for a
 * marketing asset: a real access wall costs signed URLs and an auth hop, and
 * buys protection for a document whose whole job is to be passed around.
 * ========================================================================= */

export type DownloadState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  /** Returned only on success — the client reveals the link with it. */
  href?: string
}

const ASSETS: Record<string, { title: string; href: string }> = {
  'policy-handbook': {
    title: 'Complete Company Policy Handbook — India Pvt Ltd',
    href: '/downloads/ezer-company-policy-handbook.pdf',
  },
}

function str(form: FormData, key: string): string {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function requestAssetDownload(
  _prev: DownloadState,
  form: FormData,
): Promise<DownloadState> {
  const slug = str(form, 'asset_slug')
  const asset = ASSETS[slug]
  if (!asset) return { status: 'error', message: 'Unknown download.' }

  /* Same three spam layers as every other form on the site. */
  const cheap = checkHoneypotAndTiming(form)
  if (!cheap.ok) {
    console.warn('[download] rejected:', cheap.reason, { slug })
    /* Reported as success. Telling a bot why it failed helps it try again. */
    return { status: 'success', href: asset.href }
  }

  const turnstile = await verifyTurnstile(str(form, 'cf-turnstile-response') || null)
  if (!turnstile.ok) return { status: 'error', message: 'Verification failed. Please try again.' }

  const email = str(form, 'work_email')
  const emailError = validateEmail(email)
  if (emailError) return { status: 'error', message: emailError }

  const company = str(form, 'company_name')
  const companyError = validateRequired(company, 'Company name')
  if (companyError) return { status: 'error', message: companyError }

  if (!isDatabaseConfigured()) {
    /* No database yet. The visitor still gets the file — losing the capture
     * is a smaller failure than refusing to hand over a marketing PDF. */
    console.warn('[download] no database configured; serving without capture')
    return { status: 'success', href: asset.href }
  }

  const ipHash = await getIpHash()
  const withinLimit = await checkRateLimit('download', ipHash)
  if (!withinLimit.ok) {
    return { status: 'error', message: 'Too many requests. Please try again shortly.' }
  }

  const supabase = getServiceClient()
  const { error } = await supabase.from('asset_downloads').insert({
    email,
    full_name: str(form, 'full_name') || null,
    company_name: company,
    phone: str(form, 'phone') || null,
    asset_slug: slug,
    asset_title: asset.title,
    ip_hash: ipHash,
    ...attributionFromFormData(form),
  })

  if (error) {
    /* Capture failed, but the visitor kept their side of the bargain. Serve
     * the file and log it — swallowing the download too would punish them for
     * our outage. */
    console.error('[download] insert failed:', error.message, { slug })
  }

  return { status: 'success', href: asset.href }
}
