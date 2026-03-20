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
      "A diagnosis, not a sales pitch. A deliverable, not a deck.\n\nBefore we recommend a single tool, we learn your business. We visit your operation, map your workflows, quantify what your gaps are actually costing you, and deliver a written report you can act on — whether you hire us or not.\n\nThis is a real assessment with a real deliverable. You walk away with a clear picture of what's broken, what it's costing you, and exactly what to do about it.",
    whatYouGet: [
      "Revenue Leak Audit — Your missed calls, lost leads, after-hours gaps, and unproductive tasks quantified in dollars. Not estimates — your actual numbers.",
      "On-Site Workflow Discovery — We walk your operation in person. Phone triage, scheduling, handoffs, the unwritten rules no remote consultant would think to ask about.",
      "Staff & Culture Readiness — Who gets affected? How has your team responded to past tech changes? We identify resistance before it becomes a problem.",
      "Technical Environment Review — Your current software, phone system, CRM, and website. What connects easily, what needs workarounds, and any compliance flags.",
      "Quick-Win Roadmap — Prioritized recommendations ranked by ROI. Phase 1, Phase 2, Phase 3 — laid out clearly so you know the order to move in.",
      "ROI Projection — Conservative math: what you'll recover monthly, annually, and how long until the investment pays for itself.",
    ],
    howItRuns: [
      "30-minute intake call to understand your operation and confirm the assessment is the right fit.",
      "On-site visit (1–2 hours) to walk your actual process — not a survey, not a Zoom call.",
      "Written report delivered within 5 business days — plain language, no jargon, every finding backed by your numbers.",
      "Findings walkthrough — we sit with you and explain every recommendation. No open questions.",
    ],
    cta: "Book Your Assessment →",
    ctaHref: "#contact",
  },
  {
    label: "ENGAGEMENT 02",
    headline: "Systems Implementation",
    subline: "Custom-Scoped Build + Monthly Retainer",
    description:
      "From roadmap to working system — and someone who stays accountable for it.\n\nWe build the systems your assessment identified — AI voice agents, sales chatbots, CRM automation, inbox management, workflow integrations. Custom-configured around how your business actually operates, not how a template assumes it does.\n\nThen we stay. Every implementation includes ongoing monitoring, performance reporting, and tuning. You get a build partner and an operations partner in one engagement.",
    whatYouGet: [
      { header: "THE BUILD" },
      "Custom-built systems scoped to the specific gaps your assessment identified",
      "Full configuration — your voice, your rules, your workflows",
      "Tested and approved before anything goes live",
      "Staff walkthrough so your team knows exactly how the system works",
      { header: "THE RETAINER" },
      "Monthly performance reports — calls handled, leads captured, appointments booked, issues resolved",
      "Ongoing system tuning based on real usage data",
      "Direct access — no tickets, no account managers, no runaround",
      "Accountability for results — we stay because the system only works if someone's watching it",
    ],
    howItRuns: [
      "Assessment identifies which systems move the needle",
      "We scope and price the build transparently — 50% upfront, 50% at go-live",
      "Configuration and testing in week one",
      "Launch, monitoring, and staff training in week two",
      "Monthly retainer begins — you get reports, we stay accountable for outcomes",
    ],
    cta: "Discuss a Build →",
    ctaHref: "#contact",
  },
  {
    label: "ENGAGEMENT 03",
    headline: "Custom Builds & Fractional Chief AI Officer",
    subline: "Project-Based + Strategic Retainer",
    description:
      "For businesses that have outgrown standard implementations.\n\nSome problems don't fit a standard playbook. You need a custom AI agent built from scratch, a complex multi-system workflow, or strategic AI leadership that extends beyond any single project. This is that tier.\n\nWhether it's a one-off custom build or an ongoing seat at your leadership table, this is senior-level AI guidance — without the cost of a full-time executive hire.",
    whatYouGet: [
      { header: "CUSTOM BUILDS" },
      { intro: "When your needs go beyond off-the-shelf implementations, we build from scratch. Custom AI agents, complex multi-step workflows, proprietary automation logic — designed around your specific operation and integrated into your existing systems." },
      "Custom AI agents built for use cases that don't have a template",
      "Complex workflow automation — multi-system, multi-step, built to your logic",
      "Proprietary integrations connecting tools that weren't designed to talk to each other",
      "Scoped and priced per project — clear deliverables, clear timelines, no ambiguity",
      { header: "FRACTIONAL CHIEF AI OFFICER" },
      { intro: "This is the relationship that compounds. As your Fractional Chief AI Officer, I monitor your systems, identify new opportunities as your business grows, train your team, and serve as the strategic advisor you call before making any technology decision." },
      "Ongoing strategic guidance on AI adoption across your entire operation",
      "Monthly working sessions to review system performance and reprioritize",
      "Quarterly roadmap updates as your business evolves and new tools emerge",
      "Team training and change management — so your people actually use what we build",
      "Direct access — no tickets, no account managers. You call, I answer.",
      "Vendor and tool evaluation — I review before you buy, so you stop wasting money on tools that don't fit",
    ],
    howItRuns: [
      "Start with an AI Readiness Assessment (Engagement 01) or an existing implementation relationship",
      "Define strategic priorities for the next 90 days",
      "Monthly working sessions to review progress, adjust priorities, and plan builds",
      "Ongoing availability for decisions, builds, and the questions that come up between sessions",
      "Quarterly roadmap refresh — because the plan that made sense in January may not make sense in April",
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
              {card.whatYouGet.map((item, i) => {
                if (typeof item === "object" && "header" in item) {
                  return (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        color: t.sectionLabel,
                        marginTop: i > 0 ? "12px" : 0,
                      }}
                    >
                      {item.header}
                    </li>
                  );
                }
                if (typeof item === "object" && "intro" in item) {
                  return (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "14px",
                        color: t.body,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.intro}
                    </li>
                  );
                }
                return (
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
                    <span>{item as string}</span>
                  </li>
                );
              })}
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

// ─── Pricing block (shared) ───────────────────────────────────────────────────

function PricingBlock() {
  return (
    <div style={{ padding: "80px 0", borderTop: "1px solid var(--border)", backgroundColor: "#F5F4EF", position: "relative", zIndex: 1 }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: "center" }}>
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
  );
}

// ─── Section header (shared) ──────────────────────────────────────────────────

function SectionHeader() {
  return (
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
  );
}

export default function Solutions() {
  // Desktop GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Mobile carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Desktop only: GSAP horizontal pin
  useEffect(() => {
    if (!mounted || isMobile) return;
    if (!wrapperRef.current || !containerRef.current) return;

    const cardEls = gsap.utils.toArray<HTMLElement>(".service-card-desktop", containerRef.current);

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

  // Mobile only: track active card from scroll position
  useEffect(() => {
    if (!mounted || !isMobile) return;
    const el = carouselRef.current;
    if (!el) return;

    const onScroll = () => {
      // card width = 85vw, gap = 16px
      const cardSlot = window.innerWidth * 0.85 + 16;
      const idx = Math.round(el.scrollLeft / cardSlot);
      setActiveCard(Math.max(0, Math.min(idx, cards.length - 1)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [mounted, isMobile]);

  if (!mounted) return null;

  // Desktop dot colors adapt to dark/light card
  const isDarkCard = activeCard % 2 === 0;
  const dotActive = isDarkCard ? "rgba(255,255,255,0.8)" : "#1A1A1A";
  const dotInactive = isDarkCard ? "rgba(255,255,255,0.2)" : "rgba(26,26,26,0.2)";

  // ── Mobile layout ───────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section id="solutions" className="light-section" style={{ backgroundColor: "#F5F4EF" }}>
        <SectionHeader />

        {/* Native scroll-snap carousel */}
        <div
          ref={carouselRef}
          className="solutions-carousel"
          style={{
            display: "flex",
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            WebkitOverflowScrolling: "touch" as any,
            gap: "16px",
            padding: "0 16px 32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                width: "85vw",
                flexShrink: 0,
                scrollSnapAlign: "start",
              }}
            >
              <ServiceCard card={card} index={i} />
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            paddingBottom: "40px",
          }}
        >
          {cards.map((_, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i === activeCard ? "#5F8575" : "rgba(26,26,26,0.2)",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>

        <PricingBlock />

        <style>{`
          .solutions-carousel { scrollbar-width: none; }
          .solutions-carousel::-webkit-scrollbar { display: none; }
          @media (max-width: 768px) {
            .card-cols { grid-template-columns: 1fr !important; }
            .service-card-inner { padding: 40px 24px !important; }
          }
        `}</style>
      </section>
    );
  }

  // ── Desktop layout (GSAP pin — untouched) ──────────────────────────────────
  return (
    <section id="solutions" className="light-section" style={{ backgroundColor: "#F5F4EF", overflowX: "hidden" }}>
      <SectionHeader />

      <div
        ref={wrapperRef}
        data-cursor="drag"
        style={{ width: "100%", overflow: "hidden", position: "relative", zIndex: 1 }}
      >
        {/* Progress dashes */}
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
              className="service-card-desktop"
              style={{ width: "33.333%", flexShrink: 0, height: "100vh" }}
            >
              <ServiceCard card={card} index={i} fullHeight />
            </div>
          ))}
        </div>
      </div>

      <PricingBlock />

      <style>{`
        @media (max-width: 768px) {
          .card-cols { grid-template-columns: 1fr !important; }
          .service-card-inner { padding: 48px 24px !important; }
        }
      `}</style>
    </section>
  );
}
