import type { Metadata } from "next";
import { SceneStack } from "@/components/scene/Scene";
import { HeroScene } from "@/components/scenes/home/HeroScene";
import { OneRecordScene } from "@/components/scenes/home/OneRecordScene";
import { StoryScene } from "@/components/scenes/home/StoryScene";
import { PlatformScene } from "@/components/scenes/home/PlatformScene";
import { EngineScene } from "@/components/scenes/home/EngineScene";
import { IndiaScene } from "@/components/scenes/home/IndiaScene";
import { CommandScene } from "@/components/scenes/home/CommandScene";
import { EmployeeScene } from "@/components/scenes/home/EmployeeScene";
import { GoLiveScene } from "@/components/scenes/home/GoLiveScene";
import { PlanScene } from "@/components/scenes/home/PlanScene";
import { Faq } from "@/components/sections/Faq";
import { FinalCall } from "@/components/story/FinalCall";
import { PageTransition } from "@/components/brand/PageTransition";
import { JsonLd, faqSchema } from "@/lib/seo";
import { homeFaqs } from "@/content/home";
import { site } from "@/site.config";

export const metadata: Metadata = {
  /* absolute, so the "| EZER HRMS" template does not append a second time. */
  title: { absolute: "EZER HRMS: Work, made easier. HR, Payroll & Compliance for India" },
  description: site.description,
  alternates: { canonical: site.url },
};

/* The home page is a stack of ten full-screen scenes (components/scene).
 * Each one slides up over the last; the particle field reshapes itself for
 * each, so the run reads as one journey through different rooms:
 *
 *   1  Work, made easier.        paper   globe
 *   2  Or one record.            white   the E's three bars
 *   3  One leave request         sand    (pinned, four steps, no particles)
 *   4  Thirty-two modules        white   orbit, with the areas on it
 *   5  The engine                navy    a galaxy round the core
 *   6  Every state               sand    India, with arcs from the head office
 *   7  The whole group           white   (dashboard, view-as switch)
 *   8  Their workday             paper   a halo round the phone
 *   9  Live in ten days          sand    ten rising columns
 *  10  One plan                  white   (reading)
 *
 * Then the questions, and the close, where the dots spell the name. */
export default function HomePage() {
  return (
    <PageTransition kind="home">
      <JsonLd schemas={[faqSchema(homeFaqs)]} />
      <SceneStack count={11}>
        <HeroScene />
        <OneRecordScene index={1} />
        <StoryScene index={2} />
        <PlatformScene index={3} />
        <EngineScene index={4} />
        <IndiaScene index={5} />
        <CommandScene index={6} />
        <EmployeeScene index={7} />
        <GoLiveScene index={8} />
        <PlanScene index={9} />
      </SceneStack>
      <Faq faqs={homeFaqs} title="Questions buyers ask first" />
      <FinalCall />
    </PageTransition>
  );
}
