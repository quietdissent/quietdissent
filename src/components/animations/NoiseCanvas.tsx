"use client";

import { useEffect, useRef } from "react";

// ── Inline 2D value noise ──────────────────────────────────────────────────────
function hash(n: number): number {
  n = Math.sin(n) * 43758.5453123;
  return n - Math.floor(n);
}

function noise2d(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash(ix + iy * 57);
  const b = hash(ix + 1 + iy * 57);
  const c = hash(ix + (iy + 1) * 57);
  const d = hash(ix + 1 + (iy + 1) * 57);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number, octaves = 4): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += noise2d(x * freq, y * freq) * amp;
    amp *= 0.5;
    freq *= 2;
  }
  return val;
}
// ──────────────────────────────────────────────────────────────────────────────

const BLOBS = [
  { color: "rgba(95,133,117,0.06)", speed: 0.00018, scale: 0.0018, offsetX: 0.2, offsetY: 0.3 },
  { color: "rgba(229,228,226,0.03)", speed: 0.00012, scale: 0.0014, offsetX: 0.7, offsetY: 0.6 },
  { color: "rgba(95,133,117,0.03)", speed: 0.00022, scale: 0.0022, offsetX: 0.5, offsetY: 0.1 },
];

export default function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let frame = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawBlob = (t: number, blob: typeof BLOBS[0]) => {
      const { color, speed, scale, offsetX, offsetY } = blob;
      const w = canvas.width;
      const h = canvas.height;

      // Sample noise to drive blob center
      const nx = fbm(offsetX + t * speed * 0.7, offsetY + t * speed * 0.3);
      const ny = fbm(offsetX + t * speed * 0.3 + 5, offsetY + t * speed * 0.7 + 5);

      const cx = w * (0.2 + nx * 0.6);
      const cy = h * (0.15 + ny * 0.7);

      // Blob radius driven by noise
      const r = Math.max(w, h) * (0.25 + fbm(offsetX + t * scale, offsetY + t * scale + 3) * 0.2);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.7, fbm(t * 0.0001, 0) * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawGrain = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 2 - 1) * 255 * 0.12;
        d[i] = 128 + v;
        d[i + 1] = 128 + v;
        d[i + 2] = 128 + v;
        d[i + 3] = 18; // ~7% opacity grain
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const render = () => {
      frameId = requestAnimationFrame(render);
      frame++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const blob of BLOBS) {
        drawBlob(frame, blob);
      }

      // Film grain every 3 frames
      if (frame % 3 === 0) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        drawGrain();
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
