import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Scene } from '@/components/scene/Scene'

/* ============================================================================
 * Scene 8: the employee's side.
 *
 * "Your workday, in one place" is the product's own sign-in line, so the
 * scene borrows it. The phone is drawn from the real self-service home: a
 * greeting, the punch dial with the shift beside it, the leave balance as a
 * ring, the week as seven tiles, and the workplace things the product has
 * that a payroll bureau does not: appreciation, anniversaries, holidays.
 * The particle field rings the phone in a slow halo.
 *
 * Sample person, sample week (Mon 19 Oct is a working day; Dussehra falls
 * on Tue 20 Oct 2026; Diwali on Sun 8 Nov).
 * ========================================================================= */

const features: [IconName, string, string][] = [
  ['wallet', 'Payslips and Form 130', 'Every payslip carries its income-tax worksheet; Form 130 replaces Form 16.'],
  ['calendar', 'Leave and regularisation', 'Apply, track, fix a missed punch.'],
  ['chart', 'TDS calculator, old vs new regime', 'Both regimes on their own salary, before they commit.'],
  ['receipt', 'Flexi and travel claims', 'Submit a bill in a tap.'],
  ['users', 'Team and org chart', 'Who is in, who is away, who reports to whom.'],
  ['sparkle', 'Social wall and appreciation', 'Wish a colleague, recognise good work.'],
  ['shield', 'Performance check-ins', 'Goals and reviews on the same record.'],
  ['file', 'HR services', 'Raise a ticket, request a letter.'],
]

const week = [
  ['Mon', '19', 'In', 'bg-emerald-50 text-emerald-700'],
  ['Tue', '20', 'Holiday', 'bg-brand-50 text-brand-800'],
  ['Wed', '21', 'In', 'bg-emerald-50 text-emerald-700'],
  ['Thu', '22', '', 'bg-ink-50 text-ink-600'],
  ['Fri', '23', '', 'bg-ink-50 text-ink-600'],
] as const

function Phone() {
  return (
    <div className="w-[17rem] rounded-[2.7rem] bg-ink-900 p-[7px] shadow-[0_50px_90px_-36px_rgb(11_22_51/0.6)]">
      <div className="overflow-hidden rounded-[2.3rem] bg-white">
        <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[0.62rem] font-semibold text-ink-900">
          <span className="ez-num">9:28</span>
          <span className="h-[18px] w-16 rounded-full bg-ink-900" />
          <span className="flex gap-0.5"><span className="h-2 w-0.5 rounded bg-ink-900" /><span className="h-2.5 w-0.5 rounded bg-ink-900" /><span className="h-3 w-0.5 rounded bg-ink-900" /></span>
        </div>
        <div className="space-y-3 px-4 pb-5 pt-3">
          <div>
            <p className="text-[0.66rem] text-ink-400">Monday, 19 October</p>
            <p className="font-display text-[1.25rem] font-[650] leading-tight tracking-[-0.02em] text-ink-900 [font-stretch:104%]">Good morning, Riya</p>
          </div>

          {/* Punch dial */}
          <div className="flex items-center gap-3 rounded-[18px] bg-[linear-gradient(135deg,#eef3ff,#fff)] p-3 ring-1 ring-brand-600/10">
            <div className="relative h-16 w-16 shrink-0">
              <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(37 99 235 / .12)" strokeWidth="2.6" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2563eb" strokeWidth="2.6" strokeLinecap="round" pathLength={100} strokeDasharray="100 100" className="ez-sweep-ring" style={{ '--dur': '8s' } as React.CSSProperties} />
              </svg>
              <span className="absolute inset-0 grid place-items-center text-center">
                <span className="ez-num text-[0.72rem] font-bold leading-none text-ink-900">09:28</span>
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-ink-400">Shift 09:30 to 18:30</p>
              <span className="mt-1.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-600 px-3.5 text-[0.74rem] font-semibold text-white">
                <Icon name="clock" className="h-3.5 w-3.5" /> Punch in
              </span>
            </div>
          </div>

          {/* Leave + attendance */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[14px] bg-ink-50 p-2.5 ring-1 ring-ink-900/[0.05]">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-ink-400">Leave balance</p>
              <p className="mt-1 font-display text-[1.2rem] font-[680] leading-none tracking-[-0.03em] text-ink-900">8.5 <span className="text-[0.66rem] font-medium text-ink-500">days</span></p>
            </div>
            <div className="rounded-[14px] bg-ink-50 p-2.5 ring-1 ring-ink-900/[0.05]">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-ink-400">October</p>
              <p className="mt-1 font-display text-[1.2rem] font-[680] leading-none tracking-[-0.03em] text-ink-900">12 <span className="text-[0.66rem] font-medium text-ink-500">of 13 days</span></p>
            </div>
          </div>

          {/* This week */}
          <div className="grid grid-cols-5 gap-1">
            {week.map(([d, n, s, c]) => (
              <div key={d} className={`rounded-[10px] py-1.5 text-center ${c}`}>
                <p className="text-[0.56rem] font-semibold uppercase">{d}</p>
                <p className="ez-num text-[0.8rem] font-bold leading-tight">{n}</p>
                <p className="h-3 text-[0.48rem] font-semibold">{s}</p>
              </div>
            ))}
          </div>

          {/* The workplace, cycling */}
          <div className="rounded-[14px] bg-[#fff7e6] px-3 py-2.5 ring-1 ring-marigold/30">
            <span aria-hidden="true" className="ez-cycle w-full" style={{ '--n': 3 } as React.CSSProperties}>
              <span style={{ '--i': 0 } as React.CSSProperties} className="block text-[0.7rem] leading-snug text-[#6b4300]"><b>Aarav appreciated you</b> · Team player</span>
              <span style={{ '--i': 1 } as React.CSSProperties} className="block text-[0.7rem] leading-snug text-[#6b4300]"><b>3 years at the company</b> · Happy anniversary</span>
              <span style={{ '--i': 2 } as React.CSSProperties} className="block text-[0.7rem] leading-snug text-[#6b4300]"><b>Diwali</b> · Sunday, 8 November</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EmployeeScene({ index }: { index: number }) {
  return (
    <Scene index={index} tone="paper" labelledBy="employee-title">
      <Container className="flex h-full flex-col justify-center py-20 lg:py-0 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="relative flex justify-center lg:col-span-5">
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 hidden aspect-square w-[min(34rem,72vh)] -translate-x-1/2 -translate-y-1/2 lg:block">
              <div data-stage="halo" data-tone="light" className="absolute inset-0" />
            </div>
            <div
              data-live=""
              data-depth="1"
              role="img"
              aria-label="Illustration with sample data: the employee self-service home on a phone, with the punch-in dial, leave balance, attendance, the week and an appreciation from a colleague."
              className="relative"
            >
              <Phone />
            </div>
          </div>

          <div className="lg:col-span-7">
            <Eyebrow>For everyone else in the company</Eyebrow>
            <h2 id="employee-title" className="mt-5 text-[2.3rem] leading-[1.04] sm:text-[3rem] lg:text-[min(3.4vw,5.8vh)]">
              Their workday,
              <br />
              <span className="text-brand-600">in one place.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-ink-600">
              Built phone-first, because employees check leave and payslips on the way to
              work, not at a desk. The questions that used to land in HR&rsquo;s inbox get
              answered on the screen instead.
            </p>
            <ul data-m="settle" className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {features.map(([icon, t, d], i) => (
                <li key={t} className={`flex gap-3.5 ${i >= 4 ? 'max-md:hidden' : ''}`}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-white text-brand-600 shadow-[0_8px_18px_-10px_rgb(11_22_51/0.35)] ring-1 ring-ink-900/[0.06]">
                    <Icon name={icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block text-[0.98rem] font-semibold text-ink-900">{t}</span>
                    <span className="block text-[0.86rem] leading-snug text-ink-500">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[0.85rem] text-ink-500">In light, dark, or an eye-comfort mode with a warm, adjustable filter.</p>
          </div>
        </div>
      </Container>
    </Scene>
  )
}
