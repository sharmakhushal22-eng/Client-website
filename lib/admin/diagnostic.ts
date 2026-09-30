/* ============================================================================
 * The "I cannot read the database" message.
 *
 * Split out of lib/admin/db.ts, which is `server-only`, for one concrete
 * reason: <AccessError> renders this text, AccessError lives in the shared
 * admin Table module, and the lead inbox's table is now a CLIENT component.
 * One client import of that module used to drag the whole service-role data
 * layer — and `server-only` — into the browser bundle graph, which fails the
 * build. Nothing here touches a credential or a connection; it is a help
 * message that reads an environment flag, so it is safe on either side.
 * ========================================================================= */

export function accessDiagnostic(): string {
  /* On Vercel there is no .env.local, so naming it is actively misleading —
   * this message is read far more often in production than on a laptop. */
  const where = process.env.VERCEL
    ? 'Add ONE of these in Vercel → Settings → Environment Variables\n' +
      '(Production), then redeploy:'
    : 'Add ONE of these to .env.local, then restart the dev server:'
  return (
    'The admin panel cannot read the database.\n\n' +
    where + '\n\n' +
    '  SUPABASE_SERVICE_ROLE_KEY=sb_secret_…\n' +
    '    Supabase dashboard → Project Settings → API keys → secret key.\n' +
    '    This is the recommended route: HTTPS over IPv4, works on Vercel.\n\n' +
    '  DATABASE_URL=postgresql://…\n' +
    '    Project Settings → Database → Connection string. Use the SESSION\n' +
    '    POOLER URI — the direct db.<ref>.supabase.co host is IPv6-only and\n' +
    '    will not resolve on an IPv4-only network.'
  )
}
