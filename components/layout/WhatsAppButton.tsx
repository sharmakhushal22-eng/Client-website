import { contact } from '@/site.config'
import { Icon } from '@/components/ui/Icon'

/* ============================================================================
 * The WhatsApp float.
 *
 * India-default channel, and the lowest-friction one on the site — so it is
 * the only control allowed to sit permanently over the page.
 *
 * Three decisions worth recording:
 *
 *  · The halo animates a RING, never the button. Scaling the button itself
 *    moves the click target, and a control that drifts under the cursor is
 *    worse than a static one however nice it looks.
 *
 *  · The number is deliberately NOT shown. The button is the action, not the
 *    directory entry — a tap opens WhatsApp already in conversation with the
 *    right line, so printing the digits only invites someone to copy them and
 *    dial instead, which loses the prefilled message and the attribution.
 *
 *  · It expands on hover AND focus, so it is reachable by keyboard rather
 *    than being a mouse-only affordance.
 * ========================================================================= */

export function WhatsAppButton() {
  const href = `https://wa.me/${contact.whatsappE164}?text=${encodeURIComponent(
    contact.whatsappPrefill,
  )}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="ez-wa group fixed bottom-5 right-5 z-40 flex items-center rounded-full bg-[#25D366] py-2.5 pl-2.5 pr-2.5 text-white shadow-lg shadow-black/25 transition-shadow duration-200 hover:shadow-xl hover:shadow-[#25D366]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      {/* The icon disc. `relative` + isolate so the halo's negative z-index
          stays behind this element and not behind the page. */}
      <span className="ez-halo relative isolate grid h-9 w-9 shrink-0 place-items-center">
        <Icon name="whatsapp" className="h-6 w-6" />
      </span>

      {/* Slides open from zero width. overflow-hidden is what makes the
          max-width transition read as a reveal rather than a reflow. */}
      <span className="ez-wa-label overflow-hidden whitespace-nowrap">
        <span className="block pl-2.5 pr-2 text-[0.85rem] font-bold leading-none">
          Chat with us
        </span>
      </span>
    </a>
  )
}
