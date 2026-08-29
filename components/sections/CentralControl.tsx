import { structure } from '@/content/positioning'

/* ============================================================================
 * "One establishment, centrally run" — the corporate office issuing to its
 * branches, factory and warehouse, and data coming back up.
 *
 * Ported from CentralControlSection.tsx. Three things changed on the way in:
 *
 * 1. CROPPED. The source drew its own pill caption across the top reading
 *    "One establishment — centrally run". On this page it sits directly under
 *    a heading that already says "Corporate office, branches, factory,
 *    warehouse — centrally run", so the pill was the same sentence twice, a
 *    line apart. Removed, and the viewBox tightened onto what is left.
 *
 * 2. THEMED. The source hardcoded ten hex values. Every one of them was
 *    already a token in this stylesheet, so they now read from the theme and
 *    will follow it if the palette moves. The single exception was its teal
 *    accent (#0D9488), which is not in the palette — the return path uses
 *    emerald-600, which is what the rest of the site uses for "confirmed".
 *
 * 3. KEYFRAMES MOVED to globals.css. The source injected a <style> tag on
 *    every render, and its `ezPulse` collided with an existing keyframe of
 *    that name — see the note there.
 *
 * 4. THE OBSERVER IS GONE. The source gated its animation on its own
 *    IntersectionObserver. Ported as-is it ran, found its element, observed
 *    it — and never fired, leaving the diagram at opacity 0 permanently. The
 *    App Router swaps page contents without remounting, so an
 *    observe-once-at-mount effect watches a node that is no longer on screen;
 *    SiteScripts documents the same failure and re-observes per route.
 *    Handing the gating to [data-reveal] fixes it and makes this a server
 *    component with no client JS at all.
 * ========================================================================= */

/* Sourced from the theme rather than hardcoded, so the diagram cannot drift
 * away from the palette the rest of the page uses. */
const C = {
  brand: 'var(--color-brand-600)',
  brandDeep: 'var(--color-brand-700)',
  brandTint: 'var(--color-brand-50)',
  brandLine: 'var(--color-brand-200)',
  brandSoft: 'var(--color-brand-300)',
  /* The source used teal #0D9488, which this palette does not carry. */
  accent: 'var(--color-emerald-600)',
  surface: 'var(--color-surface)',
  ink: 'var(--color-ink-900)',
  ink2: 'var(--color-ink-600)',
  line: 'var(--color-ink-200)',
}


/* The three site types under the corporate office. Titles come from the
 * content module where they exist, so the diagram and the prose cannot end up
 * naming different things. */
const UNITS = [
  {
    x: 70,
    title: 'Branch offices',
    icon: (
      <>
        <rect x="1.5" y="6" width="10" height="14" rx="2" />
        <rect x="12.5" y="2" width="8" height="18" rx="2" />
      </>
    ),
  },
  {
    x: 345,
    title: 'Factory',
    icon: (
      <>
        <path d="M2 20V9l6 4V9l6 4V6h6v14z" />
        <path d="M2 20h18" />
      </>
    ),
  },
  {
    x: 620,
    title: 'Warehouse',
    icon: (
      <>
        <path d="M2 20V8l9-6 9 6v12z" />
        <path d="M7.5 20v-7h7v7" />
      </>
    ),
  },
]

export function CentralControl() {
  return (
    /* data-reveal hands the entrance to the site's own driver — see the
       note in globals.css for why the ported observer could not do it. */
    <div data-reveal="" className="ez-cc mx-auto w-full max-w-3xl">
      {/* Cropped viewBox: the source was "0 0 880 420" and carried its own
          caption pill at the top. Boxed onto the boundary rect instead, with
          10 units of breathing room. */}
      <svg
        viewBox="20 30 840 370"
        role="img"
        aria-labelledby="ezccT ezccD"
        className="block h-auto w-full"
      >
        <title id="ezccT">{structure.title}</title>
        <desc id="ezccD">
          A corporate office sends instructions down to branch offices, a
          factory and a warehouse; data flows back up. A dashed boundary
          encloses all four as one centrally run establishment.
        </desc>

        <defs>
          <marker
            id="ezccDown"
            viewBox="0 0 10 10"
            refX="7.5"
            refY="5"
            markerWidth="5.5"
            markerHeight="5.5"
            orient="auto"
          >
            <path
              d="M2 1.5L7.5 5L2 8.5"
              fill="none"
              stroke={C.brand}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
          <marker
            id="ezccUp"
            viewBox="0 0 10 10"
            refX="7.5"
            refY="5"
            markerWidth="5.5"
            markerHeight="5.5"
            orient="auto-start-reverse"
          >
            <path
              d="M2 1.5L7.5 5L2 8.5"
              fill="none"
              stroke={C.accent}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {/* The boundary, drawn on as the section arrives. */}
        <rect
          x="30"
          y="40"
          width="820"
          height="350"
          rx="26"
          fill="none"
          stroke={C.brandSoft}
          strokeWidth="1.5"
          /* 2294 is the rect's actual perimeter, measured with
             getTotalLength(). The source used 1220, which is barely half of
             it — so the boundary drew on and then simply stopped, leaving a
             rectangle permanently missing its bottom-left run. */
          strokeDasharray="2294"
          className="ez-cc-boundary"
        />

        {/* Instructions down in brand, data back up in emerald. */}
        <g className="ez-cc-wire">
          <path className="ez-cc-down" d="M435 150 V211 H160 V272" fill="none" stroke={C.brand} strokeWidth="2" strokeLinecap="round" markerEnd="url(#ezccDown)" />
          <path className="ez-cc-down" d="M435 150 V272" fill="none" stroke={C.brand} strokeWidth="2" strokeLinecap="round" markerEnd="url(#ezccDown)" />
          <path className="ez-cc-down" d="M435 150 V211 H710 V272" fill="none" stroke={C.brand} strokeWidth="2" strokeLinecap="round" markerEnd="url(#ezccDown)" />
          <path className="ez-cc-up" d="M445 150 V221 H170 V272" fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" markerStart="url(#ezccUp)" />
          <path className="ez-cc-up" d="M445 150 V272" fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" markerStart="url(#ezccUp)" />
          <path className="ez-cc-up" d="M445 150 V221 H720 V272" fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" markerStart="url(#ezccUp)" />
        </g>

        <rect
          className="ez-cc-pulse"
          x="330"
          y="86"
          width="220"
          height="64"
          rx="14"
          fill="none"
          stroke={C.brand}
          strokeWidth="1.5"
          opacity="0"
          /* fill-box would take its origin from this rect; view-box keeps the
             pulse centred on the card it is echoing. */
          style={{ transformBox: 'view-box', transformOrigin: '440px 118px' }}
        />

        <g className="ez-cc-rise" style={{ transitionDelay: '0.34s' }}>
          <rect x="330" y="86" width="220" height="64" rx="14" fill={C.brandTint} stroke={C.brandLine} strokeWidth="1" />
          <g transform="translate(354,107)" fill="none" stroke={C.brand} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="18" height="15" rx="2.5" />
            <path d="M11 5V1" />
            <path d="M6.5 10h2M13 10h2M6.5 14.5h2M13 14.5h2" />
          </g>
          {/* 16.4, not 15. The box renders at 0.91x (768px wide against an
              840-unit viewBox), so a 15-unit label lands at 13.7px — under the
              size it was drawn for, and noticeably small beside 16.3px body
              copy. Scaled up by the same factor to render at its intended 15. */}
          <text x="386" y="118" dominantBaseline="central" fontSize="16.4" fontWeight="600" fill={C.brandDeep}>
            Corporate office
          </text>
        </g>

        {UNITS.map((u, i) => (
          <g
            key={u.title}
            className="ez-cc-rise"
            style={{ transitionDelay: `${0.48 + i * 0.12}s` }}
          >
            <rect x={u.x} y="280" width="190" height="64" rx="14" fill={C.surface} stroke={C.line} strokeWidth="1" />
            {/* The receive flash, laid over the card it belongs to. */}
            <rect
              className={`ez-cc-recv ez-cc-recv-${i}`}
              x={u.x}
              y="280"
              width="190"
              height="64"
              rx="14"
              fill={C.brandTint}
              stroke={C.brandSoft}
              strokeWidth="1.5"
              opacity="0"
            />
            <g transform={`translate(${u.x + 18},301)`} fill="none" stroke={C.ink2} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {u.icon}
            </g>
            <text x={u.x + 48} y="312" dominantBaseline="central" fontSize="15.3" fontWeight="600" fill={C.ink}>
              {u.title}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
