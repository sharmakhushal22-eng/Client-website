import { site } from "@/site.config"

/* The QR code on the card, as a path of 29 x 29 modules.
 *
 * WHAT IT ENCODES, and how that is known: decoded from this very path
 * (mask 2, byte mode, 37 bytes) it reads exactly QR_TARGET below. It is the
 * only one of the eight mask patterns that yields a valid byte-mode segment,
 * so that reading is not a guess.
 *
 * THE CAPTION IS THE QR'S OWN URL, not site.url, and that is the whole point
 * of QR_TARGET existing. It used to be built from site.url, which was wrong
 * twice over: on a developer's machine it printed "localhost:3100/download"
 * under a code pointing at the live site, and in production it would have
 * printed "www.ezerhrms.com/download" under a code that encodes the host
 * WITHOUT the www. Caption and code now come from one string, so they cannot
 * disagree in any environment.
 *
 * The caption drops the scheme and the ?start=1, because those are
 * instructions to the scanner rather than something a person needs to read
 * or type. Someone typing it by hand gets the same page, without the
 * download starting on its own.
 *
 * The code is STATIC and pinned to this host. If the site moves domain or
 * this route changes, the path below has to be regenerated: nothing here can
 * follow site.url on its own. The check beneath says so out loud at build
 * time rather than leaving it to be noticed by a visitor with a camera.
 */
const QR_TARGET = "https://ezerhrms.com/download?start=1"

/* Build-time tripwire. The QR is a drawing: it cannot follow a domain move,
 * so the only protection is noticing. Compared on the registrable host, so
 * the www the canonical uses is not treated as a different site. */
if (process.env.NODE_ENV !== "production") {
  const bare = (u: string) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "")
    } catch {
      return ""
    }
  }
  const siteHost = bare(site.url)
  const qrHost = bare(QR_TARGET)
  if (siteHost && siteHost !== "localhost" && siteHost !== qrHost) {
    console.warn(
      `[download] The QR code encodes ${qrHost} but this site is served from ` +
        `${siteHost}. Regenerate the QR path in AppQr.tsx, or it will send ` +
        `everyone who scans it to the old domain.`,
    )
  }
}

export function AppQr({ className }: { className?: string }) {
  const shown = QR_TARGET.replace(/^https?:\/\//, "").replace(/\?.*$/, "")
  return (
    <figure className={className}>
      <div className="inline-block rounded-[18px] bg-white p-3.5 ring-1 ring-ink-900/10">
        <svg
          viewBox="0 0 29 29"
          shapeRendering="crispEdges"
          role="img"
          aria-label={`QR code linking to ${shown}, which starts the Android download`}
          className="h-32 w-32 text-ink-900"
        >
          <path fill="currentColor" d="M0 0h1v1h-1zM1 0h1v1h-1zM2 0h1v1h-1zM3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM9 0h1v1h-1zM14 0h1v1h-1zM17 0h1v1h-1zM18 0h1v1h-1zM19 0h1v1h-1zM20 0h1v1h-1zM22 0h1v1h-1zM23 0h1v1h-1zM24 0h1v1h-1zM25 0h1v1h-1zM26 0h1v1h-1zM27 0h1v1h-1zM28 0h1v1h-1zM0 1h1v1h-1zM6 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM15 1h1v1h-1zM16 1h1v1h-1zM17 1h1v1h-1zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM6 2h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM14 2h1v1h-1zM15 2h1v1h-1zM16 2h1v1h-1zM20 2h1v1h-1zM22 2h1v1h-1zM24 2h1v1h-1zM25 2h1v1h-1zM26 2h1v1h-1zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h1v1h-1zM3 3h1v1h-1zM4 3h1v1h-1zM6 3h1v1h-1zM8 3h1v1h-1zM9 3h1v1h-1zM10 3h1v1h-1zM16 3h1v1h-1zM17 3h1v1h-1zM22 3h1v1h-1zM24 3h1v1h-1zM25 3h1v1h-1zM26 3h1v1h-1zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM6 4h1v1h-1zM8 4h1v1h-1zM13 4h1v1h-1zM19 4h1v1h-1zM20 4h1v1h-1zM22 4h1v1h-1zM24 4h1v1h-1zM25 4h1v1h-1zM26 4h1v1h-1zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM13 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM17 5h1v1h-1zM20 5h1v1h-1zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h1v1h-1zM1 6h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h1v1h-1zM23 6h1v1h-1zM24 6h1v1h-1zM25 6h1v1h-1zM26 6h1v1h-1zM27 6h1v1h-1zM28 6h1v1h-1zM8 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM16 7h1v1h-1zM19 7h1v1h-1zM20 7h1v1h-1zM0 8h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM11 8h1v1h-1zM14 8h1v1h-1zM15 8h1v1h-1zM16 8h1v1h-1zM17 8h1v1h-1zM19 8h1v1h-1zM22 8h1v1h-1zM23 8h1v1h-1zM24 8h1v1h-1zM25 8h1v1h-1zM26 8h1v1h-1zM0 9h1v1h-1zM4 9h1v1h-1zM5 9h1v1h-1zM10 9h1v1h-1zM11 9h1v1h-1zM16 9h1v1h-1zM17 9h1v1h-1zM18 9h1v1h-1zM19 9h1v1h-1zM21 9h1v1h-1zM22 9h1v1h-1zM23 9h1v1h-1zM24 9h1v1h-1zM28 9h1v1h-1zM0 10h1v1h-1zM2 10h1v1h-1zM3 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM11 10h1v1h-1zM15 10h1v1h-1zM17 10h1v1h-1zM20 10h1v1h-1zM21 10h1v1h-1zM22 10h1v1h-1zM0 11h1v1h-1zM1 11h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM4 11h1v1h-1zM8 11h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM14 11h1v1h-1zM18 11h1v1h-1zM20 11h1v1h-1zM21 11h1v1h-1zM24 11h1v1h-1zM25 11h1v1h-1zM27 11h1v1h-1zM1 12h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM10 12h1v1h-1zM12 12h1v1h-1zM15 12h1v1h-1zM16 12h1v1h-1zM17 12h1v1h-1zM19 12h1v1h-1zM23 12h1v1h-1zM25 12h1v1h-1zM26 12h1v1h-1zM2 13h1v1h-1zM3 13h1v1h-1zM4 13h1v1h-1zM5 13h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1zM11 13h1v1h-1zM13 13h1v1h-1zM14 13h1v1h-1zM16 13h1v1h-1zM17 13h1v1h-1zM18 13h1v1h-1zM19 13h1v1h-1zM20 13h1v1h-1zM22 13h1v1h-1zM23 13h1v1h-1zM24 13h1v1h-1zM28 13h1v1h-1zM0 14h1v1h-1zM1 14h1v1h-1zM6 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM15 14h1v1h-1zM16 14h1v1h-1zM20 14h1v1h-1zM21 14h1v1h-1zM23 14h1v1h-1zM24 14h1v1h-1zM25 14h1v1h-1zM26 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM8 15h1v1h-1zM13 15h1v1h-1zM15 15h1v1h-1zM18 15h1v1h-1zM19 15h1v1h-1zM20 15h1v1h-1zM21 15h1v1h-1zM22 15h1v1h-1zM23 15h1v1h-1zM24 15h1v1h-1zM27 15h1v1h-1zM0 16h1v1h-1zM3 16h1v1h-1zM4 16h1v1h-1zM5 16h1v1h-1zM6 16h1v1h-1zM7 16h1v1h-1zM10 16h1v1h-1zM11 16h1v1h-1zM14 16h1v1h-1zM15 16h1v1h-1zM17 16h1v1h-1zM19 16h1v1h-1zM25 16h1v1h-1zM26 16h1v1h-1zM0 17h1v1h-1zM2 17h1v1h-1zM8 17h1v1h-1zM10 17h1v1h-1zM12 17h1v1h-1zM16 17h1v1h-1zM17 17h1v1h-1zM18 17h1v1h-1zM19 17h1v1h-1zM20 17h1v1h-1zM21 17h1v1h-1zM22 17h1v1h-1zM23 17h1v1h-1zM24 17h1v1h-1zM26 17h1v1h-1zM28 17h1v1h-1zM0 18h1v1h-1zM2 18h1v1h-1zM3 18h1v1h-1zM4 18h1v1h-1zM5 18h1v1h-1zM6 18h1v1h-1zM10 18h1v1h-1zM11 18h1v1h-1zM12 18h1v1h-1zM15 18h1v1h-1zM17 18h1v1h-1zM20 18h1v1h-1zM22 18h1v1h-1zM26 18h1v1h-1zM0 19h1v1h-1zM3 19h1v1h-1zM4 19h1v1h-1zM8 19h1v1h-1zM10 19h1v1h-1zM14 19h1v1h-1zM15 19h1v1h-1zM16 19h1v1h-1zM19 19h1v1h-1zM27 19h1v1h-1zM0 20h1v1h-1zM3 20h1v1h-1zM5 20h1v1h-1zM6 20h1v1h-1zM9 20h1v1h-1zM15 20h1v1h-1zM16 20h1v1h-1zM17 20h1v1h-1zM20 20h1v1h-1zM21 20h1v1h-1zM22 20h1v1h-1zM23 20h1v1h-1zM24 20h1v1h-1zM26 20h1v1h-1zM27 20h1v1h-1zM28 20h1v1h-1zM8 21h1v1h-1zM9 21h1v1h-1zM10 21h1v1h-1zM11 21h1v1h-1zM13 21h1v1h-1zM14 21h1v1h-1zM16 21h1v1h-1zM18 21h1v1h-1zM20 21h1v1h-1zM24 21h1v1h-1zM25 21h1v1h-1zM26 21h1v1h-1zM27 21h1v1h-1zM28 21h1v1h-1zM0 22h1v1h-1zM1 22h1v1h-1zM2 22h1v1h-1zM3 22h1v1h-1zM4 22h1v1h-1zM5 22h1v1h-1zM6 22h1v1h-1zM11 22h1v1h-1zM13 22h1v1h-1zM14 22h1v1h-1zM15 22h1v1h-1zM16 22h1v1h-1zM18 22h1v1h-1zM19 22h1v1h-1zM20 22h1v1h-1zM22 22h1v1h-1zM24 22h1v1h-1zM25 22h1v1h-1zM26 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM8 23h1v1h-1zM9 23h1v1h-1zM11 23h1v1h-1zM12 23h1v1h-1zM13 23h1v1h-1zM19 23h1v1h-1zM20 23h1v1h-1zM24 23h1v1h-1zM0 24h1v1h-1zM2 24h1v1h-1zM3 24h1v1h-1zM4 24h1v1h-1zM6 24h1v1h-1zM8 24h1v1h-1zM9 24h1v1h-1zM11 24h1v1h-1zM12 24h1v1h-1zM14 24h1v1h-1zM15 24h1v1h-1zM16 24h1v1h-1zM17 24h1v1h-1zM20 24h1v1h-1zM21 24h1v1h-1zM22 24h1v1h-1zM23 24h1v1h-1zM24 24h1v1h-1zM26 24h1v1h-1zM0 25h1v1h-1zM2 25h1v1h-1zM3 25h1v1h-1zM4 25h1v1h-1zM6 25h1v1h-1zM8 25h1v1h-1zM9 25h1v1h-1zM10 25h1v1h-1zM13 25h1v1h-1zM16 25h1v1h-1zM18 25h1v1h-1zM20 25h1v1h-1zM23 25h1v1h-1zM25 25h1v1h-1zM26 25h1v1h-1zM27 25h1v1h-1zM28 25h1v1h-1zM0 26h1v1h-1zM2 26h1v1h-1zM3 26h1v1h-1zM4 26h1v1h-1zM6 26h1v1h-1zM8 26h1v1h-1zM9 26h1v1h-1zM14 26h1v1h-1zM15 26h1v1h-1zM16 26h1v1h-1zM19 26h1v1h-1zM20 26h1v1h-1zM22 26h1v1h-1zM23 26h1v1h-1zM24 26h1v1h-1zM25 26h1v1h-1zM26 26h1v1h-1zM27 26h1v1h-1zM0 27h1v1h-1zM6 27h1v1h-1zM9 27h1v1h-1zM10 27h1v1h-1zM13 27h1v1h-1zM14 27h1v1h-1zM16 27h1v1h-1zM18 27h1v1h-1zM20 27h1v1h-1zM21 27h1v1h-1zM23 27h1v1h-1zM24 27h1v1h-1zM25 27h1v1h-1zM27 27h1v1h-1zM0 28h1v1h-1zM1 28h1v1h-1zM2 28h1v1h-1zM3 28h1v1h-1zM4 28h1v1h-1zM5 28h1v1h-1zM6 28h1v1h-1zM8 28h1v1h-1zM9 28h1v1h-1zM10 28h1v1h-1zM11 28h1v1h-1zM12 28h1v1h-1zM16 28h1v1h-1zM17 28h1v1h-1zM18 28h1v1h-1zM22 28h1v1h-1zM23 28h1v1h-1zM24 28h1v1h-1zM26 28h1v1h-1z" />
        </svg>
      </div>
      <figcaption className="ez-num mt-3 text-[0.82rem] font-semibold text-ink-500">{shown}</figcaption>
    </figure>
  )
}
