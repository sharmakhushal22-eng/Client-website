#!/usr/bin/env node
/* ============================================================================
 * Check an admin password against the stored hash — and mint a new one.
 *
 *   npm run admin:check            # does my password match .env.local?
 *   npm run admin:check -- --hash  # print a hash to paste into Vercel
 *
 * The password is typed at a HIDDEN prompt and is never echoed, never written
 * to a file, and never passed as an argument — so it cannot end up in your
 * shell history, in a screenshot, or in a transcript. Only the verdict is
 * printed, and in --hash mode only the hash, which is safe to paste anywhere.
 *
 * Why this exists: the login form says "Those details do not match" without
 * saying WHICH of the two did not match, deliberately — telling an attacker
 * that an email exists is how you hand them half the problem. That is right
 * for the login page and useless for an operator locked out of their own
 * site. This tool answers the question the login page refuses to.
 * ========================================================================= */

import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { scryptSync, timingSafeEqual, randomBytes } from 'node:crypto'
import { createInterface } from 'node:readline'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = join(root, '.env.local')
const wantHash = process.argv.includes('--hash')

/* ── Hidden prompt ─────────────────────────────────────────────────────────
 * readline echoes what you type, which defeats the whole point. Muting the
 * output stream while the answer is being typed is the standard trick; the
 * terminal still receives the keystrokes, it just does not paint them. */
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    process.stdout.write(question)
    let muted = false
    const realWrite = rl.output.write.bind(rl.output)
    rl.output.write = (chunk, ...rest) => (muted ? true : realWrite(chunk, ...rest))
    muted = true
    rl.question('', (answer) => {
      muted = false
      rl.output.write = realWrite
      process.stdout.write('\n')
      rl.close()
      resolve(answer)
    })
  })
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    rl.question(question, (a) => { rl.close(); resolve(a) })
  })
}

if (!process.stdin.isTTY) {
  console.error(
    '\n  This needs an interactive terminal, so the password can be typed\n' +
    '  without being echoed. Run it directly in your shell:\n\n' +
    '    npm run admin:check\n',
  )
  process.exit(1)
}

/* ── --hash: mint credentials for pasting into Vercel ─────────────────────── */

if (wantHash) {
  const pw = await askHidden('  New admin password (hidden): ')
  const again = await askHidden('  Type it again:              ')

  if (pw !== again) {
    console.error('\n  Those did not match. Nothing was generated — run it again.\n')
    process.exit(1)
  }
  if (pw.length < 8) {
    console.error('\n  Too short. Use at least 8 characters.\n')
    process.exit(1)
  }

  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex')

  console.log(`
  Paste these into Vercel → Settings → Environment Variables → Production,
  then redeploy. Set the same values in .env.local to keep local and live in
  step — EXCEPT the session secret, which should differ between them.

  ADMIN_PASSWORD_HASH
  scrypt:${salt}:${hash}

  A fresh session secret, if you want local and production to differ
  (recommended — a cookie minted from one then works only on that one):

  ADMIN_SESSION_SECRET
  ${randomBytes(32).toString('hex')}

  The password itself was not printed and is not stored anywhere. If you
  forget it, run this again — there is no recovery, only replacement.
`)
  process.exit(0)
}

/* ── default: check against .env.local ────────────────────────────────────── */

if (!existsSync(envPath)) {
  console.error('\n  No .env.local found. Nothing to check against.\n')
  process.exit(1)
}

const env = readFileSync(envPath, 'utf8')
const read = (k) => {
  const m = env.match(new RegExp(`^${k}=(.*)$`, 'm'))
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null
}

const storedEmail = read('ADMIN_EMAIL')
const storedHash = read('ADMIN_PASSWORD_HASH')
const secret = read('ADMIN_SESSION_SECRET')

console.log('\n  Checking against .env.local (LOCAL dev only — not production).\n')

let fatal = false
const line = (ok, label, detail) => {
  console.log(`  ${ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'} ${label}`)
  if (!ok && detail) console.log(`      ${detail}`)
  if (!ok) fatal = true
}

line(Boolean(storedEmail), 'ADMIN_EMAIL is set', 'the login form will say "not configured"')
line(Boolean(secret), 'ADMIN_SESSION_SECRET is set', 'sessions cannot be signed')

const parts = (storedHash ?? '').split(':')
const shapeOk = parts[0] === 'scrypt' && parts[1]?.length === 32 && parts[2]?.length === 128
line(
  shapeOk,
  'ADMIN_PASSWORD_HASH looks like a scrypt hash',
  storedHash
    ? `got ${parts.length} colon-separated part(s): scheme "${parts[0]}", ` +
      `salt ${parts[1]?.length ?? 0} chars, hash ${parts[2]?.length ?? 0} chars ` +
      '(expected scrypt / 32 / 128). A truncated hash usually means it was ' +
      'pasted with a label, a line break, or through something that expanded $.'
    : 'not set at all',
)

if (fatal) {
  console.log('\n  Fix the above first — run: npm run admin:check -- --hash\n')
  process.exit(1)
}

console.log(`  Stored email: ${storedEmail}\n`)

const email = (await ask('  Email you are typing at the login page: ')).trim().toLowerCase()
const pw = await askHidden('  Password (hidden):                     ')

const emailOk = email === storedEmail.trim().toLowerCase()

let pwOk = false
try {
  const candidate = scryptSync(pw, parts[1], 64, { N: 16384, r: 8, p: 1 })
  const expected = Buffer.from(parts[2], 'hex')
  pwOk = candidate.length === expected.length && timingSafeEqual(candidate, expected)
} catch (e) {
  console.error(`\n  Could not compute the hash: ${e.message}\n`)
  process.exit(1)
}

console.log('')
line(emailOk, 'email matches', `stored is "${storedEmail}" — compare it character by character`)
line(pwOk, 'password matches the stored hash')

if (emailOk && pwOk) {
  console.log(`
  \x1b[32mThese credentials are correct for LOCAL dev.\x1b[0m

  If the live site still rejects them, then production has a different
  ADMIN_PASSWORD_HASH or ADMIN_EMAIL. Vercel's values are encrypted and
  cannot be read back, so the fix is to overwrite them:

    npm run admin:check -- --hash

  and paste the result into Vercel → Settings → Environment Variables →
  Production. A redeploy is required — environment variables are read at
  boot, so an existing deployment keeps the old ones.
`)
  process.exit(0)
}

console.log(`
  Generate a matching hash and set it in both places:

    npm run admin:check -- --hash

  Then restart the dev server (local) or redeploy (Vercel) — environment
  variables are read at boot.
`)
process.exit(1)
