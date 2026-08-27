import { Container } from '@/components/ui/Container'
import { Icon, type IconName } from '@/components/ui/Icon'
import { labourCodes } from '@/content/positioning'

/* ============================================================================
 * The compliance section, laid out as the reference document lays it out:
 * heading, the advisory band, the four Codes as numbered cards, the statutory
 * stack, then the industry note.
 *
 * WHAT THIS REPLACED, AND WHY
 *
 * This was a three-tab component ("The engine" / "The four codes" / "Acts
 * covered") under a different heading — "Four states is not one statutory
 * position. It is four." The tabs were a reasonable answer to a different
 * problem (three stacked sections running ~2,000px), but they cost the
 * section its argument: the four Codes are the single most important thing
 * on this page and they sat behind a tab nobody had a reason to click.
 *
 * Flat also means all four Codes are visible at once, which is the point —
 * the claim is breadth, and breadth you have to click through reads as one
 * item at a time.
 *
 * The engine and structure material that used to live in the other two tabs
 * is not lost: /compliance carries it in full, with room to do it properly.
 *
 * The design is the site's, not the reference's — dark band, the brand wash,
 * ez-tilt on the cards, staggered reveal.
 * ========================================================================= */

/* The reference draws a custom glyph per Code. Mapped onto the site's own
 * icon set rather than importing four one-off SVGs: wages → wallet,
 * industrial relations → people, social security → shield, working
 * conditions → hours. */
const CODE_ICONS: IconName[] = ['wallet', 'users', 'shield', 'clock']

export function ComplianceHub() {
  return (
    <section
      className="relative overflow-hidden bg-dark py-12 text-white sm:py-14 lg:py-16"
      aria-label="Compliance"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_28rem_at_15%_0%,rgba(37,99,235,0.25),transparent)]"
      />

      <Container className="relative">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300">
            {labourCodes.eyebrow}
          </p>
          {/* text-white is REQUIRED, not decorative. globals.css sets h1–h4 to
              ink-900 in @layer base, and a direct rule beats the section's
              inherited colour — without this the heading renders #111827 on a
              #111827 band and disappears completely. */}
          <h2
            data-reveal=""
            className="mt-3 text-3xl font-bold leading-[1.15] text-white sm:text-4xl"
          >
            {labourCodes.title}
          </h2>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-on-dark-muted">
            {labourCodes.lede}
          </p>
        </div>

        {/* The advisory. The rollout is still in progress, and a compliance
            page that does not say so is the one thing a buyer will hold
            against us later. */}
        <p
          data-reveal=""
          className="mt-8 flex items-start gap-3 rounded-2xl border-l-4 border-brand-400 bg-white/5 px-5 py-4 text-sm leading-relaxed text-on-dark-muted ring-1 ring-white/10"
        >
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
          {labourCodes.note}
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {labourCodes.codes.map((code, i) => (
            <li
              key={code.name}
              data-reveal=""
              style={{ transitionDelay: `${Math.min(i, 3) * 70}ms` }}
              className="ez-tilt group relative overflow-hidden rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.08] hover:ring-brand-400/60"
            >
              {/* The ordinal, oversized and set back — the reference numbers
                  these 01–04 and the sequence is part of the point. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-3 text-[4.5rem] font-extrabold leading-none text-white/[0.06] transition-colors duration-300 group-hover:text-white/[0.1]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-brand-600/25 text-brand-200 ring-1 ring-brand-400/40 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={CODE_ICONS[i]} className="h-5 w-5" />
              </span>

              <h3 className="relative mt-4 text-[1.05rem] font-bold leading-snug text-white">
                {code.name}
              </h3>
              <p className="relative mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-brand-300">
                {code.covers}
              </p>
              <p className="relative mt-3 text-sm leading-relaxed text-on-dark-muted">
                {code.what}
              </p>
            </li>
          ))}
        </ul>

        {/* The statutory stack. A chip row rather than a table: this is the
            "is my act on the list" scan, and /compliance carries the table
            for anyone who wants the detail behind each one. */}
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {labourCodes.stack.map((item, i) => (
            <li
              key={item}
              data-reveal=""
              style={{ transitionDelay: `${Math.min(i, 9) * 35}ms` }}
              className="rounded-xl bg-white/[0.07] px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors duration-300 hover:bg-brand-600/30 hover:ring-brand-400/60"
            >
              {item}
            </li>
          ))}
        </ul>

        <p
          data-reveal=""
          className="mt-8 max-w-3xl text-[0.95rem] leading-relaxed text-on-dark-muted"
        >
          {labourCodes.industryNote}
        </p>
      </Container>
    </section>
  )
}
