'use client';

import { Suspense } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import {
  LoadingFallback,
  ErrorFallback,
  ErrorIcons,
} from '@/presentation/three/components';
import { useWebGLCanvas } from '@/presentation/three/hooks';
import {
  ProjectScene,
  type ProjectSceneProps,
} from '@/presentation/three/scenes/ProjectShowcase';

export interface ProjectsCanvasProps extends Omit<
  ProjectSceneProps,
  'children'
> {
  /** Canvas height */
  height?: string;
  /** Show fallback for non-WebGL browsers */
  fallback?: React.ReactNode;
  /** Error fallback */
  errorFallback?: React.ReactNode;
  /** Additional canvas props */
  canvasProps?: Partial<CanvasProps>;
  /** CSS class name */
  className?: string;
}

/**
 * ProjectsCanvas wraps the R3F Canvas with error boundaries and fallbacks.
 * Handles WebGL context loss and non-WebGL browsers gracefully.
 */
export function ProjectsCanvas({
  height = '500px',
  fallback,
  errorFallback,
  canvasProps,
  className = '',
  ...sceneProps
}: ProjectsCanvasProps) {
  const { isSupported, hasError } = useWebGLCanvas({
    componentName: 'ProjectsCanvas',
  });

  // Show error fallback if WebGL not supported or context lost
  if (!isSupported || hasError) {
    return (
      <div
        className={`relative ${className}`}
        style={{ height }}
        aria-hidden="true"
      >
        {errorFallback || (
          <ErrorFallback
            message="3D showcase requires WebGL support."
            hint="View projects grid below instead."
            icon={ErrorIcons.database}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <Suspense
        fallback={
          fallback || <LoadingFallback message="Loading project showcase..." />
        }
      >
        <Canvas
          camera={{
            position: [0, 0, 10],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0a0a0f', 0);
          }}
          {...canvasProps}
        >
          <ProjectScene {...sceneProps} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default ProjectsCanvas;
