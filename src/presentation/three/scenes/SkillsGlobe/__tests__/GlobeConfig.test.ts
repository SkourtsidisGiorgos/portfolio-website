import { describe, it, expect } from 'vitest';
import { GlobeConfig } from '../domain/GlobeConfig';

describe('GlobeConfig', () => {
  describe('default()', () => {
    it('should return config with default values', () => {
      const config = GlobeConfig.default();

      expect(config.radius).toBe(3);
      expect(config.rotationSpeed).toBe(0.1);
      expect(config.nodeScale).toBe(1);
      expect(config.showConnections).toBe(true);
      expect(config.enableEffects).toBe(true);
    });
  });

  describe('minimal()', () => {
    it('should return config with reduced settings', () => {
      const config = GlobeConfig.minimal();

      expect(config.radius).toBe(2.5);
      expect(config.rotationSpeed).toBe(0.05);
      expect(config.nodeScale).toBe(0.8);
      expect(config.showConnections).toBe(false);
      expect(config.enableEffects).toBe(false);
    });
  });

  describe('forQuality()', () => {
    it('should return high quality config for high quality level', () => {
      const config = GlobeConfig.forQuality('high');

      expect(config.radius).toBe(3);
      expect(config.rotationSpeed).toBe(0.1);
      expect(config.nodeScale).toBe(1);
      expect(config.showConnections).toBe(true);
      expect(config.enableEffects).toBe(true);
    });

    it('should return medium quality config for medium quality level', () => {
      const config = GlobeConfig.forQuality('medium');

      expect(config.radius).toBe(3);
      expect(config.rotationSpeed).toBe(0.08);
      expect(config.nodeScale).toBe(0.9);
      expect(config.showConnections).toBe(true);
      expect(config.enableEffects).toBe(true);
    });

    it('should return low quality config for low quality level', () => {
      const config = GlobeConfig.forQuality('low');

      expect(config.radius).toBe(2.5);
      expect(config.rotationSpeed).toBe(0.05);
      expect(config.nodeScale).toBe(0.8);
      expect(config.showConnections).toBe(false);
      expect(config.enableEffects).toBe(false);
    });
  });

  describe('custom()', () => {
    it('should create config with custom values', () => {
      const config = GlobeConfig.custom({
        radius: 4,
        rotationSpeed: 0.2,
        nodeScale: 1.5,
        showConnections: false,
        enableEffects: true,
      });

      expect(config.radius).toBe(4);
      expect(config.rotationSpeed).toBe(0.2);
      expect(config.nodeScale).toBe(1.5);
      expect(config.showConnections).toBe(false);
      expect(config.enableEffects).toBe(true);
    });

    it('should merge with default values', () => {
      const config = GlobeConfig.custom({
        radius: 5,
      });

      expect(config.radius).toBe(5);
      expect(config.rotationSpeed).toBe(0.1); // default
      expect(config.nodeScale).toBe(1); // default
    });
  });

  describe('withRadius()', () => {
    it('should return new config with updated radius', () => {
      const config = GlobeConfig.default();
      const newConfig = config.withRadius(5);

      expect(newConfig.radius).toBe(5);
      expect(config.radius).toBe(3); // Original unchanged
    });
  });

  describe('withRotationSpeed()', () => {
    it('should return new config with updated rotation speed', () => {
      const config = GlobeConfig.default();
      const newConfig = config.withRotationSpeed(0.2);

      expect(newConfig.rotationSpeed).toBe(0.2);
      expect(config.rotationSpeed).toBe(0.1); // Original unchanged
    });
  });

  describe('withEffects()', () => {
    it('should return new config with effects enabled/disabled', () => {
      const config = GlobeConfig.default();
      const noEffects = config.withEffects(false);
      const withEffects = noEffects.withEffects(true);

      expect(noEffects.enableEffects).toBe(false);
      expect(withEffects.enableEffects).toBe(true);
    });
  });

  describe('withConnections()', () => {
    it('should return new config with connections enabled/disabled', () => {
      const config = GlobeConfig.default();
      const noConnections = config.withConnections(false);
      const withConnections = noConnections.withConnections(true);

      expect(noConnections.showConnections).toBe(false);
      expect(withConnections.showConnections).toBe(true);
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const config = GlobeConfig.default();
      expect(Object.isFrozen(config)).toBe(true);
    });
  });

  describe('toString()', () => {
    it('should return readable string representation', () => {
      const config = GlobeConfig.default();
      const str = config.toString();

      expect(str).toContain('GlobeConfig');
      expect(str).toContain('radius');
      expect(str).toContain('3');
    });
  });

  describe('equals()', () => {
    it('should return true for configs with same values', () => {
      const config1 = GlobeConfig.default();
      const config2 = GlobeConfig.default();

      expect(config1.equals(config2)).toBe(true);
    });

    it('should return false for configs with different values', () => {
      const config1 = GlobeConfig.default();
      const config2 = GlobeConfig.minimal();

      expect(config1.equals(config2)).toBe(false);
    });
  });
});
