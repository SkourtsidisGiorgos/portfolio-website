'use client';

import { Suspense, useState, useEffect, useSyncExternalStore } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
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
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary-500 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
        <span className="text-sm text-gray-400">Loading skills globe...</span>
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
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        </div>
        <p className="text-gray-400">3D globe requires WebGL support.</p>
        <p className="mt-1 text-sm text-gray-500">
          View skills list below instead.
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
      console.warn('WebGL context lost in SkillsCanvas');
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
