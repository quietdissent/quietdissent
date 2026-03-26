"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_EMAIL = "hello@quietdissent.com";

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
      style={{
        backgroundColor: "#161616",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* Left: copy */}
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 4px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#5F8575",
            }}
          >
            Newsletter
          </p>
          <h2
            style={{
              margin: "0 0 8px",
              fontFamily: "var(--font-instrument), serif",
              fontStyle: "italic",
              fontSize: "clamp(22px, 3vw, 30px)",
              fontWeight: 400,
              color: "#FFFFF0",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            The Dissenter
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,240,0.45)",
              lineHeight: 1.55,
            }}
          >
            Straight talk on AI for small businesses. No hype. No jargon. Free.
          </p>
        </div>

        {/* Right: form */}
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  margin: 0,
                  fontFamily: "var(--font-instrument), serif",
                  fontStyle: "italic",
                  fontSize: "18px",
                  color: "#5F8575",
                }}
              >
                You&apos;re in. Watch your inbox.
              </motion.p>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
                      flex: "1 1 200px",
                      minWidth: 0,
                      padding: "11px 16px",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "14px",
                      color: "#FFFFF0",
                      background: "rgba(255,255,255,0.06)",
                      border: status === "error"
                        ? "1px solid rgba(180,60,60,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "4px",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(95,133,117,0.6)")}
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        status === "error" ? "rgba(180,60,60,0.5)" : "rgba(255,255,255,0.1)")
                    }
                  />
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    style={{
                      flexShrink: 0,
                      padding: "11px 24px",
                      background: status === "loading" ? "#4A7065" : "#5F8575",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "4px",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: status === "loading" ? "not-allowed" : "pointer",
                      opacity: status === "loading" ? 0.7 : 1,
                      transition: "opacity 0.2s ease, background 0.2s ease",
                    }}
                    whileHover={status === "loading" ? {} : { background: "#4A7065" }}
                  >
                    {status === "loading" ? "Subscribing…" : "Subscribe"}
                  </motion.button>
                </div>

                {/* Error message */}
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
                        lineHeight: 1.5,
                      }}
                    >
                      {errorMsg} Email us at{" "}
                      <a
                        href={`mailto:${FALLBACK_EMAIL}`}
                        style={{
                          color: "#5F8575",
                          textDecoration: "none",
                          borderBottom: "1px solid rgba(95,133,117,0.3)",
                        }}
                      >
                        {FALLBACK_EMAIL}
                      </a>
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Disclaimer */}
                {status !== "error" && (
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "10px",
                      color: "rgba(255,255,240,0.22)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    No spam. One email when it matters.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #newsletter-inner {
            flex-direction: column;
          }
        }
        /* Style placeholder text */
        input[type="email"]::placeholder {
          color: rgba(255,255,240,0.25);
        }
      `}</style>
    </section>
  );
}
