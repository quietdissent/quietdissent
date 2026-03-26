"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_EMAIL = "hello@quietdissent.com";

const AVATARS = [
  { key: "b", label: "B" },
  { key: "m", label: "M" },
  { key: "j", label: "J" },
  { key: "plus", label: "+" },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <section
      className="newsletter-section"
      style={{
        backgroundColor: "#F5F4EF",
        padding: "80px 0",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="container">
        {/* ── Dark card ────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            background: "#1a1f1e",
            border: "1px solid rgba(141,171,161,0.2)",
            borderRadius: "12px",
            padding: "48px 52px",
            overflow: "hidden",
          }}
          className="newsletter-card"
        >
          {/* Radial glow — top-right corner */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "320px",
              height: "320px",
              background:
                "radial-gradient(circle, rgba(141,171,161,0.13) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          {/* ── Two-column inner layout ─────────────────────────────────── */}
          <div className="newsletter-inner">

            {/* LEFT — copy */}
            <div className="newsletter-left">
              {/* Eyebrow with rule */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "22px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "1px",
                    background: "#8daba1",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#8daba1",
                  }}
                >
                  Free Newsletter
                </span>
              </div>

              {/* Headline */}
              <h2
                style={{
                  margin: "0 0 20px",
                  fontFamily: "var(--font-instrument), serif",
                  fontStyle: "italic",
                  fontSize: "36px",
                  fontWeight: 400,
                  color: "#FFFFF0",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                The Dissenter
              </h2>

              {/* Body copy */}
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "14px",
                  color: "rgba(255,255,240,0.52)",
                  lineHeight: 1.7,
                  maxWidth: "380px",
                }}
              >
                Not ready to hire yet? That&apos;s fine. The Dissenter is a free newsletter
                for small business owners who want straight talk on AI — what&apos;s actually
                worth your time, what&apos;s overhyped, and what&apos;s quietly eating your
                revenue right now. No pitch. No jargon. Just signal.
              </p>
            </div>

            {/* Vertical divider — hidden on mobile via CSS */}
            <div
              className="newsletter-divider"
              aria-hidden="true"
              style={{
                width: "1px",
                alignSelf: "stretch",
                background: "rgba(141,171,161,0.15)",
                flexShrink: 0,
              }}
            />

            {/* RIGHT — social proof + form */}
            <div className="newsletter-right">
              {/* Social proof row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                {/* Stacked avatars */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  {AVATARS.map((av, i) => (
                    <div
                      key={av.key}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#242a28",
                        border: "2px solid #1a1f1e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#8daba1",
                        marginLeft: i === 0 ? 0 : "-8px",
                        position: "relative",
                        zIndex: AVATARS.length - i,
                        flexShrink: 0,
                      }}
                    >
                      {av.label}
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "12px",
                    color: "rgba(255,255,240,0.45)",
                    lineHeight: 1.4,
                  }}
                >
                  Join Nashville business owners already subscribed
                </p>
              </div>

              {/* Form / success / error */}
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: "24px",
                      border: "1px solid rgba(141,171,161,0.25)",
                      borderRadius: "8px",
                      background: "rgba(141,171,161,0.06)",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontFamily: "var(--font-instrument), serif",
                        fontStyle: "italic",
                        fontSize: "20px",
                        color: "#8daba1",
                      }}
                    >
                      You&apos;re in.
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "13px",
                        color: "rgba(255,255,240,0.45)",
                      }}
                    >
                      Watch your inbox.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                  >
                    {/* Email input */}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="Your email address"
                      required
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "14px",
                        color: "#FFFFF0",
                        background: "#242a28",
                        border:
                          status === "error"
                            ? "1px solid rgba(180,60,60,0.5)"
                            : "1px solid rgba(141,171,161,0.15)",
                        borderRadius: "6px",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(141,171,161,0.55)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          status === "error"
                            ? "rgba(180,60,60,0.5)"
                            : "rgba(141,171,161,0.15)")
                      }
                    />

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      style={{
                        width: "100%",
                        padding: "13px 24px",
                        background: status === "loading" ? "#6e9a8e" : "#8daba1",
                        color: "#0f1412",
                        border: "none",
                        borderRadius: "6px",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        letterSpacing: "0.01em",
                        cursor: status === "loading" ? "not-allowed" : "pointer",
                        opacity: status === "loading" ? 0.75 : 1,
                        transition: "opacity 0.2s ease, background 0.2s ease",
                      }}
                      whileHover={status === "loading" ? {} : { background: "#7a9991" }}
                    >
                      {status === "loading" ? "Subscribing…" : "Send me The Dissenter →"}
                    </motion.button>

                    {/* Error */}
                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          style={{
                            margin: 0,
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "12px",
                            color: "#C05050",
                            lineHeight: 1.55,
                          }}
                        >
                          {errorMsg} Email{" "}
                          <a
                            href={`mailto:${FALLBACK_EMAIL}`}
                            style={{
                              color: "#8daba1",
                              textDecoration: "none",
                              borderBottom: "1px solid rgba(141,171,161,0.35)",
                            }}
                          >
                            {FALLBACK_EMAIL}
                          </a>
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Fine print */}
                    {status !== "error" && (
                      <p
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "10px",
                          color: "rgba(255,255,240,0.2)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        No spam. Unsubscribe anytime. Actually free.
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .newsletter-inner {
          display: flex;
          gap: 52px;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }
        .newsletter-left {
          flex: 1 1 0;
          min-width: 0;
        }
        .newsletter-right {
          flex: 1 1 0;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .newsletter-card {
            padding: 36px 28px !important;
          }
          .newsletter-inner {
            flex-direction: column;
            gap: 36px;
          }
          .newsletter-divider {
            display: none;
          }
          .newsletter-left h2 {
            font-size: 28px !important;
          }
        }
        .newsletter-card input[type="email"]::placeholder {
          color: rgba(255,255,240,0.25);
        }
      `}</style>
    </section>
  );
}
