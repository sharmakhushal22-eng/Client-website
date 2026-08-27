import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { pricing } from "@/site.config";
import { coffee } from "@/content/coffee";
import { PriceReveal } from "@/components/pricing/PriceReveal";

/* Never hide pricing entirely; it costs qualified leads. One plan makes this
 * section unusually easy — there is a single number, and the interesting part
 * is what it does NOT exclude. */
export function PricingTeaser() {
  return (
    <Section tone="transparent" ariaLabel="Pricing">
      {/* The section's centrepiece, so it gets a real surface rather than a
          flat tint with a hairline. A wide aura underneath gives the panel
          something to be lifted OFF — depth on a light page comes from the
          ground being darker than the card, not from the card being darker
          than the page. */}
      <div className="relative mx-auto max-w-3xl" data-reveal="">
        <span
          aria-hidden="true"
          className="ez-card-aura pointer-events-none absolute left-1/2 top-1/2 h-[115%] w-[115%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(37_99_235/0.16),transparent)] blur-2xl"
        />

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-surface to-brand-50 shadow-[0_2px_4px_rgba(16,24,40,0.04),0_28px_60px_-24px_rgba(37,99,235,0.42)] ring-1 ring-brand-200 transition-shadow duration-500 hover:shadow-[0_3px_6px_rgba(16,24,40,0.05),0_40px_80px_-28px_rgba(37,99,235,0.55)]">
          {/* Lit top edge — one white hairline does more for the illusion of
              a raised surface than any amount of shadow beneath it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
          />
          {/* A sheen that crosses the card slowly, clipped to its radius. */}
          <span
            aria-hidden="true"
            className="ez-sweep pointer-events-none absolute inset-y-0 -left-1/4 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.5),transparent)]"
          />
          <div className="relative px-7 py-10 text-center sm:px-12">
            <SectionHeading eyebrow={coffee.eyebrow} title={coffee.headline} />
            <p className="mx-auto mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-ink-700">
              {coffee.lede}
            </p>

            <div className="relative mt-8">
              <span
                aria-hidden="true"
                className="ez-card-aura pointer-events-none absolute left-1/2 top-1/2 h-[9rem] w-[22rem] rounded-[50%] bg-[radial-gradient(closest-side,rgb(37_99_235/0.18),transparent)] blur-xl"
              />
              <div className="ez-price-pop relative">
                <PriceReveal size="xl" align="center" />
              </div>
              <p className="mt-3 text-sm text-ink-500">
                Billed annually · no minimum headcount ·{" "}
                {pricing.gstNote.replace(
                  "All prices are exclusive of ",
                  "plus ",
                )}
              </p>
            </div>

            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-600">
              {[
                "No per-module charges",
                "Unlimited entities & locations",
                "Implementation included",
                "No exit fee",
              ].map((item, i) => (
                <li
                  key={item}
                  className="ez-tick flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 font-medium text-ink-700 shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-ink-200"
                  style={{ animationDelay: `${240 + i * 80}ms` }}
                >
                  <Icon
                    name="check"
                    className="h-4 w-4 shrink-0 text-emerald-600"
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* The coffee comparison, stated so it is checkable rather than
              rhetorical — a reader who thinks "that cannot be right" can see
              exactly what is being compared against what. */}
            <div className="mx-auto mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
              {coffee.compare.map((row, i) => (
                <div
                  key={row.label}
                  className={`rounded-xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                    i === 0
                      ? "bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.05),0_10px_22px_-12px_rgba(16,24,40,0.3)] ring-1 ring-ink-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_18px_34px_-14px_rgba(16,24,40,0.4)]"
                      : "bg-gradient-to-b from-brand-600 to-brand-700 text-on-accent shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_28px_-12px_rgba(37,99,235,0.65)] hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_22px_40px_-14px_rgba(37,99,235,0.8)]"
                  }`}
                >
                  <p
                    className={`flex items-center gap-1.5 text-[0.82rem] font-bold ${
                      i === 0 ? "text-ink-900" : "text-white"
                    }`}
                  >
                    <span aria-hidden="true">{i === 0 ? "☕" : "⚡"}</span>
                    {row.label}
                  </p>
                  <p
                    className={`mt-1 text-[0.75rem] leading-relaxed ${
                      i === 0 ? "text-ink-600" : "text-white/90"
                    }`}
                  >
                    {row.detail}
                  </p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-lg text-[0.95rem] leading-relaxed text-ink-700">
              Tiered pricing puts statutory depth in the top tier. We would
              rather not sell compliance as an upgrade, so there is one rate and
              one product.
            </p>

            {/* The reference's two tiers. The rate is not rendered here —
              PriceReveal owns it and keeps it withheld while
              pricing.disclosed is false. */}
            <div className="mx-auto mt-10 grid max-w-3xl gap-5 text-left sm:grid-cols-2">
              {coffee.tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`ez-tilt relative flex flex-col rounded-2xl p-6 ${
                    tier.primary
                      ? "bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-[0_2px_4px_rgba(16,24,40,0.06),0_20px_40px_-14px_rgba(37,99,235,0.65)] ring-1 ring-brand-700/40"
                      : "bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-16px_rgba(16,24,40,0.3)] ring-1 ring-ink-200"
                  }`}
                >
                  <h3
                    className={`text-[1.05rem] font-bold ${tier.primary ? "text-white" : "text-ink-900"}`}
                  >
                    {tier.name}
                  </h3>
                  {"price" in tier && tier.price ? (
                    <p
                      className={`mt-1 text-2xl font-extrabold tracking-tight ${tier.primary ? "text-white" : "text-ink-900"}`}
                    >
                      {tier.price}
                    </p>
                  ) : null}
                  <p
                    className={`mt-2 text-[0.85rem] leading-relaxed ${tier.primary ? "text-white/85" : "text-ink-700"}`}
                  >
                    {tier.note}
                  </p>
                  <ul
                    className={`mt-4 space-y-2 border-t pt-4 text-[0.82rem] leading-snug ${tier.primary ? "border-white/20" : "border-ink-200"}`}
                  >
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Icon
                          name="check"
                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tier.primary ? "text-white" : "text-emerald-600"}`}
                        />
                        <span
                          className={
                            tier.primary ? "text-white/90" : "text-ink-700"
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.cta.href}
                    className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                      tier.primary
                        ? "bg-white text-brand-700 hover:bg-brand-50"
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    {tier.cta.label}
                    <Icon name="arrow-right" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/book-a-demo" size="lg">
                {pricing.disclosed ? "Get a quote" : "Get your number"}
                <Icon name="arrow-right" className="h-4 w-4" />
              </Button>
              <Button href="/pricing" variant="secondary" size="lg">
                What is included
              </Button>
            </div>

            {pricing.disclosed && (
              <p className="mt-5 text-sm text-ink-500">
                Work out your own cost with the{" "}
                <Link
                  href="/pricing#calculator"
                  className="font-semibold text-brand-700 underline"
                >
                  headcount calculator
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
