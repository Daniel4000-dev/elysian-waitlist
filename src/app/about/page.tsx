"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Elegant fade-in animations on load
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
      
      gsap.fromTo(
        narrativeRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );

      gsap.fromTo(
        gridRef.current?.children ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.6,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between pt-32 pb-16 px-6 md:px-16 lg:px-24">
      {/* ── HERO SECTION ── */}
      <div ref={heroRef} className="max-w-4xl space-y-8 mt-12">
        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/40 font-light">
          About / The Vision
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light uppercase tracking-tighter leading-none">
          Elysian <br />
          <span className="font-light italic tracking-normal lowercase text-white/50">
            philosophy.
          </span>
        </h1>
      </div>

      {/* ── NARRATIVE SECTION ── */}
      <div 
        ref={narrativeRef} 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 my-24 border-t border-white/10 pt-16"
      >
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-light tracking-wide uppercase text-white/80">
            Defined by Silence.
          </h2>
          <p className="text-sm md:text-base text-white/60 leading-relaxed font-light">
            Elysian is a study in modern form and digital stillness. We create living environments, interactive products, and wearable canvases that reject the noise of the digital age. 
          </p>
          <p className="text-sm md:text-base text-white/60 leading-relaxed font-light">
            We believe that true luxury does not shout; it commands presence by existing in absolute clarity. Every aspect of our design language is reduced to its essential form.
          </p>
        </div>

        <div className="flex flex-col justify-between border-l border-white/10 pl-8 lg:pl-16 space-y-8">
          <blockquote className="text-lg md:text-2xl italic font-light text-white/70 leading-normal">
            &ldquo;Silence is the ultimate canvas. It demands presence before attention, urging us to feel before we analyze.&rdquo;
          </blockquote>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              — Elysian Design Board
            </p>
          </div>
        </div>
      </div>

      {/* ── THREE COLUMN DETAIL GRID ── */}
      <div 
        ref={gridRef} 
        className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16 mb-24"
      >
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-widest text-white/30 font-bold">01 / Silence</p>
          <h3 className="text-lg uppercase tracking-wide">Presence Before Attention</h3>
          <p className="text-xs text-white/50 leading-relaxed font-light">
            We prioritize visual quietude. Interfaces should dissolve into the background, revealing content only when called upon, honoring human focus and attention.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-widest text-white/30 font-bold">02 / Tactility</p>
          <h3 className="text-lg uppercase tracking-wide">Physical Craftsmanship</h3>
          <p className="text-xs text-white/50 leading-relaxed font-light">
            Our physical hardware and materials are curated to have weight and temperature. We design objects meant to be touched, building an emotional connection to the physical plane.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-widest text-white/30 font-bold">03 / Convergence</p>
          <h3 className="text-lg uppercase tracking-wide">Living Canvases</h3>
          <p className="text-xs text-white/50 leading-relaxed font-light">
            By embedding custom visual matrices into structures and wearable textiles, we merge cinematic storytelling with everyday spaces, turning silhouettes into art.
          </p>
        </div>
      </div>

      {/* ── FOOTER CALL TO ACTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 pt-12 text-white/40 text-[10px] md:text-xs tracking-widest uppercase">
        <div className="space-y-2 mb-6 md:mb-0 font-light">
          <p>Elysian SS 2026 Collection — Form Follows Feeling</p>
        </div>
        <div className="flex space-x-12">
          <Link href="/" className="hover:text-white transition-colors">
            Return Home
          </Link>
          <Link href="/#waitlist-submit" className="hover:text-white transition-colors">
            Request Access
          </Link>
        </div>
      </div>
    </main>
  );
}
