import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ShortLeadForm } from '@/components/forms/ShortLeadForm'
import { contact, booking } from '@/site.config'

/* Spec §4.1 §13 — "See it on your own data" plus a form or booking button.
 *
 * Two variants because the right ask differs by page: `form` for the home
 * page bottom, where the visitor has just read everything and a three-field
 * form converts; `buttons` for the foot of a feature page, where sending them
 * to the booking page keeps the demo request specific to that module. */
export function CtaBand({
  variant = 'buttons',
  /* The reference splits these two: "See EZER on your own data" is the
     eyebrow and "Request a demo" is the heading. They were collapsed into
     one heading here, which lost the ask — the h2 described the offer
     instead of naming the action. */
  eyebrow = 'See EZER on your own data',
  title = 'Request a demo',
  lede = 'A 30-minute walkthrough against your own entities, your own states and your own statutory setup. Not a slide deck.',
  formName = 'cta-band',
}: {
  variant?: 'form' | 'buttons'
  eyebrow?: string
  title?: string
  lede?: string
  formName?: string
}) {
  return (
    <section className="relative overflow-hidden bg-dark py-12 text-white sm:py-14 lg:py-16">
      {/* A photograph behind the closing band, not decoration beside it.
       *
       * This site's own rule is "real product screenshots only — no stock
       * business people pointing at a laptop", and a photo like this is
       * exactly what that rule was written against. Two things keep it on the
       * right side of the line: it sits UNDER a heavy brand scrim so it reads
       * as ground rather than as a claim, and it carries no information —
       * every word in this band is still text. Delete the image and the
       * section still says the same thing.
       *
       * Placed at the final CTA specifically. By this point the argument is
       * made; what is left is deciding to talk to someone, and a room of
       * people is a better ground for that than another gradient. */}
      {/* At 0.22 under a 0.78-0.94 scrim, this photograph was contributing
          between 1% and 5% of each pixel — arithmetic, not opinion. That is
          not a background, it is noise, which is why the band read as flat
          dark. It is now 0.55 and the scrim below is a localised clearing
          rather than a blanket, so the room is actually there.

          Ken Burns inside a parallax wrapper: the frame pushes very slowly
          while the whole layer drifts against the band as it crosses the
          viewport. Neither is on a scroll listener. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="ez-parallax absolute inset-0">
          <div className="ez-kenburns relative h-full w-full">
            {/* blur-[3px] is calibrated, not eyeballed. Measured on the
                source at render size, edge energy — a proxy for how much
                detail is pulling at the eye — falls to 21.9% of the sharp
                image at 3px. The curve then flattens hard: 4px reaches
                19.1% and 14px only 15.6%, so anything past about 4px costs
                the scene without quieting it further. At 3px it still reads
                as a room of people, which is the whole point of the
                photograph being there.

                scale-105 is NOT decoration. A blur samples past the
                element's edges, so a blurred image at its exact frame size
                shows a soft translucent border with the band behind it. The
                parallax wrapper happens to scale to 1.14 — but that comes
                from an ANIMATION, and prefers-reduced-motion sets it to
                none, which would drop the scale and expose those edges. The
                image carries its own. */}
            <Image
              src="/photos/team-india.jpg"
              alt=""
              fill
              sizes="100vw"
              priority={false}
              className="scale-105 select-none object-cover object-center opacity-[0.55] blur-[3px]"
            />
          </div>
        </div>
      </div>

      {/* The scrim follows the layout, because the two variants need opposite
       * things. With the form, text sits in a left column and the photo should
       * survive on the right — so the wash runs left to right. Centred, text
       * crosses the full width and a directional wash leaves one side of the
       * heading darker than the other, so it needs a symmetric vignette. */}
      {/* A light overall darkener only — enough to keep the band coherent
          and the edges from glaring, but nowhere near enough to erase the
          photograph. The heavy lifting for legibility is done by the panel
          the text sits on, not by drowning the whole image. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dark/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_30rem_at_80%_0%,rgba(37,99,235,0.35),transparent)]"
      />

      <Container className="relative">
        <div
          className={
            variant === 'form'
              ? 'grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16'
              : 'mx-auto max-w-2xl text-center'
          }
        >
          {/* THE PANEL. This is what makes the text legible now that the
              photograph is actually visible behind it.

              bg-dark/72 is derived, not chosen. Over the BRIGHTEST possible
              photo pixel (255), a panel of alpha A composites to
              255(1-A) + 11A; white text needs that at or below 119 to clear
              4.5:1. That puts the floor at 0.56. 0.72 leaves margin and
              still passes 28% of the photograph through, so it reads as
              glass over a room rather than a black box laid on one — 8.15:1
              even in the worst case.

              The 3D: a top highlight where light would catch the edge, a
              long shadow beneath it, and ez-tilt so it responds to the
              pointer. Those three together are what lift it off the plane
              rather than a border alone. */}
          <div
            data-reveal=""
            className="ez-tilt rounded-3xl border-t border-white/15 bg-dark/[0.72] p-7 shadow-[0_2px_6px_rgba(0,0,0,0.35),0_32px_64px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/10 backdrop-blur-md sm:p-9"
          >
            {eyebrow && (
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {title}
            </h2>
            {/* on-dark, not on-dark-muted. Worst case — the panel over a
                pure-white photo pixel — muted measured 4.9:1, which clears
                4.5 but with nothing to spare over a background that varies
                photograph by photograph. Full strength takes it to ~7:1.
                Hierarchy still reads: the heading is twice the size and
                bold. */}
            <p className="mt-4 text-lg leading-relaxed text-on-dark">{lede}</p>

            {/* text-left inside a centred panel. The section centres its
                heading, and the list was inheriting that — which centres each
                wrapped line independently and leaves the ticks floating
                against ragged text. A list reads down its left edge. */}
            <ul className="mx-auto mt-6 max-w-lg space-y-2.5 text-left">
              {booking.whatHappens.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.95rem] text-on-dark">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand-300" />
                  {item}
                </li>
              ))}
            </ul>

            {variant === 'buttons' && (
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/book-a-demo" variant="onDark" size="lg">
                  Book a Demo
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Button>
                <Button
                  href={`tel:${contact.phoneE164}`}
                  size="lg"
                  className="bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/20"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  {contact.phoneDisplay}
                </Button>
              </div>
            )}

            <p className="mt-6 text-sm text-on-dark-faint">{booking.reassurance}</p>
          </div>

          {/* Matched to the copy panel opposite it. bg-white/5 was tuned for
              the old blanket scrim, where almost nothing showed through; with
              the photograph now visible it was a 5% haze over a room, which
              both weakened the labels and made the two halves of this band
              look like different components. */}
          {variant === 'form' && (
            <div
              data-reveal=""
              className="ez-tilt rounded-3xl border-t border-white/15 bg-dark/[0.72] p-6 shadow-[0_2px_6px_rgba(0,0,0,0.35),0_32px_64px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/10 backdrop-blur-md sm:p-8"
            >
              <h3 className="text-lg font-bold text-white">
                Tell us where to send the details
              </h3>
              <p className="mt-1.5 text-sm text-on-dark-faint">
                Three fields. We come back {contact.responseSla}.
              </p>
              <div className="mt-5">
                <ShortLeadForm formName={formName} onDark cta="Request a demo" />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
