"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: string;
  className?: string;
  as?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  triggerOnLoad?: boolean;
}

export default function RevealText({
  children,
  className = "",
  as: Tag = "p",
  style,
  delay = 0,
  stagger = 0.05,
  triggerOnLoad = false,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;

    const words = children.split(" ");
    el.innerHTML = words
      .map(
        (word) =>
          `<span style="display:inline-block; overflow:hidden; vertical-align:bottom; padding-bottom:0.1em;"><span class="word-inner" style="display:inline-block; transform:translateY(110%) skewY(4deg);">${word}&nbsp;</span></span>`
      )
      .join("");

    const wordInners = el.querySelectorAll(".word-inner");

    const anim = () => {
      gsap.to(wordInners, {
        y: 0,
        skewY: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger,
        delay,
      });
    };

    if (triggerOnLoad) {
      gsap.set(wordInners, { y: "110%", skewY: 4 });
      setTimeout(anim, delay * 1000);
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: anim,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [children, delay, stagger, triggerOnLoad]);

  const AnyTag = Tag as React.ElementType;

  return (
    <AnyTag ref={containerRef} className={className} style={style}>
      {children}
    </AnyTag>
  );
}
