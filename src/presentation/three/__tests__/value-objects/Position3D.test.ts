import { describe, it, expect } from 'vitest';
import { Position3D } from '../../domain/value-objects/Position3D';

describe('Position3D', () => {
  describe('create()', () => {
    it('should create a position with valid values', () => {
      const pos = Position3D.create(1, 2, 3);
      expect(pos.x).toBe(1);
      expect(pos.y).toBe(2);
      expect(pos.z).toBe(3);
    });

    it('should create a position with zero values', () => {
      const pos = Position3D.create(0, 0, 0);
      expect(pos.x).toBe(0);
      expect(pos.y).toBe(0);
      expect(pos.z).toBe(0);
    });

    it('should create a position with negative values', () => {
      const pos = Position3D.create(-1, -2, -3);
      expect(pos.x).toBe(-1);
      expect(pos.y).toBe(-2);
      expect(pos.z).toBe(-3);
    });

    it('should throw for NaN values', () => {
      expect(() => Position3D.create(NaN, 0, 0)).toThrow('finite numbers');
      expect(() => Position3D.create(0, NaN, 0)).toThrow('finite numbers');
      expect(() => Position3D.create(0, 0, NaN)).toThrow('finite numbers');
    });

    it('should throw for Infinity values', () => {
      expect(() => Position3D.create(Infinity, 0, 0)).toThrow('finite numbers');
      expect(() => Position3D.create(0, -Infinity, 0)).toThrow(
        'finite numbers'
      );
    });
  });

  describe('origin()', () => {
    it('should return [0, 0, 0]', () => {
      const origin = Position3D.origin();
      expect(origin.toArray()).toEqual([0, 0, 0]);
    });
  });

  describe('fromTuple()', () => {
    it('should create from tuple', () => {
      const pos = Position3D.fromTuple([1, 2, 3]);
      expect(pos.x).toBe(1);
      expect(pos.y).toBe(2);
      expect(pos.z).toBe(3);
    });
  });

  describe('add()', () => {
    it('should add two positions', () => {
      const p1 = Position3D.create(1, 2, 3);
      const p2 = Position3D.create(4, 5, 6);
      const result = p1.add(p2);
      expect(result.toArray()).toEqual([5, 7, 9]);
    });

    it('should not mutate original', () => {
      const p1 = Position3D.create(1, 2, 3);
      const p2 = Position3D.create(4, 5, 6);
      p1.add(p2);
      expect(p1.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('subtract()', () => {
    it('should subtract two positions', () => {
      const p1 = Position3D.create(5, 7, 9);
      const p2 = Position3D.create(1, 2, 3);
      const result = p1.subtract(p2);
      expect(result.toArray()).toEqual([4, 5, 6]);
    });
  });

  describe('scale()', () => {
    it('should scale by positive factor', () => {
      const pos = Position3D.create(1, 2, 3);
      const result = pos.scale(2);
      expect(result.toArray()).toEqual([2, 4, 6]);
    });

    it('should scale by negative factor', () => {
      const pos = Position3D.create(1, 2, 3);
      const result = pos.scale(-1);
      expect(result.toArray()).toEqual([-1, -2, -3]);
    });

    it('should scale by zero', () => {
      const pos = Position3D.create(1, 2, 3);
      const result = pos.scale(0);
      expect(result.toArray()).toEqual([0, 0, 0]);
    });
  });

  describe('distanceTo()', () => {
    it('should calculate euclidean distance', () => {
      const p1 = Position3D.create(0, 0, 0);
      const p2 = Position3D.create(3, 4, 0);
      expect(p1.distanceTo(p2)).toBe(5);
    });

    it('should return 0 for same position', () => {
      const pos = Position3D.create(1, 2, 3);
      expect(pos.distanceTo(pos)).toBe(0);
    });

    it('should calculate 3D distance', () => {
      const p1 = Position3D.origin();
      const p2 = Position3D.create(1, 1, 1);
      expect(p1.distanceTo(p2)).toBeCloseTo(Math.sqrt(3));
    });
  });

  describe('length()', () => {
    it('should calculate magnitude', () => {
      const pos = Position3D.create(3, 4, 0);
      expect(pos.length()).toBe(5);
    });

    it('should return 0 for origin', () => {
      expect(Position3D.origin().length()).toBe(0);
    });
  });

  describe('normalize()', () => {
    it('should return unit vector', () => {
      const pos = Position3D.create(3, 4, 0);
      const normalized = pos.normalize();
      expect(normalized.length()).toBeCloseTo(1);
      expect(normalized.x).toBeCloseTo(0.6);
      expect(normalized.y).toBeCloseTo(0.8);
    });

    it('should return origin for zero vector', () => {
      const normalized = Position3D.origin().normalize();
      expect(normalized.toArray()).toEqual([0, 0, 0]);
    });
  });

  describe('lerp()', () => {
    it('should interpolate at t=0', () => {
      const p1 = Position3D.create(0, 0, 0);
      const p2 = Position3D.create(10, 10, 10);
      const result = p1.lerp(p2, 0);
      expect(result.toArray()).toEqual([0, 0, 0]);
    });

    it('should interpolate at t=1', () => {
      const p1 = Position3D.create(0, 0, 0);
      const p2 = Position3D.create(10, 10, 10);
      const result = p1.lerp(p2, 1);
      expect(result.toArray()).toEqual([10, 10, 10]);
    });

    it('should interpolate at t=0.5', () => {
      const p1 = Position3D.create(0, 0, 0);
      const p2 = Position3D.create(10, 10, 10);
      const result = p1.lerp(p2, 0.5);
      expect(result.toArray()).toEqual([5, 5, 5]);
    });
  });

  describe('toArray()', () => {
    it('should return mutable array', () => {
      const pos = Position3D.create(1, 2, 3);
      const arr = pos.toArray();
      arr[0] = 99;
      expect(pos.x).toBe(1); // Original unchanged
    });
  });

  describe('equals()', () => {
    it('should return true for equal positions', () => {
      const p1 = Position3D.create(1, 2, 3);
      const p2 = Position3D.create(1, 2, 3);
      expect(p1.equals(p2)).toBe(true);
    });

    it('should return false for different positions', () => {
      const p1 = Position3D.create(1, 2, 3);
      const p2 = Position3D.create(1, 2, 4);
      expect(p1.equals(p2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const pos = Position3D.create(1, 2, 3);
      expect(Object.isFrozen(pos)).toBe(true);
    });
  });
});
