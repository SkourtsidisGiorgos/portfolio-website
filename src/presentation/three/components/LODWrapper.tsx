'use client';

import {
  useRef,
  useMemo,
  useState,
  type ReactElement,
  Children,
  isValidElement,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { usePerformanceMode } from '../hooks/usePerformanceMode';
import type * as THREE from 'three';

/**
 * Props for LODWrapper component
 */
export interface LODWrapperProps {
  /**
   * Distance thresholds for each LOD level.
   * Array of numbers where each index corresponds to a child.
   * Lower index = higher detail, shown when closer.
   * @example [0, 10, 30] - First child at 0-10, second at 10-30, third at 30+
   */
  distances: number[];
  /**
   * Children components for each LOD level.
   * Should match the length of distances array.
   * Order: highest detail first, lowest detail last.
   */
  children: ReactElement | ReactElement[];
  /**
   * Whether to use quality-adjusted distances.
   * If true, distances are scaled based on device capabilities.
   */
  useQualityScaling?: boolean;
  /**
   * Position of the LOD object.
   */
  position?: [number, number, number];
  /**
   * Rotation of the LOD object.
   */
  rotation?: [number, number, number];
  /**
   * Scale of the LOD object.
   */
  scale?: number | [number, number, number];
}

/**
 * Level of Detail wrapper for React Three Fiber.
 *
 * Automatically switches between detail levels based on camera distance.
 * Integrates with usePerformanceMode for quality-aware LOD distances.
 *
 * Single Responsibility: LOD management.
 *
 * @example
 * ```tsx
 * <LODWrapper distances={[0, 10, 30]}>
 *   <HighDetailMesh />
 *   <MediumDetailMesh />
 *   <LowDetailMesh />
 * </LODWrapper>
 * ```
 */
export function LODWrapper({
  distances,
  children,
  useQualityScaling = true,
  position,
  rotation,
  scale,
}: LODWrapperProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { quality } = usePerformanceMode();
  const { camera } = useThree();
  const [activeLevel, setActiveLevel] = useState(0);

  // Scale distances based on quality level
  const scaledDistances = useMemo(() => {
    if (!useQualityScaling) return distances;

    const baseMultiplier =
      quality === 'high' ? 1 : quality === 'medium' ? 0.8 : 0.6;

    return distances.map(d => d * baseMultiplier);
  }, [distances, quality, useQualityScaling]);

  // Convert children to array
  const childArray = useMemo(() => {
    const arr: ReactElement[] = [];
    Children.forEach(children, child => {
      if (isValidElement(child)) {
        arr.push(child);
      }
    });
    return arr;
  }, [children]);

  // Update active level based on camera distance
  useFrame(() => {
    if (!groupRef.current) return;

    const distance = groupRef.current.position.distanceTo(camera.position);

    // Find the appropriate level based on distance
    let newLevel = 0;
    for (let i = 0; i < scaledDistances.length; i++) {
      if (distance >= scaledDistances[i]) {
        newLevel = i;
      }
    }

    // Clamp to available children
    newLevel = Math.min(newLevel, childArray.length - 1);

    if (newLevel !== activeLevel) {
      setActiveLevel(newLevel);
    }
  });

  // Get the active child
  const activeChild = childArray[activeLevel] || childArray[0];

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {activeChild}
    </group>
  );
}

/**
 * Simple LOD that shows/hides based on a single distance threshold.
 * More performant than full LOD for simple use cases.
 */
export interface SimpleLODProps {
  /** Distance at which to hide */
  hideDistance: number;
  /** Children to show/hide */
  children: ReactElement;
  /** Position of the object */
  position?: [number, number, number];
}

/**
 * Simple distance-based visibility component.
 * Hides children when camera is beyond hideDistance.
 */
export function SimpleLOD({
  hideDistance,
  children,
  position,
}: SimpleLODProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const { quality } = usePerformanceMode();

  // Adjust distance based on quality
  const adjustedDistance = useMemo(() => {
    const multiplier =
      quality === 'high' ? 1 : quality === 'medium' ? 0.8 : 0.6;
    return hideDistance * multiplier;
  }, [hideDistance, quality]);

  useFrame(() => {
    if (groupRef.current) {
      const distance = groupRef.current.position.distanceTo(camera.position);
      groupRef.current.visible = distance < adjustedDistance;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {children}
    </group>
  );
}
