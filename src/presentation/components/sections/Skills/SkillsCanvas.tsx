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
  SkillsGlobe,
  type SkillsGlobeProps,
} from '@/presentation/three/scenes/SkillsGlobe';

export interface SkillsCanvasProps extends Omit<SkillsGlobeProps, 'children'> {
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
 * SkillsCanvas wraps the R3F Canvas with error boundaries and fallbacks.
 * Handles WebGL context loss and non-WebGL browsers gracefully.
 */
export function SkillsCanvas({
  height = '500px',
  fallback,
  errorFallback,
  canvasProps,
  className = '',
  ...sceneProps
}: SkillsCanvasProps) {
  const { isMounted, isSupported, hasError } = useWebGLCanvas({
    componentName: 'SkillsCanvas',
  });

  // Show loading fallback until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <div
        className={`relative ${className}`}
        style={{ height }}
        aria-hidden="true"
      >
        {fallback || <LoadingFallback message="Initializing globe..." />}
      </div>
    );
  }

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
            message="3D globe requires WebGL support."
            hint="View skills list below instead."
            icon={ErrorIcons.globe}
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
          fallback || <LoadingFallback message="Loading skills globe..." />
        }
      >
        <Canvas
          camera={{
            position: [0, 0, 8],
            fov: 50,
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
          <SkillsGlobe {...sceneProps} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default SkillsCanvas;
