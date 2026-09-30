'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin/auth'
import { softDeleteRows, restoreRows } from '@/lib/admin/db'

/* ============================================================================
 * Moving leads to the recycle bin, and taking them back out.
 *
 * NEITHER OF THESE DESTROYS ANYTHING. A "delete" sets deleted_at; the row,
 * its notes and its status history all stay exactly where they were. That is
 * why the copy in the UI says "move to the recycle bin" rather than "delete":
 * the word should match what happens.
 *
 * There is no permanent-delete action in this file, and that is not an
 * oversight to be fixed later. Migration 009 revokes DELETE on website_leads
 * from the role this app authenticates as, so adding one here would not work
 * anyway — it would fail with 42501. Removing a lead for good is a deliberate
 * act by someone with database access, in the Supabase SQL editor. An admin
 * password is not enough, which is the entire point.
 *
 * The guards are the same three as before, because "moved 200 leads nobody
 * meant to move" is still a bad afternoon even when it is reversible:
 *   - an empty id list changes nothing
 *   - ids must be uuids, so one malformed value cannot poison a batch
 *   - the form sends back the count it believes it is acting on, and it has
 *     to match, so a selection made before the list changed fails loudly
 * ========================================================================= */

export type BinLeadsState = { error?: string; binned?: number; restored?: number } | null

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Shared validation. Returns the ids, or the message to show instead. */
function readIds(form: FormData): { ids: string[] } | { error: string } {
  const ids = form
    .getAll('id')
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean)

  if (ids.length === 0) return { error: 'Nothing was selected, so nothing changed.' }
  if (ids.some((id) => !UUID.test(id))) {
    return { error: 'That selection contained something that is not a lead. Nothing changed.' }
  }

  const expected = Number(form.get('expected') ?? '')
  if (!Number.isInteger(expected) || expected !== ids.length) {
    return {
      error: 'The selection changed while you were confirming. Nothing changed — check the list and try again.',
    }
  }
  return { ids }
}

function explain(err: unknown, verb: string): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (/42703|deleted_at/i.test(msg)) {
    return (
      'The recycle bin is not set up in the database yet: website_leads has no deleted_at ' +
      'column. Apply migration 009 (npm run db:push), then try again. Nothing was changed.'
    )
  }
  if (/permission denied|42501/i.test(msg)) {
    return (
      `The database refused to ${verb}: service_role has no UPDATE privilege on website_leads. ` +
      'Re-run migrations 006 and 009 (npm run db:push).'
    )
  }
  return `Could not ${verb}: ${msg}`
}

/** Move leads to the recycle bin. */
export async function binLeads(
  _prev: BinLeadsState,
  form: FormData,
): Promise<BinLeadsState> {
  const admin = await requireAdmin()

  const parsed = readIds(form)
  if ('error' in parsed) return { error: parsed.error }

  let binned: number
  try {
    binned = await softDeleteRows('website_leads', parsed.ids, admin)
  } catch (err) {
    return { error: explain(err, 'move those leads') }
  }

  revalidatePath('/admin/leads')
  revalidatePath('/admin/leads/bin')
  revalidatePath('/admin')

  if (binned === 0) {
    return { error: 'Those leads were not there any more — the list was out of date. Refresh to see what is.' }
  }
  return { binned }
}

/** Put leads back into the inbox. */
export async function restoreLeads(
  _prev: BinLeadsState,
  form: FormData,
): Promise<BinLeadsState> {
  await requireAdmin()

  const parsed = readIds(form)
  if ('error' in parsed) return { error: parsed.error }

  let restored: number
  try {
    restored = await restoreRows('website_leads', parsed.ids)
  } catch (err) {
    return { error: explain(err, 'restore those leads') }
  }

  revalidatePath('/admin/leads')
  revalidatePath('/admin/leads/bin')
  revalidatePath('/admin')

  if (restored === 0) {
    return { error: 'Those leads were not in the recycle bin any more. Refresh to see what is.' }
  }
  return { restored }
}
