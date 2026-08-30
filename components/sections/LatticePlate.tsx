/* ============================================================================
 * THE LATTICE PLATE — the ground under everything #industries.
 *
 * Extracted the moment a SECOND surface wanted it. The home section and
 * /industries are two renderings of the same claim, and the brief for the
 * second was "same effect, same intensity" — which a copy cannot promise for
 * long. Every value here was arrived at by measuring against the content
 * standing on it: the stroke weight and opacity baked into the file, the
 * 26 per cent wash, and the vertical weighting that is heaviest across the
 * top where the heading sits and eases off through the card grid. Two copies
 * of that would drift the first time either is tuned — which is exactly how
 * three separate icon tables ended up disagreeing about how many module
 * areas exist.
 *
 * Tune it here and both surfaces move together, or it is not the same
 * intensity any more.
 * ========================================================================= */
export function LatticePlate() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="ez-parallax absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/isometric-lattice-dark.svg"
          alt=""
          loading="lazy"
          decoding="async"
          className="ez-contour absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>

      {/* Glows drifting over the contours, on different periods. */}
      <span
        className="ez-drift-a absolute h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          top: "-22%",
          right: "4%",
          background:
            "radial-gradient(circle, rgba(37,99,235,.34), transparent 70%)",
        }}
      />
      <span
        className="ez-drift-b absolute h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          bottom: "-24%",
          left: "3%",
          background:
            "radial-gradient(circle, rgba(103,232,249,.2), transparent 70%)",
        }}
      />

      {/* A light shaft crossing the field. */}
      <span className="ez-sweep absolute inset-y-0 -left-1/4 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(147_197_253/0.1),transparent)]" />

      {/* A LIGHT scrim, edge to edge. Light because a wash does not dim a
          regular field, it flattens one — at alpha a the distance between
          a lattice line and the ground beside it survives at only (1 - a),
          so a heavy wash leaves the artwork visible but lifeless. It sat at
          30% and did exactly that; the lines are boosted in the FILE
          instead — lightened, thickened past a hairline, and their group
          opacity raised — so the wash can stay out of the way at 18%.
          Edge to edge because darkening a PATCH of a geometric pattern
          outlines the patch: the eye reads the interruption, not the
          gradient. The type is separated from the lattice per-glyph
          instead, by text-shadows that follow the letterforms. */}
      <span className="absolute inset-0 bg-[#070c18]/26" />
      <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(7_12_24/0.34)_0%,rgb(7_12_24/0.4)_22%,rgb(7_12_24/0.22)_48%,rgb(7_12_24/0.16)_80%,transparent_100%)]" />
      <span className="absolute inset-0 bg-[linear-gradient(to_bottom,#111827_0%,transparent_10%,transparent_90%,#111827_100%)]" />
    </div>
  )
}
