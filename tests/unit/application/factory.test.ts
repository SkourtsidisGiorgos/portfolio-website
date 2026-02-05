import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UseCaseFactory } from '@/application/use-cases/factory';
import { GetExperienceTimeline } from '@/application/use-cases/GetExperienceTimeline';
import { GetPortfolioData } from '@/application/use-cases/GetPortfolioData';
import { RepositoryContainer } from '@/infrastructure/container';

describe('UseCaseFactory', () => {
  // Reset container after each test to avoid state pollution
  afterEach(() => {
    RepositoryContainer.reset();
  });

  describe('getExperienceTimeline', () => {
    it('should return a GetExperienceTimeline instance', () => {
      const useCase = UseCaseFactory.getExperienceTimeline();

      expect(useCase).toBeInstanceOf(GetExperienceTimeline);
    });

    it('should return a new instance on each call', () => {
      const useCase1 = UseCaseFactory.getExperienceTimeline();
      const useCase2 = UseCaseFactory.getExperienceTimeline();

      expect(useCase1).not.toBe(useCase2);
    });

    it('should execute successfully with container dependencies', async () => {
      const useCase = UseCaseFactory.getExperienceTimeline();

      const result = await useCase.execute();

      expect(result).toHaveProperty('experiences');
      expect(result).toHaveProperty('totalYears');
      expect(result).toHaveProperty('technologies');
      expect(Array.isArray(result.experiences)).toBe(true);
      expect(typeof result.totalYears).toBe('number');
      expect(Array.isArray(result.technologies)).toBe(true);
    });
  });

  describe('getPortfolioData', () => {
    it('should return a GetPortfolioData instance', () => {
      const useCase = UseCaseFactory.getPortfolioData();

      expect(useCase).toBeInstanceOf(GetPortfolioData);
    });

    it('should return a new instance on each call', () => {
      const useCase1 = UseCaseFactory.getPortfolioData();
      const useCase2 = UseCaseFactory.getPortfolioData();

      expect(useCase1).not.toBe(useCase2);
    });

    it('should execute successfully with container dependencies', async () => {
      const useCase = UseCaseFactory.getPortfolioData();

      const result = await useCase.execute();

      expect(result).toHaveProperty('experiences');
      expect(result).toHaveProperty('projects');
      expect(result).toHaveProperty('featuredProjects');
      expect(result).toHaveProperty('skills');
      expect(result).toHaveProperty('advancedSkills');
      expect(result).toHaveProperty('currentExperience');
      expect(Array.isArray(result.experiences)).toBe(true);
      expect(Array.isArray(result.projects)).toBe(true);
      expect(Array.isArray(result.skills)).toBe(true);
    });
  });

  describe('integration with RepositoryContainer', () => {
    beforeEach(() => {
      RepositoryContainer.reset();
    });

    it('should use repositories from container', async () => {
      // Execute use cases
      const timelineUseCase = UseCaseFactory.getExperienceTimeline();
      const portfolioUseCase = UseCaseFactory.getPortfolioData();

      const timelineResult = await timelineUseCase.execute();
      const portfolioResult = await portfolioUseCase.execute();

      // Both should return consistent data from the same repositories
      expect(timelineResult.experiences.length).toBe(
        portfolioResult.experiences.length
      );
    });

    it('should respect container overrides', async () => {
      // Create a mock repository
      const mockExperienceRepo = {
        findAll: async () => [],
        findById: async () => null,
        findCurrent: async () => null,
        findByTechnology: async () => [],
      };

      // Override the repository
      RepositoryContainer.override({
        experienceRepository: mockExperienceRepo,
      });

      // Use cases should use the overridden repository
      const useCase = UseCaseFactory.getExperienceTimeline();
      const result = await useCase.execute();

      expect(result.experiences).toHaveLength(0);
      expect(result.totalYears).toBe(0);
    });
  });
});
