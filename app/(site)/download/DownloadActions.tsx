'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { employeeApp, site } from '@/site.config'

/* ============================================================================
 * The only interactive part of the download page.
 *
 * Everything else — the copy, the phone, the QR, the steps, the FAQ — is a
 * server component, so this file is the whole of the page's JavaScript. It
 * handles four things:
 *
 *   · handing over the APK, and saying so afterwards
 *   · /download?start=1, which the QR code and the WhatsApp link use
 *   · iPhone visitors, who have nothing to install yet
 *   · copying the page's own link, for someone forwarding it to a team
 *
 * The build it hands out lives in site.config.ts (see the notes on
 * employeeApp there, including the one about the Expo artifact url expiring),
 * so a new release is a config change rather than a component change.
 * ========================================================================= */

const APP = employeeApp
const PAGE_URL = `${site.url}/download`

function track(name: string) {
  try {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] }
    if (typeof w.gtag === 'function') w.gtag('event', name, { app_version: APP.version })
    else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, app_version: APP.version })
  } catch {}
}

/** Starts the download. A plain function, because two buttons on the page
 *  do it and neither owns the behaviour. */
function fetchApk(event: string) {
  const a = document.createElement('a')
  a.href = APP.androidUrl
  a.rel = 'noopener'
  /* No `a.download`. The APK is served from Expo, and a browser ignores the
     download attribute across origins, so setting it only misleads whoever
     reads this next. The file lands with the build id in its name. */
  document.body.appendChild(a)
  a.click()
  a.remove()
  track(event)
}

/* Is this an iPhone or iPad?
 *
 * Read through useSyncExternalStore rather than set from an effect. Doing
 * `setIsIOS(…)` in an effect body — which this repo's lint rejects, for good
 * reason — schedules a second render for a value that was knowable the moment
 * the component mounted. navigator does not exist during SSR, so the server
 * snapshot is false and the client corrects it on hydration without a flash.
 *
 * subscribe returns an empty unsubscribe on purpose: a device does not stop
 * being an iPhone, so there is nothing to listen to. */
const subscribeNever = () => () => {}
const readIsIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent || '') ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
const serverIsIOS = () => false

/** The hero's actions: the two buttons, the file's details, and what the page
 *  says once the download is on its way. */
export function DownloadPanel() {
  const [started, setStarted] = useState(false)
  const isIOS = useSyncExternalStore(subscribeNever, readIsIOS, serverIsIOS)
  const autoStarted = useRef(false)

  const start = () => {
    fetchApk('ezer_app_download')
    setStarted(true)
  }

  /* /download?start=1 begins the download on open — what the QR code and the
     WhatsApp link point at. Never on an iPhone: there is no APK to give them,
     so they get the note instead.
 
     THE LATCH IS SET WHEN THE DOWNLOAD FIRES, NOT WHEN IT IS SCHEDULED, and
     that is the whole of it. Setting it here, beside the guard, reads fine
     and never downloads anything: React runs this effect twice on mount in
     development, so the first pass latched and scheduled, the cleanup
     cancelled that timer, and the second pass saw the latch and returned.
     The QR code led to a page that quietly did nothing. It would have come
     back in production too, on any re-run — an iPad flipping isIOS after
     hydration is one. The ref now means what its name says: a download has
     actually been handed over. */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('start') !== '1' || isIOS || autoStarted.current) return
    const t = setTimeout(() => {
      autoStarted.current = true
      fetchApk('ezer_app_download')
      setStarted(true)
    }, 700)
    return () => clearTimeout(t)
  }, [isIOS])

  return (
    <div className="w-full">
      {/* ONE action here, deliberately. This row used to carry the download
          button and, beside it, the words "iPhone app coming soon" in grey:
          a dead thing sitting in the one place on the page where the eye
          goes to act, saying no. The iPhone note is still on the page, two
          blocks down, where a note belongs. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button variant="primary" size="lg" onClick={start} className="w-full sm:w-auto">
          <Icon name={started ? 'check' : 'download'} className="h-[18px] w-[18px]" />
          {started ? 'Download started' : 'Download for Android'}
        </Button>

        {/* Appears by itself the day employeeApp.iosUrl is filled in. */}
        {APP.iosUrl && (
          <Button variant="secondary" size="lg" href={APP.iosUrl} className="w-full sm:w-auto">
            <Icon name="phone" className="h-[18px] w-[18px]" />
            Download on the App Store
          </Button>
        )}
      </div>

      {/* What they are about to download, in the three facts that decide
          whether they tap now or on Wi-Fi later. */}
      <dl className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.88rem] text-ink-500">
        <div className="flex items-center gap-2">
          <Icon name="shield" className="h-4 w-4 text-brand-600" />
          <dt className="sr-only">Signed by</dt>
          <dd>Signed by {APP.publisher}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="download" className="h-4 w-4 text-brand-600" />
          <dt className="sr-only">File</dt>
          <dd className="ez-num">
            APK · {APP.sizeLabel} · v{APP.version}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="clock" className="h-4 w-4 text-brand-600" />
          <dt className="sr-only">Updated</dt>
          <dd>Updated {APP.updatedOn}</dd>
        </div>
      </dl>

      {/* Said once, and honestly. There is no progress bar here: the file
          comes from another origin, so this page cannot know how far along it
          is, and an invented bar that finishes early is worse than no bar. */}
      <div role="status" aria-live="polite">
        {started && (
          <div className="ez-panel-in mt-6 flex items-start gap-3 rounded-[18px] bg-white p-4 ring-1 ring-ink-900/[0.08]">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
              <Icon name="check" className="h-4 w-4" />
            </span>
            <p className="text-[0.95rem] leading-relaxed text-ink-600">
              <strong className="font-semibold text-ink-900">Your download has started.</strong>{' '}
              Look for the .apk file in your notifications when it finishes, then follow the
              four steps below. Nothing happening?{' '}
              <a
                href={APP.androidUrl}
                rel="noopener"
                className="ez-link font-semibold text-brand-700"
                onClick={() => track('ezer_app_download_retry')}
              >
                Download again
              </a>
              .
            </p>
          </div>
        )}
      </div>

      {/* The iPhone answer, in the two sizes it needs.
 
          "SOON" IS DELIBERATE AND IT IS THE BUSINESS'S CALL, not a default
          that drifted in. No date is named anywhere, which is the part that
          matters: a named date that slips becomes a broken promise on the
          one page an employee was told to trust. "Soon" keeps the promise
          warm without putting a number on it.
 
          It does carry an expiry of its own, though. A line that has said
          "soon" for a year reads as neglect rather than as a plan, so if the
          iOS build is still not out by the middle of 2027, change this
          wording rather than leaving it to age. The day employeeApp.iosUrl
          is filled in, all of this disappears by itself.
 
          Someone actually on an iPhone gets the full note, because for them
          it is the answer to the only question they came with. Everyone else
          gets one quiet line, because for them it is a footnote. */}
      {!APP.iosUrl &&
        (isIOS ? (
          <div className="mt-6 flex items-start gap-3 rounded-[18px] bg-paper-2 p-4 ring-1 ring-ink-900/[0.06]">
            <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <p className="text-[0.95rem] leading-relaxed text-ink-600">
              <strong className="font-semibold text-ink-900">You are on an iPhone.</strong>{' '}
              The EZER iOS app launches on the App Store soon. Until it does, sign in to EZER
              in Safari: payslips, leave, attendance and approvals all work there, and your
              login is the same one.
            </p>
          </div>
        ) : (
          <p className="mt-5 flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-ink-500">
            <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
            <span>
              Using an iPhone? The EZER iOS app launches soon. Until then, EZER runs in any
              mobile browser.
            </span>
          </p>
        ))}
    </div>
  )
}

/** The closing band's button. Sits on cobalt, so it is the onDark variant. */
export function DownloadAgain() {
  const [started, setStarted] = useState(false)
  return (
    <Button
      variant="onDark"
      size="lg"
      className="w-full sm:w-auto"
      onClick={() => {
        fetchApk('ezer_app_download_closing')
        setStarted(true)
      }}
    >
      <Icon name={started ? 'check' : 'download'} className="h-[18px] w-[18px]" />
      {started ? 'Download started' : 'Download for Android'}
    </Button>
  )
}

/** Copies this page's link — for the HR manager sending it to a team. */
export function CopyLink() {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(PAGE_URL)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {
          /* Denied permission, or an insecure origin. The link is printed
             under the QR code either way, so there is nothing to recover. */
        }
      }}
    >
      <Icon name={copied ? 'check' : 'file'} className="h-4 w-4" />
      {copied ? 'Link copied' : 'Copy link'}
    </Button>
  )
}
