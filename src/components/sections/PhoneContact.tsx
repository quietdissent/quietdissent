"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PHONE_DISPLAY = "(629) 222-2127";
const PHONE_HREF = "tel:+16292222127";

export default function PhoneContact() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = lineRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { scaleX: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#F5F4EF",
        borderTop: "1px solid #D8D6D1",
        borderBottom: "1px solid #D8D6D1",
        padding: "80px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#5F8575",
            marginBottom: "20px",
          }}
        >
          Questions Welcome
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "#111111",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
          }}
        >
          Prefer to chat?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontSize: "22px",
            color: "#111111",
            lineHeight: 1.3,
            marginBottom: "12px",
          }}
        >
          We&apos;d love to hear from you.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "17px",
            color: "#4A4A4A",
            lineHeight: 1.65,
            marginBottom: "40px",
            maxWidth: "480px",
          }}
        >
          We're available around the clock for business inquiries, general questions, and scheduling -- a simple way to experience how the front line can run with more consistency.
        </motion.p>

        <div
          ref={lineRef}
          style={{
            height: "1px",
            background: "#D8D6D1",
            marginBottom: "40px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}
        >
          <a
            href={PHONE_HREF}
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 500,
              color: "#111111",
              letterSpacing: "-0.02em",
              textDecoration: "none",
              borderBottom: "2px solid #5F8575",
              paddingBottom: "2px",
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#5F8575";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#111111";
            }}
          >
            {PHONE_DISPLAY}
          </a>

          <span
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "13px",
              color: "#7A7875",
              letterSpacing: "0.01em",
            }}
          >
            Nashville, TN · Available 24/7
          </span>
        </motion.div>
      </div>
    </section>
  );
}
