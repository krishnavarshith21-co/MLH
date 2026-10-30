import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

function SphereSystem() {
  const reducedMotion = useReducedMotion();
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = state.clock.elapsedTime * -0.08;
    }
  });

  return (
    <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Center Champagne Metallic Sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.55, 64, 64]} />
          <meshStandardMaterial
            color="#C6B99A"
            metalness={0.9}
            roughness={0.2}
            emissive="#C6B99A"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Orbit Ring 1 */}
        <mesh ref={ring1Ref} rotation={[1.1, 0.4, 0]}>
          <torusGeometry args={[1.05, 0.008, 16, 100]} />
          <meshBasicMaterial color="#54C7BE" transparent opacity={0.4} />
        </mesh>

        {/* Orbit Ring 2 */}
        <mesh ref={ring2Ref} rotation={[-0.8, -0.6, 0.5]}>
          <torusGeometry args={[1.35, 0.008, 16, 100]} />
          <meshBasicMaterial color="#C6B99A" transparent opacity={0.3} />
        </mesh>

        {/* Orbiting Teal Sphere Top */}
        <mesh position={[0.2, 1.1, 0.3]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color="#54C7BE"
            metalness={0.85}
            roughness={0.25}
            emissive="#54C7BE"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Orbiting Teal Sphere Lower */}
        <mesh position={[-0.1, -1.0, 0.2]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial
            color="#54C7BE"
            metalness={0.85}
            roughness={0.25}
            emissive="#54C7BE"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Small Accent Sphere Right */}
        <mesh position={[0.9, 0.3, -0.4]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial
            color="#54C7BE"
            metalness={0.85}
            roughness={0.2}
            emissive="#54C7BE"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Small Accent Sphere Left */}
        <mesh position={[-1.1, -0.2, 0.3]}>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial
            color="#C6B99A"
            metalness={0.9}
            roughness={0.2}
            emissive="#C6B99A"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function OrbitSpheres() {
  return (
    <div className="w-full h-[360px] relative">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 8, 8]} intensity={1.5} color="#F2F0EA" />
        <pointLight position={[0, 0, 2]} intensity={1.2} color="#C6B99A" />
        <pointLight position={[-3, -2, -1]} intensity={0.8} color="#54C7BE" />
        <SphereSystem />
      </Canvas>
    </div>
  );
}

