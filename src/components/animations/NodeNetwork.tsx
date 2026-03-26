"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Tuning constants ─────────────────────────────────────────────────────────
const NODE_COUNT = 60;           // was 120 — fewer = cleaner
const CONNECTION_DISTANCE = 185; // was 120 — longer, more organic strings
const NODE_OPACITY = 0.6;
const LINE_OPACITY = 0.35;       // was 0.3 — much subtler
const NODE_SIZE = 2.0;
const DRIFT_SPEED = 0.2;         // was 0.3 — slower, more meditative
const MOUSE_RADIUS = 140;
const MOUSE_STRENGTH = 0.016;

// Spawn bias: 30% left (headline breathing room), 70% right (visual interest)
const LEFT_BIAS_THRESHOLD = 0.3;
const LEFT_X_MAX = 0.38;
const RIGHT_X_MIN = 0.42;

interface NodeNetworkProps {
  /**
   * 0–1 opacity multiplier driven by scroll.
   * Hero passes this down to fade the network as the section exits.
   * Defaults to 1 (fully visible).
   */
  scrollOpacity?: number;
}

export default function NodeNetwork({ scrollOpacity = 1 }: NodeNetworkProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const opacityRef = useRef(scrollOpacity);

  useEffect(() => {
    opacityRef.current = scrollOpacity;
  }, [scrollOpacity]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = mountRef.current;
    if (!el) return;

    // ── Scene setup ──────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      el.clientWidth / el.clientHeight,
      0.1,
      2000
    );
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Nodes ────────────────────────────────────────────────────────────────
    const sceneW = 800;
    const sceneH = 600;

    const positions: number[] = [];
    const velocities: THREE.Vector3[] = [];
    const origPositions: THREE.Vector3[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      let x: number;
      if (Math.random() < LEFT_BIAS_THRESHOLD) {
        x = (Math.random() - 0.5) * sceneW * LEFT_X_MAX;
      } else {
        x = RIGHT_X_MIN * sceneW * 0.5 + Math.random() * sceneW * (1 - RIGHT_X_MIN);
      }
      const y = (Math.random() - 0.5) * sceneH;
      const z = (Math.random() - 0.5) * 300;

      positions.push(x, y, z);
      origPositions.push(new THREE.Vector3(x, y, z));
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * DRIFT_SPEED,
          (Math.random() - 0.5) * DRIFT_SPEED,
          (Math.random() - 0.5) * DRIFT_SPEED * 0.4
        )
      );
    }

    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(positions);
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));

    const nodeMat = new THREE.PointsMaterial({
      color: 0x5f8575,
      size: NODE_SIZE,
      transparent: true,
      opacity: NODE_OPACITY,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(nodeGeo, nodeMat);
    scene.add(points);

    // ── Lines ────────────────────────────────────────────────────────────────
    const maxLines = NODE_COUNT * NODE_COUNT;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMesh = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: LINE_OPACITY,
      })
    );
    scene.add(lineMesh);

    // ── Mouse ─────────────────────────────────────────────────────────────────
    const mouseWorld = new THREE.Vector3(9999, 9999, 0);

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseWorld.set(nx * 400, ny * 300, 0);
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────────────
    let frameId: number;
    const tempVec = new THREE.Vector3();
    const color = new THREE.Color();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Very slow rotation — just enough to feel alive
      points.rotation.y += 0.00015;
      points.rotation.x += 0.00005;
      lineMesh.rotation.y += 0.00015;
      lineMesh.rotation.x += 0.00005;

      const pos = nodeGeo.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < NODE_COUNT; i++) {
        const i3 = i * 3;
        let x = pos.array[i3];
        let y = pos.array[i3 + 1];
        let z = pos.array[i3 + 2];

        x += velocities[i].x;
        y += velocities[i].y;
        z += velocities[i].z;

        velocities[i].x += (origPositions[i].x - x) * 0.0004;
        velocities[i].y += (origPositions[i].y - y) * 0.0004;
        velocities[i].z += (origPositions[i].z - z) * 0.0004;

        tempVec.set(x, y, z);
        const dist = tempVec.distanceTo(mouseWorld);
        if (dist < MOUSE_RADIUS) {
          const strength = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
          velocities[i].x += (mouseWorld.x - x) * strength;
          velocities[i].y += (mouseWorld.y - y) * strength;
        }

        velocities[i].multiplyScalar(0.985);

        (pos.array as Float32Array)[i3]     = x;
        (pos.array as Float32Array)[i3 + 1] = y;
        (pos.array as Float32Array)[i3 + 2] = z;
      }
      pos.needsUpdate = true;

      // Rebuild connection lines
      const lp = lineGeo.attributes.position as THREE.BufferAttribute;
      const lc = lineGeo.attributes.color as THREE.BufferAttribute;
      let lineCount = 0;

      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const ax = (pos.array as Float32Array)[i * 3];
          const ay = (pos.array as Float32Array)[i * 3 + 1];
          const az = (pos.array as Float32Array)[i * 3 + 2];
          const bx = (pos.array as Float32Array)[j * 3];
          const by = (pos.array as Float32Array)[j * 3 + 1];
          const bz = (pos.array as Float32Array)[j * 3 + 2];

          const dx = ax - bx;
          const dy = ay - by;
          const dz = az - bz;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (d < CONNECTION_DISTANCE) {
            const alpha = 1 - d / CONNECTION_DISTANCE;
            color.setRGB(0.373, 0.522, 0.459); // #5F8575

            const idx = lineCount * 6;
            (lp.array as Float32Array)[idx]     = ax;
            (lp.array as Float32Array)[idx + 1] = ay;
            (lp.array as Float32Array)[idx + 2] = az;
            (lp.array as Float32Array)[idx + 3] = bx;
            (lp.array as Float32Array)[idx + 4] = by;
            (lp.array as Float32Array)[idx + 5] = bz;

            (lc.array as Float32Array)[idx]     = color.r * alpha;
            (lc.array as Float32Array)[idx + 1] = color.g * alpha;
            (lc.array as Float32Array)[idx + 2] = color.b * alpha;
            (lc.array as Float32Array)[idx + 3] = color.r * alpha;
            (lc.array as Float32Array)[idx + 4] = color.g * alpha;
            (lc.array as Float32Array)[idx + 5] = color.b * alpha;

            lineCount++;
          }
        }
      }

      lineGeo.setDrawRange(0, lineCount * 2);
      lp.needsUpdate = true;
      lc.needsUpdate = true;

      // Apply scroll-driven opacity from parent
      const op = opacityRef.current;
      nodeMat.opacity = NODE_OPACITY * op;
      (lineMesh.material as THREE.LineBasicMaterial).opacity = LINE_OPACITY * op;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      nodeGeo.dispose();
      lineGeo.dispose();
      nodeMat.dispose();
      (lineMesh.material as THREE.Material).dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
