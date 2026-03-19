"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const panelContent = {
  deterministic: {
    label: "RULE-BASED · PREDICTABLE · REPEATABLE",
    heading: "Deterministic AI",
    description:
      "These systems replace manual processes with reliable automation. The output is always consistent — no interpretation required.",
    items: [
      "Trigger-based automations",
      "Scheduling and routing",
      "Conditional workflows",
      "Data transformation",
    ],
  },
  probabilistic: {
    label: "ADAPTIVE · CONTEXTUAL · GENERATIVE",
    heading: "Probabilistic AI",
    description:
      "These systems augment human judgment and create capacity where none existed. They handle the nuanced work that used to require a person.",
    items: [
      "Conversational interfaces",
      "Content generation",
      "Classification and summarization",
      "Pattern recognition",
    ],
  },
} as const;

type Tab = keyof typeof panelContent;

const statements = [
  {
    text: "We reduce friction without adding complexity.",
    style: {
      fontFamily: "var(--font-instrument), serif",
      fontStyle: "italic" as const,
      fontSize: "clamp(36px, 5.5vw, 68px)",
      color: "var(--text-primary)",
      lineHeight: 1.2,
      textAlign: "center" as const,
      maxWidth: "880px",
      margin: "0 auto",
    },
  },
  {
    text: "AI Is Making Time to Be Human Again",
    style: {
      fontFamily: "var(--font-instrument), serif",
      fontSize: "clamp(40px, 6vw, 72px)",
      color: "var(--text-primary)",
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
      textAlign: "center" as const,
      maxWidth: "880px",
      margin: "0 auto",
    },
  },
  {
    text: "Let us find where innovation is sleeping within your operation.",
    style: {
      fontFamily: "var(--font-instrument), serif",
      fontStyle: "italic" as const,
      fontSize: "clamp(28px, 4vw, 52px)",
      color: "var(--text-secondary)",
      lineHeight: 1.3,
      textAlign: "center" as const,
      maxWidth: "800px",
      margin: "0 auto",
    },
  },
];

// ─── Toggle panel (shared between layouts) ───────────────────────────────────

function TogglePanel({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  const content = panelContent[active];

  return (
    <>
      {/* Intro paragraph */}
      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "18px",
          color: "var(--text-secondary)",
          maxWidth: "640px",
          lineHeight: 1.65,
          textAlign: "center",
          margin: "0 auto",
        }}
      >
        Most people experience AI as a tool they use occasionally. What&apos;s actually happening
        beneath the surface is two fundamentally different kinds of intelligence — each solving a
        different problem. Understanding the distinction is the difference between buying software
        and building a system.
      </p>

      {/* Prompt line */}
      <div
        style={{
          textAlign: "center",
          marginTop: "48px",
          marginBottom: "16px",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "12px",
          color: "var(--text-muted)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Select a Type to Explore →
      </div>

      {/* Toggle pills */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            border: "1px solid var(--border)",
            borderRadius: "100px",
            padding: "4px",
            gap: "4px",
          }}
        >
          {(["deterministic", "probabilistic"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                background: active === tab ? "#5F8575" : "transparent",
                color: active === tab ? "#fff" : "var(--text-muted)",
                border: active === tab ? "none" : "1px solid transparent",
                borderRadius: "100px",
                padding: "10px 28px",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.3s ease, color 0.3s ease",
                letterSpacing: "0.01em",
              }}
            >
              {tab === "deterministic" ? "Deterministic" : "Probabilistic"}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div
        style={{
          width: "100%",
          minHeight: "320px",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "60px",
          background: "var(--bg-secondary)",
          overflow: "hidden",
        }}
        className="ai-panel"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.15, ease: "easeOut" } }}
            exit={{ opacity: 0, x: -10, transition: { duration: 0.2, ease: "easeIn" } }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--eucalyptus)",
                marginBottom: "20px",
              }}
            >
              {content.label}
            </div>

            <h3
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "40px",
                color: "var(--text-primary)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              {content.heading}
            </h3>

            <p
              data-cursor="text"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "18px",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                lineHeight: 1.6,
                marginBottom: "36px",
              }}
            >
              {content.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 48px",
              }}
              className="ai-items-grid"
            >
              {content.items.map((item) => (
                <div
                  key={item}
                  style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}
                >
                  <span style={{ color: "var(--eucalyptus)", flexShrink: 0, lineHeight: 1.5 }}>—</span>
                  <span
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "16px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── Mobile: stacked layout ──────────────────────────────────────────────────

function MobileLayout({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  return (
    <section
      id="how-ai-works"
      className="section-padding light-section"
      style={{ borderTop: "1px solid var(--border)", backgroundColor: "#F5F4EF" }}
    >
      <div className="container">
        {statements.map((stmt, i) => (
          <FadeIn key={i} delay={0} y={40}>
            <div style={{ marginBottom: "64px" }}>
              <p style={stmt.style}>{stmt.text}</p>
            </div>
          </FadeIn>
        ))}

        <TogglePanel active={active} setActive={setActive} />
      </div>

      <style>{`
        @media (max-width: 640px) {
          .ai-panel { padding: 32px 24px !important; }
          .ai-items-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Desktop: scroll stack ───────────────────────────────────────────────────

function DesktopLayout({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const outer = outerRef.current;
    if (!outer) return;

    // Card 0 is visible from the start; cards 1 and 2 start off-screen below
    if (cardRefs.current[0]) gsap.set(cardRefs.current[0], { y: 0 });
    if (cardRefs.current[1]) gsap.set(cardRefs.current[1], { y: "100vh" });
    if (cardRefs.current[2]) gsap.set(cardRefs.current[2], { y: "100vh" });

    // Zones 0 and 1 in zoneRefs trigger cards 1 and 2 respectively
    const triggers = [0, 1].map((i) => {
      const zone = zoneRefs.current[i];
      const card = cardRefs.current[i + 1];
      if (!zone || !card) return null;
      return ScrollTrigger.create({
        trigger: zone,
        start: "top center",
        once: false,
        onEnter: () => {
          gsap.to(card, { y: 0, duration: 0.5, ease: "power2.out" });
        },
        onLeaveBack: () => {
          gsap.to(card, { y: "100vh", duration: 0.4, ease: "power2.in" });
        },
      });
    });

    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <section
      id="how-ai-works"
      className="light-section"
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "#F5F4EF",
        position: "relative",
      }}
    >
      {/* Statement scroll stack — 3 × 100vh */}
      <div
        ref={outerRef}
        style={{ position: "relative", height: "calc(3 * 100vh)" }}
      >
        {/* Trigger zone for card 1 (fires at 33% of wrapper) */}
        <div
          ref={(el) => { zoneRefs.current[0] = el; }}
          style={{
            position: "absolute",
            top: "33.33%",
            height: "33.33%",
            width: "100%",
            pointerEvents: "none",
          }}
        />
        {/* Trigger zone for card 2 (fires at 66% of wrapper) */}
        <div
          ref={(el) => { zoneRefs.current[1] = el; }}
          style={{
            position: "absolute",
            top: "66.66%",
            height: "33.34%",
            width: "100%",
            pointerEvents: "none",
          }}
        />

        {/* Sticky container */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {statements.map((stmt, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#F5F4EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 40px",
                zIndex: i + 1,
              }}
            >
              <p style={stmt.style}>{stmt.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle section — normal scroll below the stack */}
      <div style={{ padding: "160px 0" }}>
        <div className="container">
          <TogglePanel active={active} setActive={setActive} />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .ai-panel { padding: 32px 24px !important; }
          .ai-items-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Router ──────────────────────────────────────────────────────────────────

export default function HowAIWorks() {
  const [active, setActive] = useState<Tab>("deterministic");
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
  if (isMobile) return <MobileLayout active={active} setActive={setActive} />;
  return <DesktopLayout active={active} setActive={setActive} />;
}
