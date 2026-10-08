"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { cyberAudio } from "@/lib/cyberAudio";

/* ------------------------------------------------------------------ */
/*  CAMPUS ZONES DATA                                                 */
/* ------------------------------------------------------------------ */
export interface CampusZone {
  id: string;
  name: string;
  code: string;
  type: "TECH" | "CULTURE" | "CYBER" | "GAMING" | "FORUM" | "OPEN";
  color: string;
  position: [number, number, number]; // [x, y, z] in 3D world
  size: [number, number, number]; // [width, height, depth]
  description: string;
  capacity: string;
  events: string[];
  features: string[];
}

export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: "innovation-hub",
    name: "Innovation Core & Tech Lab",
    code: "IC-01",
    type: "TECH",
    color: "#18c47c",
    position: [-18, 0, -12],
    size: [12, 10, 10],
    description: "Multilevel research complex and computer labs hosting the 24HR Hackathon and LLM workshops.",
    capacity: "850 Operatives",
    events: ["Hackathon — 24HR", "Prompt War", "Prompt Engineering Workshop"],
    features: ["Gigabit Fiber Grid", "Hardware Prototyping Labs", "Chilled Nitrogen Cooling Deck"],
  },
  {
    id: "main-stage",
    name: "Open Air Stage",
    code: "MS-02",
    type: "CULTURE",
    color: "#d5a7ff",
    position: [18, 0, -14],
    size: [14, 8, 12],
    description: "Grand amphitheatre stage for ceremonies, cultural night, fashion show, and headlining closing concert.",
    capacity: "3,500 Spectators",
    events: ["Inauguration Ceremony", "Cultural Night", "DJ Night", "Fashion Show", "Concert Night"],
    features: ["L-Acoustics Spatial Sound", "120kW Intelligent Lighting Rig", "Hydraulic Center Lift"],
  },
  {
    id: "cyber-arena",
    name: "Computer Lab & Cyber Arena",
    code: "CA-03",
    type: "CYBER",
    color: "#00e5ff",
    position: [-22, 0, 14],
    size: [10, 7, 10],
    description: "Computer lab facility hosting national Capture The Flag (CTF) and ethical hacking workshops.",
    capacity: "400 Hackers",
    events: ["Capture the Flag", "Ethical Hacking & OSINT Workshop", "Cybersecurity Careers Panel"],
    features: ["Air-Gapped Private Subnet", "Red/Blue Dual Battle Pits", "Live Threat Scoreboard Matrix"],
  },
  {
    id: "esports-stadium",
    name: "Esports & Gaming Colosseum",
    code: "EA-04",
    type: "GAMING",
    color: "#ff3d71",
    position: [20, 0, 12],
    size: [12, 6, 12],
    description: "State-of-the-art gaming arena with spectator setup for championship esports tournaments.",
    capacity: "1,200 Spectators",
    events: ["Valorant Tournament", "BGMI Tournament", "E-Football Tournament"],
    features: ["500Hz OLED Tournament Rigs", "Direct Broadcast Production Booth", "Acoustic Noise-Canceling Pods"],
  },
  {
    id: "convention-center",
    name: "Gallery Hall & Seminar Center",
    code: "CH-05",
    type: "FORUM",
    color: "#ffd166",
    position: [0, 0, -22],
    size: [16, 12, 10],
    description: "Multi-purpose auditorium hosting management strategy games, startup showcase, and AI keynotes.",
    capacity: "1,800 Attendees",
    events: ["Best Manager", "Best Management Team", "Business Quiz", "State of Agentic AI Talk"],
    features: ["Simultaneous Translation System", "Broadcast Studio", "VIP Executive Lounges"],
  },
  {
    id: "amphitheatre",
    name: "Seminar Hall",
    code: "AM-06",
    type: "CULTURE",
    color: "#a78bfa",
    position: [26, 0, -2],
    size: [10, 4, 10],
    description: "Acoustic seminar hall hosting key research panels, debate, and quantum computing sessions.",
    capacity: "900 Attendees",
    events: ["Responsible AI Panel", "Quantum Computing Meets AI Talk", "Debate — Open Floor"],
    features: ["Natural Terrain Acoustics", "Atmospheric Projection Mapping", "Surround Ambient Audio"],
  },
  {
    id: "food-commons",
    name: "Campus Grounds & Food Court",
    code: "FP-07",
    type: "OPEN",
    color: "#06d6a0",
    position: [-2, 0, 8],
    size: [14, 3, 10],
    description: "Technocity campus grounds featuring food court, markets, stalls, and open contests.",
    capacity: "2,000 Capacity",
    events: ["Food Court, Markets & Stalls", "Play Fest", "Fitness Competition", "Photography Contest"],
    features: ["RFID / QR Instant Top-Up Stalls", "High-Speed Chillout Wi-Fi", "Outdoor Ambient Misting"],
  },
  {
    id: "main-gate",
    name: "Technocity Gateway & Registration Desk",
    code: "GT-08",
    type: "OPEN",
    color: "#18c47c",
    position: [0, 0, 26],
    size: [12, 5, 4],
    description: "Primary campus entrance portal equipped with high-throughput optical QR scanners and accreditation desks.",
    capacity: "Continuous Entry",
    events: ["Delegate Registration", "VIP Escort Check-in", "Digital Pass Scanning"],
    features: ["Optical Laser QR Check-in Pods", "Festival Info & Helpdesk", "Electric Campus Shuttle Transit"],
  },
];

interface Props {
  selectedZoneId?: string;
  onSelectZone?: (zone: CampusZone) => void;
  className?: string;
}

export default function Campus3DOverview({ selectedZoneId, onSelectZone, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedZone, setSelectedZone] = useState<CampusZone>(CAMPUS_ZONES[0]);
  const [hoveredZone, setHoveredZone] = useState<CampusZone | null>(null);
  const [viewMode, setViewMode] = useState<"night" | "hologram" | "day">("night");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Screen projected coordinates of zones for 2D floating HUD labels
  const [screenMarkers, setScreenMarkers] = useState<
    { id: string; name: string; code: string; color: string; x: number; y: number; visible: boolean }[]
  >([]);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const beaconLightsRef = useRef<THREE.Group[]>([]);
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 32, 48));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Mouse / Touch Orbit controls state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 64, theta: 0.25 * Math.PI, phi: 0.35 * Math.PI });

  const selectZone = useCallback(
    (zone: CampusZone) => {
      setSelectedZone(zone);
      onSelectZone?.(zone);
      cyberAudio.playClick();

      // Smoothly orient camera to frame the selected building
      const [bx, , bz] = zone.position;
      targetLookAtRef.current.set(bx, 2, bz);

      // Camera offset from building
      const angle = Math.atan2(bz, bx) + 0.4;
      const dist = 32;
      targetCameraPosRef.current.set(
        bx + Math.cos(angle) * dist,
        18,
        bz + Math.sin(angle) * dist
      );
    },
    [onSelectZone]
  );

  // Sync with external selectedZoneId if provided
  useEffect(() => {
    if (!selectedZoneId) return;
    const match = CAMPUS_ZONES.find(
      (z) =>
        z.id === selectedZoneId ||
        z.name.toLowerCase().includes(selectedZoneId.toLowerCase()) ||
        selectedZoneId.toLowerCase().includes(z.name.toLowerCase().split(" ")[0]) ||
        z.code.toLowerCase() === selectedZoneId.toLowerCase()
    );
    if (match && match.id !== selectedZone.id) {
      selectZone(match);
    }
  }, [selectedZoneId, selectedZone.id, selectZone]);

  /* ------------------------------------------------------------------ */
  /*  INITIALIZE THREE.JS SCENE                                         */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 540;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(viewMode === "day" ? 0x05130d : 0x020504, 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    camera.position.set(0, 32, 48);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // Clean any prior canvas
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, viewMode === "day" ? 1.2 : 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xa5f3cf, 1.4);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const blueLight = new THREE.DirectionalLight(0x00e5ff, 0.8);
    blueLight.position.set(-40, 30, -30);
    scene.add(blueLight);

    // Ground Grid & Terrain Surface
    const groundGeo = new THREE.PlaneGeometry(160, 160, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x030806,
      roughness: 0.9,
      metalness: 0.2,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.1;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Cyber Coordinate Grid Lines
    const gridHelper = new THREE.GridHelper(160, 40, 0x18c47c, 0x0a291b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Circular Perimeter Radar Ring
    const ringGeo = new THREE.RingGeometry(52, 53, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x18c47c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.05;
    scene.add(ringMesh);

    // Outer Dash Ring
    const outerRingGeo = new THREE.RingGeometry(68, 68.6, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.x = -Math.PI / 2;
    outerRingMesh.position.y = 0.05;
    scene.add(outerRingMesh);

    // Roads & Connecting Pathways
    const createPath = (x1: number, z1: number, x2: number, z2: number, width = 2.4, color = 0x082417) => {
      const length = Math.hypot(x2 - x1, z2 - z1);
      const angle = Math.atan2(z2 - z1, x2 - x1);
      const roadGeo = new THREE.PlaneGeometry(length, width);
      const roadMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.6,
        metalness: 0.4,
      });
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.rotation.z = -angle;
      road.position.set((x1 + x2) / 2, 0.03, (z1 + z2) / 2);
      road.receiveShadow = true;
      scene.add(road);
    };

    // Interconnecting campus avenues
    createPath(0, 26, 0, 8, 3.2, 0x0c3120); // Gateway to Food Court
    createPath(0, 8, -18, -12, 2.6); // Food Court to Tech Core
    createPath(0, 8, 18, -14, 2.6); // Food Court to Mainstage
    createPath(0, 8, -22, 14, 2.2); // Food Court to Cyber Arena
    createPath(0, 8, 20, 12, 2.2); // Food Court to Esports
    createPath(-18, -12, 0, -22, 2.4); // Tech Core to Convention
    createPath(18, -14, 0, -22, 2.4); // Mainstage to Convention
    createPath(18, -14, 26, -2, 2.0); // Mainstage to Amphitheatre

    // Elevated Skybridge between Tech Core and Cyber Bunker
    const skybridgeGeo = new THREE.BoxGeometry(2, 0.8, 26);
    const skybridgeMat = new THREE.MeshStandardMaterial({
      color: 0x0d3825,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const skybridge = new THREE.Mesh(skybridgeGeo, skybridgeMat);
    skybridge.position.set(-20, 4.5, 1);
    scene.add(skybridge);

    // BUILD PROCEDURAL ARCHITECTURAL STRUCTURES FOR EACH ZONE
    const meshesMap = new Map<string, THREE.Group>();

    CAMPUS_ZONES.forEach((zone) => {
      const group = new THREE.Group();
      group.position.set(...zone.position);
      const [w, h, d] = zone.size;

      const zoneColor = new THREE.Color(zone.color);

      // 1. Main Architectural Building Volume
      const mainBuildingGeo = new THREE.BoxGeometry(w, h, d);
      const mainBuildingMat = new THREE.MeshStandardMaterial({
        color: 0x0a1c14,
        roughness: 0.25,
        metalness: 0.85,
      });
      const buildingMesh = new THREE.Mesh(mainBuildingGeo, mainBuildingMat);
      buildingMesh.position.y = h / 2;
      buildingMesh.castShadow = true;
      buildingMesh.receiveShadow = true;
      group.add(buildingMesh);

      // 2. Wireframe / Holographic Edges
      const edgesGeo = new THREE.EdgesGeometry(mainBuildingGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: zoneColor,
        linewidth: 1.5,
        transparent: true,
        opacity: 0.8,
      });
      const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
      edgesMesh.position.y = h / 2;
      group.add(edgesMesh);

      // 3. Glowing Floor Windows & Skylights
      const windowRows = Math.floor(h / 2.2);
      for (let row = 1; row <= windowRows; row++) {
        const bandGeo = new THREE.BoxGeometry(w * 1.01, 0.35, d * 1.01);
        const bandMat = new THREE.MeshBasicMaterial({
          color: zoneColor,
          transparent: true,
          opacity: 0.6,
        });
        const band = new THREE.Mesh(bandGeo, bandMat);
        band.position.y = row * 2.2;
        group.add(band);
      }

      // 4. Rooftop Details & Mechanical structures
      if (zone.type === "TECH" || zone.type === "FORUM") {
        // Helipad / Array tower
        const roofTowerGeo = new THREE.CylinderGeometry(w * 0.25, w * 0.3, 2.5, 8);
        const roofTowerMat = new THREE.MeshStandardMaterial({ color: 0x143527, metalness: 0.7 });
        const roofTower = new THREE.Mesh(roofTowerGeo, roofTowerMat);
        roofTower.position.y = h + 1.25;
        group.add(roofTower);
      } else if (zone.type === "CULTURE") {
        // Curved Acoustic Roof Canopy
        const canopyGeo = new THREE.TorusGeometry(w * 0.45, 0.6, 8, 24, Math.PI);
        const canopyMat = new THREE.MeshStandardMaterial({ color: zoneColor, metalness: 0.9, roughness: 0.1 });
        const canopy = new THREE.Mesh(canopyGeo, canopyMat);
        canopy.rotation.x = Math.PI / 2;
        canopy.position.y = h + 1;
        group.add(canopy);
      } else if (zone.type === "GAMING" || zone.type === "CYBER") {
        // Neon Halo Ring over Arena
        const haloGeo = new THREE.TorusGeometry(w * 0.55, 0.25, 12, 32);
        const haloMat = new THREE.MeshBasicMaterial({ color: zoneColor });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = h + 1.8;
        group.add(halo);
      }

      // 5. Vertical Sky Cyber Beacon Laser Beam
      const beaconGeo = new THREE.CylinderGeometry(0.12, 0.6, 45, 16);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: zoneColor,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = h + 22.5;
      group.add(beacon);

      // 6. Ground Base Plinth with Glow
      const plinthGeo = new THREE.BoxGeometry(w + 2, 0.4, d + 2);
      const plinthMat = new THREE.MeshStandardMaterial({ color: 0x05130b, roughness: 0.5 });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.y = 0.2;
      group.add(plinth);

      scene.add(group);
      meshesMap.set(zone.id, group);
    });

    buildingMeshesRef.current = meshesMap;

    // Campus Trees & Foliage Sprites
    const treeGeo = new THREE.ConeGeometry(1.2, 3, 6);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x0e472a, roughness: 0.8 });
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.25, 1, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x271910 });

    const treePositions = [
      [-8, 6], [-10, 8], [-6, 12], [8, 6], [10, 8], [6, 12],
      [-12, -4], [-14, -2], [12, -4], [14, -2],
      [-5, -12], [5, -12], [-8, 22], [8, 22]
    ];

    treePositions.forEach(([tx, tz]) => {
      const treeGroup = new THREE.Group();
      const foliage = new THREE.Mesh(treeGeo, treeMat);
      foliage.position.y = 2.2;
      foliage.castShadow = true;
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.5;
      treeGroup.add(trunk);
      treeGroup.add(foliage);
      treeGroup.position.set(tx, 0, tz);
      scene.add(treeGroup);
    });

    setIsLoaded(true);

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };

    window.addEventListener("resize", handleResize);

    /* ------------------------------------------------------------------ */
    /*  ANIMATION LOOP                                                    */
    /* ------------------------------------------------------------------ */
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera interpolation towards target
      if (cameraRef.current) {
        if (autoRotate && !isDraggingRef.current) {
          sphericalRef.current.theta += delta * 0.15;
          const { radius, theta, phi } = sphericalRef.current;
          cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
          cameraRef.current.position.y = radius * Math.cos(phi);
          cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
        } else {
          cameraRef.current.position.lerp(targetCameraPosRef.current, delta * 3);
        }

        // Camera LookAt lerp
        currentLookAtRef.current.lerp(targetLookAtRef.current, delta * 4);
        cameraRef.current.lookAt(currentLookAtRef.current);

        // Project 3D building positions to 2D screen coordinates for markers
        const markers: {
          id: string;
          name: string;
          code: string;
          color: string;
          x: number;
          y: number;
          visible: boolean;
        }[] = [];

        CAMPUS_ZONES.forEach((z) => {
          const v = new THREE.Vector3(z.position[0], z.size[1] + 2.5, z.position[2]);
          v.project(cameraRef.current!);

          // Check if building is in front of camera
          const isBehind = v.z > 1;
          const halfW = (containerRef.current?.clientWidth || 900) / 2;
          const halfH = (containerRef.current?.clientHeight || 540) / 2;

          const sx = v.x * halfW + halfW;
          const sy = -(v.y * halfH) + halfH;

          markers.push({
            id: z.id,
            name: z.name,
            code: z.code,
            color: z.color,
            x: sx,
            y: sy,
            visible: !isBehind,
          });
        });

        setScreenMarkers(markers);
      }

      // Rotate radar rings
      ringMesh.rotation.z += delta * 0.2;
      outerRingMesh.rotation.z -= delta * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [viewMode, autoRotate]);

  /* ------------------------------------------------------------------ */
  /*  INTERACTIVE MOUSE & TOUCH ORBIT HANDLERS                          */
  /* ------------------------------------------------------------------ */
  const onMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    sphericalRef.current.theta -= deltaX * 0.008;
    sphericalRef.current.phi = Math.max(0.15 * Math.PI, Math.min(0.48 * Math.PI, sphericalRef.current.phi - deltaY * 0.008));

    const { radius, theta, phi } = sphericalRef.current;
    if (cameraRef.current) {
      targetCameraPosRef.current.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
    }

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(24, Math.min(110, sphericalRef.current.radius + e.deltaY * 0.05));
    const { radius, theta, phi } = sphericalRef.current;
    targetCameraPosRef.current.set(
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta)
    );
  };

  const resetView = () => {
    targetLookAtRef.current.set(0, 0, 0);
    sphericalRef.current = { radius: 64, theta: 0.25 * Math.PI, phi: 0.35 * Math.PI };
    const { radius, theta, phi } = sphericalRef.current;
    targetCameraPosRef.current.set(
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta)
    );
    cyberAudio.playClick();
  };

  return (
    <div className={`relative w-full select-none overflow-hidden rounded-xl border border-[rgba(24,196,124,0.3)] bg-[#020504] shadow-[0_0_60px_rgba(24,196,124,0.12)] ${className}`}>
      {/* Top HUD Bar */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(24,196,124,0.2)] bg-[rgba(3,7,5,0.92)] px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[10px] font-bold tracking-[0.24em] text-emerald-400">
            DIGITAL TWIN // TECHNOCITY CAMPUS 3D
          </span>
          <span className="hidden font-mono text-[9px] text-white/30 sm:inline">
            // DUK 8.5°N 76.8°E
          </span>
        </div>

        {/* View Mode & Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Day / Night / Hologram Modes */}
          <div className="flex rounded border border-white/10 bg-black/40 p-0.5">
            {(["night", "hologram", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  cyberAudio.playClick();
                }}
                className={`px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] transition-colors ${
                  viewMode === mode
                    ? "bg-emerald-500/20 text-emerald-300 font-bold"
                    : "text-[#628778] hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => {
              setAutoRotate((r) => !r);
              cyberAudio.playClick();
            }}
            className={`border px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] transition-colors ${
              autoRotate
                ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                : "border-white/10 bg-black/40 text-[#628778] hover:text-white"
            }`}
          >
            ORBIT: {autoRotate ? "AUTO" : "MANUAL"}
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetView}
            className="border border-white/10 bg-black/40 px-2 py-1 font-mono text-[9px] tracking-[0.18em] text-[#86af9e] hover:border-emerald-400 hover:text-white"
            title="Reset Drone Camera"
          >
            RESET
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        className="relative h-[480px] w-full cursor-grab active:cursor-grabbing sm:h-[560px]"
      />

      {/* 2D Projected Floating Building Markers Over 3D World */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {screenMarkers.map((marker) => {
          if (!marker.visible) return null;
          const isSelected = selectedZone.id === marker.id;
          const isHovered = hoveredZone?.id === marker.id;

          return (
            <div
              key={marker.id}
              className="absolute -translate-x-1/2 -translate-y-full transition-transform duration-75"
              style={{
                left: `${marker.x}px`,
                top: `${marker.y}px`,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const zone = CAMPUS_ZONES.find((z) => z.id === marker.id);
                  if (zone) selectZone(zone);
                }}
                onMouseEnter={() => {
                  const zone = CAMPUS_ZONES.find((z) => z.id === marker.id);
                  if (zone) setHoveredZone(zone);
                }}
                onMouseLeave={() => setHoveredZone(null)}
                className={`pointer-events-auto flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[9px] tracking-wider transition-all duration-200 ${
                  isSelected
                    ? "scale-110 border-emerald-400 bg-[#061c12] text-white shadow-[0_0_20px_rgba(24,196,124,0.6)]"
                    : isHovered
                    ? "scale-105 border-white/40 bg-[#06120b] text-emerald-300"
                    : "border-white/15 bg-[rgba(3,7,5,0.85)] text-[#91b3a3] backdrop-blur-sm hover:border-emerald-400"
                }`}
                style={{ borderColor: isSelected ? marker.color : undefined }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: marker.color }}
                />
                <span className="font-bold">{marker.code}</span>
                <span className="hidden sm:inline">{marker.name.split(" ")[0]}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Controls Hint overlay */}
      <div className="pointer-events-none absolute left-4 top-16 z-20 hidden font-mono text-[8px] tracking-[0.2em] text-[#557e6d] md:block">
        DRAG TO ROTATE // SCROLL TO ZOOM // CLICK NODE TO FOCUS
      </div>

      {/* Quick Jump Zone Chips Bar */}
      <div className="relative z-30 flex items-center gap-1.5 overflow-x-auto border-t border-[rgba(24,196,124,0.18)] bg-[rgba(3,7,5,0.92)] px-4 py-2.5 backdrop-blur-md">
        <span className="shrink-0 font-mono text-[9px] tracking-[0.2em] text-[#527768]">
          ZONES:
        </span>
        {CAMPUS_ZONES.map((zone) => {
          const active = selectedZone.id === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => selectZone(zone)}
              className={`shrink-0 rounded-sm border px-2.5 py-1 font-mono text-[9px] tracking-wider transition-all ${
                active
                  ? "border-emerald-400 bg-emerald-950/60 font-bold text-emerald-300 shadow-[0_0_12px_rgba(24,196,124,0.3)]"
                  : "border-white/10 bg-black/30 text-[#719888] hover:border-white/30 hover:text-white"
              }`}
            >
              <span className="mr-1 opacity-70">{zone.code}</span>
              {zone.name.split(" ")[0]}
            </button>
          );
        })}
      </div>

      {/* Selected Zone Deep-Dive Details Drawer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedZone.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-30 border-t border-[rgba(24,196,124,0.25)] bg-[rgba(5,13,9,0.95)] p-4 backdrop-blur-xl sm:p-5"
        >
          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_auto]">
            {/* Zone Identity & Summary */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[8px] font-bold"
                  style={{ backgroundColor: `${selectedZone.color}25`, color: selectedZone.color }}
                >
                  {selectedZone.type} // {selectedZone.code}
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#557e6d]">
                  CAPACITY: {selectedZone.capacity}
                </span>
              </div>
              <h3 className="mt-1 font-display text-lg font-bold text-[#eef8f3] sm:text-xl">
                {selectedZone.name}
              </h3>
              <p className="mt-1 text-xs text-[#8cb0a0] leading-relaxed">
                {selectedZone.description}
              </p>
            </div>

            {/* Scheduled Events at this venue */}
            <div className="border-t border-white/10 pt-3 md:border-t-0 md:border-l md:pl-4 md:pt-0">
              <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#557e6d]">
                SCHEDULED STREAMS & EVENTS
              </span>
              <ul className="mt-1.5 space-y-1">
                {selectedZone.events.map((ev, i) => (
                  <li key={i} className="flex items-center gap-1.5 font-mono text-[10px] text-[#c9e8dc]">
                    <span className="text-emerald-400">▹</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tactical Features & Action */}
            <div className="flex flex-col justify-between border-t border-white/10 pt-3 md:border-t-0 md:border-l md:pl-4 md:pt-0">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#557e6d]">
                  ZONE INFRASTRUCTURE
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedZone.features.map((feat, i) => (
                    <span
                      key={i}
                      className="rounded bg-white/5 px-2 py-0.5 font-mono text-[8px] text-[#7ea393]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <a
                  href="#/schedule"
                  className="border border-emerald-500/50 bg-emerald-950/40 px-3 py-1.5 text-center font-mono text-[9px] font-bold tracking-[0.18em] text-emerald-300 transition-colors hover:bg-emerald-900"
                >
                  VIEW TIMETABLE →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
