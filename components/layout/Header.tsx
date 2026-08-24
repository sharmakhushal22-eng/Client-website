'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { moduleGroups } from '@/content/modules'
import { contact } from '@/site.config'
import { cn } from '@/lib/cn'

/* Spec §4.1 §1 — sticky header, logo, nav with a Features dropdown, phone
 * number, and a Book a Demo button. The phone is a tap-to-call icon on
 * mobile, where it is the highest-intent control on the page. */

const featureLinks = [
  { href: '/features/payroll', label: 'Payroll & compliance', desc: 'EPF, ESIC, PT, LWF, TDS, Form 16', icon: 'wallet' as const },
  { href: '/features/attendance', label: 'Attendance & leave', desc: 'Shifts, overtime, regularisation', icon: 'clock' as const },
  { href: '/features/recruitment', label: 'Recruitment & onboarding', desc: 'MRF workflow to signed offer', icon: 'user-plus' as const },
  { href: '/features/ess', label: 'Employee self-service', desc: 'Payslips, leave, documents', icon: 'users' as const },
  { href: '/features/claims', label: 'Claims & travel', desc: 'Flexi, proofs, GPS-measured trips', icon: 'receipt' as const },
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close everything on navigation — otherwise the mobile sheet stays open
   * over the page you just navigated to.
   *
   * Adjusted DURING render rather than in an effect. This is React's
   * documented pattern for resetting state when a prop changes, and it is
   * better here than an effect: React re-runs this component immediately with
   * the menus already closed, so the new page never paints with the old
   * sheet over it for a frame.
   * https://react.dev/learn/you-might-not-need-an-effect */
  const [renderedPath, setRenderedPath] = useState(pathname)
  if (pathname !== renderedPath) {
    setRenderedPath(pathname)
    setMobileOpen(false)
    setFeaturesOpen(false)
  }

  /* A dropdown that only closes on click is a trap for keyboard users. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFeaturesOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  /* Lock the page behind the mobile sheet so the background does not scroll
   * under it on iOS. */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const navLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={cn(
        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        pathname === href
          ? 'text-brand-700'
          : 'text-ink-600 hover:text-ink-900',
      )}
      aria-current={pathname === href ? 'page' : undefined}
    >
      {label}
    </Link>
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-200',
        scrolled
          ? 'border-ink-200/80 bg-white/90 backdrop-blur-md'
          : 'border-transparent bg-white',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Logo showTagline={false} />

          {/* ── Desktop nav ─────────────────────────────────────────────── */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  pathname.startsWith('/features')
                    ? 'text-brand-700'
                    : 'text-ink-600 hover:text-ink-900',
                )}
                aria-expanded={featuresOpen}
                aria-haspopup="true"
                onClick={() => setFeaturesOpen((v) => !v)}
              >
                Features
                <Icon
                  name="chevron-down"
                  className={cn(
                    'h-4 w-4 transition-transform',
                    featuresOpen && 'rotate-180',
                  )}
                />
              </button>

              {featuresOpen && (
                <div className="absolute left-1/2 top-full z-50 w-[30rem] -translate-x-1/2 pt-3">
                  <div className="rounded-2xl bg-white p-2 shadow-xl shadow-ink-900/10 ring-1 ring-ink-200">
                    {featureLinks.map((f) => (
                      <Link
                        key={f.href}
                        href={f.href}
                        className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-brand-50"
                      >
                        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700">
                          <Icon name={f.icon} className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink-900">
                            {f.label}
                          </span>
                          <span className="block text-xs text-ink-500">{f.desc}</span>
                        </span>
                      </Link>
                    ))}
                    <Link
                      href="/features"
                      className="mt-1 flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      All {moduleGroups.reduce((n, g) => n + g.modules.length, 0)} modules
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLink('/pricing', 'Pricing')}
            {navLink('/about', 'About')}
            {navLink('/contact', 'Contact')}
          </nav>

          {/* ── Desktop actions ─────────────────────────────────────────── */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${contact.phoneE164}`}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-ink-900 transition-colors hover:text-brand-700"
            >
              <Icon name="phone" className="h-4 w-4 text-brand-600" />
              {contact.phoneDisplay}
            </a>
            <Button href="/book-a-demo">Book a Demo</Button>
          </div>

          {/* ── Mobile actions ──────────────────────────────────────────── */}
          <div className="flex items-center gap-1 lg:hidden">
            <a
              href={`tel:${contact.phoneE164}`}
              className="grid h-10 w-10 place-items-center rounded-lg text-brand-700 hover:bg-brand-50"
            >
              <Icon name="phone" className="h-5 w-5" title={`Call ${contact.phoneDisplay}`} />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-lg text-ink-900 hover:bg-ink-100"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <Icon
                name={mobileOpen ? 'close' : 'menu'}
                className="h-6 w-6"
                title={mobileOpen ? 'Close menu' : 'Open menu'}
              />
            </button>
          </div>
        </div>
      </Container>

      {/* ── Mobile sheet ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-ink-200 bg-white lg:hidden"
        >
          <Container className="py-6">
            <p className="px-1 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-400">
              Features
            </p>
            <div className="space-y-1">
              {featureLinks.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-brand-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700">
                    <Icon name={f.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-[0.95rem] font-semibold text-ink-900">
                    {f.label}
                  </span>
                </Link>
              ))}
              <Link
                href="/features"
                className="flex items-center gap-1.5 rounded-xl p-3 text-[0.95rem] font-semibold text-brand-700 hover:bg-brand-50"
              >
                All modules
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-1 border-t border-ink-200 pt-6">
              {[
                ['/pricing', 'Pricing'],
                ['/about', 'About'],
                ['/contact', 'Contact'],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-xl p-3 text-[0.95rem] font-semibold text-ink-900 hover:bg-ink-100"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-ink-200 pt-6">
              <Button href="/book-a-demo" size="lg" className="w-full">
                Book a Demo
              </Button>
              <Button
                href={`tel:${contact.phoneE164}`}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                <Icon name="phone" className="h-4 w-4" />
                {contact.phoneDisplay}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
