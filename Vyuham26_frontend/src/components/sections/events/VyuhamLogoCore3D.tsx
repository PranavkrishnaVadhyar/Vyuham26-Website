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

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    /* ── Core Group ── */
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    /* 1 · Holographic Rings */
    const makeRing = (radius: number, tube: number, color: number, opacity: number) => {
      const geom = new THREE.TorusGeometry(radius, tube, 16, 120);
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

    /* 2 · Subtle wireframe geometry envelope around perimeter */
    const wfGeom = new THREE.IcosahedronGeometry(2.1, 1);
    const wfMat = new THREE.MeshBasicMaterial({
      color: 0x18c47c,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.Mesh(wfGeom, wfMat);
    coreGroup.add(wireframe);

    /* 3 · Quantum spark particle swarm */
    const PC = 90;
    const pPos = new Float32Array(PC * 3);
    const pVel = new Float32Array(PC * 3);
    for (let i = 0; i < PC; i++) {
      const r = 1.6 + Math.random() * 1.5;
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
      size: 0.045,
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeom, pMat);
    coreGroup.add(particles);

    /* 4 · Central energy aura point lights */
    const pLight1 = new THREE.PointLight(0x18c47c, 2.4, 12);
    pLight1.position.set(0, 0, 0.5);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x00e5ff, 1.4, 10);
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

      // Wireframe envelope
      wireframe.rotation.y = t * 0.18;
      wireframe.rotation.x = t * 0.12;

      // Particles
      const pos = pGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < PC; i++) {
        pos[i * 3] += pVel[i * 3];
        pos[i * 3 + 1] += pVel[i * 3 + 1];
        pos[i * 3 + 2] += pVel[i * 3 + 2];
        const dSq = pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2;
        if (dSq > 12 || dSq < 2.0) {
          pVel[i * 3] *= -1;
          pVel[i * 3 + 1] *= -1;
          pVel[i * 3 + 2] *= -1;
        }
      }
      pGeom.attributes.position.needsUpdate = true;

      // Gentle energy pulse
      pLight1.intensity = 2.2 + Math.sin(t * 2.4) * 0.5;

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

  const logoImgSize = Math.round(size * 0.44);

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    >
      {/* ── Three.js WebGL Holographic Backdrop ── */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* ── Radial Aura Gradient ── */}
      <div
        className="pointer-events-none absolute inset-4 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(24,196,124,0.22) 0%, rgba(0,229,255,0.08) 50%, transparent 72%)",
        }}
      />

      {/* ── Concentric SVG Guide Circles & Cardinal Ticks ── */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <circle
          cx="50%"
          cy="50%"
          r={size * 0.46}
          fill="none"
          stroke="rgba(24,196,124,0.18)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx="50%"
          cy="50%"
          r={size * 0.38}
          fill="none"
          stroke="rgba(0,229,255,0.15)"
          strokeWidth="1"
        />
        {/* Cardinal tick lines */}
        <line
          x1="50%"
          y1={size * 0.04}
          x2="50%"
          y2={size * 0.09}
          stroke="rgba(24,196,124,0.5)"
          strokeWidth="1.5"
        />
        <line
          x1="50%"
          y1={size * 0.91}
          x2="50%"
          y2={size * 0.96}
          stroke="rgba(24,196,124,0.5)"
          strokeWidth="1.5"
        />
        <line
          x1={size * 0.04}
          y1="50%"
          x2={size * 0.09}
          y2="50%"
          stroke="rgba(24,196,124,0.5)"
          strokeWidth="1.5"
        />
        <line
          x1={size * 0.91}
          y1="50%"
          x2={size * 0.96}
          y2="50%"
          stroke="rgba(24,196,124,0.5)"
          strokeWidth="1.5"
        />
      </svg>

      {/* ── Central Optical Core Housing with VYUHAM'26 Logo ── */}
      <div
        className="pointer-events-auto relative z-10 flex flex-col items-center justify-center rounded-2xl border border-emerald-400/50 bg-[#020704] p-3 backdrop-blur-2xl shadow-[0_0_35px_rgba(24,196,124,0.38),inset_0_0_20px_rgba(24,196,124,0.15)] transition-transform hover:scale-105"
        style={{
          width: `${logoImgSize + 48}px`,
          height: `${logoImgSize + 48}px`,
        }}
      >
        {/* Cyber Tech Corner Brackets */}
        <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-emerald-400" />
        <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-emerald-400" />
        <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-emerald-400" />
        <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-emerald-400" />

        {/* Scanline overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(rgba(24,196,124,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-25" />

        {/* Top Tag */}
        <div className="relative mb-1 flex items-center gap-1 font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>SYSTEM // CORE</span>
        </div>

        {/* Official VYUHAM'26 Logo Image */}
        <img
          src="/vyuham_logo.png"
          alt="VYUHAM'26 Official Logo"
          className="relative object-contain transition-all duration-300 drop-shadow-[0_0_16px_rgba(24,196,124,0.65)]"
          style={{
            width: `${logoImgSize}px`,
            height: `${logoImgSize}px`,
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.endsWith(".png")) {
              target.src = "/vyuham_logo.svg";
            }
          }}
        />

        {/* Bottom Status Tag */}
        <div className="relative mt-1 font-mono text-[6.5px] uppercase tracking-[0.28em] text-[#63907c]">
          FESTIVAL NEXUS
        </div>
      </div>
    </div>
  );
}
