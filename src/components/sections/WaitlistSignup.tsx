"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useThemeColor } from "@/hooks/useThemeColor";

gsap.registerPlugin(ScrollTrigger);

export function WaitlistSignup() {
  const theme = useThemeColor();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          scrub: true,
        },
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, phone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full flex items-center justify-center relative z-50"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div ref={containerRef} className="max-w-md w-full px-6 text-center">
        <h2
          className="text-3xl font-light tracking-[0.1em] uppercase mb-12"
          style={{ color: theme.textColor }}
        >
          Join our waitlist
        </h2>

        {submitted ? (
          <div className="space-y-4 py-8">
            {/* Success state */}
            <div
              className="w-8 h-px mx-auto mb-8"
              style={{ backgroundColor: theme.textMutedColor }}
            />
            <p
              className="text-lg font-light tracking-wide"
              style={{ color: theme.textColor }}
            >
              You&rsquo;re on the list.
            </p>
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: theme.textMutedColor }}
            >
              We&rsquo;ll be in touch.
            </p>
          </div>
        ) : (
          <form className="space-y-8" onSubmit={handleSubmit} noValidate>
            <div className="space-y-8 text-left">
              <div>
                <Input
                  id="waitlist-first-name"
                  placeholder="FIRST NAME"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                  disabled={loading}
                  className="border-0 border-b rounded-none px-0 py-3 text-lg placeholder:text-current/40 focus-visible:ring-0 focus-visible:border-current transition-colors bg-transparent"
                  style={{
                    borderColor: `color-mix(in srgb, ${theme.textColor} 20%, transparent)`,
                    color: theme.textColor,
                  }}
                />
              </div>
              <div>
                <Input
                  id="waitlist-email"
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="border-0 border-b rounded-none px-0 py-3 text-lg placeholder:text-current/40 focus-visible:ring-0 focus-visible:border-current transition-colors bg-transparent"
                  style={{
                    borderColor: `color-mix(in srgb, ${theme.textColor} 20%, transparent)`,
                    color: theme.textColor,
                  }}
                />
              </div>
              <div>
                <Input
                  id="waitlist-phone"
                  type="tel"
                  placeholder="PHONE NUMBER (OPTIONAL)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  disabled={loading}
                  className="border-0 border-b rounded-none px-0 py-3 text-lg placeholder:text-current/40 focus-visible:ring-0 focus-visible:border-current transition-colors bg-transparent"
                  style={{
                    borderColor: `color-mix(in srgb, ${theme.textColor} 20%, transparent)`,
                    color: theme.textColor,
                  }}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p
                className="text-xs text-center tracking-wide"
                style={{ color: "rgba(220,80,80,0.9)" }}
                role="alert"
              >
                {error}
              </p>
            )}

            <Button
              id="waitlist-submit"
              type="submit"
              disabled={loading}
              className="w-full py-8 text-sm uppercase tracking-[0.2em] rounded-none mt-12 transition-opacity duration-200 disabled:opacity-50"
              style={{
                backgroundColor: theme.textColor,
                color: theme.backgroundColor,
              }}
            >
              {loading ? "Submitting…" : "Request Access"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
