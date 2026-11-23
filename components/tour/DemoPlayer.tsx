'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { demoFlows, type DemoPersona, type DemoStep, type DemoTarget } from '@/content/tour'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { requestFlow, useFlowRequest, usePageVisible, useReducedMotion } from './demoStore'
import { useInView } from './useInView'

/* ============================================================================
 * The demo player: the product, driving itself.
 *
 * Every flow is a run of real screens recorded from the live app. For each
 * step the capture script measured where the next click lands, so here a
 * cursor glides to that exact spot, the camera eases in on it, the cursor
 * presses, and the next real screen follows. Steps whose real click would
 * save data were only pointed at during capture, and are only pointed at
 * here.
 *
 * Timeline of one step:
 *   show  → the screen settles and its caption appears
 *   move  → the cursor travels to the target while the camera zooms in
 *   aim   → a ring marks the target
 *   act   → press (click) / hold (hover) / slow drift (no target)
 *   swap  → the camera eases back out while the next screen fades in
 *
 * Loading: every screen of the current flow is rendered (stacked, one
 * visible) the moment the flow starts, so it is fetched up front, and the
 * first screen of the next flow is fetched before this one ends. Under each
 * screen sits a 30px blurred copy inlined in the page, so the frame is never
 * blank, and the player will not move on to a screen that has not decoded.
 *
 * It only plays while it is on screen and the tab is visible, stops for good
 * when the visitor presses pause, and never auto-plays for anyone who has
 * asked their system for reduced motion (they step through by hand).
 * ========================================================================= */

type Phase = 'show' | 'move' | 'aim' | 'act' | 'swap'

const T = { first: 2000, show: 1500, move: 850, aim: 300, press: 420, point: 850, drift: 2000, swap: 500 }
const REST = { x: 84, y: 80 }
const CENTRE = { x: 50, y: 32 }

const hasTarget = (s: DemoStep): s is DemoStep & { target: DemoTarget } => !!s.target && s.act !== 'none'
const originOf = (s: DemoStep) => (hasTarget(s) ? { x: s.target.x, y: s.target.y } : CENTRE)
const zoomFor = (t: DemoTarget) => (t.w < 12 && t.h < 6 ? 1.36 : t.w * t.h < 300 ? 1.22 : 1.1)

function stepMs(s: DemoStep, first: boolean) {
  const show = first ? T.first : T.show
  if (!hasTarget(s)) return show + T.drift
  return show + T.move + T.aim + (s.act === 'click' ? T.press : T.point)
}

export const personaTone: Record<DemoPersona, string> = {
  Employee: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Manager: 'bg-amber-50 text-amber-700 ring-amber-600/25',
  'HR team': 'bg-brand-50 text-brand-700 ring-brand-600/20',
}
const PERSONAS: DemoPersona[] = ['Employee', 'Manager', 'HR team']

export function DemoPlayer({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, 0.15)
  const reduced = useReducedMotion()
  const visible = usePageVisible()

  const [pos, setPos] = useState({ f: 0, s: 0 })
  const [phase, setPhase] = useState<Phase>('show')
  const [paused, setPaused] = useState(false)
  const [origin, setOrigin] = useState(() => originOf(demoFlows[0].steps[0]))
  const [cursor, setCursor] = useState(REST)
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set())

  const flow = demoFlows[pos.f]
  const step = flow.steps[pos.s]
  const target = hasTarget(step) ? step.target : null
  const ready = loaded.has(step.src)
  const running = inView && visible && !paused && !reduced

  /* Another part of the page asked for a flow (a library card). Adjusting
     state while rendering, guarded by the request counter. */
  const req = useFlowRequest()
  const [seen, setSeen] = useState(0)
  if (req && req.n !== seen) {
    setSeen(req.n)
    const f = Math.max(0, demoFlows.findIndex((x) => x.id === req.id))
    setPos({ f, s: 0 })
    setPhase('show')
    setPaused(false)
    setOrigin(originOf(demoFlows[f].steps[0]))
  }

  const markLoaded = useCallback((src: string) => {
    setLoaded((prev) => (prev.has(src) ? prev : new Set(prev).add(src)))
  }, [])

  const goTo = useCallback((f: number, s: number) => {
    const st = demoFlows[f].steps[s]
    setPos({ f, s })
    setPhase('show')
    setOrigin(originOf(st))
  }, [])

  const nextOf = useCallback((p: { f: number; s: number }) => {
    if (p.s + 1 < demoFlows[p.f].steps.length) return { f: p.f, s: p.s + 1 }
    return { f: (p.f + 1) % demoFlows.length, s: 0 }
  }, [])

  const stepBy = useCallback(
    (d: 1 | -1) => {
      if (target) setCursor({ x: target.x, y: target.y })
      if (d === 1) {
        const n = nextOf(pos)
        goTo(n.f, n.s)
      } else if (pos.s > 0) goTo(pos.f, pos.s - 1)
      else {
        const f = (pos.f - 1 + demoFlows.length) % demoFlows.length
        goTo(f, demoFlows[f].steps.length - 1)
      }
    },
    [goTo, nextOf, pos, target],
  )

  /* The clock. One timer per phase; pausing simply drops it, resuming
     starts the current phase again. */
  useEffect(() => {
    if (!running || !ready) return
    let ms = 0
    let then: () => void
    switch (phase) {
      case 'show':
        ms = pos.s === 0 ? T.first : T.show
        then = () => setPhase(target ? 'move' : 'act')
        break
      case 'move':
        ms = T.move
        then = () => setPhase('aim')
        break
      case 'aim':
        ms = T.aim
        then = () => setPhase('act')
        break
      case 'act':
        ms = !target ? T.drift : step.act === 'click' ? T.press : T.point
        then = () => {
          setCursor(target ? { x: target.x, y: target.y } : REST)
          setPos(nextOf(pos))
          setPhase('swap')
        }
        break
      default:
        ms = T.swap
        then = () => {
          setOrigin(originOf(step))
          setPhase('show')
        }
    }
    const t = window.setTimeout(then, ms)
    return () => window.clearTimeout(t)
  }, [running, ready, phase, pos, step, target, nextOf])

  /* /product-tour#demo-<flow> (linked from the feature pages) starts that
     flow and brings the player into view. */
  useEffect(() => {
    const m = /^#demo-([\w-]+)$/.exec(window.location.hash)
    if (!m || !demoFlows.some((f) => f.id === m[1])) return
    requestFlow(m[1])
    rootRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  /* Fetch the next flow's opening screen before this flow ends. */
  useEffect(() => {
    if (pos.s < flow.steps.length - 2) return
    const n = demoFlows[(pos.f + 1) % demoFlows.length].steps[0]
    const img = new Image()
    img.src = window.innerWidth < 900 ? n.srcSm : n.src
  }, [pos, flow.steps.length])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setPaused(true); stepBy(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setPaused(true); stepBy(-1) }
    else if (e.key === ' ' && e.target === e.currentTarget) { e.preventDefault(); setPaused((p) => !p) }
  }

  /* ── Derived view state ─────────────────────────────────────────────── */
  const engaged = phase === 'move' || phase === 'aim' || phase === 'act'
  const zoom = reduced ? 1 : target && engaged ? zoomFor(target) : !target && phase === 'act' ? 1.07 : 1
  const camMs = phase === 'move' ? T.move : !target && phase === 'act' ? T.drift : T.swap
  const cur = target && engaged ? { x: target.x, y: target.y } : !target && phase === 'act' ? REST : cursor
  const pressing = phase === 'act' && step.act === 'click' && !!target
  const showCallout = phase !== 'swap'
  const calloutRight = !!target && target.x < 50 && target.y > 52
  const isLast = pos.s === flow.steps.length - 1
  const upNext = demoFlows[(pos.f + 1) % demoFlows.length]
  const unique = flow.steps.filter((s, i, a) => a.findIndex((x) => x.src === s.src) === i)

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="product demo"
      aria-label="EZER product demo"
      data-phase={phase}
      tabIndex={0}
      onKeyDown={onKey}
      className={cn(
        'rounded-[1.4rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-7',
        className,
      )}
    >
      {/* ── Flow list, wide screens ─────────────────────────────────────── */}
      <nav aria-label="Demo flows" className="hidden lg:block">
        {PERSONAS.map((p) => (
          <div key={p} className="mb-4 last:mb-0">
            <p className="mb-1.5 px-3 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-ink-500">{p}</p>
            <ul className="space-y-0.5">
              {demoFlows.map((f, i) =>
                f.persona !== p ? null : (
                  <li key={f.id}>
                    <button
                      type="button"
                      aria-current={i === pos.f ? 'true' : undefined}
                      onClick={() => { setPaused(false); goTo(i, 0) }}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[0.88rem] font-semibold transition-colors',
                        i === pos.f ? 'bg-white text-ink-900 shadow-[var(--shadow-raised)] ring-1 ring-ink-900/[0.06]' : 'text-ink-600 hover:bg-white/70 hover:text-ink-900',
                      )}
                    >
                      <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg', i === pos.f ? 'bg-brand-600 text-white' : 'bg-ink-900/[0.05] text-ink-600')}>
                        <Icon name={f.icon} className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{f.name}</span>
                      {i === pos.f && (
                        <span className="text-[0.7rem] font-medium tabular-nums text-ink-500">
                          {pos.s + 1}/{f.steps.length}
                        </span>
                      )}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </nav>

      <div className="min-w-0">
      {/* ── Flow picker, narrow screens ─────────────────────────────────── */}
      <div className="-mx-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:hidden">
        <div className="flex w-max items-stretch gap-5 sm:w-auto sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
          {PERSONAS.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <span className={cn('rounded-full px-2 py-0.5 text-[0.66rem] font-semibold uppercase tracking-[0.08em] ring-1', personaTone[p])}>{p}</span>
              <div className="flex gap-1.5">
                {demoFlows.map((f, i) =>
                  f.persona !== p ? null : (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={i === pos.f}
                      onClick={() => { setPaused(false); goTo(i, 0) }}
                      className={cn(
                        'relative overflow-hidden whitespace-nowrap rounded-full px-3 py-1.5 text-[0.82rem] font-semibold transition-colors',
                        i === pos.f ? 'bg-ink-900 text-white' : 'bg-white text-ink-700 ring-1 ring-ink-900/10 hover:text-ink-900 hover:ring-ink-900/25',
                      )}
                    >
                      <span className="relative z-10 inline-flex items-center gap-1.5">
                        <Icon name={f.icon} className="h-3.5 w-3.5" />
                        {f.name}
                      </span>
                      {i === pos.f && (
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-brand-400 transition-transform duration-700"
                          style={{ transform: `scaleX(${(pos.s + 1) / f.steps.length})` }}
                        />
                      )}
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── The window ──────────────────────────────────────────────────── */}
      <div className="relative mt-3 overflow-hidden rounded-[1.1rem] bg-white lg:mt-0 shadow-[0_2px_4px_rgb(11_22_51/0.05),0_40px_80px_-30px_rgb(11_22_51/0.45)] ring-1 ring-ink-900/10 sm:rounded-[1.4rem]">
        {/* chrome */}
        <div className="flex items-center gap-3 border-b border-ink-900/[0.07] bg-[#f6f7fa] px-3 py-2 sm:px-4 sm:py-2.5">
          <span aria-hidden className="hidden gap-1.5 sm:flex">
            <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[0.72rem] text-ink-500 ring-1 ring-ink-900/[0.06] sm:mx-auto sm:max-w-md sm:flex-none sm:basis-[24rem]">
            <Icon name="lock" className="h-3 w-3 shrink-0" />
            <span className="truncate">{flow.host}</span>
            <span className="ml-auto hidden shrink-0 text-ink-400 sm:inline">
              {pos.s + 1} / {flow.steps.length}
            </span>
          </span>
          <span className="flex items-center gap-0.5">
            <CtrlButton label="Previous step" onClick={() => { setPaused(true); stepBy(-1) }}>
              <Icon name="arrow-left" className="h-3.5 w-3.5" />
            </CtrlButton>
            <CtrlButton label={paused || reduced ? 'Play the demo' : 'Pause the demo'} onClick={() => setPaused((p) => !p)}>
              {running ? <PauseGlyph /> : <Icon name="play" className="h-3.5 w-3.5" />}
            </CtrlButton>
            <CtrlButton label="Next step" onClick={() => { setPaused(true); stepBy(1) }}>
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </CtrlButton>
          </span>
        </div>

        {/* screen */}
        <div
          className="relative aspect-[16/10] cursor-pointer select-none overflow-hidden bg-[#eef1f6]"
          onClick={() => setPaused((p) => !p)}
        >
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transformOrigin: `${origin.x}% ${origin.y}%`,
              transform: `scale(${zoom})`,
              transition: `transform ${camMs}ms cubic-bezier(.65,0,.35,1)`,
            }}
          >
            {/* never blank: the blurred copy waits underneath */}
            <div
              aria-hidden
              className="absolute inset-0 scale-105 bg-cover bg-top blur-lg"
              style={{ backgroundImage: `url(${step.lqip})` }}
            />
            {unique.map((s, i) => {
              const on = s.src === step.src
              return (
                // eslint-disable-next-line @next/next/no-img-element -- pre-sized webp; next/image would re-encode and lazy-load what must be ready before the cursor arrives
                <img
                  key={s.src}
                  src={s.src}
                  srcSet={`${s.srcSm} 1024w, ${s.src} 1920w`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 92vw, 860px"
                  alt={on ? `${flow.name}: ${step.title}` : ''}
                  aria-hidden={!on}
                  decoding="async"
                  fetchPriority={pos.f === 0 && i === 0 ? 'high' : 'auto'}
                  draggable={false}
                  onLoad={() => markLoaded(s.src)}
                  ref={(el) => {
                    if (el?.complete && el.naturalWidth) markLoaded(s.src)
                  }}
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ease-out',
                    on && loaded.has(s.src) ? 'opacity-100' : 'opacity-0',
                  )}
                />
              )
            })}
          </div>

          {/* the target ring */}
          {target && (phase === 'aim' || phase === 'act') && (
            <span
              aria-hidden
              className={cn('ez-demo-ring pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-lg', step.act === 'hover' && 'ez-demo-ring-pulse')}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `calc(${target.w * zoom}% + 14px)`,
                height: `calc(${target.h * zoom}% + 12px)`,
              }}
            />
          )}

          {/* the cursor */}
          <span
            aria-hidden
            className="pointer-events-none absolute z-20"
            style={{
              left: `${cur.x}%`,
              top: `${cur.y}%`,
              opacity: !target && phase === 'act' ? 0 : 1,
              transition: reduced ? 'none' : `left ${T.move}ms cubic-bezier(.65,0,.35,1), top ${T.move}ms cubic-bezier(.45,0,.25,1), opacity 400ms`,
            }}
          >
            {pressing && <span key={`r${pos.f}-${pos.s}`} className="ez-demo-ripple absolute -left-5 -top-5 h-10 w-10 rounded-full" />}
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              className="relative drop-shadow-[0_3px_6px_rgb(11_22_51/0.35)] transition-transform duration-150"
              style={{ transform: pressing ? 'scale(.84)' : 'scale(1)', transformOrigin: '3px 3px' }}
            >
              <path d="M3.5 2.2 20 10.4l-7.1 1.9-3.2 6.9L3.5 2.2Z" fill="#0b1633" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </span>

          {/* the click, offered to the visitor while paused */}
          {!running && target && (
            <button
              type="button"
              aria-label={`Do this step: ${step.title}`}
              onClick={(e) => { e.stopPropagation(); setPaused(true); stepBy(1) }}
              className="absolute z-30 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
            >
              <span className="ez-demo-beacon absolute inset-0 rounded-full bg-brand-500/40" />
              <span className="relative h-3.5 w-3.5 rounded-full bg-brand-600 ring-[3px] ring-white" />
            </button>
          )}

          {/* caption, md and up */}
          {showCallout && (
            <div
              key={`c${pos.f}-${pos.s}`}
              className={cn(
                'ez-tour-note pointer-events-none absolute bottom-4 z-20 hidden w-[min(22rem,40%)] rounded-2xl bg-navy/[0.93] p-4 text-white shadow-[0_24px_48px_-16px_rgb(11_22_51/0.6)] ring-1 ring-white/10 backdrop-blur md:block',
                calloutRight ? 'right-4' : 'left-4',
              )}
            >
              <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/60">
                <span>{flow.persona}</span>
                <span aria-hidden>·</span>
                <span>
                  Step {pos.s + 1} of {flow.steps.length}
                </span>
              </p>
              <p className="mt-1.5 font-display text-[1.12rem] font-[620] leading-snug tracking-[-0.01em]">{step.title}</p>
              <p className="mt-1 text-[0.86rem] leading-snug text-white/80">{step.body}</p>
              {isLast && (
                <p className="mt-3 border-t border-white/10 pt-2.5 text-[0.75rem] text-white/60">
                  Up next · <span className="font-semibold text-white/90">{upNext.name}</span>
                </p>
              )}
            </div>
          )}

          {/* paused marker */}
          {paused && !reduced && (
            <span className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-ink-900/80 px-3 py-1 text-[0.72rem] font-semibold text-white backdrop-blur">
              Paused · press play or click the dot
            </span>
          )}
        </div>
      </div>

      {/* ── Step rail ───────────────────────────────────────────────────── */}
      <ol className="mt-4 flex gap-1.5">
        {flow.steps.map((s, i) => (
          <li key={i} className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => { setPaused(true); goTo(pos.f, i) }}
              aria-current={i === pos.s ? 'step' : undefined}
              aria-label={`Step ${i + 1}: ${s.title}`}
              className="group block w-full py-1.5 text-left"
            >
              <span className="block h-1 overflow-hidden rounded-full bg-ink-900/10">
                <span
                  key={i === pos.s ? `p${pos.f}-${pos.s}` : undefined}
                  className={cn(
                    'block h-full origin-left rounded-full bg-brand-600',
                    i < pos.s ? 'scale-x-100' : i > pos.s ? 'scale-x-0' : 'ez-demo-progress',
                  )}
                  style={
                    i === pos.s
                      ? { animationDuration: `${stepMs(s, i === 0)}ms`, animationPlayState: running && ready ? 'running' : 'paused' }
                      : undefined
                  }
                />
              </span>
              <span
                className={cn(
                  'mt-2 hidden truncate text-[0.78rem] lg:block',
                  i === pos.s ? 'font-semibold text-ink-900' : 'text-ink-500 group-hover:text-ink-800',
                )}
              >
                {s.title}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* caption, phones */}
      <div className="mt-3 md:hidden" key={`m${pos.f}-${pos.s}`}>
        <p className="ez-tour-note text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-500">
          {flow.persona} · Step {pos.s + 1} of {flow.steps.length}
        </p>
        <p className="ez-tour-note mt-1 font-display text-[1.15rem] font-[620] leading-snug text-ink-900">{step.title}</p>
        <p className="ez-tour-note mt-1 text-[0.92rem] leading-snug text-ink-600">{step.body}</p>
      </div>

      </div>

      <p className="sr-only" aria-live={running ? 'off' : 'polite'}>
        {flow.name}, step {pos.s + 1} of {flow.steps.length}: {step.title}{/[.?!]$/.test(step.title) ? "" : "."} {step.body}
      </p>
    </div>
  )
}

function CtrlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full text-ink-600 transition-colors hover:bg-ink-900/[0.06] hover:text-ink-900"
    >
      {children}
    </button>
  )
}

function PauseGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
    </svg>
  )
}
