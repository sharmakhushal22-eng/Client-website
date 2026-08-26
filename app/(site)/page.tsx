import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { TrustBar } from '@/components/home/TrustBar'
import { VisionGoals } from '@/components/home/VisionGoals'
import { TodayVsEzer } from '@/components/home/TodayVsEzer'
import { InPractice } from '@/components/home/InPractice'
import { LifecycleStrip } from '@/components/home/LifecycleStrip'
import { ComplianceHub } from '@/components/home/ComplianceHub'
import { ModuleExplorer } from '@/components/home/ModuleExplorer'
import { AccessRights } from '@/components/home/AccessRights'
import { IndustryGrid } from '@/components/home/IndustryGrid'
import { ProductTour } from '@/components/home/ProductTour'
import { TaxCalculator } from '@/components/home/TaxCalculator'
import { ComfortModes } from '@/components/home/ComfortModes'
import { Implementation } from '@/components/home/Implementation'
import { PricingTeaser } from '@/components/home/PricingTeaser'
import { SocialProof } from '@/components/home/SocialProof'
import { FoundingCustomers } from '@/components/home/FoundingCustomers'
import { Outcomes } from '@/components/home/Outcomes'
import { Faq } from '@/components/sections/Faq'
import { CtaBand } from '@/components/sections/CtaBand'
import { JsonLd, faqSchema } from '@/lib/seo'
import { homeFaqs } from '@/content/home'
import { site } from '@/site.config'

export const metadata: Metadata = {
  title: { absolute: 'HR, Payroll & Compliance Engine for India | EZER HRMS' },
  description:
    'India’s most proactive HRMS — built for every industry and establishment type. One employee or several lakh, one office or hundreds of branches, all consolidated. Recruitment to exit on one record.',
  alternates: { canonical: site.url },
}

/* Section order follows the reference handoff's anchor list, with the long
 * stacks collapsed into tabbed sections.
 *
 * The argument the page makes, in order:
 *   who we are → what is broken → why it got worse → what you get →
 *   who controls it → does it fit me → how fast → what it costs →
 *   can I trust you → ask
 *
 * Three deliberate departures from the handoff:
 *
 * 1. ProblemFraming is gone. Three of its four problems were already the
 *    "Today" half of a TodayVsEzer pair, so it was repetition that cost ~700px
 *    and told the reader nothing the next section did not.
 *
 * 2. Compliance engine, labour codes and the acts strip are ONE tabbed
 *    section. Stacked they ran to ~2,000px of material readers sample rather
 *    than read end to end.
 *
 * 3. The module groups and the 20-solution list are one tabbed explorer,
 *    which is what the handoff specified in the first place.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd schemas={[faqSchema(homeFaqs)]} />

      <Hero />
      <TrustBar />

      {/* Who we are, and what we are for. */}
      <VisionGoals />

      {/* What is broken today, and what replaces it. */}
      <TodayVsEzer />

      {/* The arc, before the module list. "One record, hire to exit" is the
          claim; the modules below are the evidence for it. Showing the parts
          first would make it a feature list looking for a story. */}
      <LifecycleStrip />
      <InPractice />

      {/* Why it got worse, and what answers it. */}
      <ComplianceHub />

      {/* What you actually get, and who controls it. */}
      <ModuleExplorer />
      <AccessRights />

      {/* Does it fit my sector, and what does it look like. */}
      <IndustryGrid />
      <ProductTour />
      <TaxCalculator />

      {/* Sits after the product tour deliberately: it is a reason to prefer
          EZER once someone already believes it does the job, not a reason to
          consider it in the first place. */}
      <ComfortModes />

      {/* How fast, and what it costs. */}
      <Implementation />
      <PricingTeaser />

      {/* Can I trust you. SocialProof renders once real testimonials exist;
          FoundingCustomers holds the ground until then. */}
      <SocialProof />
      <FoundingCustomers />
      <Outcomes />

      <Faq faqs={homeFaqs} tone="tint" />
      <CtaBand variant="form" formName="home-final-cta" />
    </>
  )
}
