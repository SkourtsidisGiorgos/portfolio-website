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
  HeroScene,
  type HeroSceneProps,
} from '@/presentation/three/scenes/HeroScene';

export interface HeroCanvasProps extends Omit<HeroSceneProps, 'children'> {
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
 * HeroCanvas wraps the R3F Canvas with error boundaries and fallbacks.
 * Handles WebGL context loss and non-WebGL browsers gracefully.
 */
export function HeroCanvas({
  height = '100vh',
  fallback,
  errorFallback,
  canvasProps,
  className = '',
  ...sceneProps
}: HeroCanvasProps) {
  const { isMounted, isSupported, hasError } = useWebGLCanvas({
    componentName: 'HeroCanvas',
  });

  // Show loading fallback until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <div
        className={`relative ${className}`}
        style={{ height }}
        aria-hidden="true"
      >
        {fallback || (
          <LoadingFallback
            message="Initializing 3D scene..."
            background="primary"
          />
        )}
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
            message="3D visualization requires WebGL support."
            hint="Please use a modern browser with WebGL enabled."
            icon={ErrorIcons.computer}
            background="primary"
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
          fallback || (
            <LoadingFallback
              message="Loading 3D scene..."
              background="primary"
            />
          )
        }
      >
        <Canvas
          camera={{
            position: [0, 0, 10],
            fov: 60,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 2]} // Responsive pixel ratio
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            // Set clear color to match background
            gl.setClearColor('#0a0a0f', 1);
          }}
          {...canvasProps}
        >
          <HeroScene {...sceneProps} />
        </Canvas>
      </Suspense>
    </div>
  );
}
