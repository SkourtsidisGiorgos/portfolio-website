'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface GlowingSphereProps {
  position?: [number, number, number];
  radius?: number;
  color?: string;
  glowColor?: string;
  intensity?: number;
  pulseSpeed?: number;
  pulseIntensity?: number;
  wireframe?: boolean;
}

export function GlowingSphere({
  position = [0, 0, 0],
  radius = 1,
  color = '#00bcd4',
  glowColor,
  intensity = 1,
  pulseSpeed = 1,
  pulseIntensity = 0.2,
  wireframe = false,
}: GlowingSphereProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);

  const actualGlowColor = glowColor || color;

  useFrame(state => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }

    if (coreRef.current) {
      // Pulse animation
      const pulse =
        Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseIntensity + 1;
      coreRef.current.scale.setScalar(pulse);
    }

    // Animate glow opacity
    if (innerGlowRef.current) {
      const innerPulse =
        Math.sin(state.clock.elapsedTime * pulseSpeed * 1.5) * 0.1 + 0.3;
      (innerGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        innerPulse * intensity;
    }

    if (outerGlowRef.current) {
      const outerPulse =
        Math.sin(state.clock.elapsedTime * pulseSpeed * 0.8) * 0.05 + 0.15;
      (outerGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        outerPulse * intensity;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 0.5}
          wireframe={wireframe}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={innerGlowRef} scale={1.2}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={actualGlowColor}
          transparent
          opacity={0.3 * intensity}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={outerGlowRef} scale={1.5}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={actualGlowColor}
          transparent
          opacity={0.15 * intensity}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default GlowingSphere;
