import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface NodeData {
  id: string;
  name: string;
  version: string;
  position: [number, number, number];
  status: 'healthy' | 'outdated' | 'migrating' | 'verified';
  size: number;
}

const NODES: NodeData[] = [
  { id: 'core', name: 'App Core', version: 'v1.0', position: [0, 0, 0], status: 'verified', size: 0.9 },
  { id: 'pandas', name: 'pandas', version: '1.5.3 → 2.0', position: [2.2, 0.8, -0.5], status: 'migrating', size: 0.65 },
  { id: 'numpy', name: 'numpy', version: '1.24.0', position: [-2.0, 1.2, 0.8], status: 'healthy', size: 0.55 },
  { id: 'pytest', name: 'pytest', version: '7.4.0', position: [1.8, -1.4, 0.6], status: 'healthy', size: 0.5 },
  { id: 'fastapi', name: 'fastapi', version: '0.115', position: [-1.6, -1.2, -0.8], status: 'verified', size: 0.55 },
  { id: 'sql', name: 'sqlalchemy', version: '2.0.0', position: [0.2, 2.3, -0.6], status: 'healthy', size: 0.5 },
  { id: 'qwen', name: 'qwen2.5-coder', version: '7B-Instruct', position: [0.0, -2.2, -0.4], status: 'verified', size: 0.6 },
];

function NodeMesh({ node, isHovered, onHover }: { node: NodeData; isHovered: boolean; onHover: (hover: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Status colors matching our design palette:
  // Teal: #54C7BE, Champagne: #C6B99A, Warning: #D5A86B, Success: #49B994
  const color = useMemo(() => {
    switch (node.status) {
      case 'migrating':
        return '#C6B99A'; // Champagne Titanium
      case 'outdated':
        return '#D5A86B'; // Warning Gold
      case 'verified':
        return '#49B994'; // Success Green
      case 'healthy':
      default:
        return '#54C7BE'; // Glacier Teal
    }
  }, [node.status]);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (node.status === 'migrating') {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.15 + 1;
      meshRef.current.scale.setScalar(node.size * pulse * (isHovered ? 1.2 : 1));
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        scale={node.size * (isHovered ? 1.2 : 1)}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={isHovered ? 0.6 : 0.25}
        />
      </mesh>

      {/* Halo ring for migrating or core nodes */}
      {(node.status === 'migrating' || node.id === 'core') && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[node.size * 1.3, node.size * 1.45, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function RelationshipLines({ activeNode }: { activeNode: string | null }) {
  const lines = useMemo(() => {
    const corePos = new THREE.Vector3(0, 0, 0);
    return NODES.filter((n) => n.id !== 'core').map((node) => {
      const targetPos = new THREE.Vector3(...node.position);
      const points = [corePos, targetPos];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return { id: node.id, geometry, status: node.status };
    });
  }, []);

  return (
    <group>
      {lines.map((l) => {
        const isHighlighted = activeNode === l.id;
        const color = l.status === 'migrating' ? '#C6B99A' : '#54C7BE';
        return (
          <primitive
            key={l.id}
            object={
              new THREE.Line(
                l.geometry,
                new THREE.LineBasicMaterial({
                  color,
                  transparent: true,
                  opacity: isHighlighted ? 0.9 : 0.35,
                  linewidth: isHighlighted ? 2 : 1,
                })
              )
            }
          />
        );
      })}
    </group>
  );
}

function Scene({ hoveredId, setHoveredId }: { hoveredId: string | null; setHoveredId: (id: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef}>
        <RelationshipLines activeNode={hoveredId} />
        {NODES.map((node) => (
          <NodeMesh
            key={node.id}
            node={node}
            isHovered={hoveredId === node.id}
            onHover={(h) => setHoveredId(h ? node.id : null)}
          />
        ))}
      </group>
    </Float>
  );
}

export function DependencyVisualization() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const activeNodeData = useMemo(() => {
    return NODES.find((n) => n.id === hoveredId) || NODES[1]; // default to pandas
  }, [hoveredId]);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full min-h-[380px] rounded-2xl bg-midnight-slate/60 border border-border flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-teal/20 border border-teal flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-full bg-teal animate-pulse" />
        </div>
        <h3 className="font-heading font-bold text-lg text-ivory">Dependency Graph Active</h3>
        <p className="text-sm text-secondary-text mt-1 max-w-sm">
          Interactive WebGL preview disabled. 7 packages verified, pandas 1.5.3 migration in progress.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-2xl bg-gradient-to-b from-midnight-slate/40 to-obsidian/80 border border-border/80 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5.5], fov: 48 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} color="#F2F0EA" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#54C7BE" />
        <pointLight position={[0, 5, 5]} intensity={0.5} color="#C6B99A" />
        <Scene hoveredId={hoveredId} setHoveredId={setHoveredId} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>

      {/* Floating Status Badge / HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="px-3 py-1.5 rounded-lg bg-midnight-slate/90 border border-border/80 backdrop-blur-md shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-champagne animate-ping" />
            <span className="text-xs font-mono font-medium text-ivory">
              {activeNodeData.name} ({activeNodeData.version})
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-mono tracking-wider bg-elevated text-champagne border border-champagne/30">
              {activeNodeData.status}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-elevated/80 border border-border text-[11px] font-mono text-secondary-text">
          <span>Drag to orbit</span>
        </div>
      </div>

      {/* Bottom Node Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-secondary-text pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal" />
          <span>Healthy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-champagne" />
          <span>Migrating</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
}

