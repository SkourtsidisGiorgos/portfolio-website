'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createDataFlowMaterial, updateDataFlowTime } from '../../shaders';

export interface DataParticleSystemProps {
  /** Number of particles */
  count?: number;
  /** Spread radius */
  spread?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Start color (hex) */
  colorStart?: string;
  /** End color (hex) */
  colorEnd?: string;
  /** Opacity */
  opacity?: number;
  /** Whether animation is paused */
  paused?: boolean;
}

// Seeded random for deterministic particle positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * High-performance particle system using InstancedMesh.
 * Creates flowing data visualization effect in the hero scene.
 */
export function DataParticleSystem({
  count = 10000,
  spread = 15,
  speed = 1,
  colorStart = '#00bcd4',
  colorEnd = '#7c3aed',
  opacity = 0.8,
  paused = false,
}: DataParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const dummyRef = useRef<THREE.Object3D | null>(null);
  const initializedRef = useRef(false);

  // Create geometry and material (pure, no random)
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.02, 4, 4);
    const mat = createDataFlowMaterial({
      colorStart,
      colorEnd,
      speed,
      opacity,
    });
    return { geometry: geo, material: mat };
  }, [colorStart, colorEnd, speed, opacity]);

  // Store material ref
  useEffect(() => {
    materialRef.current = material;
  }, [material]);

  // Initialize particle data (runs once on mount)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    dummyRef.current = new THREE.Object3D();
    positionsRef.current = new Float32Array(count * 3);
    velocitiesRef.current = new Float32Array(count * 3);

    const pos = positionsRef.current;
    const vel = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      // Use seeded random for deterministic initial positions
      const seed = i * 3;
      const theta = seededRandom(seed) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(seed + 1) - 1);
      const r = seededRandom(seed + 2) * spread;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Velocities based on seeded random
      vel[i * 3] = (seededRandom(seed + 3) - 0.5) * 0.02;
      vel[i * 3 + 1] = (seededRandom(seed + 4) - 0.5) * 0.02;
      vel[i * 3 + 2] = (seededRandom(seed + 5) - 0.5) * 0.01 + 0.01;
    }
  }, [count, spread]);

  // Animation loop
  useFrame(state => {
    if (!meshRef.current || paused) return;
    if (!positionsRef.current || !velocitiesRef.current || !dummyRef.current)
      return;

    const time = state.clock.elapsedTime;
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const dummy = dummyRef.current;

    // Update shader time uniform
    if (materialRef.current) {
      updateDataFlowTime(materialRef.current, time);
    }

    // Update particle positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Move particles
      positions[i3] += velocities[i3] * speed;
      positions[i3 + 1] += velocities[i3 + 1] * speed;
      positions[i3 + 2] += velocities[i3 + 2] * speed;

      // Add wave motion
      const wave = Math.sin(time * 2 + i * 0.01) * 0.01;
      positions[i3 + 1] += wave;

      // Reset particles that go too far
      const distance = Math.sqrt(
        positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
      );

      if (distance > spread) {
        // Reset to center with time-based offset for variation
        const seed = i * 3 + Math.floor(time * 100);
        const theta = seededRandom(seed) * Math.PI * 2;
        const phi = Math.acos(2 * seededRandom(seed + 1) - 1);
        const r = seededRandom(seed + 2) * 2;

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);
      }

      // Update instance matrix
      dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);

      // Subtle scale variation
      const scale = 0.8 + 0.4 * Math.sin(time + i * 0.1);
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
}
