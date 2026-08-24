import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Icon, type IconName } from '@/components/ui/Icon'
import { ComplianceStrip } from '@/components/home/ComplianceStrip'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { moduleGroups } from '@/content/modules'

export const metadata: Metadata = pageMetadata({
  title: 'Features — every module in one system',
  description:
    'Recruitment, onboarding, attendance, payroll, statutory compliance, claims, self-service and reporting — the full module list, honestly grouped.',
  path: '/features',
})

const groupIcons: Record<string, IconName> = {
  hire: 'briefcase',
  onboard: 'user-plus',
  manage: 'users',
  time: 'clock',
  pay: 'wallet',
  claims: 'receipt',
  serve: 'sparkle',
  control: 'shield',
}

/* Spec §4.2 — intro on the "one system, not five" pillar, a grid of module
 * groups each linking to its detail page, the full module list honestly
 * grouped, and a CTA band. */
export default function FeaturesPage() {
  const totalModules = moduleGroups.reduce((n, g) => n + g.modules.length, 0)

  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Features', path: '/features' },
          ]),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-50 py-10 sm:py-14">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-500">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="font-medium text-ink-900">Features</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              Every product table and feature
            </p>
            <h1 className="mt-3 text-[2.1rem] font-bold leading-[1.12] sm:text-5xl">
              {totalModules} modules, one employee master, every entity
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              Group companies usually end up with a recruitment tool, an attendance
              system, a payroll bureau, a reimbursement process in email — and then
              all of that again for the next entity. Each choice is defensible on its
              own. Together they mean the same employee exists several times over,
              and no two records agree.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              EZER is one system across the whole group. A change to an employee is
              made once. Attendance becomes payroll input without an export. An
              approved claim becomes a salary component without an instruction. And
              the statutory position — for every company, in every state it operates
              in — is a consequence of the data rather than a separate reconciliation.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Module groups ───────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="Module groups">
        <div className="grid gap-5 md:grid-cols-2">
          {moduleGroups.map((group) => (
            <div
              key={group.id}
              data-reveal=""
              className="flex flex-col rounded-2xl bg-white p-7 ring-1 ring-ink-200/70 transition-shadow hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">
                  <Icon name={groupIcons[group.id]} className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">{group.name}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">
                    {group.promise}
                  </p>
                </div>
              </div>

              <ul className="mt-6 flex-1 space-y-3 border-t border-ink-200 pt-5">
                {group.modules.map((m) => (
                  <li key={m.name} className="flex items-start gap-2.5">
                    <Icon
                      name="check"
                      className="mt-1 h-4 w-4 shrink-0 text-brand-500"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-ink-900">
                        {m.name}
                      </span>
                      <span className="block text-sm leading-relaxed text-ink-500">
                        {m.blurb}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              {group.href && (
                <Link
                  href={group.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  Read more about {group.name.toLowerCase()}
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>

      <ComplianceStrip />

      <CtaBand
        title="Which of these do you actually need?"
        lede="Tell us your headcount, your states and what is breaking today. We will show you the parts that matter and skip the rest."
      />
    </>
  )
}
