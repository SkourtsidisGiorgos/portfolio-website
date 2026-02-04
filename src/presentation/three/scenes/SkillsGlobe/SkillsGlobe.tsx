'use client';

import { useRef, useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Skill, SkillCategory } from '@/domain/portfolio/entities/Skill';
import { GlobeConfig } from './domain/GlobeConfig';
import { SkillNode } from './domain/SkillNode';
import { GlobeSurface } from './GlobeSurface';
import { SkillNode3D } from './SkillNode3D';
import { SceneEnvironment } from '../../components/SceneEnvironment';
import {
  PostProcessing,
  PostProcessingPresets,
} from '../../effects/PostProcessing';
import type * as THREE from 'three';

export interface SkillsGlobeProps {
  /** Array of skill entities */
  skills: Skill[];
  /** Currently selected category filter (null = show all) */
  selectedCategory?: SkillCategory | null;
  /** Currently selected skill */
  selectedSkill?: Skill | null;
  /** Globe configuration */
  config?: GlobeConfig;
  /** Whether animation is paused */
  paused?: boolean;
  /** Enable orbit controls */
  enableOrbitControls?: boolean;
  /** Callback when a skill is selected */
  onSkillSelect?: (skill: Skill | null) => void;
  /** Callback when a skill is hovered */
  onSkillHover?: (skill: Skill | null) => void;
}

/**
 * Main 3D globe scene showing skills distributed on a sphere.
 * Features auto-rotation, category filtering, and skill selection.
 */
export function SkillsGlobe({
  skills,
  selectedCategory = null,
  selectedSkill = null,
  config = GlobeConfig.default(),
  paused = false,
  enableOrbitControls = true,
  onSkillSelect,
  onSkillHover,
}: SkillsGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const interactionRef = useRef(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Map skills to SkillNode value objects with positions
  const skillNodes = useMemo(() => {
    return skills.map((skill, index) =>
      SkillNode.fromSkill(skill, index, skills.length, config.radius)
    );
  }, [skills, config.radius]);

  // Auto-rotation when not interacting
  useFrame(() => {
    if (groupRef.current && !paused && !interactionRef.current) {
      groupRef.current.rotation.y += config.rotationSpeed * 0.01;
    }
  });

  // Handle orbit control interaction
  const handleControlStart = () => {
    interactionRef.current = true;
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  };

  const handleControlEnd = () => {
    // Resume auto-rotation after 2 seconds of no interaction
    interactionTimeoutRef.current = setTimeout(() => {
      interactionRef.current = false;
    }, 2000);
  };

  // Skill interaction handlers
  const handleSkillHover = (node: SkillNode | null) => {
    onSkillHover?.(node?.skill ?? null);
  };

  const handleSkillClick = (node: SkillNode) => {
    // Toggle selection
    if (selectedSkill?.id === node.skill.id) {
      onSkillSelect?.(null);
    } else {
      onSkillSelect?.(node.skill);
    }
  };

  // Check if a skill is filtered out
  const isFiltered = (skill: Skill): boolean => {
    return selectedCategory !== null && skill.category !== selectedCategory;
  };

  return (
    <>
      {/* Shared scene environment */}
      <SceneEnvironment
        ambientIntensity={0.4}
        directionalIntensity={0.6}
        starCount={3000}
        starSpeed={0.3}
      />

      {/* Main globe group */}
      <group ref={groupRef}>
        {/* Wireframe globe surface */}
        <GlobeSurface
          radius={config.radius}
          opacity={0.08}
          rotationSpeed={config.rotationSpeed * 0.5}
          paused={paused}
        />

        {/* Skill nodes */}
        {skillNodes.map(node => (
          <SkillNode3D
            key={node.skill.id}
            node={node}
            nodeScale={config.nodeScale}
            selected={selectedSkill?.id === node.skill.id}
            filtered={isFiltered(node.skill)}
            paused={paused}
            onHover={handleSkillHover}
            onClick={handleSkillClick}
          />
        ))}
      </group>

      {/* Post-processing effects */}
      {config.enableEffects && (
        <PostProcessing {...PostProcessingPresets.subtle} />
      )}

      {/* Orbit controls */}
      {enableOrbitControls && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate
          rotateSpeed={0.5}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
          onStart={handleControlStart}
          onEnd={handleControlEnd}
        />
      )}
    </>
  );
}

export default SkillsGlobe;
