"use client";

import { useEffect, useRef } from "react";

// Smooth noise via layered sine — continuous, never repeats
function sNoise(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 1.7 + t * 1.1) * 0.5 +
    Math.sin(y * 2.3 + t * 0.7) * 0.3 +
    Math.sin((x - y) * 1.2 + t * 1.9) * 0.2
  );
}

interface Blob {
  cx: number;   // center x as fraction of canvas width
  cy: number;   // center y as fraction of canvas height
  baseR: number; // base radius as fraction of min(w,h)
  color: string;
  speed: number; // time multiplier
  offset: number; // noise offset so blobs don't move in sync
}

function drawBlob(
  ctx: CanvasRenderingContext2D,
  blob: Blob,
  t: number,
  w: number,
  h: number
) {
  const POINTS = 6;
  const centerX = blob.cx * w;
  const centerY = blob.cy * h;
  const r = blob.baseR * Math.min(w, h);

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < POINTS; i++) {
    const angle = (i / POINTS) * Math.PI * 2;
    const nx = Math.cos(angle) + blob.offset;
    const ny = Math.sin(angle) + blob.offset;
    const n = sNoise(nx, ny, t * blob.speed);
    const radius = r * (1 + n * 0.28);
    pts.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }

  ctx.beginPath();
  const last = pts[POINTS - 1];
  const first = pts[0];
  ctx.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);
  for (let i = 0; i < POINTS; i++) {
    const curr = pts[i];
    const next = pts[(i + 1) % POINTS];
    ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
  }
  ctx.closePath();
  ctx.fillStyle = blob.color;
  ctx.fill();
}

const BLOBS: Blob[] = [
  { cx: 0.5,  cy: 0.4,  baseR: 0.45, color: "rgba(95,133,117,0.06)",  speed: 0.6, offset: 0  },
  { cx: 0.3,  cy: 0.65, baseR: 0.3,  color: "rgba(229,228,226,0.08)", speed: 0.9, offset: 10 },
  { cx: 0.72, cy: 0.55, baseR: 0.22, color: "rgba(95,133,117,0.04)",  speed: 0.4, offset: 20 },
];

export default function LiquidEther() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    let rafId = 0;
    let frameCount = 0;

    const render = () => {
      rafId = requestAnimationFrame(render);
      if (document.hidden) return;

      // Target ~30fps on mobile: skip odd frames
      frameCount++;
      if (frameCount % 2 !== 0) return;

      t += 0.0006;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      BLOBS.forEach((blob) => drawBlob(ctx, blob, t, w, h));
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
