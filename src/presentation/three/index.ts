// =============================================================================
// Domain Layer (DDD Value Objects, Interfaces, Factories)
// =============================================================================
export {
  // Value Objects
  Position3D,
  Color3D,
  AnimationConfig,
  type Position3DTuple,
  type ThemeColorName,
  type RGB,
  type EasingType,
  type AnimationType,
  type AnimationConfigOptions,
  // Interfaces
  type IPositionable,
  type IColorable,
  type IAnimatable,
  type IScalable,
  type IOpacityControlled,
  type IInteractive,
  type IPrimitive3D,
  type IFullPrimitive3D,
  type IParticleProps,
  type ISphereProps,
  type ITextProps,
  type ILineProps,
  type IGridProps,
  type IBloomConfig,
  type IVignetteConfig,
  type IChromaticConfig,
  type IEffectPreset,
  type IPostProcessingProps,
  type QualityLevel,
  type IPerformanceConfig,
  // Factories
  PrimitiveFactory,
  type PrimitivePreset,
  type ParticleConfig,
  type SphereConfig,
  type LineConfig,
  type GridConfig,
} from './domain';

// =============================================================================
// Effects
// =============================================================================
export {
  PostProcessing,
  PostProcessingPresets,
  type PostProcessingProps,
  type PostProcessingPreset,
} from './effects';

// =============================================================================
// Hooks
// =============================================================================
export {
  useMousePosition,
  useScrollProgress,
  useSectionScrollProgress,
  useAnimationFrame,
  usePerformanceMode,
  getQualityValue,
  type MousePosition,
  type UseMousePositionOptions,
  type ScrollProgress,
  type UseScrollProgressOptions,
  type SectionScrollProgress,
  type AnimationFrameState,
  type UseAnimationFrameOptions,
  type UseAnimationFrameReturn,
  type UsePerformanceModeOptions,
} from './hooks';

// =============================================================================
// Utils
// =============================================================================
export {
  // WebGL detection
  detectWebGLSupport,
  // Animation helpers (DRY)
  pulseValue,
  oscillateScale,
  fadeOpacity,
  floatOffset,
  rotationAngle,
  glowIntensity,
  pathProgress,
  bounceValue,
  applyAnimationEasing,
  shouldSkipFrame,
} from './utils';
