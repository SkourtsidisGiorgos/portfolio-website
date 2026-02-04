'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  QUALITY_CONFIGS as PERF_QUALITY_CONFIGS,
  getAnimationConfig,
  scaleByQuality,
} from '@/shared/config/performance.config';
import {
  getDeviceCapabilities,
  detectDeviceType,
  type DeviceCapabilities,
} from '@/shared/utils/deviceDetection';
import type { QualityLevel, IPerformanceConfig } from '../domain/interfaces';

/** localStorage key for user quality preference */
const QUALITY_PREFERENCE_KEY = 'portfolio-quality-preference';

/**
 * Options for usePerformanceMode hook
 */
export interface UsePerformanceModeOptions {
  /** Override detected quality level */
  forceQuality?: QualityLevel;
  /** Base particle count (scaled by quality) */
  baseParticleCount?: number;
  /** Respect user's stored preference */
  respectUserPreference?: boolean;
}

/**
 * Extended performance configuration with additional settings
 */
export interface ExtendedPerformanceConfig extends IPerformanceConfig {
  /** Device capabilities snapshot */
  capabilities: DeviceCapabilities;
  /** Animation configuration */
  animationConfig: ReturnType<typeof getAnimationConfig>;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
  /** Pixel ratio to use for rendering */
  pixelRatio: number;
  /** User-set quality preference (if any) */
  userPreference: QualityLevel | null;
}

/**
 * Quality level configurations (using centralized config - DRY)
 */
const QUALITY_CONFIGS: Record<
  QualityLevel,
  Omit<IPerformanceConfig, 'isMobile' | 'isLowPower'>
> = {
  high: {
    quality: 'high',
    particleCount: PERF_QUALITY_CONFIGS.high.particleCount,
    enableEffects: PERF_QUALITY_CONFIGS.high.enableEffects,
    enableShadows: PERF_QUALITY_CONFIGS.high.enableShadows,
    targetFPS: PERF_QUALITY_CONFIGS.high.targetFPS,
  },
  medium: {
    quality: 'medium',
    particleCount: PERF_QUALITY_CONFIGS.medium.particleCount,
    enableEffects: PERF_QUALITY_CONFIGS.medium.enableEffects,
    enableShadows: PERF_QUALITY_CONFIGS.medium.enableShadows,
    targetFPS: PERF_QUALITY_CONFIGS.medium.targetFPS,
  },
  low: {
    quality: 'low',
    particleCount: PERF_QUALITY_CONFIGS.low.particleCount,
    enableEffects: PERF_QUALITY_CONFIGS.low.enableEffects,
    enableShadows: PERF_QUALITY_CONFIGS.low.enableShadows,
    targetFPS: PERF_QUALITY_CONFIGS.low.targetFPS,
  },
};

/**
 * Determines quality level based on device capabilities (using deviceDetection - DRY)
 */
function determineQuality(capabilities: DeviceCapabilities): QualityLevel {
  // Lowest quality for very constrained devices
  if (capabilities.isLowPower && capabilities.gpuTier === 'low') return 'low';

  // Reduced motion preference triggers low quality
  if (capabilities.prefersReducedMotion) return 'low';

  // GPU tier is the primary indicator
  if (capabilities.gpuTier === 'high') {
    return capabilities.deviceType === 'desktop' ? 'high' : 'medium';
  }

  if (capabilities.gpuTier === 'medium') return 'medium';

  // Mobile devices default to medium unless constrained
  if (capabilities.deviceType === 'mobile') {
    return capabilities.isLowPower ? 'low' : 'medium';
  }

  // Tablets get medium
  if (capabilities.deviceType === 'tablet') return 'medium';

  // Desktop with unknown GPU gets medium
  return 'medium';
}

/**
 * Gets stored user preference from localStorage
 */
function getUserPreference(): QualityLevel | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(QUALITY_PREFERENCE_KEY);
    if (stored && ['high', 'medium', 'low'].includes(stored)) {
      return stored as QualityLevel;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

/**
 * Stores user preference in localStorage
 */
function setUserPreference(quality: QualityLevel | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (quality) {
      localStorage.setItem(QUALITY_PREFERENCE_KEY, quality);
    } else {
      localStorage.removeItem(QUALITY_PREFERENCE_KEY);
    }
  } catch {
    // localStorage not available
  }
}

/**
 * Hook that detects device capabilities and returns performance configuration.
 * Components depend on this abstraction for graceful degradation (SOLID - D).
 *
 * Enhanced to use centralized device detection and support user preferences.
 */
export function usePerformanceMode(
  options: UsePerformanceModeOptions = {}
): IPerformanceConfig {
  const {
    forceQuality,
    baseParticleCount,
    respectUserPreference = true,
  } = options;

  // Use lazy initialization to detect capabilities
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() =>
    typeof window !== 'undefined'
      ? getDeviceCapabilities()
      : {
          gpuTier: 'unknown',
          deviceType: 'desktop',
          isLowPower: false,
          deviceMemory: 0,
          hardwareConcurrency: 0,
          pixelRatio: 1,
          hasTouch: false,
          webGLVersion: 2,
          prefersReducedMotion: false,
        }
  );

  const [userPreference, setStoredPreference] = useState<QualityLevel | null>(
    () => (respectUserPreference ? getUserPreference() : null)
  );

  // Re-detect on resize (for screen size/device type changes)
  useEffect(() => {
    const handleResize = () => {
      setCapabilities(prev => ({
        ...prev,
        deviceType: detectDeviceType(),
      }));
    };

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({
        ...prev,
        prefersReducedMotion: e.matches,
      }));
    };

    window.addEventListener('resize', handleResize);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Calculate performance config
  return useMemo((): IPerformanceConfig => {
    const quality =
      forceQuality ?? userPreference ?? determineQuality(capabilities);
    const baseConfig = QUALITY_CONFIGS[quality];

    // Scale particle count if base is provided
    const particleCount = baseParticleCount
      ? scaleByQuality(baseParticleCount, quality)
      : baseConfig.particleCount;

    const isMobile = capabilities.deviceType === 'mobile';
    const isLowPower = capabilities.isLowPower;

    return {
      ...baseConfig,
      particleCount,
      isMobile,
      isLowPower,
    };
  }, [capabilities, forceQuality, userPreference, baseParticleCount]);
}

/**
 * Extended hook that returns additional performance configuration.
 * Use this when you need access to animation configs, capabilities, etc.
 */
export function useExtendedPerformanceMode(
  options: UsePerformanceModeOptions = {}
): ExtendedPerformanceConfig {
  const {
    forceQuality,
    baseParticleCount,
    respectUserPreference = true,
  } = options;

  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() =>
    typeof window !== 'undefined'
      ? getDeviceCapabilities()
      : {
          gpuTier: 'unknown',
          deviceType: 'desktop',
          isLowPower: false,
          deviceMemory: 0,
          hardwareConcurrency: 0,
          pixelRatio: 1,
          hasTouch: false,
          webGLVersion: 2,
          prefersReducedMotion: false,
        }
  );

  const [userPreference, setUserPref] = useState<QualityLevel | null>(() =>
    respectUserPreference ? getUserPreference() : null
  );

  // Callback to let components update user preference
  const setQualityPreference = useCallback((quality: QualityLevel | null) => {
    setUserPreference(quality);
    setUserPref(quality);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setCapabilities(prev => ({
        ...prev,
        deviceType: detectDeviceType(),
      }));
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({
        ...prev,
        prefersReducedMotion: e.matches,
      }));
    };

    window.addEventListener('resize', handleResize);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return useMemo((): ExtendedPerformanceConfig => {
    const quality =
      forceQuality ?? userPreference ?? determineQuality(capabilities);
    const baseConfig = QUALITY_CONFIGS[quality];

    const particleCount = baseParticleCount
      ? scaleByQuality(baseParticleCount, quality)
      : baseConfig.particleCount;

    const isMobile = capabilities.deviceType === 'mobile';
    const isLowPower = capabilities.isLowPower;

    return {
      ...baseConfig,
      particleCount,
      isMobile,
      isLowPower,
      capabilities,
      animationConfig: getAnimationConfig(quality),
      prefersReducedMotion: capabilities.prefersReducedMotion,
      pixelRatio: capabilities.pixelRatio,
      userPreference,
    };
  }, [capabilities, forceQuality, userPreference, baseParticleCount]);
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
