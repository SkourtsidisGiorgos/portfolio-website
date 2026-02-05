'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

/**
 * WebGL support state returned by useWebGLCanvas hook
 */
export interface WebGLSupportState {
  /** Whether WebGL is supported in the current browser */
  isSupported: boolean;
  /** Whether there's an active error (e.g., context lost) */
  hasError: boolean;
  /** Whether WebGL context was lost */
  contextLost: boolean;
}

/**
 * Options for useWebGLCanvas hook
 */
export interface UseWebGLCanvasOptions {
  /** Component name for logging context loss events */
  componentName?: string;
}

// Module-level cache for WebGL support check result
let webGLSupportCache: boolean | null = null;

/**
 * Check if WebGL is supported (cached result)
 * @internal
 */
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

/**
 * Subscribe function for useSyncExternalStore
 * No-op since WebGL support doesn't change at runtime
 * @internal
 */
function subscribeToWebGLSupport(_callback: () => void): () => void {
  return () => {};
}

/**
 * Get snapshot of WebGL support for client
 * @internal
 */
function getWebGLSupportSnapshot(): boolean {
  return checkWebGLSupport();
}

/**
 * Get snapshot of WebGL support for server
 * Returns true to avoid hydration mismatches
 * @internal
 */
function getWebGLSupportServerSnapshot(): boolean {
  return true;
}

/**
 * Hook for WebGL Canvas support detection and context management.
 *
 * Consolidates duplicated WebGL boilerplate code from canvas components (DRY).
 * Uses useSyncExternalStore for SSR-safe WebGL detection with caching.
 * Handles WebGL context loss and restoration events.
 *
 * @param options - Configuration options
 * @returns WebGL support state with isSupported, hasError, and contextLost flags
 *
 * @example
 * ```tsx
 * const { isSupported, hasError } = useWebGLCanvas({ componentName: 'HeroCanvas' });
 *
 * if (!isSupported || hasError) {
 *   return <ErrorFallback />;
 * }
 *
 * return <Canvas>...</Canvas>;
 * ```
 */
export function useWebGLCanvas(
  options: UseWebGLCanvasOptions = {}
): WebGLSupportState {
  const { componentName = 'Canvas' } = options;

  const [contextLost, setContextLost] = useState(false);

  // Use useSyncExternalStore for SSR-safe WebGL support check
  const isSupported = useSyncExternalStore(
    subscribeToWebGLSupport,
    getWebGLSupportSnapshot,
    getWebGLSupportServerSnapshot
  );

  // Handle WebGL context loss/restoration
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn(`WebGL context lost in ${componentName}`);
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.info(`WebGL context restored in ${componentName}`);
      setContextLost(false);
    };

    window.addEventListener('webglcontextlost', handleContextLost);
    window.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [componentName]);

  return {
    isSupported,
    hasError: contextLost,
    contextLost,
  };
}

/**
 * Clear the WebGL support cache (for testing purposes)
 * @internal
 */
export function clearWebGLSupportCache(): void {
  webGLSupportCache = null;
}

export default useWebGLCanvas;
