'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Icon, type IconName } from '@/components/ui/Icon'
import { moduleGroups } from '@/content/modules'
import { contact } from '@/site.config'
import { cn } from '@/lib/cn'

/* ============================================================================
 * Sticky header — logo, nav, phone, Book a Demo.
 *
 * NAV SHAPE, and why it changed.
 *
 * It used to be: Features ▾ · Pricing · About · Contact.
 *
 * That buried the two things an Indian HRMS buyer actually navigates by.
 * They arrive asking "do you handle my state's PT and LWF?" and "do you know
 * my sector?" — and both answers existed only as sections inside the home
 * page, with no URL, so neither could be linked in a sales email, cited by a
 * consultant, or found by someone searching for them.
 *
 * Now: Product ▾ · Compliance · Industries · Pricing · Company ▾
 *
 *   · "Product" rather than "Features" — buyers say product; features is
 *     what a vendor calls it.
 *   · Compliance and Industries are top level because they are the two
 *     qualifying questions, not sub-topics of the product.
 *   · About and Contact collapse into Company. They are not selling items,
 *     and they were taking room from ones that are.
 *
 * Five items, which is what the original single-file site carried too.
 * ========================================================================= */

type NavItem =
  | { kind: 'link'; href: string; label: string }
  | { kind: 'menu'; id: string; label: string; match: string; items: MenuLink[]; footer?: MenuLink }

type MenuLink = {
  href: string
  label: string
  desc?: string
  icon?: IconName
}

const productLinks: MenuLink[] = [
  { href: '/features/payroll', label: 'Payroll & compliance', desc: 'EPF, ESIC, PT, LWF, TDS, Form 16', icon: 'wallet' },
  { href: '/features/attendance', label: 'Attendance & leave', desc: 'Shifts, overtime, regularisation', icon: 'clock' },
  { href: '/features/recruitment', label: 'Recruitment & onboarding', desc: 'MRF workflow to signed offer', icon: 'user-plus' },
  { href: '/features/ess', label: 'Employee self-service', desc: 'Payslips, leave, documents', icon: 'users' },
  { href: '/features/claims', label: 'Claims & travel', desc: 'Flexi, proofs, GPS-measured trips', icon: 'receipt' },
]

const companyLinks: MenuLink[] = [
  { href: '/about', label: 'About us', desc: 'Who builds EZER, and how early we are', icon: 'briefcase' },
  { href: '/resources/policy-handbook', label: 'Policy handbook', desc: '75 policies an Indian company needs', icon: 'file' },
  { href: '/contact', label: 'Contact', desc: 'Sales, support and partnerships', icon: 'phone' },
]

const NAV: NavItem[] = [
  { kind: 'menu', id: 'product', label: 'Product', match: '/features', items: productLinks },
  { kind: 'link', href: '/compliance', label: 'Compliance' },
  { kind: 'link', href: '/industries', label: 'Industries' },
  { kind: 'link', href: '/pricing', label: 'Pricing' },
  { kind: 'menu', id: 'company', label: 'Company', match: '/about', items: companyLinks },
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  /* One id rather than a boolean per menu — with two dropdowns, separate
   * flags let both be open at once, which looks broken. */
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close everything on navigation — otherwise the mobile sheet stays open
   * over the page you just navigated to.
   *
   * Adjusted DURING render rather than in an effect. React re-runs this
   * component immediately with the menus already closed, so the new page
   * never paints with the old sheet over it for a frame.
   * https://react.dev/learn/you-might-not-need-an-effect */
  const [renderedPath, setRenderedPath] = useState(pathname)
  if (pathname !== renderedPath) {
    setRenderedPath(pathname)
    setMobileOpen(false)
    setOpenMenu(null)
  }

  /* A dropdown that only closes on click is a trap for keyboard users. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null)
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

  const isActive = (href: string) => pathname === href

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
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {NAV.map((item) =>
              item.kind === 'link' ? (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-brand-700'
                      : 'text-ink-600 hover:text-ink-900',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.id)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    className={cn(
                      'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      pathname.startsWith(item.match)
                        ? 'text-brand-700'
                        : 'text-ink-600 hover:text-ink-900',
                    )}
                    aria-expanded={openMenu === item.id}
                    aria-haspopup="true"
                    onClick={() => {
                      /* On a hover-capable device onMouseEnter has ALREADY
                       * opened this menu by the time the click lands, so a
                       * plain toggle here closes it again — the menu appears,
                       * then vanishes the moment you click it.
                       *
                       * So the click only acts when hover could not have done
                       * the work: on touch (no hover), or from the keyboard
                       * (focus fires no mouseenter, so the menu is still
                       * closed). Esc closes in every mode. */
                      const canHover =
                        typeof window !== 'undefined' &&
                        window.matchMedia('(hover: hover)').matches
                      if (canHover && openMenu === item.id) return
                      setOpenMenu((v) => (v === item.id ? null : item.id))
                    }}
                  >
                    {item.label}
                    <Icon
                      name="chevron-down"
                      className={cn(
                        'h-4 w-4 transition-transform',
                        openMenu === item.id && 'rotate-180',
                      )}
                    />
                  </button>

                  {openMenu === item.id && (
                    <div
                      className={cn(
                        'absolute top-full z-50 pt-3',
                        /* Company sits at the right end of the bar, so a
                           centred panel would overflow the viewport. */
                        item.id === 'company'
                          ? 'right-0 w-[20rem]'
                          : 'left-1/2 w-[30rem] -translate-x-1/2',
                      )}
                    >
                      <div className="rounded-xl bg-white p-2 shadow-floating ring-1 ring-ink-200">
                        {item.items.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-brand-50"
                          >
                            {link.icon && (
                              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-100 text-brand-700">
                                <Icon name={link.icon} className="h-5 w-5" />
                              </span>
                            )}
                            <span>
                              <span className="block text-sm font-semibold text-ink-900">
                                {link.label}
                              </span>
                              {link.desc && (
                                <span className="block text-xs text-ink-600">
                                  {link.desc}
                                </span>
                              )}
                            </span>
                          </Link>
                        ))}

                        {item.id === 'product' && (
                          <Link
                            href="/features"
                            className="mt-1 flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                          >
                            All{' '}
                            {moduleGroups.reduce((n, g) => n + g.modules.length, 0)}{' '}
                            modules
                            <Icon name="arrow-right" className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </nav>

          {/* ── Desktop actions ─────────────────────────────────────────── */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${contact.phoneE164}`}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-ink-900 transition-colors hover:text-brand-700"
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
              className="grid h-10 w-10 place-items-center rounded-md text-brand-700 hover:bg-brand-50"
            >
              <Icon name="phone" className="h-5 w-5" title={`Call ${contact.phoneDisplay}`} />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-md text-ink-900 hover:bg-ink-100"
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
            {/* The two qualifying questions come FIRST on mobile. On a phone
                the reader is usually mid-evaluation, and "do you cover my
                state" outranks a module list. */}
            <div className="space-y-1">
              {NAV.filter((i) => i.kind === 'link').map((i) => {
                const link = i as Extract<NavItem, { kind: 'link' }>
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-md p-3 text-[0.98rem] font-bold text-ink-900 hover:bg-ink-100"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {NAV.filter((i) => i.kind === 'menu').map((i) => {
              const menu = i as Extract<NavItem, { kind: 'menu' }>
              return (
                <div key={menu.id} className="mt-6 border-t border-ink-200 pt-6">
                  <p className="px-1 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-600">
                    {menu.label}
                  </p>
                  <div className="space-y-1">
                    {menu.items.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 rounded-md p-3 hover:bg-brand-50"
                      >
                        {link.icon && (
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-100 text-brand-700">
                            <Icon name={link.icon} className="h-5 w-5" />
                          </span>
                        )}
                        <span className="text-[0.95rem] font-semibold text-ink-900">
                          {link.label}
                        </span>
                      </Link>
                    ))}
                    {menu.id === 'product' && (
                      <Link
                        href="/features"
                        className="flex items-center gap-1.5 rounded-md p-3 text-[0.95rem] font-semibold text-brand-700 hover:bg-brand-50"
                      >
                        All modules
                        <Icon name="arrow-right" className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}

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
