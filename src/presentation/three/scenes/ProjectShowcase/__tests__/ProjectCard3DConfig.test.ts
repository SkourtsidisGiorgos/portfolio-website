import { describe, it, expect } from 'vitest';
import { Project } from '@/domain/portfolio/entities/Project';
import { Position3D } from '@/presentation/three/domain/value-objects/Position3D';
import {
  ProjectCard3DConfig,
  PROJECT_TYPE_COLORS,
} from '../domain/ProjectCard3DConfig';
import type { FloatingAnimationParams } from '../domain/ProjectCard3DConfig';

describe('ProjectCard3DConfig', () => {
  // Helper to create test projects
  const createTestProject = (
    overrides?: Partial<Parameters<typeof Project.create>[0]>
  ) =>
    Project.create({
      id: 'proj-test',
      title: 'Test Project',
      description: 'Test description',
      technologies: ['TypeScript', 'React'],
      type: 'oss',
      featured: false,
      ...overrides,
    });

  describe('fromProject()', () => {
    it('should create a config from a project with index-based position', () => {
      const project = createTestProject();
      const config = ProjectCard3DConfig.fromProject(project, 0, 6, 3);

      expect(config.project).toBe(project);
      expect(config.position).toBeInstanceOf(Position3D);
      expect(config.scale).toBe(1);
    });

    it('should distribute projects in a grid layout', () => {
      const project = createTestProject();
      const configs = [
        ProjectCard3DConfig.fromProject(project, 0, 6, 3),
        ProjectCard3DConfig.fromProject(project, 1, 6, 3),
        ProjectCard3DConfig.fromProject(project, 2, 6, 3),
        ProjectCard3DConfig.fromProject(project, 3, 6, 3),
        ProjectCard3DConfig.fromProject(project, 4, 6, 3),
        ProjectCard3DConfig.fromProject(project, 5, 6, 3),
      ];

      // All positions should be unique
      const positions = configs.map(c => c.position.toString());
      const uniquePositions = new Set(positions);
      expect(uniquePositions.size).toBe(6);
    });

    it('should assign different rows based on index and columns', () => {
      const project = createTestProject();
      const config0 = ProjectCard3DConfig.fromProject(project, 0, 6, 3);
      const config3 = ProjectCard3DConfig.fromProject(project, 3, 6, 3);

      // First row vs second row should have different Y positions
      expect(config0.position.y).not.toBe(config3.position.y);
    });
  });

  describe('featured()', () => {
    it('should create a config for a featured project with larger scale', () => {
      const project = createTestProject({ featured: true });
      const config = ProjectCard3DConfig.featured(project);

      expect(config.project).toBe(project);
      expect(config.scale).toBeGreaterThan(1);
    });

    it('should position featured project at center (0, 0, z)', () => {
      const project = createTestProject({ featured: true });
      const config = ProjectCard3DConfig.featured(project);

      expect(config.position.x).toBe(0);
      expect(config.position.y).toBe(0);
    });
  });

  describe('custom()', () => {
    it('should create a config with custom position and scale', () => {
      const project = createTestProject();
      const position = Position3D.create(1, 2, 3);
      const rotation = Position3D.create(0.1, 0.2, 0);
      const config = ProjectCard3DConfig.custom(
        project,
        position,
        rotation,
        1.5
      );

      expect(config.project).toBe(project);
      expect(config.position.equals(position)).toBe(true);
      expect(config.rotation.equals(rotation)).toBe(true);
      expect(config.scale).toBe(1.5);
    });
  });

  describe('getters', () => {
    it('should return the project', () => {
      const project = createTestProject({ title: 'My Project' });
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);

      expect(config.project.title).toBe('My Project');
    });

    it('should return position as Position3D', () => {
      const project = createTestProject();
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);

      expect(config.position).toBeInstanceOf(Position3D);
    });

    it('should return rotation as Position3D', () => {
      const project = createTestProject();
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);

      expect(config.rotation).toBeInstanceOf(Position3D);
    });

    it('should return scale as number', () => {
      const project = createTestProject();
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);

      expect(typeof config.scale).toBe('number');
    });
  });

  describe('floatingAnimation', () => {
    it('should return floating animation parameters', () => {
      const project = createTestProject();
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);

      const anim = config.floatingAnimation;
      expect(anim).toBeDefined();
      expect(typeof anim.amplitude).toBe('number');
      expect(typeof anim.frequency).toBe('number');
      expect(typeof anim.phase).toBe('number');
    });

    it('should have unique phase offset based on index', () => {
      const project = createTestProject();
      const config0 = ProjectCard3DConfig.fromProject(project, 0, 3, 3);
      const config1 = ProjectCard3DConfig.fromProject(project, 1, 3, 3);
      const config2 = ProjectCard3DConfig.fromProject(project, 2, 3, 3);

      // Phases should be different
      expect(config0.floatingAnimation.phase).not.toBe(
        config1.floatingAnimation.phase
      );
      expect(config1.floatingAnimation.phase).not.toBe(
        config2.floatingAnimation.phase
      );
    });
  });

  describe('getColor()', () => {
    it('should return correct color for OSS project type', () => {
      const project = createTestProject({ type: 'oss' });
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);

      expect(config.getColor().toHex()).toBe(PROJECT_TYPE_COLORS.oss);
    });

    it('should return correct color for professional project type', () => {
      const project = createTestProject({ type: 'professional' });
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);

      expect(config.getColor().toHex()).toBe(PROJECT_TYPE_COLORS.professional);
    });

    it('should return correct color for personal project type', () => {
      const project = createTestProject({ type: 'personal' });
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);

      expect(config.getColor().toHex()).toBe(PROJECT_TYPE_COLORS.personal);
    });
  });

  describe('withScale()', () => {
    it('should return new config with updated scale', () => {
      const project = createTestProject();
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);
      const newConfig = config.withScale(2);

      expect(newConfig.scale).toBe(2);
      expect(config.scale).toBe(1); // Original unchanged
    });
  });

  describe('withPosition()', () => {
    it('should return new config with updated position', () => {
      const project = createTestProject();
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);
      const newPosition = Position3D.create(5, 5, 5);
      const newConfig = config.withPosition(newPosition);

      expect(newConfig.position.equals(newPosition)).toBe(true);
      expect(config.position.equals(newPosition)).toBe(false); // Original unchanged
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const project = createTestProject();
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);
      expect(Object.isFrozen(config)).toBe(true);
    });
  });

  describe('equals()', () => {
    it('should return true for configs with same project id', () => {
      const project = createTestProject({ id: 'proj-1' });
      const config1 = ProjectCard3DConfig.fromProject(project, 0, 1, 1);
      const config2 = ProjectCard3DConfig.fromProject(project, 1, 2, 1);

      expect(config1.equals(config2)).toBe(true);
    });

    it('should return false for configs with different project ids', () => {
      const project1 = createTestProject({ id: 'proj-1' });
      const project2 = createTestProject({ id: 'proj-2' });
      const config1 = ProjectCard3DConfig.fromProject(project1, 0, 1, 1);
      const config2 = ProjectCard3DConfig.fromProject(project2, 0, 1, 1);

      expect(config1.equals(config2)).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return readable string representation', () => {
      const project = createTestProject({ title: 'My Project', type: 'oss' });
      const config = ProjectCard3DConfig.fromProject(project, 0, 1, 1);

      const str = config.toString();
      expect(str).toContain('ProjectCard3DConfig');
      expect(str).toContain('My Project');
      expect(str).toContain('oss');
    });
  });

  describe('PROJECT_TYPE_COLORS', () => {
    it('should have all expected type colors defined', () => {
      expect(PROJECT_TYPE_COLORS.oss).toBe('#10b981'); // success green
      expect(PROJECT_TYPE_COLORS.professional).toBe('#7c3aed'); // accent purple
      expect(PROJECT_TYPE_COLORS.personal).toBe('#00bcd4'); // primary cyan
    });
  });
});

describe('FloatingAnimationParams', () => {
  it('should be a valid interface type', () => {
    const params: FloatingAnimationParams = {
      amplitude: 0.1,
      frequency: 1.5,
      phase: 0.5,
    };

    expect(params.amplitude).toBe(0.1);
    expect(params.frequency).toBe(1.5);
    expect(params.phase).toBe(0.5);
  });
});
