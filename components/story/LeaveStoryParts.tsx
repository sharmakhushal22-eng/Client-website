import { cn } from '@/lib/cn'

/* ============================================================================
 * The screens in the leave story. Sample data throughout: a fictional
 * employee (Ananya R.) and manager (Rohan M.), and a week chosen to hold no
 * public holiday, so the attendance strip and the October payroll line are
 * internally consistent:
 *
 *   October 2026 has 31 days. Weekly offs (Sat/Sun) are 9, plus Gandhi
 *   Jayanti on Fri 2 Oct: 10. Two days of casual leave on Mon 26 and Tue 27.
 *   Present 19, loss of pay 0, paid days 31.
 *
 * Parts marked data-show="n …" belong to the sticky stage: StoryProgress
 * toggles .is-on on them as the reader moves through the steps. Rendered
 * `compact` (the mobile picture for step one) the phone shows only its form.
 * ========================================================================= */

function Pill({ tone, children }: { tone: 'wait' | 'done' | 'info'; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.7rem] font-semibold',
        tone === 'done' && 'bg-emerald-50 text-emerald-700',
        tone === 'wait' && 'bg-amber-50 text-amber-700',
        tone === 'info' && 'bg-brand-50 text-brand-700',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          tone === 'done' && 'bg-emerald-600',
          tone === 'wait' && 'bg-amber-700',
          tone === 'info' && 'bg-brand-600',
        )}
      />
      {children}
    </span>
  )
}

function Field({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="rounded-[12px] bg-ink-50 px-3.5 py-2.5 ring-1 ring-ink-900/[0.06]">
      <p className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-ink-400">{label}</p>
      <p className={cn('mt-0.5 text-[0.82rem] font-semibold', accent ? 'text-brand-700' : 'text-ink-900')}>{value}</p>
    </div>
  )
}

/* ── The employee's phone ───────────────────────────────────────────────── */
export function PhoneLeave({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-[2.6rem] bg-ink-900 p-[7px] shadow-[0_40px_70px_-30px_rgb(11_22_51/0.55)]',
        compact ? 'mx-auto w-[15.5rem]' : 'w-[15.5rem]',
      )}
    >
      <div className="relative overflow-hidden rounded-[2.2rem] bg-white">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[0.62rem] font-semibold text-ink-900">
          <span className="ez-num">9:41</span>
          <span className="h-[18px] w-16 rounded-full bg-ink-900" />
          <span className="flex gap-0.5">
            <span className="h-2 w-0.5 rounded bg-ink-900" />
            <span className="h-2.5 w-0.5 rounded bg-ink-900" />
            <span className="h-3 w-0.5 rounded bg-ink-900" />
          </span>
        </div>

        <div className="px-4 pb-5 pt-3">
          <p className="text-[0.68rem] font-medium text-ink-400">Self-service</p>
          <p className="font-display text-[1.15rem] font-[650] tracking-[-0.02em] text-ink-900 [font-stretch:104%]">
            Apply for leave
          </p>

          <div className="mt-4 space-y-2">
            <Field label="Leave type" value="Casual leave" />
            <div className="flex items-center justify-between rounded-[12px] bg-brand-50 px-3.5 py-2 text-[0.72rem] text-brand-700">
              <span>Available</span>
              <span className="ez-num font-semibold">6 days</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="From" value="26 Oct" />
              <Field label="To" value="27 Oct" />
            </div>
            <Field label="Reason" value="Family function" />
          </div>

          {/* What the bottom of the screen shows, step by step. */}
          <div className="relative mt-4 h-[4.6rem]">
            <div
              {...(compact ? {} : { 'data-show': '1' })}
              className={cn('absolute inset-0', !compact && 'is-on')}
            >
              <div className="flex h-11 items-center justify-center rounded-full bg-brand-600 text-[0.8rem] font-semibold text-white">
                Submit request · 2 days
              </div>
              <p className="mt-2 text-center text-[0.64rem] text-ink-400">Goes to Rohan M. for approval</p>
            </div>
            {!compact && (
              <>
                <div data-show="2" className="absolute inset-0 rounded-[14px] bg-amber-50 p-3 ring-1 ring-amber-700/15">
                  <Pill tone="wait">Pending</Pill>
                  <p className="mt-1.5 text-[0.7rem] leading-snug text-amber-900">Sent to Rohan M. at 9:42 AM</p>
                </div>
                <div data-show="3 4" className="absolute inset-0 rounded-[14px] bg-emerald-50 p-3 ring-1 ring-emerald-700/15">
                  <Pill tone="done">Approved</Pill>
                  <p className="mt-1.5 text-[0.7rem] leading-snug text-emerald-900">By Rohan M. · 4 days left</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── The manager's approval ─────────────────────────────────────────────── */
export function ApprovalCard() {
  return (
    <div className="rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgb(11_22_51/0.06),0_30px_60px_-30px_rgb(11_22_51/0.4)] ring-1 ring-ink-900/[0.07]">
      <div className="flex items-center justify-between">
        <p className="ez-kicker text-ink-400">Approvals · 1 new</p>
        <Pill tone="wait">Pending</Pill>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fbe7c2] text-[0.78rem] font-bold text-[#7a4b00]">AR</span>
        <div>
          <p className="text-[0.92rem] font-semibold text-ink-900">Ananya R.</p>
          <p className="text-[0.74rem] text-ink-500">Quality · Plant, Pune</p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-ink-900/[0.06] py-4 text-[0.78rem]">
        <div>
          <dt className="text-ink-400">Leave</dt>
          <dd className="font-semibold text-ink-900">Casual · 2 days</dd>
        </div>
        <div>
          <dt className="text-ink-400">Dates</dt>
          <dd className="font-semibold text-ink-900">26–27 Oct</dd>
        </div>
        <div>
          <dt className="text-ink-400">Balance</dt>
          <dd className="ez-num font-semibold text-ink-900">6 days</dd>
        </div>
        <div>
          <dt className="text-ink-400">Team away</dt>
          <dd className="font-semibold text-ink-900">1 of 9</dd>
        </div>
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className="flex h-10 items-center justify-center rounded-full text-[0.8rem] font-semibold text-ink-700 ring-1 ring-ink-900/15">
          Decline
        </span>
        <span className="flex h-10 items-center justify-center rounded-full bg-brand-600 text-[0.8rem] font-semibold text-white shadow-[0_0_0_4px_rgb(37_99_235/0.15)]">
          Approve
        </span>
      </div>
      <p className="mt-3 text-[0.7rem] text-ink-400">Decisions are recorded with the approver and the time.</p>
    </div>
  )
}

/* ── The attendance register ────────────────────────────────────────────── */
const week = [
  { d: 'Mon', n: 26, s: 'CL' },
  { d: 'Tue', n: 27, s: 'CL' },
  { d: 'Wed', n: 28, s: 'P' },
  { d: 'Thu', n: 29, s: 'P' },
  { d: 'Fri', n: 30, s: 'P' },
  { d: 'Sat', n: 31, s: 'WO' },
  { d: 'Sun', n: 1, s: 'WO' },
]

export function AttendanceCard() {
  return (
    <div className="rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgb(11_22_51/0.06),0_30px_60px_-30px_rgb(11_22_51/0.4)] ring-1 ring-ink-900/[0.07]">
      <div className="flex items-center justify-between">
        <p className="ez-kicker text-ink-400">Attendance · Ananya R.</p>
        <Pill tone="info">Updated</Pill>
      </div>
      <p className="mt-3 text-[0.92rem] font-semibold text-ink-900">Week of 26 October</p>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {week.map((day) => (
          <div key={day.d} className="text-center">
            <p className="text-[0.6rem] font-medium uppercase text-ink-400">{day.d}</p>
            <div
              className={cn(
                'ez-num mt-1 grid h-12 place-items-center rounded-[10px] text-[0.72rem] font-semibold',
                day.s === 'CL' && 'bg-brand-600 text-white',
                day.s === 'P' && 'bg-emerald-50 text-emerald-700',
                day.s === 'WO' && 'bg-ink-100 text-ink-600',
              )}
            >
              <span>
                <span className="block text-[0.82rem]">{day.n}</span>
                <span className="block text-[0.62rem] font-semibold">{day.s}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-[12px] bg-ink-50 p-3.5">
        <div className="flex items-center justify-between text-[0.76rem]">
          <span className="text-ink-500">Casual leave balance</span>
          <span className="ez-num font-semibold text-ink-900">
            <span className="text-ink-400 line-through decoration-ink-300">6</span> → 4 days
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
          <div className="h-full w-1/3 rounded-full bg-brand-600" />
        </div>
      </div>
    </div>
  )
}

/* ── The payroll line ───────────────────────────────────────────────────── */
export function PayrollCard() {
  const lines: [string, string, boolean?][] = [
    ['Calendar days', '31'],
    ['Weekly offs and holidays', '10'],
    ['Present', '19'],
    ['Casual leave, paid', '2', true],
    ['Loss of pay', '0'],
  ]
  return (
    <div className="rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgb(11_22_51/0.06),0_30px_60px_-30px_rgb(11_22_51/0.4)] ring-1 ring-ink-900/[0.07]">
      <div className="flex items-center justify-between">
        <p className="ez-kicker text-ink-400">Payroll · October 2026</p>
        <Pill tone="done">From attendance</Pill>
      </div>
      <p className="mt-3 text-[0.92rem] font-semibold text-ink-900">Ananya R. · paid days</p>
      <dl className="mt-3 divide-y divide-ink-900/[0.06] text-[0.8rem]">
        {lines.map(([k, v, hi]) => (
          <div key={k} className={cn('flex items-center justify-between py-2', hi && '-mx-2 rounded-[8px] bg-brand-50 px-2')}>
            <dt className={hi ? 'font-semibold text-brand-700' : 'text-ink-500'}>{k}</dt>
            <dd className={cn('ez-num font-semibold', hi ? 'text-brand-700' : 'text-ink-900')}>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-2 flex items-center justify-between border-t-2 border-ink-900 pt-3">
        <span className="text-[0.82rem] font-semibold text-ink-900">Paid days</span>
        <span className="ez-num font-display text-[1.4rem] font-[680] tracking-[-0.03em] text-ink-900">31</span>
      </div>
      <p className="mt-3 text-[0.7rem] text-ink-400">Nothing exported, nothing re-keyed.</p>
    </div>
  )
}
