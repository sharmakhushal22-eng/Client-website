import Image from 'next/image'
import { Container } from '@/components/ui/Container'

/* ============================================================================
 * A full-width photographic band, used to break up long stretches of cards.
 *
 * WHY THE SCREEN IN THE PHOTOGRAPH IS BLURRED — not a styling choice.
 *
 * Both wide frames show a boardroom with a dashboard on the screen behind the
 * presenter, and those dashboards carry invented figures: a revenue line, a
 * donut split, "₹82.1 Cr", "+11.2%", "Total Revenue $235,000". Rendered
 * legibly on a marketing page, a reader has no way to know whether those are
 * EZER's numbers, a customer's, or nothing at all — and the reasonable
 * assumption is the flattering one. That is the same liability as publishing
 * the visual kit's placeholder charts, which is why those are not on the site
 * either.
 *
 * So the screen alone is blurred, in the source file, through a feathered
 * mask. The fabricated metrics do not resolve; the room, the people and the
 * light stay sharp. The first attempt blurred the entire frame in CSS, which
 * worked but made the whole band mushy to censor one rectangle.
 *
 * If a real screenshot of a real dashboard ever exists, it belongs in
 * ScreenshotFrame, legible and captioned — not smuggled in behind a headline.
 *
 * The "-screened" suffix in the filename is deliberate and must survive.
 * Next serves optimised images with Cache-Control: immutable, keyed only on
 * (path, width, quality). Replacing a file at the SAME path leaves every
 * cached browser and CDN edge serving the old bytes — Chrome will not even
 * revalidate an immutable response on a hard reload, which is exactly what
 * happened while this was being built: the server had the blurred file and
 * the page kept painting the sharp one, invented figures and all.
 * For a change that exists to remove fabricated financial numbers, "the cache
 * will catch up eventually" is not good enough. A new path is the only
 * invalidation that is guaranteed.
 *
 * MOTION
 *
 * Two layers, both scroll-driven or infinite CSS, neither on a listener:
 * Ken Burns pushes the frame very slowly, and the parallax drifts it against
 * the band as the band crosses the viewport. Together they give a still
 * photograph depth without asking the reader to notice anything.
 * ========================================================================= */

export function BoardroomBand({
  src = '/photos/corporate/boardroom-review-screened.webp',
  eyebrow,
  title,
  body,
  children,
}: {
  src?: string
  eyebrow: string
  title: string
  body?: string
  children?: React.ReactNode
}) {
  return (
    <section
      className="relative isolate overflow-hidden bg-dark py-16 sm:py-20 lg:py-24"
      aria-label={title}
    >
      {/* The photograph. Oversized and offset by the parallax keyframe, so
          the drift never exposes an edge. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="ez-parallax absolute inset-0">
          <div className="ez-kenburns relative h-full w-full">
            {/* alt="" deliberately, and no alt prop on this component: the
                photograph is a background, and everything it conveys is
                already in the heading beside it. Describing it to a screen
                reader would add noise, not information. */}
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              /* Not priority: this band is always well below the fold, and
                 the hero owns the LCP. */
              /* The blur is the mechanism that makes the invented on-screen
                 figures unreadable, and it is the right one: 3px destroys
                 small text while a room, its light and its people survive
                 completely. Stacking opacity to hide them instead just
                 turned the whole band into a dark rectangle — which is what
                 the first attempt did. The parallax already scales to 1.14,
                 so the blur never exposes an edge. */
              /* No CSS blur any more. Hiding the invented dashboard by
                 blurring the WHOLE photograph also destroyed the room, the
                 people and the light — the band was soft everywhere to
                 censor one rectangle. The screen is now blurred in the source
                 file itself, through a feathered mask, so the figures are
                 gone and everything else is sharp. */
              className="object-cover object-[35%_62%]"
            />
          </div>
        </div>

        {/* The scrim. Two layers rather than one flat tint: a heavy directional
            wash to seat the text, and an overall darkener that takes the
            on-screen figures out of legibility. */}
        <span className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-dark/20" />
        <span className="absolute inset-0 bg-dark/30" />
      </div>

      <Container>
        <div className="max-w-2xl" data-reveal="">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.15] text-white sm:text-4xl">
            {title}
          </h2>
          {body && (
            <p className="mt-5 text-[1.05rem] leading-relaxed text-on-dark-muted">
              {body}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  )
}
