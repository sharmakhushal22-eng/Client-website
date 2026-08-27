import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'

/* Accordion built on <details>/<summary>.
 *
 * No JavaScript, no useState, and it stays a server component — which means
 * the answers are in the HTML for a crawler even when collapsed, and the
 * FAQPage schema in §8.4 describes content that is genuinely on the page.
 * Keyboard behaviour and the expanded/collapsed announcement come from the
 * browser rather than from ARIA we would have to maintain. */
export function Faq({
  faqs,
  eyebrow = 'Before you ask on the call',
  /* The eyebrow above already says "before the call"; the title saying it
     again read as one thought split over two lines. */
  title = 'Common questions',
  lede,
  tone = 'white',
}: {
  faqs: { q: string; a: string }[]
  eyebrow?: string
  title?: string
  lede?: string
  tone?: 'white' | 'tint'
}) {
  return (
    <Section tone={tone} ariaLabel="Frequently asked questions">
      <SectionHeading eyebrow={eyebrow} title={title} lede={lede} />

      <div className="mx-auto mt-10 max-w-3xl divide-y divide-ink-200 border-y border-ink-200">
        {faqs.map((faq) => (
          <details key={faq.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
              <h3 className="text-[1.05rem] font-semibold leading-snug text-ink-900">
                {faq.q}
              </h3>
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition-transform group-open:rotate-180">
                <Icon name="chevron-down" className="h-4 w-4" />
              </span>
            </summary>
            <p className="mt-3 max-w-2xl pr-12 text-[0.95rem] leading-relaxed text-ink-600">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  )
}
