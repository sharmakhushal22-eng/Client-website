import { industryMarquee } from '@/content/positioning'

/* ============================================================================
 * The drifting industry chips, in the position the reference puts them:
 * inside #industries, directly under the section head and above the category
 * cards.
 *
 * Each track renders its chips TWICE. That is not a mistake and must not be
 * "cleaned up" — the CSS travels the track exactly -50%, so the second copy
 * lands where the first started and the loop closes invisibly. With one copy
 * the row snaps back at the end of every cycle.
 *
 * aria-hidden on the duplicate, so a screen reader is not read 32 industries
 * twice. The list is announced once, from the first copy.
 * ========================================================================= */
export function IndustryMarquee() {
  return (
    <div className="mt-10 space-y-2.5" aria-label="Industries EZER covers">
      {industryMarquee.map((track, t) => (
        <div key={t} className="ez-marquee">
          <div
            className="ez-marquee-track"
            data-reverse={track.reverse ? '' : undefined}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 gap-2.5"
                aria-hidden={copy === 1 ? 'true' : undefined}
              >
                {track.chips.map((chip) => (
                  <span
                    key={chip.label}
                    className={
                      'whitespace-nowrap rounded-full px-4 py-2 text-[0.8rem] font-semibold ' +
                      (chip.hot
                        ? 'bg-brand-600 text-white ring-1 ring-brand-700/30'
                        : 'bg-surface text-ink-800 ring-1 ring-ink-200')
                    }
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
