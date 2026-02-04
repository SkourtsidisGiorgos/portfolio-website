'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

export interface DataParticleProps {
  position?: [number, number, number];
  color?: string;
  size?: number;
  intensity?: number;
  pulseSpeed?: number;
}

export function DataParticle({
  position = [0, 0, 0],
  color = '#00bcd4',
  size = 0.1,
  intensity = 1,
  pulseSpeed = 1,
}: DataParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(state => {
    if (meshRef.current && materialRef.current) {
      // Pulse animation
      const pulse =
        Math.sin(state.clock.elapsedTime * pulseSpeed * 2) * 0.3 + 0.7;
      meshRef.current.scale.setScalar(pulse);
      materialRef.current.opacity = pulse * intensity;
    }

    if (glowMaterialRef.current) {
      const pulse =
        Math.sin(state.clock.elapsedTime * pulseSpeed * 2) * 0.3 + 0.7;
      glowMaterialRef.current.opacity = pulse * intensity * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Core particle */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          ref={materialRef}
          color={color}
          transparent
          opacity={intensity}
        />
      </mesh>

      {/* Glow effect */}
      <mesh scale={1.5}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          color={color}
          transparent
          opacity={intensity * 0.3}
        />
      </mesh>
    </group>
  );
}

export default DataParticle;
