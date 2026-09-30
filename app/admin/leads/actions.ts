'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin/auth'
import { deleteRows } from '@/lib/admin/db'

/* ============================================================================
 * Deleting leads.
 *
 * This is the most destructive thing in the admin panel, and it is worth
 * being plain about why it still exists: the inbox fills with spam that got
 * past four layers, duplicate submissions, and test rows. Without a delete,
 * the real enquiries get harder to see every week, which is its own way of
 * losing them.
 *
 * What a delete takes with it: the lead's notes and its status history, both
 * of which cascade from the foreign keys in migration 001. So this is not
 * "remove from a list" — it is the whole record of that conversation.
 *
 * Three guards, none of them decoration:
 *   - an empty id list deletes NOTHING. deleteRows refuses it rather than
 *     falling through to an unfiltered delete, which is how a table gets
 *     emptied by a bug in a checkbox.
 *   - the ids must look like uuids. A malformed one would make Postgres
 *     reject the whole batch, so one bad value cannot take out a delete the
 *     operator believes succeeded.
 *   - the form sends back how many rows it BELIEVES it is deleting, and that
 *     has to match. A selection made before someone else changed the list
 *     fails loudly instead of deleting a different set than the one on screen.
 * ========================================================================= */

export type DeleteLeadsState = { error?: string; deleted?: number } | null

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function deleteLeads(
  _prev: DeleteLeadsState,
  form: FormData,
): Promise<DeleteLeadsState> {
  await requireAdmin()

  const ids = form
    .getAll('id')
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean)

  if (ids.length === 0) {
    return { error: 'Nothing was selected, so nothing was deleted.' }
  }

  const bad = ids.filter((id) => !UUID.test(id))
  if (bad.length > 0) {
    return { error: 'That selection contained something that is not a lead. Nothing was deleted.' }
  }

  /* The count the UI showed when the button was pressed. */
  const expected = Number(form.get('expected') ?? '')
  if (!Number.isInteger(expected) || expected !== ids.length) {
    return {
      error: 'The selection changed while you were confirming. Nothing was deleted — check the list and try again.',
    }
  }

  let deleted: number
  try {
    deleted = await deleteRows('website_leads', ids)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (/permission denied|42501/i.test(msg)) {
      return {
        error:
          'The database refused the delete: service_role has no DELETE privilege on website_leads. ' +
          'Re-run migration 006 (npm run db:push), then try again.',
      }
    }
    return { error: `Could not delete: ${msg}` }
  }

  revalidatePath('/admin/leads')
  revalidatePath('/admin')

  if (deleted === 0) {
    return { error: 'Those leads were already gone — the list was out of date. Refresh to see what is there now.' }
  }

  /* Deliberately reports the number the DATABASE removed, not the number
     asked for. If a row disappeared between the click and the delete, the
     operator should see 4 rather than the 5 they selected. */
  return { deleted }
}
