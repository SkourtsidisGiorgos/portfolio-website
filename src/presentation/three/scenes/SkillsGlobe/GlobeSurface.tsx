'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

export interface GlobeSurfaceProps {
  /** Globe radius */
  radius?: number;
  /** Wireframe color */
  color?: string;
  /** Wireframe opacity */
  opacity?: number;
  /** Whether to show wireframe */
  wireframe?: boolean;
  /** Rotation speed */
  rotationSpeed?: number;
  /** Whether animation is paused */
  paused?: boolean;
}

/**
 * Wireframe icosahedron surface representing the globe structure.
 */
export function GlobeSurface({
  radius = 3,
  color = '#00bcd4',
  opacity = 0.1,
  wireframe = true,
  rotationSpeed = 0.05,
  paused = false,
}: GlobeSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Slow rotation animation
  useFrame(() => {
    if (meshRef.current && !paused) {
      meshRef.current.rotation.y += rotationSpeed * 0.01;
      meshRef.current.rotation.x += rotationSpeed * 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[radius, 2]} />
      <meshBasicMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}
