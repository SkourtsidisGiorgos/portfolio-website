import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Experience } from '@/domain/portfolio/entities/Experience';
import { Project } from '@/domain/portfolio/entities/Project';
import { Skill } from '@/domain/portfolio/entities/Skill';
import type { IExperienceRepository } from '@/domain/portfolio/repositories/IExperienceRepository';
import type { IProjectRepository } from '@/domain/portfolio/repositories/IProjectRepository';
import type { ISkillRepository } from '@/domain/portfolio/repositories/ISkillRepository';
import { PortfolioService } from '@/domain/portfolio/services/PortfolioService';

describe('PortfolioService', () => {
  let mockExperienceRepo: IExperienceRepository;
  let mockProjectRepo: IProjectRepository;
  let mockSkillRepo: ISkillRepository;
  let portfolioService: PortfolioService;

  const mockExperiences = [
    Experience.create({
      id: 'exp-1',
      company: 'SWIFT',
      role: 'Big Data Engineer',
      startDate: '2023-11-01',
      endDate: null,
      location: 'Belgium',
      remote: true,
      description: ['Built ETL pipelines'],
      technologies: ['Python', 'Spark'],
    }),
    Experience.create({
      id: 'exp-2',
      company: 'Intracom',
      role: 'Software Engineer',
      startDate: '2021-05-01',
      endDate: '2023-10-31',
      location: 'Greece',
      description: ['Developed IoT solutions'],
      technologies: ['Java', 'Kubernetes'],
    }),
  ];

  const mockProjects = [
    Project.create({
      id: 'proj-1',
      title: 'Commandeft',
      description: 'CLI LLM wrapper',
      technologies: ['Python', 'Click'],
      type: 'oss',
      featured: true,
    }),
  ];

  const mockSkills = [
    Skill.create({
      id: 'skill-1',
      name: 'Python',
      category: 'languages',
      proficiency: 'expert',
    }),
    Skill.create({
      id: 'skill-2',
      name: 'Spark',
      category: 'bigdata',
      proficiency: 'advanced',
    }),
  ];

  beforeEach(() => {
    mockExperienceRepo = {
      findAll: vi.fn().mockResolvedValue(mockExperiences),
      findById: vi.fn().mockResolvedValue(null),
      findCurrent: vi.fn().mockResolvedValue(mockExperiences[0]),
      findByTechnology: vi.fn().mockResolvedValue([]),
    };

    mockProjectRepo = {
      findAll: vi.fn().mockResolvedValue(mockProjects),
      findById: vi.fn().mockResolvedValue(null),
      findFeatured: vi.fn().mockResolvedValue(mockProjects),
      findByType: vi.fn().mockResolvedValue([]),
      findByTechnology: vi.fn().mockResolvedValue([]),
    };

    mockSkillRepo = {
      findAll: vi.fn().mockResolvedValue(mockSkills),
      findById: vi.fn().mockResolvedValue(null),
      findByCategory: vi.fn().mockImplementation(async category => {
        return mockSkills.filter(s => s.category === category);
      }),
      findAdvanced: vi.fn().mockResolvedValue(mockSkills),
      getCategories: vi.fn().mockResolvedValue(['languages', 'bigdata']),
    };

    portfolioService = new PortfolioService(
      mockExperienceRepo,
      mockProjectRepo,
      mockSkillRepo
    );
  });

  describe('getPortfolioData', () => {
    it('should return all portfolio data', async () => {
      const data = await portfolioService.getPortfolioData();

      expect(data.experiences).toHaveLength(2);
      expect(data.projects).toHaveLength(1);
      expect(data.skills).toHaveLength(2);
      expect(data.currentExperience).toBe(mockExperiences[0]);
      expect(data.featuredProjects).toHaveLength(1);
      expect(data.skillsByCategory.size).toBe(2);
    });

    it('should call all repositories', async () => {
      await portfolioService.getPortfolioData();

      expect(mockExperienceRepo.findAll).toHaveBeenCalled();
      expect(mockProjectRepo.findAll).toHaveBeenCalled();
      expect(mockSkillRepo.findAll).toHaveBeenCalled();
      expect(mockExperienceRepo.findCurrent).toHaveBeenCalled();
      expect(mockProjectRepo.findFeatured).toHaveBeenCalled();
    });
  });

  describe('getExperienceTimeline', () => {
    it('should return experiences sorted by date descending', async () => {
      const timeline = await portfolioService.getExperienceTimeline();

      expect(timeline).toHaveLength(2);
      expect(timeline[0].company).toBe('SWIFT');
      expect(timeline[1].company).toBe('Intracom');
    });
  });

  describe('getTotalExperienceYears', () => {
    it('should calculate total years of experience', async () => {
      const years = await portfolioService.getTotalExperienceYears();

      expect(years).toBeGreaterThan(0);
    });
  });

  describe('getAllTechnologies', () => {
    it('should return unique technologies', async () => {
      const technologies = await portfolioService.getAllTechnologies();

      expect(technologies).toContain('Python');
      expect(technologies).toContain('Spark');
      expect(technologies).toContain('Java');
      expect(technologies).toContain('Click');
      // Check uniqueness
      const unique = new Set(technologies);
      expect(unique.size).toBe(technologies.length);
    });

    it('should return sorted technologies', async () => {
      const technologies = await portfolioService.getAllTechnologies();
      const sorted = [...technologies].sort();

      expect(technologies).toEqual(sorted);
    });
  });

  describe('searchByTechnology', () => {
    it('should search experiences and projects', async () => {
      mockExperienceRepo.findByTechnology = vi
        .fn()
        .mockResolvedValue([mockExperiences[0]]);
      mockProjectRepo.findByTechnology = vi
        .fn()
        .mockResolvedValue([mockProjects[0]]);

      const results = await portfolioService.searchByTechnology('Python');

      expect(results.experiences).toHaveLength(1);
      expect(results.projects).toHaveLength(1);
      expect(mockExperienceRepo.findByTechnology).toHaveBeenCalledWith(
        'Python'
      );
      expect(mockProjectRepo.findByTechnology).toHaveBeenCalledWith('Python');
    });
  });
});
