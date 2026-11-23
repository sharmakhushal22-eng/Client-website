'use client'

import { useSyncExternalStore } from 'react'

/* ============================================================================
 * Small shared stores for the tour page.
 *
 *  · requestFlow(id): any card on the page can ask the demo player to play a
 *    flow. The player listens, switches, and the caller scrolls it into view.
 *  · useReducedMotion / usePageVisible: read straight from the browser, with
 *    server snapshots that keep the first render identical on both sides.
 * ========================================================================= */

type Request = { id: string; n: number }
let request: Request | null = null
const listeners = new Set<() => void>()

export function requestFlow(id: string) {
  request = { id, n: (request?.n ?? 0) + 1 }
  listeners.forEach((l) => l())
}

function subscribeRequest(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useFlowRequest() {
  return useSyncExternalStore(subscribeRequest, () => request, () => null)
}

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}

function subscribeVisible(cb: () => void) {
  document.addEventListener('visibilitychange', cb)
  return () => document.removeEventListener('visibilitychange', cb)
}

export function usePageVisible() {
  return useSyncExternalStore(subscribeVisible, () => document.visibilityState === 'visible', () => true)
}
