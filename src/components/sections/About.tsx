"use client";

import FadeIn from "@/components/animations/FadeIn";

const paragraphs = [
  "Quiet Dissent was built on a contrarian idea: the best person to design AI for a small business isn't the one who knows the most about AI. It's the one who knows the most about how the business actually runs.",
  "We come from frontline operations. We've answered the phones, managed the intake, handled the scheduling. We know which calls are urgent and which aren't. We know how leads get lost and why follow-up falls through. That operational knowledge is the foundation everything else is built on.",
  "We started Quiet Dissent because Nashville's small businesses deserve strategic partnership — not just a tool installation. Because the kind of thinking that used to cost $50,000 shouldn't be out of reach for the businesses that need it most.",
  "We built this to give Nashville business owners something worth fighting for: time that's yours. Systems that work without you in every room. A business that doesn't own your life — so the people who matter to you get the best of you, not what's left.",
];

export default function About() {
  return (
    <section
      id="about"
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
              marginBottom: "64px",
            }}
          >
            The Advisor Who&apos;s Been on the Other Side.
          </h2>
        </FadeIn>

        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {paragraphs.map((para, i) => (
            <FadeIn key={i} delay={i * 0.1} y={40}>
              <p
                data-cursor="text"
                style={{
                  fontFamily: "var(--font-body), serif",
                  fontSize: "20px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: "32px",
                }}
              >
                {para}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
