"use client";

import ScrollProgressProvider from "@/components/ScrollProgressProvider";
import { HeroSection } from "@/components/sections/HeroSection";
import { InteractiveFashionScene } from "@/components/sections/InteractiveFashionScene";
import { AppReveal } from "@/components/sections/AppReveal";
import { DarkStorytelling } from "@/components/sections/DarkStorytelling";
import { BrandPhilosophy } from "@/components/sections/BrandPhilosophy";
import { WaitlistSignup } from "@/components/sections/WaitlistSignup";

export default function Home() {
  return (
    <ScrollProgressProvider>
      <main className="relative w-full">
        {/* Section A: Hero + Canvas Animation */}
        <HeroSection />

        {/* Section B: Interactive Fashion Scene */}
        <InteractiveFashionScene />

        {/* Section C: Device / App Reveal */}
        <AppReveal />

        {/* Section D: Dark Mode Storytelling */}
        <DarkStorytelling />

        {/* Section E: Brand Philosophy */}
        <BrandPhilosophy />

        {/* Section F: Waitlist Signup */}
        <WaitlistSignup />
      </main>
    </ScrollProgressProvider>
  );
}
