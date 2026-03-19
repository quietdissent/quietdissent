"use client";

import MagneticButton from "@/components/animations/MagneticButton";
import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "var(--font-inter), sans-serif",
    fontWeight: 500,
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
  };

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      ...baseStyle,
      background: "var(--highlight)",
      color: "#FFFFFF",
      padding: "14px 28px",
      borderRadius: "4px",
      border: "none",
    },
    secondary: {
      ...baseStyle,
      background: "transparent",
      color: "var(--accent)",
      padding: "14px 28px",
      borderRadius: "4px",
      border: "1px solid var(--accent)",
    },
    ghost: {
      ...baseStyle,
      background: "transparent",
      color: "var(--text-secondary)",
      padding: "4px 0",
      borderBottom: "1px solid var(--text-muted)",
    },
  };

  const inner = (
    <motion.a
      href={href}
      onClick={onClick}
      style={styles[variant]}
      className={className}
      whileHover={
        variant === "primary"
          ? { background: "var(--accent-hover)" }
          : variant === "secondary"
          ? { background: "var(--accent)", color: "var(--bg-primary)" }
          : { borderColor: "var(--accent)" }
      }
    >
      {children}
    </motion.a>
  );

  return <MagneticButton>{inner}</MagneticButton>;
}
