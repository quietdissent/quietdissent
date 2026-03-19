"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import MagneticButton from "@/components/animations/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    label: "ENGAGEMENT 01",
    headline: "AI Readiness Assessment",
    subline: "$500 · The Starting Point",
    description:
      "Before we touch a single tool, we learn your business. We map your workflows, identify your revenue leaks, and deliver a plain-language roadmap: here's where AI makes sense, here's where it doesn't, and here's the order to move in.\n\nThis is not a sales pitch dressed as a consultation. It's a real assessment with a real deliverable.",
    whatYouGet: [
      "A precise map of operational gaps and their cost",
      "Prioritized recommendations ranked by ROI",
      "A plain-language roadmap — no jargon",
      "Clarity on what to build, buy, or ignore",
    ],
    howItRuns: [
      "30-minute intake call to understand your operation",
      "We audit your workflows, tools, and time allocation",
      "Identify the highest-leverage gaps in your system",
      "Deliver written findings with projected ROI per fix",
      "Walk you through every finding — no open questions",
    ],
    cta: "Book Your Assessment →",
    ctaHref: "#contact",
  },
  {
    label: "ENGAGEMENT 02",
    headline: "Systems Implementation",
    subline: "From Roadmap to Working System",
    description:
      "We build the systems your assessment identified — AI voice agents, sales chatbots, CRM automation, inbox management, workflow integrations. Custom-configured around how your business actually operates, not how a template assumes it does. Most clients are live within two weeks of signing.",
    whatYouGet: [
      "Custom-built systems scoped to your specific gaps",
      "Full configuration — your voice, rules, workflows",
      "Tested and approved before anything goes live",
      "Weekly performance reports and ongoing tuning",
    ],
    howItRuns: [
      "Assessment identifies which systems move the needle",
      "We scope and price the build transparently",
      "Configuration and testing in week one",
      "Launch, monitoring, and tuning in week two",
      "You get reports — we stay accountable for results",
    ],
    cta: "Discuss a Build →",
    ctaHref: "#contact",
  },
  {
    label: "ENGAGEMENT 03",
    headline: "Fractional Chief AI Officer",
    subline: "Your Ongoing Strategic Partner",
    description:
      "This is where the real value compounds. As your Fractional Chief AI Officer, we monitor your systems, train your team, identify new opportunities as your business grows, and serve as the strategic advisor you call before making any technology decision.\n\nSenior-level AI leadership — without the cost of a full-time executive hire.",
    whatYouGet: [
      "Ongoing strategic guidance on AI adoption",
      "Monthly operational reviews and prioritization",
      "Direct access — no tickets, no account managers",
      "A partner who stays accountable for outcomes",
    ],
    howItRuns: [
      "Start with an AI Readiness Assessment",
      "Define strategic priorities for the next 90 days",
      "Monthly working sessions to review progress",
      "Ongoing availability for decisions and builds",
      "Quarterly roadmap updates as the business evolves",
    ],
    cta: "Explore Advisory →",
    ctaHref: "#contact",
  },
];


const cardThemes = [
  {
    bg: "#1C1C1E",
    headline: "#FAFAFA",
    body: "#A1A1AA",
    sectionLabel: "rgba(255,255,255,0.35)",
    stepNum: "#E5E4E2",
    ctaColor: "#E5E4E2",
    ctaBorder: "#E5E4E2",
    ctaHover: "rgba(229,228,226,0.1)",
  },
  {
    bg: "#F5F4EF",
    headline: "#1A1A1A",
    body: "#4A4A4A",
    sectionLabel: "#9A9691",
    stepNum: "#5F8575",
    ctaColor: "#1A1A1A",
    ctaBorder: "#1A1A1A",
    ctaHover: "rgba(26,26,26,0.06)",
  },
  {
    bg: "#1C1C1E",
    headline: "#FAFAFA",
    body: "#A1A1AA",
    sectionLabel: "rgba(255,255,255,0.35)",
    stepNum: "#E5E4E2",
    ctaColor: "#E5E4E2",
    ctaBorder: "#E5E4E2",
    ctaHover: "rgba(229,228,226,0.1)",
  },
];

function ServiceCard({
  card,
  index,
  fullHeight,
}: {
  card: typeof cards[0];
  index: number;
  fullHeight?: boolean;
}) {
  const t = cardThemes[index];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: t.bg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
          padding: fullHeight ? "100px 80px" : "60px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          flex: 1,
        }}
        className="service-card-inner"
      >
        {/* Service label */}
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#5F8575",
          }}
        >
          {card.label}
        </div>

        {/* Headline */}
        <h3
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontSize: "clamp(28px, 3.5vw, 52px)",
            color: t.headline,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "640px",
          }}
        >
          {card.headline}
        </h3>

        {/* Subline */}
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "12px",
            color: "#5F8575",
            letterSpacing: "1px",
            marginTop: "-16px",
          }}
        >
          {card.subline}
        </div>

        {/* Description */}
        <div style={{ maxWidth: "560px" }}>
          {card.description.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-body), serif",
                fontSize: "18px",
                color: t.body,
                lineHeight: 1.65,
                marginBottom: i < card.description.split("\n\n").length - 1 ? "16px" : 0,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Two columns */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}
          className="card-cols"
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: t.sectionLabel,
                marginBottom: "16px",
              }}
            >
              What You Get
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {card.whatYouGet.map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "14px",
                    color: t.body,
                    lineHeight: 1.4,
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#5F8575", flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: t.sectionLabel,
                marginBottom: "16px",
              }}
            >
              How It Runs
            </div>
            <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {card.howItRuns.map((step, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "14px",
                    color: t.body,
                    display: "flex",
                    gap: "12px",
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      color: t.stepNum,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {fullHeight && <div style={{ flex: 1 }} />}

        {/* CTA */}
        <div>
          <MagneticButton>
            <motion.a
              href={card.ctaHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                color: t.ctaColor,
                border: `1px solid ${t.ctaBorder}`,
                padding: "14px 28px",
                borderRadius: "4px",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
              }}
              whileHover={{ background: t.ctaHover }}
            >
              {card.cta}
            </motion.a>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}

export default function Solutions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!mounted || isMobile) return;
    if (!wrapperRef.current || !containerRef.current) return;

    const cardEls = gsap.utils.toArray<HTMLElement>(".service-card", containerRef.current);

    const tween = gsap.to(cardEls, {
      xPercent: -100 * (cardEls.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: wrapperRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (cardEls.length - 1),
        end: () => "+=" + wrapperRef.current!.offsetWidth,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * cardEls.length),
            cardEls.length - 1
          );
          setActiveCard(idx);
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [mounted, isMobile]);

  if (!mounted) return null;

  const isDarkCard = activeCard % 2 === 0;
  const dotActive = isDarkCard ? "rgba(255,255,255,0.8)" : "#1A1A1A";
  const dotInactive = isDarkCard ? "rgba(255,255,255,0.2)" : "rgba(26,26,26,0.2)";

  return (
    <section id="solutions" className="light-section" style={{ backgroundColor: "#F5F4EF", overflowX: "hidden" }}>
      {/* Section header */}
      <div style={{ padding: "120px 0 60px", borderTop: "1px solid var(--border)", position: "relative", zIndex: 1 }}>
        <div className="container">
          <FadeIn>
            <h2
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "clamp(32px, 4.5vw, 56px)",
                color: "var(--text-primary)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Three Ways We Work Together
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body), serif",
                fontSize: "19px",
                color: "var(--text-secondary)",
              }}
            >
              Starting wherever you are. Staying as long as it matters.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Horizontal scroll — desktop */}
      {!isMobile && (
        <div
          ref={wrapperRef}
          data-cursor="drag"
          style={{ width: "100%", overflow: "hidden", position: "relative", zIndex: 1 }}
        >
          {/* Progress dots */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              right: "40px",
              display: "flex",
              gap: "8px",
              zIndex: 10,
            }}
          >
            {cards.map((_, i) => (
              <div
                key={i}
                style={{
                  width: "24px",
                  height: "2px",
                  background: i === activeCard ? dotActive : dotInactive,
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>

          <div
            ref={containerRef}
            style={{ display: "flex", width: "300%" }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                className="service-card"
                style={{ width: "33.333%", flexShrink: 0, height: "100vh" }}
              >
                <ServiceCard card={card} index={i} fullHeight />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile: stacked */}
      {isMobile && (
        <div style={{ position: "relative", zIndex: 1 }}>
          {cards.map((card, i) => (
            <div key={i}>
              <ServiceCard card={card} index={i} fullHeight={false} />
            </div>
          ))}
        </div>
      )}

      {/* Pricing */}
      <div style={{ padding: "80px 0", borderTop: "1px solid var(--border)", backgroundColor: "#F5F4EF", position: "relative", zIndex: 1 }}>
        <div className="container">
          <FadeIn>
            <div style={{ textAlign: "center" }}>
              {/* Typographic menu */}
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {[
                  ["AI Readiness Assessment", "$500 flat"],
                  ["Systems Implementation", "Scoped per engagement"],
                  ["Fractional Chief AI Officer", "From $1,500/month"],
                ].map(([service, price], i) => (
                  <div
                    key={service}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      padding: "28px 0",
                      borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-instrument), serif",
                        fontSize: "24px",
                        color: "var(--text-primary)",
                        textAlign: "left",
                      }}
                    >
                      {service}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "18px",
                        color: "var(--text-secondary)",
                        textAlign: "right",
                        flexShrink: 0,
                        marginLeft: "24px",
                      }}
                    >
                      {price}
                    </span>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontFamily: "var(--font-instrument), serif",
                  fontStyle: "italic",
                  fontSize: "18px",
                  color: "var(--text-muted)",
                  marginTop: "40px",
                  marginBottom: "40px",
                }}
              >
                Every engagement starts with a conversation — not a proposal.
              </p>
              <MagneticButton>
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--eucalyptus)",
                    color: "#FFFFFF",
                    padding: "16px 32px",
                    borderRadius: "4px",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "15px",
                    fontWeight: 500,
                    textDecoration: "none",
                    marginBottom: "16px",
                  }}
                  whileHover={{ background: "#4A7065" }}
                >
                  Book a Free Strategy Session →
                </motion.a>
              </MagneticButton>
              <div style={{ marginTop: "16px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}
                >
                  Nashville-based. Founder-led. You talk to the same person who does the work.
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .card-cols { grid-template-columns: 1fr !important; }
          .service-card-inner { padding: 48px 24px !important; }
        }
      `}</style>
    </section>
  );
}
