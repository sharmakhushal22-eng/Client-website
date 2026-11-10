'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ASPECT, CITIES, REGION_POINTS, hash, indiaPoints, shapePoint, wordPoints, type Pt, type ShapeName } from '@/lib/particles/shapes'

/* ============================================================================
 * The EZER particle field.
 *
 * One canvas and a single population of dots that travels with the reader.
 * The canvas is moved into whichever scene is on top, as that scene's first
 * child, so the dots always sit BEHIND the scene's words and product chips
 * and are clipped to its panel. Each scene marks an
 * empty part of its layout as a stage:
 *
 *   <div data-stage="globe" data-tone="light" />
 *
 * and whichever scene is on top owns the dots. When the next scene slides
 * up over the last, the dots leave their old formation and fly into the new
 * one, so moving between scenes looks like the same material being
 * reshaped: a globe, the three bars of the E, an orbit, India, a galaxy
 * round the engine core, a terrain, ten columns, the name.
 *
 * Cost is kept flat: one canvas, one batched path per colour, no DOM per
 * dot, positions computed from closed-form shapes. The loop sleeps when the
 * tab is hidden and draws nothing when no stage is on screen. Reduced
 * motion freezes every shape and skips the flights; the formations still
 * appear, still.
 * ========================================================================= */

type Stage = { el: HTMLElement; host: HTMLElement; shape: ShapeName; tone: 'light' | 'dark' | 'white' }

const PALETTE = {
  light: { main: [37, 99, 235], soft: [11, 22, 51], accent: [242, 165, 22] },
  dark: { main: [157, 184, 255], soft: [255, 255, 255], accent: [242, 165, 22] },
  white: { main: [255, 255, 255], soft: [255, 210, 122], accent: [255, 210, 122] },
}

const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)

let shared: HTMLCanvasElement | null = null
function getCanvas() {
  if (!shared) {
    shared = document.createElement('canvas')
    shared.setAttribute('aria-hidden', 'true')
    shared.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:0'
  }
  return shared
}

export function ParticleField() {
  const pathname = usePathname()

  useEffect(() => {
    const canvas = getCanvas()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const stages: Stage[] = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]')).map((el) => ({
      el,
      host: (el.closest('[data-scene]') as HTMLElement) ?? el,
      shape: (el.dataset.stage as ShapeName) || 'none',
      tone: el.dataset.tone === 'dark' ? 'dark' : el.dataset.tone === 'white' ? 'white' : 'light',
    }))
    if (stages.length === 0) {
      canvas.remove()
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768
    const N = small ? 640 : 1400
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.75)

    const cur = new Float32Array(N * 2)
    const from = new Float32Array(N * 2)
    const alpha = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      cur[i * 2] = window.innerWidth * hash(i * 3.3)
      cur[i * 2 + 1] = window.innerHeight * (1.1 + hash(i * 5.1) * 0.3)
    }

    const cache: { india?: Pt[]; word?: Pt[] } = {}
    const labelFont = getComputedStyle(document.body).fontFamily || 'sans-serif'
    const family = () => {
      const probe = document.querySelector('.font-display, h1') as HTMLElement | null
      return probe ? getComputedStyle(probe).fontFamily : 'sans-serif'
    }

    let H = 0
    let CW = 0, CH = 0
    const fitCanvas = (host: HTMLElement | null) => {
      if (!host) return
      if (canvas.parentElement !== host) host.prepend(canvas)
      const r = host.getBoundingClientRect()
      const w = Math.round(r.width), h = Math.round(Math.min(r.height, H * 2.5))
      if (w !== CW || h !== CH) {
        CW = w; CH = h
        canvas.style.height = `${h}px`
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
    }
    const resize = () => {
      H = window.innerHeight
      CW = CH = 0
      if (active) fitCanvas(active.host)
      dirty = true
    }

    let active: Stage | null = null
    let switchAt = 0
    let fade = 0 // 0..1 overall opacity of the field
    let dirty = true
    let mx = -9999, my = -9999
    let focus = -1

    const pick = (): Stage | null => {
      let best: Stage | null = null
      for (const s of stages) {
        // A stage hidden at this width (display: none) has no box; skip it,
        // or the dots would fly to the corner of the screen.
        if (s.el.offsetWidth === 0) continue
        const r = s.host.getBoundingClientRect()
        if (r.top < H * 0.62 && r.bottom > H * 0.3) best = s
      }
      return best
    }

    const fitBox = (s: Stage) => {
      const r = s.el.getBoundingClientRect()
      const a = ASPECT[s.shape]
      if (!a) return { x: r.left, y: r.top, w: r.width, h: r.height, r }
      let w = r.width, h = r.width / a
      if (h > r.height) { h = r.height; w = h * a }
      return { x: r.left + (r.width - w) / 2, y: r.top + (r.height - h) / 2, w, h, r }
    }

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; lastInput = performance.now() }
    /* Rows marked data-pair="n" (scene 2) light bar n of the E while pointed
       at or focused. One delegated listener for the whole page. */
    const onPoint = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.('[data-pair]') as HTMLElement | null
      focus = el ? Number(el.dataset.pair) : -1
    }
    const onScroll = () => { dirty = true }
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (!small && !reduced) window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onPoint, { passive: true })
    document.addEventListener('focusin', onPoint)
    resize()

    let raf = 0
    let lastDraw = 0
    let lastInput = 0
    const frozenT = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const next = pick()
      if (next !== active) {
        if (next && next.shape === 'india' && !cache.india) cache.india = indiaPoints(N)
        if (next && next.shape === 'word') cache.word = wordPoints(N, family())
        from.set(cur)
        switchAt = now
        active = next
        if (next) fitCanvas(next.host)
        dirty = true
      }

      const target = active && active.shape !== 'none' ? 1 : 0
      fade += (target - fade) * (reduced ? 1 : 0.08)
      if (Math.abs(target - fade) < 0.002) fade = target
      if (reduced && !dirty) return
      if (fade === 0 && target === 0) {
        if (dirty) ctx.clearRect(0, 0, CW, CH)
        dirty = false
        return
      }

      /* Once a formation has landed its motion is a slow drift, so it is
         redrawn at 30fps rather than 60: half the main-thread work while the
         reader sits on a scene, with no visible difference. Flights, the
         first seconds of a scene, scrolling and the pointer all run at full
         rate. */
      const settled = now - switchAt > 2600 && !dirty && now - lastInput > 400
      if (settled && now - lastDraw < 31) return
      lastDraw = now

      const t = reduced ? frozenT : now / 1000
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, CW, CH)
      if (!active) { dirty = false; return }
      // Work in viewport coordinates; draw shifted into the host scene.
      const hr = active.host.getBoundingClientRect()
      ctx.setTransform(dpr, 0, 0, dpr, -hr.left * dpr, -hr.top * dpr)

      const box = fitBox(active)
      // Skip the work entirely when the stage is far off screen.
      if (box.r.bottom < -200 || box.r.top > H + 200) { dirty = false; return }

      const pal = PALETTE[active.tone]
      const since = now - switchAt
      const repel = 70
      const sceneCtx = { since: reduced ? 1e9 : since, focus }

      // Shape-specific underlays.
      if (active.shape === 'globe' || active.shape === 'vortex') {
        const cx = box.x + box.w / 2, cy = box.y + box.h / 2
        const rad = (active.shape === 'globe' ? box.w * 0.5 : box.w * 0.24)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        g.addColorStop(0, `rgba(${pal.main.join(',')},${0.16 * fade})`)
        g.addColorStop(1, `rgba(${pal.main.join(',')},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill()
      }

      // Positions
      for (let i = 0; i < N; i++) {
        const p = shapePoint(active.shape, i, N, t, cache, sceneCtx)
        const tx = box.x + p.x * box.w
        const ty = box.y + p.y * box.h
        const delay = hash(i * 0.77) * 420
        let k = reduced ? 1 : Math.min(1, Math.max(0, (since - delay) / 1150))
        k = ease(k)
        let x = from[i * 2] + (tx - from[i * 2]) * k
        let y = from[i * 2 + 1] + (ty - from[i * 2 + 1]) * k
        // Mid-flight, a little arc so the swarm swirls rather than slides.
        if (k > 0 && k < 1) {
          const lift = Math.sin(k * Math.PI) * (40 + hash(i * 2.2) * 80)
          x += Math.cos(i) * lift * 0.5
          y -= lift
        }
        if (mx > -1000) {
          const dx = x - mx, dy = y - my
          const d2 = dx * dx + dy * dy
          if (d2 < repel * repel && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = (repel - d) / repel
            x += (dx / d) * f * 26
            y += (dy / d) * f * 26
          }
        }
        cur[i * 2] = x
        cur[i * 2 + 1] = y
        alpha[i] = p.w * (p.accent ? -1 : 1)
      }

      // Draw in three brightness buckets per colour: three paths, not 1400.
      const size = small ? 1.5 : 1.9
      const buckets: [number, number, number][] = [[0, 0.4, 0.3], [0.4, 0.75, 0.6], [0.75, 2, 0.95]]
      for (const [lo, hi, a] of buckets) {
        ctx.fillStyle = `rgba(${pal.main.join(',')},${a * fade})`
        ctx.beginPath()
        for (let i = 0; i < N; i++) {
          const w = alpha[i]
          if (w < lo || w >= hi) continue
          const r = size * (0.55 + w * 0.7)
          ctx.moveTo(cur[i * 2] + r, cur[i * 2 + 1])
          ctx.arc(cur[i * 2], cur[i * 2 + 1], r, 0, Math.PI * 2)
        }
        ctx.fill()
      }
      ctx.fillStyle = `rgba(${pal.accent.join(',')},${0.95 * fade})`
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        if (alpha[i] >= 0) continue
        const r = size * 1.25
        ctx.moveTo(cur[i * 2] + r, cur[i * 2 + 1])
        ctx.arc(cur[i * 2], cur[i * 2 + 1], r, 0, Math.PI * 2)
      }
      ctx.fill()

      // India: every state and union territory, one after another.
      // All 36 sit on the map as small markers; a sweep lights them in turn,
      // an arc runs out from head office to each with a pulse on it, and the
      // one being reached is named. After the first full pass every marker
      // stays lit: the whole country, covered. Reduced motion shows the end
      // state, all lit, no sweep.
      if (active.shape === 'india' && since > 1000) {
        const on = Math.min(1, (since - 1000) / 600) * fade
        const hx = box.x + CITIES.hq.x * box.w, hy = box.y + CITIES.hq.y * box.h
        const n = REGION_POINTS.length
        const STEP = 0.62 // seconds per region
        const pos = reduced ? n * 2 : (since - 1000) / 1000 / STEP
        const firstPass = pos < n
        const cur = Math.floor(pos) % n
        const frac = reduced ? 1 : pos % 1

        // The markers.
        for (let j = 0; j < n; j++) {
          const r = REGION_POINTS[j]
          const cx = box.x + r.x * box.w, cy = box.y + r.y * box.h
          const lit = !firstPass || j <= pos
          ctx.fillStyle = lit ? `rgba(${pal.soft.join(',')},${0.9 * on})` : `rgba(${pal.main.join(',')},${0.28 * on})`
          ctx.beginPath(); ctx.arc(cx, cy, lit ? 3 : 2.2, 0, Math.PI * 2); ctx.fill()
          if (lit) {
            ctx.strokeStyle = `rgba(${pal.main.join(',')},${0.35 * on})`
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.stroke()
          }
        }

        // The last three reached: an arc from head office, a pulse riding
        // it, and a ping on arrival, each fading with age.
        if (!reduced) {
          for (let d = 0; d < 3; d++) {
            const k = (cur - d + n) % n
            if (firstPass && cur - d < 0) continue
            const age = frac + d
            const fadeA = Math.max(0, 1 - age / 3) * on
            const r = REGION_POINTS[k]
            const cx = box.x + r.x * box.w, cy = box.y + r.y * box.h
            const qx = (hx + cx) / 2 - (cy - hy) * 0.22, qy = (hy + cy) / 2 + (cx - hx) * 0.22 - 12
            ctx.strokeStyle = `rgba(${pal.main.join(',')},${0.45 * fadeA})`
            ctx.lineWidth = 1.2
            ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(qx, qy, cx, cy); ctx.stroke()
            const u = Math.min(1, age * 1.8)
            const px = (1 - u) * (1 - u) * hx + 2 * (1 - u) * u * qx + u * u * cx
            const py = (1 - u) * (1 - u) * hy + 2 * (1 - u) * u * qy + u * u * cy
            if (u < 1) {
              ctx.fillStyle = `rgba(${pal.accent.join(',')},${fadeA})`
              ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI * 2); ctx.fill()
            } else {
              const ping = Math.min(1, (age - 1 / 1.8) * 0.9)
              ctx.strokeStyle = `rgba(${pal.accent.join(',')},${(1 - ping) * fadeA})`
              ctx.lineWidth = 1.5
              ctx.beginPath(); ctx.arc(cx, cy, 4 + ping * 16, 0, Math.PI * 2); ctx.stroke()
            }
          }

          // Name the region being reached.
          const r = REGION_POINTS[cur]
          const cx = box.x + r.x * box.w, cy = box.y + r.y * box.h
          const la = Math.min(1, frac * 4) * Math.min(1, (1 - frac) * 4) * on
          if (la > 0.01) {
            const label = r.kind === 'ut' ? `${r.name} · UT` : r.name
            ctx.font = `600 12.5px ${labelFont}`
            const tw = ctx.measureText(label).width
            const right = r.x < 0.62
            const lx = right ? cx + 12 : cx - 12 - tw
            const ly = cy + 4
            ctx.fillStyle = `rgba(255,255,255,${0.9 * la})`
            ctx.beginPath()
            ctx.roundRect(lx - 7, ly - 13, tw + 14, 19, 9.5)
            ctx.fill()
            ctx.fillStyle = `rgba(${pal.soft.join(',')},${la})`
            ctx.fillText(label, lx, ly)
          }
        }

        // Head office.
        ctx.fillStyle = `rgba(${pal.accent.join(',')},${on})`
        ctx.beginPath(); ctx.arc(hx, hy, 5.5, 0, Math.PI * 2); ctx.fill()
        const hp = reduced ? 0 : ((t * 0.6) % 1)
        ctx.strokeStyle = `rgba(${pal.accent.join(',')},${(1 - hp) * on})`
        ctx.beginPath(); ctx.arc(hx, hy, 6 + hp * 22, 0, Math.PI * 2); ctx.stroke()
      }

      // Vortex: the engine core's bright heart.
      if (active.shape === 'vortex') {
        const cx = box.x + box.w / 2, cy = box.y + box.h / 2
        ctx.fillStyle = `rgba(${pal.accent.join(',')},${0.9 * fade})`
        ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI * 2); ctx.fill()
      }

      dirty = false
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      canvas.remove()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onPoint)
      document.removeEventListener('focusin', onPoint)
    }
  }, [pathname])

  return null
}
