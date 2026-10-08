"use client";

/**
 * SecretCore3D — Premium Three.js WebGL scene: the classified Day-03 orbital artifact.
 *
 * Renders:
 *  - Faceted icosahedron nucleus (solid + wireframe)
 *  - Pulsing inner energy sphere
 *  - Three concentric gimbal rings (rotating on staggered axes)
 *  - Orbiting spark / particle swarm
 *  - Vertical holographic beam (DoubleSide cylinder)
 *  - Polar radar-grid floor
 *  - Two point lights (green + cyan)
 *  - Optional glitch jitter
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SecretCore3DProps {
  isGlitching?: boolean;
  className?: string;
}

export default function SecretCore3D({
  isGlitching = false,
  className = "",
}: SecretCore3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth  || 320;
    const H = container.clientHeight || 320;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.fog   = new THREE.FogExp2(0x020504, 0.032);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 100);
    camera.position.set(0, 0.7, 8.5);

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias:       true,
      alpha:           true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML          = "";
    container.appendChild(renderer.domElement);

    /* ── Core group ── */
    const core = new THREE.Group();
    scene.add(core);

    /* 1 · Nucleus — solid icosahedron */
    const nucGeom = new THREE.IcosahedronGeometry(1.22, 1);
    const nucMat  = new THREE.MeshBasicMaterial({
      color:       0x061b10,
      transparent: true,
      opacity:     0.88,
    });
    const nucleus = new THREE.Mesh(nucGeom, nucMat);
    core.add(nucleus);

    /* 1b · Wireframe shell */
    const wfGeom = new THREE.IcosahedronGeometry(1.26, 1);
    const wfMat  = new THREE.MeshBasicMaterial({
      color:       0x18c47c,
      wireframe:   true,
      transparent: true,
      opacity:     0.92,
    });
    const wireframe = new THREE.Mesh(wfGeom, wfMat);
    core.add(wireframe);

    /* 1c · Inner pulsing energy sphere */
    const sGeom = new THREE.SphereGeometry(0.72, 24, 24);
    const sMat  = new THREE.MeshBasicMaterial({
      color:       0x00f5d4,
      transparent: true,
      opacity:     0.42,
    });
    const innerSphere = new THREE.Mesh(sGeom, sMat);
    core.add(innerSphere);

    /* 2 · Concentric gimbal rings — deliberately large so they extend
       visually beyond the event cards that orbit in front of the core */
    const makeRing = (
      radius: number,
      tube: number,
      color: number,
      opacity: number
    ) => {
      const g = new THREE.TorusGeometry(radius, tube, 16, 110);
      const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
      return new THREE.Mesh(g, m);
    };

    const ring1 = makeRing(1.90, 0.022, 0x0df5a2, 0.88);  // fast inner ring
    const ring2 = makeRing(2.55, 0.024, 0x00e5ff, 0.72);  // mid ring
    const ring3 = makeRing(3.40, 0.016, 0x18c47c, 0.38);  // outer wide ring — visible beyond front card
    const ring4 = makeRing(3.95, 0.010, 0x0df5a2, 0.20);  // outermost halo ring
    core.add(ring1, ring2, ring3, ring4);

    /* Cardinal node markers on ring2 */
    const nodeMat  = new THREE.MeshBasicMaterial({ color: 0x7dffc4 });
    const nodeGeom = new THREE.BoxGeometry(0.09, 0.09, 0.09);
    for (let i = 0; i < 4; i++) {
      const a    = (i * Math.PI) / 2;
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      node.position.set(Math.cos(a) * 2.55, Math.sin(a) * 2.55, 0);
      ring2.add(node);
    }

    /* 3 · Vertical holographic carrier beam */
    const beamGeom = new THREE.CylinderGeometry(0.07, 0.22, 7.8, 16, 1, true);
    const beamMat  = new THREE.MeshBasicMaterial({
      color:       0x18c47c,
      transparent: true,
      opacity:     0.13,
      side:        THREE.DoubleSide,
    });
    core.add(new THREE.Mesh(beamGeom, beamMat));

    /* 4 · Quantum particle swarm */
    const PC       = 160;
    const pPos     = new Float32Array(PC * 3);
    const pVel     = new Float32Array(PC * 3);

    for (let i = 0; i < PC; i++) {
      const r   = 1.5 + Math.random() * 2.0;
      const θ   = Math.random() * Math.PI * 2;
      const φ   = (Math.random() - 0.5) * Math.PI;
      pPos[i*3]   = r * Math.cos(θ) * Math.cos(φ);
      pPos[i*3+1] = r * Math.sin(φ);
      pPos[i*3+2] = r * Math.sin(θ) * Math.cos(φ);
      pVel[i*3]   = (Math.random() - 0.5) * 0.015;
      pVel[i*3+1] = (Math.random() - 0.5) * 0.015;
      pVel[i*3+2] = (Math.random() - 0.5) * 0.015;
    }

    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color:    0x5ff3d2,
      size:     0.048,
      transparent: true,
      opacity:  0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeom, pMat);
    core.add(particles);

    /* 5 · Radar grid floor */
    const grid = new THREE.PolarGridHelper(4.8, 6, 8, 48, 0x18c47c, 0x0b3a28);
    const gMat = grid.material as THREE.LineBasicMaterial;
    if (gMat) { gMat.transparent = true; gMat.opacity = 0.2; }
    scene.add(grid);

    /* ── Lights ── */
    const pLight1 = new THREE.PointLight(0x0df5a2, 3.0, 16);
    pLight1.position.set(0, 0, 0);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x00e5ff, 1.8, 13);
    pLight2.position.set(2, 2, 2);
    scene.add(pLight2);

    /* ── Resize ── */
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth  || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* ── Animation loop ── */
    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      /* Nucleus */
      nucleus.rotation.y   =  t * 0.36;
      nucleus.rotation.x   =  t * 0.21;
      wireframe.rotation.y = -t * 0.46;
      wireframe.rotation.z =  t * 0.26;

      /* Inner sphere pulse */
      const pulse = 1 + Math.sin(t * 3.3) * 0.09;
      innerSphere.scale.setScalar(pulse);

      /* Gimbal rings */
      ring1.rotation.x =  t * 0.82;
      ring1.rotation.y =  t * 0.51;
      ring2.rotation.y = -t * 0.67;
      ring2.rotation.z =  t * 0.41;
      ring3.rotation.x =  Math.sin(t * 0.42) * 0.4;
      ring3.rotation.y =  t * 0.31;
      ring4.rotation.z = -t * 0.18;
      ring4.rotation.x =  Math.cos(t * 0.28) * 0.3;

      /* Particles */
      const pos = pGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < PC; i++) {
        pos[i*3]   += pVel[i*3];
        pos[i*3+1] += pVel[i*3+1];
        pos[i*3+2] += pVel[i*3+2];
        const dSq = pos[i*3]**2 + pos[i*3+1]**2 + pos[i*3+2]**2;
        if (dSq > 13 || dSq < 1.4) {
          pVel[i*3]   *= -1;
          pVel[i*3+1] *= -1;
          pVel[i*3+2] *= -1;
        }
      }
      pGeom.attributes.position.needsUpdate = true;

      /* Grid slow spin */
      grid.rotation.y = t * 0.055;

      /* Light pulse */
      pLight1.intensity = 2.8 + Math.sin(t * 2.1) * 0.6;

      /* Glitch jitter */
      if (isGlitching) {
        core.position.x = (Math.random() - 0.5) * 0.14;
        core.position.y = (Math.random() - 0.5) * 0.09;
      } else {
        core.position.x = 0;
        core.position.y = Math.sin(t * 1.45) * 0.055;
      }

      renderer.render(scene, camera);
    };

    animate();

    /* ── Cleanup ── */
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);

      [nucGeom, wfGeom, sGeom, beamGeom, pGeom, nodeGeom].forEach((g) => g.dispose());
      [nucMat, wfMat, sMat, beamMat, pMat, nodeMat].forEach((m) => m.dispose());
      ring1.geometry.dispose(); (ring1.material as THREE.Material).dispose();
      ring2.geometry.dispose(); (ring2.material as THREE.Material).dispose();
      ring3.geometry.dispose(); (ring3.material as THREE.Material).dispose();
      ring4.geometry.dispose(); (ring4.material as THREE.Material).dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.innerHTML = "";
      }
    };
  }, [isGlitching]);

  return (
    <div
      ref={mountRef}
      className={`relative h-full w-full pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
}
