"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { moduleGroups } from "@/content/modules";
import { contact } from "@/site.config";
import { cn } from "@/lib/cn";

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
  | { kind: "link"; href: string; label: string }
  | {
      kind: "menu";
      id: string;
      label: string;
      match: string;
      /* Extra path prefixes that belong to this menu but do not share the
         primary `match` prefix. Without it /blog would leave Company unlit,
         which reads as "you are nowhere" on a page that is plainly under it. */
      alsoMatch?: string[];
      items: MenuLink[];
      footer?: MenuLink;
    };

type MenuLink = {
  href: string;
  label: string;
  desc?: string;
  icon?: IconName;
};

const productLinks: MenuLink[] = [
  {
    href: "/features/payroll",
    label: "Payroll & compliance",
    desc: "EPF, ESIC, PT, LWF, TDS, Form 16",
    icon: "wallet",
  },
  {
    href: "/features/attendance",
    label: "Attendance & leave",
    desc: "Shifts, overtime, regularisation",
    icon: "clock",
  },
  {
    href: "/features/recruitment",
    label: "Recruitment & onboarding",
    desc: "MRF workflow to signed offer",
    icon: "user-plus",
  },
  {
    href: "/features/ess",
    label: "Employee self-service",
    desc: "Payslips, leave, documents",
    icon: "users",
  },
  {
    href: "/features/claims",
    label: "Claims & travel",
    desc: "Flexi, proofs, GPS-measured trips",
    icon: "receipt",
  },
];

const companyLinks: MenuLink[] = [
  {
    href: "/about",
    label: "About us",
    desc: "Who builds EZER, and how early we are",
    icon: "briefcase",
  },
  {
    href: "/blog",
    label: "Blog",
    desc: "Labour codes, PF/ESIC/PT and the tax regimes",
    icon: "file",
  },
  {
    href: "/resources/policy-handbook",
    label: "Policy handbook",
    desc: "75 policies an Indian company needs",
    icon: "file",
  },
  {
    href: "/contact",
    label: "Contact",
    desc: "Sales, support and partnerships",
    icon: "phone",
  },
];

const NAV: NavItem[] = [
  {
    kind: "menu",
    id: "product",
    label: "Product",
    match: "/features",
    items: productLinks,
  },
  { kind: "link", href: "/compliance", label: "Compliance" },
  { kind: "link", href: "/industries", label: "Industries" },
  { kind: "link", href: "/pricing", label: "Pricing" },
  {
    kind: "menu",
    id: "company",
    label: "Company",
    match: "/about",
    /* /blog and /resources live under this menu but do not share the /about
       prefix, so the active state needs them named. */
    alsoMatch: ["/blog", "/resources"],
    items: companyLinks,
  },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /* One id rather than a boolean per menu — with two dropdowns, separate
   * flags let both be open at once, which looks broken. */
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    /* Only touch React state when the answer actually changes. scrollY does
     * not force layout, so the read is cheap — but calling setScrolled on
     * every event still hands React a render to consider dozens of times a
     * second, for a boolean that flips twice per page. */
    let last: boolean | null = null;
    const onScroll = () => {
      const next = window.scrollY > 8;
      if (next === last) return;
      last = next;
      setScrolled(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close everything on navigation — otherwise the mobile sheet stays open
   * over the page you just navigated to.
   *
   * Adjusted DURING render rather than in an effect. React re-runs this
   * component immediately with the menus already closed, so the new page
   * never paints with the old sheet over it for a frame.
   * https://react.dev/learn/you-might-not-need-an-effect */
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  /* A dropdown that only closes on click is a trap for keyboard users. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Lock the page behind the mobile sheet so the background does not scroll
   * under it on iOS. */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href;
  const inMenu = (n: Extract<NavItem, { kind: "menu" }>) =>
    [n.match, ...(n.alsoMatch ?? [])].some((m) => pathname.startsWith(m));

  /* ── The sliding indicator ───────────────────────────────────────────────
   *
   * One pill travels between nav items instead of each item fading in its own
   * background. A shared element moving reads as a single control responding
   * to you; per-item fades read as five unrelated buttons.
   *
   * Geometry is measured from the DOM rather than assumed, because the items
   * are text and their widths depend on the font that actually loaded. It is
   * read on hover only — never during scroll — so this cannot become the kind
   * of per-frame layout read that bogged the page down once before.
   */
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const [pillOn, setPillOn] = useState(false);

  const activeKey = NAV.find((n) =>
    n.kind === "link" ? isActive(n.href) : inMenu(n),
  );
  const activeId = activeKey
    ? activeKey.kind === "link"
      ? activeKey.href
      : activeKey.id
    : null;

  const moveTo = useCallback((key: string | null) => {
    const nav = navRef.current;
    const el = key ? itemRefs.current[key] : null;
    if (!nav || !el) {
      setPillOn(false);
      return;
    }
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ x: r.left - n.left, w: r.width });
    setPillOn(true);
  }, []);

  /* Park the pill on the current page's item, and re-measure when the route
     changes or the viewport resizes. */
  useEffect(() => {
    moveTo(activeId);
    const onResize = () => moveTo(activeId);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeId, moveTo]);

  return (
    <header
      className={cn(
        /* Only the two properties that actually change on scroll.
         * `transition-all` here made the browser watch every animatable
         * property on an element that repaints every frame while scrolling —
         * the textbook way to make a sticky header feel heavy. */
        "ez-header sticky top-0 z-50 border-b",
        /* relative so the progress bar can pin to this element's edge. */
        "relative",
        scrolled
          ? "border-ink-200/70 bg-surface/80 shadow-[0_8px_28px_-16px_rgba(16,24,40,0.4)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-surface",
      )}
    >
      {/* Reading progress, pinned to the header's bottom edge. Decorative
          and duplicated by the scrollbar, so it is out of the a11y tree. */}
      <span
        aria-hidden="true"
        className="ez-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand-600"
      />
      <Container>
        {/* Condenses on scroll — 4.5rem down to 3.75rem. Small enough that
            nobody notices it happening, large enough that the page feels like
            it gains room as you read. */}
        <div
          className={cn(
            "ez-header-row flex items-center justify-between gap-6",
            scrolled ? "h-16 lg:h-[4.5rem]" : "h-[4.5rem] lg:h-[5.5rem]",
          )}
        >
          <Logo showTagline="exceptLg" />

          {/* ── Desktop nav ─────────────────────────────────────────────── */}
          <nav
            ref={navRef}
            className="relative hidden shrink-0 items-center gap-0.5 lg:flex"
            aria-label="Main"
            onMouseLeave={() => moveTo(activeId)}
          >
            {/* The travelling pill. Decorative — the active page is already
                announced by aria-current on the link itself. */}
            <span
              aria-hidden="true"
              className="ez-navpill pointer-events-none absolute inset-y-1 rounded-lg bg-brand-50 ring-1 ring-brand-100"
              style={{
                transform: `translateX(${pill?.x ?? 0}px)`,
                width: pill?.w ?? 0,
                opacity: pillOn ? 1 : 0,
              }}
            />
            {NAV.map((item) =>
              item.kind === "link" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => {
                    itemRefs.current[item.href] = el;
                  }}
                  onMouseEnter={() => moveTo(item.href)}
                  onFocus={() => moveTo(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  data-active={isActive(item.href) ? "" : undefined}
                  className={cn(
                    "ez-navlink relative rounded-lg px-3 py-2.5 text-[0.95rem] font-semibold tracking-[-0.005em] transition-colors",
                    isActive(item.href)
                      ? "text-brand-700"
                      : "text-ink-600 hover:text-ink-900",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => {
                    setOpenMenu(item.id);
                    moveTo(item.id);
                  }}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      itemRefs.current[item.id] = el;
                    }}
                    onFocus={() => moveTo(item.id)}
                    data-active={
                      inMenu(item) || openMenu === item.id
                        ? ""
                        : undefined
                    }
                    className={cn(
                      "ez-navlink relative flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-[0.95rem] font-semibold tracking-[-0.005em] transition-colors",
                      inMenu(item)
                        ? "text-brand-700"
                        : "text-ink-600 hover:text-ink-900",
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
                        typeof window !== "undefined" &&
                        window.matchMedia("(hover: hover)").matches;
                      if (canHover && openMenu === item.id) return;
                      setOpenMenu((v) => (v === item.id ? null : item.id));
                    }}
                  >
                    {item.label}
                    <Icon
                      name="chevron-down"
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openMenu === item.id && "rotate-180",
                      )}
                    />
                  </button>

                  {openMenu === item.id && (
                    <div
                      className={cn(
                        "absolute top-full z-50 pt-3",
                        /* Company sits at the right end of the bar, so a
                           centred panel would overflow the viewport. */
                        item.id === "company"
                          ? "right-0 w-[20rem]"
                          : "left-1/2 w-[30rem] -translate-x-1/2",
                      )}
                    >
                      <div className="ez-menu rounded-xl bg-surface p-2 shadow-floating ring-1 ring-ink-200">
                        {item.items.map((link, li) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="ez-menu-row flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-brand-50"
                            /* 26ms apart: five rows finish arriving in about
                               140ms, which reads as the list assembling
                               without ever making someone wait for it. */
                            style={{ animationDelay: `${li * 26}ms` }}
                          >
                            {link.icon && (
                              <span className="ez-menu-icon mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-100 text-brand-700">
                                <Icon name={link.icon} className="h-5 w-5" />
                              </span>
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block text-[0.95rem] font-bold tracking-[-0.005em] text-ink-900">
                                {link.label}
                              </span>
                              {link.desc && (
                                <span className="mt-0.5 block text-[0.8rem] leading-snug text-ink-600">
                                  {link.desc}
                                </span>
                              )}
                            </span>
                            {/* Decorative: the row is already a link, so this
                                would only repeat its name to a screen reader. */}
                            <Icon
                              name="arrow-right"
                              aria-hidden="true"
                              className="ez-menu-go mt-2.5 h-3.5 w-3.5 shrink-0 text-brand-600"
                            />
                          </Link>
                        ))}

                        {item.id === "product" && (
                          <Link
                            href="/features"
                            className="mt-1 flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                          >
                            All{" "}
                            {moduleGroups.reduce(
                              (n, g) => n + g.modules.length,
                              0,
                            )}{" "}
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
          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            {/* The phone number. The handset tile fills on hover, so the
                whole thing reads as one control rather than an icon that
                happens to sit next to some text. */}
            <a
              href={`tel:${contact.phoneE164}`}
              className="group/tel ez-util flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-[0.95rem] font-bold tracking-[-0.005em] text-ink-900 hover:bg-brand-50 hover:text-brand-700"
            >
              <span className="ez-util grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100 group-hover/tel:bg-brand-600 group-hover/tel:text-white group-hover/tel:ring-brand-600">
                <Icon name="phone" className="h-4 w-4" />
              </span>
              {contact.phoneDisplay}
            </a>

            {/* The primary CTA — the single most important control in the
                header, so it carries the most: a gradient ground, a brand
                glow that deepens, a lift, and a shine that crosses it on
                hover. The arrow reuses ez-bob from the hero. */}
            <Link
              href="/book-a-demo"
              className="group/cta relative inline-flex shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-gradient-to-b from-brand-600 to-brand-700 px-6 py-3 text-[0.95rem] font-bold tracking-[-0.005em] text-white shadow-[0_1px_2px_rgba(16,24,40,0.06),0_10px_22px_-8px_rgba(37,99,235,0.6)] ring-1 ring-brand-700/40 transition-all duration-300 hover:-translate-y-0.5 hover:from-brand-500 hover:to-brand-600 hover:shadow-[0_2px_4px_rgba(16,24,40,0.08),0_18px_34px_-10px_rgba(37,99,235,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className="ez-cta-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 opacity-0"
              />
              <span className="relative">Book a Demo</span>
              <Icon name="arrow-right" className="ez-bob relative h-4 w-4" />
            </Link>
          </div>

          {/* ── Mobile actions ──────────────────────────────────────────── */}
          <div className="flex items-center gap-1 lg:hidden">
            <a
              href={`tel:${contact.phoneE164}`}
              className="grid h-10 w-10 place-items-center rounded-md text-brand-700 hover:bg-brand-50"
            >
              <Icon
                name="phone"
                className="h-5 w-5"
                title={`Call ${contact.phoneDisplay}`}
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-md text-ink-900 hover:bg-ink-100"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <Icon
                name={mobileOpen ? "close" : "menu"}
                className="h-6 w-6"
                title={mobileOpen ? "Close menu" : "Open menu"}
              />
            </button>
          </div>
        </div>
      </Container>

      {/* ── Mobile sheet ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="ez-drawer fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-ink-200 bg-surface lg:hidden"
        >
          <Container className="py-6">
            {/* The two qualifying questions come FIRST on mobile. On a phone
                the reader is usually mid-evaluation, and "do you cover my
                state" outranks a module list. */}
            <div className="space-y-1">
              {NAV.filter((i) => i.kind === "link").map((i) => {
                const link = i as Extract<NavItem, { kind: "link" }>;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-md p-3 text-[0.98rem] font-bold text-ink-900 hover:bg-ink-100"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {NAV.filter((i) => i.kind === "menu").map((i) => {
              const menu = i as Extract<NavItem, { kind: "menu" }>;
              return (
                <div
                  key={menu.id}
                  className="mt-6 border-t border-ink-200 pt-6"
                >
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
                    {menu.id === "product" && (
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
              );
            })}

            <div className="mt-6 flex items-center justify-between border-t border-ink-200 pt-6">
              <span className="text-sm font-semibold text-ink-900">Theme</span>
            </div>

            <div className="mt-6 space-y-3 pt-2">
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
  );
}
