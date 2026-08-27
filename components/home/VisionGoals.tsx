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
  const { why, mission, vision, goals } = visionGoal

  return (
    <section
      className="relative overflow-hidden bg-dark py-12 text-white sm:py-14 lg:py-16"
      aria-label="Mission and vision"
    >
      {/* ── The workforce grid, plus the motion it does not ship with ─────
       *
       * A plain <img>, not next/image: the source is an SVG, and Next refuses
       * to optimise SVG without dangerouslyAllowSVG. There is nothing for an
       * optimiser to do to vector art anyway.
       *
       * Everything that moves here is a CSS layer ON TOP of the file, because
       * the file itself is 609 static rects with no classes or groups.
       * Animating those individually would put 62KB in the document and 609
       * animated nodes on the compositor; this gets the same impression from
       * four elements. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ez-parallax absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/workforce-grid-dark.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="ez-breathe absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        {/* Two glows drifting behind the tiles, at different periods so they
            never sync into one pulsing blob. */}
        <span
          className="ez-drift-a absolute h-[34rem] w-[34rem] rounded-full blur-3xl"
          style={{ top: '-18%', left: '2%', background: 'radial-gradient(circle, rgba(37,99,235,.30), transparent 70%)' }}
        />
        <span
          className="ez-drift-b absolute h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{ bottom: '-20%', right: '6%', background: 'radial-gradient(circle, rgba(34,211,238,.16), transparent 70%)' }}
        />

        {/* A shaft of light crossing the band every 11 seconds. */}
        <span className="ez-sweep absolute inset-y-0 -left-1/4 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(147_197_253/0.10),transparent)]" />

        {/* The scrim. Left-weighted, because the mission statement is the
            largest block of text on the page after the H1 and it sits there;
            the grid stays open on the right behind the goal rows, which carry
            their own translucent panels. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_right,rgb(8_14_29/0.88)_0%,rgb(8_14_29/0.66)_38%,rgb(8_14_29/0.26)_68%,rgb(8_14_29/0.08)_100%)]" />

        {/* Edge blend, so the band joins the sections above and below. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,#111827_0%,transparent_12%,transparent_88%,#111827_100%)]" />
      </div>

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Mission + vision */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-200">
              {why.eyebrow}
            </p>

            {/* The mission statement leads, because it is the only paragraph
                here that says who the product is for and what it replaces.
                Vision follows it, one step quieter. */}
            <p className="mt-4 text-[1.05rem] leading-relaxed text-on-dark">
              <span className="font-bold text-white">{why.label}. </span>
              {why.statement}
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-on-dark-muted">
              {why.support}
            </p>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.14em] text-brand-200">
              {mission.eyebrow}
            </p>
            <p className="mt-4 text-[1.45rem] font-bold leading-[1.3] sm:text-[1.7rem]">
              {mission.statement}
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-on-dark">
              {mission.support}
            </p>

            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-200">
                {vision.eyebrow}
              </p>
              <p className="mt-3 text-lg font-bold leading-snug text-white">
                {vision.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-on-dark">
                {vision.body}
              </p>
            </div>
          </div>

          {/* The three goals, as rows rather than cards — a card grid needs
              equal heights and padding on four sides; rows need neither.

              These carry a REAL ground, not a wash. They used to be
              bg-white/5 with a white/10 hairline, which is the right weight
              on a flat dark band and completely wrong on a patterned one: at
              5% opacity the tile grid reads straight through the panel, so
              the card and the background became the same grey object and the
              text sat on the pattern rather than on a surface.

              The fill is now FULLY opaque — at 92% the tile pattern still
              bled through under the text, which is what made it hard to read.

              And the separation is carried by the BORDER, not the fill,
              because the fill mathematically cannot do it. The band beside
              these cards measures luma 0.035; against that, even pure black
              only reaches 1.70:1, so no darker panel can ever hit the 3:1
              WCAG 1.4.11 wants for a perceivable boundary. A lighter panel
              could, but only by going pale enough to stop looking like part
              of a dark section. A bright hairline clears 3:1 against the card
              AND the band at once, which is how dark UIs actually do this. */}
          <ul className="flex flex-col justify-between gap-3">
            {goals.map((goal, i) => (
              <li
                key={goal.title}
                data-reveal=""
                style={{ transitionDelay: `${Math.min(i, 3) * 45}ms` }}
                className="flex items-start gap-4 rounded-2xl bg-[#132344] p-5 shadow-[0_20px_46px_-18px_rgba(0,0,0,0.9)] ring-1 ring-[#8296be] transition duration-300 hover:bg-[#182b52] hover:ring-brand-300"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-[0_6px_16px_-6px_rgba(37,99,235,0.9)]">
                  <Icon name={goal.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="flex items-baseline gap-2 text-[1.02rem] font-bold text-white">
                    {goal.title}
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs font-bold text-brand-200"
                    >
                      {goal.number}
                    </span>
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-on-dark">
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
