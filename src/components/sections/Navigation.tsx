"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Solutions", href: "#solutions" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contactActive, setContactActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 80);
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hero = document.querySelector("#hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsLight(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const contact = document.querySelector("#contact");
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactActive(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (_e: React.MouseEvent<HTMLAnchorElement>, _href: string) => {
    setMenuOpen(false);
  };

  const bg = isLight
    ? scrolled ? "#F5F4EF" : "transparent"
    : scrolled ? "rgba(17,17,17,0.93)" : "transparent";

  const borderColor = isLight
    ? scrolled ? "#D8D6D1" : "transparent"
    : scrolled ? "rgba(255,255,255,0.06)" : "transparent";

  const wordmarkColor = isLight ? "#1A1A1A" : "#FFFFF0";
  const linkColor = isLight ? "#7A7875" : "rgba(255,255,240,0.45)";
  const linkHover = isLight ? "#1A1A1A" : "#FFFFF0";

  const bookBorder = isLight ? "#D8D6D1" : "rgba(255,255,240,0.3)";
  const bookColor = isLight ? "#4A4A4A" : "rgba(255,255,240,0.7)";
  const bookHoverBg = "#5F8575";
  const bookHoverColor = "#FFFFFF";

  return (
    <>
      {scrolled && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "2px",
            background: "transparent",
            zIndex: 10000,
          }}
        >
          <div
            ref={progressRef}
            style={{
              height: "100%",
              width: `${scrollProgress}%`,
              background: "#5F8575",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      )}

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          padding: "20px 0",
          background: bg,
          backdropFilter: scrolled && !isLight ? "blur(12px)" : "none",
          borderBottom: `1px solid ${borderColor}`,
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <img
              src="/QD_Logo.png"
              alt=""
              aria-hidden="true"
              style={{
                height: "36px",
                width: "auto",
                filter: isLight
                  ? "brightness(0)"
                  : "brightness(0) invert(1)",
                transition: "filter 0.4s ease",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontStyle: "italic",
                fontSize: "20px",
                color: wordmarkColor,
                letterSpacing: "-0.01em",
                transition: "color 0.4s ease",
              }}
            >
              Quiet Dissent
            </span>
          </a>

          <div className="hidden md:flex" style={{ alignItems: "center", gap: "32px" }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: link.label === "Contact" && contactActive ? "#b35a44" : linkColor,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = link.label === "Contact" && contactActive ? "#b35a44" : linkColor)}
              >
                {link.label}
              </a>
            ))}

            <motion.a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: bookColor,
                padding: "8px 20px",
                border: `1px solid ${bookBorder}`,
                borderRadius: "4px",
                transition: "all 0.3s ease",
              }}
              whileHover={{
                background: bookHoverBg,
                color: bookHoverColor,
                borderColor: bookHoverBg,
              }}
            >
              Start with a Diagnostic
            </motion.a>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "flex", flexDirection: "column", gap: "5px", padding: "8px" }}
            aria-label="Toggle menu"
          >
            {[
              menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 },
              menuOpen ? { opacity: 0 } : { opacity: 1 },
              menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 },
            ].map((anim, i) => (
              <motion.span
                key={i}
                animate={anim}
                style={{
                  display: "block",
                  width: "22px",
                  height: "1px",
                  background: wordmarkColor,
                  transformOrigin: "center",
                  transition: "background 0.4s ease",
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              background: isLight ? "#F5F4EF" : "#111111",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  fontFamily: "var(--font-instrument), serif",
                  fontSize: "clamp(32px, 8vw, 48px)",
                  color: isLight ? "#4A4A4A" : "rgba(255,255,240,0.7)",
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

