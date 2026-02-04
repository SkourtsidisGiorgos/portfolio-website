'use client';

import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SkillNode } from './domain/SkillNode';

export interface SkillNode3DProps {
  /** SkillNode value object */
  node: SkillNode;
  /** Node scale multiplier */
  nodeScale?: number;
  /** Whether this node is selected */
  selected?: boolean;
  /** Whether this node is filtered out (not matching category) */
  filtered?: boolean;
  /** Whether animation is paused */
  paused?: boolean;
  /** Hover callback */
  onHover?: (node: SkillNode | null) => void;
  /** Click callback */
  onClick?: (node: SkillNode) => void;
}

/**
 * 3D representation of a skill on the globe.
 * Shows as a glowing sphere with tooltip on hover.
 */
export function SkillNode3D({
  node,
  nodeScale = 1,
  selected = false,
  filtered = false,
  paused = false,
  onHover,
  onClick,
}: SkillNode3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animation
  useFrame(state => {
    if (paused) return;

    const time = state.clock.elapsedTime;

    // Pulsing effect when hovered or selected
    if (meshRef.current) {
      const basePulse = selected || hovered ? 0.15 : 0.05;
      const pulse = 1 + basePulse * Math.sin(time * 3);
      meshRef.current.scale.setScalar(pulse);
    }

    // Glow intensity based on hover/selection
    if (glowRef.current) {
      const targetOpacity = selected ? 0.4 : hovered ? 0.3 : 0.15;
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity += (targetOpacity - material.opacity) * 0.1;
    }
  });

  const handlePointerOver = () => {
    if (filtered) return;
    setHovered(true);
    onHover?.(node);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = () => {
    if (filtered) return;
    onClick?.(node);
  };

  const scaledSize = node.size * nodeScale;
  const position = node.position.toArray();

  // Fade out when filtered
  const materialOpacity = filtered ? 0.2 : 0.9;
  const glowOpacity = filtered ? 0.05 : 0.15;

  return (
    <group ref={groupRef} position={position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[scaledSize, 16, 16]} />
        <meshStandardMaterial
          color={node.color.toHex()}
          emissive={node.color.toHex()}
          emissiveIntensity={selected ? 0.8 : hovered ? 0.6 : 0.4}
          metalness={0.2}
          roughness={0.5}
          transparent
          opacity={materialOpacity}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.8}>
        <sphereGeometry args={[scaledSize, 12, 12]} />
        <meshBasicMaterial
          color={node.color.toHex()}
          transparent
          opacity={glowOpacity}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Tooltip on hover */}
      {(hovered || selected) && !filtered && (
        <Html
          position={[0, scaledSize + 0.3, 0]}
          center
          style={{
            pointerEvents: 'none',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="rounded-md bg-gray-900/90 px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white shadow-lg backdrop-blur-sm">
            {node.skill.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default SkillNode3D;
