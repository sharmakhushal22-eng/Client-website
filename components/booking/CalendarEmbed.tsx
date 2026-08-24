'use client'

import { useEffect, useState } from 'react'
import { booking } from '@/site.config'

/* Cal.com / Calendly embed — spec §4.6 and §6.
 *
 * Rendered as a plain iframe rather than the provider's embed script, because
 * a third-party script on the critical path is exactly what §8.3 rules out.
 * The iframe is also lazy, so nothing is fetched until the visitor scrolls to
 * the calendar.
 *
 * Returns null when no calendarUrl is configured, and the booking page falls
 * back to the qualifying form alone — which still captures the lead. That way
 * the page works before the calendar account exists. */
export function CalendarEmbed() {
  const [height, setHeight] = useState(760)

  /* The embed needs real height on desktop and a taller one on mobile, where
   * the month grid and the slot list stack rather than sit side by side. */
  useEffect(() => {
    const update = () => setHeight(window.innerWidth < 768 ? 1000 : 760)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (!booking.calendarUrl) return null

  return (
    <iframe
      title={`Book a ${booking.durationMinutes}-minute demo`}
      src={booking.calendarUrl}
      loading="lazy"
      className="w-full rounded-2xl border-0 bg-white ring-1 ring-ink-200"
      style={{ height }}
    />
  )
}
