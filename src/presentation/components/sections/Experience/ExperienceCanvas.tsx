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
  ExperienceTimeline,
  type ExperienceTimelineProps,
} from '@/presentation/three/scenes/ExperienceTimeline';

export interface ExperienceCanvasProps extends Omit<
  ExperienceTimelineProps,
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
 * ExperienceCanvas wraps the R3F Canvas with error boundaries and fallbacks.
 * Handles WebGL context loss and non-WebGL browsers gracefully.
 */
export function ExperienceCanvas({
  height = '450px',
  fallback,
  errorFallback,
  canvasProps,
  className = '',
  ...sceneProps
}: ExperienceCanvasProps) {
  const { isSupported, hasError } = useWebGLCanvas({
    componentName: 'ExperienceCanvas',
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
            message="3D timeline requires WebGL support."
            hint="View experience list below instead."
            icon={ErrorIcons.briefcase}
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
        fallback={fallback || <LoadingFallback message="Loading timeline..." />}
      >
        <Canvas
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
          <ExperienceTimeline {...sceneProps} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default ExperienceCanvas;
