"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);
import TextScramble from "@/components/animations/TextScramble";
import MagneticButton from "@/components/animations/MagneticButton";
import NodeNetwork from "@/components/animations/NodeNetwork";

const ROTATING_WORDS = ["good", "growing", "scaling", "ambitious"];
const ARTICLE_MAP: Record<string, string> = {
  good: "a",
  growing: "a",
  scaling: "a",
  ambitious: "an",
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const line4Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const articleInnerRef = useRef<HTMLSpanElement>(null);

  // Drives the NodeNetwork fade as the hero exits the viewport
  const [networkOpacity, setNetworkOpacity] = useState(1);

  // ── Rotating word ──────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => {
        const next = (i + 1) % ROTATING_WORDS.length;
        if (articleInnerRef.current) {
          articleInnerRef.current.textContent = ARTICLE_MAP[ROTATING_WORDS[next]];
        }
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // ── Entry animation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tl = gsap.timeline({ delay: 0.4 });

    if (line1Ref.current) {
      const words = line1Ref.current.querySelectorAll(".word-inner");
      tl.to(words, { y: 0, skewY: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 });
    }
    if (line2Ref.current) {
      const words = line2Ref.current.querySelectorAll(".word-inner");
      tl.to(words, { y: 0, skewY: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 }, "-=0.5");
    }
    if (line3Ref.current) {
      const words = line3Ref.current.querySelectorAll(".word-inner");
      tl.to(words, { y: 0, skewY: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 }, "-=0.5");
    }
    if (line4Ref.current) {
      const words = line4Ref.current.querySelectorAll(".word-inner");
      tl.to(words, { y: 0, skewY: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 }, "-=0.5");
    }
    if (subRef.current) {
      tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3");
    }
    if (ctaRef.current) {
      tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
    }

    return () => {};
  }, []);

  // ── Parallax — text layers exit at different speeds ────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!heroSectionRef.current) return;

    const trigger = {
      trigger: heroSectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
    };

    const t1 = gsap.to(eyebrowRef.current,  { y: -100, ease: "none", scrollTrigger: trigger });
    const t2 = gsap.to(headlineRef.current, { y: -80,  ease: "none", scrollTrigger: trigger });
    const t3 = gsap.to(subRef.current,      { y: -40,  ease: "none", scrollTrigger: trigger });

    return () => {
      t1.scrollTrigger?.kill();
      t2.scrollTrigger?.kill();
      t3.scrollTrigger?.kill();
    };
  }, []);

  // ── Scroll-fade for NodeNetwork ────────────────────────────────────────────
  // The string network fades to 0 as the hero scrolls out, making it feel
  // owned by the hero rather than floating beneath all other sections.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!heroSectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: heroSectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        // Hold at full opacity for the first 40% of scroll, then fade to 0
        const fadeStart = 0.4;
        const raw = Math.max(0, (self.progress - fadeStart) / (1 - fadeStart));
        setNetworkOpacity(1 - raw);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  // ── Render helpers ─────────────────────────────────────────────────────────
  const splitLine = (text: string, ref: React.RefObject<HTMLDivElement>) => {
    const words = text.split(" ");
    return (
      <div ref={ref} style={{ lineHeight: 1.1 }}>
        {words.map((word, i) => (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.05em" }}
          >
            <span
              className="word-inner"
              style={{ display: "inline-block", transform: "translateY(110%) skewY(4deg)", color: "#FFFFF0" }}
            >
              {word}{i < words.length - 1 ? "\u00a0" : ""}
            </span>
          </span>
        ))}
      </div>
    );
  };

  const wordSpan = (word: string, trailingSpace = true) => (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.05em" }}>
      <span
        className="word-inner"
        style={{ display: "inline-block", transform: "translateY(110%) skewY(4deg)", color: "#FFFFF0" }}
      >
        {word}{trailingSpace ? "\u00a0" : ""}
      </span>
    </span>
  );

  const renderLine1 = () => (
    <div ref={line1Ref}>
      {wordSpan("The")}
      {wordSpan("gap")}
      {wordSpan("between", false)}
    </div>
  );

  const renderLine2 = () => (
    <div ref={line2Ref}>
      <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.05em" }}>
        <span
          ref={articleInnerRef}
          className="word-inner"
          style={{ display: "inline-block", transform: "translateY(110%) skewY(4deg)", color: "#FFFFF0" }}
        >
          a
        </span>
      </span>
      {"\u00a0"}
      <span style={{ display: "inline-block", verticalAlign: "baseline", overflow: "hidden", paddingBottom: "0.05em" }}>
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "inline-block", color: "#5F8575", fontStyle: "italic" }}
          >
            {ROTATING_WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
      {"\u00a0"}
      {wordSpan("business", false)}
    </div>
  );

  const renderLine3 = () => (
    <div ref={line3Ref}>
      {wordSpan("and")}
      {wordSpan("a")}
      {wordSpan("great")}
      {wordSpan("one", false)}
    </div>
  );

  return (
    <section
      id="hero"
      ref={heroSectionRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "#111111",
      }}
    >
      {/* String network — biased right, fades on scroll exit */}
      <NodeNetwork scrollOpacity={networkOpacity} />

      {/* Ambient glow — toned down, network is now the visual layer */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <div className="hero-glow" />
      </div>

      <div className="container" style={{ width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ paddingTop: "140px", paddingBottom: "100px", maxWidth: "640px" }}>

          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#5F8575",
              marginBottom: "48px",
            }}
          >
            <TextScramble
              text="Non-consensus decisions. Measurable outcomes."
              delay={200}
              triggerOnLoad
            />
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontSize: "clamp(36px, 5vw, 68px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              wordSpacing: "0.05em",
              marginBottom: "36px",
            }}
          >
            {renderLine1()}
            {renderLine2()}
            {renderLine3()}
            {splitLine("is usually a few hours a day.", line4Ref as React.RefObject<HTMLDivElement>)}
          </h1>

          {/* Subheadline */}
          <div ref={subRef} style={{ opacity: 0, transform: "translateY(20px)", marginBottom: "52px" }}>
            <p
              data-cursor="text"
              style={{
                fontFamily: "var(--font-body), serif",
                fontSize: "19px",
                color: "rgba(255,255,240,0.65)",
                maxWidth: "520px",
                lineHeight: 1.65,
              }}
            >
              We help Nashville&apos;s small and mid-size businesses identify where time,
              money, and momentum are being lost — then build the systems that recover them.
            </p>
          </div>

          {/* CTA */}
          <div
            ref={ctaRef}
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            <MagneticButton>
              <motion.a
                href="#contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  color: "#FFFFF0",
                  border: "1px solid #FFFFF0",
                  padding: "16px 32px",
                  borderRadius: "4px",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                whileHover={{ background: "#5F8575", color: "#FFFFFF", borderColor: "#5F8575" }}
                transition={{ duration: 0.3 }}
              >
                See What&apos;s Possible →
              </motion.a>
            </MagneticButton>

            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,240,0.3)",
                lineHeight: 1.5,
              }}
            >
              No pitch. An honest conversation about where your business actually is — and where it could be.
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
