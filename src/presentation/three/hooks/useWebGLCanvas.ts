'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

/**
 * WebGL support state returned by useWebGLCanvas hook
 */
export interface WebGLSupportState {
  /** Whether the component is mounted (client-side) */
  isMounted: boolean;
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
 * Performs a more thorough check to ensure context can be created with required attributes
 * @internal
 */
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true; // SSR

  if (webGLSupportCache !== null) return webGLSupportCache;

  try {
    const canvas = document.createElement('canvas');
    // Check for WebGLRenderingContext availability
    if (!window.WebGLRenderingContext) {
      webGLSupportCache = false;
      return false;
    }

    // Try to create a context with the attributes R3F uses
    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    };

    const gl =
      (canvas.getContext(
        'webgl2',
        contextAttributes
      ) as WebGL2RenderingContext | null) ||
      (canvas.getContext(
        'webgl',
        contextAttributes
      ) as WebGLRenderingContext | null) ||
      (canvas.getContext(
        'experimental-webgl',
        contextAttributes
      ) as WebGLRenderingContext | null);

    if (!gl) {
      webGLSupportCache = false;
      return false;
    }

    // Verify we can access context attributes (WebGLRenderingContext has this method)
    const attrs = gl.getContextAttributes();
    if (!attrs) {
      webGLSupportCache = false;
      return false;
    }

    webGLSupportCache = true;
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

// Mounted state tracking for client-side detection
let _isMounted = false;

function subscribeMounted(callback: () => void): () => void {
  // On first subscription, mark as mounted
  if (!_isMounted) {
    _isMounted = true;
    // Use microtask to batch with React's updates
    queueMicrotask(callback);
  }
  return () => {};
}

function getMountedSnapshot(): boolean {
  return _isMounted;
}

function getMountedServerSnapshot(): boolean {
  return false; // Server always returns false
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

  // Use useSyncExternalStore for SSR-safe mounted detection
  const isMounted = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

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
      // Using warn level since info is not allowed by ESLint config
      console.warn(`WebGL context restored in ${componentName}`);
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
    isMounted,
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
