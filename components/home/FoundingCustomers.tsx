import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { foundingCustomer, testimonials } from "@/content/home";

/* Handoff §6 — no real customers yet, so the section invites founding
 * customers instead of showing quotes.
 *
 * Renders ONLY while there are no published testimonials. The moment a real
 * quote is published, SocialProof takes over and this steps aside — mutually
 * exclusive by construction rather than by somebody remembering to delete it.
 *
 * Compacted to a single band: the offer as a 2×2 of short rows beside the
 * qualifying panel, rather than a centred heading over a card grid. */
export function FoundingCustomers() {
  const hasRealTestimonials = testimonials.some((t) => t.published);
  if (hasRealTestimonials) return null;

  return (
    <section
      className="py-12 sm:py-14 lg:py-16"
      aria-label="Founding customers"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div className="relative">
            {/* A clearing for the copy column. The band's tiles are stretched
                tall here, so individual squares land squarely on the heading
                and the bullet text and collide with it.

                TINTED and CAPPED, not white and opaque. A pure-white core
                flattens to zero saturation inside a blue-tinted field, and
                that dead-neutral patch reads as a pasted panel however long
                the falloff is — the fault this same treatment fixed on the
                In Practice header. At 0.9 over the field's own pale blue, the
                tint never disappears, so there is no colour edge; the tiles
                simply fade out under the words and back in around them.

                No negative z-index: this wrapper is z-index:auto and creates
                no stacking context, so -z-10 would drop the clearing behind
                the band's artwork entirely. Paint order instead — clearing
                declared first, content wrapped after it. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[12%] -inset-y-16 rounded-[50%] bg-[radial-gradient(ellipse_58%_62%_at_45%_48%,rgb(249_251_254/0.9)_0%,rgb(249_251_254/0.87)_34%,rgb(249_251_254/0.76)_52%,rgb(249_251_254/0.55)_66%,rgb(249_251_254/0.32)_78%,rgb(249_251_254/0.12)_90%,transparent_100%)]"
            />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
                {foundingCustomer.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
                {foundingCustomer.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink-700">
                {foundingCustomer.lede}
              </p>

              <ul className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {foundingCustomer.offer.map((item) => (
                  <li key={item.title} className="flex items-start gap-2.5">
                    <Icon
                      name="check"
                      className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                    />
                    <span>
                      <span className="block text-sm font-bold text-ink-900">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-[0.82rem] leading-relaxed text-ink-700">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deliberately the loudest thing here: repelling a bad-fit buyer
              early is worth more than the lead. */}
          {/* A dark panel on a light patterned field is the hardest thing to
              seat. Flat #111827 with a hard radius reads as a hole punched
              through the page, which is what this was.

              Four things fix it, and none of them is "make it less dark":

              1. A large blurred AURA underneath, extending well past the
                 panel. The light field now darkens gradually on approach
                 instead of meeting the panel at a cliff — that gradient is
                 what the eye reads as "sitting on" rather than "cut into".
              2. A GRADIENT fill, not flat. Real dark surfaces are never one
                 value; a diagonal ramp gives it a light direction.
              3. Slight TRANSLUCENCY with a backdrop blur, so the workforce
                 tiles ghost faintly through the panel. The field continues
                 into it rather than stopping at its border — literally
                 blended, not merely adjacent.
              4. A lit top hairline. One white edge does more for the
                 impression of a raised object than any shadow beneath it.

              Contrast is unaffected: at 94% over a light ground the panel is
              still effectively opaque for text purposes. */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="ez-card-aura pointer-events-none absolute left-1/2 top-1/2 h-[112%] w-[112%] rounded-[2.5rem] bg-[radial-gradient(closest-side,rgb(17_24_39/0.55),transparent)] blur-2xl"
            />
            <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#16233f]/94 via-[#101a30]/94 to-[#0b1424]/94 p-7 text-white shadow-[0_2px_6px_rgba(16,24,40,0.1),0_30px_60px_-24px_rgba(11,20,36,0.75)] ring-1 ring-white/10 backdrop-blur-md sm:p-8">
              {/* Lit top edge. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
              {/* Internal light, so the panel is not one uniform dark value. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.3),transparent)] blur-2xl"
              />
              <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-brand-600 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.9)]">
                <Icon name="sparkle" className="h-5 w-5" />
              </span>
              <h3 className="relative mt-5 text-lg font-bold text-white">
                Is this a good idea for you?
              </h3>
              {/* Solid ink, not the 78%-alpha muted token — the panel is
                slightly translucent now, so the ground under the text varies
                a little and the alpha would eat the headroom. */}
              <p className="relative mt-3 text-sm leading-relaxed text-on-dark">
                {foundingCustomer.fitNote}
              </p>
              <Button
                href="/book-a-demo"
                size="lg"
                variant="onDark"
                className="group relative mt-6 shadow-[0_10px_26px_-10px_rgba(0,0,0,0.7)]"
              >
                {foundingCustomer.ctaLabel}
                <Icon name="arrow-right" className="ez-bob h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
