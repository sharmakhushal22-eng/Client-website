import 'server-only'
import { sendMail, type SendResult } from './transport'
import { contact, site, booking } from '@/site.config'

/* ============================================================================
 * Transactional email — spec §5.4 items 2 and 3.
 *
 * Two messages go out per enquiry:
 *   • an auto-reply to the enquirer, within 60 seconds, stating the SLA and
 *     carrying the booking link
 *   • an internal notification to sales with the full form payload
 *
 * Both are best-effort. The lead row is already committed before either is
 * attempted (§5.4 item 1), so a mail outage costs a notification, never a
 * lead. Failures are reported back so the caller can record that the
 * notification did not go out.
 *
 * Provider selection lives in ./transport — Resend or Gmail SMTP, whichever
 * is configured.
 * ========================================================================= */

/* Escaped because a lead's own typing ends up inside this HTML. A company
 * name of `<img src=x onerror=...>` should render as text in the sales
 * inbox, not execute in whatever webmail the team uses. */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export type EmailResult = SendResult

/* ── Auto-reply to the enquirer ───────────────────────────────────────────── */
export async function sendEnquirerAutoReply(lead: {
  full_name?: string | null
  work_email: string
  company_name: string
}): Promise<EmailResult> {
  const firstName = (lead.full_name ?? '').trim().split(/\s+/)[0] || 'there'
  const bookHref = `${site.url}/book-a-demo`

  const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1e1b4b;max-width:560px">
  <p>Hi ${esc(firstName)},</p>
  <p>Thanks for getting in touch about EZER HRMS. We have your enquiry for
     <strong>${esc(lead.company_name)}</strong> and someone from our team will
     come back to you <strong>${esc(contact.responseSla)}</strong>.</p>
  <p>If you would rather not wait, you can pick a slot directly:</p>
  <p>
    <a href="${bookHref}"
       style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;
              padding:12px 22px;border-radius:10px;font-weight:600">
      Book a ${booking.durationMinutes}-minute demo
    </a>
  </p>
  <p style="color:#475569;font-size:14px">
    It is a live walkthrough of the product against your own scenario — your salary
    structure, your states, your statutory setup. ${esc(booking.reassurance)}
  </p>
  <p style="color:#475569;font-size:14px">
    Our hours are ${esc(contact.businessHours)}. You can also reach us on
    <a href="tel:${esc(contact.phoneE164)}" style="color:#7c3aed">${esc(contact.phoneDisplay)}</a>
    or on WhatsApp.
  </p>
  <p>— The ${esc(site.name)} team</p>
</div>`.trim()

  return sendMail({
    to: lead.work_email,
    replyTo: contact.salesEmail,
    subject: `We've got your enquiry — ${site.name}`,
    html,
  })
}

/* ── Internal notification to sales ───────────────────────────────────────── */
export async function sendInternalNotification(
  lead: Record<string, unknown>,
): Promise<EmailResult> {
  /* The full payload, not a summary. Whoever picks this up should not have to
   * open a dashboard to know whether the lead is worth calling in the next
   * ten minutes — spec §1.3 targets a 15-minute median first response. */
  const rows = Object.entries(lead)
    .filter(([, v]) => v !== null && v !== undefined && v !== '' &&
                       !(Array.isArray(v) && v.length === 0))
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap">
          ${esc(k.replace(/_/g, ' '))}
        </td>
        <td style="padding:6px 0;color:#1e1b4b;font-weight:500">
          ${esc(Array.isArray(v) ? v.join(', ') : v)}
        </td>
      </tr>`,
    )
    .join('')

  const band = esc(lead.employee_band ?? '—')
  const company = esc(lead.company_name ?? 'Unknown company')

  const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;color:#1e1b4b">
  <p style="margin:0 0 4px;font-size:18px;font-weight:700">${company} — ${band} employees</p>
  <p style="margin:0 0 16px;color:#64748b">New enquiry from the website.</p>
  <table style="border-collapse:collapse;font-size:14px">${rows}</table>
  <p style="margin-top:20px">
    <a href="tel:${esc(lead.phone)}" style="color:#7c3aed;font-weight:600">Call ${esc(lead.phone)}</a>
    &nbsp;·&nbsp;
    <a href="mailto:${esc(lead.work_email)}" style="color:#7c3aed;font-weight:600">Reply by email</a>
  </p>
</div>`.trim()

  return sendMail({
    to: contact.salesEmail,
    replyTo: typeof lead.work_email === 'string' ? lead.work_email : undefined,
    subject: `New lead: ${company} (${band})`,
    html,
  })
}
