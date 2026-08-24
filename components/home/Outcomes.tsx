import { Section, SectionHeading } from '@/components/ui/Section'
import { outcomes } from '@/content/home'

/* Spec §4.1 §10 — "Must be defensible; do not invent."
 *
 * Hidden entirely while the figures are still TODO. An invented ROI number is
 * the fastest way to lose a CFO, who is the persona this section exists for. */
export function Outcomes() {
  const ready = outcomes.filter((o) => o.value && o.value !== 'TODO')
  if (ready.length === 0) return null

  return (
    <Section tone="ink" ariaLabel="Outcomes">
      <SectionHeading
        eyebrow="What it adds up to"
        title="The measurable part"
        lede="Figures from live implementations, not projections."
        onDark
      />

      <dl className="mt-10 grid gap-8 text-center sm:grid-cols-3">
        {ready.map((o) => (
          <div key={o.label} data-reveal="">
            <dt className="sr-only">{o.label}</dt>
            <dd>
              <span className="block text-4xl font-bold text-brand-300 sm:text-5xl">
                {o.value}
              </span>
              <span className="mt-2 block text-[0.95rem] text-ink-200">{o.label}</span>
              {o.note && o.note !== 'TODO — source' && (
                <span className="mt-1 block text-xs text-ink-500">{o.note}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
