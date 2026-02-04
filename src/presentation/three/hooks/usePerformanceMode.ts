'use client';

import { useState, useEffect, useMemo } from 'react';
import type { QualityLevel, IPerformanceConfig } from '../domain/interfaces';

/**
 * Options for usePerformanceMode hook
 */
export interface UsePerformanceModeOptions {
  /** Override detected quality level */
  forceQuality?: QualityLevel;
  /** Base particle count (scaled by quality) */
  baseParticleCount?: number;
}

/**
 * Quality level configurations
 */
const QUALITY_CONFIGS: Record<
  QualityLevel,
  Omit<IPerformanceConfig, 'isMobile' | 'isLowPower'>
> = {
  high: {
    quality: 'high',
    particleCount: 10000,
    enableEffects: true,
    enableShadows: true,
    targetFPS: 60,
  },
  medium: {
    quality: 'medium',
    particleCount: 5000,
    enableEffects: true,
    enableShadows: false,
    targetFPS: 30,
  },
  low: {
    quality: 'low',
    particleCount: 1000,
    enableEffects: false,
    enableShadows: false,
    targetFPS: 30,
  },
};

/**
 * Detects if running on a mobile device
 */
function detectMobile(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for touch support
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Check user agent
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(navigator.userAgent);

  // Check screen size
  const isSmallScreen = window.innerWidth < 768;

  return (hasTouch && isMobileUA) || isSmallScreen;
}

/**
 * Detects if low power mode might be active
 * Note: This is a heuristic as there's no direct API
 */
function detectLowPower(): boolean {
  if (typeof navigator === 'undefined') return false;

  // We can't await here, so we'll check synchronously available indicators
  // Low memory mode
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (deviceMemory && deviceMemory < 4) return true;

  // Hardware concurrency (CPU cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    return true;

  return false;
}

/**
 * Determines quality level based on device capabilities
 */
function determineQuality(
  isMobile: boolean,
  isLowPower: boolean
): QualityLevel {
  if (isLowPower) return 'low';
  if (isMobile) return 'medium';
  return 'high';
}

/**
 * Hook that detects device capabilities and returns performance configuration.
 * Components depend on this abstraction for graceful degradation (SOLID - D).
 */
export function usePerformanceMode(
  options: UsePerformanceModeOptions = {}
): IPerformanceConfig {
  const { forceQuality, baseParticleCount } = options;

  // Use lazy initialization to detect on first render
  const [deviceInfo, setDeviceInfo] = useState(() => ({
    isMobile: typeof window !== 'undefined' ? detectMobile() : false,
    isLowPower: typeof window !== 'undefined' ? detectLowPower() : false,
  }));

  // Re-detect on resize (for screen size changes)
  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(prev => ({
        ...prev,
        isMobile: detectMobile(),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate performance config
  return useMemo((): IPerformanceConfig => {
    const { isMobile, isLowPower } = deviceInfo;
    const quality = forceQuality ?? determineQuality(isMobile, isLowPower);
    const baseConfig = QUALITY_CONFIGS[quality];

    // Scale particle count if base is provided
    const particleCount = baseParticleCount
      ? Math.floor(
          baseParticleCount *
            (quality === 'high' ? 1 : quality === 'medium' ? 0.5 : 0.1)
        )
      : baseConfig.particleCount;

    return {
      ...baseConfig,
      particleCount,
      isMobile,
      isLowPower,
    };
  }, [deviceInfo, forceQuality, baseParticleCount]);
}

/**
 * Utility function to get quality-adjusted value
 */
export function getQualityValue<T>(
  quality: QualityLevel,
  high: T,
  medium: T,
  low: T
): T {
  switch (quality) {
    case 'high':
      return high;
    case 'medium':
      return medium;
    case 'low':
      return low;
  }
}

export default usePerformanceMode;
