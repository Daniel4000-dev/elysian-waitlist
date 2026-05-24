"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useThemeColor } from "@/hooks/useThemeColor";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section D: Brand Philosophy
 *
 * PRD Requirements:
 * - Large bold "Elysian" typography
 * - Small supporting statement underneath
 * - Large cinematic landscape visual beneath text (real image)
 * - World-scale fashion imagery / luxury environmental composition
 */
export function BrandPhilosophy() {
  const theme = useThemeColor();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      // Wordmark zooms in from small
      if (wordmarkRef.current) {
        gsap.fromTo(
          wordmarkRef.current,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      }

      // Divider line expands outward
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }

      // Supporting text lines stagger upward
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
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

      // Background image parallax — slower than scroll, adds depth
      if (backgroundRef.current) {
        gsap.fromTo(
          backgroundRef.current,
          { scale: 1.1, y: 0 },
          {
            scale: 1,
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
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
      className="h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* ── Cinematic landscape background image ── */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0"
        style={{ willChange: "transform" }}
      >
        <Image
          src="/fashion/landscape-cinematic.png"
          alt="Elysian cinematic landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          draggable={false}
        />
        {/* Dark overlay to ensure text legibility over the photograph */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,11,11,0.55) 0%, rgba(11,11,11,0.35) 50%, rgba(11,11,11,0.70) 100%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 text-center max-w-4xl px-8">
        {/* Eyebrow */}
        <p
          className="text-[10px] uppercase tracking-[0.4em] mb-8"
          style={{ color: "rgba(255,255,255,0.50)" }}
        >
          Brand Philosophy
        </p>

        {/* Large bold Elysian wordmark */}
        <h2
          ref={wordmarkRef}
          className="text-7xl md:text-9xl lg:text-[10rem] font-bold uppercase tracking-tighter leading-none mb-12"
          style={{ color: "#FFFFFF" }}
        >
          Elysian
        </h2>

        {/* Expanding divider line */}
        <div
          ref={lineRef}
          className="h-px w-full max-w-md mx-auto mb-12 origin-center"
          style={{ backgroundColor: "rgba(255,255,255,0.30)" }}
        />

        {/* Supporting quotes */}
        <div ref={textRef} className="space-y-4">
          <p
            className="text-sm md:text-base font-light italic tracking-wide leading-relaxed"
            style={{ color: "rgba(255,255,255,0.90)" }}
          >
            &ldquo;We are not interested in excess.
            <br />
            We are interested in essence.&rdquo;
          </p>
          <p
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            A wardrobe redefined as language.
          </p>
          <p
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            Built for presence, not attention.
          </p>
        </div>
      </div>
    </section>
  );
}
