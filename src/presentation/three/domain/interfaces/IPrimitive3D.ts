import type { AnimationConfig } from '../value-objects/AnimationConfig';
import type { Position3DTuple } from '../value-objects/Position3D';

/**
 * Interface for components that have a position in 3D space.
 * Supports both Position3D value objects and raw tuples for convenience.
 */
export interface IPositionable {
  position?: Position3DTuple | [number, number, number];
}

/**
 * Interface for components that have a color.
 * Supports both Color3D value objects and hex strings for convenience.
 */
export interface IColorable {
  color?: string;
}

/**
 * Interface for components that can be animated.
 * Supports both AnimationConfig value objects and individual props.
 */
export interface IAnimatable {
  animation?: AnimationConfig;
  /** Shorthand: animation enabled (default: true) */
  animated?: boolean;
  /** Shorthand: animation speed multiplier (default: 1) */
  animationSpeed?: number;
}

/**
 * Interface for components that can be scaled.
 */
export interface IScalable {
  scale?: number | [number, number, number];
}

/**
 * Interface for components with opacity.
 */
export interface IOpacityControlled {
  opacity?: number;
  transparent?: boolean;
}

/**
 * Interface for components that can receive mouse events.
 */
export interface IInteractive {
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * Base interface for all 3D primitive components.
 * Extends IPositionable as the minimum requirement.
 */
export interface IPrimitive3D extends IPositionable {
  /** Unique key for React rendering */
  key?: string | number;
}

/**
 * Full-featured primitive interface combining all capabilities.
 */
export interface IFullPrimitive3D
  extends
    IPrimitive3D,
    IColorable,
    IAnimatable,
    IScalable,
    IOpacityControlled,
    IInteractive {}

/**
 * Props for particle-type primitives.
 */
export interface IParticleProps extends IPrimitive3D, IColorable, IAnimatable {
  size?: number;
  intensity?: number;
}

/**
 * Props for sphere-type primitives.
 */
export interface ISphereProps
  extends IPrimitive3D, IColorable, IAnimatable, IScalable {
  radius?: number;
  glowColor?: string;
  wireframe?: boolean;
  pulseIntensity?: number;
}

/**
 * Props for text-type primitives.
 */
export interface ITextProps
  extends IPrimitive3D, IColorable, IAnimatable, IInteractive {
  children: string;
  fontSize?: number;
  hoverColor?: string;
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
  font?: string;
}

/**
 * Props for line-type primitives.
 */
export interface ILineProps
  extends IColorable, IAnimatable, IOpacityControlled {
  start: Position3DTuple | [number, number, number];
  end: Position3DTuple | [number, number, number];
  lineWidth?: number;
  dashed?: boolean;
  dashSize?: number;
  gapSize?: number;
  curve?: boolean;
  curveHeight?: number;
}

/**
 * Props for grid-type primitives.
 */
export interface IGridProps extends IPrimitive3D, IColorable, IAnimatable {
  size?: number;
  divisions?: number;
  secondaryColor?: string;
  fadeDistance?: number;
}
