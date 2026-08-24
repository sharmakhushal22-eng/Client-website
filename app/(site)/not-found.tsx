import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { contact } from '@/site.config'

/* Spec §8.4 — "404 page with navigation, not a dead end." */

const destinations = [
  { href: '/features', label: 'All features', desc: 'Every module in the product' },
  { href: '/features/payroll', label: 'Payroll & compliance', desc: 'EPF, ESIC, PT, LWF, TDS' },
  { href: '/pricing', label: 'Pricing', desc: 'Tiers and a headcount calculator' },
  { href: '/book-a-demo', label: 'Book a demo', desc: '30 minutes, your own scenario' },
  { href: '/about', label: 'About EZER', desc: 'Who builds this, and why' },
  { href: '/contact', label: 'Contact', desc: 'Phone, email and WhatsApp' },
]

export default function NotFound() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-6xl font-bold text-brand-600 sm:text-7xl">404</p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
          That page is not here
        </h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-600">
          Either the link is wrong or we moved something. Here is where most
          people were heading.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
        {destinations.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between gap-4 rounded-xl bg-white p-5 ring-1 ring-ink-200 transition-shadow hover:shadow-md hover:ring-brand-200"
          >
            <span>
              <span className="block text-sm font-bold text-ink-900">{item.label}</span>
              <span className="block text-xs text-ink-500">{item.desc}</span>
            </span>
            <Icon
              name="arrow-right"
              className="h-4 w-4 shrink-0 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl text-center">
        <p className="text-sm text-ink-600">Or just ask us.</p>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Back to the home page
          </Button>
          <Button href={`tel:${contact.phoneE164}`} variant="secondary" size="lg">
            <Icon name="phone" className="h-4 w-4" />
            {contact.phoneDisplay}
          </Button>
        </div>
      </div>
    </Container>
  )
}
