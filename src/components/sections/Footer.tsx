"use client";

import { motion } from "framer-motion";

const navLinks = [
  { label: "Solutions", href: "#solutions" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="light-section"
      style={{
        borderTop: "1px solid var(--border)",
        padding: "40px 0",
        backgroundColor: "#F5F4EF",
      }}
    >
      <div className="container">
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Wordmark */}
          <a
            href="#"
            style={{
              fontFamily: "var(--font-instrument), serif",
              fontStyle: "italic",
              fontSize: "18px",
              color: "var(--text-primary)",
            }}
          >
            Quiet Dissent
          </a>

          {/* Tagline */}
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            Non-consensus decisions. Measurable outcomes.
          </span>

          {/* Nav links */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: "var(--text-muted)",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-secondary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              color: "var(--text-muted)",
            }}
          >
            © 2026 Quiet Dissent. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="tel:6156734210"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              (615) 673-4210
            </a>
            <a
              href="mailto:hello@quietdissent.com"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              hello@quietdissent.com
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
