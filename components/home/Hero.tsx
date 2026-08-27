import Image from "next/image";
import Link from "next/link";
import { RisingWords } from "./RisingWords";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EngineWidget } from "@/components/home/EngineWidget";
import { trustBadges } from "@/site.config";
import { structure } from "@/content/positioning";
import { brandPromises } from "@/content/lifecycle";
import { heroScale } from "@/content/home";

/* Spec §4.1 §2 — H1, one-line subhead, two CTAs, product screenshot.
 * "Above the fold on a 360px phone. No carousel."
 *
 * The H1 carries the repositioning: any size, all consolidated. It replaced
 * "India's first HRMS…" — a "first" claim is falsifiable by any competitor
 * with a screenshot, and it put the compliance claims, which are true and much
 * harder won, in the same basket as it.
 *
 * The subhead does the work the old H1 was doing: every establishment type and
 * every state, held in one place rather than assembled branch by branch. */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0b1631]">
      {/* ── The dashboard artwork, and a dark hero to put it on ───────────
       *
       * Three earlier attempts sat here: a boardroom photograph, drifting
       * orbs, and a light version of this collage. Each failed the same way —
       * the hero was a light canvas, so anything placed on it had to be
       * veiled to protect dark text, and by the time the veil was strong
       * enough to read against, the artwork had disappeared. Layering more
       * scrims made it worse, not better.
       *
       * Inverting the hero removes the conflict rather than balancing it. On
       * a dark ground the artwork needs no veil to be readable-against — it
       * IS the contrast — and every foreground element becomes light on dark,
       * which is the strongest separation available. The engine card stays
       * white and now reads as the brightest object on the page, which is
       * where the eye should land.
       *
       * The photograph is a NAVY DUOTONE, built at 3440px. A bright office
       * shot under a flat dark overlay goes muddy grey — the highlights grey
       * out long before the shadows are dark enough for white text. Remapping
       * luminance onto a navy-to-steel ramp keeps every bit of tonal
       * separation (faces, chairs, the glass partition) while making the frame
       * unmistakably dark and unmistakably brand blue. The highlight ceiling
       * is capped hard because the conference table is near-white in the
       * original and sits exactly where the body copy runs.
       *
       * The wall screen keeps its ORIGINAL content — the owner's explicit
       * decision — softened by a measured 1.2px depth-of-field so it does not
       * out-compete the headline for attention. It is a focal plane, not a
       * mask: the room, the people and the table stay sharp.
       *
       * Worth knowing if this is ever revisited: the dashboard carries
       * invented figures ("$235,000", "42 New Customers", "+18% Growth").
       * Earlier passes blurred them out entirely, then replaced the screen
       * with EZER's own statutory coverage; both were rejected in favour of
       * the original. Do not "fix" this quietly.
       *
       * The hash in the filename is not decoration. Next serves optimised
       * images with Cache-Control: immutable, keyed on (path, width, quality)
       * — so re-exporting this file at a fixed path leaves the browser
       * painting the OLD bytes, and Chrome will not revalidate an immutable
       * response even on a hard reload. While this was being tuned, several
       * exposure passes appeared to do nothing for exactly that reason. Any
       * future re-export must land on a new path.
       *
       * ONE motion, not two. Parallax already scales the layer to 1.14 so it
       * has room to drift; adding Ken Burns on top compounded to roughly 1.23
       * and cropped the boardroom down to a featureless slice of table. The
       * drift is the effect worth having here — the zoom was just cost. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="ez-parallax absolute inset-0">
          <Image
            src="/photos/hero-boardroom-cf8e863c.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_42%]"
          />
        </div>

        {/* One directional scrim, not a stack. Near-opaque under the copy and
            open from about 60% across, so the headcount, cost-by-department
            and payslip cards stay legible around the engine widget. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_right,rgb(9_20_45/0.96)_0%,rgb(9_20_45/0.92)_34%,rgb(9_20_45/0.62)_52%,rgb(9_20_45/0.18)_74%,rgb(9_20_45/0)_100%)]" />

        {/* A short edge blend at top and bottom only — 12% each, enough to
            seat the header and the band below without flattening the middle. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,#0b1631_0%,transparent_14%,transparent_86%,#0b1631_100%)]" />
      </div>

      <Container className="relative py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-raised ring-1 ring-white/40">
              <span aria-hidden="true">🇮🇳</span>
              India&rsquo;s most proactive HRMS — built for every industry,
              every establishment type
            </p>

            {/* The page's single <h1> — spec §8.4. */}
            {/* The words rise in sequence. The accent clause carries on from
                where the first line stopped, so the whole headline reads as
                one arrival rather than two competing ones. */}
            <h1 className="mt-5 text-[1.95rem] font-bold leading-[1.08] text-white sm:text-[2.6rem] lg:text-[2.95rem]">
              <RisingWords text="Built for every kind of Indian company." />{" "}
              <RisingWords
                text="From one employee to any number"
                className="text-brand-200"
                startDelay={380}
              />{" "}
              <RisingWords text="— all consolidated." startDelay={760} />
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-on-dark">
              One employee or several lakh, one office or hundreds of branches,
              plants and warehouses — it all consolidates into one platform.
              Recruitment, CTC and manpower planning, payroll, statutory
              compliance and employee experience, across every establishment
              type, every industry, every state.
            </p>

            {/* The product's own three promises, from the redesign. Kept as a
                quiet row rather than a headline: they are reassurance for
                someone already reading, not the reason to start. */}
            <ul className="ez-sheen mt-6 flex flex-wrap gap-x-5 gap-y-1.5 rounded-lg">
              {brandPromises.map((promise) => (
                <li
                  key={promise}
                  className="flex items-center gap-1.5 text-[0.82rem] font-medium text-on-dark"
                >
                  <Icon name="check" className="h-3.5 w-3.5 text-emerald-400" />
                  {promise}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/book-a-demo" size="lg" className="group">
                Book a Demo
                <Icon name="arrow-right" className="ez-bob h-4 w-4" />
              </Button>
              <Button href="/pricing" variant="onDark" size="lg">
                See Pricing
              </Button>
            </div>

            {/* The location types are the proof of the claim above, and they are
                real in the product today — so they sit in the hero rather than
                being described further down. */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-on-dark-faint">
                One system across
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {structure.locationTypes.map((type) => (
                  <li
                    key={type}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-on-dark backdrop-blur-sm ring-1 ring-white/20"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            {/* The scale claims, from the redesign. They sit between the
                location types and the certifications because that is the
                order the claim narrows in: what it spans, how big it goes,
                what proves it. */}
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5">
              {heroScale.map((claim) => (
                <li
                  key={claim}
                  className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-on-dark"
                >
                  <Icon name="check" className="h-3.5 w-3.5 text-brand-300" />
                  {claim}
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-2">
              {trustBadges
                .filter((badge) => badge.verified)
                .map((badge) => (
                  <li
                    key={badge.label}
                    className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-on-dark backdrop-blur-sm ring-1 ring-white/20"
                  >
                    <Icon
                      name={badge.icon}
                      className="h-3.5 w-3.5 text-brand-300"
                    />
                    {badge.label}
                  </li>
                ))}
            </ul>
          </div>

          <div className="relative lg:pl-4">
            {/* A soft brand halo behind the card. Without it a white panel on
                a photograph reads as a hole cut through the picture; with it
                the card sits on top of the room. */}
            <span
              aria-hidden="true"
              className="ez-card-glow pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(closest-side,rgb(59_130_246/0.45),transparent)] blur-2xl"
            />
            <div className="relative">
              {/* The engine widget, not a screenshot placeholder. It shows the
                claim the hero makes — four location types, one engine, every
                register — instead of standing in for a picture nobody has
                taken yet. Ported from the original index.html. */}
              <div className="ez-float">
                <EngineWidget />
              </div>
              <p className="mt-4 text-center text-sm leading-relaxed text-on-dark-muted lg:text-left">
                Operating in more than one state?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-brand-300 underline"
                >
                  Tell us where — we&rsquo;ll set the demo up on your structure
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
