"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 120;
const CONNECTION_DISTANCE = 120;
const MOUSE_RADIUS = 150;
const MOUSE_STRENGTH = 0.02;

export default function NodeNetwork() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = mountRef.current;
    if (!el) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 2000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Nodes
    const positions: number[] = [];
    const velocities: THREE.Vector3[] = [];
    const origPositions: THREE.Vector3[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 800;
      const y = (Math.random() - 0.5) * 600;
      const z = (Math.random() - 0.5) * 400;
      positions.push(x, y, z);
      origPositions.push(new THREE.Vector3(x, y, z));
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.1,
      ));
    }

    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(positions);
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));

    const nodeMat = new THREE.PointsMaterial({
      color: 0x5f8575,
      size: 2.5,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(nodeGeo, nodeMat);
    scene.add(points);

    // Lines (pre-allocate max possible connections)
    const maxLines = NODE_COUNT * NODE_COUNT;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.3 })
    );
    scene.add(lineMat);

    // Mouse
    const mouse = new THREE.Vector2(9999, 9999);
    const mouseWorld = new THREE.Vector3(9999, 9999, 0);

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseWorld.set(mouse.x * 400, mouse.y * 300, 0);
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation
    let frameId: number;
    const tempVec = new THREE.Vector3();
    const color = new THREE.Color();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Rotate scene slowly
      points.rotation.y += 0.0003;
      points.rotation.x += 0.0001;
      lineMat.rotation.y += 0.0003;
      lineMat.rotation.x += 0.0001;

      const pos = nodeGeo.attributes.position as THREE.BufferAttribute;

      // Update node positions with drift + mouse attraction
      for (let i = 0; i < NODE_COUNT; i++) {
        const i3 = i * 3;
        let x = pos.array[i3];
        let y = pos.array[i3 + 1];
        let z = pos.array[i3 + 2];

        // Drift
        x += velocities[i].x;
        y += velocities[i].y;
        z += velocities[i].z;

        // Soft boundary — return toward origin
        const ox = origPositions[i].x;
        const oy = origPositions[i].y;
        const oz = origPositions[i].z;
        velocities[i].x += (ox - x) * 0.0005;
        velocities[i].y += (oy - y) * 0.0005;
        velocities[i].z += (oz - z) * 0.0005;

        // Mouse attraction
        tempVec.set(x, y, z);
        const dist = tempVec.distanceTo(mouseWorld);
        if (dist < MOUSE_RADIUS) {
          const strength = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
          velocities[i].x += (mouseWorld.x - x) * strength;
          velocities[i].y += (mouseWorld.y - y) * strength;
        }

        // Dampen
        velocities[i].multiplyScalar(0.98);

        (pos.array as Float32Array)[i3] = x;
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
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = 1 - dist / CONNECTION_DISTANCE;
            color.setRGB(0.373, 0.522, 0.459); // #5F8575

            const idx = lineCount * 6;
            (lp.array as Float32Array)[idx] = ax;
            (lp.array as Float32Array)[idx + 1] = ay;
            (lp.array as Float32Array)[idx + 2] = az;
            (lp.array as Float32Array)[idx + 3] = bx;
            (lp.array as Float32Array)[idx + 4] = by;
            (lp.array as Float32Array)[idx + 5] = bz;

            (lc.array as Float32Array)[idx] = color.r * alpha;
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
      (lineMat.material as THREE.Material).dispose();
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
