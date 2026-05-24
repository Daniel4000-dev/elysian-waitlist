"use client";

import { Icons } from "@/components/ui/icons";
import { BaseSectionProps } from "@/types/components";

export function HeroLanding({ currentScrollProgress }: BaseSectionProps) {
  // Hero section stays visible up to 0.35, but begins fading out/animating
  const opacity = Math.max(1 - (currentScrollProgress * 3), 0);

  return (
    <section className="absolute top-0 left-0 w-full h-screen z-20 flex flex-col justify-between p-8 pointer-events-none transition-opacity duration-300" style={{ opacity }}>
      <div className="flex justify-between items-start w-full">
        <button className="pointer-events-auto hover:opacity-70 transition-opacity">
          <Icons.menu className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-2xl font-bold tracking-[0.2em] text-black uppercase">elysian</h1>
        <button className="text-xs uppercase tracking-widest font-semibold pointer-events-auto text-black hover:opacity-70 transition-opacity">
          Join in
        </button>
      </div>
      <div className="flex justify-center items-end w-full pb-12">
        <div className="text-center">
          <p className="text-sm tracking-widest uppercase text-black">Defined by silence.</p>
          <p className="text-xs tracking-widest uppercase text-black/60 mt-2">Presence before attention.</p>
        </div>
      </div>
    </section>
  );
}
