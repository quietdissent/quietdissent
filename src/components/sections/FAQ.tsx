"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "@/components/animations/FadeIn";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Who is this for?",
    a: "Business owners and operators in the Nashville area who are past the 'wondering if AI matters' stage and are now asking where to actually start — and how to do it right. We work best with businesses of 5–50 people where the owner is still involved in daily operations. The common thread isn't the sector. It's the situation: talented people doing work that systems should handle.",
  },
  {
    q: "Do I need to understand AI?",
    a: "No. That's our job. You tell us how your business works — the calls you get, the questions your team answers every day, where things fall through the cracks. We handle everything else in plain language.",
  },
  {
    q: "What if the AI can't handle something?",
    a: "Every system we build has a defined escalation path. For anything outside its scope, it captures the information and routes it to you or your team. Nothing falls through the cracks — that's a requirement, not a feature.",
  },
  {
    q: "How is this different from an answering service?",
    a: "Answering services read scripts. They have hold times, high turnover, and no intelligence about your business. The systems we build know your services, your pricing, your scheduling rules, and your voice. They handle unlimited simultaneous interactions, never have a bad day, and cost a fraction of what a human equivalent would.",
  },
  {
    q: "What does it cost?",
    a: "AI Readiness Assessment: $500 flat. Systems Implementation is scoped per engagement based on what the assessment surfaces — most clients are in the $1,500–$5,000 range. Fractional Chief AI Officer retainer starts at $1,500/month. Most clients see full ROI within the first 30 days of implementation.",
  },
  {
    q: "How long until it's live?",
    a: "Most implementations are live within two weeks of a signed agreement. The assessment itself delivers findings within five business days.",
  },
  {
    q: "Do you work with businesses outside Nashville?",
    a: "Our focus is Nashville and the surrounding area. Being local matters to us — we want to understand your market, your customers, and your competitive environment firsthand. If you're outside Nashville and want to have a conversation, reach out. We'll be honest about whether we're the right fit.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.fromTo(
      ".faq-item",
      { x: -10, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".faq-item", start: "top 85%", once: true },
      }
    );
  }, []);

  return (
    <section
      id="faq"
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
              marginBottom: "64px",
            }}
          >
            Common Questions.
          </h2>
        </FadeIn>

        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "20px",
                  }}
                  aria-expanded={open === i}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "17px",
                      color: open === i ? "var(--text-primary)" : "var(--text-secondary)",
                      fontWeight: 500,
                      transition: "color 0.2s ease",
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      fontSize: "24px",
                      color: open === i ? "var(--eucalyptus)" : "var(--text-muted)",
                      flexShrink: 0,
                      lineHeight: 1,
                      fontWeight: 300,
                    }}
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        data-cursor="text"
                        style={{
                          fontFamily: "var(--font-body), serif",
                          fontSize: "17px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                          paddingBottom: "28px",
                          maxWidth: "600px",
                        }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>
    </section>
  );
}
