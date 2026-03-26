"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: "62%",
    label: "of calls to small businesses go unanswered after hours",
    sub: "Each one a revenue opportunity handed to a competitor.",
  },
  {
    value: "$47/hr",
    label: "average hourly cost of manual tasks your team performs today",
    sub: "Existing AI handles them reliably — at a fraction of the rate.",
  },
  {
    value: "23 hrs",
    label: "per week the average SMB team spends on automatable tasks",
    sub: "That's more than half a full-time employee. Every single week.",
  },
];

const listItems = [
  "Calls go unanswered. Leads go cold.",
  "Staff spend 13–15 hours weekly on automatable tasks.",
  "Decisions get made tool-by-tool, with no roadmap tying it together.",
  "You're investing in technology without knowing if it's the right technology.",
];

// ─── Desktop: full-width pinned stat reveals ──────────────────────────────────

function DesktopLayout() {
  const outerRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const outer = outerRef.current;
    if (!outer) return;

    // All stat panels start below
    statRefs.current.forEach((el) => {
      if (el) gsap.set(el, { y: "100vh" });
    });

    // Create trigger zones — each 80vh tall
    const totalHeight = stats.length * 80; // vh units, set via style below

    const st = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: `+=${stats.length * window.innerHeight * 0.85}`,
      scrub: 0.6,
      pin: true,
      onUpdate: (self) => {
        const idx = Math.min(
          Math.floor(self.progress * stats.length),
          stats.length - 1
        );
        setActiveIndex(idx);

        statRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i < idx) {
            gsap.to(el, { y: "-100vh", duration: 0.4, ease: "power2.in", overwrite: true });
          } else if (i === idx) {
            gsap.to(el, { y: 0, duration: 0.5, ease: "power2.out", overwrite: true });
          } else {
            gsap.set(el, { y: "100vh" });
          }
        });
      },
    });

    return () => st.kill();
  }, []);

  // List items fade in after stats
  useEffect(() => {
    if (!listRef.current) return;
    gsap.fromTo(
      listRef.current.querySelectorAll(".list-item"),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: listRef.current, start: "top 75%", once: true },
      }
    );
  }, []);

  return (
    <>
      {/* Pinned stat section */}
      <div
        ref={outerRef}
        style={{ position: "relative", height: "100vh", overflow: "hidden", backgroundColor: "#F5F4EF" }}
      >
        {/* Progress dots */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "48px",
            display: "flex",
            gap: "8px",
            zIndex: 10,
          }}
        >
          {stats.map((_, i) => (
            <div
              key={i}
              style={{
                width: "24px",
                height: "2px",
                background: i === activeIndex ? "#5F8575" : "#D8D6D1",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Stat panels — stacked, each slides up over the previous */}
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={(el) => { statRefs.current[i] = el; }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: i % 2 === 0 ? "#F5F4EF" : "#EDECEA",
              padding: "0 48px",
              zIndex: i + 1,
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#5F8575",
                marginBottom: "32px",
              }}
            >
              The Problem
            </div>

            {/* Giant stat */}
            <div
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "clamp(80px, 14vw, 180px)",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: "#1A1A1A",
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              {stat.value}
            </div>

            {/* Label */}
            <p
              style={{
                fontFamily: "var(--font-body), serif",
                fontSize: "clamp(18px, 2.2vw, 26px)",
                color: "#1A1A1A",
                textAlign: "center",
                maxWidth: "640px",
                lineHeight: 1.3,
                marginBottom: "16px",
              }}
            >
              {stat.label}
            </p>

            {/* Sub */}
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "16px",
                color: "#7A7875",
                textAlign: "center",
                maxWidth: "480px",
                lineHeight: 1.6,
              }}
            >
              {stat.sub}
            </p>

            {/* Step counter */}
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                color: "#9A9691",
                letterSpacing: "0.15em",
              }}
            >
              {String(i + 1).padStart(2, "0")} / {String(stats.length).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>

      {/* List section — follows naturally after the pinned stats */}
      <div
        ref={listRef}
        style={{
          backgroundColor: "#F5F4EF",
          borderTop: "1px solid var(--border)",
          padding: "100px 0",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "clamp(24px, 3vw, 36px)",
                color: "#1A1A1A",
                lineHeight: 1.2,
                marginBottom: "48px",
                letterSpacing: "-0.02em",
              }}
            >
              Sound familiar?
            </div>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "20px" }}>
              {listItems.map((item, i) => (
                <li
                  key={i}
                  className="list-item"
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    fontFamily: "var(--font-body), serif",
                    fontSize: "20px",
                    color: "#4A4A4A",
                    lineHeight: 1.5,
                    paddingBottom: "20px",
                    borderBottom: i < listItems.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span
                    style={{
                      color: "#5F8575",
                      flexShrink: 0,
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "12px",
                      marginTop: "6px",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Mobile: stacked reveal ───────────────────────────────────────────────────

function MobileLayout() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.fromTo(
      ".stat-mobile",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".stat-mobile", start: "top 80%", once: true },
      }
    );
    gsap.fromTo(
      ".list-item-mobile",
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".list-item-mobile", start: "top 80%", once: true },
      }
    );
  }, []);

  return (
    <section
      id="problem"
      style={{ backgroundColor: "#F5F4EF", paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div className="container">
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#5F8575",
            marginBottom: "48px",
          }}
        >
          The Problem
        </div>

        {/* Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px", marginBottom: "64px" }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-mobile"
              style={{
                paddingBottom: "48px",
                borderBottom: i < stats.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-instrument), serif",
                  fontSize: "clamp(56px, 18vw, 96px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  color: "#1A1A1A",
                  marginBottom: "20px",
                }}
              >
                {stat.value}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body), serif",
                  fontSize: "18px",
                  color: "#1A1A1A",
                  lineHeight: 1.4,
                  marginBottom: "8px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "14px",
                  color: "#7A7875",
                  lineHeight: 1.6,
                }}
              >
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* List */}
        <div
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontSize: "22px",
            color: "#1A1A1A",
            lineHeight: 1.2,
            marginBottom: "32px",
          }}
        >
          Sound familiar?
        </div>

        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
          {listItems.map((item, i) => (
            <li
              key={i}
              className="list-item-mobile"
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "15px",
                color: "#4A4A4A",
                lineHeight: 1.5,
                paddingBottom: "16px",
                borderBottom: i < listItems.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ color: "#5F8575", flexShrink: 0 }}>—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default function Problem() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted) return null;
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
