"use client";

import { useRef, useState } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.15,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-12, Math.min(12, (e.clientX - cx) * strength));
    const dy = Math.max(-12, Math.min(12, (e.clientY - cy) * strength));
    setPos({ x: dx, y: dy });
  };

  const onMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
        onClick={onClick}
        className={className}
      >
        {children}
      </div>
    </div>
  );
}
