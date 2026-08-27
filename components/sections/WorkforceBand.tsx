/* ============================================================================
 * One continuous workforce-grid field, spanning several sections.
 *
 * The alternative was giving each section its own copy of the background.
 * That fails visibly: every section would restart the grid at its own top
 * edge, so the tiles would jump at each boundary and the "one field" effect
 * would break into four stacked pictures. Wrapping them instead means the
 * grid is laid once and the sections sit on it, which is the whole point of
 * running it across a run of the page.
 *
 * The sections inside must therefore be transparent — see Section's
 * tone="transparent", added for exactly this.
 *
 * An <img> rather than an inline SVG: the source is 609 static rects and
 * 60KB. (MeshField is inlined instead, because at 2KB it is cheap enough to
 * animate blob by blob.)
 * ========================================================================= */
export function WorkforceBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* object-fill, not object-cover. This band is several thousand
            pixels tall and the source is 16:9 — cover would crop to a narrow
            vertical slice blown up enormously, so the tiles would read as
            huge blocks. The artwork is an abstract grid, so stretching it
            vertically is invisible in a way that cropping is not.

            Held at 22% opacity for the same reason: stretched to this height
            the tiles become large, and at full strength they read as blue
            blocks sitting on top of the body copy rather than as a field
            behind it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/workforce-grid-light.svg"
          alt=""
          loading="lazy"
          decoding="async"
          className="ez-contour absolute inset-0 h-full w-full object-fill opacity-[0.22]"
        />

        {/* Glows placed at different heights so the long band does not read
            as one evenly-lit wall. */}
        <span
          className="ez-drift-a absolute h-[38rem] w-[38rem] rounded-full blur-3xl"
          style={{
            top: '2%',
            left: '2%',
            background:
              'radial-gradient(circle, rgba(37,99,235,.13), transparent 70%)',
          }}
        />
        <span
          className="ez-drift-b absolute h-[32rem] w-[32rem] rounded-full blur-3xl"
          style={{
            top: '40%',
            right: '3%',
            background:
              'radial-gradient(circle, rgba(103,232,249,.14), transparent 70%)',
          }}
        />
        <span
          className="ez-drift-a absolute h-[34rem] w-[34rem] rounded-full blur-3xl"
          style={{
            bottom: '2%',
            left: '8%',
            background:
              'radial-gradient(circle, rgba(147,197,253,.16), transparent 70%)',
          }}
        />

        {/* Edge blend only at the two ends of the whole band, not per
            section — the joins inside must stay invisible. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-surface)_0%,transparent_5%,transparent_95%,var(--color-surface)_100%)]" />
      </div>

      <div className="relative">{children}</div>
    </div>
  )
}
