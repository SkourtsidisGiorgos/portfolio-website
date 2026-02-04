'use client';

import { useRef, useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Position3D } from '@/presentation/three/domain/value-objects/Position3D';

export interface TimelineConnectionProps {
  /** Start position */
  from: Position3D;
  /** End position */
  to: Position3D;
  /** Whether this connection is active (leads to/from selected node) */
  active?: boolean;
  /** Animation progress (0-1 for reveal animation) */
  progress?: number;
  /** Connection opacity */
  opacity?: number;
  /** Whether to show data flow particles */
  showParticles?: boolean;
  /** Whether animation is paused */
  paused?: boolean;
}

/**
 * Animated connection line between timeline nodes.
 * Features gradient color and optional data flow particles.
 */
export function TimelineConnection({
  from,
  to,
  active = false,
  progress = 1,
  opacity = 0.6,
  showParticles = false,
  paused = false,
}: TimelineConnectionProps) {
  const particleRef = useRef<THREE.Mesh>(null);

  // Generate curve points with slight arc
  const { points, curve } = useMemo(() => {
    const startVec = new THREE.Vector3(...from.toArray());
    const endVec = new THREE.Vector3(...to.toArray());

    // Add slight upward curve for visual interest
    const midPoint = new THREE.Vector3()
      .addVectors(startVec, endVec)
      .multiplyScalar(0.5);
    midPoint.y += 0.5;

    const curvePath = new THREE.QuadraticBezierCurve3(
      startVec,
      midPoint,
      endVec
    );

    // Get points up to the progress point
    const totalPoints = 50;
    const pointCount = Math.max(2, Math.floor(totalPoints * progress));
    const pts = curvePath.getPoints(pointCount);

    return { points: pts, curve: curvePath };
  }, [from, to, progress]);

  // Animate data flow particle
  useFrame(state => {
    if (paused || !showParticles || !particleRef.current) return;

    const t = (state.clock.elapsedTime * 0.5) % 1;
    const position = curve.getPoint(t);
    particleRef.current.position.copy(position);
  });

  // Color based on active state
  const lineColor = active ? '#00bcd4' : '#4a5568';
  const lineOpacity = active ? opacity * 1.2 : opacity * 0.8;
  const lineWidth = active ? 2 : 1.5;

  return (
    <group>
      {/* Main connection line */}
      <Line
        points={points}
        color={lineColor}
        lineWidth={lineWidth}
        transparent
        opacity={lineOpacity}
        dashed={!active}
        dashSize={active ? 0 : 0.1}
        gapSize={active ? 0 : 0.05}
      />

      {/* Glow effect for active connections */}
      {active && (
        <Line
          points={points}
          color={lineColor}
          lineWidth={lineWidth * 3}
          transparent
          opacity={lineOpacity * 0.3}
        />
      )}

      {/* Data flow particle */}
      {showParticles && active && (
        <mesh ref={particleRef}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#00bcd4" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}

export default TimelineConnection;
