'use client'

import { Icon } from '@/components/ui/Icon'

/* The always-available way in. Never appears on its own and never blocks —
 * it just has to be findable by someone who dismissed the teaser and later
 * changed their mind, which is a real and otherwise unserved case.
 *
 * Hidden while the panel is open so it cannot be clicked through the
 * backdrop. */
export function PreRegisterTab({
  hidden,
  onOpen,
}: {
  hidden: boolean
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      className={`group fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 items-center gap-2 rounded-l-md bg-brand-600 py-4 pl-3 pr-2.5 text-on-accent shadow-raised transition-all hover:bg-brand-700 hover:pl-4 lg:flex ${
        hidden ? 'pointer-events-none translate-x-full opacity-0' : ''
      }`}
    >
      <Icon name="sparkle" className="h-3.5 w-3.5 shrink-0" />
      <span
        className="text-[0.68rem] font-bold uppercase tracking-[0.12em]"
        style={{ writingMode: 'vertical-rl' }}
      >
        Pre-register
      </span>
    </button>
  )
}

/* The mobile counterpart. A vertical edge tab has nowhere to live on a 360px
 * screen, so below lg it becomes a small pill.
 *
 * It exists for one specific case: someone on a phone who dismissed the
 * teaser and later changed their mind. Without it the offer would be
 * unreachable for the rest of that visit, because the teaser only ever
 * appears once.
 *
 * Sits bottom-LEFT, opposite the WhatsApp button, so the two never overlap. */
export function PreRegisterPill({
  hidden,
  onOpen,
}: {
  hidden: boolean
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      className={`fixed bottom-5 left-5 z-30 flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2.5 text-[0.78rem] font-bold text-on-accent shadow-raised transition-opacity lg:hidden ${
        hidden ? 'pointer-events-none opacity-0' : ''
      }`}
    >
      <Icon name="sparkle" className="h-3.5 w-3.5" />
      Pre-register
    </button>
  )
}
