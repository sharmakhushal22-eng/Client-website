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

/* ── Prompts ───────────────────────────────────────────────────────────────
 * ONE readline interface for the whole script, deliberately.
 *
 * The obvious shape — a fresh interface per question — leaks. Closing a
 * terminal-mode interface does not immediately detach it from stdin, so the
 * second prompt has two readers attached and the stale one echoes every
 * keystroke it sees. Measured: the first prompt stayed hidden and the second
 * printed the password one character at a time.
 *
 * So: one interface, and muting is a flag on it. readline echoes through
 * _writeToOutput, so that is the method to override — reassigning
 * rl.output.write does nothing. While muted it repaints the prompt instead of
 * the keystroke: erase the line, return to column 0, print the prompt again.
 * ------------------------------------------------------------------------ */
let rl = null
const mute = { on: false, prompt: '' }

function terminal() {
  if (rl) return rl
  rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
  rl._writeToOutput = (str) => {
    if (mute.on) rl.output.write(`\x1B[2K\x1B[200D${mute.prompt}`)
    else rl.output.write(str)
  }
  return rl
}

function askHidden(question) {
  return new Promise((resolve, reject) => {
    const t = terminal()
    mute.prompt = question
    /* A closed stdin would otherwise leave this pending forever, and Node
       exits with "unsettled top-level await" — which tells nobody anything. */
    const onClose = () => reject(new Error('input closed before a password was entered'))
    t.once('close', onClose)
    t.question(question, (answer) => {
      mute.on = false
      t.removeListener('close', onClose)
      process.stdout.write('\n')
      resolve(answer)
    })
    mute.on = true
  })
}

function ask(question) {
  return new Promise((resolve, reject) => {
    const t = terminal()
    mute.on = false
    const onClose = () => reject(new Error('input closed'))
    t.once('close', onClose)
    t.question(question, (a) => { t.removeListener('close', onClose); resolve(a) })
  })
}

/** Every exit path goes through here, or the process hangs with the terminal
 *  still in raw mode. */
function done(code) {
  if (rl) rl.close()
  process.exit(code)
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
  let pw, again
  try {
    pw = await askHidden('  New admin password (hidden): ')
    again = await askHidden('  Type it again:              ')
  } catch (e) {
    console.error(`\n  ${e.message}. Run this in a terminal and type the password.\n`)
    done(1)
  }

  if (pw !== again) {
    console.error('\n  Those did not match. Nothing was generated — run it again.\n')
    done(1)
  }
  if (pw.length < 8) {
    console.error('\n  Too short. Use at least 8 characters.\n')
    done(1)
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
  done(0)
}

/* ── default: check against .env.local ────────────────────────────────────── */

if (!existsSync(envPath)) {
  console.error('\n  No .env.local found. Nothing to check against.\n')
  done(1)
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
  done(1)
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
  done(1)
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
  done(0)
}

console.log(`
  Generate a matching hash and set it in both places:

    npm run admin:check -- --hash

  Then restart the dev server (local) or redeploy (Vercel) — environment
  variables are read at boot.
`)
process.exit(1)
