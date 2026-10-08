"use client";

/**
 * VyuhamLogoCore3D — Dedicated central command core for VYUHAM'26.
 *
 * Sits permanently at the exact 3D origin (x=0, y=0, z=0) of the Event World.
 * Features:
 *  - Official VYUHAM'26 logo prominently at center (always legible)
 *  - Three.js WebGL holographic environment:
 *      • Concentric holographic gimbal rings (emerald & cyan highlights)
 *      • Thin orbital rings tilted on staggered axes
 *      • Slow radial scanning line / sweep
 *      • Quantum spark particle swarm
 *      • Subtle rotating wireframe envelope
 *      • Pulsing energy aura & point lights
 *  - Technical HUD markings: cardinal ticks (00°, 90°, 180°, 270°), reticle brackets
 *
 * Communicates: "VYUHAM'26 is the central system and every event revolves around it."
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface VyuhamLogoCore3DProps {
  size?: number; // Core diameter in pixels (default: 260)
  className?: string;
}

export default function VyuhamLogoCore3D({
  size = 260,
  className = "",
}: VyuhamLogoCore3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = size;
    const H = size;

    /* ── Scene ── */
    const scene = new THREE.Scene();

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const isSmall = size < 150 || (typeof window !== "undefined" && window.innerWidth < 768);

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSmall,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, isSmall ? 1.4 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    /* ── Core Group ── */
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    /* 1 · Holographic Rings */
    const makeRing = (radius: number, tube: number, color: number, opacity: number) => {
      const geom = new THREE.TorusGeometry(radius, tube, 12, isSmall ? 60 : 120);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
      return new THREE.Mesh(geom, mat);
    };

    const ring1 = makeRing(1.85, 0.018, 0x18c47c, 0.75); // Inner emerald ring
    const ring2 = makeRing(2.35, 0.016, 0x00e5ff, 0.60); // Mid cyan ring
    const ring3 = makeRing(2.85, 0.012, 0x18c47c, 0.40); // Outer emerald track
    const ring4 = makeRing(3.20, 0.008, 0x5ff3d2, 0.25); // Halo ring
    coreGroup.add(ring1, ring2, ring3, ring4);

    /* Cardinal node markers on ring2 */
    const nodeGeom = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x5ff3d2 });
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      node.position.set(Math.cos(a) * 2.35, Math.sin(a) * 2.35, 0);
      ring2.add(node);
    }

    /* 2 · Transparent Holographic Energy Sphere & Wireframe Geometry */
    const sphereGeom = new THREE.SphereGeometry(1.35, isSmall ? 16 : 28, isSmall ? 16 : 28);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x18c47c,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const energySphere = new THREE.Mesh(sphereGeom, sphereMat);
    coreGroup.add(energySphere);

    const wfGeom = new THREE.IcosahedronGeometry(2.1, 1);
    const wfMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const wireframe = new THREE.Mesh(wfGeom, wfMat);
    coreGroup.add(wireframe);

    /* 3 · Quantum spark particle swarm */
    const PC = isSmall ? 30 : 90;
    const pPos = new Float32Array(PC * 3);
    const pVel = new Float32Array(PC * 3);
    for (let i = 0; i < PC; i++) {
      const r = 1.5 + Math.random() * 1.6;
      const θ = Math.random() * Math.PI * 2;
      const φ = (Math.random() - 0.5) * Math.PI;
      pPos[i * 3] = r * Math.cos(θ) * Math.cos(φ);
      pPos[i * 3 + 1] = r * Math.sin(φ);
      pPos[i * 3 + 2] = r * Math.sin(θ) * Math.cos(φ);
      pVel[i * 3] = (Math.random() - 0.5) * 0.012;
      pVel[i * 3 + 1] = (Math.random() - 0.5) * 0.012;
      pVel[i * 3 + 2] = (Math.random() - 0.5) * 0.012;
    }
    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x5ff3d2,
      size: isSmall ? 0.038 : 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeom, pMat);
    coreGroup.add(particles);

    /* 4 · Central energy aura point lights */
    const pLight1 = new THREE.PointLight(0x18c47c, 2.6, 12);
    pLight1.position.set(0, 0, 0.5);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x00e5ff, 1.6, 10);
    pLight2.position.set(1.5, 1.5, 1.5);
    scene.add(pLight2);

    /* ── Animation Loop ── */
    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gimbal ring rotations on staggered axes
      ring1.rotation.x = t * 0.55;
      ring1.rotation.y = t * 0.35;
      ring2.rotation.y = -t * 0.45;
      ring2.rotation.z = t * 0.28;
      ring3.rotation.x = Math.sin(t * 0.35) * 0.3;
      ring3.rotation.y = t * 0.22;
      ring4.rotation.z = -t * 0.14;
      ring4.rotation.x = Math.cos(t * 0.25) * 0.25;

      // Energy sphere & wireframe counter-rotations
      energySphere.rotation.y = -t * 0.25;
      energySphere.rotation.x = t * 0.15;
      wireframe.rotation.y = t * 0.18;
      wireframe.rotation.x = t * 0.12;

      // Particles
      const pos = pGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < PC; i++) {
        pos[i * 3] += pVel[i * 3];
        pos[i * 3 + 1] += pVel[i * 3 + 1];
        pos[i * 3 + 2] += pVel[i * 3 + 2];
        const dSq = pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2;
        if (dSq > 12 || dSq < 1.8) {
          pVel[i * 3] *= -1;
          pVel[i * 3 + 1] *= -1;
          pVel[i * 3 + 2] *= -1;
        }
      }
      pGeom.attributes.position.needsUpdate = true;

      // Soft energy pulse
      pLight1.intensity = 2.4 + Math.sin(t * 2.5) * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(raf);
      [ring1, ring2, ring3, ring4].forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      nodeGeom.dispose();
      nodeMat.dispose();
      sphereGeom.dispose();
      sphereMat.dispose();
      wfGeom.dispose();
      wfMat.dispose();
      pGeom.dispose();
      pMat.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.innerHTML = "";
      }
    };
  }, [size]);

  // Clean logo diameter inside energy core (Point 14: desktop 90-140px, tablet 80-120px, mobile 70-100px)
  const logoSize = Math.round(size * 0.44);

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: "translate(-50%, -50%)",
        background: "transparent",
      }}
      aria-hidden="true"
    >
      {/* ── Three.js WebGL Holographic Backdrop (Energy Sphere, Rings, Particles) ── */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

      {/* ── Radial Energy Aura Glow (Transparent Bloom) ── */}
      <div
        className="pointer-events-none absolute inset-4 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(24,196,124,0.32) 0%, rgba(0,229,255,0.14) 45%, transparent 72%)",
        }}
      />

      {/* ── Concentric SVG Guide Circles & Cardinal Ticks ── */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <circle
          cx="50%"
          cy="50%"
          r={size * 0.45}
          fill="none"
          stroke="rgba(24,196,124,0.22)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx="50%"
          cy="50%"
          r={size * 0.36}
          fill="none"
          stroke="rgba(0,229,255,0.18)"
          strokeWidth="1"
        />
        {/* Cardinal tick lines */}
        <line
          x1="50%"
          y1={size * 0.04}
          x2="50%"
          y2={size * 0.08}
          stroke="rgba(24,196,124,0.6)"
          strokeWidth="1.5"
        />
        <line
          x1="50%"
          y1={size * 0.92}
          x2="50%"
          y2={size * 0.96}
          stroke="rgba(24,196,124,0.6)"
          strokeWidth="1.5"
        />
        <line
          x1={size * 0.04}
          y1="50%"
          x2={size * 0.08}
          y2="50%"
          stroke="rgba(24,196,124,0.6)"
          strokeWidth="1.5"
        />
        <line
          x1={size * 0.92}
          y1="50%"
          x2={size * 0.96}
          y2="50%"
          stroke="rgba(24,196,124,0.6)"
          strokeWidth="1.5"
        />
      </svg>

      {/* ── Official VYUHAM'26 Logo Floating Directly in the Energy Core (NO RECTANGULAR BOX, NO BLACK BG) ── */}
      <div
        className="pointer-events-auto relative z-10 flex items-center justify-center transition-transform hover:scale-108"
        style={{
          width: `${logoSize}px`,
          height: `${logoSize}px`,
          background: "transparent",
        }}
      >
        <img
          src="/vyuham_logo.png"
          alt="VYUHAM'26 Official Logo"
          className="relative h-full w-full object-contain filter drop-shadow-[0_0_26px_rgba(24,196,124,0.95)]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.endsWith(".png")) {
              target.src = "/vyuham_logo.svg";
            }
          }}
        />
      </div>
    </div>
  );
}
