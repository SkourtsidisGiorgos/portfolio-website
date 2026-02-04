import { describe, it, expect } from 'vitest';
import {
  pulseValue,
  oscillateScale,
  fadeOpacity,
  floatOffset,
  rotationAngle,
  glowIntensity,
  pathProgress,
  bounceValue,
  applyEasing,
  shouldSkipFrame,
} from '../../utils/animationHelpers';

describe('animationHelpers', () => {
  describe('pulseValue()', () => {
    it('should oscillate between min and max', () => {
      const min = 0.5;
      const max = 1.0;

      // Test multiple time values
      for (let t = 0; t < 10; t += 0.1) {
        const value = pulseValue(t, 1, min, max);
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThanOrEqual(max);
      }
    });

    it('should respect speed parameter', () => {
      const fast = pulseValue(1, 2, 0, 1);
      const slow = pulseValue(1, 0.5, 0, 1);
      // They should differ because of different speeds
      expect(fast).not.toBeCloseTo(slow, 1);
    });

    it('should be pure (same input = same output)', () => {
      expect(pulseValue(1, 1, 0, 1)).toBe(pulseValue(1, 1, 0, 1));
    });
  });

  describe('oscillateScale()', () => {
    it('should oscillate around 1', () => {
      const intensity = 0.2;

      for (let t = 0; t < 10; t += 0.1) {
        const scale = oscillateScale(t, 1, intensity);
        expect(scale).toBeGreaterThanOrEqual(1 - intensity);
        expect(scale).toBeLessThanOrEqual(1 + intensity);
      }
    });

    it('should return 1 when intensity is 0', () => {
      expect(oscillateScale(5, 1, 0)).toBe(1);
    });
  });

  describe('fadeOpacity()', () => {
    it('should oscillate around base opacity', () => {
      const base = 0.8;
      const amplitude = 0.2;

      for (let t = 0; t < 10; t += 0.1) {
        const opacity = fadeOpacity(t, 1, base, amplitude);
        expect(opacity).toBeGreaterThanOrEqual(base - amplitude);
        expect(opacity).toBeLessThanOrEqual(base + amplitude);
      }
    });
  });

  describe('floatOffset()', () => {
    it('should oscillate within amplitude', () => {
      const amplitude = 0.1;

      for (let t = 0; t < 10; t += 0.1) {
        const offset = floatOffset(t, 1, amplitude);
        expect(Math.abs(offset)).toBeLessThanOrEqual(amplitude);
      }
    });

    it('should return 0 when amplitude is 0', () => {
      expect(floatOffset(5, 1, 0)).toBeCloseTo(0);
    });
  });

  describe('rotationAngle()', () => {
    it('should increase linearly with time', () => {
      const speed = 0.1;
      expect(rotationAngle(1, speed)).toBe(0.1);
      expect(rotationAngle(2, speed)).toBe(0.2);
      expect(rotationAngle(10, speed)).toBe(1);
    });

    it('should respect speed', () => {
      expect(rotationAngle(1, 1)).toBe(1);
      expect(rotationAngle(1, 2)).toBe(2);
    });
  });

  describe('glowIntensity()', () => {
    it('should oscillate around base', () => {
      const base = 0.3;
      const amplitude = 0.1;

      for (let t = 0; t < 10; t += 0.1) {
        const intensity = glowIntensity(t, 1.5, base, amplitude);
        expect(intensity).toBeGreaterThanOrEqual(base - amplitude);
        expect(intensity).toBeLessThanOrEqual(base + amplitude);
      }
    });
  });

  describe('pathProgress()', () => {
    it('should loop between 0 and 1', () => {
      for (let t = 0; t < 10; t += 0.1) {
        const progress = pathProgress(t, 1);
        expect(progress).toBeGreaterThanOrEqual(0);
        expect(progress).toBeLessThan(1);
      }
    });

    it('should respect speed', () => {
      // With speed 2, same time should produce more progress
      const slow = pathProgress(0.5, 1);
      const fast = pathProgress(0.5, 2);
      expect(fast).toBeGreaterThan(slow);
    });
  });

  describe('bounceValue()', () => {
    it('should return values between 0 and 1', () => {
      for (let t = 0; t < 5; t += 0.1) {
        const value = bounceValue(t, 1, 0.5);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('applyEasing()', () => {
    it('should pass through for linear', () => {
      expect(applyEasing(0.5, 'linear')).toBe(0.5);
    });

    it('should ease in (slower start)', () => {
      const eased = applyEasing(0.5, 'easeIn');
      expect(eased).toBeLessThan(0.5);
    });

    it('should ease out (faster start)', () => {
      const eased = applyEasing(0.5, 'easeOut');
      expect(eased).toBeGreaterThan(0.5);
    });

    it('should preserve endpoints', () => {
      expect(applyEasing(0, 'easeInOut')).toBe(0);
      expect(applyEasing(1, 'easeInOut')).toBe(1);
    });
  });

  describe('shouldSkipFrame()', () => {
    it('should skip if within throttle', () => {
      const lastUpdate = 1;
      const currentTime = 1.01; // 10ms later
      expect(shouldSkipFrame(lastUpdate, currentTime, 16)).toBe(true);
    });

    it('should not skip if past throttle', () => {
      const lastUpdate = 1;
      const currentTime = 1.02; // 20ms later
      expect(shouldSkipFrame(lastUpdate, currentTime, 16)).toBe(false);
    });

    it('should not skip with 0 throttle', () => {
      expect(shouldSkipFrame(1, 1.001, 0)).toBe(false);
    });
  });

  describe('purity', () => {
    it('all functions should be pure', () => {
      // Same inputs should always produce same outputs
      const testCases = [
        () => pulseValue(1, 1, 0, 1),
        () => oscillateScale(1, 1, 0.2),
        () => fadeOpacity(1, 1, 0.8, 0.2),
        () => floatOffset(1, 1, 0.1),
        () => rotationAngle(1, 0.1),
        () => glowIntensity(1, 1.5, 0.3, 0.1),
        () => pathProgress(1, 1),
        () => bounceValue(1, 1, 0.5),
      ];

      testCases.forEach(fn => {
        expect(fn()).toBe(fn());
      });
    });
  });
});
