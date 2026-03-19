"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  start?: string;
  triggerOnLoad?: boolean;
}

export default function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  y = 24,
  x = 0,
  scale = 1,
  start = "top 80%",
  triggerOnLoad = false,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y, x, scale });

    const anim = () => {
      gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration, ease: "power3.out", delay });
    };

    if (triggerOnLoad) {
      setTimeout(anim, delay * 1000);
    } else {
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: anim,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [delay, duration, y, triggerOnLoad]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
