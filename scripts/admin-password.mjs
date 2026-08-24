#!/usr/bin/env node
/* ============================================================================
 * Generate a new admin password and write its hash into .env.local.
 *
 *   npm run admin:password                  # generate a strong one
 *   npm run admin:password -- 'my own pw'   # hash a password you chose
 *
 * The plaintext is printed ONCE and never stored. Losing it means running
 * this again — which is the point.
 * ========================================================================= */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { scryptSync, randomBytes, randomInt } from 'node:crypto'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = join(root, '.env.local')

const WORDS = ['harbour','lantern','copper','meadow','anvil','cinder','falcon','ridge',
               'ember','quartz','willow','onyx','marble','thistle','beacon','cobalt']

const chosen = process.argv.slice(2).find((a) => !a.startsWith('-'))
const password =
  chosen ??
  `${WORDS[randomInt(WORDS.length)]}-${WORDS[randomInt(WORDS.length)]}-${WORDS[randomInt(WORDS.length)]}-${randomInt(1000, 9999)}`

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex')
/* ':' not '$' — dotenv expands $VAR inside .env values and would
 * silently truncate the hash. */
const stored = `scrypt:${salt}:${hash}`
const sessionSecret = randomBytes(32).toString('hex')

let env = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''
const setKey = (s, k, v) =>
  new RegExp(`^${k}=.*$`, 'm').test(s)
    ? s.replace(new RegExp(`^${k}=.*$`, 'm'), `${k}=${v}`)
    : s.rstrip
      ? s
      : s.trimEnd() + `\n${k}=${v}\n`

env = setKey(env, 'ADMIN_PASSWORD_HASH', stored)
if (!/^ADMIN_EMAIL=.+$/m.test(env)) env = setKey(env, 'ADMIN_EMAIL', 'admin@ezerhrms.com')
if (!/^ADMIN_SESSION_SECRET=.+$/m.test(env)) env = setKey(env, 'ADMIN_SESSION_SECRET', sessionSecret)

writeFileSync(envPath, env)

const email = (env.match(/^ADMIN_EMAIL=(.*)$/m) ?? [, 'admin@ezerhrms.com'])[1].trim()

console.log(`
  Admin credentials written to .env.local

    URL       /admin/login
    Email     ${email}
    Password  ${password}

  Only the scrypt hash is stored. Save the password now — it cannot be
  recovered, only replaced by running this again.

  Restart the dev server for the change to take effect.
`)
