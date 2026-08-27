/* ============================================================================
 * A kit illustration, presented AS an illustration.
 *
 * Deliberately not ScreenshotFrame. That component wraps its image in browser
 * chrome reading "app.ezerhrms.com", which is a claim: it says what you are
 * looking at is the running product. These files are drawn — good drawings,
 * from EZER's own data, but drawings. Putting them behind that chrome would
 * make the website contradict the demo call, which is the exact failure
 * ScreenshotFrame's placeholder was written to avoid.
 *
 * So this frames them honestly and labels them. When real screenshots exist
 * they go in ScreenshotFrame and this stays for the concept art.
 *
 * Rendered as <img>, not next/image: the animation and the
 * prefers-reduced-motion rule live inside each SVG file, and the optimizer
 * has nothing to add to an SVG.
 * ========================================================================= */
export function Illustration({
  src,
  alt,
  caption,
  className = '',
  ratio = 'aspect-[16/10]',
  priority = false,
  onDark = false,
}: {
  src: string
  alt: string
  caption?: string
  className?: string
  ratio?: string
  priority?: boolean
  /* The frame keeps its light card either way — that IS the contrast on a
     dark band — but the caption underneath sits on the section's own ground
     and has to flip with it. */
  onDark?: boolean
}) {
  return (
    <figure className={`w-full ${className}`}>
      <div className="overflow-hidden rounded-2xl bg-canvas p-4 ring-1 ring-ink-200 sm:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`${ratio} w-full object-contain`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchPriority: 'high' as const } : {})}
        />
      </div>
      <figcaption
        className={`mt-3 text-sm leading-relaxed ${
          onDark ? 'text-on-dark-muted' : 'text-ink-500'
        }`}
      >
        {caption ? <>{caption} </> : null}
        <span className={onDark ? 'text-on-dark-faint' : 'text-ink-400'}>
          Illustration, not a screenshot.
        </span>
      </figcaption>
    </figure>
  )
}
