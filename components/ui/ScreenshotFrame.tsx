import Image from 'next/image'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

/* ============================================================================
 * A product screenshot in a browser-ish frame.
 *
 * Spec §8.2 is emphatic: "Real product screenshots only — no stock 'business
 * people pointing at a laptop'." And §9 says a demo company with fictional
 * names, salaries and PAN/Aadhaar values must exist BEFORE any screenshot is
 * taken.
 *
 * So when `src` is empty this renders a labelled placeholder that reads as
 * obviously unfinished — not an invented dashboard. Faking a UI here would
 * mean the demo call contradicts the website, which is worse than an empty
 * frame. Drop the real file in and it appears with no other change.
 * ========================================================================= */

export function ScreenshotFrame({
  src,
  alt,
  caption,
  className,
  priority = false,
  width = 1280,
  height = 800,
}: {
  src?: string
  alt: string
  caption?: string
  className?: string
  /* Set on the hero image only — it is the LCP element (§8.3). */
  priority?: boolean
  width?: number
  height?: number
}) {
  return (
    <figure className={cn('w-full', className)}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-ink-900/10 ring-1 ring-ink-200">
        {/* Chrome bar */}
        <div className="flex items-center gap-1.5 border-b border-ink-200 bg-ink-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-[0.7rem] font-medium text-ink-400 ring-1 ring-ink-200">
            app.ezerhrms.com
          </span>
        </div>

        {src ? (
          /* width/height always supplied — spec §8.3 requires them on every
             image so nothing shifts as the picture loads (CLS < 0.1). */
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="h-auto w-full"
          />
        ) : (
          /* Deliberately NOT forced to the image's aspect ratio. A 1280×800
             box holding four lines of text is mostly emptiness, and on the
             home page that compounded into thousands of pixels of blank
             scroll. It sizes to its content until a real image replaces it. */
          <div className="flex flex-col items-center justify-center gap-2.5 bg-brand-50 px-6 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-600">
              <Icon name="alert" className="h-6 w-6" />
            </span>
            <p className="max-w-sm text-sm font-semibold text-ink-900">
              Screenshot pending
            </p>
            <p className="max-w-md text-xs leading-relaxed text-ink-500">
              {alt}
            </p>
            <p className="max-w-md text-[0.7rem] leading-relaxed text-ink-400">
              Build the demo company with fictional names, salaries and PAN/Aadhaar
              values first, then drop the image in — see site.config.ts.
            </p>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-ink-500">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
