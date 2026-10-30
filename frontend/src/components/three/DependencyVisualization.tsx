import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

export interface GraphNode {
  id: string;
  name?: string;
  label: string;
  position: [number, number, number];
  color: string;
  radius: number;
  isCenter?: boolean;
}

const GRAPH_NODES: GraphNode[] = [
  {id:'center', label:'VERYNTH', position:[0,0,0.2], color:'#C6B99A', radius:0.28, isCenter:true},
  ...['pandas','numpy','fastapi','requests','matplotlib','scikit-learn'].map((name,i) => ({
    id:name, label:name, position:[Math.cos(i*Math.PI/3)*1.45,Math.sin(i*Math.PI/3)*1.4,0] as [number,number,number], color:'#54C7BE', radius:0.13,
  })),
];
const GRAPH_EDGES: [string,string][] = GRAPH_NODES.slice(1).flatMap((n,i) => [[n.id,'center'],[n.id,GRAPH_NODES[1+(i+1)%6].id]] as [string,string][]);

function NodeSphere({
  node,
  isHovered,
  onHover,
}: {
  node: GraphNode;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (node.isCenter) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.0) * 0.04;
      meshRef.current.scale.setScalar(pulse * (isHovered ? 1.2 : 1.0));
    } else if (isHovered) {
      meshRef.current.scale.setScalar(1.2);
    } else {
      meshRef.current.scale.setScalar(1.0);
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[node.radius, 32, 32]} />
        <meshStandardMaterial
          color={node.color}
          roughness={node.isCenter ? 0.35 : 0.25}
          metalness={0.85}
          emissive={node.color}
          emissiveIntensity={node.isCenter ? 0.5 : 0.4}
        />
      </mesh>

      {/* Floating text label if node has a label */}
      {node.isCenter ? (
        <Html
          position={[0, 0, 0]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="font-heading font-black text-xs text-[#090D14] select-none tracking-tighter">
            V
          </div>
        </Html>
      ) : node.label ? (
        <Html
          position={[0, node.radius + 0.15, 0]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="text-[11px] font-mono text-[#F2F0EA] opacity-90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {node.label}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function NetworkLines({ activeId }: { activeId: string | null }) {
  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    GRAPH_NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  const lines = useMemo(() => {
    return GRAPH_EDGES.map(([fromId, toId]) => {
      const fromNode = nodeMap.get(fromId);
      const toNode = nodeMap.get(toId);
      if (!fromNode || !toNode) return null;

      const p1 = new THREE.Vector3(...fromNode.position);
      const p2 = new THREE.Vector3(...toNode.position);
      const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);

      return {
        key: `${fromId}-${toId}`,
        fromId,
        toId,
        geometry,
        isCenterEdge: fromNode.isCenter || toNode.isCenter,
      };
    }).filter(Boolean) as {
      key: string;
      fromId: string;
      toId: string;
      geometry: THREE.BufferGeometry;
      isCenterEdge: boolean;
    }[];
  }, [nodeMap]);

  return (
    <group>
      {lines.map((line) => {
        const isHighlighted = activeId === line.fromId || activeId === line.toId;
        const color = line.isCenterEdge ? '#8EA39E' : '#3E7674';
        return (
          <primitive
            key={line.key}
            object={
              new THREE.Line(
                line.geometry,
                new THREE.LineBasicMaterial({
                  color,
                  transparent: true,
                  opacity: isHighlighted ? 0.85 : line.isCenterEdge ? 0.4 : 0.25,
                  linewidth: 1,
                })
              )
            }
          />
        );
      })}
    </group>
  );
}

function SceneGraph({
  hoveredId,
  setHoveredId,
}: {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.04;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.15}>
      <group ref={groupRef}>
        <NetworkLines activeId={hoveredId} />
        {GRAPH_NODES.map((node) => (
          <NodeSphere
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
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] rounded-2xl bg-[#0B1018] border border-[#2B3544] overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* Background technical orbit rings matching Image 1 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full border border-[#54C7BE]/5" />
        <div className="w-[380px] h-[380px] rounded-full border border-[#54C7BE]/8 absolute" />
        <div className="w-[260px] h-[260px] rounded-full border border-[#C6B99A]/10 absolute" />
        <div className="w-[140px] h-[140px] rounded-full border border-[#54C7BE]/10 absolute" />
      </div>

      {/* TOP-RIGHT LEGEND: Exact to Image 1 in reference sheet */}
      <div className="absolute top-4 left-4 z-20 px-3.5 py-2 rounded-xl bg-[#090D14]/85 border border-[#2B3544]/80 backdrop-blur-md flex flex-row gap-3 text-[10px] sm:text-[11px] font-mono text-[#9AA7B5] shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#54C7BE]" />
          <span>Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C6B99A]" />
          <span>Migrating</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#49B994]" />
          <span>Verified</span>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div className="relative flex-1 w-full h-full min-h-0">
        {!isReducedMotion && hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0, 6.8], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={1.1} />
            <directionalLight position={[5, 8, 8]} intensity={1.6} color="#F2F0EA" />
            <pointLight position={[0, -0.4, 2]} intensity={1.5} color="#C6B99A" />
            <pointLight position={[-2, 1, 1]} intensity={1.0} color="#54C7BE" />
            <SceneGraph hoveredId={hoveredId} setHoveredId={setHoveredId} />
          </Canvas>
        ) : (
          <div className="w-full h-full flex flex-wrap items-center justify-center gap-3 p-8">
            {GRAPH_NODES.filter((n) => n.label).map((n) => (
              <span
                key={n.id}
                className="px-3 py-1.5 rounded-lg bg-[#151D2A] border border-[#2B3544] text-xs font-mono text-[#54C7BE]"
              >
                {n.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
