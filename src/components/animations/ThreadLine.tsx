"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ThreadLine — a thin animated sage green left-border that draws itself in
 * as the section enters the viewport. Drop it inside any light section as the
 * first child to carry the visual language from HowItWorks through the page.
 *
 * Usage:
 *   <section>
 *     <ThreadLine />
 *     ... rest of section content
 *   </section>
 */
export default function ThreadLine() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = lineRef.current;
    if (!el) return;

    gsap.set(el, { scaleY: 0, transformOrigin: "top center" });

    const st = ScrollTrigger.create({
      trigger: el.parentElement,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          scaleY: 1,
          duration: 1.2,
          ease: "power3.out",
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div
      ref={lineRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "1px",
        background: "#5F8575",
        opacity: 0.35,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
