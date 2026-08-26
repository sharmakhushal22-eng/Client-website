import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { lifecycle } from '@/content/lifecycle'

/* ============================================================================
 * The employee lifecycle, as one connected track.
 *
 * Drawn as a track rather than six cards on purpose. Cards would say "we do
 * these six things", which is a feature list. A connected track says "it is
 * the same record moving", which is the actual claim — and the connector is
 * where every competing setup breaks, so it is the part worth drawing.
 *
 * The connector is a single line behind the row rather than five separate
 * arrows: arrows between boxes imply handoffs, which is precisely what this
 * section exists to say does not happen.
 * ========================================================================= */
export function LifecycleStrip() {
  return (
    <section className="bg-canvas py-12 sm:py-14 lg:py-16" aria-label="Employee lifecycle">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
            {lifecycle.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
            {lifecycle.title}
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-600">
            {lifecycle.lede}
          </p>
        </div>

        <div className="relative mt-12">
          {/* The spine. Sits behind the stages and stops short of both ends so
              it reads as a continuous record rather than an open-ended arrow
              pointing off the page. */}
          <span
            aria-hidden="true"
            className="absolute left-[8%] right-[8%] top-7 hidden h-0.5 bg-gradient-to-r from-brand-200 via-brand-500 to-brand-200 lg:block"
          />

          <ol className="relative grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {lifecycle.stages.map((stage, i) => (
              <li
                key={stage.name}
                data-reveal=""
                style={{ transitionDelay: `${Math.min(i, 3) * 45}ms` }}
                className="flex flex-col items-center text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-brand-700 shadow-raised ring-1 ring-brand-100">
                  <Icon name={stage.icon} className="h-6 w-6" />
                </span>
                <span className="mt-3 text-[0.95rem] font-bold text-ink-900">
                  {stage.name}
                </span>
                <span className="mt-0.5 text-[0.78rem] text-ink-600">
                  {stage.detail}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mx-auto mt-12 flex max-w-3xl items-start gap-2.5 rounded-lg bg-surface px-5 py-4 text-sm leading-relaxed text-ink-700 ring-1 ring-ink-200">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          {lifecycle.note}
        </p>
      </Container>
    </section>
  )
}
