"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";

const cards = [
  {
    bg: "#1C1C1E",
    label: "ASSESSMENT → CLARITY",
    stat: "13 hrs/wk",
    text: "A consulting firm owner completed an AI Readiness Assessment and identified three workflow gaps costing 13+ hours per week. Implementation took 11 days. The first month paid for the assessment 14 times over.",
    dark: true,
  },
  {
    bg: "#F5F4EF",
    label: "IMPLEMENTATION → REVENUE",
    stat: "$4,200/mo",
    text: "A service business sending 40% of after-hours calls to voicemail deployed an AI voice agent. Within 30 days they recovered an estimated $4,200 per month in appointments that previously went unanswered.",
    dark: false,
  },
  {
    bg: "#1C1C1E",
    label: "ADVISORY → SCALE",
    stat: "2% → 11%",
    text: "An owner relying on manual outreach added a scoped AI sales system after a diagnostic engagement. Visitor-to-booked-call conversion jumped from 2% to 11% in the first month.",
    dark: true,
  },
];

export default function Results() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const cw = containerWidth - 32;
    const gap = 12;
    const totalTrackWidth = (cw + gap) * 3;
    const maxDrag = -(totalTrackWidth - containerWidth + 32);
    setCardWidth(cw);
    setConstraints({ left: maxDrag, right: 0 });
  }, []);

  function getSnapPoints(): number[] {
    if (!cardWidth) return [0, 0, 0];
    const gap = 12;
    return [0, -(cardWidth + gap), -((cardWidth + gap) * 2)];
  }

  function snapToIndex(index: number) {
    const snapPoints = getSnapPoints();
    animate(x, snapPoints[index], { type: "spring", stiffness: 300, damping: 30 });
    setActiveIndex(index);
  }

  function handleDragEnd() {
    const snapPoints = getSnapPoints();
    const currentX = x.get();
    const closest = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - currentX) < Math.abs(prev - currentX) ? curr : prev
    );
    const newIndex = snapPoints.indexOf(closest);
    animate(x, closest, { type: "spring", stiffness: 300, damping: 30 });
    setActiveIndex(newIndex);
  }

  return (
    <section
      id="results"
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "#F5F4EF",
        padding: "120px 0",
      }}
    >
      <div className="container">
        {/* Heading */}
        <FadeIn>
          <h2
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "48px",
            }}
          >
            What Changes After We Work Together
          </h2>
        </FadeIn>

        {/* Carousel container */}
        <div
          ref={containerRef}
          style={{
            position: "relative",
            overflow: "hidden",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "16px",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          {/* Draggable track */}
          <motion.div
            style={{ display: "flex", width: "fit-content", x }}
            drag="x"
            dragConstraints={constraints}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
          >
            {cards.map((card, i) => (
              <motion.div
                key={i}
                style={{
                  flexShrink: 0,
                  width: cardWidth || "calc(100% - 32px)",
                  borderRadius: "16px",
                  padding: "52px 48px",
                  minHeight: "380px",
                  marginRight: i < cards.length - 1 ? "12px" : 0,
                  background: card.bg,
                  border: card.dark ? "none" : "1px solid var(--border)",
                  cursor: "grab",
                  userSelect: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* Label */}
                  <div
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11px",
                      color: "#5F8575",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      marginBottom: "24px",
                    }}
                  >
                    {card.label}
                  </div>

                  {/* Stat */}
                  <div
                    style={{
                      fontFamily: "var(--font-instrument), serif",
                      fontSize: "clamp(56px, 8vw, 88px)",
                      lineHeight: 1,
                      color: card.dark ? "#FAFAFA" : "#1A1A1A",
                      marginBottom: "24px",
                    }}
                  >
                    {card.stat}
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "17px",
                    lineHeight: 1.7,
                    color: card.dark ? "#A1A1AA" : "#4A4A4A",
                  }}
                >
                  {card.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Indicators */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "20px",
          }}
        >
          {cards.map((_, i) => (
            <div
              key={i}
              onClick={() => snapToIndex(i)}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i === activeIndex ? "#1A1A1A" : "rgba(0,0,0,0.2)",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
