"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export default function Contact() {
  const heroRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
      
      gsap.fromTo(
        splitRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setLoading(true);
    // Mock luxury form submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between pt-32 pb-16 px-6 md:px-16 lg:px-24">
      {/* ── HERO SECTION ── */}
      <div ref={heroRef} className="max-w-4xl space-y-8 mt-12">
        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/40 font-light">
          Contact / Concierge
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light uppercase tracking-tighter leading-none">
          Connect with <br />
          <span className="font-light italic tracking-normal lowercase text-white/50">
            elysian.
          </span>
        </h1>
      </div>

      {/* ── SPLIT FORM & INFO SECTION ── */}
      <div 
        ref={splitRef} 
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 my-24 border-t border-white/10 pt-16"
      >
        {/* Left Side: Contact Form */}
        <div className="space-y-8">
          {submitted ? (
            <div className="space-y-6 py-12">
              <div className="w-12 h-px bg-white/30" />
              <p className="text-2xl font-light tracking-wide">
                Your message has been cataloged.
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 leading-relaxed max-w-sm">
                We respond in quietude. A concierge representative will review your inquiry and reach out when the moment is correct.
              </p>
              <button 
                onClick={() => { setSubmitted(false); setName(""); setEmail(""); setMessage(""); }}
                className="text-[10px] uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300 mt-6 cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-8">
                {/* Name field */}
                <div className="flex flex-col">
                  <input
                    type="text"
                    required
                    placeholder="YOUR NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="border-0 border-b border-white/20 rounded-none px-0 py-3 text-lg placeholder:text-white/20 focus:outline-none focus:border-white transition-colors bg-transparent text-white"
                  />
                </div>

                {/* Email field */}
                <div className="flex flex-col">
                  <input
                    type="email"
                    required
                    placeholder="EMAIL ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="border-0 border-b border-white/20 rounded-none px-0 py-3 text-lg placeholder:text-white/20 focus:outline-none focus:border-white transition-colors bg-transparent text-white"
                  />
                </div>

                {/* Inquiry Category Select */}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Inquiry Type</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                    className="border-0 border-b border-white/20 rounded-none px-0 py-3 text-lg bg-transparent text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="general" className="bg-[#121212]">General Inquiry</option>
                    <option value="press" className="bg-[#121212]">Press &amp; Editorial</option>
                    <option value="collection" className="bg-[#121212]">Collection Customization</option>
                    <option value="partnerships" className="bg-[#121212]">Partnership Inquiries</option>
                  </select>
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col">
                  <textarea
                    required
                    placeholder="YOUR MESSAGE"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    className="border-0 border-b border-white/20 rounded-none px-0 py-3 text-lg placeholder:text-white/20 focus:outline-none focus:border-white transition-colors bg-transparent text-white w-full h-32 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 text-sm uppercase tracking-[0.2em] border border-white hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Transmitting…" : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Office Locations */}
        <div className="flex flex-col justify-between border-l border-white/10 pl-8 lg:pl-16 space-y-16">
          <div className="space-y-12">
            <h2 className="text-xl md:text-2xl font-light tracking-wide uppercase text-white/80">
              Global Offices
            </h2>
            
            {/* Paris */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Europe</p>
              <h3 className="text-base uppercase tracking-wide">Elysian Paris</h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                14 Rue de la Paix, 75002 Paris, France <br />
                paris@elysian.com
              </p>
            </div>

            {/* Tokyo */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Asia-Pacific</p>
              <h3 className="text-base uppercase tracking-wide">Elysian Tokyo</h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                5-chōme Minamiaoyama, Minato City, Tokyo 107-0062, Japan <br />
                tokyo@elysian.com
              </p>
            </div>

            {/* New York */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Americas</p>
              <h3 className="text-base uppercase tracking-wide">Elysian New York</h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                110 Greene St, New York, NY 10012, United States <br />
                ny@elysian.com
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">General Concierge</p>
            <p className="text-xs font-light text-white/60">concierge@elysian.com</p>
          </div>
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
