import Image from "next/image";
import { RegimeCalculator } from "./RegimeCalculator";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { taxCalculator, flags } from "@/content/positioning";

/* "Attractive tax calculator and decision making processes to your
 * employees."
 *
 * Framed as the HR workload it removes rather than as a feature: the
 * regime question arrives every January from everyone at once, and it is
 * the single most repetitive thing an Indian HR team answers.
 *
 * DARK, on the dashboard artwork — the same file the hero uses.
 *
 * Not <Section tone="tint"> any more, because Section carries a flat tone and
 * this needs layers: artwork, parallax, scrim. The tone="ink" variant would
 * give a dark ground but no image.
 *
 * The scrim is left-weighted for the same reason as the hero's: copy on the
 * left, visual on the right. The artwork stays legible around the mockup and
 * gets out of the way under the text.
 *
 * The visual is a WORKING calculator, not a picture of one. It was the kit's
 * regime-comparison mockup in <Illustration> — honest about being a drawing,
 * but the wrong answer for this section specifically. The claim being made
 * here is "your employees see the number on their own salary before they
 * commit", and a drawing of a comparison cannot demonstrate that; the reader
 * has to take it on faith. Dragging the slider is the argument.
 *
 * <Illustration> and <ScreenshotFrame> both stay for the sections where
 * nothing real exists yet — this one now has something real.
 * ========================================================================= */
export function TaxCalculator() {
  if (!flags.taxCalculatorLive) return null;

  return (
    <section
      className="relative overflow-hidden bg-[#0f1f3f] py-14 sm:py-16 lg:py-20"
      aria-label="Employee tax calculator"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="ez-parallax absolute inset-0">
          <Image
            src="/photos/hero-dashboard-dark.webp"
            alt=""
            fill
            /* Well below the fold — the hero owns the LCP. */
            loading="lazy"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* This ONE gradient now does the whole job. There used to be an oval
            clearing stacked on top of it behind the copy — a second dark layer,
            in a different navy (9 20 45 against this 15 31 63), which read as a
            hard-edged panel with visible corners. A localised shape always has
            a boundary to notice; a full-height linear ramp has none, because it
            spans the section and varies in one direction only.
            So the ramp holds heavier across the copy column and releases from
            about 58% on, where the illustration sits and the artwork should
            show. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_right,#0f1f3f_0%,rgb(15_31_63/0.96)_40%,rgb(15_31_63/0.74)_56%,rgb(15_31_63/0.36)_76%,rgb(15_31_63/0.14)_100%)]" />
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,#0f1f3f_0%,transparent_12%,transparent_88%,#0f1f3f_100%)]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative">
              <SectionHeading
                eyebrow={taxCalculator.eyebrow}
                title={taxCalculator.title}
                lede={taxCalculator.lede}
                align="left"
                onDark
              />

              <dl className="mt-8 space-y-3">
                {taxCalculator.points.map((point, i) => (
                  <div
                    key={point.label}
                    data-reveal=""
                    style={{ transitionDelay: `${Math.min(i, 3) * 70}ms` }}
                    className="ez-tilt relative flex items-start gap-3.5 rounded-2xl bg-[#132344] p-4 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.85)] ring-1 ring-[#8296be] hover:bg-[#182b52] hover:ring-brand-300"
                  >
                    {/* Solid brand, not glass. At 10% white the chip was very
                      nearly invisible against the artwork. */}
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white shadow-[0_6px_16px_-6px_rgba(37,99,235,0.9)]">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <dt className="text-[0.98rem] font-bold text-white">
                        {point.label}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-on-dark">
                        {point.detail}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* The working widget, not a drawing of one. See RegimeCalculator
              for why the static mockup was the wrong answer here. */}
          <RegimeCalculator />
        </div>
      </Container>
    </section>
  );
}
