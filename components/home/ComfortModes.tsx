'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

/* ============================================================================
 * Dual mode and eye comfort — demonstrated, not described.
 *
 * WHAT IS DELIBERATELY NOT CLAIMED HERE
 *
 * Not "the first HRMS with dark mode". Several products ship one, and a claim
 * a competitor can disprove with a single screenshot would take the
 * compliance claims — which are true and much harder won — down with it.
 *
 * The argument is depth instead: a designed dark palette rather than an
 * inversion, three states rather than two, no flash on load, and an eye
 * comfort layer with measured numbers behind it. Every line survives being
 * checked.
 * ========================================================================= */

/* Mirrors the product's own maths, from lib/ui/EyeComfort.tsx. Red is pinned
 * at 255 at every strength — the point is to remove blue, not to dim the
 * screen — and green falls a quarter as far as blue, which is what makes the
 * result read as warm daylight rather than sepia. */
const GREEN_DROP = 65
const BLUE_DROP = 163

function channels(pct: number) {
  const t = Math.max(0, Math.min(100, pct)) / 100
  return { g: Math.round(255 - GREEN_DROP * t), b: Math.round(255 - BLUE_DROP * t) }
}
function blueCut(pct: number) {
  return Math.round((1 - channels(pct).b / 255) * 100)
}

export function ComfortModes() {
  const [strength, setStrength] = useState(55)
  const { g, b } = channels(strength)

  return (
    <section className="bg-canvas py-12 sm:py-14 lg:py-16" aria-label="Comfort modes">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
            Built for the nine-hour day
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
            Your HR team looks at this screen all day.
            <br className="hidden sm:block" /> We designed it that way round.
          </h2>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-600">
            Payroll software is not glanced at — it is stared at, for hours, on
            the same three screens. Two things in EZER exist purely because of
            that, and both are in the product today.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* ── Dual mode ────────────────────────────────────────────── */}
          <div className="rounded-xl bg-surface p-7 ring-1 ring-ink-200 sm:p-8">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Icon name="clock" className="h-5 w-5" />
            </span>

            <h3 className="mt-5 text-xl font-bold">Day mode and dark mode</h3>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-600">
              Not an inverted light theme. Dark is its own designed palette —
              neutral slate, with the brand lifted so an action still reads as
              an action, and text on a filled button inverted so it does not
              drop below legible.
            </p>

            <ul className="mt-5 space-y-2.5 border-t border-ink-200 pt-5">
              {[
                ['Three states, not two', 'Light, dark, or follow your operating system — because that is a real preference a two-way switch overrides.'],
                ['No flash on load', 'The theme applies before the first paint, so dark users never get a white page for a frame.'],
                ['Every colour moves together', 'One attribute on the document; every surface, border and state colour is a variable keyed off it.'],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Icon name="check" className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span>
                    <span className="block text-sm font-bold text-ink-900">{t}</span>
                    <span className="mt-0.5 block text-[0.82rem] leading-relaxed text-ink-600">{d}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* The proof. This site runs the same contract as the product, so
                the control below is not a mock-up of the feature — it is the
                feature, applied to the page you are reading. */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md bg-brand-50 p-4 ring-1 ring-brand-100">
              <p className="text-[0.82rem] font-semibold leading-snug text-ink-900">
                Try it on this page — it is the same switch the product uses.
              </p>
              <ThemeToggle />
            </div>
          </div>

          {/* ── Eye comfort ──────────────────────────────────────────── */}
          <div className="rounded-xl bg-surface p-7 ring-1 ring-ink-200 sm:p-8">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-200">
              <Icon name="sparkle" className="h-5 w-5" />
            </span>

            <h3 className="mt-5 text-xl font-bold">Eye comfort mode</h3>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-600">
              A warm layer over the app that removes blue light from its own
              pixels — continuously adjustable, and measured rather than
              decorative.
            </p>

            {/* The live control. */}
            <div className="mt-6 rounded-md bg-ink-50 p-5 ring-1 ring-ink-200">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="eye-comfort" className="text-sm font-bold text-ink-900">
                  Warmth
                </label>
                <output
                  htmlFor="eye-comfort"
                  className="text-sm font-bold tabular-nums text-amber-700"
                >
                  {blueCut(strength)}% less blue
                </output>
              </div>

              <input
                id="eye-comfort"
                type="range"
                min={0}
                max={100}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                aria-valuetext={`${blueCut(strength)} per cent less blue light`}
                className="mt-4 w-full accent-amber-700"
              />

              {/* A sample of the product's own UI with the real overlay on it.
                  mix-blend-mode: multiply, exactly as the product does it —
                  every pixel underneath is multiplied by the amber, so text
                  and its background scale together and contrast RATIOS
                  survive. A translucent sheet would wash the panel out and
                  crush them. */}
              <div className="relative mt-5 overflow-hidden rounded-md ring-1 ring-ink-200">
                <div className="bg-surface p-4">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-600">
                    Payroll run · August
                  </p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-ink-900">
                    ₹41,86,240
                  </p>
                  <div className="mt-3 space-y-1.5">
                    {[['EPF', '₹2,14,800'], ['ESIC', '₹48,230'], ['TDS', '₹6,02,940']].map(
                      ([k, v]) => (
                        <p key={k} className="flex justify-between text-[0.78rem]">
                          <span className="text-ink-600">{k}</span>
                          <span className="font-semibold tabular-nums text-ink-900">{v}</span>
                        </p>
                      ),
                    )}
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    mixBlendMode: 'multiply',
                    backgroundColor: `rgb(255, ${g}, ${b})`,
                  }}
                />
              </div>

              <p className="mt-3 text-[0.72rem] leading-relaxed text-ink-600">
                At full strength the blue channel is emitted at {channels(100).b}/255
                — a 64% cut — while primary text still measures 11.44:1 and
                muted text 6.25:1. Both stay clear of the 4.5:1 the rest of the
                product is held to, which is why the slider is allowed to run
                all the way.
              </p>
            </div>

            {/* The honest limit, taken from the product's own source comment.
                Saying it is what makes the 64% believable. */}
            <p className="mt-5 flex items-start gap-2.5 text-[0.78rem] leading-relaxed text-ink-600">
              <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
              A web page cannot change what your monitor emits — only the OS or
              the display can do that. This works on EZER&rsquo;s own pixels,
              which for a full-screen HR tool is most of what you are looking
              at.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
