import { ImageResponse } from 'next/og'

/* Favicon — spec §11 ("Favicon, OG images, and social previews verified").
 *
 * Generated from the brand tokens rather than shipped as an .ico so there is
 * one less binary asset to keep in sync. Next serves it at /icon.png and
 * wires the <link rel="icon"> automatically.
 *
 * TODO: replace with the real logo mark once design supplies the SVG set. */

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          /* Matches the redrawn mark in components/layout/Logo.tsx: the
             brighter brand-500 tile rather than the UI's 600, so the tab icon
             and the header logo read as the same object. */
          background: '#3b82f6',
          color: '#ffffff',
          fontSize: 42,
          fontWeight: 700,
          fontFamily: 'sans-serif',
          borderRadius: 14,
          position: 'relative',
        }}
      >
        E
        {/* The gold accent, in the same top-right position as the mark. */}
        <div
          style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 12,
            height: 12,
            borderRadius: 999,
            background: '#f5b800',
          }}
        />
      </div>
    ),
    size,
  )
}
