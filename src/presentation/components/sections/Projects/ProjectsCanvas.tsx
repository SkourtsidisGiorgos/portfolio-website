'use client';

import { Suspense, useState, useEffect, useSyncExternalStore } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
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
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary-500 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
        <span className="text-sm text-gray-400">
          Loading project showcase...
        </span>
      </div>
    </div>
  );
}

/**
 * Error fallback component
 */
function ErrorFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="text-center">
        <div className="text-primary-500/50 mb-3 text-4xl">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
        </div>
        <p className="text-gray-400">3D showcase requires WebGL support.</p>
        <p className="mt-1 text-sm text-gray-500">
          View projects grid below instead.
        </p>
      </div>
    </div>
  );
}

/**
 * Check if WebGL is supported (cached result)
 */
let webGLSupportCache: boolean | null = null;

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true; // SSR

  if (webGLSupportCache !== null) return webGLSupportCache;

  try {
    const canvas = document.createElement('canvas');
    webGLSupportCache = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    webGLSupportCache = false;
  }

  return webGLSupportCache;
}

// Subscribe function for useSyncExternalStore (no-op since WebGL support doesn't change)
function subscribeToWebGLSupport(_callback: () => void): () => void {
  return () => {};
}

// Snapshot functions
function getWebGLSupportSnapshot(): boolean {
  return checkWebGLSupport();
}

function getWebGLSupportServerSnapshot(): boolean {
  return true; // Assume supported on server
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
  const [hasError, setHasError] = useState(false);

  // Use useSyncExternalStore for WebGL support check
  const isSupported = useSyncExternalStore(
    subscribeToWebGLSupport,
    getWebGLSupportSnapshot,
    getWebGLSupportServerSnapshot
  );

  // Handle WebGL context loss
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost in ProjectsCanvas');
      setHasError(true);
    };

    const handleContextRestored = () => {
      setHasError(false);
    };

    window.addEventListener('webglcontextlost', handleContextLost);
    window.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  // Show error fallback if WebGL not supported or context lost
  if (!isSupported || hasError) {
    return (
      <div
        className={`relative ${className}`}
        style={{ height }}
        aria-hidden="true"
      >
        {errorFallback || <ErrorFallback />}
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <Suspense fallback={fallback || <LoadingFallback />}>
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
