/* ============================================================================
 * The animated mesh gradient field.
 *
 * Extracted the moment a SECOND section wanted it. Copying the markup would
 * have put two elements with id="mshBg", id="mshM1" and so on into one
 * document — and `url(#mshBg)` resolves to the first match, so every gradient
 * in the second copy would silently paint from the first copy's definitions.
 * Identical today, so it would have looked fine; a miserable bug the moment
 * either instance is tuned. Hence the required idPrefix.
 *
 * INLINE rather than an <img> because the source is 2KB. That buys the thing
 * an image cannot: each of the five blobs animates independently, so the
 * colours move THROUGH one another and the overlaps change shape. A single
 * layer being panned reads as a picture sliding; this reads as a live field.
 * The 60KB contour and workforce backgrounds stay as <img> for the opposite
 * reason.
 * ========================================================================= */
export function MeshField({
  idPrefix,
  className = '',
}: {
  /** Must be unique per instance on a page — see the note above. */
  idPrefix: string
  className?: string
}) {
  const id = (n: string) => `${idPrefix}-${n}`

  return (
    <svg
      className={`ez-parallax absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id('bg')} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#F7F9FD" />
          <stop offset="1" stopColor="#E8F0FC" />
        </linearGradient>
        <radialGradient id={id('m1')}><stop offset="0" stopColor="#2563EB" stopOpacity="0.22" /><stop offset="1" stopColor="#2563EB" stopOpacity="0" /></radialGradient>
        <radialGradient id={id('m2')}><stop offset="0" stopColor="#93C5FD" stopOpacity="0.5" /><stop offset="1" stopColor="#93C5FD" stopOpacity="0" /></radialGradient>
        <radialGradient id={id('m3')}><stop offset="0" stopColor="#67E8F9" stopOpacity="0.32" /><stop offset="1" stopColor="#67E8F9" stopOpacity="0" /></radialGradient>
        <radialGradient id={id('m4')}><stop offset="0" stopColor="#C7D2FE" stopOpacity="0.46" /><stop offset="1" stopColor="#C7D2FE" stopOpacity="0" /></radialGradient>
        <radialGradient id={id('m5')}><stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></radialGradient>
        <pattern id={id('tooth')} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="1" fill="#111827" fillOpacity="0.05" />
        </pattern>
      </defs>

      <rect width="1920" height="1080" fill={`url(#${id('bg')})`} />
      <ellipse className="ez-mesh-blob ez-mesh-2" cx="160" cy="210" rx="800" ry="630" fill={`url(#${id('m2')})`} />
      <ellipse className="ez-mesh-blob ez-mesh-3" cx="1600" cy="170" rx="740" ry="570" fill={`url(#${id('m3')})`} />
      <ellipse className="ez-mesh-blob ez-mesh-1" cx="1760" cy="950" rx="840" ry="640" fill={`url(#${id('m1')})`} />
      <ellipse className="ez-mesh-blob ez-mesh-4" cx="600" cy="1010" rx="780" ry="570" fill={`url(#${id('m4')})`} />
      <ellipse className="ez-mesh-blob ez-mesh-5" cx="1060" cy="520" rx="720" ry="490" fill={`url(#${id('m5')})`} />
      {/* The dot texture stays still — it is the grain the blobs move behind,
          and grain that drifts reads as a dirty screen. */}
      <rect width="1920" height="1080" fill={`url(#${id('tooth')})`} />
    </svg>
  )
}
