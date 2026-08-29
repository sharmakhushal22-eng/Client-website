"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./Brand";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { getFeaturePage } from '@/content/features';
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

/* Icons for the eight module areas, mirroring ModuleSections so the same area
   carries the same glyph wherever it appears. */
const moduleAreaIcons: Record<string, IconName> = {
  hire: "briefcase",
  plan: "chart",
  onboard: "user-plus",
  time: "clock",
  pay: "wallet",
  ess: "users",
  travel: "receipt",
  exit: "shield",
};

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
  /* The product row the preview pane is showing. Hovering or focusing a row
     swaps it; leaving the menu resets to the first product, so the pane is
     never blank while the menu is open. */
  const [previewHref, setPreviewHref] = useState<string | null>(null);

  /* The "All N modules" row previews the whole catalogue rather than one
     product, so it needs a value that is not a product href. */
  const ALL_MODULES = "__all__";

  /* Which module area is expanded into the third panel. */
  const [openArea, setOpenArea] = useState<string | null>(null);

  /* CLOSING IS DELAYED, OPENING IS NOT.
   *
   * A submenu has to survive the pointer travelling to it. The third panel
   * sits to the RIGHT of its row, so the pointer necessarily leaves the row
   * to reach it — clearing on mouseleave immediately would shut the panel
   * on the way to itself. So leaving schedules a close, and entering
   * anything that should keep it open cancels that. 160ms is long enough to
   * cross the gap and short enough that a panel never lingers after the
   * pointer has genuinely moved on.
   *
   * The same applies one level up: leaving a product row returns the pane to
   * its neutral state rather than leaving the last product showing. */
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(
    (what: "area" | "preview") => {
      cancelClose();
      closeTimer.current = setTimeout(() => {
        if (what === "area") setOpenArea(null);
        else {
          setPreviewHref(null);
          setOpenArea(null);
        }
      }, 160);
    },
    [cancelClose],
  );

  /* A pending close must not fire into an unmounted menu. */
  useEffect(() => cancelClose, [cancelClose]);

  /* Which item the pill is currently over. The pill is a single shared
     element sliding behind the row, so the label it lands on has no way to
     know it is being covered — this is what lets that one label invert to
     white while the others stay ink. */
  const [pillKey, setPillKey] = useState<string | null>(null);

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
      setPillKey(null);
      return;
    }
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ x: r.left - n.left, w: r.width });
    setPillOn(true);
    setPillKey(key);
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
          <Brand />

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
              /* Filled, in the same gradient as the Book a Demo button, so
                 the two brand-coloured things in the bar belong to one
                 family. It was a flat brand-50 tint with a hairline ring —
                 legible, but it read as a disabled chip rather than as the
                 thing tracking the cursor. */
              className="ez-navpill pointer-events-none absolute inset-y-1 rounded-full bg-gradient-to-b from-brand-600 to-brand-700 shadow-[0_1px_2px_rgba(16,24,40,0.08),0_8px_18px_-8px_rgba(37,99,235,0.65)] ring-1 ring-brand-700/40"
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
                  data-on-pill={
                    pillOn && pillKey === item.href ? "" : undefined
                  }
                  className={cn(
                    "ez-navlink relative rounded-full px-3.5 py-2.5 text-[0.95rem] font-semibold tracking-[-0.005em] transition-colors duration-200",
                    pillOn && pillKey === item.href
                      ? "text-white"
                      : isActive(item.href)
                        ? "text-brand-700"
                        : "text-ink-700",
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
                  onMouseLeave={() => {
                    setOpenMenu(null);
                    setPreviewHref(null);
                    setOpenArea(null);
                  }}
                  /* The keyboard twin of onMouseLeave. Without this the menu
                     stays open behind a keyboard user for the rest of the
                     page: Escape closes it, but Tab — the key someone
                     actually presses to move on — did not. React's onBlur is
                     a delegated focusout, so it fires for the button and for
                     every link inside; the containment check is what keeps
                     moving BETWEEN them from closing the menu. */
                  onBlur={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget)) return;
                    setOpenMenu(null);
                    setPreviewHref(null);
                    setOpenArea(null);
                  }}
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
                    data-on-pill={
                      pillOn && pillKey === item.id ? "" : undefined
                    }
                    className={cn(
                      "ez-navlink relative flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[0.95rem] font-semibold tracking-[-0.005em] transition-colors duration-200",
                      pillOn && pillKey === item.id
                        ? "text-white"
                        : inMenu(item)
                          ? "text-brand-700"
                          : "text-ink-700",
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
                    {/* The rotation is CSS off aria-expanded now, so the
                        open state has one source of truth instead of two
                        that can disagree. Slightly smaller and set back in
                        opacity: it is punctuation, not a second label. */}
                    <Icon
                      name="chevron-down"
                      className="ez-nav-chev h-3.5 w-3.5 opacity-70"
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
                          : item.id === "product"
                            /* Left-anchored at xl, not centred: the preview
                               pane takes this to 46rem, and a panel that
                               wide centred on a button near the left of the
                               bar hangs off the viewport. */
                            ? "left-1/2 w-[30rem] -translate-x-1/2 xl:left-0 xl:w-[46rem] xl:translate-x-0"
                            : "left-1/2 w-[30rem] -translate-x-1/2",
                      )}
                    >
                      <div
                        className="ez-menu relative grid rounded-xl bg-surface p-2 shadow-floating ring-1 ring-ink-200 xl:grid-cols-[1fr_1fr] xl:gap-1"
                      >
                        <div className="min-w-0">
                        {item.items.map((link, li) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onMouseEnter={() => {
                              cancelClose();
                              setPreviewHref(link.href);
                              setOpenArea(null);
                            }}
                            onMouseLeave={() => scheduleClose("preview")}
                            onFocus={() => {
                              cancelClose();
                              setPreviewHref(link.href);
                              setOpenArea(null);
                            }}
                            onBlur={() => scheduleClose("preview")}
                            data-previewing={
                              item.id === "product" && previewHref === link.href
                                ? ""
                                : undefined
                            }
                            className="ez-menu-row flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-brand-50 data-[previewing]:bg-brand-50"
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

                          {/* Lives INSIDE the left column, not in a row
                              spanning underneath the preview pane. It used to
                              span both, which put it in the grid's SECOND row
                              — so its position depended on the height of the
                              pane above it. Pointing at it swapped the pane to
                              the 8-area catalogue, that row grew 112px, and
                              this link was pushed 112px down, out from under
                              the very pointer that was hovering it. mouseleave
                              fired, the pane reverted, the link snapped back
                              under the pointer, mouseenter fired: a blink that
                              sustained itself for as long as you pointed at it.
                              In the left column its position depends only on
                              the five links above it, which never change. */}
                          {item.id === "product" && (
                            <Link
                              href="/features"
                              /* setOpenArea(null) matters as much as the
                                 rest: arriving here CANCELS the close that
                                 leaving an area row just scheduled, so
                                 without it the third panel survives a trip
                                 back to this row and hangs open with nothing
                                 pointing at it. The five product rows above
                                 already clear it for the same reason. */
                              onMouseEnter={() => {
                                cancelClose();
                                setPreviewHref(ALL_MODULES);
                                setOpenArea(null);
                              }}
                              onMouseLeave={() => scheduleClose("preview")}
                              onFocus={() => {
                                cancelClose();
                                setPreviewHref(ALL_MODULES);
                                setOpenArea(null);
                              }}
                              onBlur={() => scheduleClose("preview")}
                              data-previewing={
                                previewHref === ALL_MODULES ? "" : undefined
                              }
                              className="mt-1 flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 data-[previewing]:bg-brand-50"
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

                        {/* ── The preview pane ───────────────────────────
                            Shows the hovered row's product without leaving
                            the menu. Holds a neutral resting state until a
                            row is actually pointed at — see the note inside.

                            xl only. Below that the header has no room for a
                            46rem panel — see the anchoring note above — and
                            the menu stays the single list it has always
                            been.

                            aria-hidden: every word here also appears on the
                            page the row links to, and a pane that silently
                            rewrites itself as focus moves down a list is
                            noise to a screen reader, not information. The
                            rows remain the accessible interface. */}
                        {item.id === "product" && (() => {
                          /* NO FALLBACK TO THE FIRST PRODUCT.
                           *
                           * This used to default to item.items[0], so merely
                           * opening the menu showed Payroll already expanded
                           * and its row already highlighted — which reads as
                           * a selection the reader did not make, and hides
                           * the fact that the pane responds to pointing at
                           * all. It now holds a neutral state until a row is
                           * actually pointed at. */
                          const showingAll = previewHref === ALL_MODULES;
                          const page =
                            previewHref && !showingAll
                              ? getFeaturePage(previewHref.replace("/features/", ""))
                              : null;
                          /* The pane fills the right half of the panel at
                             full height. It used to be absolutely positioned
                             and aligned to whichever row was pointed at,
                             which meant it moved every time the pointer did —
                             restless, and it made the panel's height depend
                             on where you were. One steady pane reads better
                             and cannot overflow. */
                          return (
                            <div
                              className="hidden min-w-0 xl:block"
                              onMouseEnter={cancelClose}
                              onMouseLeave={() => scheduleClose("preview")}
                            >
                              <div
                                aria-hidden="true"
                                className="flex h-full flex-col rounded-lg bg-brand-50/60 p-5 ring-1 ring-brand-100"
                              >
                              {showingAll && (
                                /* THE WHOLE CATALOGUE, BY AREA.
                                 *
                                 * Not 32 rows. The module names in
                                 * moduleGroups are full sentences — up to 101
                                 * characters — because they are the bullets
                                 * the feature pages render. Thirty-two of
                                 * those is a page, not a hover panel.
                                 *
                                 * The eight areas ARE the 32, grouped, and
                                 * each carries its own count, so the panel
                                 * shows the whole shape of the catalogue and
                                 * stays scannable at a glance. The row still
                                 * links to /features for the full list. */
                                <div key="all" className="ez-preview">
                                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-700">
                                    The whole platform
                                  </p>
                                  <h3 className="mt-1.5 text-[1.05rem] font-bold leading-snug text-ink-900">
                                    {moduleGroups.length} areas,{" "}
                                    {moduleGroups.reduce(
                                      (n, g) => n + g.modules.length,
                                      0,
                                    )}{" "}
                                    modules
                                  </h3>
                                  {/* One column, not two. An expanding row
                                      in a two-column grid pushes its
                                      neighbour down and the whole block
                                      jitters as the pointer moves. */}
                                  <ul className="mt-3 min-h-0 flex-1 space-y-0.5 overflow-y-auto border-t border-brand-100 pt-3">
                                    {moduleGroups.map((g, gi) => (
                                      <li
                                        key={g.id}
                                        className="ez-preview-row"
                                        style={{ animationDelay: `${gi * 30}ms` }}
                                      >
                                        {/* Opening the third panel is the
                                            row's whole job — it carries no
                                            expansion of its own. */}
                                        <div
                                          onMouseEnter={() => {
                                            cancelClose();
                                            setOpenArea(g.id);
                                          }}
                                          onMouseLeave={() => scheduleClose("area")}
                                          data-open={openArea === g.id ? "" : undefined}
                                          className="flex items-center gap-2 rounded-md px-1.5 py-1.5 text-[0.78rem] leading-snug text-ink-800 transition-colors data-[open]:bg-brand-100/70"
                                        >
                                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand-100 text-brand-700">
                                            <Icon
                                              name={moduleAreaIcons[g.id] ?? "check"}
                                              className="h-3.5 w-3.5"
                                            />
                                          </span>
                                          <span className="min-w-0 flex-1 truncate font-semibold">
                                            {g.name}
                                          </span>
                                          <span className="shrink-0 text-[0.72rem] font-bold text-brand-700">
                                            {g.modules.length}
                                          </span>
                                          {/* The affordance that says there is
                                              another level to the right. */}
                                          <Icon
                                            name="chevron-down"
                                            className="h-3 w-3 shrink-0 -rotate-90 text-brand-600 opacity-0 transition-opacity data-[open]:opacity-100 group-data-[open]:opacity-100"
                                          />
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                  <span className="mt-3 inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-brand-700">
                                    See every module in detail
                                    <Icon name="arrow-right" className="h-3.5 w-3.5" />
                                  </span>
                                </div>
                              )}

                              {!page && !showingAll && (
                                /* The resting state. It fills the pane so the
                                   panel is not half empty, and says what the
                                   pane is for, without standing in for any
                                   one product. */
                                <div className="ez-preview flex h-full flex-col justify-center text-center">
                                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700">
                                    <Icon name="sparkle" className="h-5 w-5" />
                                  </span>
                                  <p className="mt-3 text-[0.9rem] font-bold text-ink-900">
                                    {moduleGroups.reduce(
                                      (n, g) => n + g.modules.length,
                                      0,
                                    )}{" "}
                                    modules, one employee master
                                  </p>
                                  <p className="mx-auto mt-1.5 max-w-[15rem] text-[0.8rem] leading-relaxed text-ink-600">
                                    Point at any of them to see what it covers.
                                  </p>
                                </div>
                              )}
                              {/* key on the slug so React swaps the subtree,
                                  which restarts the entrance animation — the
                                  crossfade is what makes this read as one
                                  pane changing rather than text popping. */}
                              {page && (
                              <div key={page.slug} className="ez-preview">
                                <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-700">
                                  {page.eyebrow}
                                </p>
                                <h3 className="mt-1.5 text-[1.05rem] font-bold leading-snug text-ink-900">
                                  {page.name}
                                </h3>
                                <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-700">
                                  {page.promise}
                                </p>
                                <ul className="mt-4 space-y-2 border-t border-brand-100 pt-3">
                                  {page.capabilities.slice(0, 3).map((c, ci) => (
                                    <li
                                      key={c.title}
                                      className="ez-preview-row flex items-start gap-2 text-[0.82rem] leading-snug text-ink-800"
                                      style={{ animationDelay: `${ci * 45}ms` }}
                                    >
                                      <Icon
                                        name="check"
                                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600"
                                      />
                                      {c.title}
                                    </li>
                                  ))}
                                </ul>
                                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-brand-700">
                                  Open {page.name.toLowerCase()}
                                  <Icon name="arrow-right" className="h-3.5 w-3.5" />
                                </span>
                              </div>
                              )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* ── THE THIRD PANEL ────────────────────────
                              Cascades to the right of whichever area is
                              pointed at, aligned to that row.

                              A DESCENDANT of the panel, not a sibling: the
                              menu closes on the wrapper's mouseleave, and a
                              flyout parked outside the panel's box would
                              still be inside its subtree, so moving onto it
                              never reads as leaving the menu. Positioned at
                              left-full with a small negative inset so the
                              pointer crosses no gap on the way. */}
                        {item.id === "product" && openArea && (() => {
                            const g = moduleGroups.find((x) => x.id === openArea);
                            if (!g) return null;
                            return (
                              <div
                                aria-hidden="true"
                                onMouseEnter={cancelClose}
                                onMouseLeave={() => scheduleClose("area")}
                                /* Full height, pinned to the panel's own top
                                   and bottom rather than to a row. It cannot
                                   overflow vertically because it is bounded
                                   by the same box as the menu. */
                                className="absolute inset-y-0 left-full -ml-2 hidden w-[19rem] xl:block"
                              >
                                <div
                                  key={g.id}
                                  className="ez-preview flex h-full flex-col overflow-hidden rounded-lg bg-surface p-4 shadow-floating ring-1 ring-ink-200"
                                >
                                  <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-700">
                                    <Icon
                                      name={moduleAreaIcons[g.id] ?? "check"}
                                      className="h-3.5 w-3.5"
                                    />
                                    {g.name}
                                  </p>
                                  <h4 className="mt-1 text-[0.95rem] font-bold leading-snug text-ink-900">
                                    {g.promise}
                                  </h4>
                                  <ul className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto border-t border-ink-200 pt-3">
                                    {g.modules.map((m, mi) => (
                                      <li
                                        key={m.name}
                                        className="ez-preview-row flex items-start gap-2 text-[0.76rem] leading-snug text-ink-700"
                                        style={{ animationDelay: `${mi * 40}ms` }}
                                      >
                                        <Icon
                                          name="check"
                                          className="mt-0.5 h-3 w-3 shrink-0 text-brand-600"
                                        />
                                        <span className="line-clamp-3">{m.name}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            );
                          })()}

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
              /* A resting ground, not just a hover one. This was transparent
                 until pointed at, which made the most direct route to a sale
                 look like plain text sitting next to the real button. */
              className="group/tel ez-util flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full bg-brand-50/70 px-3.5 py-2.5 text-[0.95rem] font-bold tracking-[-0.005em] text-ink-900 ring-1 ring-brand-100 hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200"
            >
              <span className="relative grid h-8 w-8 shrink-0 place-items-center">
                {/* The ring that expands and fades — what makes the handset
                    read as live rather than as a static icon. Behind the
                    tile, so it never washes out the glyph. */}
                <span
                  aria-hidden="true"
                  className="ez-tel-ring pointer-events-none absolute inset-0 rounded-full bg-brand-500/40"
                />
                <span className="ez-util relative grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white ring-1 ring-brand-700/30 group-hover/tel:bg-brand-700">
                  <Icon name="phone" className="h-4 w-4" />
                </span>
              </span>
              {contact.phoneDisplay}
            </a>

            {/* The primary CTA — the single most important control in the
                header, so it carries the most: a gradient ground, a brand
                glow that deepens, a lift, and a shine that crosses it on
                hover. The arrow reuses ez-bob from the hero. */}
            {/* The glow has to live on a WRAPPER. The button itself is
                overflow-hidden so the shine can be clipped to its shape, and
                anything glowing outside the edge would be clipped with it. */}
            <span className="relative inline-flex shrink-0">
              <span
                aria-hidden="true"
                className="ez-cta-glow pointer-events-none absolute -inset-2.5 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.55),transparent)] blur-md"
              />
              <Link
                href="/book-a-demo"
                className="group/cta relative inline-flex shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-gradient-to-b from-brand-600 to-brand-700 px-6 py-3 text-[0.95rem] font-bold tracking-[-0.005em] text-white shadow-[0_1px_2px_rgba(16,24,40,0.06),0_10px_22px_-8px_rgba(37,99,235,0.6)] ring-1 ring-brand-700/40 transition-all duration-300 hover:-translate-y-0.5 hover:from-brand-500 hover:to-brand-600 hover:shadow-[0_2px_4px_rgba(16,24,40,0.08),0_18px_34px_-10px_rgba(37,99,235,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
              >
                {/* The shine. It now sweeps on its own as well as on hover —
                    a button nobody has pointed at yet still needs a reason to
                    be looked at. No opacity-0 class any more: the keyframes
                    own that, and a static 0 alongside them was two things
                    describing one property. */}
                <span
                  aria-hidden="true"
                  className="ez-cta-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30"
                />
                <span className="relative">Book a Demo</span>
                <Icon name="arrow-right" className="ez-bob relative h-4 w-4" />
              </Link>
            </span>
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
