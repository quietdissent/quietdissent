"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

// ─── Desktop: sticky pinned section, promises reveal one at a time ────────────
// Left side stays fixed showing the heading.
// Right side scrolls through each promise as a large type moment.

function DesktopLayout() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const outer = outerRef.current;
    if (!outer) return;

    const st = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: `+=${promises.length * window.innerHeight * 0.8}`,
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => {
        const idx = Math.min(
          Math.floor(self.progress * promises.length),
          promises.length - 1
        );
        setActiveIndex(idx);
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section id="promises"`r`n      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "#F5F4EF",
      }}
    >
      <div
        ref={outerRef}
        style={{
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          overflow: "hidden",
        }}
      >
        {/* Left — stays fixed, shows heading and progress */}
        <div
          style={{
            padding: "80px 60px 80px 0",
            paddingLeft: "max(24px, calc((100vw - 1200px) / 2 + 24px))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRight: "1px solid var(--border)",
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
            Our Commitments
          </div>
          <h2
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontSize: "clamp(28px, 3vw, 44px)",
              color: "var(--text-primary)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "48px",
            }}
          >
            What We&apos;re Committed To —<br />Every Time.
          </h2>

          {/* Progress dots */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {promises.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  opacity: i === activeIndex ? 1 : 0.3,
                  transition: "opacity 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "1px",
                    background: i === activeIndex ? "#5F8575" : "var(--border)",
                    transition: "background 0.3s",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    color: i === activeIndex ? "#5F8575" : "var(--text-muted)",
                    transition: "color 0.3s",
                  }}
                >
                  {p.number}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — large type promise, fades between them */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "80px 60px",
            paddingRight: "max(24px, calc((100vw - 1200px) / 2 + 24px))",
            overflow: "hidden",
          }}
        >
          {promises.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                opacity: i === activeIndex ? 1 : 0,
                transform: i === activeIndex ? "translateY(0)" : i < activeIndex ? "translateY(-40px)" : "translateY(40px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                maxWidth: "560px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-instrument), serif",
                  fontSize: "clamp(28px, 3.5vw, 48px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                {p.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Mobile: clean stacked list ───────────────────────────────────────────────

function MobileLayout() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".promise-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return () => ctx.revert();
  }, []);

  return (
    <section id="promises"`r`n      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "#F5F4EF",
        padding: "80px 0",
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
          Our Commitments
        </div>
        <h2
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontSize: "clamp(28px, 6vw, 40px)",
            color: "var(--text-primary)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "48px",
          }}
        >
          What We&apos;re Committed To — Every Time.
        </h2>

        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0" }}>
          {promises.map((p, i) => (
            <li
              key={i}
              className="promise-item"
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr",
                gap: "16px",
                padding: "28px 0",
                borderBottom: i < promises.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "start",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "12px",
                  color: "#5F8575",
                  paddingTop: "3px",
                }}
              >
                {p.number}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body), serif",
                  fontSize: "18px",
                  lineHeight: 1.55,
                  color: "var(--text-primary)",
                }}
              >
                {p.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default function Promises() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}




