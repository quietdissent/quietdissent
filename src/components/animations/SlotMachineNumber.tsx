"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SlotMachineNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

export default function SlotMachineNumber({
  value,
  prefix = "",
  suffix = "",
}: SlotMachineNumberProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  // Format the number (1200 → "1,200")
  const formatted = value.toLocaleString();
  const chars = formatted.split("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = containerRef.current;
    if (!el) return;

    const cols = Array.from(el.querySelectorAll<HTMLDivElement>("[data-slot-digit]"));

    // Set all columns to start at digit 9
    cols.forEach((col) => {
      gsap.set(col, { yPercent: -90 });
    });

    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        cols.forEach((col, i) => {
          const digit = parseInt(col.dataset.slotDigit || "0", 10);
          gsap.to(col, {
            yPercent: -(digit * 10),
            duration: 1.2,
            ease: "expo.out",
            delay: i * 0.1,
          });
        });
      },
    });
  }, []);

  return (
    <span ref={containerRef} style={{ display: "inline-flex", alignItems: "baseline" }}>
      {prefix && <span>{prefix}</span>}
      {chars.map((char, i) => {
        if (/\d/.test(char)) {
          const digit = parseInt(char, 10);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                height: "1em",
                verticalAlign: "bottom",
              }}
            >
              {/* Column of digits 0–9; yPercent targets digit position */}
              <div
                data-slot-digit={digit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  willChange: "transform",
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <span
                    key={n}
                    style={{
                      display: "block",
                      height: "1em",
                      lineHeight: 1,
                      textAlign: "center",
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </span>
          );
        }
        // Non-digit characters (commas, spaces) render statically
        return (
          <span key={i} style={{ display: "inline-block" }}>
            {char}
          </span>
        );
      })}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
