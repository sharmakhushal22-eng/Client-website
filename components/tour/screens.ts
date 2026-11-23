import { demoFlows, type DemoStep } from '@/content/tour'

export type Shot = Pick<DemoStep, 'src' | 'srcSm' | 'lqip'>

/** A captured screen by its file name, e.g. shot('pms-3') → /tour/pms-3.webp. */
export function shot(name: string): Shot {
  const src = `/tour/${name}.webp`
  for (const f of demoFlows) for (const s of f.steps) if (s.src === src) return { src: s.src, srcSm: s.srcSm, lqip: s.lqip }
  throw new Error(`No captured screen called ${name}`)
}
