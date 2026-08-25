'use client'

import { AnnouncementBar } from './AnnouncementBar'
import { usePreRegisterContext } from '@/components/prereg/PreRegisterProvider'

/* Bridges the announcement bar to the shared pre-registration state, so the
 * bar's CTA opens the same panel the edge tab and teaser do. Kept as its own
 * component so the layout itself can stay a server component. */
export function SiteChrome() {
  const prereg = usePreRegisterContext()
  return <AnnouncementBar onOpenPreRegister={prereg?.openPanel} />
}
