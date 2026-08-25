import Link from 'next/link'
import { site } from '@/site.config'

/* ============================================================================
 * The EZER mark.
 *
 * REDRAWN, and the reasons are worth recording.
 *
 * The previous mark carried two problems. The first was a leftover: its
 * accent was #C4B5FD — violet-300, from before the product moved to trust
 * blue. The retheme swapped every violet the codebase used by name, but this
 * shade appeared nowhere else, so it survived and left the one element on
 * every page that is supposed to say "this is us" quietly off-brand.
 *
 * The second was composition. A pennant rose off the top-right corner,
 * breaking the tile's silhouette. At 40px in a header that reads as a smudge
 * rather than a shape, and it is the size the mark is actually used at almost
 * everywhere.
 *
 * The redraw keeps the letterform — three bars and a spine, which is what
 * makes it recognisably the product's own logo — and fixes the rest:
 *
 *   · one contained silhouette, nothing breaking the tile edge
 *   · a brighter blue than the UI's own brand, so the mark reads as a mark
 *     rather than as another button
 *   · a single gold accent, which is already a documented brand colour from
 *     the EZER pillars panel rather than a new one invented here
 *   · every shape on a 4px grid, so the bars align optically at small sizes
 *
 * Inlined as SVG rather than loaded as a file: it costs no request, stays
 * crisp at any size, and recolours for dark backgrounds.
 *
 * No gradients, deliberately. A gradient needs a <defs> id, and this renders
 * twice per page (header and footer) — duplicate ids in one document. Depth
 * comes from a translucent white wedge instead, which needs no id at all.
 * ========================================================================= */

const GOLD = '#F5B800'   /* the EZER pillars accent, already in site.config */
const TILE = '#3B82F6'   /* brand-500 — a step brighter than the UI's 600   */

function Mark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Tile */}
      <rect width="44" height="44" rx="12" fill={TILE} />

      {/* Light catching the top-left, so the tile reads as a solid object
          rather than a flat swatch. Clipped by the tile's own radius. */}
      <path d="M0 12A12 12 0 0 1 12 0h20L0 32V12Z" fill="#FFFFFF" fillOpacity="0.14" />

      {/* The E — spine plus three bars, all on a 4px grid. The middle bar is
          deliberately shorter, which is what makes an E read as an E at
          16px rather than as a stack of lines. */}
      <g fill="#FFFFFF">
        <rect x="12" y="11" width="5" height="22" rx="2" />
        <rect x="12" y="11" width="15" height="5" rx="2" />
        <rect x="12" y="19.5" width="12" height="5" rx="2" />
        <rect x="12" y="28" width="15" height="5" rx="2" />
      </g>

      {/* One accent, inside the tile. A dot rather than the old pennant:
          it survives being scaled to a favicon, which the pennant did not.
          Positioned with a clear 4px gap from the top bar — at 16px the two
          fuse into one blob if they are any closer, which is precisely how
          the old mark failed. */}
      <circle cx="34" cy="13.5" r="3.5" fill={GOLD} />
    </svg>
  )
}

export function Logo({
  onDark = false,
  showTagline = true,
}: {
  onDark?: boolean
  /* Off in the header, where the nav is already crowded and the tagline
     competes with it; on in the footer, where there is room. */
  showTagline?: boolean
}) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label={`${site.name} — home`}
    >
      <Mark className="h-10 w-10 shrink-0 transition-transform duration-200 group-hover:scale-[1.04]" />
      <span className="leading-tight">
        <span
          className={`block text-xl font-bold tracking-tight ${
            onDark ? 'text-white' : 'text-ink-900'
          }`}
        >
          ezer{' '}
          <span className={onDark ? 'text-brand-400' : 'text-brand-600'}>hrms</span>
        </span>
        {showTagline && (
          <span
            className={`block text-[0.6rem] uppercase tracking-[0.09em] ${
              onDark ? 'text-on-dark-muted' : 'text-ink-600'
            }`}
          >
            {site.tagline}
          </span>
        )}
      </span>
    </Link>
  )
}
