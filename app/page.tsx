"use client";

import { useRevealObserver } from "@/lib/reveal";
import SideRail from "@/components/SideRail";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import HowItWorks from "@/components/HowItWorks";
import Channels from "@/components/Channels";
import LiveDemo from "@/components/LiveDemo";
import Roadmap from "@/components/Roadmap";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Page() {
  /* §3 공통 스크롤 진입 — 페이지 전체의 [data-reveal]을 한 번에 관측한다.
     발동 후 unobserve 하므로 위아래로 스크롤해도 다시 재생되지 않는다. */
  useRevealObserver();

  return (
    <>
      <SideRail />
      <Header />

      <main className="shell">
        {/* §4.1 · §5 */}
        <Hero />
        {/* §4.2 */}
        <Problem />
        {/* §4.3 */}
        <Solution />
        {/* §4.4 — 이 페이지 모션의 핵심 */}
        <HowItWorks />
        {/* §4.5 */}
        <Channels />
        {/* §6 */}
        <LiveDemo />
        {/* §4.7 */}
        <Roadmap />
        {/* §4.8 */}
        <Pricing />
        {/* §4.9 */}
        <Faq />
        {/* §4.10 */}
        <FinalCta />
      </main>

      {/* §4.11 */}
      <Footer />
    </>
  );
}
