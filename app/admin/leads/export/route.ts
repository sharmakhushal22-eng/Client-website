import { NextResponse } from 'next/server'
import { currentAdmin } from '@/lib/admin/auth'
import { listRows, type Lead } from '@/lib/admin/db'

/* CSV export — spec §7. A route handler rather than a page so the browser
 * gets a real file download with the right headers. */
export async function GET() {
  /* Middleware covers /admin/*, but this is a data-exfiltration endpoint —
   * it checks its own auth rather than trusting the matcher. */
  const admin = await currentAdmin()
  if (!admin) return new NextResponse('Unauthorized', { status: 401 })

  let leads: Lead[]
  try {
    leads = await listRows<Lead>('website_leads', { limit: 5000 })
  } catch (e) {
    return new NextResponse(e instanceof Error ? e.message : 'Export failed', { status: 500 })
  }

  const columns: (keyof Lead)[] = [
    'created_at', 'company_name', 'full_name', 'work_email', 'phone',
    'employee_band', 'designation', 'city', 'state', 'currently_using',
    'timeline', 'modules_interest', 'message', 'status', 'owner',
    'next_action_date', 'first_contacted_at',
    'utm_source', 'utm_medium', 'utm_campaign', 'referrer', 'landing_page',
    'form_name', 'consent', 'consent_at',
  ]

  /* RFC 4180: wrap every field and double any embedded quote. A lead's free
   * text will contain commas and newlines, and an unescaped one silently
   * shifts every later column. */
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return '""'
    const s = Array.isArray(v) ? v.join('; ') : String(v)
    return `"${s.replace(/"/g, '""')}"`
  }

  const csv = [
    columns.join(','),
    ...leads.map((l) => columns.map((c) => esc(l[c])).join(',')),
  ].join('\r\n')

  const stamp = new Date().toISOString().slice(0, 10)
  return new NextResponse(
    /* BOM so Excel opens UTF-8 correctly — without it, ₹ and Indian names
     * render as mojibake, which is exactly where this file is going. */
    '﻿' + csv,
    {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="ezer-leads-${stamp}.csv"`,
        'Cache-Control': 'no-store',
      },
    },
  )
}
