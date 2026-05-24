"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollProgress } from "@/components/ScrollProgressProvider";
import { useThemeColor } from "@/hooks/useThemeColor";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 192;
const framePath = (i: number): string =>
  `/heroAnimate/ezgif-frame-${(i + 1).toString().padStart(3, "0")}.jpg`;

/**
 * Section C: Interactive Device / App Reveal
 *
 * PRD Requirements:
 * - The landscape scene zooms outward (handled in HeroSection)
 * - Content transitions into an iPhone interface frame
 * - Animation feels like entering the Elysian app experience
 * - Video/canvas continues playing naturally inside the phone screen
 * - "Closer than before." / "The experience evolves." / "Beyond the surface."
 */
export function AppReveal() {
  const { progress } = useScrollProgress();
  const theme = useThemeColor();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  // ── Draw frame into the in-phone canvas ──
  const drawFrame = useCallback((index: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const img = imagesRef.current[Math.round(index)];
    if (!img?.complete || !img.naturalWidth) return;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ── Preload frames for this canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 320 * dpr;
    canvas.height = 640 * dpr;
    ctx.scale(dpr, dpr);

    const images: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i);
      if (i === 0) img.onload = () => drawFrame(0);
      images.push(img);
    }
    imagesRef.current = images;
  }, [drawFrame]);

  // ── Sync canvas to scroll progress ──
  useEffect(() => {
    // AppReveal shows frames 60–120% of the animation (mid-to-end)
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.floor(progress * TOTAL_FRAMES)
    );
    currentFrameRef.current = frameIndex;
    drawFrame(frameIndex);
  }, [progress, drawFrame]);

  // ── GSAP entrance animations ──
  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !phoneRef.current) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      gsap.fromTo(
        phoneRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
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
      {/* ── Phone device with live canvas screen ── */}
      <div
        ref={phoneRef}
        className="relative z-10 flex flex-col items-center gap-8"
        style={{ opacity: 0 }}
      >
        {/* Phone frame */}
        <div
          className="relative"
          style={{
            width: "min(300px, 68vw)",
            aspectRatio: "9 / 19.5",
          }}
        >
          {/* Phone bezel chrome */}
          <div
            className="absolute inset-0 rounded-[3rem] border-2 z-20 pointer-events-none"
            style={{
              borderColor: "rgba(255,255,255,0.15)",
              boxShadow:
                "0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          />

          {/* Notch */}
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-30 rounded-full bg-black"
            style={{ width: 72, height: 10 }}
          />

          {/* Screen area — live canvas plays here */}
          <div className="absolute inset-[4px] rounded-[2.8rem] overflow-hidden bg-black">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ display: "block" }}
            />
            {/* Subtle screen glare */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
              }}
            />
          </div>
        </div>

        {/* Text below phone */}
        <div
          ref={textRef}
          className="text-center max-w-lg px-8"
          style={{ opacity: 0 }}
        >
          <h2
            className="text-xl md:text-2xl tracking-[0.15em] uppercase font-light mb-6"
            style={{ color: theme.textColor }}
          >
            Closer than before.
          </h2>
          <p
            className="text-xs md:text-sm tracking-[0.3em] uppercase"
            style={{ color: theme.textMutedColor }}
          >
            The experience evolves. Beyond the surface.
          </p>
        </div>
      </div>
    </section>
  );
}
