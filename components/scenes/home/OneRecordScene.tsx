import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Masked } from '@/components/brand/Masked'
import { Scene } from '@/components/scene/Scene'
import { lifecycle } from '@/content/lifecycle'

/* ============================================================================
 * Scene 2: from scattered to one.
 *
 * The particles that formed the globe fly in as a mess: three crooked little
 * grids per bar, the separate tools and spreadsheets. As each row beside it
 * is struck through, its bar of the E pulls into order (bar n = row n), and
 * then a gold record runs along it: one record, one system. Pointing at a
 * row lights its bar (data-pair, read by the particle field). Beside them, three of the
 * problems the old site named (content/positioning.ts → todayVsEzer), each
 * struck through as it arrives and answered. Along the foot, the record
 * itself: six stages on one line, a pulse running the whole length.
 * ========================================================================= */

const pairs = [
  { today: 'Recruitment, payroll, compliance and attendance from four different vendors', ezer: 'One platform, from the first interview to the final settlement' },
  { today: 'PF, ESIC, PT and TDS cross-checked against a spreadsheet every month', ezer: 'Worked out correctly in the run, with nothing to reconcile afterwards' },
  { today: 'HR retyping a new hire’s Aadhaar and PAN into three forms by hand', ezer: 'The new hire uploads once and EZER fills the statutory forms' },
]

export function OneRecordScene({ index }: { index: number }) {
  return (
    <Scene index={index} tone="white" labelledBy="one-title">
      <Container className="flex h-full flex-col justify-center gap-10 py-20 lg:gap-12 lg:pb-12 lg:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow>Before, and with EZER</Eyebrow>
            <Masked
              id="one-title"
              className="mt-5 text-[2.2rem] leading-[1.04] sm:text-[3rem] lg:text-[min(3.6vw,6vh)]"
              lines={['Four vendors, five spreadsheets', 'and a WhatsApp group.', <span key="c" className="text-brand-600">Or one record.</span>]}
            />
            <ul data-m="strike" className="mt-8 space-y-5">
              {pairs.map((p, i) => (
                <li key={p.today} data-pair={i} className="grid cursor-default gap-1.5 rounded-[14px] px-2 py-1.5 transition-colors duration-200 hover:bg-brand-50/70 sm:-mx-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-5" style={{ '--i': i } as React.CSSProperties}>
                  <span className="text-[0.98rem] leading-snug text-ink-500">
                    <span className="sr-only">Today: </span>
                    <span className="ez-strike">{p.today}</span>
                  </span>
                  <span aria-hidden="true" className="hidden text-brand-600 sm:block">
                    <svg viewBox="0 0 28 12" className="h-3 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 6h24M20 1l5 5-5 5" /></svg>
                  </span>
                  <span className="ez-after text-[1.02rem] font-semibold leading-snug text-ink-900">
                    <span className="sr-only">With EZER: </span>
                    {p.ezer}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* The particle field settles into the E's three bars here. */}
          <div className="relative hidden h-[min(44vh,26rem)] lg:col-span-5 lg:block">
            <div data-stage="ebars" data-tone="light" className="absolute inset-0" />
          </div>
        </div>

        {/* ── Hire to retire, on one line ──────────────────────────────── */}
        <div data-m="rise" className="rounded-[26px] bg-paper p-5 ring-1 ring-ink-900/[0.05] max-md:hidden sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[0.95rem] font-semibold text-ink-900">{lifecycle.title}</p>
            <p className="text-[0.85rem] text-ink-500">Nothing exported, nothing typed twice.</p>
          </div>
          <div className="relative">
            <svg data-live="" aria-hidden="true" viewBox="0 0 1000 6" preserveAspectRatio="none" className="absolute left-[8%] right-[8%] top-[19px] hidden h-[6px] w-[84%] overflow-visible sm:block">
              <path d="M0 3 H1000" fill="none" stroke="rgb(11 22 51 / .1)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path d="M0 3 H1000" pathLength={100} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="ez-flow" style={{ '--dash': 12, '--dur': '5s' } as React.CSSProperties} />
            </svg>
            <ol className="relative grid grid-cols-3 gap-y-5 sm:grid-cols-6">
              {lifecycle.stages.map((s, i) => (
                <li key={s.name} className="flex flex-col items-center text-center">
                  <span className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-[0.78rem] font-semibold text-brand-700 shadow-[0_6px_16px_-8px_rgb(11_22_51/0.35)] ring-1 ring-ink-900/[0.06]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-2 text-[0.95rem] font-semibold text-ink-900">{s.name}</span>
                  <span className="text-[0.78rem] text-ink-500">{s.detail}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Scene>
  )
}
