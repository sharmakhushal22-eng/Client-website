import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { lifecycle } from '@/content/lifecycle'

/* ============================================================================
 * The employee lifecycle, as one connected track.
 *
 * Drawn as a track rather than six cards on purpose. Cards would say "we do
 * these six things", which is a feature list. A connected track says "it is
 * the same record moving", which is the actual claim — and the connector is
 * where every competing setup breaks, so it is the part worth drawing.
 *
 * The connector is a single line behind the row rather than five separate
 * arrows: arrows between boxes imply handoffs, which is precisely what this
 * section exists to say does not happen.
 *
 * The lede says "watch the same record travel the whole lifecycle", so a dot
 * travels it — otherwise the copy is writing a cheque the picture does not
 * cash. The halos pulse in sequence behind it, one second apart, so each
 * stage lights as the record reaches it.
 *
 * Laid out in HTML rather than as the reference's fixed 1000x200 SVG. The
 * SVG has to be scrolled sideways on a phone (the reference sets a 640px
 * min-width and a scrollbar for exactly this reason); the grid below reflows
 * to two columns instead. The travelling dot rides the spine, which only
 * exists at lg and up — below that the stages wrap onto three rows and there
 * is no single line left to travel.
 * ========================================================================= */
export function LifecycleStrip() {
  return (
    /* overflow-x-clip because the travelling dot's moving element is a full
       track wide and is translated by a full track: its own right edge ends
       up roughly 300px past the document, which gave the whole PAGE a
       horizontal scrollbar for part of every six-second cycle. Intermittent
       by nature — a scrollWidth check only catches it if it happens to run
       in the second half of the animation, which is how it survived the
       earlier passes.
       clip rather than hidden: hidden would make this a scroll container and
       break `position: sticky` for anything inside it. The visible dot never
       reaches the section edge, so nothing real is cut. */
    <section
      className="overflow-x-clip bg-canvas py-12 sm:py-14 lg:py-16"
      aria-label="Employee lifecycle"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
            {lifecycle.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
            {lifecycle.title}
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-600">
            {lifecycle.lede}
          </p>
        </div>

        <div className="relative mt-12">
          {/* The spine. Sits behind the stages and stops short of both ends so
              it reads as a continuous record rather than an open-ended arrow
              pointing off the page.

              Both ends land on the centre of the first and last icon — the
              row is six equal columns, so one twelfth in from each side is
              the middle of the outer cells. The travelling dot inherits the
              same box, which is what keeps it on the line at every width
              without hard-coded pixel positions. */}
          <span
            aria-hidden="true"
            className="ez-lifeline absolute left-[8.333%] right-[8.333%] top-7 hidden h-0.5 lg:block"
          />

          {/* The record itself, walking Hire to Exit.

              Three nested spans, and the middle one is load-bearing: a
              transform percentage resolves against the ELEMENT'S OWN width,
              not its parent's. Put the animation on the 12px dot and
              translateX(100%) moves it twelve pixels. So the moving element
              is stretched to the full track width (inset-x-0), and the dot
              rides its leading edge — now translateX(100%) is exactly one
              track, at any viewport width, and it stays on the compositor
              rather than animating `left` and relaying out every frame. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[8.333%] right-[8.333%] top-7 z-10 hidden lg:block"
          >
            {/* Above the stage discs, not behind them. Painted behind, the dot
                disappears for the ~200ms it spends crossing each icon and
                reads as a glitch; on top it reads as the record arriving at
                the stage, which is the whole point. */}
            <span className="ez-travel-dot absolute inset-x-0 top-0 block">
              <span className="absolute -left-1.5 -top-[5px] block h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,.55)]" />
            </span>
          </span>

          <ol className="relative grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {lifecycle.stages.map((stage, i) => (
              <li
                key={stage.name}
                data-reveal=""
                style={{ transitionDelay: `${Math.min(i, 3) * 45}ms` }}
                className="flex flex-col items-center text-center"
              >
                {/* The halo is a sibling behind the icon, not a ring on it:
                    scaling the icon disc itself would drag the label under it
                    around with the layout. */}
                <span className="relative grid h-14 w-14 place-items-center">
                  <span
                    aria-hidden="true"
                    className="ez-node-pulse absolute inset-0 rounded-full bg-brand-500/25"
                    style={{ animationDelay: `${i}s` }}
                  />
                  <span className="relative grid h-14 w-14 place-items-center rounded-full bg-surface text-brand-700 shadow-raised ring-1 ring-brand-100">
                    <Icon name={stage.icon} className="h-6 w-6" />
                  </span>
                </span>
                <span className="mt-3 text-[0.95rem] font-bold text-ink-900">
                  {stage.name}
                </span>
                <span className="mt-0.5 text-[0.78rem] text-ink-600">
                  {stage.detail}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mx-auto mt-12 flex max-w-3xl items-start gap-2.5 rounded-lg bg-surface px-5 py-4 text-sm leading-relaxed text-ink-700 ring-1 ring-ink-200">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          {lifecycle.note}
        </p>
      </Container>
    </section>
  )
}
