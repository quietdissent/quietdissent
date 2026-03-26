"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "@/components/animations/FadeIn";
import SlotMachineNumber from "@/components/animations/SlotMachineNumber";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: 62,
    suffix: "%",
    label: "of calls to small businesses go unanswered after hours — each one a revenue opportunity handed to a competitor",
  },
  {
    value: 47,
    prefix: "$",
    suffix: "/hr",
    label: "average hourly cost of manual tasks your team performs today that existing AI handles reliably — and at a fraction of the rate",
  },
  {
    value: 23,
    suffix: " hrs",
    label: "hours per week the average SMB team spends on tasks that could be automated with existing technology",
  },
];

const listItems = [
  "Calls go unanswered. Leads go cold.",
  "Staff spend 13–15 hours weekly on automatable tasks.",
  "Decisions get made tool-by-tool, with no roadmap tying it together.",
  "You're investing in technology without knowing if it's the right technology.",
];

export default function Problem() {
  const borderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Animate divider
    if (dividerRef.current) {
      ScrollTrigger.create({
        trigger: dividerRef.current,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(dividerRef.current, { opacity: 1, duration: 0.6 });
        },
      });
    }

    // Staggered stat card entrance
    gsap.fromTo(
      ".stat-card",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".stat-card", start: "top 80%", once: true },
      }
    );

    // Animate stat card top borders
    borderRefs.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { scaleX: 0, transformOrigin: "left" });
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(el, { scaleX: 1, duration: 0.8, ease: "power3.out" });
        },
      });
    });
  }, []);

  return (
    <section
      id="problem"
      className="section-padding light-section"
      style={{ overflow: "hidden", backgroundColor: "#F5F4EF" }}
    >
      {/* Section divider */}
      <div
        ref={dividerRef}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "1px",
          background: "var(--border)",
          marginBottom: "80px",
          opacity: 0,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <FadeIn className="mb-16">
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
            The Real Cost of Running Without a Strategy
          </h2>
        </FadeIn>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px",
            marginBottom: "80px",
          }}
          className="stats-grid"
        >
          {stats.map((stat, i) => (
            <div key={i} className="stat-card" style={{ position: "relative", paddingTop: "24px" }}>
                {/* Animated top border */}
                <div
                  ref={(el) => { borderRefs.current[i] = el; }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background: "var(--eucalyptus)",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                  }}
                />

                {/* Stat number: Platinum (#E5E4E2) per spec */}
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "clamp(48px, 5.5vw, 72px)",
                    color: "var(--eucalyptus)",
                    lineHeight: 1,
                    marginBottom: "12px",
                    fontWeight: 500,
                  }}
                >
                  <SlotMachineNumber
                    value={stat.value}
                    prefix={stat.prefix || ""}
                    suffix={stat.suffix || ""}
                  />
                </div>
                <p
                  data-cursor="text"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {stat.label}
                </p>
            </div>
          ))}
        </div>

        {/* Body copy */}
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {/* Opening paragraph — italic, centered */}
          <FadeIn y={40}>
            <p
              data-cursor="text"
              style={{
                fontFamily: "var(--font-body), serif",
                fontSize: "20px",
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                textAlign: "center",
                marginBottom: "0",
              }}
            >
              You&apos;ve probably experimented with AI already — maybe ChatGPT, maybe a tool someone
              recommended. It helped a little. But nothing is connected. Nothing is consistent.
              Nobody is steering.
            </p>
          </FadeIn>

          {/* Divider */}
          <FadeIn delay={0.08} y={20}>
            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--border)",
                maxWidth: "120px",
                margin: "40px auto",
              }}
            />
          </FadeIn>

          {/* Left-aligned list */}
          <FadeIn delay={0.12} y={40}>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
              {listItems.map((item, i) => (
                <li
                  key={i}
                  data-cursor="text"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "16px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <span style={{ color: "var(--eucalyptus)", flexShrink: 0 }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Below-list paragraph — centered */}
          <FadeIn delay={0.18} y={40}>
            <p
              data-cursor="text"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "18px",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                textAlign: "center",
                maxWidth: "640px",
                margin: "48px auto 0",
              }}
            >
              The problem isn&apos;t that you haven&apos;t found the right tool. The problem is that
              nobody has shown you the full picture.
            </p>
          </FadeIn>

          {/* Emphasis line */}
          <FadeIn delay={0.24} y={40}>
            <p
              data-cursor="text"
              style={{
                fontFamily: "var(--font-body), serif",
                fontSize: "24px",
                color: "var(--text-primary)",
                lineHeight: 1.5,
                marginTop: "48px",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Most businesses don&apos;t have an AI problem. They have a strategy problem.
            </p>
          </FadeIn>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
