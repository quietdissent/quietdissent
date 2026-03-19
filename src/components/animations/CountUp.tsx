"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  start?: string;
  className?: string;
}

export default function CountUp({
  target,
  prefix = "",
  suffix = "",
  duration = 2,
  start = "top 80%",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const objRef = useRef({ val: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    el.textContent = `${prefix}0${suffix}`;

    ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(objRef.current, {
          val: target,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            const v = objRef.current.val;
            const display =
              target % 1 === 0 ? Math.floor(v).toLocaleString() : v.toFixed(0);
            el.textContent = `${prefix}${display}${suffix}`;
          },
        });
      },
    });
  }, [target, prefix, suffix, duration, start]);

  return <span ref={ref} className={className} />;
}
