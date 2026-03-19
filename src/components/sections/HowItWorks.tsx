"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "@/components/animations/FadeIn";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Assess",
    subtitle: "Assessment",
    body: "We spend time learning your business — the calls you get, the questions your staff answers daily, the revenue leaks you already know about and the ones you don't. Operations before technology. Every time.",
  },
  {
    number: "02",
    title: "Recommend",
    subtitle: "Week 1",
    body: "We map exactly where AI creates real impact for your business. No generic playbook. No technology for technology's sake. A plain-language roadmap with projected ROI per recommendation.",
  },
  {
    number: "03",
    title: "Build",
    subtitle: "Week 2",
    body: "We build around how your business actually operates — not how a template assumes it does. Every system is configured to your voice, your rules, your workflows. You approve before anything goes live.",
  },
  {
    number: "04",
    title: "Maintain",
    subtitle: "Ongoing",
    body: "We stay. We monitor, adjust, and support the systems we build. You get a real person, not a help desk ticket. The person who sold you the solution is the same person who builds and maintains it.",
  },
];

// ─── Mobile: original stacked layout ──────────────────────────────────────────

function MobileLayout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgColRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      ".step-item-mobile",
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: ".step-item-mobile", start: "top 80%", once: true },
      }
    );

    const rafId = requestAnimationFrame(() => {
      const svgEl = svgRef.current;
      const pathEl = pathRef.current;
      const colEl = svgColRef.current;
      if (!svgEl || !pathEl || !colEl) return;

      const colRect = colEl.getBoundingClientRect();
      const h = colRect.height;
      const cx = 10;

      pathEl.setAttribute("d", `M ${cx} 0 L ${cx} ${h}`);
      const totalLength = pathEl.getTotalLength();

      gsap.set(pathEl, { strokeDasharray: totalLength, strokeDashoffset: totalLength });

      stepRefs.current.forEach((stepEl, i) => {
        const circleEl = circleRefs.current[i];
        if (!stepEl || !circleEl) return;
        const stepRect = stepEl.getBoundingClientRect();
        const cy = Math.max(0, stepRect.top - colRect.top + 10);
        circleEl.setAttribute("cy", String(cy));
        gsap.set(circleEl, { scale: 0, transformOrigin: "center center" });
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(pathEl, { strokeDashoffset: totalLength * (1 - p) });
          steps.forEach((_, i) => {
            const threshold = (i + 0.6) / steps.length;
            const circleEl = circleRefs.current[i];
            const numEl = numberRefs.current[i];
            if (p >= threshold) {
              if (circleEl) gsap.to(circleEl, { scale: 1, duration: 0.3, transformOrigin: "center center", overwrite: "auto" });
              if (numEl) gsap.to(numEl, { scale: 1.1, color: "var(--eucalyptus)", duration: 0.3, overwrite: "auto" });
            } else {
              if (numEl) gsap.to(numEl, { scale: 1, color: "var(--text-muted)", duration: 0.3, overwrite: "auto" });
            }
          });
        },
      });
    });

    return () => { cancelAnimationFrame(rafId); };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="section-padding light-section"
      style={{ borderTop: "1px solid var(--border)", backgroundColor: "#F5F4EF", overflow: "hidden" }}
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
              marginBottom: "80px",
            }}
          >
            Simple Process. Real Results.
          </h2>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: "60px" }}>
          {/* SVG line column */}
          <div ref={svgColRef} style={{ position: "relative" }}>
            <svg
              ref={svgRef}
              style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "100%", overflow: "visible" }}
            >
              <path ref={pathRef} stroke="#5F8575" strokeWidth="1" fill="none" />
              {steps.map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => { circleRefs.current[i] = el; }}
                  cx="10" cy="0" r="3" fill="#5F8575"
                />
              ))}
            </svg>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
            {steps.map((step, i) => (
              <div
                key={i}
                className="step-item-mobile"
                ref={(el) => { stepRefs.current[i] = el; }}
                style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}
              >
                <div
                  ref={(el) => { numberRefs.current[i] = el; }}
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "clamp(36px, 4vw, 56px)",
                    color: "var(--text-muted)",
                    lineHeight: 1,
                    flexShrink: 0,
                    width: "80px",
                    fontWeight: 500,
                    transition: "color 0.3s ease",
                  }}
                >
                  {step.number}
                </div>
                <div style={{ paddingTop: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-instrument), serif",
                        fontSize: "clamp(20px, 2.5vw, 28px)",
                        color: "var(--text-primary)",
                        lineHeight: 1.2,
                      }}
                    >
                      {step.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        color: "var(--eucalyptus)",
                        background: "rgba(95,133,117,0.1)",
                        padding: "3px 8px",
                        borderRadius: "2px",
                      }}
                    >
                      {step.subtitle}
                    </span>
                  </div>
                  <p
                    data-cursor="text"
                    style={{
                      fontFamily: "var(--font-body), serif",
                      fontSize: "17px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                      maxWidth: "520px",
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Desktop: sticky scroll layout ────────────────────────────────────────────

export default function HowItWorks() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Avoid layout mismatch on first render
  if (!mounted) return null;
  if (isMobile) return <MobileLayout />;

  return <DesktopLayout />;
}

function DesktopLayout() {
  const outerRef = useRef<HTMLDivElement>(null);
  const svgColRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);    // left col rows
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);  // number+title wrappers
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rightContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ghostNumRef = useRef<HTMLDivElement>(null);
  const triggerZoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeStepRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const outer = outerRef.current;
    if (!outer) return;

    // Set initial right content states
    rightContentRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 });
    });

    // Set initial left column active states
    numberRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        color: i === 0 ? "#5F8575" : "var(--text-muted)",
        opacity: i === 0 ? 1 : 0.35,
      });
    });

    // SVG line draw — measured after layout settles
    const rafId = requestAnimationFrame(() => {
      const svgEl = svgRef.current;
      const pathEl = pathRef.current;
      const colEl = svgColRef.current;
      if (!svgEl || !pathEl || !colEl) return;

      const colRect = colEl.getBoundingClientRect();
      const h = colRect.height;
      const cx = 10;

      pathEl.setAttribute("d", `M ${cx} 0 L ${cx} ${h}`);
      const totalLength = pathEl.getTotalLength();
      gsap.set(pathEl, { strokeDasharray: totalLength, strokeDashoffset: totalLength });

      // Position circles at each step row's vertical offset
      stepRefs.current.forEach((stepEl, i) => {
        const circleEl = circleRefs.current[i];
        if (!stepEl || !circleEl) return;
        const stepRect = stepEl.getBoundingClientRect();
        const cy = Math.max(0, stepRect.top - colRect.top + 10);
        circleEl.setAttribute("cy", String(cy));
        gsap.set(circleEl, { scale: 0, transformOrigin: "center center" });
      });

      // Scroll-driven line draw over 400vh outer container
      ScrollTrigger.create({
        trigger: outer,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(pathEl, { strokeDashoffset: totalLength * (1 - p) });
          steps.forEach((_, i) => {
            const threshold = (i + 0.6) / steps.length;
            const circleEl = circleRefs.current[i];
            if (p >= threshold) {
              if (circleEl) gsap.to(circleEl, { scale: 1, duration: 0.3, transformOrigin: "center center", overwrite: "auto" });
            }
          });
        },
      });
    });

    // Step activation
    const setActiveStep = (index: number) => {
      const prev = activeStepRef.current;
      if (prev === index) return;
      activeStepRef.current = index;

      // Fade heading out after step 0
      if (headingRef.current) {
        gsap.to(headingRef.current, {
          opacity: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : -12,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      // Outgoing right content
      const outgoing = rightContentRefs.current[prev];
      if (outgoing) {
        gsap.to(outgoing, { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" });
      }

      // Incoming right content
      const incoming = rightContentRefs.current[index];
      if (incoming) {
        gsap.fromTo(
          incoming,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.1 }
        );
      }

      // Ghost number
      if (ghostNumRef.current) {
        ghostNumRef.current.textContent = steps[index].number;
      }

      // Left column active states
      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          color: i === index ? "#5F8575" : "var(--text-muted)",
          opacity: i === index ? 1 : 0.35,
          duration: 0.4,
          ease: "power2.out",
        });
      });
    };

    // 4 trigger zones — one per step
    const triggers = triggerZoneRefs.current.map((zone, i) => {
      if (!zone) return null;
      return ScrollTrigger.create({
        trigger: zone,
        start: "top center",
        once: false,
        onEnter: () => setActiveStep(i),
        onEnterBack: () => setActiveStep(i),
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="light-section"
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "#F5F4EF",
        position: "relative",
      }}
    >
      {/* 400vh scroll space with trigger zones */}
      <div ref={outerRef} style={{ position: "relative", height: "400vh" }}>

        {/* Invisible trigger zones — one per step, 100vh each */}
        {steps.map((_, i) => (
          <div
            key={i}
            ref={(el) => { triggerZoneRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: `${i * 25}%`,
              height: "25%",
              width: "100%",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Sticky panel */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
          }}
        >
          {/* ── LEFT SIDE ─────────────────────────────── */}
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "80px 60px 80px 80px",
              borderRight: "1px solid var(--border)",
              position: "relative",
            }}
          >
            {/* Section heading */}
            <h2
              ref={headingRef}
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "clamp(24px, 3vw, 40px)",
                color: "var(--text-primary)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "48px",
              }}
            >
              Simple Process. Real Results.
            </h2>

            {/* SVG line + step list */}
            <div ref={svgColRef} style={{ position: "relative", paddingLeft: "40px" }}>
              {/* SVG strip — absolute, spanning full height of step list */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "20px",
                }}
              >
                <svg
                  ref={svgRef}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "20px",
                    height: "100%",
                    overflow: "visible",
                  }}
                >
                  <path ref={pathRef} stroke="#5F8575" strokeWidth="1" fill="none" />
                  {steps.map((_, i) => (
                    <circle
                      key={i}
                      ref={(el) => { circleRefs.current[i] = el; }}
                      cx="10"
                      cy="0"
                      r="3"
                      fill="#5F8575"
                    />
                  ))}
                </svg>
              </div>

              {/* Step rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {steps.map((step, i) => (
                  <div key={i} ref={(el) => { stepRefs.current[i] = el; }}>
                    {/* Number + title wrapper — color controlled via GSAP */}
                    <div
                      ref={(el) => { numberRefs.current[i] = el; }}
                      style={{
                        color: i === 0 ? "#5F8575" : "var(--text-muted)",
                        opacity: i === 0 ? 1 : 0.35,
                        transition: "color 0.4s ease, opacity 0.4s ease",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "13px",
                          letterSpacing: "0.2em",
                          marginBottom: "4px",
                          color: "inherit",
                        }}
                      >
                        {step.number}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-instrument), serif",
                          fontSize: "22px",
                          lineHeight: 1.2,
                          color: "inherit",
                        }}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDE ────────────────────────────── */}
          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0 80px",
              overflow: "hidden",
            }}
          >
            {/* Ghost number — updates with active step */}
            <div
              ref={ghostNumRef}
              style={{
                position: "absolute",
                top: "50%",
                right: "40px",
                transform: "translateY(-50%)",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "120px",
                color: "var(--text-primary)",
                opacity: 0.04,
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 0,
              }}
            >
              01
            </div>

            {/* Content blocks — stacked, GSAP controls visibility */}
            <div style={{ position: "relative", maxWidth: "480px", width: "100%", zIndex: 1 }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => { rightContentRefs.current[i] = el; }}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {/* Step subtitle badge */}
                  <div
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "var(--eucalyptus)",
                      background: "rgba(95,133,117,0.1)",
                      padding: "3px 8px",
                      borderRadius: "2px",
                      display: "inline-block",
                      marginBottom: "20px",
                    }}
                  >
                    {step.subtitle}
                  </div>

                  <p
                    data-cursor="text"
                    style={{
                      fontFamily: "var(--font-body), serif",
                      fontSize: "19px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
