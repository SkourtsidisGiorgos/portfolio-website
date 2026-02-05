'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Line } from 'three';

export interface DataPacketProps {
  /** Start position [x, y, z] */
  start: [number, number, number];
  /** End position [x, y, z] */
  end: [number, number, number];
  /** Whether the path is curved */
  curved?: boolean;
  /** Curve height (for curved paths) */
  curveHeight?: number;
  /** Packet color (hex) */
  color?: string;
  /** Animation speed */
  speed?: number;
  /** Animation offset (0-1) */
  offset?: number;
  /** Packet size */
  size?: number;
  /** Whether animation is paused */
  paused?: boolean;
}

/**
 * Animated data packet traveling along a connection path.
 * Creates visual representation of data flowing between nodes.
 */
export function DataPacket({
  start,
  end,
  curved = false,
  curveHeight = 0.5,
  color = '#00bcd4',
  speed = 1,
  offset = 0,
  size = 0.1,
  paused = false,
}: DataPacketProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<Line>(null);

  // Create the path curve
  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);

    if (curved) {
      // Quadratic bezier curve
      const midPoint = new THREE.Vector3()
        .addVectors(startVec, endVec)
        .multiplyScalar(0.5);
      midPoint.y += curveHeight;

      return new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    }

    // Straight line
    return new THREE.LineCurve3(startVec, endVec);
  }, [start, end, curved, curveHeight]);

  // Trail line object (memoized to avoid creating on each render)
  const trailLine = useMemo(() => {
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
    });
    return new THREE.Line(geometry, material);
  }, [curve, color]);

  // Animation
  useFrame(state => {
    if (!meshRef.current || paused) return;

    const time = state.clock.elapsedTime;

    // Calculate position along curve (0-1)
    const t = (((time * speed * 0.3 + offset) % 1) + 1) % 1;

    // Get position on curve
    const position = curve.getPoint(t);
    meshRef.current.position.copy(position);

    // Pulsing effect
    const pulse = 0.8 + 0.2 * Math.sin(time * 5);
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <group>
      {/* Trail line (subtle) */}
      <primitive object={trailLine} ref={trailRef} />

      {/* Data packet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>

      {/* Glow around packet */}
      <mesh>
        <sphereGeometry args={[size * 2, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
