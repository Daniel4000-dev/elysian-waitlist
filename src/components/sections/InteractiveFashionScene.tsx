"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

/**
 * Section B: Interactive Fashion Scene
 *
 * PRD Requirements:
 * - Standalone interactive section between Hero and App Reveal
 * - Scroll-driven parallax transitions
 * - Layered visual storytelling
 * - Bridges light Hero to the phone/app reveal
 */
export function InteractiveFashionScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      // Main image parallax — moves slower than scroll (creates depth)
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.15, y: 0 },
          {
            scale: 1,
            y: -60,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      // Overlay fades in as section enters (adds cinematic weight)
      if (overlayRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0.2 },
          {
            opacity: 0.65,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }

      // Headline sweeps up from below
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              end: "top 25%",
              scrub: 1,
            },
          }
        );
      }

      // Subline fades in slightly after
      if (sublineRef.current) {
        gsap.fromTo(
          sublineRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 55%",
              end: "top 20%",
              scrub: 1,
            },
          }
        );
      }

      // Left panel slides in from left
      if (leftPanelRef.current) {
        gsap.fromTo(
          leftPanelRef.current,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 50%",
              end: "center 40%",
              scrub: 1,
            },
          }
        );
      }

      // Right panel slides in from right
      if (rightPanelRef.current) {
        gsap.fromTo(
          rightPanelRef.current,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 50%",
              end: "center 40%",
              scrub: 1,
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Full-bleed background image with parallax ── */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: "transform" }}
      >
        <Image
          src="/fashion/fashion-scene.png"
          alt="Elysian fashion scene"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* ── Cinematic overlay — darkens as user scrolls deeper ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.75) 100%)",
          opacity: 0.2,
        }}
      />

      {/* ── Left editorial tag ── */}
      <div
        ref={leftPanelRef}
        className="absolute top-1/2 left-8 md:left-16 z-20 -translate-y-1/2"
        style={{ opacity: 0 }}
      >
        <div className="flex flex-col gap-3">
          <div
            className="w-px h-16 bg-white/30 mx-auto"
          />
          <p
            className="text-[9px] uppercase tracking-[0.35em] text-white/50 [writing-mode:vertical-rl] rotate-180"
          >
            The Collection — SS 2026
          </p>
        </div>
      </div>

      {/* ── Right editorial tag ── */}
      <div
        ref={rightPanelRef}
        className="absolute top-1/2 right-8 md:right-16 z-20 -translate-y-1/2"
        style={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-[9px] uppercase tracking-[0.35em] text-white/50 [writing-mode:vertical-rl]"
          >
            Elysian — 01
          </p>
          <div className="w-px h-16 bg-white/30 mx-auto" />
        </div>
      </div>

      {/* ── Central editorial text block ── */}
      <div className="relative z-20 flex flex-col items-center justify-end h-full min-h-screen pb-20 md:pb-28 px-8 text-center">
        <div ref={headlineRef} style={{ opacity: 0 }}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 mb-6">
            Editorial
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-none text-white mb-6">
            Form Follows
            <br />
            <span className="font-light italic">Feeling.</span>
          </h2>
        </div>

        <div ref={sublineRef} style={{ opacity: 0 }}>
          <div className="w-12 h-px bg-white/25 mx-auto mb-6" />
          <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-white/50 max-w-sm mx-auto leading-relaxed">
            Where silence meets silhouette.
            <br />
            The season begins.
          </p>
        </div>
      </div>
    </section>
  );
}
