import type { QualityLevel } from '@/presentation/three/domain/interfaces';

/**
 * Configuration options for the experience timeline
 */
export interface TimelineConfigOptions {
  nodeScale: number;
  connectionOpacity: number;
  spacing: number;
  enableEffects: boolean;
  enableParticles: boolean;
  autoRotate: boolean;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: TimelineConfigOptions = {
  nodeScale: 1,
  connectionOpacity: 0.8,
  spacing: 3,
  enableEffects: true,
  enableParticles: true,
  autoRotate: false,
};

/**
 * Minimal configuration for reduced performance
 */
const MINIMAL_CONFIG: TimelineConfigOptions = {
  nodeScale: 0.8,
  connectionOpacity: 0.5,
  spacing: 2.5,
  enableEffects: false,
  enableParticles: false,
  autoRotate: false,
};

/**
 * Quality-based configurations
 */
const QUALITY_CONFIGS: Record<QualityLevel, TimelineConfigOptions> = {
  high: {
    nodeScale: 1,
    connectionOpacity: 0.8,
    spacing: 3,
    enableEffects: true,
    enableParticles: true,
    autoRotate: false,
  },
  medium: {
    nodeScale: 0.9,
    connectionOpacity: 0.7,
    spacing: 3,
    enableEffects: true,
    enableParticles: true,
    autoRotate: false,
  },
  low: {
    nodeScale: 0.8,
    connectionOpacity: 0.5,
    spacing: 2.5,
    enableEffects: false,
    enableParticles: false,
    autoRotate: false,
  },
};

/**
 * Immutable value object for timeline configuration.
 * Provides factory methods for different quality levels and presets.
 */
export class TimelineConfig {
  private constructor(
    private readonly _nodeScale: number,
    private readonly _connectionOpacity: number,
    private readonly _spacing: number,
    private readonly _enableEffects: boolean,
    private readonly _enableParticles: boolean,
    private readonly _autoRotate: boolean
  ) {
    Object.freeze(this);
  }

  /**
   * Creates a TimelineConfig with default values.
   */
  static default(): TimelineConfig {
    return TimelineConfig.fromOptions(DEFAULT_CONFIG);
  }

  /**
   * Creates a TimelineConfig with minimal settings for low performance devices.
   */
  static minimal(): TimelineConfig {
    return TimelineConfig.fromOptions(MINIMAL_CONFIG);
  }

  /**
   * Creates a TimelineConfig based on quality level.
   */
  static forQuality(quality: QualityLevel): TimelineConfig {
    return TimelineConfig.fromOptions(QUALITY_CONFIGS[quality]);
  }

  /**
   * Creates a TimelineConfig with custom options, merging with defaults.
   */
  static custom(options: Partial<TimelineConfigOptions>): TimelineConfig {
    return TimelineConfig.fromOptions({ ...DEFAULT_CONFIG, ...options });
  }

  /**
   * Creates a TimelineConfig from full options object.
   */
  private static fromOptions(options: TimelineConfigOptions): TimelineConfig {
    return new TimelineConfig(
      options.nodeScale,
      options.connectionOpacity,
      options.spacing,
      options.enableEffects,
      options.enableParticles,
      options.autoRotate
    );
  }

  get nodeScale(): number {
    return this._nodeScale;
  }

  get connectionOpacity(): number {
    return this._connectionOpacity;
  }

  get spacing(): number {
    return this._spacing;
  }

  get enableEffects(): boolean {
    return this._enableEffects;
  }

  get enableParticles(): boolean {
    return this._enableParticles;
  }

  get autoRotate(): boolean {
    return this._autoRotate;
  }

  /**
   * Returns a new TimelineConfig with updated nodeScale.
   */
  withNodeScale(nodeScale: number): TimelineConfig {
    return new TimelineConfig(
      nodeScale,
      this._connectionOpacity,
      this._spacing,
      this._enableEffects,
      this._enableParticles,
      this._autoRotate
    );
  }

  /**
   * Returns a new TimelineConfig with updated spacing.
   */
  withSpacing(spacing: number): TimelineConfig {
    return new TimelineConfig(
      this._nodeScale,
      this._connectionOpacity,
      spacing,
      this._enableEffects,
      this._enableParticles,
      this._autoRotate
    );
  }

  /**
   * Returns a new TimelineConfig with effects enabled/disabled.
   */
  withEffects(enabled: boolean): TimelineConfig {
    return new TimelineConfig(
      this._nodeScale,
      this._connectionOpacity,
      this._spacing,
      enabled,
      this._enableParticles,
      this._autoRotate
    );
  }

  /**
   * Returns a new TimelineConfig with particles enabled/disabled.
   */
  withParticles(enabled: boolean): TimelineConfig {
    return new TimelineConfig(
      this._nodeScale,
      this._connectionOpacity,
      this._spacing,
      this._enableEffects,
      enabled,
      this._autoRotate
    );
  }

  /**
   * Returns a new TimelineConfig with auto-rotate enabled/disabled.
   */
  withAutoRotate(enabled: boolean): TimelineConfig {
    return new TimelineConfig(
      this._nodeScale,
      this._connectionOpacity,
      this._spacing,
      this._enableEffects,
      this._enableParticles,
      enabled
    );
  }

  /**
   * Checks equality with another TimelineConfig.
   */
  equals(other: TimelineConfig): boolean {
    return (
      this._nodeScale === other._nodeScale &&
      this._connectionOpacity === other._connectionOpacity &&
      this._spacing === other._spacing &&
      this._enableEffects === other._enableEffects &&
      this._enableParticles === other._enableParticles &&
      this._autoRotate === other._autoRotate
    );
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `TimelineConfig(nodeScale: ${this._nodeScale}, spacing: ${this._spacing}, effects: ${this._enableEffects})`;
  }
}
