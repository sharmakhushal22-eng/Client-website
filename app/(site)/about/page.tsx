import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/Section'
import { Icon } from '@/components/ui/Icon'
import { CtaBand } from '@/components/sections/CtaBand'
import { PageHero } from '@/components/brand/PageHero'
import { PageTransition } from '@/components/brand/PageTransition'
import { Eyebrow } from '@/components/brand/Bars'
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
    body: 'EPF, ESIC, state-wise Professional Tax, LWF, TDS across both regimes, gratuity, bonus, Shops & Establishments. These live in the calculation engine, not in a localisation layer bolted onto a global product. That is why the edge cases behave, and the edge cases are the whole job.',
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
    body: `Exportable at any time in standard formats, and at no charge on exit. A system you cannot leave is one you should not enter, so we would rather compete on being worth staying with.`,
  },
]

export default function AboutPage() {
  const addr = company.registeredAddress
  const livingTeam = team.filter((t) => t.published)

  return (
    <PageTransition kind="editorial">
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <PageHero
        kind="product"
        stage="torus"
        stageChips={ezerPillars.map((p) => p.title)}
        crumbs={[{ name: 'About' }]}
        eyebrow="About us"
        title={['We built the system', <span key="b" className="text-ink-400">we could not find.</span>]}
        lede={site.positioning}
      />

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section aria-label="Our story" className="bg-white py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Eyebrow>Why EZER exists</Eyebrow>
              {/* TODO: replace with the real founding story — what you saw,
                  where, and the moment it became a product rather than a
                  complaint. Keep the shape. */}
              <div className="mt-8 space-y-6 text-[1.08rem] leading-[1.75] text-ink-700">
                <p className="text-[1.35rem] leading-[1.55] text-ink-900">
                  Indian payroll is not hard because the arithmetic is difficult. It
                  is hard because the rules are plural.
                </p>
                <p>
                  Professional Tax has a different slab in every state that levies it.
                  Labour Welfare Fund is monthly in one state and half-yearly in the next.
                  An employee who crosses the ESIC ceiling mid-period stays covered until
                  that period ends. None of it is complicated on its own, and all of it is
                  a rule somebody has to remember to apply.
                </p>
                <p>
                  Multiply that by a group running a corporate office in one state, two
                  factories in another and a warehouse in a third, and it stops being
                  arithmetic entirely. It becomes four statutory positions, four sets of
                  deadlines, and registers assembled branch by branch in the week before
                  they are due. Then the labour codes redrew the definition of wages
                  itself, and every structure built on the old one became quietly wrong.
                </p>
                <p>
                  The options were global platforms with an India module that handled the
                  common cases and left the rest to a consultant, or Indian payroll
                  software that did the statutory part for one entity and stopped at the
                  company boundary. Neither could express a group. EZER is the third option:
                  one operation that holds every company and every location, with the
                  labour codes in the calculation itself.
                </p>
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-28">
                <div className="border-l-2 border-marigold pl-6">
                  <h2 className="text-[1.4rem] tracking-[-0.02em]">Why the name?</h2>
                  {/* TODO: confirm the real derivation with the founders. */}
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-600">
                    <em>Ezer</em> means a help that arrives where the need is, support
                    that does the work rather than supervising it. Said aloud, it is also
                    the one word the product is for: <span className="font-semibold text-ink-900">easier</span>.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ── Mission & vision ─────────────────────────────────────────────── */}
      <section aria-label="Mission and vision" className="bg-paper py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div data-m="rise">
              <p className="ez-kicker text-ink-500">{visionGoal.mission.eyebrow}</p>
              <p className="mt-5 font-display text-[1.9rem] font-[640] leading-[1.15] tracking-[-0.03em] text-ink-900 [font-stretch:106%] sm:text-[2.4rem]">
                {visionGoal.mission.statement}.
              </p>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-600">{visionGoal.mission.support}</p>
            </div>
            <div data-m="rise" style={{ '--d': '100ms' } as React.CSSProperties}>
              <p className="ez-kicker text-ink-500">{visionGoal.vision.eyebrow}</p>
              <p className="mt-5 font-display text-[1.9rem] font-[640] leading-[1.15] tracking-[-0.03em] text-ink-900 [font-stretch:106%] sm:text-[2.4rem]">
                {visionGoal.vision.title}.
              </p>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-600">{visionGoal.vision.body}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── EZER pillars ─────────────────────────────────────────────────────
          The same four promises the product's own login screen makes, so a
          customer meets one pitch rather than two. Set as the four letters of
          the name, large, because here the name is the content. */}
      <section aria-labelledby="pillars-title" className="bg-navy py-20 text-white sm:py-24">
        <Container>
          <Eyebrow tone="onDark">The name, letter by letter</Eyebrow>
          <h2 id="pillars-title" className="mt-5 text-[2.2rem] leading-[1.05] !text-white sm:text-[2.8rem]">
            What EZER stands for
          </h2>
          <ul data-m="settle" className="mt-14 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {ezerPillars.map((pillar, i) => (
              <li key={i} className={`border-b border-white/15 py-8 sm:pr-8 lg:border-b-0 ${i > 0 ? 'lg:border-l lg:pl-8' : ''} ${i % 2 === 1 ? 'sm:border-l sm:pl-8' : ''}`}>
                <span aria-hidden="true" className="block font-display text-[5.5rem] font-[820] leading-[0.8] tracking-[-0.05em] text-marigold [font-stretch:122%]">
                  {pillar.letter}
                </span>
                <span className="mt-6 block text-[1.15rem] font-semibold text-white">{pillar.title}</span>
                <span className="mt-2 block text-[0.92rem] leading-relaxed text-white/60">{pillar.desc}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── What we hold to ─────────────────────────────────────────────── */}
      <section aria-label="What we hold to" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="How we build" title="Four things we do not compromise on" />
          <ol data-m="settle" className="mt-12 grid gap-x-10 sm:grid-cols-2">
            {values.map((value, i) => (
              <li key={value.title} className="border-t border-ink-900/10 py-8">
                <p className="flex items-center gap-3">
                  <span className="ez-num ez-kicker text-brand-600">{String(i + 1).padStart(2, '0')}</span>
                  <Icon name={value.icon} className="h-4 w-4 text-ink-400" />
                </p>
                <h3 className="mt-4 font-display text-[1.45rem] font-[640] leading-snug tracking-[-0.02em] text-ink-900 [font-stretch:104%]">
                  {value.title}
                </h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink-600">{value.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── Why we started: a statement, not a stock photograph ─────────── */}
      <section aria-label="Why we started" className="bg-paper-2 py-20 sm:py-24 lg:py-32">
        <Container>
          <p className="ez-kicker text-ink-500">Why we started</p>
          <p data-m="mask" className="mt-6 max-w-5xl font-display text-[2.3rem] font-[660] leading-[1.04] tracking-[-0.04em] text-ink-900 [font-stretch:110%] sm:text-[3.4rem] lg:text-[4.4rem]">
            <span className="ez-line"><span>Compliance is not the hard part.</span></span>
            <span className="ez-line" style={{ '--li': 1 } as React.CSSProperties}><span className="text-brand-600">Keeping up with it is.</span></span>
          </p>
          <p data-m="rise" className="mt-8 max-w-2xl text-[1.1rem] leading-relaxed text-ink-600">
            Four Labour Codes, 28 states, 8 union territories and an establishment type per site. The
            rules are knowable, but they move, and they move separately. We built EZER so
            that keeping up is the software&rsquo;s job rather than a person&rsquo;s memory.
          </p>
        </Container>
      </section>

      {/* ── Where we are ─────────────────────────────────────────────────────
          The honest-stage section. A buyer doing diligence will work out how
          early this company is within about ten minutes; saying it first costs
          nothing and buys the right to be believed about everything else.
          TODO: once there are reference customers, replace this section. */}
      <section aria-label="Where we are" className="bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Where we are</Eyebrow>
              <h2 className="mt-5 text-[2rem] leading-[1.08] sm:text-[2.5rem]">How early we are, said plainly</h2>
            </div>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-ink-600 lg:col-span-7 lg:col-start-6">
              <p>
                EZER is a young product. The payroll and statutory engine is built and
                running; the company is not yet at the stage of publishing a wall of
                customer logos, and we are not going to manufacture one. If you are doing
                diligence, you would find this out anyway, so here it is first.
              </p>
              <p>
                What that means practically: you get the people who designed the
                calculation engine on your implementation rather than a partner team
                reading from a deployment guide, your statutory edge cases get built
                because you asked for them, and your pricing is held for the founding
                term. It also means you are early, with everything that implies. If you
                need a vendor with two hundred reference customers, we are not that yet.
              </p>
              <p className="font-medium text-ink-900">
                We would rather tell you that on this page than have you discover it on
                the third call.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Team (hidden until real people are in it) ────────────────────── */}
      {livingTeam.length > 0 && (
        <section aria-label="Team" className="bg-paper py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="The team" title="Who you will be working with" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {livingTeam.map((person) => (
                <div key={person.name}>
                  <div className="h-24 w-24 rounded-full bg-paper-2" />
                  <h3 className="mt-4 text-base font-semibold">{person.name}</h3>
                  <p className="text-sm text-brand-700">{person.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{person.bio}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Company details ─────────────────────────────────────────────── */}
      <section aria-label="Company details" className="bg-paper py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>The formal bit</Eyebrow>
              <h2 className="mt-5 text-[2rem] leading-[1.08] sm:text-[2.5rem]">Company details</h2>
              <p className="mt-4 max-w-sm text-[1rem] leading-relaxed text-ink-600">
                Here because you are going to look for them, and a page that hides them
                answers the question badly.
              </p>
            </div>
            <dl className="border-t-2 border-ink-900 lg:col-span-7 lg:col-start-6">
              {([
                companyDetails.hasLegalName && ['Registered entity', company.legalName],
                companyDetails.hasCin && ['CIN', company.cin],
                companyDetails.hasGstin && ['GSTIN', company.gstin],
                companyDetails.hasAddress && [
                  'Registered office',
                  `${addr.line1}, ${addr.line2}, ${addr.city}, ${addr.state} ${addr.pincode}, ${addr.country}`,
                ],
                ['Business hours', contact.businessHours],
              ].filter(Boolean) as [string, string][]).map(([label, value]) => (
                <div key={label} className="grid gap-1 border-b border-ink-900/10 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <dt className="text-[0.92rem] text-ink-500">{label}</dt>
                  <dd className="text-[0.98rem] text-ink-900">{value}</dd>
                </div>
              ))}
              <div className="grid gap-1 border-b border-ink-900/10 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="text-[0.92rem] text-ink-500">Get in touch</dt>
                <dd className="text-[0.98rem]">
                  <a href={`tel:${contact.phoneE164}`} className="ez-link font-semibold text-brand-700">
                    {contact.phoneDisplay}
                  </a>
                  <span className="mx-2 text-ink-400">·</span>
                  <a href={`https://wa.me/${contact.whatsappE164}`} className="ez-link font-semibold text-brand-700">
                    WhatsApp
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <CtaBand
        title="Come and see it"
        lede="Thirty minutes, the live product, and your own scenario. We would rather show you than describe it."
      />
    </PageTransition>
  )
}
