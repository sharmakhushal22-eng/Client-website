import 'server-only'

/* ============================================================================
 * Which mail provider to use.
 *
 * Two are supported, because the product already sends through Gmail SMTP
 * (nodemailer, GMAIL_USER / GMAIL_APP_PASSWORD) while spec §6 recommends
 * Resend. Supporting both means this site can reuse whatever credentials you
 * already have rather than requiring a new account.
 *
 * Resolution order:
 *   1. RESEND_API_KEY                   → Resend (preferred: better
 *                                         deliverability, real bounce data,
 *                                         no app password to rotate)
 *   2. GMAIL_USER + GMAIL_APP_PASSWORD  → Gmail SMTP, same as the product
 *   3. neither                          → skip sending, report why
 *
 * Sending is always best-effort. The lead row is committed before any of this
 * runs (spec §5.4 item 1), so a mail outage costs a notification, never a lead.
 * ========================================================================= */

export type Provider = 'resend' | 'smtp' | 'none'

export function activeProvider(): Provider {
  if (process.env.RESEND_API_KEY) return 'resend'
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) return 'smtp'
  return 'none'
}

/** The From header. Resend requires the domain to be verified in your Resend
 *  account; Gmail requires it to be the authenticated account itself, so the
 *  SMTP branch ignores EMAIL_FROM's address and uses GMAIL_USER. */
export function fromAddress(): string {
  if (activeProvider() === 'smtp') {
    const name = process.env.GMAIL_FROM_NAME || 'EZER HRMS'
    return `"${name}" <${process.env.GMAIL_USER}>`
  }
  return process.env.EMAIL_FROM ?? 'EZER HRMS <onboarding@resend.dev>'
}

export type SendResult = { sent: boolean; provider: Provider; id?: string; error?: string }

export async function sendMail(msg: {
  to: string
  subject: string
  html: string
  replyTo?: string
}): Promise<SendResult> {
  const provider = activeProvider()

  if (provider === 'none') {
    return {
      sent: false,
      provider,
      error:
        'No mail provider configured. Set RESEND_API_KEY, or GMAIL_USER + GMAIL_APP_PASSWORD.',
    }
  }

  try {
    if (provider === 'resend') {
      /* Imported lazily so the package is loaded only when actually used, and
       * so a packaging problem here can never break the lead insert path. */
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const { data, error } = await resend.emails.send({
        from: fromAddress(),
        to: msg.to,
        replyTo: msg.replyTo,
        subject: msg.subject,
        html: msg.html,
      })
      if (error) return { sent: false, provider, error: error.message }
      return { sent: true, provider, id: data?.id }
    }

    const nodemailer = (await import('nodemailer')).default
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
    const info = await transporter.sendMail({
      from: fromAddress(),
      to: msg.to,
      replyTo: msg.replyTo,
      subject: msg.subject,
      html: msg.html,
    })
    return { sent: true, provider, id: info.messageId }
  } catch (err) {
    return {
      sent: false,
      provider,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}
