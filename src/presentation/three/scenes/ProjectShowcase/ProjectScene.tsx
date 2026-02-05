'use client';

import { useRef, useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Project } from '@/domain/portfolio/entities/Project';
import { ProjectCard3DConfig } from './domain/ProjectCard3DConfig';
import { ShowcaseLayout } from './domain/ShowcaseLayout';
import { ProjectCard3D } from './ProjectCard3D';
import { SceneEnvironment } from '../../components/SceneEnvironment';
import {
  PostProcessing,
  PostProcessingPresets,
} from '../../effects/PostProcessing';
import type * as THREE from 'three';

export interface ProjectSceneProps {
  /** Array of project entities */
  projects: Project[];
  /** Currently selected project */
  selectedProject?: Project | null;
  /** Layout type: 'grid', 'spiral', or 'featured' */
  layout?: 'grid' | 'spiral' | 'featured';
  /** Number of columns for grid layout */
  columns?: number;
  /** Whether animation is paused */
  paused?: boolean;
  /** Enable orbit controls */
  enableOrbitControls?: boolean;
  /** Enable post-processing effects */
  enableEffects?: boolean;
  /** Callback when a project is selected */
  onProjectSelect?: (project: Project | null) => void;
  /** Callback when a project is hovered */
  onProjectHover?: (project: Project | null) => void;
}

/**
 * Main 3D scene for project showcase.
 * Composes ProjectCard3D[] with ShowcaseLayout.
 */
export function ProjectScene({
  projects,
  selectedProject = null,
  layout = 'grid',
  columns = 3,
  paused = false,
  enableOrbitControls = true,
  enableEffects = true,
  onProjectSelect,
  onProjectHover,
}: ProjectSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const interactionRef = useRef(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate layout positions
  const showcaseLayout = useMemo(() => {
    const count = projects.length;
    switch (layout) {
      case 'spiral':
        return ShowcaseLayout.spiral(count, 4);
      case 'featured':
        return ShowcaseLayout.featured(count);
      case 'grid':
      default:
        return ShowcaseLayout.grid(count, columns);
    }
  }, [projects.length, layout, columns]);

  // Map projects to card configs
  const cardConfigs = useMemo(() => {
    const positions = showcaseLayout.getPositions();
    const scales = showcaseLayout.getScales();

    return projects.map((project, index) => {
      const position = positions[index];
      const scale = scales[index];

      // Use featured config for featured projects in featured layout
      if (layout === 'featured' && index === 0 && project.featured) {
        return ProjectCard3DConfig.featured(project);
      }

      // Create config with calculated position
      return ProjectCard3DConfig.custom(
        project,
        position,
        position.scale(0), // Zero rotation
        scale
      );
    });
  }, [projects, showcaseLayout, layout]);

  // Gentle auto-rotation when not interacting
  useFrame(() => {
    if (groupRef.current && !paused && !interactionRef.current) {
      groupRef.current.rotation.y += 0.001;
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
    // Resume auto-rotation after 3 seconds of no interaction
    interactionTimeoutRef.current = setTimeout(() => {
      interactionRef.current = false;
    }, 3000);
  };

  // Project interaction handlers
  const handleProjectHover = (project: Project | null) => {
    onProjectHover?.(project);
  };

  const handleProjectClick = (project: Project) => {
    // Toggle selection
    if (selectedProject?.id === project.id) {
      onProjectSelect?.(null);
    } else {
      onProjectSelect?.(project);
    }
  };

  return (
    <>
      {/* Shared scene environment */}
      <SceneEnvironment
        ambientIntensity={0.5}
        directionalIntensity={0.8}
        pointLightIntensity={1.25}
        starCount={2000}
        starSpeed={0.2}
      />

      {/* Main content group */}
      <group ref={groupRef}>
        {/* Project cards */}
        {cardConfigs.map(config => (
          <ProjectCard3D
            key={config.project.id}
            config={config}
            selected={selectedProject?.id === config.project.id}
            paused={paused}
            onHover={handleProjectHover}
            onClick={handleProjectClick}
          />
        ))}
      </group>

      {/* Post-processing effects */}
      {enableEffects && <PostProcessing {...PostProcessingPresets.subtle} />}

      {/* Orbit controls */}
      {enableOrbitControls && (
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
          onStart={handleControlStart}
          onEnd={handleControlEnd}
        />
      )}
    </>
  );
}
