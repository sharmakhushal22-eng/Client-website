import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { implementation } from '@/content/positioning'

/* The ten-day programme.
 *
 * Heading beside the timeline rather than centred above it, and the phases as
 * a connected horizontal track instead of four tall cards — a timeline should
 * look like a timeline, and it happens to be the shortest way to draw it. */
export function Implementation() {
  return (
    <section className="bg-white py-12 sm:py-14 lg:py-16" aria-label="Implementation">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              {implementation.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              {implementation.title}
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-600">
              {implementation.lede}
            </p>

            <p className="mt-6 flex items-start gap-2.5 rounded-xl bg-ink-900 px-5 py-4 text-sm leading-relaxed text-on-dark-muted">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              <span>
                <strong className="font-semibold text-white">
                  Your data is an asset, not a data-entry job.
                </strong>{' '}
                {implementation.promise}
              </span>
            </p>
          </div>

          <ol className="relative space-y-3">
            {/* The spine. Sits behind the rows and stops at the last one. */}
            <span
              aria-hidden="true"
              className="absolute left-[1.35rem] top-4 bottom-4 w-px bg-brand-200"
            />

            {implementation.phases.map((phase, i) => (
              <li
                key={phase.days}
                data-reveal=""
                style={{ transitionDelay: `${Math.min(i, 3) * 45}ms` }}
                className="relative flex items-start gap-4 rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-100"
              >
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-xs font-bold leading-none text-white">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-2.5">
                    <span className="text-[1.02rem] font-bold text-ink-900">
                      {phase.title}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-brand-700">
                      {phase.days}
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    {phase.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
