/**
 * Easing function types
 */
export type EasingType =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'elastic'
  | 'bounce';

/**
 * Animation type presets
 */
export type AnimationType = 'pulse' | 'rotation' | 'float' | 'scale' | 'custom';

/**
 * Configuration options for AnimationConfig
 */
export interface AnimationConfigOptions {
  speed?: number;
  intensity?: number;
  easing?: EasingType;
  enabled?: boolean;
  type?: AnimationType;
}

/**
 * Immutable value object for animation configuration.
 * Provides factory methods for common animation patterns.
 */
export class AnimationConfig {
  private constructor(
    public readonly speed: number,
    public readonly intensity: number,
    public readonly easing: EasingType,
    public readonly enabled: boolean,
    public readonly type: AnimationType
  ) {
    Object.freeze(this);
  }

  /**
   * Creates a pulse animation configuration.
   * @param speed - Animation speed (default: 1)
   * @param intensity - Pulse intensity (default: 0.3)
   */
  static pulse(speed = 1, intensity = 0.3): AnimationConfig {
    return new AnimationConfig(speed, intensity, 'easeInOut', true, 'pulse');
  }

  /**
   * Creates a rotation animation configuration.
   * @param speed - Rotation speed (default: 0.1)
   */
  static rotation(speed = 0.1): AnimationConfig {
    return new AnimationConfig(speed, 1, 'linear', true, 'rotation');
  }

  /**
   * Creates a floating animation configuration.
   * @param speed - Float speed (default: 1)
   * @param amplitude - Float amplitude (default: 0.1)
   */
  static float(speed = 1, amplitude = 0.1): AnimationConfig {
    return new AnimationConfig(speed, amplitude, 'easeInOut', true, 'float');
  }

  /**
   * Creates a scale animation configuration.
   * @param speed - Scale speed (default: 1)
   * @param intensity - Scale intensity (default: 0.2)
   */
  static scale(speed = 1, intensity = 0.2): AnimationConfig {
    return new AnimationConfig(speed, intensity, 'easeInOut', true, 'scale');
  }

  /**
   * Creates a custom animation configuration.
   * @param options - Animation options
   */
  static custom(options: AnimationConfigOptions = {}): AnimationConfig {
    return new AnimationConfig(
      options.speed ?? 1,
      options.intensity ?? 1,
      options.easing ?? 'linear',
      options.enabled ?? true,
      options.type ?? 'custom'
    );
  }

  /**
   * Creates a disabled animation configuration.
   */
  static disabled(): AnimationConfig {
    return new AnimationConfig(0, 0, 'linear', false, 'custom');
  }

  /**
   * Creates a default enabled configuration.
   */
  static default(): AnimationConfig {
    return new AnimationConfig(1, 1, 'linear', true, 'custom');
  }

  /**
   * Returns a new AnimationConfig with updated values.
   * @param updates - Partial updates to apply
   */
  with(updates: Partial<AnimationConfigOptions>): AnimationConfig {
    return new AnimationConfig(
      updates.speed ?? this.speed,
      updates.intensity ?? this.intensity,
      updates.easing ?? this.easing,
      updates.enabled ?? this.enabled,
      updates.type ?? this.type
    );
  }

  /**
   * Returns a copy with animation enabled.
   */
  enable(): AnimationConfig {
    return this.with({ enabled: true });
  }

  /**
   * Returns a copy with animation disabled.
   */
  disable(): AnimationConfig {
    return this.with({ enabled: false });
  }

  /**
   * Returns a copy with adjusted speed.
   * @param factor - Speed multiplier
   */
  withSpeed(factor: number): AnimationConfig {
    return this.with({ speed: this.speed * factor });
  }

  /**
   * Returns a copy with adjusted intensity.
   * @param factor - Intensity multiplier
   */
  withIntensity(factor: number): AnimationConfig {
    return this.with({ intensity: this.intensity * factor });
  }

  /**
   * Checks if this config equals another.
   */
  equals(other: AnimationConfig): boolean {
    return (
      this.speed === other.speed &&
      this.intensity === other.intensity &&
      this.easing === other.easing &&
      this.enabled === other.enabled &&
      this.type === other.type
    );
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `AnimationConfig(${this.type}, speed=${this.speed}, intensity=${this.intensity}, enabled=${this.enabled})`;
  }
}
