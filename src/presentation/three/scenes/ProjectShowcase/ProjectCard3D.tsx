'use client';

import { useRef, useState, useMemo } from 'react';
import { Html, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Project } from '@/domain/portfolio/entities/Project';
import { SafeText } from '../../components/SafeText';
import { useCursorPointer } from '../../hooks/useCursorPointer';
import type { ProjectCard3DConfig } from './domain/ProjectCard3DConfig';

export interface ProjectCard3DProps {
  /** ProjectCard3DConfig value object */
  config: ProjectCard3DConfig;
  /** Whether this card is selected */
  selected?: boolean;
  /** Whether animation is paused */
  paused?: boolean;
  /** Hover callback */
  onHover?: (project: Project | null) => void;
  /** Click callback */
  onClick?: (project: Project) => void;
}

/**
 * Card dimensions
 */
const CARD_WIDTH = 2.4;
const CARD_HEIGHT = 1.6;
const CARD_DEPTH = 0.08;
const CARD_RADIUS = 0.1;

/**
 * 3D representation of a project card.
 * Features floating animation, hover effects, and flip animation.
 */
export function ProjectCard3D({
  config,
  selected = false,
  paused = false,
  onHover,
  onClick,
}: ProjectCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { setPointer, setAuto } = useCursorPointer();

  const { project, position, rotation, scale, floatingAnimation } = config;
  const color = config.getColor();

  // Animation state
  const targetRotationY = useRef(0);
  const currentRotationY = useRef(0);
  const floatOffset = useRef(0);

  // Memoize position array
  const positionArray = useMemo(() => position.toArray(), [position]);

  // Memoize rotation array
  const rotationArray = useMemo(() => rotation.toArray(), [rotation]);

  // Animation
  useFrame((state, delta) => {
    if (paused) return;

    const time = state.clock.elapsedTime;

    // Floating animation (Y oscillation)
    const { amplitude, frequency, phase } = floatingAnimation;
    floatOffset.current = Math.sin(time * frequency + phase) * amplitude;

    // Apply floating to group
    if (groupRef.current) {
      groupRef.current.position.y = positionArray[1] + floatOffset.current;
    }

    // Flip animation
    targetRotationY.current = flipped ? Math.PI : 0;
    currentRotationY.current = THREE.MathUtils.lerp(
      currentRotationY.current,
      targetRotationY.current,
      delta * 8
    );

    if (cardRef.current) {
      cardRef.current.rotation.y = currentRotationY.current;
    }

    // Hover scale effect
    if (cardRef.current) {
      const targetScale = hovered || selected ? 1.08 : 1;
      cardRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 10
      );
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(project);
    setPointer();
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(null);
    setAuto();
  };

  const handleClick = () => {
    onClick?.(project);
  };

  const handleDoubleClick = () => {
    setFlipped(prev => !prev);
  };

  // Scale dimensions
  const scaledWidth = CARD_WIDTH * scale;
  const scaledHeight = CARD_HEIGHT * scale;

  return (
    <group ref={groupRef} position={positionArray} rotation={rotationArray}>
      <group ref={cardRef}>
        {/* Card mesh */}
        <RoundedBox
          args={[scaledWidth, scaledHeight, CARD_DEPTH]}
          radius={CARD_RADIUS}
          smoothness={4}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <meshStandardMaterial
            color={hovered || selected ? color.lighten(0.1).toHex() : '#1a1a2e'}
            emissive={color.toHex()}
            emissiveIntensity={selected ? 0.3 : hovered ? 0.2 : 0.1}
            metalness={0.1}
            roughness={0.7}
          />
        </RoundedBox>

        {/* Card border glow */}
        <RoundedBox
          args={[scaledWidth + 0.02, scaledHeight + 0.02, CARD_DEPTH - 0.02]}
          radius={CARD_RADIUS + 0.01}
          smoothness={4}
          position={[0, 0, -0.02]}
        >
          <meshBasicMaterial
            color={color.toHex()}
            transparent
            opacity={selected ? 0.6 : hovered ? 0.4 : 0.2}
            side={THREE.BackSide}
          />
        </RoundedBox>

        {/* Front face content */}
        <group position={[0, 0, CARD_DEPTH / 2 + 0.01]}>
          {/* Project type badge */}
          <mesh position={[-scaledWidth / 2 + 0.3, scaledHeight / 2 - 0.15, 0]}>
            <planeGeometry args={[0.5, 0.18]} />
            <meshBasicMaterial
              color={color.toHex()}
              transparent
              opacity={0.9}
            />
          </mesh>
          <SafeText
            position={[-scaledWidth / 2 + 0.3, scaledHeight / 2 - 0.15, 0.01]}
            fontSize={0.08}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor="#000000"
          >
            {project.type.toUpperCase()}
          </SafeText>

          {/* Project title */}
          <SafeText
            position={[0, 0.15, 0]}
            fontSize={0.14}
            maxWidth={scaledWidth - 0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.008}
            outlineColor="#000000"
          >
            {project.title}
          </SafeText>

          {/* Short description */}
          <SafeText
            position={[0, -0.2, 0]}
            fontSize={0.08}
            maxWidth={scaledWidth - 0.4}
            color="#c0c0c0"
            anchorX="center"
            anchorY="middle"
            lineHeight={1.3}
            textAlign="center"
            outlineWidth={0.004}
            outlineColor="#000000"
          >
            {project.description.length > 80
              ? `${project.description.slice(0, 80)}...`
              : project.description}
          </SafeText>

          {/* Tech badges */}
          <group position={[0, -scaledHeight / 2 + 0.2, 0]}>
            {project.technologies.items.slice(0, 3).map((tech, i) => (
              <group key={tech} position={[(i - 1) * 0.6, 0, 0]}>
                <mesh>
                  <planeGeometry args={[0.5, 0.14]} />
                  <meshBasicMaterial
                    color="#2a2a3e"
                    transparent
                    opacity={0.8}
                  />
                </mesh>
                <SafeText
                  position={[0, 0, 0.01]}
                  fontSize={0.06}
                  color={color.toHex()}
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.003}
                  outlineColor="#000000"
                >
                  {tech}
                </SafeText>
              </group>
            ))}
          </group>
        </group>

        {/* Back face content (visible when flipped) */}
        <group
          position={[0, 0, -CARD_DEPTH / 2 - 0.01]}
          rotation={[0, Math.PI, 0]}
        >
          <SafeText
            position={[0, scaledHeight / 2 - 0.2, 0]}
            fontSize={0.12}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.006}
            outlineColor="#000000"
          >
            {project.title}
          </SafeText>

          <SafeText
            position={[0, 0, 0]}
            fontSize={0.07}
            maxWidth={scaledWidth - 0.3}
            color="#c0c0c0"
            anchorX="center"
            anchorY="middle"
            lineHeight={1.4}
            textAlign="center"
            outlineWidth={0.003}
            outlineColor="#000000"
          >
            {project.description}
          </SafeText>

          {/* Links hint */}
          <SafeText
            position={[0, -scaledHeight / 2 + 0.2, 0]}
            fontSize={0.07}
            color={color.toHex()}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.003}
            outlineColor="#000000"
          >
            Click to view details
          </SafeText>
        </group>

        {/* Featured badge */}
        {project.featured && (
          <Html
            position={[
              scaledWidth / 2 - 0.15,
              scaledHeight / 2 - 0.1,
              CARD_DEPTH / 2 + 0.02,
            ]}
            center
            zIndexRange={[0, 10]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-bold text-white shadow-lg">
              Featured
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
