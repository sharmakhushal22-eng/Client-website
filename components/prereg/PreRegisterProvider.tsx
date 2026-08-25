'use client'

import { createContext, useContext } from 'react'
import { usePreRegister, type PreRegisterState } from './usePreRegister'

/* ============================================================================
 * Shares one pre-registration state across the surfaces that need it.
 *
 * Needed because the offer is now reachable from three places that do not sit
 * near each other in the tree: the announcement bar above the header, the
 * edge tab, and the teaser. Without a provider the bar would have to own its
 * own copy of the state, and the two could disagree about whether the panel
 * is open.
 * ========================================================================= */

const Ctx = createContext<PreRegisterState | null>(null)

export function PreRegisterProvider({ children }: { children: React.ReactNode }) {
  const state = usePreRegister()
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>
}

/** Null outside the provider, so a consumer can degrade rather than throw. */
export function usePreRegisterContext() {
  return useContext(Ctx)
}
