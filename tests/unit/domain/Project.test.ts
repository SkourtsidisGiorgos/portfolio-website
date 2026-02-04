import { describe, it, expect } from 'vitest';
import { Project } from '@/domain/portfolio/entities/Project';

describe('Project', () => {
  const validProps = {
    id: 'proj-1',
    title: 'Commandeft',
    description: 'CLI wrapper for LLM interactions',
    technologies: ['Python', 'Click', 'OpenAI'],
    type: 'oss' as const,
    githubUrl: 'https://github.com/example/commandeft',
    featured: true,
  };

  describe('create', () => {
    it('should create a project with valid props', () => {
      const project = Project.create(validProps);
      expect(project.id).toBe('proj-1');
      expect(project.title).toBe('Commandeft');
      expect(project.type).toBe('oss');
    });

    it('should throw for missing ID', () => {
      expect(() => Project.create({ ...validProps, id: '' })).toThrow(
        'Project ID is required'
      );
    });

    it('should throw for missing title', () => {
      expect(() => Project.create({ ...validProps, title: '' })).toThrow(
        'Project title is required'
      );
    });

    it('should throw for missing description', () => {
      expect(() => Project.create({ ...validProps, description: '' })).toThrow(
        'Project description is required'
      );
    });

    it('should default type to personal', () => {
      const { type: _type, ...propsWithoutType } = validProps;
      const project = Project.create(propsWithoutType);
      expect(project.type).toBe('personal');
    });

    it('should default featured to false', () => {
      const { featured: _featured, ...propsWithoutFeatured } = validProps;
      const project = Project.create(propsWithoutFeatured);
      expect(project.featured).toBe(false);
    });
  });

  describe('hasGithub', () => {
    it('should return true when github URL exists', () => {
      const project = Project.create(validProps);
      expect(project.hasGithub()).toBe(true);
    });

    it('should return false when github URL is null', () => {
      const project = Project.create({ ...validProps, githubUrl: null });
      expect(project.hasGithub()).toBe(false);
    });
  });

  describe('hasLiveDemo', () => {
    it('should return true when live URL exists', () => {
      const project = Project.create({
        ...validProps,
        liveUrl: 'https://example.com',
      });
      expect(project.hasLiveDemo()).toBe(true);
    });

    it('should return false when live URL is null', () => {
      const project = Project.create(validProps);
      expect(project.hasLiveDemo()).toBe(false);
    });
  });

  describe('isOpenSource', () => {
    it('should return true for oss type', () => {
      const project = Project.create(validProps);
      expect(project.isOpenSource()).toBe(true);
    });

    it('should return false for other types', () => {
      const project = Project.create({ ...validProps, type: 'professional' });
      expect(project.isOpenSource()).toBe(false);
    });
  });

  describe('usesTechnology', () => {
    it('should return true for used technology', () => {
      const project = Project.create(validProps);
      expect(project.usesTechnology('Python')).toBe(true);
    });

    it('should return false for unused technology', () => {
      const project = Project.create(validProps);
      expect(project.usesTechnology('Ruby')).toBe(false);
    });
  });
});
