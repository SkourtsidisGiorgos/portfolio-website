import type { QualityLevel } from '@/presentation/three/domain/interfaces';

/**
 * Configuration options for the globe
 */
export interface GlobeConfigOptions {
  radius: number;
  rotationSpeed: number;
  nodeScale: number;
  showConnections: boolean;
  enableEffects: boolean;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: GlobeConfigOptions = {
  radius: 3,
  rotationSpeed: 0.1,
  nodeScale: 1,
  showConnections: true,
  enableEffects: true,
};

/**
 * Minimal configuration for reduced performance
 */
const MINIMAL_CONFIG: GlobeConfigOptions = {
  radius: 2.5,
  rotationSpeed: 0.05,
  nodeScale: 0.8,
  showConnections: false,
  enableEffects: false,
};

/**
 * Quality-based configurations
 */
const QUALITY_CONFIGS: Record<QualityLevel, GlobeConfigOptions> = {
  high: {
    radius: 3,
    rotationSpeed: 0.1,
    nodeScale: 1,
    showConnections: true,
    enableEffects: true,
  },
  medium: {
    radius: 3,
    rotationSpeed: 0.08,
    nodeScale: 0.9,
    showConnections: true,
    enableEffects: true,
  },
  low: {
    radius: 2.5,
    rotationSpeed: 0.05,
    nodeScale: 0.8,
    showConnections: false,
    enableEffects: false,
  },
};

/**
 * Immutable value object for globe configuration.
 * Provides factory methods for different quality levels and presets.
 */
export class GlobeConfig {
  private constructor(
    private readonly _radius: number,
    private readonly _rotationSpeed: number,
    private readonly _nodeScale: number,
    private readonly _showConnections: boolean,
    private readonly _enableEffects: boolean
  ) {
    Object.freeze(this);
  }

  /**
   * Creates a GlobeConfig with default values.
   */
  static default(): GlobeConfig {
    return GlobeConfig.fromOptions(DEFAULT_CONFIG);
  }

  /**
   * Creates a GlobeConfig with minimal settings for low performance devices.
   */
  static minimal(): GlobeConfig {
    return GlobeConfig.fromOptions(MINIMAL_CONFIG);
  }

  /**
   * Creates a GlobeConfig based on quality level.
   */
  static forQuality(quality: QualityLevel): GlobeConfig {
    return GlobeConfig.fromOptions(QUALITY_CONFIGS[quality]);
  }

  /**
   * Creates a GlobeConfig with custom options, merging with defaults.
   */
  static custom(options: Partial<GlobeConfigOptions>): GlobeConfig {
    return GlobeConfig.fromOptions({ ...DEFAULT_CONFIG, ...options });
  }

  /**
   * Creates a GlobeConfig from full options object.
   */
  private static fromOptions(options: GlobeConfigOptions): GlobeConfig {
    return new GlobeConfig(
      options.radius,
      options.rotationSpeed,
      options.nodeScale,
      options.showConnections,
      options.enableEffects
    );
  }

  get radius(): number {
    return this._radius;
  }

  get rotationSpeed(): number {
    return this._rotationSpeed;
  }

  get nodeScale(): number {
    return this._nodeScale;
  }

  get showConnections(): boolean {
    return this._showConnections;
  }

  get enableEffects(): boolean {
    return this._enableEffects;
  }

  /**
   * Returns a new GlobeConfig with updated radius.
   */
  withRadius(radius: number): GlobeConfig {
    return new GlobeConfig(
      radius,
      this._rotationSpeed,
      this._nodeScale,
      this._showConnections,
      this._enableEffects
    );
  }

  /**
   * Returns a new GlobeConfig with updated rotation speed.
   */
  withRotationSpeed(rotationSpeed: number): GlobeConfig {
    return new GlobeConfig(
      this._radius,
      rotationSpeed,
      this._nodeScale,
      this._showConnections,
      this._enableEffects
    );
  }

  /**
   * Returns a new GlobeConfig with effects enabled/disabled.
   */
  withEffects(enabled: boolean): GlobeConfig {
    return new GlobeConfig(
      this._radius,
      this._rotationSpeed,
      this._nodeScale,
      this._showConnections,
      enabled
    );
  }

  /**
   * Returns a new GlobeConfig with connections enabled/disabled.
   */
  withConnections(enabled: boolean): GlobeConfig {
    return new GlobeConfig(
      this._radius,
      this._rotationSpeed,
      this._nodeScale,
      enabled,
      this._enableEffects
    );
  }

  /**
   * Checks equality with another GlobeConfig.
   */
  equals(other: GlobeConfig): boolean {
    return (
      this._radius === other._radius &&
      this._rotationSpeed === other._rotationSpeed &&
      this._nodeScale === other._nodeScale &&
      this._showConnections === other._showConnections &&
      this._enableEffects === other._enableEffects
    );
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `GlobeConfig(radius: ${this._radius}, rotationSpeed: ${this._rotationSpeed}, nodeScale: ${this._nodeScale})`;
  }
}
