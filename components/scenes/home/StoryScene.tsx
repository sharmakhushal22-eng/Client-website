import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/brand/Bars'
import { Scene } from '@/components/scene/Scene'
import { PhoneLeave, ApprovalCard, AttendanceCard, PayrollCard } from '@/components/story/LeaveStoryParts'
import { StoryPlayer } from './StoryPlayer'

/* ============================================================================
 * Scene 3: one leave request, played.
 *
 * No longer pinned: holding the screen for four scroll-lengths made the
 * page feel stuck to anyone who did not guess that scrolling moved the story.
 * StoryPlayer plays the four steps by itself while the scene is on screen,
 * each a button with its own filling line, with a pause control. Each step
 * moves the request one hand further on the right: the employee's phone, the
 * manager's approval, the attendance register, the payroll line.
 *
 * The particles leave this scene alone (no stage): it is the one quiet
 * room in the run, so the product picture has the reader's full attention.
 *
 * Below lg there is no pinning; the four steps stack, each with its picture.
 * ========================================================================= */

const steps = [
  { who: 'Employee', title: 'Ananya applies from her phone.', body: 'Leave type, dates, done. Her balance is on the same screen, so she knows what she has before she asks.' },
  { who: 'Manager', title: 'Rohan approves in one tap.', body: 'The request arrives with her balance and who else is away that week. Approve, or decline with a note, and the decision is recorded with his name and the time.' },
  { who: 'Attendance', title: 'The register updates itself.', body: 'Six days becomes four. Monday and Tuesday show as leave on the attendance register, not as absences to explain at month-end.' },
  { who: 'Payroll', title: 'Payroll already knows.', body: 'When October closes, the run reads paid days straight from attendance. No export, no re-keying, no correction cycle.' },
]

const pictures = [<PhoneLeave key="p" compact />, <ApprovalCard key="a" />, <AttendanceCard key="t" />, <PayrollCard key="r" />]

export function StoryScene({ index }: { index: number }) {
  return (
    <Scene index={index} tone="sand" id="how-it-works" labelledBy="story-title">
      <div className="h-full">
        {/* ── Desktop: played ───────────────────────────────────────────── */}
        <Container className="hidden h-full lg:block">
          <StoryPlayer
            steps={steps}
            picture={
              <div
                role="img"
                aria-label="Illustration with sample data: the leave request moving from the employee's phone, to the manager's approval, to the attendance register, to the payroll run."
                className="relative h-[min(66vh,36rem)] overflow-hidden rounded-[32px] bg-white ring-1 ring-ink-900/[0.06]"
              >
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgb(37_99_235/0.08),transparent_55%)]" />
                <div className="absolute left-[5%] top-1/2 -translate-y-1/2 scale-[0.9] xl:scale-[0.97]">
                  <PhoneLeave />
                </div>
                <div className="absolute right-[5%] top-1/2 w-[19.5rem] -translate-y-1/2">
                  <div className="relative h-[22rem]">
                    <div data-show="1" className="ez-pin-part is-on absolute inset-x-0 top-1/2 -translate-y-1/2">
                      <div className="rounded-[18px] border border-dashed border-ink-900/15 p-6">
                        <p className="ez-kicker text-ink-400">Step 1</p>
                        <p className="mt-3 font-display text-[1.3rem] font-[620] leading-snug tracking-[-0.02em] text-ink-800 [font-stretch:104%]">
                          Sent with the balance already checked.
                        </p>
                      </div>
                    </div>
                    <div data-show="2" className="ez-pin-part absolute inset-x-0 top-1/2 -translate-y-1/2"><ApprovalCard /></div>
                    <div data-show="3" className="ez-pin-part absolute inset-x-0 top-1/2 -translate-y-1/2"><AttendanceCard /></div>
                    <div data-show="4" className="ez-pin-part absolute inset-x-0 top-1/2 -translate-y-1/2"><PayrollCard /></div>
                  </div>
                </div>
              </div>
            }
          />
        </Container>

        {/* ── Mobile and tablet: stacked ────────────────────────────────── */}
        <Container className="py-20 lg:hidden">
          <Eyebrow>One leave request, start to finish</Eyebrow>
          <h2 className="mt-5 text-[2.3rem] leading-[1.04] sm:text-[3rem]">
            Here is what <span className="text-brand-600">easier looks like.</span>
          </h2>
          <ol className="mt-10 space-y-12">
            {steps.map((s, i) => (
              <li key={s.title}>
                <p className="ez-kicker flex items-center gap-3 text-ink-500">
                  <span className="ez-num grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-[0.7rem] font-semibold tracking-normal text-white">{i + 1}</span>
                  {s.who}
                </p>
                <h3 className="mt-3 font-display text-[1.6rem] font-[650] leading-[1.12] tracking-[-0.03em] text-ink-900 [font-stretch:106%]">{s.title}</h3>
                <p className="mt-2 text-[1rem] leading-relaxed text-ink-600">{s.body}</p>
                <div className="mt-6 rounded-[22px] bg-white p-5 ring-1 ring-ink-900/[0.06]">
                  <div className="mx-auto max-w-[19.5rem]">{pictures[i]}</div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </div>
    </Scene>
  )
}
