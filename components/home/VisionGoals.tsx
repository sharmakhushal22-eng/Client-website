import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { visionGoal } from '@/content/positioning'

/* Handoff anchor #vision-goal — mission, vision and the three goal cards.
 *
 * Previously a dark mission band stacked on a light vision section: ~1,350px
 * to carry three short ideas. Now one band, mission and vision on the left,
 * goals stacked on the right. Same content, roughly a third of the height,
 * and it reads as a single statement rather than three announcements.
 */
export function VisionGoals() {
  const { mission, vision, goals } = visionGoal

  return (
    <section
      className="relative overflow-hidden bg-dark py-12 text-white sm:py-14 lg:py-16"
      aria-label="Mission and vision"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_28rem_at_18%_0%,rgba(37, 99, 235,0.3),transparent)]"
      />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Mission + vision */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300">
              {mission.eyebrow}
            </p>
            <p className="mt-4 text-[1.45rem] font-bold leading-[1.3] sm:text-[1.7rem]">
              {mission.statement}
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-on-dark-muted">
              {mission.support}
            </p>

            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300">
                {vision.eyebrow}
              </p>
              <p className="mt-3 text-lg font-bold leading-snug text-white">
                {vision.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
                {vision.body}
              </p>
            </div>
          </div>

          {/* The three goals, as rows rather than cards — a card grid needs
              equal heights and padding on four sides; rows need neither. */}
          <ul className="flex flex-col justify-between gap-3">
            {goals.map((goal, i) => (
              <li
                key={goal.title}
                data-reveal=""
                style={{ transitionDelay: `${Math.min(i, 3) * 45}ms` }}
                className="flex items-start gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600">
                  <Icon name={goal.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="flex items-baseline gap-2 text-[1.02rem] font-bold text-white">
                    {goal.title}
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs font-bold text-brand-300"
                    >
                      {goal.number}
                    </span>
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-on-dark-muted">
                    {goal.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
