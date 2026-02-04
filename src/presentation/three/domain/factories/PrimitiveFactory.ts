import { AnimationConfig } from '../value-objects/AnimationConfig';
import { Color3D } from '../value-objects/Color3D';
import { Position3D, type Position3DTuple } from '../value-objects/Position3D';
import type {
  IParticleProps,
  ISphereProps,
  ILineProps,
  IGridProps,
} from '../interfaces';

/**
 * Preset types for primitive creation
 */
export type PrimitivePreset =
  | 'data'
  | 'node'
  | 'highlight'
  | 'connection'
  | 'grid';

/**
 * Configuration for particle creation
 */
export interface ParticleConfig {
  position?: Position3D | Position3DTuple | [number, number, number];
  color?: Color3D | string;
  size?: number;
  intensity?: number;
  animation?: AnimationConfig;
}

/**
 * Configuration for sphere creation
 */
export interface SphereConfig {
  position?: Position3D | Position3DTuple | [number, number, number];
  color?: Color3D | string;
  glowColor?: Color3D | string;
  radius?: number;
  wireframe?: boolean;
  animation?: AnimationConfig;
}

/**
 * Configuration for line creation
 */
export interface LineConfig {
  start: Position3D | Position3DTuple | [number, number, number];
  end: Position3D | Position3DTuple | [number, number, number];
  color?: Color3D | string;
  lineWidth?: number;
  dashed?: boolean;
  animation?: AnimationConfig;
}

/**
 * Configuration for grid creation
 */
export interface GridConfig {
  position?: Position3D | Position3DTuple | [number, number, number];
  color?: Color3D | string;
  secondaryColor?: Color3D | string;
  size?: number;
  divisions?: number;
  fadeDistance?: number;
  animation?: AnimationConfig;
}

/**
 * Factory for creating 3D primitive component props.
 * Centralizes default values and provides preset-based creation.
 * Follows the Factory Pattern (SOLID - D, DRY).
 */
export class PrimitiveFactory {
  /**
   * Default values for all primitives (DRY)
   */
  private static readonly defaults = {
    particle: {
      position: [0, 0, 0] as [number, number, number],
      color: Color3D.fromTheme('primary').toHex(),
      size: 0.1,
      intensity: 1,
      animated: true,
      animationSpeed: 1,
    },
    sphere: {
      position: [0, 0, 0] as [number, number, number],
      color: Color3D.fromTheme('primary').toHex(),
      radius: 1,
      wireframe: false,
      animated: true,
      animationSpeed: 1,
      pulseIntensity: 0.2,
    },
    line: {
      color: Color3D.fromTheme('primary').toHex(),
      lineWidth: 1,
      dashed: false,
      dashSize: 0.1,
      gapSize: 0.1,
      animated: true,
      animationSpeed: 1,
      opacity: 0.8,
    },
    grid: {
      position: [0, 0, 0] as [number, number, number],
      color: Color3D.fromTheme('primary').toHex(),
      secondaryColor: Color3D.fromTheme('accent').toHex(),
      size: 100,
      divisions: 100,
      fadeDistance: 50,
      animated: true,
      animationSpeed: 0.1,
    },
  };

  /**
   * Preset configurations
   */
  private static readonly presets: Record<
    PrimitivePreset,
    Partial<ParticleConfig | SphereConfig>
  > = {
    data: {
      color: Color3D.fromTheme('primary'),
      size: 0.05,
      intensity: 0.8,
      animation: AnimationConfig.pulse(2, 0.3),
    },
    node: {
      color: Color3D.fromTheme('accent'),
      radius: 0.5,
      animation: AnimationConfig.pulse(1, 0.2),
    },
    highlight: {
      color: Color3D.fromTheme('success'),
      size: 0.15,
      intensity: 1.5,
      animation: AnimationConfig.pulse(1.5, 0.4),
    },
    connection: {
      color: Color3D.fromTheme('primary'),
      animation: AnimationConfig.custom({ speed: 1, intensity: 0.8 }),
    },
    grid: {
      color: Color3D.fromTheme('primary'),
      animation: AnimationConfig.custom({ speed: 0.1, intensity: 1 }),
    },
  };

  /**
   * Resolves position to tuple format
   */
  private static resolvePosition(
    pos?: Position3D | Position3DTuple | [number, number, number]
  ): [number, number, number] {
    if (!pos) return [0, 0, 0];
    if (pos instanceof Position3D) return pos.toArray();
    return [...pos] as [number, number, number];
  }

  /**
   * Resolves color to hex string
   */
  private static resolveColor(color?: Color3D | string): string {
    if (!color) return this.defaults.particle.color;
    if (color instanceof Color3D) return color.toHex();
    return color;
  }

  /**
   * Resolves animation config to component props
   */
  private static resolveAnimation(animation?: AnimationConfig): {
    animated: boolean;
    animationSpeed: number;
  } {
    if (!animation) return { animated: true, animationSpeed: 1 };
    return {
      animated: animation.enabled,
      animationSpeed: animation.speed,
    };
  }

  /**
   * Creates particle props from config.
   */
  static createParticle(config: ParticleConfig = {}): IParticleProps {
    const animProps = this.resolveAnimation(config.animation);
    return {
      position: this.resolvePosition(config.position),
      color: this.resolveColor(config.color),
      size: config.size ?? this.defaults.particle.size,
      intensity: config.intensity ?? this.defaults.particle.intensity,
      ...animProps,
    };
  }

  /**
   * Creates sphere props from config.
   */
  static createSphere(config: SphereConfig = {}): ISphereProps {
    const animProps = this.resolveAnimation(config.animation);
    return {
      position: this.resolvePosition(config.position),
      color: this.resolveColor(config.color),
      glowColor: config.glowColor
        ? this.resolveColor(config.glowColor)
        : undefined,
      radius: config.radius ?? this.defaults.sphere.radius,
      wireframe: config.wireframe ?? this.defaults.sphere.wireframe,
      pulseIntensity: this.defaults.sphere.pulseIntensity,
      ...animProps,
    };
  }

  /**
   * Creates line props from config.
   */
  static createLine(config: LineConfig): ILineProps {
    const animProps = this.resolveAnimation(config.animation);
    return {
      start: this.resolvePosition(config.start),
      end: this.resolvePosition(config.end),
      color: this.resolveColor(config.color),
      lineWidth: config.lineWidth ?? this.defaults.line.lineWidth,
      dashed: config.dashed ?? this.defaults.line.dashed,
      dashSize: this.defaults.line.dashSize,
      gapSize: this.defaults.line.gapSize,
      opacity: this.defaults.line.opacity,
      ...animProps,
    };
  }

  /**
   * Creates grid props from config.
   */
  static createGrid(config: GridConfig = {}): IGridProps {
    const animProps = this.resolveAnimation(config.animation);
    return {
      position: this.resolvePosition(config.position),
      color: this.resolveColor(config.color),
      secondaryColor: config.secondaryColor
        ? this.resolveColor(config.secondaryColor)
        : this.defaults.grid.secondaryColor,
      size: config.size ?? this.defaults.grid.size,
      divisions: config.divisions ?? this.defaults.grid.divisions,
      fadeDistance: config.fadeDistance ?? this.defaults.grid.fadeDistance,
      ...animProps,
    };
  }

  /**
   * Creates props from a named preset.
   */
  static createFromPreset(
    preset: PrimitivePreset
  ): IParticleProps | ISphereProps {
    const presetConfig = this.presets[preset];

    switch (preset) {
      case 'data':
      case 'highlight':
        return this.createParticle(presetConfig as ParticleConfig);
      case 'node':
        return this.createSphere(presetConfig as SphereConfig);
      case 'connection':
      case 'grid':
        return this.createParticle(presetConfig as ParticleConfig);
      default:
        return this.createParticle();
    }
  }

  /**
   * Returns default values for reference.
   */
  static getDefaults() {
    return { ...this.defaults };
  }

  /**
   * Returns available presets.
   */
  static getPresets(): PrimitivePreset[] {
    return Object.keys(this.presets) as PrimitivePreset[];
  }
}
