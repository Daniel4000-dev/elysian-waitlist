"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useThemeColor } from "@/hooks/useThemeColor";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section C: Dark Mode Storytelling
 *
 * PRD Requirements:
 * - Background fully transitions into dark mode
 * - One featured model emerges from the original landscape scene (real image)
 * - Model appears realistic and alive (subtle motion)
 * - Three features with images: Craftsmanship, Fashion Philosophy, Design Direction
 */
export function DarkStorytelling() {
  const theme = useThemeColor();
  const sectionRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const modelImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }

      if (modelRef.current) {
        gsap.fromTo(
          modelRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      }

      // Subtle breathing animation — model appears alive
      if (modelImageRef.current) {
        gsap.to(modelImageRef.current, {
          scale: 1.03,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    });

    return () => mm.revert();
  }, []);

  const features = [
    {
      num: "01",
      title: "Craftsmanship",
      body: "Every stitch considered. Every silhouette intentional.",
      img: "/fashion/feature-craftsmanship.png",
      alt: "Craftsmanship detail",
    },
    {
      num: "02",
      title: "Fashion Philosophy",
      body: "Fashion as a language. Presence before attention.",
      img: "/fashion/feature-philosophy.png",
      alt: "Fashion philosophy",
    },
    {
      num: "03",
      title: "Design Direction",
      body: "Defined by silence. Built for the discerning.",
      img: "/fashion/feature-direction.png",
      alt: "Design direction",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full flex flex-col justify-between items-center py-24 px-8 relative overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Top label */}
      <div className="w-full max-w-5xl flex justify-between items-start">
        <p
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: theme.textMutedColor }}
        >
          The Collection
        </p>
        <p
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: theme.textMutedColor }}
        >
          2025 — 2026
        </p>
      </div>

      {/* Center — Isolated model image */}
      <div
        ref={modelRef}
        className="flex-1 flex flex-col items-center justify-center gap-8 my-12 w-full"
      >
        <div className="relative flex items-center justify-center">
          {/* Outer atmosphere ring */}
          <div
            className="w-[360px] h-[360px] rounded-full border absolute"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}
          />
          {/* Inner ring */}
          <div
            className="w-[280px] h-[280px] rounded-full border absolute"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          />

          {/* Real model image — raw img used because GSAP breathing animation needs a direct DOM ref */}
          <div className="w-[240px] h-[320px] rounded-2xl overflow-hidden relative z-10 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={modelImageRef}
              src="/fashion/model-portrait.png"
              alt="Elysian featured model"
              className="w-full h-full object-cover object-top"
              style={{ transformOrigin: "center center" }}
              draggable={false}
            />
            {/* Subtle bottom vignette to blend with background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(11,11,11,0.6) 0%, transparent 40%)",
              }}
            />
          </div>

          {/* Rim light effect behind model */}
          <div
            className="absolute w-[240px] h-[320px] rounded-2xl z-0 blur-3xl"
            style={{
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 70%)",
              transform: "translateY(10px)",
            }}
          />
        </div>

        {/* Model label */}
        <div className="text-center z-10">
          <p
            className="text-[10px] uppercase tracking-[0.4em] mb-3"
            style={{ color: theme.textMutedColor }}
          >
            Featured
          </p>
          <p
            className="text-5xl font-bold uppercase tracking-tighter leading-none"
            style={{ color: theme.textColor }}
          >
            Model
          </p>
          <p
            className="text-[10px] uppercase tracking-[0.3em] mt-3"
            style={{ color: theme.textMutedColor }}
          >
            Craftsmanship in motion
          </p>
        </div>
      </div>

      {/* Bottom — three feature columns with images */}
      <div
        ref={featuresRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto pt-12"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        {features.map((f) => (
          <div key={f.num} className="flex flex-col gap-4">
            {/* Feature image */}
            <div className="w-full aspect-square overflow-hidden rounded-lg relative">
              <Image
                src={f.img}
                alt={f.alt}
                fill
                sizes="(max-width: 768px) 90vw, 33vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                draggable={false}
              />
              {/* Overlay tint to unify with dark palette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(11,11,11,0.2)" }}
              />
            </div>

            {/* Feature text */}
            <p
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: theme.textMutedColor }}
            >
              {f.num}
            </p>
            <p
              className="text-sm uppercase tracking-[0.15em]"
              style={{ color: theme.textColor }}
            >
              {f.title}
            </p>
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: theme.textMutedColor }}
            >
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
