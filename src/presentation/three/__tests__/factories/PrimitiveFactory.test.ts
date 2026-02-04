import { describe, it, expect } from 'vitest';
import { PrimitiveFactory } from '../../domain/factories/PrimitiveFactory';
import { AnimationConfig } from '../../domain/value-objects/AnimationConfig';
import { Color3D } from '../../domain/value-objects/Color3D';
import { Position3D } from '../../domain/value-objects/Position3D';

describe('PrimitiveFactory', () => {
  describe('createParticle()', () => {
    it('should create particle with defaults', () => {
      const props = PrimitiveFactory.createParticle();
      expect(props.position).toEqual([0, 0, 0]);
      expect(props.color).toBe('#00bcd4');
      expect(props.size).toBe(0.1);
      expect(props.intensity).toBe(1);
      expect(props.animated).toBe(true);
      expect(props.animationSpeed).toBe(1);
    });

    it('should accept Position3D value object', () => {
      const pos = Position3D.create(1, 2, 3);
      const props = PrimitiveFactory.createParticle({ position: pos });
      expect(props.position).toEqual([1, 2, 3]);
    });

    it('should accept tuple position', () => {
      const props = PrimitiveFactory.createParticle({ position: [4, 5, 6] });
      expect(props.position).toEqual([4, 5, 6]);
    });

    it('should accept Color3D value object', () => {
      const color = Color3D.fromHex('#ff0000');
      const props = PrimitiveFactory.createParticle({ color });
      expect(props.color).toBe('#ff0000');
    });

    it('should accept hex string color', () => {
      const props = PrimitiveFactory.createParticle({ color: '#00ff00' });
      expect(props.color).toBe('#00ff00');
    });

    it('should accept AnimationConfig', () => {
      const animation = AnimationConfig.pulse(2, 0.5);
      const props = PrimitiveFactory.createParticle({ animation });
      expect(props.animated).toBe(true);
      expect(props.animationSpeed).toBe(2);
    });

    it('should accept disabled AnimationConfig', () => {
      const animation = AnimationConfig.disabled();
      const props = PrimitiveFactory.createParticle({ animation });
      expect(props.animated).toBe(false);
    });
  });

  describe('createSphere()', () => {
    it('should create sphere with defaults', () => {
      const props = PrimitiveFactory.createSphere();
      expect(props.position).toEqual([0, 0, 0]);
      expect(props.color).toBe('#00bcd4');
      expect(props.radius).toBe(1);
      expect(props.wireframe).toBe(false);
      expect(props.animated).toBe(true);
    });

    it('should accept custom values', () => {
      const props = PrimitiveFactory.createSphere({
        position: Position3D.create(1, 2, 3),
        color: Color3D.fromTheme('accent'),
        radius: 2,
        wireframe: true,
      });
      expect(props.position).toEqual([1, 2, 3]);
      expect(props.color).toBe('#7c3aed');
      expect(props.radius).toBe(2);
      expect(props.wireframe).toBe(true);
    });

    it('should accept glowColor', () => {
      const props = PrimitiveFactory.createSphere({
        glowColor: Color3D.fromTheme('success'),
      });
      expect(props.glowColor).toBe('#10b981');
    });
  });

  describe('createLine()', () => {
    it('should create line with positions', () => {
      const start = Position3D.create(0, 0, 0);
      const end = Position3D.create(1, 1, 1);
      const props = PrimitiveFactory.createLine({ start, end });
      expect(props.start).toEqual([0, 0, 0]);
      expect(props.end).toEqual([1, 1, 1]);
      expect(props.color).toBe('#00bcd4');
      expect(props.lineWidth).toBe(1);
    });

    it('should accept tuple positions', () => {
      const props = PrimitiveFactory.createLine({
        start: [0, 0, 0],
        end: [5, 5, 5],
      });
      expect(props.start).toEqual([0, 0, 0]);
      expect(props.end).toEqual([5, 5, 5]);
    });

    it('should accept dashed option', () => {
      const props = PrimitiveFactory.createLine({
        start: [0, 0, 0],
        end: [1, 1, 1],
        dashed: true,
      });
      expect(props.dashed).toBe(true);
    });
  });

  describe('createGrid()', () => {
    it('should create grid with defaults', () => {
      const props = PrimitiveFactory.createGrid();
      expect(props.position).toEqual([0, 0, 0]);
      expect(props.color).toBe('#00bcd4');
      expect(props.size).toBe(100);
      expect(props.divisions).toBe(100);
    });

    it('should accept custom values', () => {
      const props = PrimitiveFactory.createGrid({
        size: 50,
        divisions: 50,
        fadeDistance: 25,
      });
      expect(props.size).toBe(50);
      expect(props.divisions).toBe(50);
      expect(props.fadeDistance).toBe(25);
    });

    it('should accept secondary color', () => {
      const props = PrimitiveFactory.createGrid({
        secondaryColor: Color3D.fromTheme('accent'),
      });
      expect(props.secondaryColor).toBe('#7c3aed');
    });
  });

  describe('createFromPreset()', () => {
    it('should create data preset', () => {
      const props = PrimitiveFactory.createFromPreset('data');
      expect(props.color).toBe('#00bcd4');
    });

    it('should create node preset', () => {
      const props = PrimitiveFactory.createFromPreset('node');
      expect(props.color).toBe('#7c3aed');
    });

    it('should create highlight preset', () => {
      const props = PrimitiveFactory.createFromPreset('highlight');
      expect(props.color).toBe('#10b981');
    });
  });

  describe('getDefaults()', () => {
    it('should return copy of defaults', () => {
      const defaults = PrimitiveFactory.getDefaults();
      expect(defaults).toHaveProperty('particle');
      expect(defaults).toHaveProperty('sphere');
      expect(defaults).toHaveProperty('line');
      expect(defaults).toHaveProperty('grid');
    });
  });

  describe('getPresets()', () => {
    it('should return preset names', () => {
      const presets = PrimitiveFactory.getPresets();
      expect(presets).toContain('data');
      expect(presets).toContain('node');
      expect(presets).toContain('highlight');
    });
  });
});
