import RevealText from "@/components/animations/RevealText";

interface SectionHeadingProps {
  children: string;
  className?: string;
  centered?: boolean;
}

export default function SectionHeading({ children, className = "", centered = false }: SectionHeadingProps) {
  return (
    <RevealText
      as="h2"
      className={`${centered ? "text-center" : ""} ${className}`}
      style={{
        fontFamily: "var(--font-instrument), serif",
        fontSize: "clamp(32px, 4vw, 56px)",
        color: "var(--text-primary)",
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
      }}
    >
      {children}
    </RevealText>
  );
}
