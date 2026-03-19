"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  triggerOnLoad?: boolean;
}

export default function TextScramble({
  text,
  className = "",
  delay = 500,
  triggerOnLoad = true,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef<number>(0);
  const iterRef = useRef(0);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scramble = () => {
      let iter = 0;
      const totalLen = text.length;

      const tick = () => {
        const output = text
          .split("")
          .map((char, index) => {
            if (index < iter) return char;
            if (char === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setDisplayed(output);
        iter += 0.5;
        iterRef.current = iter;

        if (iter < totalLen) {
          frameRef.current = requestAnimationFrame(tick);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    if (triggerOnLoad) {
      const timer = setTimeout(scramble, delay);
      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(frameRef.current);
      };
    }

    // IntersectionObserver for scroll-triggered
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scramble();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, delay, triggerOnLoad]);

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {displayed}
    </span>
  );
}
