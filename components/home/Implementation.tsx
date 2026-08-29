import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { implementation } from "@/content/positioning";

/* The ten-day programme.
 *
 * Heading beside the timeline rather than centred above it, and the phases as
 * a connected horizontal track instead of four tall cards — a timeline should
 * look like a timeline, and it happens to be the shortest way to draw it. */
export function Implementation() {
  return (
    <section
      className="relative py-12 sm:py-14 lg:py-16"
      aria-label="Implementation"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[18%] -inset-y-20 rounded-[50%] bg-[radial-gradient(ellipse_60%_58%_at_50%_40%,rgb(249_251_254/0.93)_0%,rgb(249_251_254/0.9)_34%,rgb(249_251_254/0.78)_52%,rgb(249_251_254/0.56)_66%,rgb(249_251_254/0.32)_78%,rgb(249_251_254/0.12)_90%,transparent_100%)]"
            />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
                {implementation.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
                {implementation.title}
              </h2>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-700">
                {implementation.lede}
              </p>

              <p className="mt-6 flex items-start gap-2.5 rounded-xl bg-dark px-5 py-4 text-sm leading-relaxed text-on-dark-muted">
                <Icon
                  name="alert"
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-300"
                />
                <span>
                  <strong className="font-semibold text-white">
                    Your data is an asset, not a data-entry job.
                  </strong>{" "}
                  {implementation.promise}
                </span>
              </p>
            </div>
          </div>

          {/* self-start is load-bearing, not tidying. This is a grid item
              beside a much taller heading column, so by default it STRETCHED
              to match — 45px past the last card. The spine was measured with
              bottom-4 against that stretched box, so it ran on into the empty
              stretch and hung 29px below card 05 with nothing to connect to.
              Sized to its own content, the box ends where the cards end.

              The wrapper exists so the spine is not a child of the <ol>:
              space-y-3 puts a top margin on every child but the first, and
              with the spine sitting first that margin landed on phase 01
              instead. */}
          <div className="relative self-start">
            {/* The spine, running between the badge centres it joins. It is
                drawn once, behind the rows, and each card's own background
                masks the length crossing it — so what shows is the connector
                in the gaps. left is the badge's centre: 1.25rem of card
                padding plus half of the 2.75rem badge, then pulled back by
                half its own width. It used to be 1.35rem, which put it 20px
                to the LEFT of every number it was meant to thread through. */}
            <span
              aria-hidden="true"
              /* brand-600 and 2px, not brand-200 and a hairline. Only the
                 12px between two cards is ever visible — each card's own
                 background covers the rest — so the little that shows has to
                 carry the whole connection. At brand-200 it measured 1.42:1
                 against the page, less than half the 3:1 WCAG asks of a
                 graphic that means something, and it read as a smudge rather
                 than a line. brand-600 is 5.17:1 and is the exact blue of the
                 badges it joins, so the numbers and the track between them
                 now read as one object instead of two unrelated greys. */
              className="absolute left-[2.625rem] top-[2.625rem] bottom-0 w-0.5 -translate-x-1/2 rounded-full bg-brand-600"
            />

            <ol className="space-y-3">
            {implementation.phases.map((phase, i) => (
              <li
                key={phase.days}
                data-reveal=""
                style={{ transitionDelay: `${Math.min(i, 3) * 45}ms` }}
                className="ez-tilt group relative flex items-start gap-4 rounded-2xl bg-surface p-5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-16px_rgba(16,24,40,0.28)] ring-1 ring-ink-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_26px_50px_-18px_rgba(16,24,40,0.38)] hover:ring-brand-200"
              >
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-xs font-bold leading-none text-on-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-2.5">
                    <span className="text-[1.02rem] font-bold text-ink-900">
                      {phase.title}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-brand-700">
                      {phase.days}
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                    {phase.detail}
                  </p>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
