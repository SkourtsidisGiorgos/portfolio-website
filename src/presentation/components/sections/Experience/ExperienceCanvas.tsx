'use client';

import { Suspense, useState, useEffect, useSyncExternalStore } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
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
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary-500 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
        <span className="text-sm text-gray-400">Loading timeline...</span>
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
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <p className="text-gray-400">3D timeline requires WebGL support.</p>
        <p className="mt-1 text-sm text-gray-500">
          View experience list below instead.
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
      console.warn('WebGL context lost in ExperienceCanvas');
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
