import 'server-only'

/* ============================================================================
 * Turn a database failure into something an operator can act on.
 *
 * The raw message for an unreachable Supabase project is "TypeError: fetch
 * failed" — true, and useless. It does not say which host, why, or what to do,
 * and it reads like a bug in the admin panel rather than a missing service.
 * That distinction matters here: this project has already had its Supabase
 * instance disappear once, and the first symptom was exactly this string.
 * ========================================================================= */

export function explainDbError(err: unknown, context: string): string {
  const raw = err instanceof Error ? err.message : String(err)
  const host = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//, '').replace(/\/.*$/, '')

  if (/fetch failed|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ECONNREFUSED|aborted|AbortError/i.test(raw)) {
    return (
      `${context}: the database did not answer.\n\n` +
      `  ${raw}\n\n` +
      (host ? `Configured host: ${host}\n\n` : '') +
      'This is almost always one of:\n\n' +
      '  • The Supabase project has been paused, deleted, or its URL changed.\n' +
      '    Check it still exists and that NEXT_PUBLIC_SUPABASE_URL matches.\n' +
      '  • SUPABASE_SERVICE_ROLE_KEY belongs to a different project than the URL.\n' +
      '  • This machine has no network route to it.\n\n' +
      'The public website is unaffected: /blog keeps serving the articles that\n' +
      'ship in the repo. Only posts written here are missing until this is fixed.'
    )
  }

  if (/relation .* does not exist|PGRST205|schema cache/i.test(raw)) {
    return (
      `${context}: the posts table is missing from this database.\n\n` +
      `  ${raw}\n\n` +
      'Run the migrations against it:  npm run db:push'
    )
  }

  return `${context}: ${raw}`
}
