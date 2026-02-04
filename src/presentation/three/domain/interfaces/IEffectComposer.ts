/**
 * Configuration for bloom post-processing effect.
 */
export interface IBloomConfig {
  /** Enable bloom effect (default: true) */
  enabled?: boolean;
  /** Bloom intensity (0-2, default: 1.5) */
  intensity?: number;
  /** Luminance threshold (0-1, default: 0.2) */
  threshold?: number;
  /** Luminance smoothing (0-1, default: 0.9) */
  smoothing?: number;
}

/**
 * Configuration for vignette post-processing effect.
 */
export interface IVignetteConfig {
  /** Enable vignette effect (default: true) */
  enabled?: boolean;
  /** Vignette darkness (0-1, default: 0.5) */
  darkness?: number;
  /** Vignette offset from edges (0-1, default: 0.3) */
  offset?: number;
}

/**
 * Configuration for chromatic aberration post-processing effect.
 */
export interface IChromaticConfig {
  /** Enable chromatic aberration (default: true) */
  enabled?: boolean;
  /** RGB offset values [x, y] (default: [0.002, 0.002]) */
  offset?: [number, number];
}

/**
 * Named effect preset configuration.
 */
export interface IEffectPreset {
  /** Preset name for identification */
  name: string;
  /** Bloom configuration */
  bloom?: IBloomConfig;
  /** Vignette configuration */
  vignette?: IVignetteConfig;
  /** Chromatic aberration configuration */
  chromatic?: IChromaticConfig;
  /** Enable all effects (master switch) */
  enabled?: boolean;
}

/**
 * Props for the PostProcessing component.
 */
export interface IPostProcessingProps {
  /** Bloom effect configuration */
  bloom?: boolean | IBloomConfig;
  /** Vignette effect configuration */
  vignette?: boolean | IVignetteConfig;
  /** Chromatic aberration configuration */
  chromaticAberration?: boolean | IChromaticConfig;
  /** Use a named preset */
  preset?: string;
  /** Master enable switch */
  enabled?: boolean;
}

/**
 * Performance quality levels for adaptive rendering.
 */
export type QualityLevel = 'high' | 'medium' | 'low';

/**
 * Performance mode configuration returned by usePerformanceMode.
 */
export interface IPerformanceConfig {
  /** Current quality level */
  quality: QualityLevel;
  /** Recommended particle count for current quality */
  particleCount: number;
  /** Whether to enable post-processing effects */
  enableEffects: boolean;
  /** Whether to enable shadows */
  enableShadows: boolean;
  /** Target frame rate */
  targetFPS: number;
  /** Whether running on mobile device */
  isMobile: boolean;
  /** Whether low power mode is detected */
  isLowPower: boolean;
}
