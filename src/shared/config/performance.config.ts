/**
 * Centralized Performance Configuration
 *
 * Single source of truth for all performance-related settings (DRY principle).
 * Quality levels are Open/Closed - can add new levels without modifying existing code.
 *
 * @module performance.config
 */

import type { QualityLevel } from '@/presentation/three/domain/interfaces';

/**
 * Quality level configuration for 3D rendering
 */
export interface QualityConfig {
  /** Quality level identifier */
  quality: QualityLevel;
  /** Number of particles for particle systems */
  particleCount: number;
  /** Enable post-processing effects */
  enableEffects: boolean;
  /** Enable shadows */
  enableShadows: boolean;
  /** Enable reflections */
  enableReflections: boolean;
  /** Target frame rate */
  targetFPS: number;
  /** Pixel ratio multiplier (1 = device ratio, 0.5 = half) */
  pixelRatioMultiplier: number;
  /** LOD bias (higher = lower detail at same distance) */
  lodBias: number;
  /** Texture quality (1 = full, 0.5 = half resolution) */
  textureQuality: number;
  /** Maximum draw calls before warnings */
  maxDrawCalls: number;
  /** Maximum triangles before warnings */
  maxTriangles: number;
}

/**
 * LOD (Level of Detail) distance configuration
 */
export interface LODDistances {
  /** Distance for high detail */
  high: number;
  /** Distance for medium detail */
  medium: number;
  /** Distance for low detail */
  low: number;
}

/**
 * Lazy loading configuration
 */
export interface LazyLoadConfig {
  /** Root margin for intersection observer */
  rootMargin: string;
  /** Intersection threshold for triggering load */
  threshold: number;
  /** Delay before loading in ms */
  delay: number;
}

/**
 * Animation configuration per quality level
 */
export interface AnimationConfig {
  /** Enable particle animations */
  enableParticles: boolean;
  /** Enable glow effects */
  enableGlow: boolean;
  /** Enable blur effects */
  enableBlur: boolean;
  /** Animation frame skip (1 = every frame, 2 = every other) */
  frameSkip: number;
  /** Reduced motion mode (CSS transitions only) */
  reducedMotion: boolean;
}

/**
 * Quality level definitions
 * Following Open/Closed principle - extendable without modification
 */
export const QUALITY_CONFIGS: Record<QualityLevel, QualityConfig> = {
  high: {
    quality: 'high',
    particleCount: 10000,
    enableEffects: true,
    enableShadows: true,
    enableReflections: true,
    targetFPS: 60,
    pixelRatioMultiplier: 1,
    lodBias: 0,
    textureQuality: 1,
    maxDrawCalls: 200,
    maxTriangles: 500000,
  },
  medium: {
    quality: 'medium',
    particleCount: 5000,
    enableEffects: true,
    enableShadows: false,
    enableReflections: false,
    targetFPS: 30,
    pixelRatioMultiplier: 0.75,
    lodBias: 1,
    textureQuality: 0.75,
    maxDrawCalls: 100,
    maxTriangles: 200000,
  },
  low: {
    quality: 'low',
    particleCount: 1000,
    enableEffects: false,
    enableShadows: false,
    enableReflections: false,
    targetFPS: 30,
    pixelRatioMultiplier: 0.5,
    lodBias: 2,
    textureQuality: 0.5,
    maxDrawCalls: 50,
    maxTriangles: 50000,
  },
};

/**
 * LOD distances for different quality levels
 */
export const LOD_DISTANCES: Record<QualityLevel, LODDistances> = {
  high: {
    high: 5,
    medium: 15,
    low: 30,
  },
  medium: {
    high: 3,
    medium: 10,
    low: 20,
  },
  low: {
    high: 2,
    medium: 5,
    low: 10,
  },
};

/**
 * Animation settings per quality level
 */
export const ANIMATION_CONFIGS: Record<QualityLevel, AnimationConfig> = {
  high: {
    enableParticles: true,
    enableGlow: true,
    enableBlur: true,
    frameSkip: 1,
    reducedMotion: false,
  },
  medium: {
    enableParticles: true,
    enableGlow: true,
    enableBlur: false,
    frameSkip: 2,
    reducedMotion: false,
  },
  low: {
    enableParticles: false,
    enableGlow: false,
    enableBlur: false,
    frameSkip: 3,
    reducedMotion: true,
  },
};

/**
 * Lazy loading defaults
 */
export const LAZY_LOAD_CONFIG: LazyLoadConfig = {
  rootMargin: '200px 0px',
  threshold: 0.1,
  delay: 0,
};

/**
 * Bundle size budget in KB
 */
export const BUNDLE_BUDGET = {
  /** Maximum initial JS bundle size */
  initialJS: 150,
  /** Maximum chunk size */
  chunkSize: 100,
  /** Maximum total JS size */
  totalJS: 500,
  /** Maximum CSS size */
  totalCSS: 50,
  /** Maximum image size per image */
  imageSize: 200,
};

/**
 * Web Vitals thresholds (good/needs improvement)
 */
export const WEB_VITALS_THRESHOLDS = {
  /** Largest Contentful Paint in ms */
  LCP: { good: 2500, poor: 4000 },
  /** First Input Delay in ms */
  FID: { good: 100, poor: 300 },
  /** Cumulative Layout Shift */
  CLS: { good: 0.1, poor: 0.25 },
  /** Time to First Byte in ms */
  TTFB: { good: 800, poor: 1800 },
  /** First Contentful Paint in ms */
  FCP: { good: 1800, poor: 3000 },
  /** Interaction to Next Paint in ms */
  INP: { good: 200, poor: 500 },
};

/**
 * Gets quality config for a given level
 */
export function getQualityConfig(quality: QualityLevel): QualityConfig {
  return QUALITY_CONFIGS[quality];
}

/**
 * Gets LOD distances for a given quality level
 */
export function getLODDistances(quality: QualityLevel): LODDistances {
  return LOD_DISTANCES[quality];
}

/**
 * Gets animation config for a given quality level
 */
export function getAnimationConfig(quality: QualityLevel): AnimationConfig {
  return ANIMATION_CONFIGS[quality];
}

/**
 * Scales a value based on quality level
 */
export function scaleByQuality<T extends number>(
  value: T,
  quality: QualityLevel
): number {
  const multipliers: Record<QualityLevel, number> = {
    high: 1,
    medium: 0.5,
    low: 0.1,
  };
  return Math.floor(value * multipliers[quality]);
}
