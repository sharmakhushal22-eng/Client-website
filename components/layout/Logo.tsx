import Link from 'next/link'
import { site } from '@/site.config'

/* The product's logo mark, lifted verbatim from the HRMS login screen
 * (ezer-hrms/app/page.tsx) so the marketing site and the product are visibly
 * the same company — spec §8.2.
 *
 * The mark is an "E" built from three bars, with a lilac pen/flag rising off
 * the top right. Inlined as SVG rather than loaded as a file: it costs no
 * request, stays crisp at any size, and can recolour for dark backgrounds. */
function Mark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
      <rect width="44" height="44" rx="10" fill="#7C3AED" />
      <rect x="11" y="10" width="5" height="24" rx="1.5" fill="white" />
      <rect x="11" y="10" width="19" height="6" rx="1.5" fill="white" />
      <rect x="11" y="19" width="14" height="5" rx="1.5" fill="white" />
      <rect x="11" y="28" width="19" height="6" rx="1.5" fill="white" />
      <polygon points="32,5 38,12 26,12" fill="#C4B5FD" />
      <rect x="29.5" y="12" width="5" height="6" rx="1" fill="#C4B5FD" />
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
      className="inline-flex items-center gap-3"
      aria-label={`${site.name} — home`}
    >
      <Mark className="h-10 w-10 shrink-0" />
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
              onDark ? 'text-ink-500' : 'text-ink-400'
            }`}
          >
            {site.tagline}
          </span>
        )}
      </span>
    </Link>
  )
}
