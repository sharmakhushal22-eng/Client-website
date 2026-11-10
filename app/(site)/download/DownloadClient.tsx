"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { contact, employeeApp, site } from "@/site.config";
import "./download.css";

/* The build this page hands out lives in site.config.ts, so shipping a new
   one does not mean opening a component. See the notes on employeeApp there,
   including the one about the Expo artifact URL expiring. */
const APP = {
  ...employeeApp,
  pageUrl: `${site.url}/download`,
};

type State = "idle" | "downloading";

function track(name: string) {
  try {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
    if (typeof w.gtag === "function") w.gtag("event", name, { app_version: APP.version });
    else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, app_version: APP.version });
  } catch {}
}

/* Is this an iPhone or iPad?
 *
 * Read through useSyncExternalStore rather than set from an effect. The
 * original did `setIsIOS(…)` in the effect body, which this repo's lint
 * rejects for good reason: it schedules a second render for a value that was
 * knowable the moment the component mounted. navigator does not exist during
 * SSR either, so the server snapshot is simply false and the client corrects
 * it on hydration without a flash or a mismatch warning.
 *
 * The subscribe function returns an empty unsubscribe on purpose: a device
 * does not stop being an iPhone, so there is nothing to listen to. */
const subscribeNever = () => () => {};
const readIsIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent || "") ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const serverIsIOS = () => false;

const IcDownload = ({ c = "currentColor", s = 22 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" />
  </svg>
);
const IcCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5 10 17l9-10" /></svg>
);
const IcPhone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M10.5 18.5h3" /></svg>
);
const IcShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
const IcDot = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2" strokeLinecap="round" /></svg>
);

const FEATURES = [
  { t: "Punch in & out", d: "One tap attendance with location check, shift timer and your on-time streak.", i: <path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
  { t: "Leave in seconds", d: "See balances, apply leave or WFH and track approval status live.", i: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></> },
  { t: "Payslips & Form 16", d: "Download payslips, view TDS and submit investment declarations.", i: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></> },
  { t: "Approvals on the go", d: "Managers approve leave, claims and requests straight from the Inbox.", i: <><path d="M4 13l4 4L20 5" /></> },
  { t: "Expense claims", d: "Log local and outstation travel, attach bills and claim without paperwork.", i: <><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18M7 15h4" /></> },
  { t: "Wall of Fame", d: "Give badges and appreciation to colleagues and celebrate wins together.", i: <><path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.8L12 3Z" /></> },
];

const FAQ = [
  { q: "Who can use the EZER app?", a: "Employees of companies that run EZER HRMS. Sign in with the login details your HR team shared with you. They are the same ones you use on the EZER web portal." },
  { q: "Android says “Install unknown apps”. Is it safe?", a: `Yes. Because the app is downloaded directly from ezerhrms.com (not the Play Store), Android asks you to allow installs from your browser once. The file is published and signed by ${APP.publisher}. Only download it from this page.` },
  { q: "Is there an iPhone app?", a: "The iPhone app is coming soon to the App Store. Till then, iPhone users can use the full EZER employee portal in Safari." },
  { q: "How do I get updates?", a: "Whenever a new version is out, download it again from this page and install it over the old one. Your data stays safe on the server, so nothing is lost." },
  { q: "Is my data secure?", a: "All data travels over encrypted connections and stays on EZER’s secure servers in India. Salary, Aadhaar and bank details are masked and shown only to authorised roles." },
];

export default function DownloadClient() {
  const [state, setState] = useState<State>("idle");
  const isIOS = useSyncExternalStore(subscribeNever, readIsIOS, serverIsIOS);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);

  const startDownload = () => {
    const a = document.createElement("a");
    a.href = APP.androidUrl;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setState("downloading");
    track("ezer_app_download");
  };

  /* Auto-start: /download?start=1 begins the download on open, which is what
     the QR code and the WhatsApp link use. Never on iPhone, where there is no
     APK to give them — they get the "coming soon" note instead. */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("start") !== "1" || isIOS || started.current) return;
    started.current = true;
    const t = setTimeout(startDownload, 700);
    return () => clearTimeout(t);
  }, [isIOS]);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(APP.pageUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <main className="ezdl">
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow"><i />EZER ESS app · v{APP.version}</span>
            <h1>Your HR, now<br /><span>in your pocket.</span></h1>
            <p className="lead">Punch in, apply for leave, download payslips and approve requests. Everything EZER does, on your phone.</p>

            <div className="cta-row">
              <button type="button" className="btn-dl" onClick={startDownload} data-state={state} aria-describedby="ezdl-meta">
                <span className="ic">{state === "downloading" ? <IcCheck /> : <IcDownload c="#1D4ED8" />}</span>
                <span>
                  <span className="t1">{state === "downloading" ? "Download started" : "Download for Android"}</span>
                  <span className="t2">APK · {APP.sizeLabel} · v{APP.version}</span>
                </span>
              </button>

              {APP.iosUrl ? (
                <a className="btn-ios" href={APP.iosUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("ezer_ios_click")}>
                  <IcPhone /><span><span className="t1">iPhone</span><span className="t2">Get it on the App Store</span></span>
                </a>
              ) : (
                <span className="btn-ios" aria-disabled="true">
                  <IcPhone /><span><span className="t1">iPhone</span><span className="t2">App Store · coming soon</span></span>
                </span>
              )}
            </div>

            <div className="meta" id="ezdl-meta">
              <span><IcShield /> Signed by {APP.publisher}</span>
              <span><IcPhone /> APK · {APP.sizeLabel}</span>
              <span><IcDot /> Updated {APP.updatedOn}</span>
            </div>

            <div className="status" role="status" aria-live="polite" hidden={state !== "downloading"}>
              <div className="row">
                <span className="tick"><IcCheck /></span>
                <div>
                  <b>Your download has started</b>
                  {/* The file is NOT named ezer-hrms.apk and this used to say
                      it was. The APK is served from Expo, and a browser
                      ignores the download attribute across origins, so the
                      file lands with the build id in its name. Telling
                      someone to look for a filename they will never see sends
                      them hunting through Downloads for nothing. */}
                  <p>Look for the .apk file in your notifications when it finishes. Nothing happening? <a href={APP.androidUrl} rel="noopener" onClick={() => track("ezer_app_download_retry")}>Download again</a></p>
                </div>
              </div>
              <div className="bar"><i /></div>
            </div>

            <div className="ios-note" hidden={!isIOS || !!APP.iosUrl}>
              You&apos;re on an iPhone. The iOS app is coming soon. Until then, use the EZER employee portal in Safari.
            </div>
          </div>

          <div className="phone-wrap" aria-hidden="true">
            <div className="phone">
              <div className="screen">
                <div className="notch" />
                <div className="s-top"><small>Good morning</small><strong>Rahul Nair</strong></div>
                <div className="s-punch">
                  <div className="dial"><span>6h 48m</span></div>
                  <div>
                    <div className="pt">Punched in · 09:12 AM</div>
                    <div className="pv">On time · 14 days</div>
                    <span className="pb">Punch out</span>
                  </div>
                </div>
                <div className="s-tiles">
                  <div className="tile"><div className="k">Leave balance</div><div className="v">12.5 days</div><span className="chip">Apply</span></div>
                  <div className="tile"><div className="k">Payslip · Oct</div><div className="v">₹ ••••••</div><span className="chip">View</span></div>
                  <div className="tile"><div className="k">Inbox</div><div className="v">3 new</div><span className="chip ok">2 approved</span></div>
                  <div className="tile"><div className="k">Wall of Fame</div><div className="v">5 badges</div><span className="chip">Give</span></div>
                </div>
                <div className="s-tab"><i className="on" /><i /><i /><i /><i /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR CARD */}
      <div className="wrap">
        <div className="qr-card">
          <div className="qr" aria-label="QR code to download the EZER app">
            <svg viewBox="0 0 29 29" shapeRendering="crispEdges"><path fill="#111827" d="M0 0h1v1h-1zM1 0h1v1h-1zM2 0h1v1h-1zM3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM9 0h1v1h-1zM14 0h1v1h-1zM17 0h1v1h-1zM18 0h1v1h-1zM19 0h1v1h-1zM20 0h1v1h-1zM22 0h1v1h-1zM23 0h1v1h-1zM24 0h1v1h-1zM25 0h1v1h-1zM26 0h1v1h-1zM27 0h1v1h-1zM28 0h1v1h-1zM0 1h1v1h-1zM6 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM15 1h1v1h-1zM16 1h1v1h-1zM17 1h1v1h-1zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM6 2h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM14 2h1v1h-1zM15 2h1v1h-1zM16 2h1v1h-1zM20 2h1v1h-1zM22 2h1v1h-1zM24 2h1v1h-1zM25 2h1v1h-1zM26 2h1v1h-1zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h1v1h-1zM3 3h1v1h-1zM4 3h1v1h-1zM6 3h1v1h-1zM8 3h1v1h-1zM9 3h1v1h-1zM10 3h1v1h-1zM16 3h1v1h-1zM17 3h1v1h-1zM22 3h1v1h-1zM24 3h1v1h-1zM25 3h1v1h-1zM26 3h1v1h-1zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM6 4h1v1h-1zM8 4h1v1h-1zM13 4h1v1h-1zM19 4h1v1h-1zM20 4h1v1h-1zM22 4h1v1h-1zM24 4h1v1h-1zM25 4h1v1h-1zM26 4h1v1h-1zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM13 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM17 5h1v1h-1zM20 5h1v1h-1zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h1v1h-1zM1 6h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h1v1h-1zM23 6h1v1h-1zM24 6h1v1h-1zM25 6h1v1h-1zM26 6h1v1h-1zM27 6h1v1h-1zM28 6h1v1h-1zM8 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM16 7h1v1h-1zM19 7h1v1h-1zM20 7h1v1h-1zM0 8h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM11 8h1v1h-1zM14 8h1v1h-1zM15 8h1v1h-1zM16 8h1v1h-1zM17 8h1v1h-1zM19 8h1v1h-1zM22 8h1v1h-1zM23 8h1v1h-1zM24 8h1v1h-1zM25 8h1v1h-1zM26 8h1v1h-1zM0 9h1v1h-1zM4 9h1v1h-1zM5 9h1v1h-1zM10 9h1v1h-1zM11 9h1v1h-1zM16 9h1v1h-1zM17 9h1v1h-1zM18 9h1v1h-1zM19 9h1v1h-1zM21 9h1v1h-1zM22 9h1v1h-1zM23 9h1v1h-1zM24 9h1v1h-1zM28 9h1v1h-1zM0 10h1v1h-1zM2 10h1v1h-1zM3 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM11 10h1v1h-1zM15 10h1v1h-1zM17 10h1v1h-1zM20 10h1v1h-1zM21 10h1v1h-1zM22 10h1v1h-1zM0 11h1v1h-1zM1 11h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM4 11h1v1h-1zM8 11h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM14 11h1v1h-1zM18 11h1v1h-1zM20 11h1v1h-1zM21 11h1v1h-1zM24 11h1v1h-1zM25 11h1v1h-1zM27 11h1v1h-1zM1 12h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM10 12h1v1h-1zM12 12h1v1h-1zM15 12h1v1h-1zM16 12h1v1h-1zM17 12h1v1h-1zM19 12h1v1h-1zM23 12h1v1h-1zM25 12h1v1h-1zM26 12h1v1h-1zM2 13h1v1h-1zM3 13h1v1h-1zM4 13h1v1h-1zM5 13h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1zM11 13h1v1h-1zM13 13h1v1h-1zM14 13h1v1h-1zM16 13h1v1h-1zM17 13h1v1h-1zM18 13h1v1h-1zM19 13h1v1h-1zM20 13h1v1h-1zM22 13h1v1h-1zM23 13h1v1h-1zM24 13h1v1h-1zM28 13h1v1h-1zM0 14h1v1h-1zM1 14h1v1h-1zM6 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM15 14h1v1h-1zM16 14h1v1h-1zM20 14h1v1h-1zM21 14h1v1h-1zM23 14h1v1h-1zM24 14h1v1h-1zM25 14h1v1h-1zM26 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM8 15h1v1h-1zM13 15h1v1h-1zM15 15h1v1h-1zM18 15h1v1h-1zM19 15h1v1h-1zM20 15h1v1h-1zM21 15h1v1h-1zM22 15h1v1h-1zM23 15h1v1h-1zM24 15h1v1h-1zM27 15h1v1h-1zM0 16h1v1h-1zM3 16h1v1h-1zM4 16h1v1h-1zM5 16h1v1h-1zM6 16h1v1h-1zM7 16h1v1h-1zM10 16h1v1h-1zM11 16h1v1h-1zM14 16h1v1h-1zM15 16h1v1h-1zM17 16h1v1h-1zM19 16h1v1h-1zM25 16h1v1h-1zM26 16h1v1h-1zM0 17h1v1h-1zM2 17h1v1h-1zM8 17h1v1h-1zM10 17h1v1h-1zM12 17h1v1h-1zM16 17h1v1h-1zM17 17h1v1h-1zM18 17h1v1h-1zM19 17h1v1h-1zM20 17h1v1h-1zM21 17h1v1h-1zM22 17h1v1h-1zM23 17h1v1h-1zM24 17h1v1h-1zM26 17h1v1h-1zM28 17h1v1h-1zM0 18h1v1h-1zM2 18h1v1h-1zM3 18h1v1h-1zM4 18h1v1h-1zM5 18h1v1h-1zM6 18h1v1h-1zM10 18h1v1h-1zM11 18h1v1h-1zM12 18h1v1h-1zM15 18h1v1h-1zM17 18h1v1h-1zM20 18h1v1h-1zM22 18h1v1h-1zM26 18h1v1h-1zM0 19h1v1h-1zM3 19h1v1h-1zM4 19h1v1h-1zM8 19h1v1h-1zM10 19h1v1h-1zM14 19h1v1h-1zM15 19h1v1h-1zM16 19h1v1h-1zM19 19h1v1h-1zM27 19h1v1h-1zM0 20h1v1h-1zM3 20h1v1h-1zM5 20h1v1h-1zM6 20h1v1h-1zM9 20h1v1h-1zM15 20h1v1h-1zM16 20h1v1h-1zM17 20h1v1h-1zM20 20h1v1h-1zM21 20h1v1h-1zM22 20h1v1h-1zM23 20h1v1h-1zM24 20h1v1h-1zM26 20h1v1h-1zM27 20h1v1h-1zM28 20h1v1h-1zM8 21h1v1h-1zM9 21h1v1h-1zM10 21h1v1h-1zM11 21h1v1h-1zM13 21h1v1h-1zM14 21h1v1h-1zM16 21h1v1h-1zM18 21h1v1h-1zM20 21h1v1h-1zM24 21h1v1h-1zM25 21h1v1h-1zM26 21h1v1h-1zM27 21h1v1h-1zM28 21h1v1h-1zM0 22h1v1h-1zM1 22h1v1h-1zM2 22h1v1h-1zM3 22h1v1h-1zM4 22h1v1h-1zM5 22h1v1h-1zM6 22h1v1h-1zM11 22h1v1h-1zM13 22h1v1h-1zM14 22h1v1h-1zM15 22h1v1h-1zM16 22h1v1h-1zM18 22h1v1h-1zM19 22h1v1h-1zM20 22h1v1h-1zM22 22h1v1h-1zM24 22h1v1h-1zM25 22h1v1h-1zM26 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM8 23h1v1h-1zM9 23h1v1h-1zM11 23h1v1h-1zM12 23h1v1h-1zM13 23h1v1h-1zM19 23h1v1h-1zM20 23h1v1h-1zM24 23h1v1h-1zM0 24h1v1h-1zM2 24h1v1h-1zM3 24h1v1h-1zM4 24h1v1h-1zM6 24h1v1h-1zM8 24h1v1h-1zM9 24h1v1h-1zM11 24h1v1h-1zM12 24h1v1h-1zM14 24h1v1h-1zM15 24h1v1h-1zM16 24h1v1h-1zM17 24h1v1h-1zM20 24h1v1h-1zM21 24h1v1h-1zM22 24h1v1h-1zM23 24h1v1h-1zM24 24h1v1h-1zM26 24h1v1h-1zM0 25h1v1h-1zM2 25h1v1h-1zM3 25h1v1h-1zM4 25h1v1h-1zM6 25h1v1h-1zM8 25h1v1h-1zM9 25h1v1h-1zM10 25h1v1h-1zM13 25h1v1h-1zM16 25h1v1h-1zM18 25h1v1h-1zM20 25h1v1h-1zM23 25h1v1h-1zM25 25h1v1h-1zM26 25h1v1h-1zM27 25h1v1h-1zM28 25h1v1h-1zM0 26h1v1h-1zM2 26h1v1h-1zM3 26h1v1h-1zM4 26h1v1h-1zM6 26h1v1h-1zM8 26h1v1h-1zM9 26h1v1h-1zM14 26h1v1h-1zM15 26h1v1h-1zM16 26h1v1h-1zM19 26h1v1h-1zM20 26h1v1h-1zM22 26h1v1h-1zM23 26h1v1h-1zM24 26h1v1h-1zM25 26h1v1h-1zM26 26h1v1h-1zM27 26h1v1h-1zM0 27h1v1h-1zM6 27h1v1h-1zM9 27h1v1h-1zM10 27h1v1h-1zM13 27h1v1h-1zM14 27h1v1h-1zM16 27h1v1h-1zM18 27h1v1h-1zM20 27h1v1h-1zM21 27h1v1h-1zM23 27h1v1h-1zM24 27h1v1h-1zM25 27h1v1h-1zM27 27h1v1h-1zM0 28h1v1h-1zM1 28h1v1h-1zM2 28h1v1h-1zM3 28h1v1h-1zM4 28h1v1h-1zM5 28h1v1h-1zM6 28h1v1h-1zM8 28h1v1h-1zM9 28h1v1h-1zM10 28h1v1h-1zM11 28h1v1h-1zM12 28h1v1h-1zM16 28h1v1h-1zM17 28h1v1h-1zM18 28h1v1h-1zM22 28h1v1h-1zM23 28h1v1h-1zM24 28h1v1h-1zM26 28h1v1h-1z" /></svg>
          </div>
          <div>
            <h3>On a computer? Scan to get it on your phone.</h3>
            <p>Open your phone camera, point it at the code and the download starts on its own.</p>
            <span className="qr-url">{APP.pageUrl.replace(/^https?:\/\//, "")}</span>
          </div>
          <button type="button" className="copy" onClick={copyLink}>{copied ? "Link copied ✓" : "Copy link"}</button>
        </div>
      </div>

      {/* FEATURES */}
      <section className="blk">
        <div className="wrap">
          <div className="kicker">What&apos;s inside</div>
          <h2>Everything an employee needs, one tap away.</h2>
          <p className="sub">The same EZER you use on the web, rebuilt for your phone.</p>
          <div className="feat">
            {FEATURES.map((f) => (
              <div className="fc" key={f.t}>
                <div className="fi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.i}</svg></div>
                <h4>{f.t}</h4><p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTALL STEPS */}
      <section className="blk steps-bg" id="install">
        <div className="wrap">
          <div className="kicker">Install in 1 minute</div>
          <h2>How to install on Android</h2>
          <p className="sub">Since the app comes straight from ezerhrms.com, Android asks for one extra permission the first time.</p>
          <div className="steps">
            <div className="st"><h4>Download</h4><p>Tap <b>Download for Android</b>. A 113 MB .apk file saves to your phone, so use Wi-Fi if you can.</p></div>
            <div className="st"><h4>Open the file</h4><p>Tap the finished download in your notifications or the Downloads folder.</p></div>
            <div className="st"><h4>Allow install</h4><p>If asked, tap <b>Settings → Allow from this source</b>, then go back and tap <b>Install</b>.</p></div>
            <div className="st"><h4>Sign in</h4><p>Open EZER and sign in with the login your HR team gave you. Done!</p></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="blk">
        <div className="wrap faq-grid">
          <div>
            <div className="kicker">FAQ</div>
            <h2>Questions before you install</h2>
            <p className="sub">Still stuck? Reach us on WhatsApp at {contact.whatsappDisplay}.</p>
          </div>
          <div>
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="blk" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="closing">
            <div><h3>Ready? Get EZER on your phone.</h3><p>Sign in with your company&apos;s EZER login.</p></div>
            <button type="button" className="btn-dl" onClick={() => { startDownload(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <span className="ic"><IcDownload c="#1D4ED8" /></span>
              <span><span className="t1">Download for Android</span><span className="t2">{APP.sizeLabel} · v{APP.version}</span></span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
