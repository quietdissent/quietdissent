"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import ShinyText from "@/components/animations/ShinyText";

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

// ─── Mobile: sticky scroll-driven reveal ─────────────────────────────────────

function MobileLayout({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stmt1Ref = useRef<HTMLDivElement>(null);
  const stmt2Ref = useRef<HTMLDivElement>(null);
  const stmt3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const outer = outerRef.current;
    const s1 = stmt1Ref.current;
    const s2 = stmt2Ref.current;
    const s3 = stmt3Ref.current;
    if (!outer || !s1 || !s2 || !s3) return;

    // Set initial visibility: only statement 1 visible
    gsap.set(s1, { opacity: 1, y: 0 });
    gsap.set(s2, { opacity: 0, y: 20 });
    gsap.set(s3, { opacity: 0, y: 20 });

    // Build scrub timeline — duration normalised to 1.0
    // Transition 1 (~33% scroll): fade stmt1 out, fade stmt2 in
    // Transition 2 (~66% scroll): fade stmt2 out, fade stmt3 in
    const tl = gsap.timeline();
    tl.fromTo(s1, { opacity: 1, y: 0 }, { opacity: 0, y: -20, duration: 0.06, ease: "power1.in" }, 0.30)
      .fromTo(s2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.06, ease: "power1.out" }, 0.30)
      .fromTo(s2, { opacity: 1, y: 0 }, { opacity: 0, y: -20, duration: 0.06, ease: "power1.in" }, 0.63)
      .fromTo(s3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.06, ease: "power1.out" }, 0.63)
      // Anchor end so timeline duration == 1.0
      .to({}, { duration: 0.01 }, 0.99);

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      animation: tl,
    });

    return () => {
      trigger.kill();
      tl.kill();
      gsap.set([s1, s2, s3], { clearProps: "all" });
    };
  }, []);

  const slotStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 24px",
  };

  return (
    <section
      id="how-ai-works"
      className="light-section"
      style={{ borderTop: "1px solid var(--border)", backgroundColor: "#F5F4EF" }}
    >
      {/* 250vh scroll container — sticky panel reveals statements one at a time */}
      <div ref={outerRef} style={{ minHeight: "250vh", position: "relative" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Statement 1 */}
          <div ref={stmt1Ref} style={slotStyle}>
            <div
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "clamp(32px, 6vw, 56px)",
                textAlign: "center",
              }}
            >
              <ShinyText
                text="AI Is Making Time to Be Human Again"
                color="#1A1A1A"
                shineColor="#5F8575"
                speed={5}
                spread={100}
              />
            </div>
          </div>

          {/* Statement 2 */}
          <div ref={stmt2Ref} style={slotStyle}>
            <div
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontStyle: "italic",
                fontSize: "clamp(22px, 4vw, 40px)",
                textAlign: "center",
              }}
            >
              <ShinyText
                text="We reduce friction without adding complexity."
                color="#4A4A4A"
                shineColor="#ffffff"
                speed={6}
                spread={110}
              />
            </div>
          </div>

          {/* Statement 3 */}
          <div ref={stmt3Ref} style={slotStyle}>
            <div
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontStyle: "italic",
                fontSize: "clamp(18px, 3.5vw, 32px)",
                textAlign: "center",
                maxWidth: "600px",
              }}
            >
              <ShinyText
                text="Let us find where innovation is sleeping within your operation."
                color="#6B6B6B"
                shineColor="#E5E4E2"
                speed={7}
                spread={120}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toggle panel — below the scroll reveal */}
      <div className="section-padding">
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

// ─── Desktop: statements + toggle ────────────────────────────────────────────

function DesktopLayout({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
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

    // Trigger zones — one per statement
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
      id="how-ai-works"
      className="light-section"
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "#F5F4EF",
        position: "relative",
      }}
    >
      {/* 3 × 80vh scroll container */}
      <div
        ref={outerRef}
        style={{ position: "relative", height: "calc(3 * 80vh)" }}
      >
        {/* Trigger zones — one per statement, stacked vertically */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => { zoneRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: `${i * 33.33}%`,
              height: "33.33%",
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
          {/* Statement 1 */}
          <div
            ref={(el) => { cardRefs.current[0] = el; }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#F5F4EF",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "clamp(40px, 6vw, 72px)",
                textAlign: "center",
                padding: "0 40px",
              }}
            >
              <ShinyText
                text="AI Is Making Time to Be Human Again"
                color="#1A1A1A"
                shineColor="#5F8575"
                speed={5}
                spread={100}
              />
            </div>
          </div>

          {/* Statement 2 */}
          <div
            ref={(el) => { cardRefs.current[1] = el; }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#F5F4EF",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontStyle: "italic",
                fontSize: "clamp(32px, 5vw, 60px)",
                textAlign: "center",
                padding: "0 40px",
              }}
            >
              <ShinyText
                text="We reduce friction without adding complexity."
                color="#4A4A4A"
                shineColor="#ffffff"
                speed={6}
                spread={110}
              />
            </div>
          </div>

          {/* Statement 3 */}
          <div
            ref={(el) => { cardRefs.current[2] = el; }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#F5F4EF",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontStyle: "italic",
                fontSize: "clamp(22px, 3.5vw, 44px)",
                textAlign: "center",
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              <ShinyText
                text="Let us find where innovation is sleeping within your operation."
                color="#6B6B6B"
                shineColor="#E5E4E2"
                speed={7}
                spread={120}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toggle section */}
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
