"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "@/components/animations/MagneticButton";
import FadeIn from "@/components/animations/FadeIn";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "hello@quietdissent.com";

function CharReveal({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const chars = text.split("").map((char) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.style.overflow = "hidden";
      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.style.transform = "translateY(110%)";
      inner.textContent = char === " " ? "\u00a0" : char;
      span.appendChild(inner);
      return { span, inner };
    });

    el.innerHTML = "";
    chars.forEach(({ span }) => el.appendChild(span));

    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(
          chars.map((c) => c.inner),
          {
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.025,
          }
        );
      },
    });
  }, [text]);

  return (
    <h2
      ref={ref}
      style={{
        fontFamily: "var(--font-instrument), serif",
        fontSize: "clamp(32px, 5vw, 64px)",
        color: "var(--text-primary)",
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
        marginBottom: "24px",
      }}
    >
      {text}
    </h2>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "15px",
  color: "var(--text-primary)",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  color: "var(--text-muted)",
  marginBottom: "8px",
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    industry: "",
    headache: "",
    source: "",
    contactMethod: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const bg = bgRef.current;
    if (!bg) return;

    gsap.to(bg, {
      opacity: 0.6,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding light-section"
      style={{
        borderTop: "1px solid var(--border)",
        overflow: "hidden",
        backgroundColor: "#F5F4EF",
      }}
    >
      {/* Radial bg pulse */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(95,133,117,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <FadeIn y={60} duration={1}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <CharReveal text="Let's Start With Your Strategy." />

            <motion.p
              data-cursor="text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                fontFamily: "var(--font-body), serif",
                fontSize: "19px",
                color: "var(--text-secondary)",
                maxWidth: "560px",
                margin: "0 0 48px",
                lineHeight: 1.65,
              }}
            >
              We&apos;ll look at where your business is today, where the real opportunities are, and
              whether we&apos;re the right fit to help you get there. No pressure. No pitch. Just clarity.
            </motion.p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: "48px 40px",
                    border: "1px solid var(--eucalyptus)",
                    borderRadius: "6px",
                    background: "rgba(95,133,117,0.05)",
                    textAlign: "center",
                    marginBottom: "48px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-instrument), serif",
                      fontSize: "clamp(24px, 3vw, 36px)",
                      color: "var(--text-primary)",
                      marginBottom: "16px",
                    }}
                  >
                    Message sent.
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body), serif",
                      fontSize: "17px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                    }}
                  >
                    I&apos;ll be in touch within 1–2 business days. Check your inbox — a
                    confirmation is on its way.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" }}
                >
                  {/* Row 1: Name + Email */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="form-row">
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--eucalyptus)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--eucalyptus)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      />
                    </div>
                  </div>

                  {/* Business */}
                  <div>
                    <label style={labelStyle}>Business Name *</label>
                    <input
                      type="text"
                      name="business"
                      value={form.business}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--eucalyptus)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label style={labelStyle}>Industry *</label>
                    <input
                      type="text"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--eucalyptus)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>

                  {/* Operational headache */}
                  <div>
                    <label style={labelStyle}>Biggest Operational Headache *</label>
                    <textarea
                      name="headache"
                      value={form.headache}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="What's costing you the most time or money right now?"
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        lineHeight: 1.6,
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--eucalyptus)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>

                  {/* Row 2: Source + Preferred contact */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="form-row">
                    <div>
                      <label style={labelStyle}>How Did You Find Us? *</label>
                      <select
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                        required
                        style={{ ...inputStyle, cursor: "pointer" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--eucalyptus)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      >
                        <option value="">Select one</option>
                        <option value="google">Google Search</option>
                        <option value="referral">Referral</option>
                        <option value="social">Social Media</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Preferred Contact Method *</label>
                      <select
                        name="contactMethod"
                        value={form.contactMethod}
                        onChange={handleChange}
                        required
                        style={{ ...inputStyle, cursor: "pointer" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--eucalyptus)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      >
                        <option value="">Select one</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="either">Either</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Optional — we'll email unless you prefer a call"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--eucalyptus)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: "14px 18px",
                        background: "rgba(180,60,60,0.07)",
                        border: "1px solid rgba(180,60,60,0.25)",
                        borderRadius: "4px",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "14px",
                        color: "#C05050",
                        lineHeight: 1.6,
                      }}
                    >
                      {error} You can also reach me directly at{" "}
                      <a
                        href={`mailto:${EMAIL}`}
                        style={{ color: "var(--eucalyptus)", textDecoration: "none", borderBottom: "1px solid rgba(95,133,117,0.3)" }}
                      >
                        {EMAIL}
                      </a>
                      .
                    </motion.div>
                  )}

                  {/* Submit */}
                  <div>
                    <MagneticButton>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          background: loading ? "#4A6B5F" : "#5F8575",
                          color: "#FFFFFF",
                          padding: "18px 36px",
                          borderRadius: "4px",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "16px",
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          border: "none",
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.75 : 1,
                          transition: "opacity 0.2s ease, background 0.2s ease",
                        }}
                        whileHover={loading ? {} : { background: "#4A6B5F" }}
                        transition={{ duration: 0.3 }}
                      >
                        {loading ? "Sending…" : "Send Your Inquiry →"}
                      </motion.button>
                    </MagneticButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                We reply within 48 hours. Every inquiry gets a personal response — not an automated sequence.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                }}
              >
                Prefer email directly?{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  style={{
                    color: "var(--eucalyptus)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(95,133,117,0.3)",
                    paddingBottom: "1px",
                  }}
                >
                  {EMAIL}
                </a>
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  marginTop: "8px",
                }}
              >
                Nashville-based. Founder-led. You talk to the same person who does the work.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
