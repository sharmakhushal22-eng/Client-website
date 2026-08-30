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
/* These three mirror globals.css and MUST move with it: ezTravel and
 * ezHaloPulse both run 6s, ezTravel reaches the end of the track at its 80%
 * keyframe, and ezHaloPulse swells to full at its 7% one. They are here
 * because the halo delays are worked out from them below — hard-coding the
 * answer is what put every stage light behind the record it was meant to
 * be lit by. */
const TRAVEL_CYCLE_S = 6
const TRAVEL_SPAN_FRAC = 0.8
const HALO_PEAK_FRAC = 0.07

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
      className="relative isolate overflow-x-clip bg-dark py-14 text-white sm:py-16 lg:py-20"
      aria-label="Employee lifecycle"
    >
      {/* ── The halftone plate ───────────────────────────────────────────
       *
       * A plain <img>, not next/image, for the same reason the workforce
       * grid is: the source is vector, and Next will not touch an SVG
       * without dangerouslyAllowSVG. There is nothing to optimise anyway.
       *
       * The file is a flat 1920x1080 plate. Everything that moves is a CSS
       * layer over it, because the artwork itself is thousands of static
       * circles — animating those would put 157KB of animated nodes on the
       * compositor to achieve what four elements do here. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="ez-parallax absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/halftone-dots-dark.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="ez-breathe absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        {/* Two glows drifting behind the halftone at different periods, so
            the plate never settles into a flat wall. */}
        <span
          className="ez-drift-a absolute h-[32rem] w-[32rem] rounded-full blur-3xl"
          style={{ top: '-16%', left: '4%', background: 'radial-gradient(circle, rgba(37,99,235,.32), transparent 70%)' }}
        />
        <span
          className="ez-drift-b absolute h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{ bottom: '-18%', right: '5%', background: 'radial-gradient(circle, rgba(52,211,153,.16), transparent 70%)' }}
        />

        {/* A shaft crossing the plate, on the same 11s period as the other
            bands so the page keeps one rhythm. */}
        <span className="ez-sweep absolute inset-y-0 -left-1/4 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(147_197_253/0.09),transparent)]" />

        {/* A LIGHT scrim, and why it is light.
         *
         * A wash does not dim a halftone, it FLATTENS one: laid at alpha a,
         * the distance between a dot and the gap beside it survives at only
         * (1 - a). The 62% this started at left the dots with 38% of their
         * own contrast, which is precisely what "faded and dull" describes —
         * the plate was not darker, it was washed out.
         *
         * At 28% they keep 72%, and the artwork is boosted above to put back
         * what remains. The type is not relying on this to be readable
         * anyway: measured against the BARE plate the heading already sat at
         * 13:1, far past anything WCAG asks. What the scrim is for is the
         * dot screen interfering with the letterforms, and that is now
         * handled per-glyph — see the text-shadows below, which follow the
         * type exactly and so cannot draw a shape of their own. */}
        <span className="absolute inset-0 bg-[#070c18]/28" />

        {/* A gentle vertical weighting, heavier through the middle where the
            type sits. Full width, so there is no shape — only the band
            settling slightly towards its centre. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgb(7_12_24/0.16)_28%,rgb(7_12_24/0.2)_60%,transparent_100%)]" />

        {/* Edge blend. This band sits between two light sections, so the
            plate has to arrive and leave rather than start with a seam. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,#111827_0%,transparent_9%,transparent_91%,#111827_100%)]" />
      </div>

      <Container className="relative">
        <div className="relative mx-auto max-w-2xl text-center" data-reveal="">
          {/* No local scrim here any more — see the note on the plate above.
              The whole band is quietened instead, which is what lets this
              block sit on the artwork without drawing a shape around
              itself. */}
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300 [text-shadow:0_1px_3px_rgb(7_12_24/0.95),0_2px_14px_rgb(7_12_24/0.85)]">
              {lifecycle.eyebrow}
            </p>
            {/* text-white is REQUIRED: globals.css sets h1-h4 to ink-900 in
                @layer base, which on this plate is all but invisible. */}
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] text-white [text-shadow:0_2px_6px_rgb(7_12_24/0.95),0_4px_22px_rgb(7_12_24/0.9)] sm:text-4xl">
              {lifecycle.title}
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-on-dark [text-shadow:0_1px_3px_rgb(7_12_24/0.95),0_2px_14px_rgb(7_12_24/0.85)]">
              {lifecycle.lede}
            </p>
          </div>
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
            className="ez-lifeline ez-lifeline-lit absolute left-[8.333%] right-[8.333%] top-7 hidden h-0.5 lg:block"
          />

          {/* The record itself, walking Hire to Retire.

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
              <span className="ez-arc-comet absolute -left-1.5 -top-[5px] block h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_16px_5px_rgba(52,211,153,.65)]" />
            </span>
          </span>

          <ol className="relative grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {lifecycle.stages.map((stage, i) => (
              <li
                key={stage.name}
                data-reveal=""
                style={{ transitionDelay: `${Math.min(i, 3) * 45}ms` }}
                className="ez-arc-stage flex flex-col items-center text-center"
              >
                {/* The halo is a sibling behind the icon, not a ring on it:
                    scaling the icon disc itself would drag the label under it
                    around with the layout. */}
                <span className="relative grid h-14 w-14 place-items-center">
                  {/* The delay is COMPUTED, not `${i}s`. Two errors compound
                      in that guess. The dot covers the track in 80% of the
                      cycle, not all of it, so it reaches consecutive stages
                      every 0.96s and not every second — and the halo does not
                      swell the instant its delay elapses, it peaks 7% of a
                      cycle later. Measured against the old delays the lights
                      fired between 0.42s and 0.62s after the record had
                      already gone past, drifting further out at every stage.
                      Subtracting the swell offset from the true arrival time
                      lands the peak on the dot. */}
                  <span
                    aria-hidden="true"
                    className="ez-node-pulse absolute inset-0 rounded-full bg-brand-400/45"
                    style={{
                      animationDelay: `${(
                        (TRAVEL_CYCLE_S * TRAVEL_SPAN_FRAC * i) /
                          (lifecycle.stages.length - 1) -
                        TRAVEL_CYCLE_S * HALO_PEAK_FRAC
                      ).toFixed(2)}s`,
                    }}
                  />
                  {/* Lit from within rather than dropped onto the plate:
                      on a near-black ground a shadow says nothing, so the
                      disc reads by its rim and its inner highlight. */}
                  <span className="ez-arc-node relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#1e3160] to-[#101a33] text-brand-200 shadow-[0_10px_22px_-10px_rgba(0,0,0,0.9),inset_0_1px_0_rgb(255_255_255/0.18)] ring-1 ring-white/20">
                    <Icon name={stage.icon} className="h-6 w-6" />
                  </span>
                </span>
                <span className="mt-3 text-[0.95rem] font-bold text-white [text-shadow:0_1px_3px_rgb(7_12_24/0.95),0_2px_14px_rgb(7_12_24/0.85)]">
                  {stage.name}
                </span>
                <span className="mt-0.5 text-[0.8rem] text-on-dark [text-shadow:0_1px_3px_rgb(7_12_24/0.95),0_2px_14px_rgb(7_12_24/0.85)]">
                  {stage.detail}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* An opaque ground, not a wash. At low opacity the halftone reads
            straight through the panel and the note sits on the pattern
            rather than on a surface — the same thing that had to be fixed on
            the goal rows in VisionGoals. */}
        <p
          data-reveal=""
          className="mx-auto mt-12 flex max-w-3xl items-start gap-2.5 rounded-lg bg-[#131f3c] px-5 py-4 text-sm leading-relaxed text-on-dark ring-1 ring-white/20"
        >
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
          {lifecycle.note}
        </p>
      </Container>
    </section>
  )
}
