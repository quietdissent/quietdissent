"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollThread — a single organic SVG path that draws itself as the user scrolls.
 * Positioned absolutely in page.tsx, starts at the bottom of the hero and threads
 * through every section to the footer.
 *
 * Technique: stroke-dashoffset driven by window.scrollY progress.
 * The path itself is designed to weave left/right — organic, not straight.
 */
export default function ScrollThread() {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      // Start drawing after hero (100vh), finish at document end
      const startY = window.innerHeight * 0.9;
      const endY = document.body.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (scrollTop - startY) / (endY - startY)));
      path.style.strokeDashoffset = `${length * (1 - progress)}`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        // Start just below the hero — 100vh down from page top
        top: "100vh",
        left: 0,
        width: "100%",
        // Tall enough to cover all sections below the hero
        height: "calc(100% - 100vh)",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "visible",
      }}
      preserveAspectRatio="none"
      viewBox="0 0 1440 6000"
    >
      <path
        ref={pathRef}
        d={`
          M 720 0
          C 720 80, 820 120, 800 220
          C 780 320, 640 360, 660 480
          C 680 600, 820 620, 840 760
          C 860 900, 700 940, 680 1080
          C 660 1200, 780 1260, 800 1380
          Q 820 1460, 760 1540
          C 700 1620, 580 1640, 560 1760
          C 540 1880, 680 1920, 700 2060
          C 720 2200, 600 2260, 580 2380
          C 560 2500, 700 2540, 720 2680
          C 740 2820, 620 2860, 600 3000
          C 580 3120, 720 3160, 740 3300
          C 760 3420, 660 3480, 640 3600
          C 620 3700, 740 3740, 760 3860
          C 780 3980, 680 4040, 660 4160
          C 640 4280, 760 4300, 780 4420
          C 800 4540, 700 4600, 680 4720
          C 660 4840, 760 4880, 760 5000
          C 760 5120, 680 5180, 680 5300
          L 680 6000
        `}
        fill="none"
        stroke="#5F8575"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        style={{ transition: "stroke-dashoffset 0.05s linear" }}
      />
    </svg>
  );
}
