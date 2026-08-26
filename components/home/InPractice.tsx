import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/Section'

/* ============================================================================
 * "See it working" — three animated scenes from the EZER Visual Kit.
 *
 * These are the kit's `product/` (blue, #2563EB) variants, which is the same
 * hex this site already runs. The kit also ships a violet `marketing/` set;
 * its own BRAND-AUDIT.md flags that shipping both is the reason the pitch and
 * the product currently read as two companies, and recommends blue. That
 * matches the decision already made here, so the violet set is not used.
 *
 * WHY <img> AND NOT INLINE SVG
 *
 * Each file carries its own <style> block with the animation in it, so it
 * animates as a plain <img> with no JavaScript and no inlining — and, more
 * importantly, its @media (prefers-reduced-motion: reduce) rule travels with
 * it. Inlining them into the page would mean 3 × ~6KB of markup in the HTML
 * and hand-porting three reduced-motion blocks. As images they are cached,
 * lazy-loaded and self-contained.
 *
 * The scene files are the ones drawn from the app export, so the figures in
 * them — 398 employees, ₹4.82 Cr, the Factories Act rule set — are EZER's
 * own instance rather than invented numbers. CLAIMS.md lists those as
 * publishable today. The kit's chart/ files are NOT used anywhere: they ship
 * with placeholder benchmarks that its README says to replace before
 * publishing, and invented benchmarks on a live B2B site are a liability.
 * ========================================================================= */

const SCENES = [
  {
    src: '/kit/scenes/scene-payroll-close.svg',
    /* Descriptive, because the picture is carrying an argument rather than
       decorating one. A screen reader user should get the claim, not "image". */
    alt:
      'A payroll run closing for October — 398 employees, ₹4.82 crore net ' +
      'payable, progressing to issued.',
    title: 'The month closes in one pass',
    body:
      'Gross, deductions, employer contributions and every applicable statutory ' +
      'head calculated together, with a variance view against last month. You ' +
      'approve the differences rather than re-checking the whole file.',
  },
  {
    src: '/kit/scenes/scene-factory-punch.svg',
    alt:
      'A shop-floor punch-in against a Factories Act rule set, shift 09:30 to 18:30.',
    title: 'The rule set follows the location',
    body:
      'A plant runs on the Factories Act and a branch office on Shops & ' +
      'Establishments. Both sit in the same company, on the same employee ' +
      'master, and the shift rules applied are the ones the location actually ' +
      'falls under.',
  },
  {
    src: '/kit/scenes/scene-field-claim.svg',
    alt:
      'A field employee submitting a travel claim from a phone, with the GPS ' +
      'trail drawn beside them.',
    title: 'The claimed distance is not the paid distance',
    body:
      'Field staff see live distance on the phone, and that number never ' +
      'reaches the claim. The server re-measures the submitted trail on its ' +
      'own, prices it from the policy rate card, and flags implausible speeds ' +
      'or gaps in the trail before anyone approves it.',
  },
]

export function InPractice() {
  return (
    <section className="bg-surface py-12 sm:py-14 lg:py-16" aria-label="EZER in practice">
      <Container>
        <SectionHeading
          eyebrow="In practice"
          title="What it actually looks like on a working month"
          lede="Three of the moments the platform is built around — not screenshots of a settings page."
        />

        <ul className="mt-12 grid gap-8 lg:grid-cols-3">
          {SCENES.map((scene, i) => (
            <li
              key={scene.title}
              data-reveal=""
              style={{ transitionDelay: `${i * 90}ms` }}
              className="group flex flex-col overflow-hidden rounded-2xl bg-canvas ring-1 ring-ink-200 transition-shadow duration-300 hover:shadow-floating"
            >
              {/* Plain <img>, not next/image: these are SVGs whose animation
                  and reduced-motion rule live inside the file. Routing an SVG
                  through the image optimizer is a no-op at best, and the
                  optimizer is the thing that silently failed on the brand
                  mark earlier in this build. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scene.src}
                alt={scene.alt}
                width={600}
                height={430}
                loading="lazy"
                decoding="async"
                /* Fixed 3:2 box with object-contain. The three source files
                   are 600x420, 560x440 and 600x440 — left to their natural
                   heights the artwork bottoms out at three different points
                   and the headings below refuse to line up across the row. */
                className="aspect-[3/2] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-ink-900">{scene.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-600">
                  {scene.body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* The travel-claim flow is built but has never been run end to end —
            travel_claims is empty. So the copy above describes how it works
            and this line keeps it honest, rather than implying a track record
            that does not exist yet. */}
        <p className="mx-auto mt-8 max-w-3xl text-center text-[0.82rem] leading-relaxed text-ink-500">
          Illustrative. Figures shown are from EZER&rsquo;s own instance — three
          companies, 398 employees — not a customer&rsquo;s.
        </p>
      </Container>
    </section>
  )
}
