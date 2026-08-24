import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { complianceEngine, flags, labourCodes, structure } from '@/content/positioning'
import { complianceItems } from '@/content/modules'

/* ============================================================================
 * The compliance argument, in one section instead of three.
 *
 * This replaces ComplianceEngine + LabourCodes + ComplianceStrip, which
 * together ran to about 2,000px of stacked page for material most readers
 * sample rather than read end to end. As tabs it costs one panel height, and
 * the reader picks the slice they came for.
 *
 * Kept on the dark ground because this is the section that should feel like
 * the spine of the page.
 * ========================================================================= */
export function ComplianceHub() {
  const live = flags.complianceEngineLive

  const panels: TabItem[] = [
    {
      id: 'engine',
      label: 'The engine',
      hint: live ? 'Every register, one run' : 'One position per state',
      panel: (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-[1.02rem] leading-relaxed text-ink-200">
              {complianceEngine.lede}
            </p>
            <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
              {(live ? complianceEngine.points : structure.points).map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-200"
                >
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand-300" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300">
              {live ? 'Generated together' : 'Calculated in the run'}
            </h4>
            <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {complianceEngine.outputs.map((output) => (
                <div
                  key={output.label}
                  className="flex items-baseline justify-between gap-6 py-2.5"
                >
                  <dt className="text-sm font-semibold text-white">{output.label}</dt>
                  <dd className="text-right text-xs text-ink-400">{output.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ),
    },
    {
      id: 'structure',
      label: 'Your group',
      hint: 'Entities, sites, registrations',
      panel: (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-[1.02rem] leading-relaxed text-ink-200">
              {structure.lede}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {structure.locationTypes.map((type) => (
                <li
                  key={type}
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-ink-200"
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>

          <ol className="space-y-4">
            {structure.levels.map((level, i) => (
              <li key={level.name} className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-300">
                  <Icon name={level.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="flex items-center gap-2">
                    <span className="text-[0.95rem] font-bold text-white">
                      {level.name}
                    </span>
                    {i < structure.levels.length - 1 && (
                      <Icon name="chevron-down" className="h-3.5 w-3.5 text-ink-500" />
                    )}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-300">
                    {level.detail}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      ),
    },
    {
      id: 'codes',
      label: 'The four codes',
      hint: 'What changed, and the cost',
      panel: (
        <div>
          <p className="max-w-3xl text-[1.02rem] leading-relaxed text-ink-200">
            {labourCodes.lede}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {labourCodes.codes.map((code) => (
              <div key={code.name} className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                <h4 className="text-[0.95rem] font-bold leading-snug text-white">
                  {code.name}
                </h4>
                <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-brand-300">
                  {code.covers}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">{code.what}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-white/5 px-5 py-4 text-sm leading-relaxed text-ink-300 ring-1 ring-white/10">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
            {labourCodes.note}
          </p>
        </div>
      ),
    },
    {
      id: 'acts',
      label: 'Acts covered',
      hint: 'Nine statutory heads',
      panel: (
        <div>
          <p className="max-w-3xl text-[1.02rem] leading-relaxed text-ink-200">
            Every one of these is calculated inside the payroll run and carried
            into the register it belongs to — not worked out beside it and typed
            back in.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {complianceItems.map((item) => (
              <li
                key={item.code}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
              >
                <span className="text-sm font-bold text-white">{item.code}</span>
                <span className="text-xs leading-snug text-ink-400">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ]

  return (
    <section
      className="relative overflow-hidden bg-ink-900 py-12 text-white sm:py-14 lg:py-16"
      aria-label="Compliance"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_28rem_at_15%_0%,rgba(124,58,237,0.25),transparent)]"
      />
      <Container className="relative">
        {/* Heading beside the tabs rather than centred above them — a centred
            heading costs its own band of vertical space before the content
            even starts. */}
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300">
              {complianceEngine.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              {live
                ? 'One run. Every location’s register together.'
                : 'Four states is not one statutory position. It is four.'}
            </h2>
          </div>

          <p className="flex items-center gap-2 text-sm font-semibold text-brand-300">
            <Icon name="shield" className="h-4 w-4" />
            Indian statutory compliance, built in
          </p>
        </div>

        <Tabs
          items={panels}
          ariaLabel="Compliance topics"
          onDark
          variant="pill"
          className="mt-8"
        />
      </Container>
    </section>
  )
}
