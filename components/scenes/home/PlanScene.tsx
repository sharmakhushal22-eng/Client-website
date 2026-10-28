import { Container } from '@/components/ui/Container'
import { Button, Arrow } from '@/components/ui/Button'
import { Eyebrow } from '@/components/brand/Bars'
import { Icon } from '@/components/ui/Icon'
import { Scene } from '@/components/scene/Scene'
import { pricing, trustBadges } from '@/site.config'
import { foundingCustomer } from '@/content/home'

/* ============================================================================
 * Scene 10: what it costs, and how early we are.
 *
 * Two statements, side by side and of equal weight: one plan with nothing
 * held back, and the founding-customer offer that stands where testimonials
 * would go until real ones exist. The particles step aside; this is a scene
 * for reading.
 * ========================================================================= */
export function PlanScene({ index }: { index: number }) {
  const badges = trustBadges.filter((b) => b.verified)
  return (
    <Scene index={index} tone="white" labelledBy="plan-title">
      <Container className="flex h-full flex-col justify-center py-20 lg:py-0 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Eyebrow>Pricing</Eyebrow>
            <h2 id="plan-title" className="mt-5 text-[2.3rem] leading-[1.04] sm:text-[3rem] lg:text-[min(3.4vw,5.8vh)]">
              One plan.
              <br />
              <span className="text-ink-400">Nothing held back.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-ink-600">
              Priced per employee, per month. A 40-person startup gets the same depth as a
              lakh-employee group, implementation included.
            </p>
            <ul data-m="settle" className="mt-7 grid gap-3 sm:grid-cols-2">
              {pricing.plan.guarantees.slice(0, 4).map((g) => (
                <li key={g} className="flex gap-3 rounded-[16px] bg-paper p-4 text-[0.92rem] leading-snug text-ink-700">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {g}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href="/pricing" variant="secondary" size="lg">
                See pricing
                <Arrow />
              </Button>
              {badges.length > 0 && (
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-[0.85rem] text-ink-500">
                  {badges.map((b) => (
                    <span key={b.label} className="inline-flex items-center gap-1.5">
                      <Icon name={b.icon} className="h-4 w-4 text-brand-600" />
                      {b.label}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>

          <div data-depth="1" className="lg:col-span-5 lg:col-start-8">
            <div className="relative overflow-hidden rounded-[30px] bg-navy p-8 text-white sm:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgb(242_165_22/0.35),transparent)]" />
              <p className="ez-kicker relative text-marigold">{foundingCustomer.eyebrow}</p>
              <h3 className="relative mt-4 font-display text-[1.8rem] font-[650] leading-[1.1] tracking-[-0.03em] text-white [font-stretch:106%]">
                {foundingCustomer.title}
              </h3>
              <p className="relative mt-4 text-[0.98rem] leading-relaxed text-white/70">{foundingCustomer.lede}</p>
              <ul className="relative mt-6 space-y-3">
                {foundingCustomer.offer.map((o) => (
                  <li key={o.title} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] h-[2px] w-4 shrink-0 rounded-full bg-marigold" />
                    <span>
                      <span className="block text-[0.98rem] font-semibold text-white">{o.title}</span>
                      <span className="block text-[0.86rem] text-white/60">{o.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="relative mt-8">
                <Button href="/contact" variant="onDark" className="w-full sm:w-auto">
                  {foundingCustomer.ctaLabel}
                  <Arrow />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Scene>
  )
}
