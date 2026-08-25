'use client'

import { usePreRegisterContext } from './PreRegisterProvider'
import { PreRegisterTeaser } from './PreRegisterTeaser'
import { PreRegisterPanel } from './PreRegisterPanel'
import { PreRegisterTab, PreRegisterPill } from './PreRegisterTab'

/* ============================================================================
 * Composes the three surfaces. Deliberately thin — the state lives in
 * usePreRegister and the presentation in the three components, so any one of
 * them can be restyled or replaced without touching the others.
 *
 * The escalation is one-way and user-driven:
 *
 *   (automatic)  →  teaser        non-blocking, dismissible, once ever
 *   (click)      →  panel         blocking, because they asked
 *   (always)     →  edge tab      findable if they change their mind
 *
 * Nothing automatic reaches the panel. That is the entire point.
 * ========================================================================= */
export function PreRegister() {
  const state = usePreRegisterContext()
  if (!state?.ready) return null

  const { teaserOpen, panelOpen, expand, dismissTeaser, closePanel, openPanel } =
    state

  return (
    <>
      <PreRegisterTab hidden={panelOpen} onOpen={openPanel} />
      {/* The pill would sit exactly where the teaser does, so it waits until
          the teaser is gone rather than stacking on top of it. */}
      <PreRegisterPill hidden={panelOpen || teaserOpen} onOpen={openPanel} />
      <PreRegisterTeaser
        open={teaserOpen && !panelOpen}
        onExpand={expand}
        onDismiss={dismissTeaser}
      />
      <PreRegisterPanel open={panelOpen} onClose={closePanel} />
    </>
  )
}
