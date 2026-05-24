"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollProgress } from "@/components/ScrollProgressProvider";
import { ScrollTimeline } from "@/enums/scroll.enum";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 192;
const PRELOAD_PRIORITY = 20; // Load first N frames immediately; rest on idle
const framePath = (i: number): string =>
  `/heroAnimate/ezgif-frame-${(i + 1).toString().padStart(3, "0")}.jpg`;

/**
 * Section A: Hero Landing
 *
 * PRD Requirements:
 * - Full viewport height
 * - Minimal navigation: hamburger left, wordmark center, "Join in" right
 * - Bright white background
 * - Editorial fashion image in full landscape framing
 * - As user scrolls: static image transitions into motion/video
 * - Landscape scene zooms OUTWARD (canvas expands, pulls back) then transitions to phone
 * - Smooth cinematic movement begins
 */
export function HeroSection() {
  const { progress } = useScrollProgress();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phoneRef = useRef<HTMLImageElement>(null);
  const phoneGroupRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentFrameRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);

  // ── Draw a specific frame onto the canvas ──
  const drawFrame = useCallback((index: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const img = imagesRef.current[Math.round(index)];
    if (!img?.complete || !img.naturalWidth) return;

    ctx.clearRect(0, 0, 1280, 720);
    ctx.drawImage(img, 0, 0, 1280, 720);
  }, []);

  // ── Preload images: priority batch first, rest on idle ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    // Sized to exactly the video frames' dimensions (1280x720)
    // object-fit: cover on the canvas element will handle full bleed scaling natively
    canvas.width = 1280;
    canvas.height = 720;

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    let loadedSoFar = 0;
    const onLoad = () => {
      loadedSoFar++;
      setLoadedCount(loadedSoFar);
    };

    // Priority: load first PRELOAD_PRIORITY frames immediately
    for (let i = 0; i < PRELOAD_PRIORITY; i++) {
      const img = new Image();
      img.onload = () => {
        onLoad();
        if (i === 0) drawFrame(0);
      };
      img.src = framePath(i);
      images[i] = img;
    }

    // Remaining frames: load in idle time so priority frames aren't blocked
    let idleIdx = PRELOAD_PRIORITY;
    const loadNextIdle = (deadline?: IdleDeadline) => {
      while (
        idleIdx < TOTAL_FRAMES &&
        (deadline ? deadline.timeRemaining() > 1 : true)
      ) {
        const i = idleIdx++;
        const img = new Image();
        img.onload = onLoad;
        img.src = framePath(i);
        images[i] = img;
      }
      if (idleIdx < TOTAL_FRAMES) {
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(loadNextIdle);
        } else {
          setTimeout(() => loadNextIdle(), 16);
        }
      }
    };

    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(loadNextIdle);
    } else {
      setTimeout(loadNextIdle, 100);
    }

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [drawFrame]);

  // ── Update canvas frame based on scroll progress ──
  useEffect(() => {
    const animProgress = Math.min(
      Math.max(progress / ScrollTimeline.AppRevealEnd, 0),
      1
    );
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.ceil(animProgress * TOTAL_FRAMES)
    );
    currentFrameRef.current = frameIndex;
    drawFrame(frameIndex);
  }, [progress, drawFrame]);

  // ── GSAP: canvas zooms OUTWARD (expands) → then shrinks into phone frame ──
  // PRD: "The fashion landscape scene zooms outward"
  useEffect(() => {
    const stage = stageRef.current;
    const phoneGroup = phoneGroupRef.current;
    const canvasWrapper = canvasWrapperRef.current;
    const phone = phoneRef.current;
    const text = textRef.current;
    if (!stage || !phoneGroup || !canvasWrapper || !phone || !text) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      // Scale that makes canvas fill the viewport from the phone-group starting point
      const getFullscreenScale = (): number => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // The phone group width is 70vw, so its width in pixels is:
        const groupW = vw * 0.7;
        const groupH = groupW * (322 / 662);
        const canvasW = groupW * 0.97;
        const canvasH = groupH * 0.92;
        const scaleX = vw / canvasW;
        const scaleY = vh / canvasH;
        return Math.max(scaleX, scaleY) * 1.05;
      };

      const initialScale = getFullscreenScale();

      // Start at fullscreen (phone group scaled up so canvas fills viewport)
      gsap.set(phoneGroup, {
        scale: initialScale,
        opacity: 1,
        xPercent: -50,
        yPercent: -50,
        position: "absolute",
        top: "50%",
        left: "50%",
      });
      gsap.set(canvasWrapper, { borderRadius: "0px" });
      gsap.set(phone, { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=400%",
          scrub: 1.5,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 (0 -> 0.5): Zoom out the entire phone group (bezel + canvas together) from fullscreen scale to 80vw size (scale 1.1428)
      tl.fromTo(
        phoneGroup,
        { scale: () => getFullscreenScale() },
        {
          scale: 1.1428,
          ease: "power2.inOut",
          duration: 0.5,
        },
        0
      );


      // Smoothly round the canvas corners to match the phone screen
      tl.to(
        canvasWrapper,
        {
          borderRadius: "2.5vw",
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.15
      );

      // Phase 2 (0.5 -> 1.0): Both continue to shrink from 80vw (scale 1.1428) to 70vw (scale 1.0)
      tl.to(
        phoneGroup,
        {
          scale: 1.0,
          ease: "power2.inOut",
          duration: 0.5,
        },
        0.5
      );

      // Text fade out early (before zoom-out begins)
      tl.to(
        text,
        { opacity: 0, y: -50, ease: "power2.inOut", duration: 0.25 },
        0.05
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const headerOpacity = Math.max(1 - progress * 8, 0);

  // Loading progress (shown until first frame ready)
  const isReady = loadedCount >= 1;

  return (
    <section ref={sectionRef} className="relative w-full">
      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden bg-white"
      >
        {/* ── Loading bar — shown until frame 0 is ready ── */}
        {!isReady && (
          <div className="absolute top-0 left-0 w-full z-[100] h-px bg-black/10">
            <div
              className="h-full bg-black/40 transition-all duration-300"
              style={{ width: `${Math.min((loadedCount / PRELOAD_PRIORITY) * 100, 100)}%` }}
            />
          </div>
        )}

        {/* ── PHONE GROUP ── */}
        <div
          ref={phoneGroupRef}
          className="absolute z-10"
          style={{
            width: "70vw",
            aspectRatio: "662 / 322",
          }}
        >
          {/* Canvas — clipped to phone screen area */}
          <div
            ref={canvasWrapperRef}
            className="absolute overflow-hidden bg-black"
            style={{
              left: "1.5%",
              top: "4%",
              width: "97%",
              height: "92%",
              borderRadius: "0px",
              pointerEvents: "none",
            }}
          >
            <canvas
              ref={canvasRef}
              className="block w-full h-full object-cover"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Phone bezel overlay — raw img scaled and rotated to match landscape container */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={phoneRef}
            src="/elysianphone.png"
            className="absolute pointer-events-none"
            style={{
              width: "calc(100% * 322 / 662)",
              height: "calc(100% * 662 / 322)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(90deg)",
              transformOrigin: "center center",
              objectFit: "contain",
              opacity: 0,
            }}
            alt="Elysian smartphone interface"
            draggable={false}
          />
        </div>

        {/* ── EDITORIAL TEXT OVERLAY ── */}
        <div
          ref={textRef}
          className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-end pb-24 md:pb-32 px-4 text-center"
          style={{ opacity: headerOpacity, color: "#000" }}
        >
          <h2 className="text-sm md:text-base uppercase tracking-[0.3em] font-light mb-4">
            A study in modern form.
          </h2>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/60">
            Defined by silence. Presence before attention.
          </p>
        </div>
      </div>
    </section>
  );
}
