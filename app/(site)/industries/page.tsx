import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, pageMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { IndustryMarquee } from '@/components/home/IndustryMarquee'
import { LatticePlate } from '@/components/sections/LatticePlate'
import { industryCategories, industryCount } from '@/content/positioning'

export const metadata: Metadata = pageMetadata({
  title: 'Industries — HRMS & payroll by sector',
  description:
    'Manufacturing, IT/ITES, BFSI, construction, logistics, healthcare, retail and more. Establishment type decides which registers apply — configured per sector, not one generic template.',
  path: '/industries',
})

/* ============================================================================
 * The industries page.
 *
 * Promoted out of a home-page tab strip for a reason the home page could not
 * serve: someone searching "HRMS for manufacturing India" or "payroll
 * software for staffing company" needs a URL to land on. A tab inside a
 * section is invisible to that search and unlinkable in a sales email.
 *
 * Here the full grid is laid out rather than tabbed — on a dedicated page the
 * reader arrived to scan the list, so hiding thirteen of fourteen categories
 * behind tabs would be working against them. The home page keeps the tabs,
 * where length is the constraint.
 * ========================================================================= */

const industryFaqs = [
  {
    q: 'Our industry is not on the list. Does that mean you cannot help?',
    a: 'Almost certainly not. The list is not the constraint — the statutory rules are, and those are configuration. What actually decides whether EZER fits is your establishment type, the states you operate in and how your wages are structured, not the label on your industry. Tell us those three and we will say plainly whether it works.',
  },
  {
    q: 'What actually changes between industries?',
    a: 'Which registers you owe and which rules drive them. A factory falls under the Factories Act with its own registers, shift and overtime rules; a multi-city IT company is under state Shops & Establishments rules with a different leave entitlement in each state; a construction site adds BOCW cess and welfare board registration. The payroll arithmetic is the same — what changes is what has to come out of it.',
  },
  {
    q: 'We operate across several industries under one group. Is that a problem?',
    a: 'It is the normal case, and it is what the structure is built for. Each company in the group holds its own registrations, and each location under it carries its own establishment type — so a group with a corporate office, a factory and a warehouse runs three different statutory regimes in one system rather than three systems.',
  },
  {
    q: 'Do you handle contract labour and principal-employer obligations?',
    a: 'Yes. Contract workers are held against the principal employer they work for, with PF and ESIC attributed per contract, which is what makes the CLRA position reportable rather than reconstructed at audit time.',
  },
]

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
          ]),
          faqSchema(industryFaqs),
        ]}
      />

      {/* ── Hero and the full grid, as ONE band ──────────────────────────
       *
       * These were two sections, a brand-50 hero over a white grid. They are
       * now a single dark band on the shared lattice plate, because the home
       * page renders this same claim as ONE section and the brief was that
       * the two surfaces match. Kept as two sections they would have needed
       * two plates, and the edge blend at the bottom of the first would have
       * drawn a seam straight across the middle of the band. */}
      <section
        className="relative isolate overflow-hidden border-y border-white/10 bg-dark py-14 text-white sm:py-16 lg:py-20"
        aria-label="Industries"
      >
        <LatticePlate />

        <Container className="relative">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-on-dark-muted">
            <Link href="/" className="hover:text-brand-200">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="font-medium text-white">Industries</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:items-end">
            <div>
              {/* The reference's own eyebrow, heading and lede — the same
                  three the home section carries, at the same sizes and the
                  same glyph shadows, so the two surfaces for #industries say
                  the same thing in the same voice rather than each
                  paraphrasing it.

                  Rounded DOWN to the nearest ten, so the claim stays true as
                  the list changes: 101 reads as "100+", never "101+", which
                  sounds counted rather than mapped. */}
              <p className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-brand-200 [text-shadow:0_1px_3px_rgb(7_12_24/1),0_2px_14px_rgb(7_12_24/0.95)]">
                {Math.floor(industryCount / 10) * 10}+ industries, one engine
              </p>
              {/* text-white is REQUIRED: globals.css sets h1-h4 to ink-900 in
                  @layer base, which on this plate is all but invisible. */}
              <h1 className="mt-3 text-[2rem] font-bold leading-[1.14] text-white [text-shadow:0_1px_2px_rgb(7_12_24/1),0_3px_10px_rgb(7_12_24/0.98),0_6px_28px_rgb(7_12_24/0.95)] sm:text-[2.6rem]">
                India doesn&rsquo;t run on one kind of company.
                <br className="hidden sm:block" /> Neither does EZER.
              </h1>
              <p className="mt-5 text-[1.06rem] leading-relaxed text-white [text-shadow:0_1px_3px_rgb(7_12_24/1),0_2px_14px_rgb(7_12_24/0.95)]">
                We mapped HR, payroll and compliance challenges across more
                than 100 Indian industries — from a 12-branch NBFC to a
                three-shift factory floor — before writing the rules engine.
                This is who we built EZER for. Don&rsquo;t see your exact
                industry below? It&rsquo;s probably still covered.
              </p>
              {/* The exact count keeps its place: the eyebrow rounds down on
                  purpose, and this is where the real number belongs. */}
              <p className="mt-4 text-[0.95rem] font-semibold text-brand-200 [text-shadow:0_1px_3px_rgb(7_12_24/1),0_2px_14px_rgb(7_12_24/0.95)]">
                {industryCount} industries in {industryCategories.length}{' '}
                groups, mapped and counting — new sector rule-sets ship as
                EZER&rsquo;s client base grows.
              </p>
            </div>

            {/* An opaque ground, matching the category cards: at low opacity
                the lattice reads straight through and the aside sits on the
                pattern rather than on a surface. */}
            <div className="rounded-xl border border-white/20 bg-[#0b1730] p-6">
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-on-dark">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <span>
                  <strong className="font-bold text-white">
                    Not on the list?
                  </strong>{' '}
                  The list is not the constraint — the statutory rules are.
                  Tell us your establishment type and the states you operate
                  in, and we will tell you plainly whether this fits.
                </span>
              </p>
              <Button href="/contact" variant="secondary" className="mt-5 w-full">
                Ask about your sector
              </Button>
            </div>
          </div>

          {/* The same drifting rows as the home section, in the same relative
              position the reference puts them: under the heading, above the
              category cards. */}
          <IndustryMarquee onDark />

          <div className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {industryCategories.map((category, i) => (
              <div
                key={category.name}
                data-reveal=""
                style={{ transitionDelay: `${(i % 3) * 45}ms` }}
                className="ez-lattice-card relative overflow-hidden rounded-2xl border border-white/15 border-t-2 border-t-brand-500 bg-[#0b1730] p-5 backdrop-blur-md"
              >
                <h2 className="relative z-10 text-[1.05rem] font-bold tracking-[-0.01em] text-white">
                  {category.name}
                </h2>

                {/* The line that earns the section. A list of industry names
                    proves nothing — anyone can paste an NIC code table.
                    Saying what is statutorily different about construction
                    proves somebody has run payroll in it. This is the one
                    thing this surface carries that the home section does
                    not, and it is why the page exists. */}
                <p className="relative z-10 mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-brand-200">
                  <Icon name="shield" className="mt-0.5 h-3 w-3 shrink-0" />
                  {category.note}
                </p>

                <ul className="relative z-10 mt-4 flex flex-wrap gap-1.5">
                  {category.industries.map((industry) => (
                    <li
                      key={industry}
                      className="ez-chip rounded-md border border-white/30 bg-white/[0.17] px-2.5 py-1 text-[0.79rem] font-semibold text-white"
                    >
                      {industry}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Faq
        faqs={industryFaqs}
        tone="tint"
        eyebrow="By sector"
        title="What actually differs between industries"
      />

      <CtaBand
        title="See it set up for your sector"
        lede="Thirty minutes, against your own establishment type and states — not a generic demo company."
      />
    </>
  )
}
