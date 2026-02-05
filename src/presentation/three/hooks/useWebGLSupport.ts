'use client';

import { useMemo } from 'react';
import { usePerformanceMode } from './usePerformanceMode';
import { detectWebGLSupport } from '../utils/webgl';
import type { QualityLevel } from '../domain/interfaces';

/**
 * Options for useWebGLSupport hook
 */
export interface UseWebGLSupportOptions {
  /** Disable 3D on mobile devices */
  disableOnMobile?: boolean;
}

/**
 * Return type for useWebGLSupport hook
 */
export interface UseWebGLSupportReturn {
  /** Whether WebGL is supported */
  isWebGLSupported: boolean;
  /** Whether 3D should be enabled (WebGL + mobile check) */
  is3DEnabled: boolean;
  /** Whether running on mobile device */
  isMobile: boolean;
  /** Detected quality level */
  quality: QualityLevel;
}

/**
 * Hook for detecting WebGL support combined with mobile detection.
 *
 * Consolidates duplicate WebGL detection code from presentation hooks (DRY).
 * Use this instead of manually checking WebGL support in each hook.
 *
 * @example
 * ```tsx
 * const { is3DEnabled, quality } = useWebGLSupport();
 * if (!is3DEnabled) return <FallbackUI />;
 * return <ThreeScene quality={quality} />;
 * ```
 */
export function useWebGLSupport(
  options: UseWebGLSupportOptions = {}
): UseWebGLSupportReturn {
  const { disableOnMobile = true } = options;

  const { isMobile, quality } = usePerformanceMode();

  const isWebGLSupported = useMemo(() => detectWebGLSupport(), []);

  const is3DEnabled = useMemo(() => {
    if (!isWebGLSupported) return false;
    if (disableOnMobile && isMobile) return false;
    return true;
  }, [isWebGLSupported, isMobile, disableOnMobile]);

  return {
    isWebGLSupported,
    is3DEnabled,
    isMobile,
    quality,
  };
}
