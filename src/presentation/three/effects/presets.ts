import type {
  IEffectPreset,
  IBloomConfig,
  IVignetteConfig,
  IChromaticConfig,
} from '../domain/interfaces';

/**
 * Centralized effect presets (DRY).
 * Single source of truth for effect configurations.
 */

/**
 * Hero section preset - high impact, cinematic
 */
export const heroPreset: IEffectPreset = {
  name: 'hero',
  bloom: {
    enabled: true,
    intensity: 2,
    threshold: 0.1,
    smoothing: 0.8,
  },
  vignette: {
    enabled: true,
    darkness: 0.6,
    offset: 0.25,
  },
  chromatic: {
    enabled: true,
    offset: [0.003, 0.003],
  },
  enabled: true,
};

/**
 * Subtle preset - light effects for sections
 */
export const subtlePreset: IEffectPreset = {
  name: 'subtle',
  bloom: {
    enabled: true,
    intensity: 0.8,
    threshold: 0.3,
    smoothing: 0.9,
  },
  vignette: {
    enabled: true,
    darkness: 0.3,
    offset: 0.4,
  },
  chromatic: {
    enabled: false,
  },
  enabled: true,
};

/**
 * Minimal preset - basic bloom only
 */
export const minimalPreset: IEffectPreset = {
  name: 'minimal',
  bloom: {
    enabled: true,
    intensity: 0.5,
    threshold: 0.4,
    smoothing: 0.9,
  },
  vignette: {
    enabled: false,
  },
  chromatic: {
    enabled: false,
  },
  enabled: true,
};

/**
 * Performance preset - optimized for mobile/low-power devices
 */
export const performancePreset: IEffectPreset = {
  name: 'performance',
  bloom: {
    enabled: true,
    intensity: 0.3,
    threshold: 0.5,
    smoothing: 0.95,
  },
  vignette: {
    enabled: false,
  },
  chromatic: {
    enabled: false,
  },
  enabled: true,
};

/**
 * Disabled preset - no effects
 */
export const disabledPreset: IEffectPreset = {
  name: 'disabled',
  bloom: { enabled: false },
  vignette: { enabled: false },
  chromatic: { enabled: false },
  enabled: false,
};

/**
 * All available presets
 */
export const effectPresets: Record<string, IEffectPreset> = {
  hero: heroPreset,
  subtle: subtlePreset,
  minimal: minimalPreset,
  performance: performancePreset,
  disabled: disabledPreset,
};

/**
 * Get a preset by name
 */
export function getEffectPreset(name: string): IEffectPreset | undefined {
  return effectPresets[name];
}

/**
 * Get preset names
 */
export function getEffectPresetNames(): string[] {
  return Object.keys(effectPresets);
}

/**
 * Create a custom preset by merging with a base
 */
export function createCustomPreset(
  baseName: string,
  overrides: Partial<IEffectPreset>
): IEffectPreset {
  const base = effectPresets[baseName] ?? subtlePreset;
  return {
    ...base,
    ...overrides,
    name: overrides.name ?? `custom-${baseName}`,
    bloom: { ...base.bloom, ...overrides.bloom } as IBloomConfig,
    vignette: { ...base.vignette, ...overrides.vignette } as IVignetteConfig,
    chromatic: {
      ...base.chromatic,
      ...overrides.chromatic,
    } as IChromaticConfig,
  };
}

/**
 * Get preset appropriate for quality level
 */
export function getPresetForQuality(
  quality: 'high' | 'medium' | 'low'
): IEffectPreset {
  switch (quality) {
    case 'high':
      return heroPreset;
    case 'medium':
      return subtlePreset;
    case 'low':
      return performancePreset;
  }
}
