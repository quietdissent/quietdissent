"use client";

import FadeIn from "@/components/animations/FadeIn";

const rows = [
  {
    criterion: "Understands your specific business",
    saas: "✗",
    enterprise: "Partially",
    qd: "✓",
  },
  {
    criterion: "Operations-first approach",
    saas: "✗",
    enterprise: "Rarely",
    qd: "✓",
  },
  {
    criterion: "Founder does the work",
    saas: "N/A",
    enterprise: "✗",
    qd: "✓",
  },
  {
    criterion: "SMB pricing",
    saas: "Subscription-only",
    enterprise: "$50,000+ minimums",
    qd: "✓",
  },
  {
    criterion: "Ongoing strategic support",
    saas: "✗",
    enterprise: "✗",
    qd: "✓",
  },
];

export default function Comparison() {
  return (
    <section
      id="comparison"
      className="section-padding light-section"
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "#F5F4EF",
        overflow: "hidden",
      }}
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
              marginBottom: "32px",
            }}
          >
            You Don&apos;t Need Another Vendor. You Need an Advisor.
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} y={30}>
          <p
            data-cursor="text"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "18px",
              color: "var(--text-secondary)",
              maxWidth: "720px",
              lineHeight: 1.7,
              marginBottom: "64px",
            }}
          >
            The national platforms are powerful — but they&apos;re built for everyone, which means
            they&apos;re optimized for no one in particular. Enterprise consultants know strategy — but
            their minimum engagements start at $50,000 and the partner you met hands you off to a junior
            team.
            <br /><br />
            Quiet Dissent is different. We work exclusively with small and mid-size businesses in the
            Nashville area. We learn how your business actually works before we touch a single tool.
            The person who sold you the solution is the same person who builds it.
            <br /><br />
            That&apos;s not a small thing. That&apos;s everything.
          </p>
        </FadeIn>

        {/* Comparison table */}
        <FadeIn delay={0.15} y={40}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {/* Header */}
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 20px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "var(--text-muted)",
                      fontWeight: 400,
                      borderBottom: "1px solid var(--border)",
                      width: "35%",
                    }}
                  />
                  <th
                    style={{
                      textAlign: "center",
                      padding: "16px 20px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "var(--text-muted)",
                      fontWeight: 400,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    National SaaS Platforms
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "16px 20px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "var(--text-muted)",
                      fontWeight: 400,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    Enterprise Consulting
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "16px 20px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "var(--eucalyptus)",
                      fontWeight: 400,
                      borderLeft: "1px solid var(--eucalyptus)",
                      borderRight: "1px solid var(--eucalyptus)",
                      borderTop: "1px solid var(--eucalyptus)",
                      borderBottom: "none",
                      background: "rgba(95,133,117,0.04)",
                    }}
                  >
                    Quiet Dissent
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        padding: "18px 20px",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        borderBottom: "1px solid var(--border)",
                        lineHeight: 1.4,
                      }}
                    >
                      {row.criterion}
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        textAlign: "center",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "14px",
                        color: row.saas === "✗" ? "var(--text-muted)" : "var(--text-secondary)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {row.saas}
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        textAlign: "center",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "14px",
                        color: row.enterprise === "✗" ? "var(--text-muted)" : "var(--text-secondary)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {row.enterprise}
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        textAlign: "center",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "16px",
                        color: "var(--eucalyptus)",
                        fontWeight: 500,
                        borderLeft: "1px solid var(--eucalyptus)",
                        borderRight: "1px solid var(--eucalyptus)",
                        borderTop: "none",
                        borderBottom: i < rows.length - 1 ? "1px solid rgba(95,133,117,0.15)" : "1px solid var(--eucalyptus)",
                        background: "rgba(95,133,117,0.04)",
                      }}
                    >
                      {row.qd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
