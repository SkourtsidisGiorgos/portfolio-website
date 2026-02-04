'use client';

import { useRef, useMemo, useState } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  lineWidth?: number;
  animated?: boolean;
  animationSpeed?: number;
  segments?: number;
  dashed?: boolean;
  dashSize?: number;
  gapSize?: number;
  curve?: boolean;
  curveHeight?: number;
  opacity?: number;
}

export function ConnectionLine({
  start,
  end,
  color = '#00bcd4',
  lineWidth = 1,
  animated = true,
  animationSpeed = 1,
  segments = 50,
  dashed = false,
  dashSize = 0.1,
  gapSize = 0.1,
  curve = false,
  curveHeight = 1,
  opacity = 0.8,
}: ConnectionLineProps) {
  const [currentOpacity, setCurrentOpacity] = useState(opacity);
  const lastUpdateRef = useRef(0);

  // Generate curve points
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);

    if (curve) {
      // Create a quadratic bezier curve
      const midPoint = new THREE.Vector3()
        .addVectors(startVec, endVec)
        .multiplyScalar(0.5);
      midPoint.y += curveHeight;

      const curvePath = new THREE.QuadraticBezierCurve3(
        startVec,
        midPoint,
        endVec
      );

      return curvePath.getPoints(segments);
    }

    // Simple straight line
    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      linePoints.push(new THREE.Vector3().lerpVectors(startVec, endVec, t));
    }
    return linePoints;
  }, [start, end, segments, curve, curveHeight]);

  useFrame(state => {
    if (animated) {
      // Throttle state updates to every ~100ms for performance
      const now = state.clock.elapsedTime;
      if (now - lastUpdateRef.current > 0.1) {
        lastUpdateRef.current = now;
        const newOpacity =
          Math.sin(now * animationSpeed * 2) * 0.2 + (opacity * 0.8 + 0.2);
        setCurrentOpacity(newOpacity);
      }
    }
  });

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      dashed={dashed}
      dashSize={dashSize}
      gapSize={gapSize}
      transparent
      opacity={animated ? currentOpacity : opacity}
    />
  );
}

// Data flow particle that travels along the line
export interface DataFlowProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  particleSize?: number;
  speed?: number;
  curve?: boolean;
  curveHeight?: number;
}

export function DataFlow({
  start,
  end,
  color = '#00bcd4',
  particleSize = 0.05,
  speed = 1,
  curve = false,
  curveHeight = 1,
}: DataFlowProps) {
  const particleRef = useRef<THREE.Mesh>(null);

  // Create curve for particle to follow
  const curvePath = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);

    if (curve) {
      const midPoint = new THREE.Vector3()
        .addVectors(startVec, endVec)
        .multiplyScalar(0.5);
      midPoint.y += curveHeight;

      return new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    }

    return new THREE.LineCurve3(startVec, endVec);
  }, [start, end, curve, curveHeight]);

  useFrame(state => {
    if (particleRef.current) {
      // Calculate position along curve (0 to 1, looping)
      const t = (state.clock.elapsedTime * speed * 0.5) % 1;
      const position = curvePath.getPoint(t);
      particleRef.current.position.copy(position);
    }
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[particleSize, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

export default ConnectionLine;
