import { Icon, type IconName } from '@/components/ui/Icon'
import { labourCodes } from '@/content/positioning'

/* ============================================================================
 * The four Labour Codes, as the reference draws them: an icon, the ordinal,
 * the name, what it covers, and what it means for payroll.
 *
 * Extracted because it was rendered twice — once on the home page and once on
 * /compliance — and the two had drifted. The /compliance copy had no icon and
 * no number, so the same four Codes looked like a different, lesser component
 * depending which page you arrived on. One source, two tones.
 *
 * The ordinals are not decoration. The reference numbers these 01–04 and the
 * sequence is part of the content: they are four Codes that replaced 29 acts,
 * and a reader counting them is the point.
 * ========================================================================= */

/* The reference draws a custom glyph per Code. Mapped onto the site's own
 * icon set rather than importing four one-off SVGs: wages → wallet,
 * industrial relations → people, social security → shield, working
 * conditions → hours. */
const CODE_ICONS: IconName[] = ['wallet', 'users', 'shield', 'clock']

export function LabourCodeCards({ onDark = false }: { onDark?: boolean }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {labourCodes.codes.map((code, i) => (
        <li
          key={code.name}
          data-reveal=""
          style={{ transitionDelay: `${Math.min(i, 3) * 70}ms` }}
          className={
            'ez-tilt group relative overflow-hidden rounded-2xl p-6 transition-colors duration-300 ' +
            (onDark
              ? 'bg-white/5 ring-1 ring-white/10 hover:bg-white/[0.08] hover:ring-brand-400/60'
              : 'bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-16px_rgba(16,24,40,0.28)] ring-1 ring-ink-200 hover:ring-brand-200')
          }
        >
          {/* The ordinal, oversized and set back. On the light card it has to
              be much fainter than on the dark one — the same alpha that reads
              as a ghost on navy reads as a smudge on white. */}
          <span
            aria-hidden="true"
            className={
              'pointer-events-none absolute -right-2 -top-3 text-[4.5rem] font-extrabold leading-none transition-colors duration-300 ' +
              (onDark
                ? 'text-white/[0.06] group-hover:text-white/[0.1]'
                : 'text-brand-600/[0.07] group-hover:text-brand-600/[0.12]')
            }
          >
            {String(i + 1).padStart(2, '0')}
          </span>

          <span
            className={
              'relative grid h-11 w-11 place-items-center rounded-xl ring-1 transition-colors duration-300 ' +
              (onDark
                ? 'bg-brand-600/25 text-brand-200 ring-brand-400/40 group-hover:bg-brand-600 group-hover:text-white'
                : 'bg-brand-50 text-brand-700 ring-brand-100 group-hover:bg-brand-600 group-hover:text-white')
            }
          >
            <Icon name={CODE_ICONS[i]} className="h-5 w-5" />
          </span>

          {/* h3, not h4: these sit directly under a section h2 on both pages,
              so h4 would skip a level in the outline. */}
          <h3
            className={
              'relative mt-4 text-[1.05rem] font-bold leading-snug ' +
              (onDark ? 'text-white' : 'text-ink-900')
            }
          >
            {code.name}
          </h3>
          <p
            className={
              'relative mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] ' +
              (onDark ? 'text-brand-300' : 'text-brand-700')
            }
          >
            {code.covers}
          </p>
          <p
            className={
              'relative mt-3 text-sm leading-relaxed ' +
              (onDark ? 'text-on-dark-muted' : 'text-ink-700')
            }
          >
            {code.what}
          </p>
        </li>
      ))}
    </ul>
  )
}
