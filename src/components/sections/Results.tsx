"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "@/components/animations/FadeIn";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    label: "ASSESSMENT → CLARITY",
    stat: "13 hrs/wk",
    body: "A consulting firm owner completed an AI Readiness Assessment and identified three workflow gaps costing 13+ hours per week. Implementation took 11 days. The first month paid for the assessment 14 times over.",
    bg: "#1C1C1E",
    statColor: "#FAFAFA",
    textColor: "#A1A1AA",
  },
  {
    label: "IMPLEMENTATION → REVENUE",
    stat: "$4,200/mo",
    body: "A service business sending 40% of after-hours calls to voicemail deployed an AI voice agent. Within 30 days they recovered an estimated $4,200 per month in appointments that previously went unanswered.",
    bg: "#F5F4EF",
    statColor: "#1A1A1A",
    textColor: "#4A4A4A",
  },
  {
    label: "ADVISORY → SCALE",
    stat: "2% → 11%",
    body: "An owner relying on manual outreach added a scoped AI sales system after a diagnostic engagement. Visitor-to-booked-call conversion jumped from 2% to 11% in the first month.",
    bg: "#1C1C1E",
    statColor: "#FAFAFA",
    textColor: "#A1A1AA",
  },
];

// ─── Shared card content ────────────────────────────────────────────────────

function CardInner({ card, compact = false }: { card: typeof cards[0]; compact?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: compact ? "48px 32px" : "80px",
        textAlign: "center",
      }}
    >
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
          fontSize: "clamp(64px, 8vw, 96px)",
          color: card.statColor,
          lineHeight: 1,
          marginBottom: "40px",
        }}
      >
        {card.stat}
      </div>

      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: compact ? "16px" : "18px",
          color: card.textColor,
          maxWidth: "560px",
          lineHeight: 1.65,
        }}
      >
        {card.body}
      </p>
    </div>
  );
}

// ─── Desktop: scroll stack ──────────────────────────────────────────────────

function DesktopResults() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wrapper = wrapperRef.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    if (!wrapper || !card2 || !card3) return;

    gsap.set(card2, { y: "100%" });
    gsap.set(card3, { y: "100%" });

    const anim2 = gsap.fromTo(
      card2,
      { y: "100%" },
      {
        y: "0%",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: wrapper,
          start: "30% top",
          end: "45% top",
          scrub: 1,
        },
      }
    );

    const anim3 = gsap.fromTo(
      card3,
      { y: "100%" },
      {
        y: "0%",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: wrapper,
          start: "62% top",
          end: "77% top",
          scrub: 1,
        },
      }
    );

    return () => {
      anim2.scrollTrigger?.kill();
      anim3.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", height: "calc(3 * 100vh)" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Card 1 — visible from start */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: cards[0].bg,
            zIndex: 1,
          }}
        >
          <CardInner card={cards[0]} />
        </div>

        {/* Card 2 — slides up over Card 1 */}
        <div
          ref={card2Ref}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: cards[1].bg,
            zIndex: 2,
          }}
        >
          <CardInner card={cards[1]} />
        </div>

        {/* Card 3 — slides up over Card 2 */}
        <div
          ref={card3Ref}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: cards[2].bg,
            zIndex: 3,
          }}
        >
          <CardInner card={cards[2]} />
        </div>
      </div>
    </div>
  );
}

// ─── Mobile: stacked cards ──────────────────────────────────────────────────

function MobileResults() {
  return (
    <div>
      {cards.map((card, i) => (
        <FadeIn key={i} delay={0}>
          <div
            style={{
              backgroundColor: card.bg,
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardInner card={card} compact />
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// ─── Router ─────────────────────────────────────────────────────────────────

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

  return (
    <section
      id="results"
      className="light-section"
      style={{ borderTop: "1px solid var(--border)", backgroundColor: "#F5F4EF" }}
    >
      {/* Heading — above the scroll stack, light background */}
      <div className="container" style={{ padding: "140px 0 80px" }}>
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
            What Changes After We Work Together
          </h2>
        </FadeIn>
      </div>

      {mounted && (isMobile ? <MobileResults /> : <DesktopResults />)}
    </section>
  );
}
