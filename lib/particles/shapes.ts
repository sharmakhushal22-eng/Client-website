/* ============================================================================
 * Shapes for the EZER particle field.
 *
 * Every shape is a function that, given the particle index, a per-particle
 * seed and the time, returns a point in a unit box (0..1 on both axes) plus
 * a depth/brightness weight. The field maps that box onto the scene's stage
 * element each frame, so a shape follows its stage as the scene slides.
 *
 * Shapes are deterministic in the seed, so the same particle always lands
 * on the same spot of a shape. That is what makes a morph read as the dots
 * flying from one formation to the next rather than as a random reshuffle.
 * ========================================================================= */

export type ShapeName =
  | 'globe' | 'ebars' | 'ring' | 'india' | 'vortex' | 'wave'
  | 'bars' | 'word' | 'scatter' | 'halo' | 'helix' | 'cube' | 'shield' | 'torus' | 'none'

export type Pt = { x: number; y: number; w: number; accent?: boolean }

/* A small, fast, deterministic hash so shapes need no stored random state. */
export function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

/* ── India ────────────────────────────────────────────────────────────── */
/* Same outline as the map graphic: India's official boundary, including the
 * whole of Jammu & Kashmir and Ladakh, at silhouette resolution. [lon, lat] */
const OUTLINE: [number, number][] = [
  [68.2, 23.7], [68.8, 24.3], [70.0, 24.4], [71.1, 24.6], [70.6, 25.6], [70.1, 26.6],
  [69.5, 27.1], [70.4, 28.0], [71.9, 28.2], [73.0, 29.4], [73.9, 30.2], [74.5, 30.9],
  [74.6, 31.9], [75.2, 32.4], [74.6, 32.8], [73.9, 33.2], [73.5, 33.9], [73.6, 34.8],
  [72.6, 35.4], [72.9, 36.4], [74.0, 36.9], [74.9, 37.1], [75.9, 36.7], [76.8, 35.9],
  [77.9, 35.5], [79.0, 35.8], [80.3, 35.4], [80.0, 34.2], [79.4, 32.8], [78.8, 31.9],
  [79.0, 31.1], [79.9, 30.7], [80.9, 30.2], [80.2, 29.2], [80.1, 28.8], [81.2, 28.4],
  [82.8, 27.5], [84.1, 27.4], [85.2, 26.7], [86.6, 26.5], [88.1, 26.4], [88.1, 27.2],
  [88.2, 27.9], [88.9, 27.3], [89.8, 26.8], [91.2, 26.8], [92.1, 26.9], [91.8, 27.6],
  [92.6, 27.9], [93.8, 28.7], [95.3, 29.3], [96.2, 29.4], [97.4, 28.3], [96.6, 27.6],
  [95.6, 27.0], [95.1, 26.2], [94.6, 25.2], [94.2, 24.2], [93.4, 23.6], [93.2, 22.6],
  [92.7, 22.0], [92.3, 22.7], [92.2, 23.7], [91.6, 24.1], [91.2, 23.6], [91.6, 24.8],
  [90.4, 25.2], [89.8, 25.3], [89.9, 26.1], [88.9, 26.3], [88.4, 26.5], [88.1, 25.6],
  [88.5, 24.8], [88.7, 24.1], [88.9, 23.1], [89.0, 22.0], [88.8, 21.6], [87.8, 21.6],
  [86.8, 21.0], [86.4, 20.2], [85.2, 19.5], [84.3, 18.4], [82.4, 17.0], [81.3, 16.3],
  [80.3, 15.6], [80.1, 13.4], [79.9, 11.8], [79.8, 10.3], [79.0, 9.4], [78.2, 8.8],
  [77.5, 8.1], [76.9, 8.6], [76.3, 9.8], [75.8, 11.2], [75.0, 12.8], [74.4, 14.4],
  [73.8, 15.9], [73.2, 17.6], [72.8, 19.0], [72.8, 20.4], [72.6, 21.1], [72.7, 22.2],
  [72.1, 21.6], [71.0, 20.8], [70.0, 21.0], [69.0, 22.2], [68.9, 22.7], [69.9, 22.9],
  [68.6, 23.2],
]
const LON0 = 67.8, LON1 = 97.8, LAT0 = 37.4, LAT1 = 6.6
const KX = 0.93 // longitude degrees are a little narrower at these latitudes

function inIndia(lon: number, lat: number) {
  let hit = false
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i]
    const [xj, yj] = OUTLINE[j]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

const SPAN_X = (LON1 - LON0) * KX
const SPAN_Y = LAT0 - LAT1
const SPAN = Math.max(SPAN_X, SPAN_Y)
export function indiaUV(lon: number, lat: number) {
  return {
    x: ((lon - LON0) * KX + (SPAN - SPAN_X) / 2) / SPAN,
    y: (LAT0 - lat + (SPAN - SPAN_Y) / 2) / SPAN,
  }
}

/* Points inside India, sampled once per particle count. */
const indiaCache = new Map<number, Pt[]>()
export function indiaPoints(n: number): Pt[] {
  const hit = indiaCache.get(n)
  if (hit) return hit
  const pts: Pt[] = []
  let k = 0
  while (pts.length < n && k < n * 40) {
    const lon = LON0 + hash(k * 2.13) * (LON1 - LON0)
    const lat = LAT1 + hash(k * 7.77 + 1.3) * (LAT0 - LAT1)
    k++
    if (!inIndia(lon, lat)) continue
    const p = indiaUV(lon, lat)
    pts.push({ ...p, w: 0.55 + hash(k) * 0.45 })
  }
  indiaCache.set(n, pts)
  return pts
}

/* Sample locations for the map's arcs. */
export const CITIES = {
  hq: indiaUV(72.88, 19.08),
  sites: [
    indiaUV(77.21, 28.61), indiaUV(77.59, 12.97), indiaUV(88.36, 22.57), indiaUV(80.27, 13.08),
    indiaUV(78.49, 17.39), indiaUV(72.57, 23.02), indiaUV(80.95, 26.85), indiaUV(91.74, 26.14),
    indiaUV(73.86, 18.52),
  ],
}

/* Every state and union territory, by its capital (or, where two share
 * Chandigarh, a major city of the state), in a sweep order that zig-zags
 * north to south so consecutive pings land in different parts of the map.
 * 28 states + 8 UTs = 36. The islands (Andaman & Nicobar, Lakshadweep) sit
 * in the sea, outside the dotted outline, which is where they are. */
const REGIONS: [string, number, number, 'state' | 'ut'][] = [
  ['Ladakh', 77.58, 34.15, 'ut'],
  ['Jammu & Kashmir', 74.8, 34.08, 'ut'],
  ['Himachal Pradesh', 77.17, 31.1, 'state'],
  ['Punjab', 75.85, 30.9, 'state'],
  ['Chandigarh', 76.78, 30.73, 'ut'],
  ['Uttarakhand', 78.03, 30.32, 'state'],
  ['Haryana', 77.03, 28.46, 'state'],
  ['Delhi', 77.21, 28.61, 'ut'],
  ['Rajasthan', 75.79, 26.91, 'state'],
  ['Uttar Pradesh', 80.95, 26.85, 'state'],
  ['Sikkim', 88.61, 27.33, 'state'],
  ['Arunachal Pradesh', 93.61, 27.08, 'state'],
  ['Assam', 91.79, 26.14, 'state'],
  ['Bihar', 85.14, 25.59, 'state'],
  ['Nagaland', 94.11, 25.67, 'state'],
  ['Meghalaya', 91.89, 25.58, 'state'],
  ['Manipur', 93.94, 24.82, 'state'],
  ['Gujarat', 72.65, 23.22, 'state'],
  ['Madhya Pradesh', 77.41, 23.26, 'state'],
  ['Jharkhand', 85.31, 23.34, 'state'],
  ['Tripura', 91.29, 23.83, 'state'],
  ['Mizoram', 92.72, 23.73, 'state'],
  ['West Bengal', 88.36, 22.57, 'state'],
  ['Chhattisgarh', 81.63, 21.25, 'state'],
  ['Dadra & Nagar Haveli and Daman & Diu', 72.83, 20.4, 'ut'],
  ['Odisha', 85.82, 20.3, 'state'],
  ['Maharashtra', 72.88, 19.08, 'state'],
  ['Telangana', 78.49, 17.39, 'state'],
  ['Andhra Pradesh', 80.52, 16.51, 'state'],
  ['Goa', 73.83, 15.49, 'state'],
  ['Karnataka', 77.59, 12.97, 'state'],
  ['Tamil Nadu', 80.27, 13.08, 'state'],
  ['Puducherry', 79.81, 11.94, 'ut'],
  ['Andaman & Nicobar Islands', 92.73, 11.62, 'ut'],
  ['Lakshadweep', 72.64, 10.57, 'ut'],
  ['Kerala', 76.94, 8.52, 'state'],
]
export const REGION_POINTS = REGIONS.map(([name, lon, lat, kind]) => ({ name, kind, ...indiaUV(lon, lat) }))

/* ── Word ─────────────────────────────────────────────────────────────── */
let wordPts: Pt[] | null = null
let wordKey = ''
/* Samples "EZER" set in the site's display face. Called in the browser only. */
export function wordPoints(n: number, family: string): Pt[] {
  const key = `${n}|${family}`
  if (wordPts && wordKey === key) return wordPts
  const c = document.createElement('canvas')
  const W = 900, H = 300
  c.width = W; c.height = H
  const g = c.getContext('2d', { willReadFrequently: true })!
  g.fillStyle = '#000'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `800 250px ${family}`
  g.fillText('EZER', W / 2, H / 2 + 10)
  const data = g.getImageData(0, 0, W, H).data
  const cand: Pt[] = []
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) if (data[(y * W + x) * 4 + 3] > 140) cand.push({ x: x / W, y: y / H, w: 1 })
  const out: Pt[] = []
  for (let i = 0; i < n; i++) {
    const p = cand[Math.floor(hash(i * 3.1) * cand.length)] ?? { x: 0.5, y: 0.5, w: 1 }
    out.push({ x: p.x + (hash(i) - 0.5) * 0.004, y: p.y + (hash(i + 9) - 0.5) * 0.004, w: 0.6 + hash(i * 1.7) * 0.4 })
  }
  wordPts = out
  wordKey = key
  return out
}

/* ── The rest are analytic ────────────────────────────────────────────── */
const GOLDEN = Math.PI * (3 - Math.sqrt(5))

/** Scene state some shapes respond to: ms since the shape became active, and
 *  which of its parts the visitor is pointing at (-1 for none). */
export type ShapeCtx = { since: number; focus: number }

const smooth = (k: number) => k * k * (3 - 2 * k)

export function shapePoint(shape: ShapeName, i: number, n: number, t: number, cache: { india?: Pt[]; word?: Pt[] }, sc: ShapeCtx = { since: 1e9, focus: -1 }): Pt {
  const s = hash(i + 0.5)
  const s2 = hash(i * 1.618 + 2.1)
  switch (shape) {
    case 'globe': {
      // 88% on a rotating sphere, 12% on a tilted orbit ring around it.
      if (i % 9 === 0) {
        const a = (i / n) * Math.PI * 2 * 9 + t * 0.35
        const rx = 0.5, ry = 0.13
        const x = Math.cos(a) * rx, y = Math.sin(a) * ry
        const front = Math.sin(a) > 0
        return { x: 0.5 + x * 0.98, y: 0.5 + y - x * 0.18, w: front ? 1 : 0.25, accent: i % 27 === 0 }
      }
      const k = i + 0.5
      const yy = 1 - (2 * k) / n
      const r = Math.sqrt(1 - yy * yy)
      const th = GOLDEN * k + t * 0.22
      const x = Math.cos(th) * r
      let z = Math.sin(th) * r, y = yy
      const tilt = 0.38
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt)
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt)
      y = y2; z = z2
      const R = 0.4
      return { x: 0.5 + x * R, y: 0.5 + y * R, w: 0.18 + ((z + 1) / 2) * 0.82, accent: i % 61 === 0 }
    }
    case 'ebars': {
      // "Four vendors, five spreadsheets… or one record."
      // The three bars of the E, one per before/after row beside it. Each bar
      // starts as a mess: its dots sit in three small, crooked grids (the
      // separate tools and spreadsheets), drifting. On that row's cue (in
      // step with its strike-through, 700ms apart) the grids pull into one
      // clean bar. Once a bar is whole, a gold "record" runs along it, again
      // and again: one record flowing through one system. Pointing at a row
      // lights its bar.
      const bar = i % 3
      const widths = [1, 0.72, 1]
      const len = widths[bar]
      const h = 0.15
      const cy = 0.24 + bar * 0.26
      const u = s * len
      let v = (s2 - 0.5) * h
      const end = Math.min(u, len - u)
      if (end < h / 2) v *= Math.sqrt(Math.max(0, 1 - ((h / 2 - end) / (h / 2)) ** 2))
      const wave = Math.sin(t * 1.4 + u * 7 + bar) * 0.004
      const ox = 0.06 + u * 0.88, oy = cy + v + wave

      // The mess: three tilted little grids per bar.
      const clump = Math.floor(hash(i * 1.31) * 3)
      const kx = 0.16 + clump * 0.32 + (hash(bar * 7.1 + clump) - 0.5) * 0.1
      const ky = 0.2 + bar * 0.27 + (hash(bar * 3.3 + clump * 5.7) - 0.5) * 0.12
      const gx = Math.floor(hash(i * 2.71) * 6) - 2.5
      const gy = Math.floor(hash(i * 3.91) * 4) - 1.5
      const tilt = (hash(bar * 11 + clump) - 0.5) * 0.7
      const mx = kx + (gx * 0.026) * Math.cos(tilt) - (gy * 0.034) * Math.sin(tilt) + Math.sin(t * 0.9 + i) * 0.005
      const my = ky + (gx * 0.026) * Math.sin(tilt) + (gy * 0.034) * Math.cos(tilt) + Math.cos(t * 0.7 + i * 1.3) * 0.005

      const order = smooth(Math.min(1, Math.max(0, (sc.since - (700 + bar * 700)) / 900)))
      const x = mx + (ox - mx) * order
      const y = my + (oy - my) * order

      const focused = sc.focus === bar
      const dimmed = sc.focus >= 0 && !focused
      let w = (0.3 + hash(i * 3) * 0.3) * (1 - order) + (0.55 + hash(i * 3) * 0.45) * order
      // The record running along a finished bar.
      let accent = false
      if (order >= 1) {
        const head = ((t * 0.24 + bar * 0.37) % 1.3) - 0.15
        const d = Math.abs(u / len - head)
        if (d < (focused ? 0.09 : 0.05)) { accent = true; w = 1 }
      }
      if (focused) w = Math.max(w, 0.95)
      if (dimmed) w *= 0.45
      return { x, y, w, accent }
    }
    case 'ring': {
      // Two counter-rotating rings and a sparse halo of dust outside them.
      // The middle stays empty: that is where the scene puts its content.
      const band = s < 0.46 ? 0 : s < 0.86 ? 1 : 2
      if (band === 2) {
        const a = s2 * Math.PI * 2 + t * 0.03
        const r = 0.5 + hash(i * 3.7) * 0.06
        return { x: 0.5 + Math.cos(a) * r, y: 0.5 + Math.sin(a) * r, w: 0.15 + hash(i) * 0.3 }
      }
      const R = band === 0 ? 0.46 : 0.405
      const dir = band === 0 ? 1 : -1
      const a = s2 * Math.PI * 2 + dir * t * (band === 0 ? 0.07 : 0.11)
      const j = (hash(i * 5) - 0.5) * 0.016
      return { x: 0.5 + Math.cos(a) * (R + j), y: 0.5 + Math.sin(a) * (R + j), w: 0.35 + hash(i * 7) * 0.65, accent: band === 0 && i % 23 === 0 }
    }
    case 'india': {
      const p = cache.india?.[i] ?? { x: 0.5, y: 0.5, w: 0.5 }
      const tw = 0.8 + Math.sin(t * 2 + i) * 0.2
      return { x: p.x, y: p.y, w: p.w * tw }
    }
    case 'vortex': {
      // A galaxy seen at an angle: inner stars turn faster than outer ones.
      const r = 0.14 + Math.pow(s, 0.8) * 0.36
      const arm = (i % 3) * ((Math.PI * 2) / 3)
      const a = arm + r * 9 + s2 * 0.9 + t * (0.32 / (r + 0.12))
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r * 0.92 // 0.42 tilt × the 2.2 aspect
      return { x: 0.5 + x, y: 0.5 + y, w: 0.25 + (1 - r * 1.6) * 0.75, accent: i % 37 === 0 }
    }
    case 'wave': {
      const cols = 64
      const rows = Math.max(8, Math.floor(n / cols))
      const cx = i % cols
      const rz = Math.floor(i / cols) % rows
      const x = cx / (cols - 1)
      const z = rz / (rows - 1)
      const h = Math.sin(x * 7 + t * 1.1 + z * 4) * 0.5 + Math.sin(x * 3 - t * 0.7) * 0.5
      const persp = 0.35 + z * 0.65
      return { x: 0.5 + (x - 0.5) * persp, y: 0.12 + z * 0.62 - h * 0.08 * persp, w: 0.15 + z * 0.85 }
    }
    case 'bars': {
      // Ten columns, one per day of the implementation, rising to go-live.
      const col = i % 10
      const height = 0.18 + (col / 9) * 0.78
      const u = col / 9
      const v = Math.pow(s, 0.9) * height
      const rise = Math.sin(t * 1.2 - col * 0.35) * 0.012
      return { x: 0.05 + u * 0.9 + (s2 - 0.5) * 0.045, y: 0.97 - v - rise, w: 0.4 + (v / height) * 0.6, accent: col === 9 }
    }
    case 'word': {
      const p = cache.word?.[i] ?? { x: 0.5, y: 0.5, w: 1 }
      const sh = Math.sin(t * 1.6 + p.x * 12) * 0.003
      return { x: p.x, y: p.y + sh, w: p.w, accent: i % 17 === 0 }
    }
    case 'halo': {
      const a = s * Math.PI * 2 + t * 0.12
      const r = 0.42 + (s2 - 0.5) * 0.12
      return { x: 0.5 + Math.cos(a) * r, y: 0.5 + Math.sin(a) * r, w: 0.25 + hash(i * 9) * 0.5 }
    }
    case 'scatter': {
      const x = s + Math.sin(t * 0.4 + i) * 0.02
      const y = s2 + Math.cos(t * 0.33 + i * 1.3) * 0.02
      return { x, y, w: 0.2 + hash(i * 4) * 0.5 }
    }
    case 'helix': {
      // A double helix turning on its vertical axis, with rungs between the
      // strands: one record carried the whole length of a career.
      const rung = i % 7 === 0
      const v = s
      const ang = v * Math.PI * 5 + t * 0.6
      if (rung) {
        const u = s2 * 2 - 1
        const x = Math.cos(ang) * 0.3 * u
        const z = Math.sin(ang) * u
        return { x: 0.5 + x, y: 0.04 + v * 0.92, w: 0.2 + ((z + 1) / 2) * 0.4 }
      }
      const strand = i % 2 ? Math.PI : 0
      const x = Math.cos(ang + strand) * 0.3 + (s2 - 0.5) * 0.03
      const z = Math.sin(ang + strand)
      return { x: 0.5 + x, y: 0.04 + v * 0.92 + (hash(i * 4) - 0.5) * 0.01, w: 0.2 + ((z + 1) / 2) * 0.8, accent: i % 41 === 0 }
    }
    case 'cube': {
      // A wireframe cube turning in 3D, edges traced densely, faces dusted:
      // every module in one block.
      const V: [number, number, number][] = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]
      const E: [number, number][] = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]
      let x: number, y: number, z: number
      let edge = false
      if (i % 5 < 3) {
        const [e0, e1] = E[i % 12]
        const u = s
        x = V[e0][0] + (V[e1][0] - V[e0][0]) * u
        y = V[e0][1] + (V[e1][1] - V[e0][1]) * u
        z = V[e0][2] + (V[e1][2] - V[e0][2]) * u
        edge = true
      } else {
        const face = i % 6
        const a2 = s * 2 - 1, b2 = s2 * 2 - 1
        const sign = face % 2 ? 1 : -1
        if (face < 2) { x = sign; y = a2; z = b2 } else if (face < 4) { x = a2; y = sign; z = b2 } else { x = a2; y = b2; z = sign }
      }
      const ry = t * 0.4, rx = 0.5
      const x1 = x * Math.cos(ry) + z * Math.sin(ry)
      const z1 = -x * Math.sin(ry) + z * Math.cos(ry)
      const y1 = y * Math.cos(rx) - z1 * Math.sin(rx)
      const z2 = y * Math.sin(rx) + z1 * Math.cos(rx)
      const pz = 3.4 / (4.6 - z2)
      return { x: 0.5 + x1 * 0.26 * pz, y: 0.5 + y1 * 0.26 * pz, w: (edge ? 0.6 : 0.1) + ((z2 + 1.8) / 3.6) * 0.4, accent: edge && i % 17 === 0 }
    }
    case 'shield': {
      // A shield: an outline traced densely, the body stippled, a tick
      // drawn through the middle in the accent colour.
      const outline = (u: number) => {
        // parametric shield edge, u in 0..1 clockwise from the top centre
        const pts: [number, number][] = [[0.5, 0.06], [0.86, 0.18], [0.86, 0.5], [0.78, 0.7], [0.5, 0.95], [0.22, 0.7], [0.14, 0.5], [0.14, 0.18], [0.5, 0.06]]
        const f = u * (pts.length - 1)
        const k = Math.floor(f), r = f - k
        const [x0, y0] = pts[k], [x1, y1] = pts[Math.min(k + 1, pts.length - 1)]
        return [x0 + (x1 - x0) * r, y0 + (y1 - y0) * r] as const
      }
      const role = i % 10
      if (role < 4) {
        const [x, y] = outline(s)
        return { x: x + Math.sin(t * 1.5 + s * 20) * 0.003, y, w: 0.7 + hash(i) * 0.3 }
      }
      if (role < 6) {
        // the tick
        const u = s
        const x = u < 0.35 ? 0.34 + (u / 0.35) * 0.12 : 0.46 + ((u - 0.35) / 0.65) * 0.22
        const y = u < 0.35 ? 0.5 + (u / 0.35) * 0.12 : 0.62 - ((u - 0.35) / 0.65) * 0.22
        return { x: x + (s2 - 0.5) * 0.02, y: y + (hash(i * 3) - 0.5) * 0.02, w: 1, accent: true }
      }
      // stipple inside: shrink the outline towards the centre
      const [x, y] = outline(s)
      const k = 0.15 + Math.sqrt(s2) * 0.8
      return { x: 0.5 + (x - 0.5) * k, y: 0.5 + (y - 0.5) * k, w: 0.12 + hash(i * 5) * 0.3 }
    }
    case 'torus': {
      // A torus turning on two axes: a company as one continuous loop of
      // people, process and performance.
      const u = s * Math.PI * 2 + t * 0.25
      const v = s2 * Math.PI * 2
      const R = 1, r = 0.42
      let x = (R + r * Math.cos(v)) * Math.cos(u)
      let y = (R + r * Math.cos(v)) * Math.sin(u)
      let z = r * Math.sin(v)
      const rx = 1.05 + Math.sin(t * 0.2) * 0.12
      const y1 = y * Math.cos(rx) - z * Math.sin(rx)
      const z1 = y * Math.sin(rx) + z * Math.cos(rx)
      y = y1; z = z1
      const ry = t * 0.12
      const x2 = x * Math.cos(ry) + z * Math.sin(ry)
      z = -x * Math.sin(ry) + z * Math.cos(ry)
      x = x2
      return { x: 0.5 + x * 0.33, y: 0.5 + y * 0.33, w: 0.15 + ((z + 1.4) / 2.8) * 0.85, accent: i % 53 === 0 }
    }
    case 'none':
    default:
      return { x: 0.5 + (s - 0.5) * 0.2, y: 1.2, w: 0 }
  }
}

/* The aspect (width / height) a shape is fitted into, centred inside its
 * stage. null stretches it to the stage. */
export const ASPECT: Record<ShapeName, number | null> = {
  globe: 1, ring: 1, india: 1, vortex: 2.2, wave: null, bars: null,
  word: 3, ebars: 1.6, scatter: null, halo: 1, helix: 0.62, cube: 1, shield: 0.9, torus: 1, none: null,
}
