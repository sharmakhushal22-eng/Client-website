import { Section, SectionHeading } from '@/components/ui/Section'
import { ScreenshotFrame } from '@/components/ui/ScreenshotFrame'
import { productTour } from '@/content/home'

/* Spec §4.1 §8 — "3–4 real screenshots with captions. Real UI only. No
 * invented dashboards." Until the images exist, ScreenshotFrame renders an
 * explicitly-unfinished placeholder rather than a fabricated screen. */
export function ProductTour() {
  /* Four empty frames is ~2,000px of blank page. Outcomes and SocialProof
     already hide themselves while their content is unready; this section was
     the one exception, and it was the single largest block of dead space on
     the home page. Drop real images into content/home.ts and it returns. */
  const live = productTour.filter((shot) => shot.src)
  if (live.length === 0) return null

  return (
    <Section tone="tint" ariaLabel="Product tour">
      <SectionHeading
        eyebrow="See it working"
        title="The actual product, not a mockup"
        lede="The screens that carry most of the month. Every figure shown is from a demo company — no customer data appears on this site."
      />

      <div className="mt-10 space-y-12 lg:space-y-16">
        {live.map((shot, i) => (
          <div
            key={shot.title}
            data-reveal=""
            className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
              /* Alternate sides so the eye zig-zags down the page instead of
                 scanning one straight column. */
              i % 2 === 1 ? 'lg:[&>figure]:order-first' : ''
            }`}
          >
            <div className={i % 2 === 1 ? 'lg:order-last' : ''}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
                {shot.title}
              </h3>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-600">
                {shot.caption}
              </p>
            </div>

            <ScreenshotFrame src={shot.src || undefined} alt={shot.alt} />
          </div>
        ))}
      </div>
    </Section>
  )
}
