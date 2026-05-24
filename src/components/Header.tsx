"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset state during render if pathname changes (React recommended pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const handleWaitlistClick = (e: React.MouseEvent) => {
    setIsOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("waitlist-submit")?.closest("section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ── HEADER BAR ── */}
      <header
        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 py-6 transition-colors duration-300"
        style={{ 
          mixBlendMode: isOpen ? "normal" : "difference",
          color: isOpen ? "#ffffff" : "#ffffff"
        }}
      >
        {/* Animated Custom Minimal Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 text-2xl flex flex-col justify-center items-center w-8 h-8 focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          <span
            className={`w-6 h-px bg-white block transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-[2px]" : "-translate-y-1"
            }`}
          />
          <span
            className={`w-6 h-px bg-white block transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-[2px]" : "translate-y-1"
            }`}
          />
        </button>

        {/* Brand Logo Wordmark */}
        <Link 
          href="/" 
          className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase relative z-50 hover:opacity-80 transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          Elysian
        </Link>

        {/* Join Waitlist Button */}
        <Link
          href="/#waitlist-submit"
          onClick={handleWaitlistClick}
          className="text-[10px] md:text-xs uppercase tracking-widest border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer relative z-50"
        >
          Join In
        </Link>
      </header>

      {/* ── FULL-SCREEN OVERLAY MENU ── */}
      <div
        className={`fixed inset-0 z-[90] bg-black/95 backdrop-blur-md flex flex-col justify-between p-8 md:p-16 transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
        }`}
      >
        {/* Empty space at the top so it starts below the header bar */}
        <div className="h-16" />

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-6 md:space-y-8 my-auto">
          {[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Contact Us", href: "/contact" },
          ].map((link, idx) => (
            <div
              key={link.href}
              className={`overflow-hidden transition-all duration-500 transform ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${150 + idx * 100}ms` }}
            >
              <Link
                href={link.href}
                className="inline-block text-4xl md:text-6xl font-light tracking-[0.1em] uppercase text-white hover:italic hover:tracking-[0.12em] transition-all duration-300"
              >
                {link.label}
              </Link>
            </div>
          ))}
          
          <div
            className={`overflow-hidden transition-all duration-500 transform ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <Link
              href="/#waitlist-submit"
              onClick={handleWaitlistClick}
              className="inline-block text-4xl md:text-6xl font-light tracking-[0.1em] uppercase text-white/50 hover:text-white hover:italic hover:tracking-[0.12em] transition-all duration-300"
            >
              Join Waitlist
            </Link>
          </div>
        </nav>

        {/* Footer Area inside Navigation Overlay */}
        <div 
          className={`flex flex-col md:flex-row md:items-end justify-between border-t border-white/10 pt-6 transition-all duration-700 transform ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "550ms" }}
        >
          <div className="space-y-2 mb-6 md:mb-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Elysian — A Study in Modern Form.
            </p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Defined by silence. Presence before attention.
            </p>
          </div>

          <div className="flex space-x-8 text-[10px] uppercase tracking-widest text-white/40">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="https://journal.elysian.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Journal
            </a>
            <span className="text-white/20">© 2026</span>
          </div>
        </div>
      </div>
    </>
  );
}
