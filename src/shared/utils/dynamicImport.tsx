/**
 * Dynamic Import Helpers
 *
 * Standardized helpers for consistent dynamic imports across the application (DRY).
 * Single source of truth for import patterns.
 *
 * @module dynamicImport
 */

import type { ComponentType, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@/presentation/components/ui/Loader';

/**
 * Options for creating dynamic components
 */
export interface DynamicComponentOptions {
  /** Whether to disable SSR (default: true for 3D components) */
  ssr?: boolean;
  /** Custom loading component */
  loading?: () => ReactNode;
  /** Minimum height for the loading placeholder */
  loadingMinHeight?: string;
}

/**
 * Default loading component for dynamic imports
 */
function DefaultLoader({ minHeight = '200px' }: { minHeight?: string }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight }}>
      <Loader size="lg" />
    </div>
  );
}

/**
 * Creates a dynamic component with standardized options.
 *
 * @param importFn - Dynamic import function
 * @param options - Configuration options
 * @returns Dynamically loaded component
 *
 * @example
 * ```tsx
 * const HeavyComponent = createDynamicComponent(
 *   () => import('./HeavyComponent'),
 *   { ssr: false }
 * );
 * ```
 */
export function createDynamicComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicComponentOptions = {}
): ComponentType<P> {
  const { ssr = true, loading, loadingMinHeight = '200px' } = options;

  return dynamic(importFn, {
    ssr,
    loading: loading || (() => <DefaultLoader minHeight={loadingMinHeight} />),
  });
}

/**
 * Creates a dynamic component that is disabled during SSR.
 * Use this for components that rely on browser APIs (WebGL, Canvas, etc.)
 *
 * @param importFn - Dynamic import function
 * @param loadingMinHeight - Minimum height for loading placeholder
 * @returns Client-only dynamic component
 *
 * @example
 * ```tsx
 * const ThreeScene = createClientOnlyComponent(
 *   () => import('./ThreeScene')
 * );
 * ```
 */
export function createClientOnlyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  loadingMinHeight = '400px'
): ComponentType<P> {
  return createDynamicComponent(importFn, {
    ssr: false,
    loadingMinHeight,
  });
}

/**
 * Creates a dynamic component for 3D/Canvas content.
 * Optimized for Three.js and WebGL components.
 *
 * @param importFn - Dynamic import function
 * @param options - Additional options
 * @returns Client-only dynamic component optimized for 3D
 *
 * @example
 * ```tsx
 * const SkillsGlobe = create3DComponent(
 *   () => import('@/presentation/three/scenes/SkillsGlobe')
 * );
 * ```
 */
export function create3DComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: Omit<DynamicComponentOptions, 'ssr'> = {}
): ComponentType<P> {
  return createDynamicComponent(importFn, {
    ...options,
    ssr: false,
    loadingMinHeight: options.loadingMinHeight || '500px',
  });
}

/**
 * Named export extractor for dynamic imports.
 * Use when the component isn't the default export.
 *
 * @param importFn - Dynamic import function that returns a module
 * @param exportName - Name of the export to use
 * @returns Function that returns the named export
 *
 * @example
 * ```tsx
 * const MyComponent = createDynamicComponent(
 *   namedExport(() => import('./components'), 'MyComponent')
 * );
 * ```
 */
export function namedExport<T, K extends keyof T>(
  importFn: () => Promise<T>,
  exportName: K
): () => Promise<{ default: T[K] }> {
  return async () => {
    const importedModule = await importFn();
    return { default: importedModule[exportName] };
  };
}

/**
 * Preloads a dynamic component.
 * Call this to start loading before the component is needed.
 *
 * @param importFn - Dynamic import function
 *
 * @example
 * ```tsx
 * // Preload when user hovers over navigation
 * onMouseEnter={() => preloadComponent(() => import('./HeavyPage'))}
 * ```
 */
export function preloadComponent<T>(importFn: () => Promise<T>): void {
  // Trigger the import to start loading
  importFn().catch(() => {
    // Ignore preload errors - the actual render will handle them
  });
}

/**
 * Creates a preloadable dynamic component.
 * Returns both the component and a preload function.
 *
 * @param importFn - Dynamic import function
 * @param options - Configuration options
 * @returns Object with component and preload function
 *
 * @example
 * ```tsx
 * const { Component: HeavyPage, preload } = createPreloadableComponent(
 *   () => import('./HeavyPage')
 * );
 *
 * // Use preload function
 * <Link onMouseEnter={preload}>Go to Heavy Page</Link>
 * ```
 */
export function createPreloadableComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicComponentOptions = {}
): {
  Component: ComponentType<P>;
  preload: () => void;
} {
  return {
    Component: createDynamicComponent(importFn, options),
    preload: () => preloadComponent(importFn),
  };
}
