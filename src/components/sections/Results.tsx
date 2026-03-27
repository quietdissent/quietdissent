"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    label: "ASSESSMENT → CLARITY",
    stat: "13 hrs/wk",
    text: "A consulting firm owner completed an AI Readiness Assessment and identified three workflow gaps costing 13+ hours per week. Implementation took 11 days. The first month paid for the assessment 14 times over.",
    bg: "#111111",
    dark: true,
  },
  {
    label: "IMPLEMENTATION → REVENUE",
    stat: "$4,200/mo",
    text: "A service business sending 40% of after-hours calls to voicemail deployed an AI voice agent. Within 30 days they recovered an estimated $4,200 per month in appointments that previously went unanswered.",
    bg: "#F5F4EF",
    dark: false,
  },
  {
    label: "ADVISORY → SCALE",
    stat: "2% → 11%",
    text: "An owner relying on manual outreach added a scoped AI sales system after a diagnostic engagement. Visitor-to-booked-call conversion jumped from 2% to 11% in the first month.",
    bg: "#1C1C1E",
    dark: true,
  },
];

// ─── Desktop: thetinypod-style sticky stacked cards ───────────────────────────
// Each card is sticky at top:0. The next card slides up over the previous one
// as you scroll — exactly how thetinypod stacks its product views.

function DesktopLayout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cardEls = gsap.utils.toArray<HTMLElement>(".result-card-sticky");

    // Cards are CSS sticky — ScrollTrigger only tracks active index
    cardEls.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        end: "bottom top",
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      });
    });

    return () => ScrollTrigger.getAll()
      .filter(st => st.vars.trigger && (st.vars.trigger as HTMLElement).classList?.contains("result-card-sticky"))
      .forEach(st => st.kill());
  }, []);

  return (
    <section
      id="results"
      ref={sectionRef}
      style={{ position: "relative" }}
    >
      {/* Section heading — sits above the stacked cards */}
      <div
        style={{
          backgroundColor: "#F5F4EF",
          borderTop: "1px solid var(--border)",
          padding: "80px 0 60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container">
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#5F8575",
              marginBottom: "20px",
            }}
          >
            Results
          </div>
          <h2
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            What Changes After We Work Together
          </h2>
        </div>
      </div>

      {/* Stacked sticky cards */}
      {cards.map((card, i) => (
        <div
          key={i}
          className="result-card-sticky"
          style={{
            height: "100vh",
            backgroundColor: card.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "sticky",
            top: 0,
            zIndex: i + 2,
          }}
        >
          {/* Progress indicator */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "48px",
              display: "flex",
              gap: "8px",
            }}
          >
            {cards.map((_, j) => (
              <div
                key={j}
                style={{
                  width: "24px",
                  height: "2px",
                  background: j === i
                    ? "#5F8575"
                    : card.dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>

          <div
            className="container"
            style={{
              maxWidth: "860px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "center",
            }}
          >
            {/* Left: stat */}
            <div>
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
                {card.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-instrument), serif",
                  fontSize: "clamp(60px, 9vw, 120px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  color: card.dark ? "#FFFFF0" : "#1A1A1A",
                }}
              >
                {card.stat}
              </div>
            </div>

            {/* Right: narrative */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body), serif",
                  fontSize: "20px",
                  lineHeight: 1.65,
                  color: card.dark ? "rgba(255,255,240,0.65)" : "#4A4A4A",
                }}
              >
                {card.text}
              </p>
            </div>
          </div>

          {/* Bottom counter */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: card.dark ? "rgba(255,255,240,0.25)" : "rgba(0,0,0,0.2)",
            }}
          >
            {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
          </div>
        </div>
      ))}
    </section>
  );
}

// ─── Mobile: clean stacked scroll ─────────────────────────────────────────────

function MobileLayout() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.fromTo(
      ".result-card-mobile",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".result-card-mobile", start: "top 80%", once: true },
      }
    );
  }, []);

  return (
    <section id="results" style={{ borderTop: "1px solid var(--border)" }}>
      <div
        style={{
          backgroundColor: "#F5F4EF",
          padding: "60px 0 40px",
        }}
      >
        <div className="container">
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#5F8575",
              marginBottom: "16px",
            }}
          >
            Results
          </div>
          <h2
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontSize: "clamp(28px, 6vw, 40px)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            What Changes After We Work Together
          </h2>
        </div>
      </div>

      {cards.map((card, i) => (
        <div
          key={i}
          className="result-card-mobile"
          style={{
            backgroundColor: card.bg,
            padding: "60px 24px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#5F8575",
              marginBottom: "24px",
            }}
          >
            {card.label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontSize: "clamp(48px, 14vw, 80px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: card.dark ? "#FFFFF0" : "#1A1A1A",
              marginBottom: "28px",
            }}
          >
            {card.stat}
          </div>
          <p
            style={{
              fontFamily: "var(--font-body), serif",
              fontSize: "17px",
              lineHeight: 1.65,
              color: card.dark ? "rgba(255,255,240,0.65)" : "#4A4A4A",
              maxWidth: "480px",
            }}
          >
            {card.text}
          </p>
        </div>
      ))}
    </section>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default function Results() {
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
