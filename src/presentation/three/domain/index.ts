// Value Objects
export {
  Position3D,
  Color3D,
  AnimationConfig,
  type Position3DTuple,
  type ThemeColorName,
  type RGB,
  type EasingType,
  type AnimationType,
  type AnimationConfigOptions,
} from './value-objects';

// Interfaces
export type {
  IPositionable,
  IColorable,
  IAnimatable,
  IScalable,
  IOpacityControlled,
  IInteractive,
  IPrimitive3D,
  IFullPrimitive3D,
  IParticleProps,
  ISphereProps,
  ITextProps,
  ILineProps,
  IGridProps,
  IBloomConfig,
  IVignetteConfig,
  IChromaticConfig,
  IEffectPreset,
  IPostProcessingProps,
  QualityLevel,
  IPerformanceConfig,
} from './interfaces';

// Factories
export {
  PrimitiveFactory,
  type PrimitivePreset,
  type ParticleConfig,
  type SphereConfig,
  type LineConfig,
  type GridConfig,
} from './factories';
