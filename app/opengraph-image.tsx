import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

/* Default social preview card — spec §8.4 and §11 ("OG images and social
 * previews verified on WhatsApp and LinkedIn").
 *
 * Generated rather than designed as a file so it stays in sync with the brand
 * tokens and needs no asset pipeline. Individual pages can override it by
 * passing ogImage to pageMetadata().
 *
 * WhatsApp is the important target here: it is the channel an Indian B2B link
 * actually gets shared on, and it crops to roughly a square in the preview
 * bubble — so the wordmark and headline stay well inside the middle. */

/* Node, not edge: this route reads the real logo PNG off disk so the social
 * card shows the actual mark rather than a letter in a box. The edge runtime
 * has no filesystem. OG cards are generated at build time and then cached, so
 * nothing about this is on a hot path. */
export const alt = 'EZER HRMS — HR and payroll software built for Indian companies'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const mark = await readFile(join(process.cwd(), 'public/brand/ezer-mark-tight.png'))
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #111827 0%, #1e3a8a 55%, #2563eb 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* The real emblem. Sized by height and left on its own
              transparent ground — the card is dark and the mark is bright
              blue throughout, so it needs no plate behind it. */}
          <img src={markSrc} height={72} width={49} alt="" />
          <div style={{ display: 'flex', gap: 10, fontSize: 38, fontWeight: 700, color: '#ffffff' }}>
            <span>EZER</span>
            <span style={{ color: '#93c5fd' }}>HRMS</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.1,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            maxWidth: 940,
          }}
        >
          Payroll that closes in hours, not days
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            lineHeight: 1.4,
            color: '#bfdbfe',
            maxWidth: 900,
          }}
        >
          Hiring to onboarding to attendance to payroll to full &amp; final — with
          Indian statutory compliance built in.
        </div>

        <div style={{ marginTop: 48, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {['EPF', 'ESIC', 'PT', 'LWF', 'TDS', 'Form 16', 'Gratuity'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '10px 22px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.22)',
                color: '#ffffff',
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
