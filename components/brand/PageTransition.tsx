import { ViewTransition } from 'react'

/* Each page's entrance, as a personality rather than one global animation.
 *
 * Wraps the page in React's <ViewTransition>, which hands the browser's View
 * Transitions API a named snapshot of the outgoing and incoming page. Next's
 * App Router marks every navigation as a transition, so this runs on
 * client-side navigation with no other wiring — and on a hard load, or in a
 * browser without the API, the page simply appears.
 *
 * The keyframes live in app/(site)/site.css under ::view-transition-new(.vt-*).
 * The outgoing page always leaves the same way (vt-exit, a 140ms fade), so
 * only the arrival carries character:
 *
 *   home       the hero choreography is the entrance; this only fades
 *   product    a focused rise — feature pages, pricing
 *   ledger     a left-to-right wipe — compliance, industries
 *   editorial  a quiet lift — about, blog, legal, handbook
 *   direct     120ms — contact, demo, thank-you: the form is usable at once
 *
 * One wrapping <div>, deliberately. <ViewTransition> names each host child it
 * wraps, and a page of twelve sections would otherwise become twelve
 * snapshots to capture and composite. */
export type PageKind = 'home' | 'product' | 'ledger' | 'editorial' | 'direct'

export function PageTransition({
  kind,
  children,
}: {
  kind: PageKind
  children: React.ReactNode
}) {
  return (
    <ViewTransition enter={`vt-${kind}`} exit="vt-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  )
}
