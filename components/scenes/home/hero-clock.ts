/* Time helpers for the hero cards, shared by the server render (which bakes
 * in a default month) and the client (which keeps it current). India time,
 * whatever the visitor's own timezone: the records are Indian workplaces. */

const IST_OFFSET = 330 * 60_000
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const pad = (n: number) => String(n).padStart(2, '0')

/** HH:MM in India, 24-hour, as an attendance log shows it. */
export function istClock(ms: number) {
  const d = new Date(ms + IST_OFFSET)
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`
}

/** The month a payroll team is working on today: the current one from the
 *  25th (pre-close runs), otherwise last month's. */
export function payrollMonth(ms: number) {
  const d = new Date(ms + IST_OFFSET)
  const m = d.getUTCDate() >= 25 ? d.getUTCMonth() : (d.getUTCMonth() + 11) % 12
  return MONTHS[m]
}
