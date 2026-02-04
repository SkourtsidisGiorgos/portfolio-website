import { describe, it, expect } from 'vitest';
import { Color3D } from '../../domain/value-objects/Color3D';

describe('Color3D', () => {
  describe('fromTheme()', () => {
    it('should return primary color', () => {
      const color = Color3D.fromTheme('primary');
      expect(color.toHex()).toBe('#00bcd4');
    });

    it('should return accent color', () => {
      const color = Color3D.fromTheme('accent');
      expect(color.toHex()).toBe('#7c3aed');
    });

    it('should return success color', () => {
      const color = Color3D.fromTheme('success');
      expect(color.toHex()).toBe('#10b981');
    });

    it('should accept shade parameter', () => {
      const color = Color3D.fromTheme('primary', 700);
      expect(color.toHex()).toBe('#0097a7');
    });
  });

  describe('fromHex()', () => {
    it('should parse hex with hash', () => {
      const color = Color3D.fromHex('#ff0000');
      expect(color.toHex()).toBe('#ff0000');
    });

    it('should parse hex without hash', () => {
      const color = Color3D.fromHex('ff0000');
      expect(color.toHex()).toBe('#ff0000');
    });

    it('should parse shorthand hex', () => {
      const color = Color3D.fromHex('#f00');
      expect(color.toHex()).toBe('#ff0000');
    });

    it('should be case insensitive', () => {
      const color = Color3D.fromHex('#FF00FF');
      expect(color.toHex()).toBe('#ff00ff');
    });

    it('should throw for invalid hex', () => {
      expect(() => Color3D.fromHex('invalid')).toThrow('Invalid hex color');
      expect(() => Color3D.fromHex('#gg0000')).toThrow('Invalid hex color');
      expect(() => Color3D.fromHex('#12345')).toThrow('Invalid hex color');
    });
  });

  describe('fromRGB()', () => {
    it('should create from RGB values', () => {
      const color = Color3D.fromRGB(255, 0, 0);
      expect(color.toHex()).toBe('#ff0000');
    });

    it('should clamp values', () => {
      const color = Color3D.fromRGB(300, -10, 128);
      expect(color.toRGB()).toEqual({ r: 255, g: 0, b: 128 });
    });

    it('should round values', () => {
      const color = Color3D.fromRGB(127.6, 0, 0);
      expect(color.toRGB().r).toBe(128);
    });
  });

  describe('white() and black()', () => {
    it('should return white', () => {
      expect(Color3D.white().toHex()).toBe('#ffffff');
    });

    it('should return black', () => {
      expect(Color3D.black().toHex()).toBe('#000000');
    });
  });

  describe('withOpacity()', () => {
    it('should return new instance with opacity', () => {
      const color = Color3D.fromHex('#ff0000');
      const withOp = color.withOpacity(0.5);
      expect(withOp.opacity).toBe(0.5);
      expect(color.opacity).toBe(1); // Original unchanged
    });

    it('should clamp opacity to 0-1', () => {
      const color = Color3D.fromHex('#ff0000');
      expect(color.withOpacity(-0.5).opacity).toBe(0);
      expect(color.withOpacity(1.5).opacity).toBe(1);
    });
  });

  describe('toRGB()', () => {
    it('should return RGB object', () => {
      const color = Color3D.fromHex('#ff8040');
      expect(color.toRGB()).toEqual({ r: 255, g: 128, b: 64 });
    });
  });

  describe('toRGBArray()', () => {
    it('should return normalized RGB array for Three.js', () => {
      const color = Color3D.fromHex('#ff8040');
      const rgb = color.toRGBArray();
      expect(rgb[0]).toBeCloseTo(1);
      expect(rgb[1]).toBeCloseTo(0.502, 2);
      expect(rgb[2]).toBeCloseTo(0.251, 2);
    });
  });

  describe('lerp()', () => {
    it('should interpolate colors', () => {
      const c1 = Color3D.fromRGB(0, 0, 0);
      const c2 = Color3D.fromRGB(255, 255, 255);
      const mid = c1.lerp(c2, 0.5);
      const rgb = mid.toRGB();
      expect(rgb.r).toBe(128);
      expect(rgb.g).toBe(128);
      expect(rgb.b).toBe(128);
    });

    it('should interpolate opacity', () => {
      const c1 = Color3D.fromHex('#000000').withOpacity(0);
      const c2 = Color3D.fromHex('#ffffff').withOpacity(1);
      const mid = c1.lerp(c2, 0.5);
      expect(mid.opacity).toBe(0.5);
    });
  });

  describe('lighten() and darken()', () => {
    it('should lighten color', () => {
      const color = Color3D.fromRGB(100, 100, 100);
      const lighter = color.lighten(0.5);
      const rgb = lighter.toRGB();
      expect(rgb.r).toBeGreaterThan(100);
    });

    it('should darken color', () => {
      const color = Color3D.fromRGB(100, 100, 100);
      const darker = color.darken(0.5);
      const rgb = darker.toRGB();
      expect(rgb.r).toBeLessThan(100);
    });
  });

  describe('equals()', () => {
    it('should return true for equal colors', () => {
      const c1 = Color3D.fromHex('#ff0000');
      const c2 = Color3D.fromHex('#ff0000');
      expect(c1.equals(c2)).toBe(true);
    });

    it('should return false for different colors', () => {
      const c1 = Color3D.fromHex('#ff0000');
      const c2 = Color3D.fromHex('#00ff00');
      expect(c1.equals(c2)).toBe(false);
    });

    it('should compare opacity', () => {
      const c1 = Color3D.fromHex('#ff0000').withOpacity(0.5);
      const c2 = Color3D.fromHex('#ff0000').withOpacity(1);
      expect(c1.equals(c2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const color = Color3D.fromHex('#ff0000');
      expect(Object.isFrozen(color)).toBe(true);
    });
  });
});
