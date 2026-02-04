'use client';

import { Suspense, useState, useEffect, useSyncExternalStore } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
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
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="bg-background-primary absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary-500 h-12 w-12 animate-spin rounded-full border-2 border-t-transparent" />
        <span className="text-sm text-gray-400">Loading 3D scene...</span>
      </div>
    </div>
  );
}

/**
 * Error fallback component
 */
function ErrorFallback() {
  return (
    <div className="bg-background-primary absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">
          <span role="img" aria-label="Computer">
            💻
          </span>
        </div>
        <p className="text-gray-400">
          3D visualization requires WebGL support.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please use a modern browser with WebGL enabled.
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
  const [hasError, setHasError] = useState(false);

  // Use useSyncExternalStore for WebGL support check (avoids useEffect setState)
  const isSupported = useSyncExternalStore(
    subscribeToWebGLSupport,
    getWebGLSupportSnapshot,
    getWebGLSupportServerSnapshot
  );

  // Handle WebGL context loss
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost');
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

export default HeroCanvas;
