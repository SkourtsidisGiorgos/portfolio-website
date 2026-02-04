import { describe, it, expect } from 'vitest';
import { Color3D } from '@/presentation/three/domain/value-objects/Color3D';
import { Position3D } from '@/presentation/three/domain/value-objects/Position3D';
import { ETLNode } from '../domain/ETLNode';
import type { ETLNodeType } from '../domain/ETLNode';

describe('ETLNode', () => {
  describe('create()', () => {
    it('should create a source node with required properties', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Database',
        position: Position3D.create(-4, 0, 0),
      });

      expect(node.type).toBe('source');
      expect(node.label).toBe('Database');
      expect(node.position.x).toBe(-4);
      expect(node.position.y).toBe(0);
      expect(node.position.z).toBe(0);
    });

    it('should create a transform node', () => {
      const node = ETLNode.create({
        type: 'transform',
        label: 'ETL Process',
        position: Position3D.create(0, 0, 0),
      });

      expect(node.type).toBe('transform');
      expect(node.label).toBe('ETL Process');
    });

    it('should create a load node', () => {
      const node = ETLNode.create({
        type: 'load',
        label: 'Data Warehouse',
        position: Position3D.create(4, 0, 0),
      });

      expect(node.type).toBe('load');
      expect(node.label).toBe('Data Warehouse');
    });

    it('should create an analytics node', () => {
      const node = ETLNode.create({
        type: 'analytics',
        label: 'ML Pipeline',
        position: Position3D.create(6, 0, 0),
      });

      expect(node.type).toBe('analytics');
      expect(node.label).toBe('ML Pipeline');
    });

    it('should apply custom color', () => {
      const customColor = Color3D.fromHex('#ff0000');
      const node = ETLNode.create({
        type: 'source',
        label: 'Custom',
        position: Position3D.create(0, 0, 0),
        color: customColor,
      });

      expect(node.color.toHex()).toBe('#ff0000');
    });

    it('should apply custom radius', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Large Node',
        position: Position3D.create(0, 0, 0),
        radius: 2,
      });

      expect(node.radius).toBe(2);
    });
  });

  describe('default colors', () => {
    it('should use primary color for source nodes', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Source',
        position: Position3D.create(0, 0, 0),
      });

      expect(node.color.toHex()).toBe('#00bcd4');
    });

    it('should use accent color for transform nodes', () => {
      const node = ETLNode.create({
        type: 'transform',
        label: 'Transform',
        position: Position3D.create(0, 0, 0),
      });

      expect(node.color.toHex()).toBe('#7c3aed');
    });

    it('should use success color for load nodes', () => {
      const node = ETLNode.create({
        type: 'load',
        label: 'Load',
        position: Position3D.create(0, 0, 0),
      });

      expect(node.color.toHex()).toBe('#10b981');
    });

    it('should use accent color for analytics nodes', () => {
      const node = ETLNode.create({
        type: 'analytics',
        label: 'Analytics',
        position: Position3D.create(0, 0, 0),
      });

      expect(node.color.toHex()).toBe('#a855f7');
    });
  });

  describe('default radius', () => {
    it('should have default radius of 0.5', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Test',
        position: Position3D.create(0, 0, 0),
      });

      expect(node.radius).toBe(0.5);
    });
  });

  describe('id generation', () => {
    it('should generate unique id based on type and label', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Database',
        position: Position3D.create(0, 0, 0),
      });

      expect(node.id).toBe('source-database');
    });

    it('should handle labels with spaces', () => {
      const node = ETLNode.create({
        type: 'transform',
        label: 'ETL Process',
        position: Position3D.create(0, 0, 0),
      });

      expect(node.id).toBe('transform-etl-process');
    });

    it('should allow custom id', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Database',
        position: Position3D.create(0, 0, 0),
        id: 'custom-id',
      });

      expect(node.id).toBe('custom-id');
    });
  });

  describe('factory methods', () => {
    it('should create source node with factory', () => {
      const node = ETLNode.source('API', Position3D.create(-3, 1, 0));

      expect(node.type).toBe('source');
      expect(node.label).toBe('API');
      expect(node.position.x).toBe(-3);
    });

    it('should create transform node with factory', () => {
      const node = ETLNode.transform('Clean Data', Position3D.create(0, 0, 0));

      expect(node.type).toBe('transform');
      expect(node.label).toBe('Clean Data');
    });

    it('should create load node with factory', () => {
      const node = ETLNode.load('Warehouse', Position3D.create(3, 0, 0));

      expect(node.type).toBe('load');
      expect(node.label).toBe('Warehouse');
    });

    it('should create analytics node with factory', () => {
      const node = ETLNode.analytics('Insights', Position3D.create(5, 0, 0));

      expect(node.type).toBe('analytics');
      expect(node.label).toBe('Insights');
    });
  });

  describe('withPosition()', () => {
    it('should return new node with updated position', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Test',
        position: Position3D.create(0, 0, 0),
      });

      const newPosition = Position3D.create(1, 2, 3);
      const movedNode = node.withPosition(newPosition);

      expect(movedNode.position.x).toBe(1);
      expect(movedNode.position.y).toBe(2);
      expect(movedNode.position.z).toBe(3);
    });

    it('should not mutate original node', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Test',
        position: Position3D.create(0, 0, 0),
      });

      const newPosition = Position3D.create(1, 2, 3);
      node.withPosition(newPosition);

      expect(node.position.x).toBe(0);
      expect(node.position.y).toBe(0);
      expect(node.position.z).toBe(0);
    });
  });

  describe('withColor()', () => {
    it('should return new node with updated color', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Test',
        position: Position3D.create(0, 0, 0),
      });

      const newColor = Color3D.fromHex('#ff00ff');
      const coloredNode = node.withColor(newColor);

      expect(coloredNode.color.toHex()).toBe('#ff00ff');
    });

    it('should not mutate original node', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Test',
        position: Position3D.create(0, 0, 0),
      });

      const originalColor = node.color.toHex();
      node.withColor(Color3D.fromHex('#ff00ff'));

      expect(node.color.toHex()).toBe(originalColor);
    });
  });

  describe('equals()', () => {
    it('should return true for nodes with same id', () => {
      const node1 = ETLNode.create({
        type: 'source',
        label: 'Database',
        position: Position3D.create(0, 0, 0),
      });

      const node2 = ETLNode.create({
        type: 'source',
        label: 'Database',
        position: Position3D.create(1, 1, 1),
      });

      expect(node1.equals(node2)).toBe(true);
    });

    it('should return false for nodes with different ids', () => {
      const node1 = ETLNode.create({
        type: 'source',
        label: 'Database A',
        position: Position3D.create(0, 0, 0),
      });

      const node2 = ETLNode.create({
        type: 'source',
        label: 'Database B',
        position: Position3D.create(0, 0, 0),
      });

      expect(node1.equals(node2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Test',
        position: Position3D.create(0, 0, 0),
      });

      expect(Object.isFrozen(node)).toBe(true);
    });
  });

  describe('toString()', () => {
    it('should return readable string representation', () => {
      const node = ETLNode.create({
        type: 'source',
        label: 'Database',
        position: Position3D.create(1, 2, 3),
      });

      expect(node.toString()).toBe('ETLNode(source: Database @ (1, 2, 3))');
    });
  });

  describe('ETLNodeType', () => {
    it('should include all expected types', () => {
      const types: ETLNodeType[] = ['source', 'transform', 'load', 'analytics'];
      types.forEach(type => {
        const node = ETLNode.create({
          type,
          label: 'Test',
          position: Position3D.create(0, 0, 0),
        });
        expect(node.type).toBe(type);
      });
    });
  });
});
