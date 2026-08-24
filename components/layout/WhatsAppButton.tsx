import { contact } from '@/site.config'
import { Icon } from '@/components/ui/Icon'

/* Spec §1.2 conversion 3 — "India-default channel; lowest friction", and §6
 * says a wa.me deep link at launch with prefilled message text. */
export function WhatsAppButton() {
  const href = `https://wa.me/${contact.whatsappE164}?text=${encodeURIComponent(
    contact.whatsappPrefill,
  )}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:scale-105"
    >
      <Icon name="whatsapp" className="h-7 w-7" title="Enquire on WhatsApp" />
    </a>
  )
}
