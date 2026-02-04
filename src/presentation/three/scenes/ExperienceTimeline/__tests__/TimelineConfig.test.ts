import { describe, it, expect } from 'vitest';
import { TimelineConfig } from '../domain/TimelineConfig';

describe('TimelineConfig', () => {
  describe('factory methods', () => {
    it('should create a default configuration', () => {
      const config = TimelineConfig.default();

      expect(config.nodeScale).toBe(1);
      expect(config.connectionOpacity).toBe(0.8);
      expect(config.spacing).toBe(3);
      expect(config.enableEffects).toBe(true);
      expect(config.enableParticles).toBe(true);
      expect(config.autoRotate).toBe(false);
    });

    it('should create a minimal configuration', () => {
      const config = TimelineConfig.minimal();

      expect(config.nodeScale).toBe(0.8);
      expect(config.connectionOpacity).toBe(0.5);
      expect(config.spacing).toBe(2.5);
      expect(config.enableEffects).toBe(false);
      expect(config.enableParticles).toBe(false);
      expect(config.autoRotate).toBe(false);
    });

    it('should create configuration for high quality', () => {
      const config = TimelineConfig.forQuality('high');

      expect(config.nodeScale).toBe(1);
      expect(config.connectionOpacity).toBe(0.8);
      expect(config.enableEffects).toBe(true);
      expect(config.enableParticles).toBe(true);
    });

    it('should create configuration for medium quality', () => {
      const config = TimelineConfig.forQuality('medium');

      expect(config.nodeScale).toBe(0.9);
      expect(config.connectionOpacity).toBe(0.7);
      expect(config.enableEffects).toBe(true);
      expect(config.enableParticles).toBe(true);
    });

    it('should create configuration for low quality', () => {
      const config = TimelineConfig.forQuality('low');

      expect(config.nodeScale).toBe(0.8);
      expect(config.connectionOpacity).toBe(0.5);
      expect(config.enableEffects).toBe(false);
      expect(config.enableParticles).toBe(false);
    });

    it('should create custom configuration merging with defaults', () => {
      const config = TimelineConfig.custom({
        nodeScale: 1.5,
        autoRotate: true,
      });

      expect(config.nodeScale).toBe(1.5);
      expect(config.autoRotate).toBe(true);
      // Other values should be defaults
      expect(config.connectionOpacity).toBe(0.8);
      expect(config.enableEffects).toBe(true);
    });
  });

  describe('immutability', () => {
    it('should be immutable (frozen)', () => {
      const config = TimelineConfig.default();

      // Attempting to modify should not change the value
      expect(() => {
        // @ts-expect-error - testing immutability
        config._nodeScale = 999;
      }).toThrow();
    });
  });

  describe('with* methods', () => {
    it('should return new config with updated nodeScale', () => {
      const config = TimelineConfig.default();
      const updated = config.withNodeScale(2);

      expect(updated.nodeScale).toBe(2);
      expect(config.nodeScale).toBe(1); // Original unchanged
    });

    it('should return new config with updated spacing', () => {
      const config = TimelineConfig.default();
      const updated = config.withSpacing(5);

      expect(updated.spacing).toBe(5);
      expect(config.spacing).toBe(3); // Original unchanged
    });

    it('should return new config with effects enabled/disabled', () => {
      const config = TimelineConfig.default();
      const updated = config.withEffects(false);

      expect(updated.enableEffects).toBe(false);
      expect(config.enableEffects).toBe(true); // Original unchanged
    });

    it('should return new config with particles enabled/disabled', () => {
      const config = TimelineConfig.default();
      const updated = config.withParticles(false);

      expect(updated.enableParticles).toBe(false);
      expect(config.enableParticles).toBe(true); // Original unchanged
    });
  });

  describe('equality', () => {
    it('should be equal to another config with same values', () => {
      const config1 = TimelineConfig.default();
      const config2 = TimelineConfig.default();

      expect(config1.equals(config2)).toBe(true);
    });

    it('should not be equal to config with different values', () => {
      const config1 = TimelineConfig.default();
      const config2 = TimelineConfig.minimal();

      expect(config1.equals(config2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const config = TimelineConfig.default();
      const str = config.toString();

      expect(str).toContain('TimelineConfig');
      expect(str).toContain('nodeScale: 1');
      expect(str).toContain('spacing: 3');
    });
  });
});
