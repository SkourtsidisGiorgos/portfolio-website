import { describe, it, expect } from 'vitest';
import { AnimationConfig } from '../../domain/value-objects/AnimationConfig';

describe('AnimationConfig', () => {
  describe('pulse()', () => {
    it('should create pulse config with defaults', () => {
      const config = AnimationConfig.pulse();
      expect(config.type).toBe('pulse');
      expect(config.speed).toBe(1);
      expect(config.intensity).toBe(0.3);
      expect(config.easing).toBe('easeInOut');
      expect(config.enabled).toBe(true);
    });

    it('should accept custom speed and intensity', () => {
      const config = AnimationConfig.pulse(2, 0.5);
      expect(config.speed).toBe(2);
      expect(config.intensity).toBe(0.5);
    });
  });

  describe('rotation()', () => {
    it('should create rotation config with defaults', () => {
      const config = AnimationConfig.rotation();
      expect(config.type).toBe('rotation');
      expect(config.speed).toBe(0.1);
      expect(config.intensity).toBe(1);
      expect(config.easing).toBe('linear');
      expect(config.enabled).toBe(true);
    });

    it('should accept custom speed', () => {
      const config = AnimationConfig.rotation(0.5);
      expect(config.speed).toBe(0.5);
    });
  });

  describe('float()', () => {
    it('should create float config with defaults', () => {
      const config = AnimationConfig.float();
      expect(config.type).toBe('float');
      expect(config.speed).toBe(1);
      expect(config.intensity).toBe(0.1);
    });

    it('should accept custom speed and amplitude', () => {
      const config = AnimationConfig.float(2, 0.2);
      expect(config.speed).toBe(2);
      expect(config.intensity).toBe(0.2);
    });
  });

  describe('scale()', () => {
    it('should create scale config with defaults', () => {
      const config = AnimationConfig.scale();
      expect(config.type).toBe('scale');
      expect(config.speed).toBe(1);
      expect(config.intensity).toBe(0.2);
    });
  });

  describe('custom()', () => {
    it('should create custom config with defaults', () => {
      const config = AnimationConfig.custom();
      expect(config.type).toBe('custom');
      expect(config.speed).toBe(1);
      expect(config.intensity).toBe(1);
      expect(config.easing).toBe('linear');
      expect(config.enabled).toBe(true);
    });

    it('should accept all options', () => {
      const config = AnimationConfig.custom({
        speed: 2,
        intensity: 0.5,
        easing: 'easeIn',
        enabled: false,
        type: 'pulse',
      });
      expect(config.speed).toBe(2);
      expect(config.intensity).toBe(0.5);
      expect(config.easing).toBe('easeIn');
      expect(config.enabled).toBe(false);
      expect(config.type).toBe('pulse');
    });
  });

  describe('disabled()', () => {
    it('should create disabled config', () => {
      const config = AnimationConfig.disabled();
      expect(config.enabled).toBe(false);
      expect(config.speed).toBe(0);
      expect(config.intensity).toBe(0);
    });
  });

  describe('default()', () => {
    it('should create default enabled config', () => {
      const config = AnimationConfig.default();
      expect(config.enabled).toBe(true);
      expect(config.speed).toBe(1);
      expect(config.intensity).toBe(1);
    });
  });

  describe('with()', () => {
    it('should return new instance with updates', () => {
      const original = AnimationConfig.pulse();
      const updated = original.with({ speed: 5 });
      expect(updated.speed).toBe(5);
      expect(original.speed).toBe(1); // Original unchanged
    });

    it('should preserve other values', () => {
      const original = AnimationConfig.pulse();
      const updated = original.with({ speed: 5 });
      expect(updated.intensity).toBe(original.intensity);
      expect(updated.easing).toBe(original.easing);
      expect(updated.type).toBe(original.type);
    });
  });

  describe('enable() and disable()', () => {
    it('should enable animation', () => {
      const config = AnimationConfig.disabled().enable();
      expect(config.enabled).toBe(true);
    });

    it('should disable animation', () => {
      const config = AnimationConfig.pulse().disable();
      expect(config.enabled).toBe(false);
    });
  });

  describe('withSpeed() and withIntensity()', () => {
    it('should multiply speed', () => {
      const config = AnimationConfig.pulse().withSpeed(2);
      expect(config.speed).toBe(2);
    });

    it('should multiply intensity', () => {
      const config = AnimationConfig.pulse().withIntensity(2);
      expect(config.intensity).toBe(0.6);
    });
  });

  describe('equals()', () => {
    it('should return true for equal configs', () => {
      const c1 = AnimationConfig.pulse();
      const c2 = AnimationConfig.pulse();
      expect(c1.equals(c2)).toBe(true);
    });

    it('should return false for different configs', () => {
      const c1 = AnimationConfig.pulse();
      const c2 = AnimationConfig.rotation();
      expect(c1.equals(c2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const config = AnimationConfig.pulse();
      expect(Object.isFrozen(config)).toBe(true);
    });
  });

  describe('toString()', () => {
    it('should return readable string', () => {
      const config = AnimationConfig.pulse();
      expect(config.toString()).toContain('pulse');
      expect(config.toString()).toContain('speed=1');
    });
  });
});
