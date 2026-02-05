'use client';

import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COMPANY_COLORS } from './domain/TimelineNode';
import { useCursorPointer } from '../../hooks/useCursorPointer';
import type { TimelineNode } from './domain/TimelineNode';

export interface CompanyNodeProps {
  /** TimelineNode value object */
  node: TimelineNode;
  /** Node scale multiplier */
  nodeScale?: number;
  /** Whether this node is selected */
  selected?: boolean;
  /** Whether this node is hovered */
  hovered?: boolean;
  /** Whether animation is paused */
  paused?: boolean;
  /** Hover callback */
  onHover?: (node: TimelineNode | null) => void;
  /** Click callback */
  onClick?: (node: TimelineNode) => void;
}

/**
 * 3D representation of a company/experience on the timeline.
 * Shows as a glowing sphere with company tooltip on hover.
 */
export function CompanyNode({
  node,
  nodeScale = 1,
  selected = false,
  hovered: externalHovered = false,
  paused = false,
  onHover,
  onClick,
}: CompanyNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [internalHovered, setInternalHovered] = useState(false);
  const { setPointer, setAuto } = useCursorPointer();

  const hovered = externalHovered || internalHovered;

  // Determine colors based on state
  const baseColor = node.isCurrent
    ? COMPANY_COLORS.current
    : COMPANY_COLORS.past;
  const activeColor = selected || hovered ? COMPANY_COLORS.accent : baseColor;

  // Animation
  useFrame(state => {
    if (paused) return;

    const time = state.clock.elapsedTime;

    // Pulsing effect when hovered or selected
    if (meshRef.current) {
      const basePulse = selected || hovered ? 0.2 : 0.08;
      const pulse = 1 + basePulse * Math.sin(time * 3);
      meshRef.current.scale.setScalar(pulse);
    }

    // Glow intensity based on hover/selection
    if (glowRef.current) {
      const targetOpacity = selected
        ? 0.5
        : hovered
          ? 0.4
          : node.isCurrent
            ? 0.25
            : 0.15;
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity += (targetOpacity - material.opacity) * 0.1;
    }

    // Rotating ring for current position
    if (ringRef.current && node.isCurrent) {
      ringRef.current.rotation.z = time * 0.5;
    }
  });

  const handlePointerOver = () => {
    setInternalHovered(true);
    onHover?.(node);
    setPointer();
  };

  const handlePointerOut = () => {
    setInternalHovered(false);
    onHover?.(null);
    setAuto();
  };

  const handleClick = () => {
    onClick?.(node);
  };

  const scaledSize = node.size * nodeScale;
  const position = node.position.toArray();

  return (
    <group ref={groupRef} position={position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[scaledSize, 32, 32]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={
            selected ? 0.9 : hovered ? 0.7 : node.isCurrent ? 0.5 : 0.3
          }
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.8}>
        <sphereGeometry args={[scaledSize, 16, 16]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Current position indicator ring */}
      {node.isCurrent && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[scaledSize * 1.5, scaledSize * 1.7, 32]} />
          <meshBasicMaterial
            color={COMPANY_COLORS.current}
            transparent
            opacity={selected || hovered ? 0.6 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Company label on hover/selection */}
      {(hovered || selected) && (
        <Html
          position={[0, scaledSize + 0.5, 0]}
          center
          style={{
            pointerEvents: 'none',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="rounded-lg bg-gray-900/95 px-4 py-2 text-center shadow-xl backdrop-blur-md">
            <div className="text-sm font-semibold text-white">
              {node.experience.company}
            </div>
            <div className="text-xs text-gray-400">{node.experience.role}</div>
            <div className="text-primary-400 mt-1 text-xs">
              {node.experience.formattedDateRange}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
