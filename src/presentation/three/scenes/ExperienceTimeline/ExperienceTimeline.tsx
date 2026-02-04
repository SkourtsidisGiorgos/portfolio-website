'use client';

import { useRef, useMemo } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { CompanyNode } from './CompanyNode';
import { TimelineConfig } from './domain/TimelineConfig';
import { TimelineNode } from './domain/TimelineNode';
import { TimelineConnection } from './TimelineConnection';
import { SceneEnvironment } from '../../components/SceneEnvironment';
import {
  PostProcessing,
  PostProcessingPresets,
} from '../../effects/PostProcessing';
import type * as THREE from 'three';

export interface ExperienceTimelineProps {
  /** Array of experience DTOs */
  experiences: ExperienceDTO[];
  /** Currently selected experience */
  selectedExperience?: ExperienceDTO | null;
  /** Timeline configuration */
  config?: TimelineConfig;
  /** Scroll progress for reveal animations (0-1) */
  scrollProgress?: number;
  /** Whether animation is paused */
  paused?: boolean;
  /** Enable orbit controls */
  enableOrbitControls?: boolean;
  /** Callback when an experience is selected */
  onExperienceSelect?: (exp: ExperienceDTO | null) => void;
  /** Callback when an experience is hovered */
  onExperienceHover?: (exp: ExperienceDTO | null) => void;
}

/**
 * Main 3D timeline scene showing career experiences on a horizontal timeline.
 * Features company nodes, animated connections, and scroll-driven reveal.
 */
export function ExperienceTimeline({
  experiences,
  selectedExperience = null,
  config = TimelineConfig.default(),
  scrollProgress = 1,
  paused = false,
  enableOrbitControls = true,
  onExperienceSelect,
  onExperienceHover,
}: ExperienceTimelineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const interactionRef = useRef(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Map experiences to TimelineNode value objects with positions
  const timelineNodes = useMemo(() => {
    return experiences.map((exp, index) =>
      TimelineNode.fromExperience(
        exp,
        index,
        experiences.length,
        config.spacing
      )
    );
  }, [experiences, config.spacing]);

  // Calculate which nodes are visible based on scroll progress
  const visibleNodeCount = useMemo(() => {
    return Math.max(1, Math.ceil(timelineNodes.length * scrollProgress));
  }, [timelineNodes.length, scrollProgress]);

  // Auto-rotation effect (subtle horizontal drift)
  useFrame(state => {
    if (
      groupRef.current &&
      !paused &&
      config.autoRotate &&
      !interactionRef.current
    ) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
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
    interactionTimeoutRef.current = setTimeout(() => {
      interactionRef.current = false;
    }, 2000);
  };

  // Node interaction handlers
  const handleNodeHover = (node: TimelineNode | null) => {
    onExperienceHover?.(node?.experience ?? null);
  };

  const handleNodeClick = (node: TimelineNode) => {
    // Toggle selection
    if (selectedExperience?.id === node.experience.id) {
      onExperienceSelect?.(null);
    } else {
      onExperienceSelect?.(node.experience);
    }
  };

  // Find selected node index
  const selectedNodeIndex = useMemo(() => {
    if (!selectedExperience) return -1;
    return timelineNodes.findIndex(
      n => n.experience.id === selectedExperience.id
    );
  }, [selectedExperience, timelineNodes]);

  return (
    <>
      {/* Camera positioned to view horizontal timeline */}
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />

      {/* Shared scene environment */}
      <SceneEnvironment
        ambientIntensity={0.4}
        directionalIntensity={0.8}
        starCount={2000}
        starSpeed={0.2}
      />

      {/* Main timeline group */}
      <group ref={groupRef}>
        {/* Timeline connections between nodes */}
        {timelineNodes.slice(0, visibleNodeCount - 1).map((node, index) => {
          const nextNode = timelineNodes[index + 1];
          const isActive =
            selectedNodeIndex === index || selectedNodeIndex === index + 1;

          return (
            <TimelineConnection
              key={`connection-${node.experience.id}`}
              from={node.position}
              to={nextNode.position}
              active={isActive}
              progress={
                scrollProgress > (index + 1) / timelineNodes.length ? 1 : 0.5
              }
              opacity={config.connectionOpacity}
              showParticles={config.enableParticles && isActive}
              paused={paused}
            />
          );
        })}

        {/* Company nodes */}
        {timelineNodes.slice(0, visibleNodeCount).map(node => (
          <CompanyNode
            key={node.experience.id}
            node={node}
            nodeScale={config.nodeScale}
            selected={selectedExperience?.id === node.experience.id}
            paused={paused}
            onHover={handleNodeHover}
            onClick={handleNodeClick}
          />
        ))}

        {/* Timeline base line (floor indicator) */}
        <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry
            args={[config.spacing * experiences.length + 2, 0.02]}
          />
          <meshBasicMaterial color="#1a1a2e" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Post-processing effects */}
      {config.enableEffects && (
        <PostProcessing {...PostProcessingPresets.subtle} />
      )}

      {/* Orbit controls - limited for timeline view */}
      {enableOrbitControls && (
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          rotateSpeed={0.4}
          panSpeed={0.5}
          zoomSpeed={0.5}
          minDistance={4}
          maxDistance={15}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.6}
          minAzimuthAngle={-Math.PI * 0.3}
          maxAzimuthAngle={Math.PI * 0.3}
          onStart={handleControlStart}
          onEnd={handleControlEnd}
        />
      )}
    </>
  );
}

export default ExperienceTimeline;
