#!/usr/bin/env node
/* ============================================================================
 * Send one test email through whichever provider is configured, and say
 * exactly what happened.
 *
 *   npm run email:test                    # sends to the sales address
 *   npm run email:test you@example.com    # sends to a specific address
 *   npm run email:test -- --check         # report config, send nothing
 *
 * Deliberately a standalone script rather than a route: this needs to be
 * runnable before the site is deployed, and it must never be reachable from
 * the internet.
 * ========================================================================= */

import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/* Load .env.local by hand — this runs outside Next, so nothing loads it. */
const envPath = join(root, '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  }
}

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const to = args.find((a) => a.includes('@'))

const hasResend = Boolean(process.env.RESEND_API_KEY)
const hasSmtp = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
const provider = hasResend ? 'resend' : hasSmtp ? 'smtp' : 'none'

console.log('\nMail configuration')
console.log(`  RESEND_API_KEY       ${hasResend ? '✓ set' : '· not set'}`)
console.log(`  GMAIL_USER           ${process.env.GMAIL_USER ? '✓ ' + process.env.GMAIL_USER : '· not set'}`)
console.log(`  GMAIL_APP_PASSWORD   ${process.env.GMAIL_APP_PASSWORD ? '✓ set' : '· not set'}`)
console.log(`  EMAIL_FROM           ${process.env.EMAIL_FROM ?? '· not set'}`)
console.log(`\n  active provider      ${provider}`)

if (provider === 'none') {
  console.error(
    '\nNothing to test. Configure one of:\n\n' +
      '  Resend  — resend.com → API Keys. Add to .env.local:\n' +
      '      RESEND_API_KEY=re_…\n' +
      '      EMAIL_FROM="EZER HRMS <hello@yourdomain.com>"\n' +
      '    The domain in EMAIL_FROM must be verified in Resend, or use\n' +
      '    onboarding@resend.dev, which only delivers to your own account.\n\n' +
      '  Gmail   — the same setup the HRMS product uses:\n' +
      '      GMAIL_USER=you@yourdomain.com\n' +
      '      GMAIL_APP_PASSWORD=…   (a Google App Password, not your login)\n' +
      '      GMAIL_FROM_NAME="EZER HRMS"\n',
  )
  process.exit(1)
}

if (checkOnly) process.exit(0)

const recipient = to ?? process.env.TEST_EMAIL_TO
if (!recipient) {
  console.error(
    '\nNo recipient. Pass one:\n  npm run email:test you@example.com\n',
  )
  process.exit(1)
}

const from =
  provider === 'smtp'
    ? `"${process.env.GMAIL_FROM_NAME || 'EZER HRMS'}" <${process.env.GMAIL_USER}>`
    : process.env.EMAIL_FROM ?? 'EZER HRMS <onboarding@resend.dev>'

const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1e1b4b;max-width:560px">
  <p style="font-size:18px;font-weight:700;margin:0 0 4px">Mail is working</p>
  <p style="margin:0 0 16px;color:#64748b">Sent from the EZER HRMS marketing site via <strong>${provider}</strong>.</p>
  <p>If you can read this, the enquiry auto-reply and the internal sales
     notification will both go out when someone submits the form.</p>
  <p style="color:#64748b;font-size:13px">Sent ${new Date().toISOString()}</p>
</div>`.trim()

console.log(`\n  from → ${from}`)
console.log(`  to   → ${recipient}\n`)

try {
  let id
  if (provider === 'resend') {
    const { Resend } = await import('resend')
    const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from,
      to: recipient,
      subject: 'EZER HRMS — mail test',
      html,
    })
    if (error) throw new Error(error.message)
    id = data?.id
  } else {
    const nodemailer = (await import('nodemailer')).default
    const info = await nodemailer
      .createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      })
      .sendMail({ from, to: recipient, subject: 'EZER HRMS — mail test', html })
    id = info.messageId
  }
  console.log(`  ✓ accepted by ${provider}${id ? ` (id ${id})` : ''}`)
  console.log('\n  Accepted is not delivered — check the inbox, and spam.\n')
} catch (err) {
  console.error(`  ✗ send failed: ${err.message}\n`)
  if (/domain is not verified|not verified/i.test(err.message)) {
    console.error('  The domain in EMAIL_FROM is not verified in Resend.\n' +
                  '  Verify it, or use onboarding@resend.dev for testing.\n')
  } else if (/Invalid login|Username and Password not accepted/i.test(err.message)) {
    console.error('  Gmail rejected the credentials. GMAIL_APP_PASSWORD must be a\n' +
                  '  Google App Password (16 chars), not the account password, and\n' +
                  '  2-Step Verification must be on.\n')
  }
  process.exit(1)
}
