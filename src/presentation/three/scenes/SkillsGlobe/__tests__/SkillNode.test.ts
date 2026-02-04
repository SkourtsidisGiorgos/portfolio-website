import { describe, it, expect } from 'vitest';
import { Skill } from '@/domain/portfolio/entities/Skill';
import { SkillNode, CATEGORY_COLORS } from '../domain/SkillNode';

describe('SkillNode', () => {
  // Helper to create test skills
  const createTestSkill = (
    overrides?: Partial<Parameters<typeof Skill.create>[0]>
  ) =>
    Skill.create({
      id: 'skill-test',
      name: 'Test Skill',
      category: 'languages',
      proficiency: 'expert',
      yearsOfExperience: 5,
      ...overrides,
    });

  describe('fromSkill()', () => {
    it('should create a SkillNode from a Skill with Fibonacci lattice distribution', () => {
      const skill = createTestSkill();
      const node = SkillNode.fromSkill(skill, 0, 10);

      expect(node.skill).toBe(skill);
      expect(node.position).toBeDefined();
      expect(node.spherical).toBeDefined();
    });

    it('should calculate valid spherical coordinates', () => {
      const skill = createTestSkill();
      const node = SkillNode.fromSkill(skill, 5, 20);

      const { theta, phi, radius } = node.spherical;

      // Theta should be a multiple of golden angle
      expect(typeof theta).toBe('number');
      expect(Number.isFinite(theta)).toBe(true);

      // Phi should be between 0 and PI
      expect(phi).toBeGreaterThanOrEqual(0);
      expect(phi).toBeLessThanOrEqual(Math.PI);

      // Default radius should be 3
      expect(radius).toBe(3);
    });

    it('should distribute points evenly on sphere using Fibonacci lattice', () => {
      const skill = createTestSkill();
      const total = 20;
      const nodes: SkillNode[] = [];

      for (let i = 0; i < total; i++) {
        nodes.push(SkillNode.fromSkill(skill, i, total));
      }

      // Check that all positions are unique
      const positions = nodes.map(n => n.position.toString());
      const uniquePositions = new Set(positions);
      expect(uniquePositions.size).toBe(total);

      // Check all positions are on the sphere surface
      nodes.forEach(node => {
        const distance = node.position.length();
        expect(distance).toBeCloseTo(3, 5); // radius = 3
      });
    });

    it('should position on sphere surface (distance = radius)', () => {
      const skill = createTestSkill();
      const node = SkillNode.fromSkill(skill, 3, 10);

      const distance = node.position.length();
      expect(distance).toBeCloseTo(node.spherical.radius, 5);
    });
  });

  describe('positioned()', () => {
    it('should create a SkillNode with custom spherical coordinates', () => {
      const skill = createTestSkill();
      const theta = Math.PI / 4;
      const phi = Math.PI / 3;
      const radius = 5;

      const node = SkillNode.positioned(skill, theta, phi, radius);

      expect(node.spherical.theta).toBe(theta);
      expect(node.spherical.phi).toBe(phi);
      expect(node.spherical.radius).toBe(radius);
    });

    it('should calculate correct cartesian position from spherical', () => {
      const skill = createTestSkill();
      const theta = Math.PI / 2;
      const phi = Math.PI / 2; // equator
      const radius = 1;

      const node = SkillNode.positioned(skill, theta, phi, radius);

      // At equator (phi = PI/2), theta = PI/2:
      // x = r * sin(phi) * cos(theta) = 1 * 1 * 0 = 0
      // y = r * sin(phi) * sin(theta) = 1 * 1 * 1 = 1
      // z = r * cos(phi) = 1 * 0 = 0
      expect(node.position.x).toBeCloseTo(0, 5);
      expect(node.position.y).toBeCloseTo(1, 5);
      expect(node.position.z).toBeCloseTo(0, 5);
    });
  });

  describe('size (based on proficiency)', () => {
    it('should return 0.3 for expert proficiency', () => {
      const skill = createTestSkill({ proficiency: 'expert' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.size).toBe(0.3);
    });

    it('should return 0.25 for advanced proficiency', () => {
      const skill = createTestSkill({ proficiency: 'advanced' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.size).toBe(0.25);
    });

    it('should return 0.2 for intermediate proficiency', () => {
      const skill = createTestSkill({ proficiency: 'intermediate' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.size).toBe(0.2);
    });

    it('should return 0.15 for beginner proficiency', () => {
      const skill = createTestSkill({ proficiency: 'beginner' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.size).toBe(0.15);
    });
  });

  describe('color (based on category)', () => {
    it('should return primary color for languages category', () => {
      const skill = createTestSkill({ category: 'languages' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.color.toHex()).toBe(CATEGORY_COLORS.languages);
    });

    it('should return accent color for bigdata category', () => {
      const skill = createTestSkill({ category: 'bigdata' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.color.toHex()).toBe(CATEGORY_COLORS.bigdata);
    });

    it('should return success color for devops category', () => {
      const skill = createTestSkill({ category: 'devops' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.color.toHex()).toBe(CATEGORY_COLORS.devops);
    });

    it('should return correct color for aiml category', () => {
      const skill = createTestSkill({ category: 'aiml' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.color.toHex()).toBe(CATEGORY_COLORS.aiml);
    });

    it('should return correct color for databases category', () => {
      const skill = createTestSkill({ category: 'databases' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.color.toHex()).toBe(CATEGORY_COLORS.databases);
    });

    it('should return correct color for backend category', () => {
      const skill = createTestSkill({ category: 'backend' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.color.toHex()).toBe(CATEGORY_COLORS.backend);
    });

    it('should return correct color for frontend category', () => {
      const skill = createTestSkill({ category: 'frontend' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.color.toHex()).toBe(CATEGORY_COLORS.frontend);
    });

    it('should return gray color for other category', () => {
      const skill = createTestSkill({ category: 'other' });
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(node.color.toHex()).toBe(CATEGORY_COLORS.other);
    });
  });

  describe('CATEGORY_COLORS', () => {
    it('should have all expected category colors defined', () => {
      expect(CATEGORY_COLORS.languages).toBe('#00bcd4'); // primary
      expect(CATEGORY_COLORS.bigdata).toBe('#7c3aed'); // accent
      expect(CATEGORY_COLORS.devops).toBe('#10b981'); // success
      expect(CATEGORY_COLORS.aiml).toBe('#a78bfa'); // accent-light
      expect(CATEGORY_COLORS.databases).toBe('#0891b2'); // primary-dark
      expect(CATEGORY_COLORS.backend).toBe('#6366f1'); // indigo
      expect(CATEGORY_COLORS.frontend).toBe('#f59e0b'); // amber
      expect(CATEGORY_COLORS.other).toBe('#6b7280'); // gray
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const skill = createTestSkill();
      const node = SkillNode.fromSkill(skill, 0, 1);
      expect(Object.isFrozen(node)).toBe(true);
    });
  });

  describe('withRadius()', () => {
    it('should return a new SkillNode with updated radius', () => {
      const skill = createTestSkill();
      const node = SkillNode.fromSkill(skill, 0, 10);
      const newNode = node.withRadius(5);

      expect(newNode.spherical.radius).toBe(5);
      expect(node.spherical.radius).toBe(3); // Original unchanged
    });

    it('should recalculate cartesian position with new radius', () => {
      const skill = createTestSkill();
      const node = SkillNode.positioned(skill, Math.PI / 2, Math.PI / 2, 1);
      const scaledNode = node.withRadius(2);

      // Position should be doubled
      expect(scaledNode.position.x).toBeCloseTo(node.position.x * 2, 5);
      expect(scaledNode.position.y).toBeCloseTo(node.position.y * 2, 5);
      expect(scaledNode.position.z).toBeCloseTo(node.position.z * 2, 5);
    });
  });

  describe('equals()', () => {
    it('should return true for nodes with same skill id', () => {
      const skill = createTestSkill({ id: 'skill-1' });
      const node1 = SkillNode.fromSkill(skill, 0, 10);
      const node2 = SkillNode.fromSkill(skill, 5, 10); // Different position

      expect(node1.equals(node2)).toBe(true);
    });

    it('should return false for nodes with different skill ids', () => {
      const skill1 = createTestSkill({ id: 'skill-1' });
      const skill2 = createTestSkill({ id: 'skill-2' });
      const node1 = SkillNode.fromSkill(skill1, 0, 10);
      const node2 = SkillNode.fromSkill(skill2, 0, 10);

      expect(node1.equals(node2)).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return readable string representation', () => {
      const skill = createTestSkill({ name: 'Python', category: 'languages' });
      const node = SkillNode.fromSkill(skill, 0, 10);

      const str = node.toString();
      expect(str).toContain('SkillNode');
      expect(str).toContain('Python');
      expect(str).toContain('languages');
    });
  });
});
