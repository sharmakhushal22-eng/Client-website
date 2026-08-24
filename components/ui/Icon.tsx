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
  | 'alert' | 'sparkle' | 'menu' | 'close' | 'linkedin'

const paths: Record<IconName, React.ReactNode> = {
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
  'whatsapp': <path d="M12.04 2.5a9.4 9.4 0 0 0-8.1 14.14L2.5 21.5l4.98-1.4A9.4 9.4 0 1 0 12.04 2.5zm5.42 13.3c-.23.65-1.35 1.25-1.86 1.3-.5.05-.96.23-3.24-.68-2.73-1.08-4.46-3.85-4.6-4.03-.13-.18-1.1-1.46-1.1-2.79 0-1.33.7-1.98.94-2.25.24-.27.53-.34.7-.34h.5c.16 0 .38-.06.6.46.22.53.76 1.86.83 2 .07.13.11.29.02.47-.09.18-.13.29-.27.44l-.4.47c-.13.13-.27.28-.12.55.15.26.67 1.1 1.44 1.79.99.88 1.82 1.15 2.08 1.29.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.17-.27.34-.22.58-.13.23.09 1.5.7 1.76.83.26.13.43.2.5.31.06.11.06.63-.17 1.28z" />,
  'calendar': <><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  'upload': <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 9l5-5 5 5" /><path d="M12 4v12" /></>,
  'settings': <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.3 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" /></>,
  'play': <><circle cx="12" cy="12" r="9" /><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none" /></>,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'briefcase': <><rect x="2.5" y="7" width="19" height="13" rx="2.5" /><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" /><path d="M2.5 12.5h19" /></>,
  'user-plus': <><path d="M15 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></>,
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
