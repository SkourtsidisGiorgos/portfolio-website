'use client';

import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCursorPointer } from '../../hooks/useCursorPointer';
import type { ETLNode } from './domain/ETLNode';

export interface ETLNode3DProps {
  /** ETL node value object */
  node: ETLNode;
  /** Whether to show the label */
  showLabel?: boolean;
  /** Label offset from node */
  labelOffset?: [number, number, number];
  /** Whether animation is paused */
  paused?: boolean;
  /** Hover callback */
  onHover?: (node: ETLNode | null) => void;
  /** Click callback */
  onClick?: (node: ETLNode) => void;
}

/**
 * 3D representation of an ETL pipeline node.
 * Composes GlowingSphere and FloatingText primitives.
 */
export function ETLNode3D({
  node,
  showLabel = true,
  labelOffset = [0, 0.8, 0],
  paused = false,
  onHover,
  onClick,
}: ETLNode3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { setPointer, setAuto } = useCursorPointer();

  // Animation
  useFrame(state => {
    if (paused) return;

    const time = state.clock.elapsedTime;

    // Subtle floating animation
    if (groupRef.current) {
      groupRef.current.position.y =
        node.position.y + Math.sin(time * 1.5 + node.position.x) * 0.1;
    }

    // Pulsing glow
    if (glowRef.current) {
      const scale = 1 + 0.2 * Math.sin(time * 2 + node.position.x * 0.5);
      glowRef.current.scale.setScalar(scale);
    }

    // Subtle rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const handlePointerOver = () => {
    onHover?.(node);
    setPointer();
  };

  const handlePointerOut = () => {
    onHover?.(null);
    setAuto();
  };

  const handleClick = () => {
    if (onClick) {
      onClick(node);
    }
  };

  return (
    <group
      ref={groupRef}
      position={[node.position.x, node.position.y, node.position.z]}
    >
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[node.radius, 32, 32]} />
        <meshStandardMaterial
          color={node.color.toHex()}
          emissive={node.color.toHex()}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.5}>
        <sphereGeometry args={[node.radius, 16, 16]} />
        <meshBasicMaterial
          color={node.color.toHex()}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[node.radius * 1.2, 0.02, 8, 32]} />
        <meshBasicMaterial
          color={node.color.toHex()}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Text
          position={labelOffset}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {node.label}
        </Text>
      )}
    </group>
  );
}

export default ETLNode3D;
