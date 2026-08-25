import { pricing, publicPricePerEmployee } from '@/site.config'

/* ============================================================================
 * The price, or a convincing absence of it.
 *
 * While `pricing.disclosed` is false this renders a blurred glyph run instead
 * of the rate. The important part is what it does NOT do: the real number is
 * never placed in the DOM and then hidden with CSS. `publicPricePerEmployee`
 * resolves to null on the server, so the figure does not reach the browser in
 * markup, in the RSC payload, or in the JS bundle.
 *
 * A blur over the real number would look identical and protect nothing.
 * ========================================================================= */

export function PriceReveal({
  onDark = false,
  size = 'lg',
  align = 'left',
}: {
  onDark?: boolean
  size?: 'lg' | 'xl'
  /* Must match the block it sits in — the pricing card is left-aligned, the
   * home-page teaser is centred. Mixing the two looked broken. */
  align?: 'left' | 'center'
}) {
  const numberClass = size === 'xl' ? 'text-5xl' : 'text-4xl'
  const toneNumber = onDark ? 'text-white' : 'text-brand-600'
  const toneUnit = onDark ? 'text-on-dark-faint' : 'text-ink-500'
  const centred = align === 'center'

  if (publicPricePerEmployee !== null) {
    return (
      <p className={centred ? 'text-center' : undefined}>
        <span className={`${numberClass} font-bold ${toneNumber}`}>
          {pricing.currency}
          {publicPricePerEmployee}
        </span>
        <span className={`ml-2 text-sm ${toneUnit}`}>
          / employee / month
        </span>
      </p>
    )
  }

  return (
    <div className={centred ? 'text-center' : undefined}>
      <p
        className={`flex items-baseline gap-2 ${
          centred ? 'justify-center' : ''
        }`}
      >
        {/* Bullets, not digits — there is nothing here to un-blur. */}
        <span
          aria-hidden="true"
          className={`${numberClass} select-none font-bold blur-[6px] ${toneNumber}`}
        >
          {pricing.currency}&#8226;&#8226;&#8226;
        </span>
        <span className={`text-sm ${toneUnit}`}>/ employee / month</span>
      </p>

      <p
        className={`mt-4 text-sm font-bold ${
          onDark ? 'text-brand-300' : 'text-brand-700'
        }`}
      >
        Pricing shared on the call
      </p>
      <p
        className={`mt-1.5 max-w-sm text-sm leading-relaxed ${
          centred ? 'mx-auto' : ''
        } ${onDark ? 'text-on-dark-muted' : 'text-ink-500'}`}
      >
        We have not published the rate yet. Ask on the demo and you get the
        number in writing the same day — priced on your headcount rather than
        read off a list.
      </p>

      {/* A screen reader gets the fact, not a row of bullets. */}
      <span className="sr-only">
        Pricing is not published yet. Book a demo to receive a written quote.
      </span>
    </div>
  )
}
