'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { glowIntensity } from '../utils/animationHelpers';

/**
 * Props for GlowLayer component
 */
export interface GlowLayerProps {
  /** Radius of the glow sphere */
  radius?: number;
  /** Color of the glow (hex string) */
  color?: string;
  /** Base opacity (0-1) */
  opacity?: number;
  /** Scale multiplier for glow size */
  scale?: number;
  /** Whether glow pulses */
  animated?: boolean;
  /** Animation speed */
  animationSpeed?: number;
  /** Render on back side only (for layered glows) */
  backSide?: boolean;
}

/**
 * Reusable glow layer component (Single Responsibility).
 * Renders a single glow sphere that can be composed for multi-layer effects.
 */
export function GlowLayer({
  radius = 1,
  color = '#00bcd4',
  opacity = 0.3,
  scale = 1.2,
  animated = true,
  animationSpeed = 1.5,
  backSide = true,
}: GlowLayerProps) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(state => {
    if (animated && materialRef.current) {
      const intensity = glowIntensity(
        state.clock.elapsedTime,
        animationSpeed,
        opacity,
        opacity * 0.3
      );
      materialRef.current.opacity = intensity;
    }
  });

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={opacity}
        side={backSide ? THREE.BackSide : THREE.FrontSide}
      />
    </mesh>
  );
}

/**
 * Predefined glow layer configurations
 */
export const GlowLayerPresets = {
  /** Inner glow - closer to surface, brighter */
  inner: {
    scale: 1.2,
    opacity: 0.3,
    animationSpeed: 1.5,
  },
  /** Outer glow - further out, more subtle */
  outer: {
    scale: 1.5,
    opacity: 0.15,
    animationSpeed: 0.8,
  },
  /** Halo - large, very subtle */
  halo: {
    scale: 2,
    opacity: 0.08,
    animationSpeed: 0.5,
  },
} as const;

export type GlowLayerPreset = keyof typeof GlowLayerPresets;

export default GlowLayer;
