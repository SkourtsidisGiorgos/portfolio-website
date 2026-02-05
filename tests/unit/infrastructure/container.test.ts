import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { IExperienceRepository } from '@/domain/portfolio/repositories/IExperienceRepository';
import type { IProjectRepository } from '@/domain/portfolio/repositories/IProjectRepository';
import type { ISkillRepository } from '@/domain/portfolio/repositories/ISkillRepository';
import { RepositoryContainer } from '@/infrastructure/container';

describe('RepositoryContainer', () => {
  // Reset container before each test
  beforeEach(() => {
    RepositoryContainer.reset();
  });

  describe('experienceRepository', () => {
    it('should return a repository instance', () => {
      const repo = RepositoryContainer.experienceRepository;

      expect(repo).toBeDefined();
      expect(repo).toHaveProperty('findAll');
      expect(repo).toHaveProperty('findById');
      expect(repo).toHaveProperty('findCurrent');
      expect(repo).toHaveProperty('findByTechnology');
    });

    it('should return the same singleton instance on multiple calls', () => {
      const repo1 = RepositoryContainer.experienceRepository;
      const repo2 = RepositoryContainer.experienceRepository;

      expect(repo1).toBe(repo2);
    });

    it('should return working repository that loads data', async () => {
      const repo = RepositoryContainer.experienceRepository;

      const experiences = await repo.findAll();

      expect(Array.isArray(experiences)).toBe(true);
      expect(experiences.length).toBeGreaterThan(0);
    });
  });

  describe('projectRepository', () => {
    it('should return a repository instance', () => {
      const repo = RepositoryContainer.projectRepository;

      expect(repo).toBeDefined();
      expect(repo).toHaveProperty('findAll');
      expect(repo).toHaveProperty('findById');
      expect(repo).toHaveProperty('findFeatured');
      expect(repo).toHaveProperty('findByType');
      expect(repo).toHaveProperty('findByTechnology');
    });

    it('should return the same singleton instance on multiple calls', () => {
      const repo1 = RepositoryContainer.projectRepository;
      const repo2 = RepositoryContainer.projectRepository;

      expect(repo1).toBe(repo2);
    });

    it('should return working repository that loads data', async () => {
      const repo = RepositoryContainer.projectRepository;

      const projects = await repo.findAll();

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });
  });

  describe('skillRepository', () => {
    it('should return a repository instance', () => {
      const repo = RepositoryContainer.skillRepository;

      expect(repo).toBeDefined();
      expect(repo).toHaveProperty('findAll');
      expect(repo).toHaveProperty('findById');
      expect(repo).toHaveProperty('findByCategory');
      expect(repo).toHaveProperty('findAdvanced');
      expect(repo).toHaveProperty('getCategories');
    });

    it('should return the same singleton instance on multiple calls', () => {
      const repo1 = RepositoryContainer.skillRepository;
      const repo2 = RepositoryContainer.skillRepository;

      expect(repo1).toBe(repo2);
    });

    it('should return working repository that loads data', async () => {
      const repo = RepositoryContainer.skillRepository;

      const skills = await repo.findAll();

      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
    });
  });

  describe('override', () => {
    it('should allow overriding experienceRepository', async () => {
      const mockFindAll = vi.fn().mockResolvedValue([]);
      const mockRepo: IExperienceRepository = {
        findAll: mockFindAll,
        findById: vi.fn(),
        findCurrent: vi.fn(),
        findByTechnology: vi.fn(),
      };

      RepositoryContainer.override({ experienceRepository: mockRepo });

      const repo = RepositoryContainer.experienceRepository;
      await repo.findAll();

      expect(mockFindAll).toHaveBeenCalled();
      expect(repo).toBe(mockRepo);
    });

    it('should allow overriding projectRepository', async () => {
      const mockFindAll = vi.fn().mockResolvedValue([]);
      const mockRepo: IProjectRepository = {
        findAll: mockFindAll,
        findById: vi.fn(),
        findFeatured: vi.fn(),
        findByType: vi.fn(),
        findByTechnology: vi.fn(),
      };

      RepositoryContainer.override({ projectRepository: mockRepo });

      const repo = RepositoryContainer.projectRepository;
      await repo.findAll();

      expect(mockFindAll).toHaveBeenCalled();
      expect(repo).toBe(mockRepo);
    });

    it('should allow overriding skillRepository', async () => {
      const mockFindAll = vi.fn().mockResolvedValue([]);
      const mockRepo: ISkillRepository = {
        findAll: mockFindAll,
        findById: vi.fn(),
        findByCategory: vi.fn(),
        findAdvanced: vi.fn(),
        getCategories: vi.fn(),
      };

      RepositoryContainer.override({ skillRepository: mockRepo });

      const repo = RepositoryContainer.skillRepository;
      await repo.findAll();

      expect(mockFindAll).toHaveBeenCalled();
      expect(repo).toBe(mockRepo);
    });

    it('should allow partial overrides', () => {
      const mockExperienceRepo: IExperienceRepository = {
        findAll: vi.fn(),
        findById: vi.fn(),
        findCurrent: vi.fn(),
        findByTechnology: vi.fn(),
      };

      RepositoryContainer.override({
        experienceRepository: mockExperienceRepo,
      });

      // Experience should be overridden
      expect(RepositoryContainer.experienceRepository).toBe(mockExperienceRepo);

      // Others should still work from default
      expect(RepositoryContainer.projectRepository).toBeDefined();
      expect(RepositoryContainer.skillRepository).toBeDefined();
    });

    it('should allow chained overrides', () => {
      const mockExperienceRepo: IExperienceRepository = {
        findAll: vi.fn(),
        findById: vi.fn(),
        findCurrent: vi.fn(),
        findByTechnology: vi.fn(),
      };
      const mockProjectRepo: IProjectRepository = {
        findAll: vi.fn(),
        findById: vi.fn(),
        findFeatured: vi.fn(),
        findByType: vi.fn(),
        findByTechnology: vi.fn(),
      };

      RepositoryContainer.override({
        experienceRepository: mockExperienceRepo,
      });
      RepositoryContainer.override({ projectRepository: mockProjectRepo });

      expect(RepositoryContainer.experienceRepository).toBe(mockExperienceRepo);
      expect(RepositoryContainer.projectRepository).toBe(mockProjectRepo);
    });
  });

  describe('reset', () => {
    it('should clear all overrides', () => {
      const mockRepo: IExperienceRepository = {
        findAll: vi.fn(),
        findById: vi.fn(),
        findCurrent: vi.fn(),
        findByTechnology: vi.fn(),
      };

      RepositoryContainer.override({ experienceRepository: mockRepo });
      expect(RepositoryContainer.experienceRepository).toBe(mockRepo);

      RepositoryContainer.reset();

      // After reset, should return default repository (not the mock)
      expect(RepositoryContainer.experienceRepository).not.toBe(mockRepo);
    });

    it('should clear cached singleton instances', () => {
      // Get singleton instances
      const expRepo1 = RepositoryContainer.experienceRepository;
      const projRepo1 = RepositoryContainer.projectRepository;
      const skillRepo1 = RepositoryContainer.skillRepository;

      // Reset
      RepositoryContainer.reset();

      // New instances should be different objects (new singleton instances)
      const expRepo2 = RepositoryContainer.experienceRepository;
      const projRepo2 = RepositoryContainer.projectRepository;
      const skillRepo2 = RepositoryContainer.skillRepository;

      expect(expRepo1).not.toBe(expRepo2);
      expect(projRepo1).not.toBe(projRepo2);
      expect(skillRepo1).not.toBe(skillRepo2);
    });

    it('should allow re-overriding after reset', () => {
      const mockRepo1: IExperienceRepository = {
        findAll: vi.fn().mockResolvedValue([]),
        findById: vi.fn(),
        findCurrent: vi.fn(),
        findByTechnology: vi.fn(),
      };
      const mockRepo2: IExperienceRepository = {
        findAll: vi.fn().mockResolvedValue([{ id: 'test' }]),
        findById: vi.fn(),
        findCurrent: vi.fn(),
        findByTechnology: vi.fn(),
      };

      RepositoryContainer.override({ experienceRepository: mockRepo1 });
      expect(RepositoryContainer.experienceRepository).toBe(mockRepo1);

      RepositoryContainer.reset();

      RepositoryContainer.override({ experienceRepository: mockRepo2 });
      expect(RepositoryContainer.experienceRepository).toBe(mockRepo2);
    });
  });

  describe('testing utilities', () => {
    it('should support test isolation pattern', async () => {
      // Pattern: override -> test -> reset
      const mockRepo: IExperienceRepository = {
        findAll: vi.fn().mockResolvedValue([]),
        findById: vi.fn(),
        findCurrent: vi.fn(),
        findByTechnology: vi.fn(),
      };

      // Setup: override
      RepositoryContainer.override({ experienceRepository: mockRepo });

      // Test: use the mock
      const result = await RepositoryContainer.experienceRepository.findAll();
      expect(result).toEqual([]);

      // Cleanup: reset
      RepositoryContainer.reset();

      // Verify: back to real implementation
      const realResult =
        await RepositoryContainer.experienceRepository.findAll();
      expect(realResult.length).toBeGreaterThan(0);
    });
  });
});
