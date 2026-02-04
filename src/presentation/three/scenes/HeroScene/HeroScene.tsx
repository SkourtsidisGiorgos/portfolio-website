'use client';

import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { DataParticleSystem } from './DataParticleSystem';
import { ETLPipelineVisualization } from './ETLPipelineVisualization';
import { useHeroScene } from './useHeroScene';
import { SceneEnvironment } from '../../components/SceneEnvironment';
import { PostProcessing } from '../../effects/PostProcessing';
import { useMousePosition } from '../../hooks/useMousePosition';
import type { ETLNode } from './domain/ETLNode';
import type { PipelineConfig } from './domain/PipelineConfig';
import type * as THREE from 'three';

export interface HeroSceneProps {
  /** Override pipeline configuration */
  config?: PipelineConfig;
  /** Override quality level */
  quality?: 'high' | 'medium' | 'low';
  /** Whether to show particle system */
  showParticles?: boolean;
  /** Whether animation is paused */
  paused?: boolean;
  /** Enable camera parallax on mouse movement */
  enableParallax?: boolean;
  /** Parallax intensity (0-1) */
  parallaxIntensity?: number;
  /** Enable orbit controls (for development) */
  enableOrbitControls?: boolean;
  /** Enable post-processing effects */
  enableEffects?: boolean;
  /** Node hover callback */
  onNodeHover?: (node: ETLNode | null) => void;
  /** Node click callback */
  onNodeClick?: (node: ETLNode) => void;
}

/**
 * Main Hero scene composition.
 * Combines ETL pipeline visualization, particles, and effects.
 */
export function HeroScene({
  config: configOverride,
  quality: qualityOverride,
  showParticles = true,
  paused = false,
  enableParallax = true,
  parallaxIntensity = 0.5,
  enableOrbitControls = false,
  enableEffects: effectsOverride,
  onNodeHover,
  onNodeClick,
}: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Use hero scene hook for configuration
  const {
    config,
    enableEffects: configEffects,
    particleCount,
    handleNodeHover,
    handleNodeClick,
  } = useHeroScene({
    qualityOverride,
    customConfig: configOverride,
  });

  const enableEffects = effectsOverride ?? configEffects;

  // Mouse position for parallax
  const mousePosition = useMousePosition();

  // Camera parallax animation using the camera ref from R3F
  // This is the standard pattern for animating camera in React Three Fiber
  useFrame(({ camera: frameCamera }) => {
    if (!enableParallax || paused) return;

    // Smooth camera movement based on normalized mouse position (-1 to 1)
    const targetX = mousePosition.normalizedX * parallaxIntensity * 2;
    const targetY = mousePosition.normalizedY * parallaxIntensity * 2;

    frameCamera.position.x += (targetX - frameCamera.position.x) * 0.05;
    frameCamera.position.y += (targetY - frameCamera.position.y) * 0.05;

    // Always look at center
    frameCamera.lookAt(0, 0, 0);
  });

  // Subtle auto-rotation
  useFrame(state => {
    if (!groupRef.current || paused) return;

    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
  });

  // Combined callbacks
  const onHover = (node: ETLNode | null) => {
    handleNodeHover(node);
    onNodeHover?.(node);
  };

  const onClick = (node: ETLNode) => {
    handleNodeClick(node);
    onNodeClick?.(node);
  };

  return (
    <>
      {/* Shared scene environment */}
      <SceneEnvironment
        ambientIntensity={0.3}
        directionalIntensity={0.8}
        pointLightIntensity={1.25}
        starCount={5000}
        starSpeed={0.5}
      />

      {/* Main scene group */}
      <group ref={groupRef}>
        {/* ETL Pipeline */}
        <ETLPipelineVisualization
          config={config}
          paused={paused}
          onNodeHover={onHover}
          onNodeClick={onClick}
        />

        {/* Particle system */}
        {showParticles && (
          <DataParticleSystem count={particleCount} paused={paused} />
        )}
      </group>

      {/* Post-processing effects */}
      {enableEffects && (
        <PostProcessing
          bloom
          bloomIntensity={1.5}
          bloomThreshold={0.2}
          vignette
          vignetteDarkness={0.4}
          chromaticAberration
        />
      )}

      {/* Development orbit controls */}
      {enableOrbitControls && (
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={30}
        />
      )}
    </>
  );
}

export default HeroScene;
