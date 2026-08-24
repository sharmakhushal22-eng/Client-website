import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { company, companyDetails, contact, site, ezerPillars } from '@/site.config'
import { visionGoal } from '@/content/positioning'

export const metadata: Metadata = pageMetadata({
  title: 'About us',
  description:
    'Who builds EZER HRMS, why it exists, how early we are, where your data is hosted, and the company details Indian B2B buyers check before a first call.',
  path: '/about',
})

/* Founder and team photos, 4–6.
 * TODO: replace with the real team. The section hides itself while every
 * entry is unpublished, for the same reason as the testimonials — placeholder
 * people are worse than no people. */
const team = [
  { published: false, name: 'TODO', role: 'TODO', bio: 'TODO', photo: '' },
]

const values = [
  {
    icon: 'map-pin' as const,
    title: 'Built for India, not adapted to it',
    body: 'EPF, ESIC, state-wise Professional Tax, LWF, TDS across both regimes, gratuity, bonus, Shops & Establishments. These live in the calculation engine, not in a localisation layer bolted onto a global product — which is why the edge cases behave, and the edge cases are the whole job.',
  },
  {
    icon: 'shield' as const,
    title: 'Auditable by default',
    body: 'Every figure can be opened to show what produced it: the attendance days counted, the structure in force that month, the rate and ceiling applied. A payroll that cannot be explained is not finished, however correct the total happens to be.',
  },
  {
    icon: 'wallet' as const,
    title: 'Compliance is not an upgrade',
    body: 'Tiered pricing puts statutory depth in the expensive plan, which leaves the company least able to absorb a PF notice with the weakest coverage. One rate, every module, however many entities you run. We would rather grow with headcount than with feature gates.',
  },
  {
    icon: 'lock' as const,
    title: 'Your data stays yours',
    body: `Hosted in ${company.dataResidency}, exportable at any time in standard formats, and at no charge on exit. A system you cannot leave is one you should not enter, so we would rather compete on being worth staying with.`,
  },
]

export default function AboutPage() {
  const addr = company.registeredAddress
  const livingTeam = team.filter((t) => t.published)

  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-50 py-10 sm:py-14">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              About us
            </p>
            <h1 className="mt-3 text-[2.1rem] font-bold leading-[1.12] sm:text-5xl">
              We built the system we could not find
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              {site.positioning}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <Section tone="white" ariaLabel="Our story">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Why EZER exists</h2>

          {/* TODO: replace with the real founding story — what you saw, where,
              and the specific moment it became a product rather than a
              complaint. Keep the shape. Indian B2B buyers read this page
              before a first call, and a generic mission statement is worse
              than none because it tells them nothing and they notice. */}
          <div className="mt-5 space-y-4 text-[1.05rem] leading-relaxed text-ink-600">
            <p>
              Indian payroll is not hard because the arithmetic is difficult. It
              is hard because the rules are plural. Professional Tax has a
              different slab in every state that levies it. Labour Welfare Fund
              is monthly in one state and half-yearly in the next. An employee
              who crosses the ESIC ceiling mid-period stays covered until that
              period ends. None of it is complicated on its own, and all of it
              is a rule somebody has to remember to apply.
            </p>
            <p>
              Multiply that by a group running a corporate office in one state,
              two factories in another and a warehouse in a third, and it stops
              being arithmetic entirely. It becomes four statutory positions,
              four sets of deadlines, and registers assembled branch by branch
              in the week before they are due. Then the labour codes redrew the
              definition of wages itself, and every structure built on the old
              one became wrong — monthly, and backwards, and quietly.
            </p>
            <p>
              The options available were either global platforms with an India
              module that handled the common cases and left the rest to a
              consultant, or Indian payroll software that did the statutory part
              for one entity and stopped at the company boundary. Neither could
              express a group. EZER is the third option: one operation that
              holds every company and every location, with the labour codes in
              the calculation itself rather than in a patch released later.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100">
            <h3 className="text-base font-bold">Why the name?</h3>
            {/* TODO: confirm the real derivation with the founders. */}
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              <em>Ezer</em> means a help that arrives where the need is —
              support that does the work rather than supervising it. That is the
              intended relationship between this software and an HR team: not
              another system to feed, but one that takes the feeding away.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Mission & vision ─────────────────────────────────────────────── */}
      {/* The same two statements the home page makes, deliberately repeated
          rather than reworded — a company that describes itself differently on
          two of its own pages is telling you it has not decided. */}
      <Section tone="tint" ariaLabel="Mission and vision">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-7 ring-1 ring-brand-100">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              {visionGoal.mission.eyebrow}
            </p>
            <p className="mt-4 text-[1.05rem] font-semibold leading-relaxed text-ink-900">
              {visionGoal.mission.statement}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-7 ring-1 ring-brand-100">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              {visionGoal.vision.eyebrow}
            </p>
            <p className="mt-4 text-[1.05rem] font-semibold leading-relaxed text-ink-900">
              {visionGoal.vision.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              {visionGoal.vision.body}
            </p>
          </div>
        </div>
      </Section>

      {/* ── EZER pillars ─────────────────────────────────────────────────── */}
      {/* The same four promises the product's own login screen makes, so a
          customer meets one pitch rather than two. */}
      <section className="relative overflow-hidden bg-ink-900 py-12 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-brand-600/10"
        />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              What the name stands for
            </h2>
            <div
              aria-hidden="true"
              className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#f5b800]/60 to-transparent"
            />
          </div>

          <ul className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {ezerPillars.map((pillar, i) => (
              <li key={i} className="flex items-start gap-5">
                <span
                  aria-hidden="true"
                  className="w-8 shrink-0 text-4xl font-bold leading-none text-[#f5b800]"
                >
                  {pillar.letter}
                </span>
                <span>
                  <span className="block text-base font-semibold text-[#f5b800]">
                    {pillar.title}
                  </span>
                  <span className="mt-1 block text-sm text-ink-300">
                    {pillar.desc}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── What we hold to ─────────────────────────────────────────────── */}
      <Section tone="tint" ariaLabel="What we hold to">
        <SectionHeading eyebrow="How we build" title="Four things we do not compromise on" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              data-reveal=""
              className="rounded-2xl bg-white p-7 ring-1 ring-ink-200/70"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700">
                <Icon name={value.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{value.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Where we are ────────────────────────────────────────────────── */}
      {/* The honest-stage section. A buyer doing diligence will work out how
          early this company is within about ten minutes; saying it first costs
          nothing and buys the right to be believed about everything else.

          TODO: once there are reference customers, replace this section with
          them — and delete it rather than softening it. */}
      <Section tone="white" ariaLabel="Where we are">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Where we are"
            title="How early we are, said plainly"
            align="left"
          />

          <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-ink-600">
            <p>
              EZER is a young product. The payroll and statutory engine is built
              and running; the company is not yet at the stage of publishing a
              wall of customer logos, and we are not going to manufacture one.
              If you are doing diligence, you would find this out anyway — so
              here it is first.
            </p>
            <p>
              What that means practically: you get the people who designed the
              calculation engine on your implementation rather than a partner
              team reading from a deployment guide, your statutory edge cases
              get built because you asked for them, and your pricing is held for
              the founding term. What it also means is that you are early, with
              everything that implies. If you need a vendor with two hundred
              reference customers, we are not that yet.
            </p>
            <p className="font-medium text-ink-900">
              We would rather tell you that on this page than have you discover
              it on the third call.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Team (hidden until real people are in it) ────────────────────── */}
      {livingTeam.length > 0 && (
        <Section tone="tint" ariaLabel="Team">
          <SectionHeading eyebrow="The team" title="Who you will be working with" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {livingTeam.map((person) => (
              <div key={person.name} className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-brand-100" />
                <h3 className="mt-4 text-base font-bold">{person.name}</h3>
                <p className="text-sm text-brand-700">{person.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{person.bio}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Company details ─────────────────────────────────────────────── */}
      <Section tone="tint" ariaLabel="Company details">
        <SectionHeading
          eyebrow="The formal bit"
          title="Company details"
          lede="Here because you are going to look for them, and a page that hides them answers the question badly."
        />

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200">
          <dl className="divide-y divide-ink-200">
            {/* Rows appear as they become real. A table that lists "CIN: TODO"
                answers the diligence question worse than one that simply does
                not have that row yet. */}
            {([
              companyDetails.hasLegalName && ['Registered entity', company.legalName],
              companyDetails.hasCin && ['CIN', company.cin],
              companyDetails.hasGstin && ['GSTIN', company.gstin],
              companyDetails.hasAddress && [
                'Registered office',
                `${addr.line1}, ${addr.line2}, ${addr.city}, ${addr.state} ${addr.pincode}, ${addr.country}`,
              ],
              ['Customer data hosted in', company.dataResidency],
              ['Business hours', contact.businessHours],
            ].filter(Boolean) as [string, string][]).map(([label, value]) => (
              <div key={label} className="grid gap-1 px-6 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6 sm:px-8">
                <dt className="text-sm font-semibold text-ink-500">{label}</dt>
                <dd className="text-sm text-ink-900">{value}</dd>
              </div>
            ))}
            <div className="grid gap-1 px-6 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6 sm:px-8">
              <dt className="text-sm font-semibold text-ink-500">Get in touch</dt>
              <dd className="text-sm">
                <a
                  href={`tel:${contact.phoneE164}`}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {contact.phoneDisplay}
                </a>
                <span className="mx-2 text-ink-400">·</span>
                <a
                  href={`https://wa.me/${contact.whatsappE164}`}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  WhatsApp
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <CtaBand
        title="Come and see it"
        lede="Thirty minutes, the live product, and your own scenario. We would rather show you than describe it."
      />
    </>
  )
}
