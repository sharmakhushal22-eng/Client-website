/* ============================================================================
 * Inline icon set.
 *
 * Hand-rolled rather than pulled from an icon package: the site uses about
 * twenty glyphs, and inlining them as SVG keeps them out of the JS bundle
 * entirely and off the critical path (spec §8.3, total home page weight
 * under 1.2 MB).
 *
 * All icons are 24×24 on a 1.7 stroke, decorative by default (aria-hidden),
 * and inherit currentColor.
 * ========================================================================= */

export type IconName =
  | 'users' | 'clock' | 'wallet' | 'receipt' | 'shield' | 'file'
  | 'chart' | 'check' | 'arrow-right' | 'phone' | 'mail' | 'whatsapp'
  | 'calendar' | 'upload' | 'settings' | 'play' | 'chevron-down'
  | 'briefcase' | 'user-plus' | 'map-pin' | 'lock' | 'download'
  | 'alert' | 'sparkle' | 'menu' | 'close' | 'linkedin' | 'pickaxe'
  /* Added for the product tour and the Grow / Engage areas. */
  | 'target' | 'book' | 'heart' | 'sun' | 'moon' | 'monitor'
  | 'smartphone' | 'arrow-left' | 'gamepad' | 'inbox' | 'eye'

const paths: Record<IconName, React.ReactNode> = {
  'target': <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></>,
  'book': <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /><path d="M8 7h8M8 11h6" /></>,
  'heart': <path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 3.8 4 7.2 4c2 0 3.4 1.1 4.8 2.9C13.4 5.1 14.8 4 16.8 4c3.4 0 5.6 3.3 4.4 6.7C19.5 15.4 12 20 12 20z" />,
  'sun': <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" /></>,
  'moon': <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />,
  'monitor': <><rect x="2.5" y="4" width="19" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  'smartphone': <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M11 18.5h2" /></>,
  'arrow-left': <><path d="M20 12H4" /><path d="M10 6l-6 6 6 6" /></>,
  'gamepad': <><path d="M7 8h10a5 5 0 0 1 4.9 6l-.6 3a2.5 2.5 0 0 1-4.3 1.1L15 16H9l-2 2.1a2.5 2.5 0 0 1-4.3-1.1l-.6-3A5 5 0 0 1 7 8z" /><path d="M7.5 11v3M6 12.5h3" /><circle cx="16" cy="11.5" r=".9" fill="currentColor" stroke="none" /><circle cx="17.8" cy="13.5" r=".9" fill="currentColor" stroke="none" /></>,
  'inbox': <><path d="M3 13l2.6-7.4A2 2 0 0 1 7.5 4h9a2 2 0 0 1 1.9 1.6L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 13h5l1.5 2.5h5L16 13h5" /></>,
  'eye': <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  'users': <><path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 20v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" /></>,
  'clock': <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  'wallet': <><path d="M20 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" /><circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none" /></>,
  'receipt': <><path d="M5 3v18l2.5-1.6L10 21l2-1.6L14 21l2.5-1.6L19 21V3z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  'shield': <><path d="M12 3l7 3v5.5c0 4.3-2.9 8.2-7 9.5-4.1-1.3-7-5.2-7-9.5V6z" /><path d="M9.5 12l1.8 1.8L15 10" /></>,
  'file': <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></>,
  'chart': <><path d="M3 21h18" /><path d="M6 21V11M11 21V5M16 21v-7M21 21v-4" /></>,
  'check': <path d="M4.5 12.5l5 5 10-11" />,
  'arrow-right': <><path d="M4 12h16" /><path d="M14 6l6 6-6 6" /></>,
  'phone': <path d="M21 16.9v2.6a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.7 2 2 0 0 1 3.1 1.5h2.6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L6.8 9.3a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
  'mail': <><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="M3 7l9 6 9-6" /></>,
  /* WhatsApp — the one SOLID mark in an outline set.
   *
   * Two things had to change from the sheet's default treatment.
   *
   * First, it must be FILLED. Drawn with the shared stroke, a solid logo
   * traces both edges of the bubble and the handset, so at 24px it collapses
   * into a tangle of doubled lines.
   *
   * Second, the bubble is one solid shape with the handset KNOCKED OUT of it,
   * not a ring with a handset floating inside. That is what makes the mark
   * read at small sizes and on a saturated button: a bold white silhouette
   * with the green showing through the handset, rather than thin white wire.
   *
   * fillRule="evenodd" is what does the knockout — a point inside both the
   * bubble and the handset has an even crossing count, so it renders as a
   * hole and the button colour shows through. No second colour needed, which
   * keeps the glyph usable anywhere currentColor goes.
   *
   * Official geometry, so the handset sits at the correct angle and the
   * bubble tail reads as a tail rather than a notch. */
  'whatsapp': (
    <path
      fill="currentColor"
      stroke="none"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.463 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413zM17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
    />
  ),
  'calendar': <><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  'upload': <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 9l5-5 5 5" /><path d="M12 4v12" /></>,
  'settings': <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.3 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" /></>,
  'play': <><circle cx="12" cy="12" r="9" /><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none" /></>,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'briefcase': <><rect x="2.5" y="7" width="19" height="13" rx="2.5" /><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" /><path d="M2.5 12.5h19" /></>,
  'user-plus': <><path d="M15 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></>,
  /* A pickaxe, for mines: the head as one arc, the handle crossing it. */
  'pickaxe': <><path d="M4 9.5C7.5 5 13 3.5 18.5 5.5" /><path d="M14.5 4.2 19.8 9.5" /><path d="M12.6 11.4 4 20" /></>,
  'map-pin': <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
  'lock': <><rect x="4" y="10.5" width="16" height="10.5" rx="2.5" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
  'download': <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></>,
  'alert': <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5" /><circle cx="12" cy="16.2" r="1" fill="currentColor" stroke="none" /></>,
  'sparkle': <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" />,
  'menu': <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  'close': <path d="M6 6l12 12M18 6L6 18" />,
  'linkedin': <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10.5V17M7.5 7.2v.1M11.5 17v-3.6a2 2 0 0 1 4 0V17" /></>,
}

export function Icon({
  name,
  className = 'h-6 w-6',
  title,
}: {
  name: IconName
  className?: string
  /* Supply only when the icon is the sole content of a control. Otherwise
     leave it off and the icon stays decorative — spec §8.5 says no
     information may be conveyed by an unlabelled graphic. */
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  )
}
