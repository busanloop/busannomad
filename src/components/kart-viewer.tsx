"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float, Html } from "@react-three/drei";
import * as THREE from "three";

function Kart() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={ref}>
        {/* Body */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.9, 0.25, 1.6]} />
          <meshStandardMaterial color="#22d3ee" metalness={0.8} roughness={0.15} />
        </mesh>
        {/* Hood slope */}
        <mesh position={[0, 0.25, 0.55]} castShadow>
          <boxGeometry args={[0.75, 0.12, 0.5]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Cockpit */}
        <mesh position={[0, 0.38, -0.15]} castShadow>
          <boxGeometry args={[0.55, 0.22, 0.55]} />
          <meshStandardMaterial color="#0e7490" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.42, 0.15]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.18, 0.02]} />
          <meshStandardMaterial color="#67e8f9" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
        </mesh>
        {/* Spoiler */}
        <mesh position={[0, 0.4, -0.7]} castShadow>
          <boxGeometry args={[0.9, 0.04, 0.2]} />
          <meshStandardMaterial color="#22d3ee" metalness={0.8} roughness={0.15} />
        </mesh>
        {/* Spoiler stands */}
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.32, -0.65]} castShadow>
            <boxGeometry args={[0.04, 0.15, 0.04]} />
            <meshStandardMaterial color="#155e75" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
        {/* Wheels */}
        {[
          [-0.5, 0.05, 0.5],
          [0.5, 0.05, 0.5],
          [-0.5, 0.05, -0.5],
          [0.5, 0.05, -0.5],
        ].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.12, 8]} />
              <meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}
        {/* Headlights */}
        {[-0.25, 0.25].map((x) => (
          <mesh key={x} position={[x, 0.22, 0.81]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
          </mesh>
        ))}
        {/* Exhaust */}
        <mesh position={[0.3, 0.12, -0.82]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.15, 8]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Bazzi Character */}
        <group position={[0, 0.55, -0.15]}>
          {/* Head */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#fff5e6" roughness={0.7} />
          </mesh>
          {/* Ears */}
          {[-0.14, 0.14].map((x) => (
            <mesh key={x} position={[x, 0.45, 0]} castShadow>
              <capsuleGeometry args={[0.05, 0.14, 4, 8]} />
              <meshStandardMaterial color="#fff5e6" roughness={0.7} />
            </mesh>
          ))}
          {/* Ear tips */}
          {[-0.14, 0.14].map((x) => (
            <mesh key={`tip${x}`} position={[x, 0.54, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#f0a0b0" roughness={0.6} />
            </mesh>
          ))}
          {/* Eyes */}
          {[-0.07, 0.07].map((x) => (
            <mesh key={`eye${x}`} position={[x, 0.3, 0.16]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#1a1a2e" roughness={0.3} />
            </mesh>
          ))}
          {/* Body */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.16, 4, 8]} />
            <meshStandardMaterial color="#ff6b9d" roughness={0.5} />
          </mesh>
          {/* Arms */}
          {[-0.18, 0.18].map((x) => (
            <mesh key={`arm${x}`} position={[x, 0.05, 0.08]} rotation={[0.4, 0, x > 0 ? -0.3 : 0.3]} castShadow>
              <capsuleGeometry args={[0.04, 0.12, 4, 8]} />
              <meshStandardMaterial color="#ff6b9d" roughness={0.5} />
            </mesh>
          ))}
          {/* Helmet visor */}
          <mesh position={[0, 0.35, 0.12]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.28, 0.1, 0.02]} />
            <meshStandardMaterial color="#22d3ee" metalness={0.9} roughness={0.1} transparent opacity={0.5} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function RoadRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z -= delta * 0.12;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
      <torusGeometry args={[2.5, 0.06, 8, 80]} />
      <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.4} transparent opacity={0.5} />
    </mesh>
  );
}

function DashedRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.08;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
      <torusGeometry args={[1.8, 0.02, 6, 80]} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.3} transparent opacity={0.3} />
    </mesh>
  );
}

function SpotMarkers() {
  const spots = [
    { label: "F22 Cowork", angle: 0, color: "#60a5fa", emoji: "💼" },
    { label: "Fitness", angle: (Math.PI * 2) / 3, color: "#34d399", emoji: "🏋️" },
    { label: "광안리", angle: (Math.PI * 4) / 3, color: "#fbbf24", emoji: "🍜" },
  ];

  return (
    <>
      {spots.map((spot) => {
        const x = Math.cos(spot.angle) * 2.5;
        const z = Math.sin(spot.angle) * 2.5;
        return (
          <group key={spot.label} position={[x, -0.3, z]}>
            <mesh>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={spot.color} emissive={spot.color} emissiveIntensity={0.6} />
            </mesh>
            {/* Glow */}
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={spot.color} transparent opacity={0.15} />
            </mesh>
            <Html center distanceFactor={7} style={{ pointerEvents: "none" }}>
              <div className="bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] text-white whitespace-nowrap border border-zinc-700/50 flex items-center gap-1">
                <span>{spot.emoji}</span>
                <span>{spot.label}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 50;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = Math.random() * 4 - 1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.03} color="#4ade80" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export function KartViewer() {
  return (
    <div className="w-full h-[320px] sm:h-[400px] relative">
      <Canvas
        camera={{ position: [4, 3, 4], fov: 38 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <pointLight position={[-4, 3, -4]} intensity={0.5} color="#4ade80" />
        <pointLight position={[4, 2, 4]} intensity={0.4} color="#22d3ee" />

        <Kart />
        <RoadRing />
        <DashedRing />
        <SpotMarkers />
        <Particles />

        <ContactShadows position={[0, -0.5, 0]} opacity={0.25} scale={10} blur={2.5} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.2} />
      </Canvas>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-700/50">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-zinc-300">BusanNomad — Busan Drift Course</span>
      </div>
    </div>
  );
}
