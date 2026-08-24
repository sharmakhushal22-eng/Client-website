import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { ScreenshotFrame } from '@/components/ui/ScreenshotFrame'
import { taxCalculator, flags } from '@/content/positioning'

/* "Attractive tax calculator and decision making processes to your
 * employees."
 *
 * Framed as the HR workload it removes rather than as a feature: the
 * regime question arrives every January from everyone at once, and it is
 * the single most repetitive thing an Indian HR team answers. */
export function TaxCalculator() {
  if (!flags.taxCalculatorLive) return null

  return (
    <Section tone="tint" ariaLabel="Employee tax calculator">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={taxCalculator.eyebrow}
            title={taxCalculator.title}
            lede={taxCalculator.lede}
            align="left"
          />

          <dl className="mt-8 space-y-4">
            {taxCalculator.points.map((point) => (
              <div key={point.label} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                <div>
                  <dt className="text-[0.95rem] font-bold text-ink-900">{point.label}</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-ink-600">
                    {point.detail}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <ScreenshotFrame alt="EZER HRMS employee tax calculator comparing the old and new regime on the employee's own salary" />
      </div>
    </Section>
  )
}
