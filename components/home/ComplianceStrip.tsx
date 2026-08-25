import { complianceItems } from '@/content/modules'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'

/* Spec §4.1 §7 — "Single highest-credibility element for an Indian buyer."
 *
 * A marquee rather than a static row: it fits nine acts on a 360px phone
 * without wrapping to four lines. The list is also rendered statically for
 * screen readers, and the animation is switched off under
 * prefers-reduced-motion (§8.5). */
export function ComplianceStrip() {
  return (
    <section className="border-y border-brand-800 bg-dark py-10 text-white" aria-label="Statutory compliance">
      <Container>
        <p className="flex items-center justify-center gap-2 text-center text-sm font-semibold text-brand-300">
          <Icon name="shield" className="h-4 w-4" />
          Indian statutory compliance, built in
        </p>
      </Container>

      {/* The visible marquee is decorative duplication; the accessible list is
          the <ul> below it. */}
      <div className="relative mt-6 overflow-hidden" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-3 pr-3">
          {[...complianceItems, ...complianceItems].map((item, i) => (
            <span
              key={`${item.code}-${i}`}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-white/5 px-5 py-3 ring-1 ring-white/10"
            >
              <span className="text-sm font-bold text-white">{item.code}</span>
              <span className="text-xs text-ink-400">{item.label}</span>
            </span>
          ))}
        </div>

        {/* Fade the marquee into the background at both edges so items do not
            appear to be cut in half. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-900 to-transparent" />
      </div>

      <ul className="sr-only">
        {complianceItems.map((item) => (
          <li key={item.code}>
            {item.code} — {item.label}
          </li>
        ))}
      </ul>
    </section>
  )
}
