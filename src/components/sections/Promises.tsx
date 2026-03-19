"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "@/components/animations/FadeIn";

gsap.registerPlugin(ScrollTrigger);

const promises = [
  {
    number: "01",
    text: "Operations before technology. We fix your process on paper before we touch software.",
  },
  {
    number: "02",
    text: "Plain language. If we can't explain it without jargon, we haven't done our job.",
  },
  {
    number: "03",
    text: "We build it, we run it, we're here tomorrow. No install-and-abandon.",
  },
  {
    number: "04",
    text: "No surprises. Pricing is final. Scope is clear. Period.",
  },
  {
    number: "05",
    text: "We've done the work you're trying to automate. We've answered the phones, managed the intake, handled the follow-up. We know exactly what needs fixing.",
  },
];

// ─── Mobile: original stacked layout ──────────────────────────────────────────

function MobileLayout() {
  return (
    <section
      id="promises"
      className="section-padding light-section"
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "#F5F4EF",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <FadeIn>
          <h2
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "64px",
            }}
          >
            What We&apos;re Committed To — Every Time.
          </h2>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {promises.map((promise, i) => (
            <FadeIn key={i} delay={i * 0.08} y={30}>
              <div
                style={{
                  display: "flex",
                  gap: "40px",
                  alignItems: "flex-start",
                  padding: "32px 0",
                  borderBottom: i < promises.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "clamp(20px, 2vw, 28px)",
                    color: "var(--eucalyptus)",
                    lineHeight: 1,
                    flexShrink: 0,
                    minWidth: "36px",
                    paddingTop: "4px",
                  }}
                >
                  {promise.number}
                </span>
                <p
                  data-cursor="text"
                  style={{
                    fontFamily: "var(--font-instrument), serif",
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    color: "var(--text-primary)",
                    lineHeight: 1.4,
                  }}
                >
                  {promise.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Desktop: sticky scroll stack ─────────────────────────────────────────────

function DesktopLayout() {
  const outerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const outer = outerRef.current;
    if (!outer) return;

    // All cards start below viewport
    cardRefs.current.forEach((card) => {
      if (card) gsap.set(card, { y: "100vh" });
    });

    // Trigger zones — one per promise
    const triggers = zoneRefs.current.map((zone, i) => {
      if (!zone) return null;
      return ScrollTrigger.create({
        trigger: zone,
        start: "top center",
        once: false,
        onEnter: () => {
          const card = cardRefs.current[i];
          if (card) gsap.to(card, { y: 0, duration: 0.5, ease: "power2.out" });
        },
        onLeaveBack: () => {
          const card = cardRefs.current[i];
          if (card) gsap.to(card, { y: "100vh", duration: 0.4, ease: "power2.in" });
        },
      });
    });

    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <section
      id="promises"
      className="light-section"
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "#F5F4EF",
        position: "relative",
      }}
    >
      {/* Section heading — above the sticky scroll area */}
      <div style={{ padding: "80px 0 60px", position: "relative", zIndex: 1 }}>
        <div className="container">
          <FadeIn>
            <h2
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "clamp(32px, 4.5vw, 56px)",
                color: "var(--text-primary)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              What We&apos;re Committed To — Every Time.
            </h2>
          </FadeIn>
        </div>
      </div>

      {/* 5 × 80vh scroll container */}
      <div
        ref={outerRef}
        style={{ position: "relative", height: "calc(5 * 80vh)" }}
      >
        {/* Trigger zones — one per card, stacked vertically */}
        {promises.map((_, i) => (
          <div
            key={i}
            ref={(el) => { zoneRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: `${i * 20}%`,
              height: "20%",
              width: "100%",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Sticky container */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {promises.map((promise, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                background: "#F5F4EF",
                boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: i + 1,
              }}
            >
              {/* Ghost number — top right */}
              <div
                style={{
                  position: "absolute",
                  top: "48px",
                  right: "64px",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "80px",
                  color: "var(--text-primary)",
                  opacity: 0.06,
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {promise.number}
              </div>

              {/* Promise text — centered */}
              <p
                data-cursor="text"
                style={{
                  fontFamily: "var(--font-instrument), serif",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  color: "var(--text-primary)",
                  lineHeight: 1.4,
                  textAlign: "center",
                  maxWidth: "640px",
                  margin: "0 auto",
                  padding: "0 40px",
                }}
              >
                {promise.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Router ────────────────────────────────────────────────────────────────────

export default function Promises() {
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
  if (isMobile) return <MobileLayout />;
  return <DesktopLayout />;
}
