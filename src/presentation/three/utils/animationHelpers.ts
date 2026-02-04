/**
 * Animation helper utilities (DRY - extracted from components).
 * All functions are pure for testability.
 */

/**
 * Calculates a pulsing value between min and max.
 * @param time - Current time (elapsed seconds)
 * @param speed - Pulse speed multiplier (default: 1)
 * @param min - Minimum value (default: 0.7)
 * @param max - Maximum value (default: 1)
 * @returns Oscillating value between min and max
 */
export function pulseValue(
  time: number,
  speed: number = 1,
  min: number = 0.7,
  max: number = 1
): number {
  const range = (max - min) / 2;
  const center = min + range;
  return center + Math.sin(time * speed * 2) * range;
}

/**
 * Calculates a scaling factor that oscillates around 1.
 * @param time - Current time (elapsed seconds)
 * @param speed - Animation speed multiplier (default: 1)
 * @param intensity - Scale intensity (default: 0.2)
 * @returns Scale factor around 1 ± intensity
 */
export function oscillateScale(
  time: number,
  speed: number = 1,
  intensity: number = 0.2
): number {
  return 1 + Math.sin(time * speed) * intensity;
}

/**
 * Calculates a fading opacity value.
 * @param time - Current time (elapsed seconds)
 * @param speed - Animation speed multiplier (default: 1)
 * @param base - Base opacity (default: 0.8)
 * @param amplitude - Fade amplitude (default: 0.2)
 * @returns Opacity value
 */
export function fadeOpacity(
  time: number,
  speed: number = 1,
  base: number = 0.8,
  amplitude: number = 0.2
): number {
  return base + Math.sin(time * speed * 2) * amplitude;
}

/**
 * Calculates a floating Y position offset.
 * @param time - Current time (elapsed seconds)
 * @param speed - Float speed (default: 1)
 * @param amplitude - Float amplitude (default: 0.1)
 * @returns Y offset value
 */
export function floatOffset(
  time: number,
  speed: number = 1,
  amplitude: number = 0.1
): number {
  return Math.sin(time * speed) * amplitude;
}

/**
 * Calculates a rotation angle.
 * @param time - Current time (elapsed seconds)
 * @param speed - Rotation speed in radians per second (default: 0.1)
 * @returns Rotation angle in radians
 */
export function rotationAngle(time: number, speed: number = 0.1): number {
  return time * speed;
}

/**
 * Calculates a glow intensity that pulses.
 * @param time - Current time (elapsed seconds)
 * @param speed - Pulse speed (default: 1.5)
 * @param base - Base intensity (default: 0.3)
 * @param amplitude - Pulse amplitude (default: 0.1)
 * @returns Glow intensity value
 */
export function glowIntensity(
  time: number,
  speed: number = 1.5,
  base: number = 0.3,
  amplitude: number = 0.1
): number {
  return base + Math.sin(time * speed) * amplitude;
}

/**
 * Calculates progress along a path (0-1, looping).
 * @param time - Current time (elapsed seconds)
 * @param speed - Travel speed (default: 1)
 * @returns Progress value 0-1
 */
export function pathProgress(time: number, speed: number = 1): number {
  return (time * speed * 0.5) % 1;
}

/**
 * Calculates a bounce effect value.
 * @param time - Current time (elapsed seconds)
 * @param speed - Bounce speed (default: 1)
 * @param decay - Decay factor (default: 0.5)
 * @returns Bounce value
 */
export function bounceValue(
  time: number,
  speed: number = 1,
  decay: number = 0.5
): number {
  const t = (time * speed) % 1;
  const bounce = Math.abs(Math.sin(t * Math.PI));
  return bounce * Math.exp(-t * decay);
}

/**
 * Applies easing to a linear progress value.
 * @param t - Linear progress (0-1)
 * @param type - Easing type
 * @returns Eased value
 */
export function applyEasing(
  t: number,
  type: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' = 'linear'
): number {
  switch (type) {
    case 'easeIn':
      return t * t;
    case 'easeOut':
      return t * (2 - t);
    case 'easeInOut':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default:
      return t;
  }
}

/**
 * Checks if animation should be skipped for performance.
 * Used with requestAnimationFrame throttling.
 * @param lastUpdate - Time of last update
 * @param currentTime - Current time
 * @param throttleMs - Minimum time between updates in ms (default: 16 for ~60fps)
 * @returns Whether to skip this frame
 */
export function shouldSkipFrame(
  lastUpdate: number,
  currentTime: number,
  throttleMs: number = 16
): boolean {
  return (currentTime - lastUpdate) * 1000 < throttleMs;
}
