import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button, Arrow } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Eyebrow } from '@/components/brand/Bars'
import { contact } from '@/site.config'

/* Spec §8.4 — "404 page with navigation, not a dead end."
 *
 * The number set huge in the display face, the way the hero sets the name,
 * and the six places most people were heading as a ruled list. */

const destinations = [
  { href: '/features', label: 'All features', desc: 'Every module in the product' },
  { href: '/features/payroll', label: 'Payroll & compliance', desc: 'EPF, ESIC, PT, LWF, TDS' },
  { href: '/pricing', label: 'Pricing', desc: 'One plan and a headcount calculator' },
  { href: '/book-a-demo', label: 'Book a demo', desc: '30 minutes, your own scenario' },
  { href: '/about', label: 'About EZER', desc: 'Who builds this, and why' },
  { href: '/contact', label: 'Contact', desc: 'Phone and WhatsApp' },
]

export default function NotFound() {
  return (
    <section className="ez-hero bg-paper">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Eyebrow animate>Page not found</Eyebrow>
            <p
              aria-hidden="true"
              className="mt-6 font-display text-[8rem] font-[820] leading-[0.8] tracking-[-0.06em] text-ink-900/[0.08] [font-stretch:125%] sm:text-[11rem]"
            >
              <span className="ez-line"><span data-word="404" className="ez-wordmark" /></span>
            </p>
            <h1 className="mt-6 text-[2.2rem] leading-[1.05] sm:text-[3rem]">That page is not here.</h1>
            <p data-h="fade" className="mt-5 max-w-md text-[1.08rem] leading-relaxed text-ink-600">
              Either the link is wrong or we moved something. Here is where most people
              were heading.
            </p>
            <div data-h="fade" style={{ '--d': '500ms' } as React.CSSProperties} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/" size="lg">
                Back to the home page
                <Arrow />
              </Button>
              <Button href={`tel:${contact.phoneE164}`} variant="secondary" size="lg">
                <Icon name="phone" className="h-4 w-4" />
                {contact.phoneDisplay}
              </Button>
            </div>
          </div>

          <ul className="border-t border-ink-900/10 lg:col-span-5 lg:col-start-8 lg:self-end">
            {destinations.map((item) => (
              <li key={item.href} className="border-b border-ink-900/10">
                <Link href={item.href} className="group flex items-center justify-between gap-4 py-5">
                  <span>
                    <span className="block text-[1.05rem] font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
                      {item.label}
                    </span>
                    <span className="block text-[0.88rem] text-ink-500">{item.desc}</span>
                  </span>
                  <span className="text-ink-400 transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-brand-700">
                    <Arrow className="h-5 w-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
