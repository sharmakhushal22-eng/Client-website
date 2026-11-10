import { Container } from '@/components/ui/Container'
import { Doodle } from '@/components/graphics/Doodles'
import { Eyebrow } from '@/components/brand/Bars'

/* Accordion built on <details>/<summary>.
 *
 * No JavaScript, no useState, and it stays a server component — which means
 * the answers are in the HTML for a crawler even when collapsed, and the
 * FAQPage schema in §8.4 describes content that is genuinely on the page.
 * Keyboard behaviour and the expanded/collapsed announcement come from the
 * browser rather than from ARIA we would have to maintain.
 *
 * Laid out as an editorial split: the heading holds the left column (sticky
 * on desktop) and the questions run down the right on hairline rules. The
 * marker is a plus that turns to a cross — the one motion here. */
export function Faq({
  faqs,
  eyebrow = 'Before you ask on the call',
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
    <section
      aria-label="Frequently asked questions"
      className={`py-20 sm:py-24 lg:py-28 ${tone === 'tint' ? 'bg-paper-2' : 'bg-white'}`}
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 className="mt-5 text-[2.2rem] leading-[1.05] sm:text-[2.8rem]">{title}</h2>
              {lede && <p className="mt-4 max-w-sm text-[1rem] leading-relaxed text-ink-600">{lede}</p>}
              <div aria-hidden="true" className="relative mt-12 hidden h-40 lg:block">
                <Doodle kind="chat" className="absolute left-0 top-0 h-32 w-32" />
                <Doodle kind="coffee" delay={350} className="absolute left-36 top-12 h-24 w-24" />
              </div>
            </div>
          </div>

          <div className="border-t border-ink-900/10 lg:col-span-8">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-ink-900/10">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[1.12rem] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
                    {faq.q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="relative mt-1 h-5 w-5 shrink-0 transition-transform duration-500 [transition-timing-function:var(--m-settle)] group-open:rotate-45"
                  >
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 rounded-full bg-ink-900" />
                    <span className="absolute left-1/2 top-0 h-5 w-[1.5px] -translate-x-1/2 rounded-full bg-ink-900" />
                  </span>
                </summary>
                <p className="-mt-1 max-w-2xl pb-7 pr-12 text-[1rem] leading-relaxed text-ink-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
