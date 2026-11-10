import { Icon } from '@/components/ui/Icon'

/* The app, drawn rather than screenshotted.
 *
 * Same frame and same type scale as the phone in the home page's employee
 * scene (components/scenes/home/EmployeeScene.tsx), so the two read as the
 * same product rather than two different mockups. The screen differs: that
 * one shows a week of attendance, this one shows the four things someone
 * arriving from a WhatsApp link wants to know the app does — punch, leave,
 * payslip, inbox.
 *
 * A server component, and deliberately not a screenshot: a PNG of the real
 * app would be 300 KB on the page's largest element and would go stale with
 * the next release.
 *
 * Sample data, announced as such in the aria-label. The salary figure is
 * masked here for the same reason the app masks it on a shared screen.
 */

const tiles: { label: string; value: string; unit?: string; chip: string; tone?: 'ok' }[] = [
  { label: 'Leave balance', value: '12.5', unit: 'days', chip: 'Apply' },
  { label: 'Payslip · October', value: '₹ ••••••', chip: 'View' },
  { label: 'Inbox', value: '3', unit: 'new', chip: '2 approved', tone: 'ok' },
  { label: 'Wall of Fame', value: '5', unit: 'badges', chip: 'Give' },
]

export function AppPhone() {
  return (
    <div className="flex justify-center">
      <div
        role="img"
        aria-label="Illustration with sample data: the EZER app on a phone, showing the punch-in dial with the shift timer, the leave balance, October's payslip, the approvals inbox and the Wall of Fame."
        className="w-[16.5rem] rounded-[2.7rem] bg-ink-900 p-[7px] shadow-[0_50px_90px_-36px_rgb(11_22_51/0.6)] sm:w-[17.5rem]"
      >
        <div className="overflow-hidden rounded-[2.3rem] bg-white">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[0.62rem] font-semibold text-ink-900">
            <span className="ez-num">9:12</span>
            <span className="h-[18px] w-16 rounded-full bg-ink-900" />
            <span className="flex gap-0.5">
              <span className="h-2 w-0.5 rounded bg-ink-900" />
              <span className="h-2.5 w-0.5 rounded bg-ink-900" />
              <span className="h-3 w-0.5 rounded bg-ink-900" />
            </span>
          </div>

          <div className="space-y-3 px-4 pb-5 pt-3">
            <div>
              <p className="text-[0.66rem] text-ink-400">Tuesday, 10 November</p>
              <p className="font-display text-[1.25rem] font-[650] leading-tight tracking-[-0.02em] text-ink-900 [font-stretch:104%]">
                Good morning, Rahul
              </p>
            </div>

            {/* The punch dial — the one screen an employee opens daily. */}
            <div className="flex items-center gap-3 rounded-[18px] bg-[linear-gradient(135deg,#eef3ff,#fff)] p-3 ring-1 ring-brand-600/10">
              <div className="relative h-16 w-16 shrink-0">
                <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90" aria-hidden="true">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(37 99 235 / .12)" strokeWidth="2.6" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray="76 100"
                  />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-center">
                  <span className="ez-num text-[0.72rem] font-bold leading-none text-ink-900">6h 48m</span>
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-ink-400">
                  Punched in · 09:12 am
                </p>
                <p className="mt-1 text-[0.72rem] font-semibold text-emerald-700">On time · 14 days</p>
                <span className="mt-1.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-600 px-3.5 text-[0.74rem] font-semibold text-white">
                  <Icon name="clock" className="h-3.5 w-3.5" /> Punch out
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {tiles.map((t) => (
                <div key={t.label} className="rounded-[14px] bg-ink-50 p-2.5 ring-1 ring-ink-900/[0.05]">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-ink-400">
                    {t.label}
                  </p>
                  <p className="mt-1 font-display text-[1.1rem] font-[680] leading-none tracking-[-0.03em] text-ink-900">
                    {t.value}
                    {t.unit && <span className="text-[0.64rem] font-medium text-ink-500"> {t.unit}</span>}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-[3px] text-[0.58rem] font-semibold ${
                      t.tone === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-brand-700 ring-1 ring-brand-600/15'
                    }`}
                  >
                    {t.chip}
                  </span>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div className="flex items-center justify-between px-6 pt-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full ${i === 0 ? 'w-5 bg-brand-600' : 'w-1.5 bg-ink-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
