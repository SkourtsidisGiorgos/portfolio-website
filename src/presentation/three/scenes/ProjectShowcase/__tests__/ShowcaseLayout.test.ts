import { describe, it, expect } from 'vitest';
import { Position3D } from '@/presentation/three/domain/value-objects/Position3D';
import { ShowcaseLayout } from '../domain/ShowcaseLayout';
import type { LayoutType } from '../domain/ShowcaseLayout';

describe('ShowcaseLayout', () => {
  describe('grid()', () => {
    it('should create a grid layout with specified columns', () => {
      const layout = ShowcaseLayout.grid(6, 3);

      expect(layout.type).toBe('grid');
      expect(layout.itemCount).toBe(6);
    });

    it('should generate correct number of positions', () => {
      const layout = ShowcaseLayout.grid(6, 3);
      const positions = layout.getPositions();

      expect(positions.length).toBe(6);
    });

    it('should arrange items in rows and columns', () => {
      const layout = ShowcaseLayout.grid(6, 3);
      const positions = layout.getPositions();

      // First row (items 0, 1, 2) should have same Y
      expect(positions[0].y).toBe(positions[1].y);
      expect(positions[1].y).toBe(positions[2].y);

      // Second row (items 3, 4, 5) should have same Y but different from first row
      expect(positions[3].y).toBe(positions[4].y);
      expect(positions[4].y).toBe(positions[5].y);
      expect(positions[0].y).not.toBe(positions[3].y);
    });

    it('should respect custom spacing', () => {
      const layout1 = ShowcaseLayout.grid(4, 2, { horizontalSpacing: 2 });
      const layout2 = ShowcaseLayout.grid(4, 2, { horizontalSpacing: 4 });

      const positions1 = layout1.getPositions();
      const positions2 = layout2.getPositions();

      const xDiff1 = Math.abs(positions1[1].x - positions1[0].x);
      const xDiff2 = Math.abs(positions2[1].x - positions2[0].x);

      expect(xDiff2).toBeGreaterThan(xDiff1);
    });

    it('should center the grid around origin', () => {
      const layout = ShowcaseLayout.grid(3, 3);
      const positions = layout.getPositions();

      // Middle item should be at x=0
      expect(positions[1].x).toBeCloseTo(0, 5);
    });
  });

  describe('spiral()', () => {
    it('should create a spiral layout with specified radius', () => {
      const layout = ShowcaseLayout.spiral(6, 3);

      expect(layout.type).toBe('spiral');
      expect(layout.itemCount).toBe(6);
    });

    it('should generate correct number of positions', () => {
      const layout = ShowcaseLayout.spiral(6, 3);
      const positions = layout.getPositions();

      expect(positions.length).toBe(6);
    });

    it('should arrange items in a spiral pattern', () => {
      const layout = ShowcaseLayout.spiral(8, 3);
      const positions = layout.getPositions();

      // All positions should be unique
      const posStrings = positions.map(p => p.toString());
      const uniquePositions = new Set(posStrings);
      expect(uniquePositions.size).toBe(8);
    });

    it('should stay within the specified radius', () => {
      const radius = 5;
      const layout = ShowcaseLayout.spiral(10, radius);
      const positions = layout.getPositions();

      positions.forEach(pos => {
        const distance = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
        expect(distance).toBeLessThanOrEqual(radius + 1); // Allow small margin
      });
    });
  });

  describe('featured()', () => {
    it('should create a featured layout with one large center item', () => {
      const layout = ShowcaseLayout.featured(5);

      expect(layout.type).toBe('featured');
      expect(layout.itemCount).toBe(5);
    });

    it('should place first item at center', () => {
      const layout = ShowcaseLayout.featured(5);
      const positions = layout.getPositions();

      expect(positions[0].x).toBeCloseTo(0, 5);
      expect(positions[0].y).toBeCloseTo(0, 5);
    });

    it('should arrange other items around the center', () => {
      const layout = ShowcaseLayout.featured(5);
      const positions = layout.getPositions();

      // Non-center items should be at a distance from origin
      for (let i = 1; i < positions.length; i++) {
        const distance = Math.sqrt(
          positions[i].x * positions[i].x + positions[i].y * positions[i].y
        );
        expect(distance).toBeGreaterThan(0);
      }
    });
  });

  describe('custom()', () => {
    it('should create a layout with custom positions', () => {
      const customPositions = [
        Position3D.create(0, 0, 0),
        Position3D.create(1, 0, 0),
        Position3D.create(2, 0, 0),
      ];

      const layout = ShowcaseLayout.custom(customPositions);

      expect(layout.type).toBe('custom');
      expect(layout.itemCount).toBe(3);
    });

    it('should return the exact custom positions', () => {
      const customPositions = [
        Position3D.create(1, 2, 3),
        Position3D.create(4, 5, 6),
      ];

      const layout = ShowcaseLayout.custom(customPositions);
      const positions = layout.getPositions();

      expect(positions[0].equals(customPositions[0])).toBe(true);
      expect(positions[1].equals(customPositions[1])).toBe(true);
    });
  });

  describe('getPositions()', () => {
    it('should return Position3D instances', () => {
      const layout = ShowcaseLayout.grid(4, 2);
      const positions = layout.getPositions();

      positions.forEach(pos => {
        expect(pos).toBeInstanceOf(Position3D);
      });
    });

    it('should return the same positions on multiple calls (memoized)', () => {
      const layout = ShowcaseLayout.grid(4, 2);
      const positions1 = layout.getPositions();
      const positions2 = layout.getPositions();

      expect(positions1).toEqual(positions2);
    });
  });

  describe('getPosition(index)', () => {
    it('should return position at specific index', () => {
      const layout = ShowcaseLayout.grid(4, 2);
      const position = layout.getPosition(0);

      expect(position).toBeInstanceOf(Position3D);
    });

    it('should throw for out of bounds index', () => {
      const layout = ShowcaseLayout.grid(4, 2);

      expect(() => layout.getPosition(10)).toThrow();
      expect(() => layout.getPosition(-1)).toThrow();
    });
  });

  describe('getScales()', () => {
    it('should return scale values for each item', () => {
      const layout = ShowcaseLayout.grid(4, 2);
      const scales = layout.getScales();

      expect(scales.length).toBe(4);
      scales.forEach(scale => {
        expect(typeof scale).toBe('number');
        expect(scale).toBeGreaterThan(0);
      });
    });

    it('should return larger scale for featured item in featured layout', () => {
      const layout = ShowcaseLayout.featured(5);
      const scales = layout.getScales();

      // First item (featured) should have larger scale
      expect(scales[0]).toBeGreaterThan(scales[1]);
    });

    it('should return uniform scales for grid layout', () => {
      const layout = ShowcaseLayout.grid(4, 2);
      const scales = layout.getScales();

      // All scales should be equal
      const firstScale = scales[0];
      scales.forEach(scale => {
        expect(scale).toBe(firstScale);
      });
    });
  });

  describe('withOffset()', () => {
    it('should return new layout with offset positions', () => {
      const layout = ShowcaseLayout.grid(4, 2);
      const offset = Position3D.create(10, 5, 0);
      const offsetLayout = layout.withOffset(offset);

      const originalPositions = layout.getPositions();
      const offsetPositions = offsetLayout.getPositions();

      for (let i = 0; i < originalPositions.length; i++) {
        expect(offsetPositions[i].x).toBe(originalPositions[i].x + 10);
        expect(offsetPositions[i].y).toBe(originalPositions[i].y + 5);
        expect(offsetPositions[i].z).toBe(originalPositions[i].z + 0);
      }
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const layout = ShowcaseLayout.grid(4, 2);
      expect(Object.isFrozen(layout)).toBe(true);
    });
  });

  describe('toString()', () => {
    it('should return readable string representation', () => {
      const layout = ShowcaseLayout.grid(6, 3);
      const str = layout.toString();

      expect(str).toContain('ShowcaseLayout');
      expect(str).toContain('grid');
      expect(str).toContain('6');
    });
  });
});

describe('LayoutType', () => {
  it('should include all expected layout types', () => {
    const types: LayoutType[] = ['grid', 'spiral', 'featured', 'custom'];
    expect(types).toContain('grid');
    expect(types).toContain('spiral');
    expect(types).toContain('featured');
    expect(types).toContain('custom');
  });
});
