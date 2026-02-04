import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetPortfolioData } from '@/application/use-cases/GetPortfolioData';
import { GetExperienceTimeline } from '@/application/use-cases/GetExperienceTimeline';
import {
  SendContactMessage,
  ContactValidationError,
} from '@/application/use-cases/SendContactMessage';
import { Experience } from '@/domain/portfolio/entities/Experience';
import { Project } from '@/domain/portfolio/entities/Project';
import { Skill } from '@/domain/portfolio/entities/Skill';
import type { IExperienceRepository } from '@/domain/portfolio/repositories/IExperienceRepository';
import type { IProjectRepository } from '@/domain/portfolio/repositories/IProjectRepository';
import type { ISkillRepository } from '@/domain/portfolio/repositories/ISkillRepository';
import type { ContactService } from '@/domain/portfolio/services/ContactService';

describe('GetPortfolioData', () => {
  let useCase: GetPortfolioData;
  let mockExperienceRepo: IExperienceRepository;
  let mockProjectRepo: IProjectRepository;
  let mockSkillRepo: ISkillRepository;

  const mockExperience = Experience.create({
    id: 'exp-1',
    company: 'Test Co',
    role: 'Engineer',
    description: ['Test description item'],
    technologies: ['TypeScript'],
    startDate: new Date('2023-01-01'),
    endDate: null,
    location: 'Remote',
    remote: true,
  });

  const mockProject = Project.create({
    id: 'proj-1',
    title: 'Test Project',
    description: 'Test',
    technologies: ['TypeScript'],
    type: 'oss',
    githubUrl: null,
    liveUrl: null,
    image: null,
    featured: true,
  });

  const mockSkill = Skill.create({
    id: 'skill-1',
    name: 'TypeScript',
    category: 'languages',
    proficiency: 'expert',
    icon: null,
    yearsOfExperience: 5,
  });

  beforeEach(() => {
    mockExperienceRepo = {
      findAll: vi.fn().mockResolvedValue([mockExperience]),
      findById: vi.fn(),
      findCurrent: vi.fn().mockResolvedValue(mockExperience),
      findByTechnology: vi.fn(),
    };

    mockProjectRepo = {
      findAll: vi.fn().mockResolvedValue([mockProject]),
      findById: vi.fn(),
      findFeatured: vi.fn().mockResolvedValue([mockProject]),
      findByType: vi.fn(),
      findByTechnology: vi.fn(),
    };

    mockSkillRepo = {
      findAll: vi.fn().mockResolvedValue([mockSkill]),
      findById: vi.fn(),
      findByCategory: vi.fn(),
      findAdvanced: vi.fn().mockResolvedValue([mockSkill]),
      getCategories: vi.fn(),
    };

    useCase = new GetPortfolioData(
      mockExperienceRepo,
      mockProjectRepo,
      mockSkillRepo
    );
  });

  it('should return aggregated portfolio data', async () => {
    const result = await useCase.execute();

    expect(result.experiences).toHaveLength(1);
    expect(result.experiences[0].company).toBe('Test Co');

    expect(result.projects).toHaveLength(1);
    expect(result.projects[0].title).toBe('Test Project');

    expect(result.featuredProjects).toHaveLength(1);

    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].name).toBe('TypeScript');

    expect(result.advancedSkills).toHaveLength(1);

    expect(result.currentExperience).not.toBeNull();
    expect(result.currentExperience?.company).toBe('Test Co');
  });

  it('should handle no current experience', async () => {
    mockExperienceRepo.findCurrent = vi.fn().mockResolvedValue(null);

    const result = await useCase.execute();

    expect(result.currentExperience).toBeNull();
  });

  it('should call all repositories in parallel', async () => {
    await useCase.execute();

    expect(mockExperienceRepo.findAll).toHaveBeenCalled();
    expect(mockProjectRepo.findAll).toHaveBeenCalled();
    expect(mockProjectRepo.findFeatured).toHaveBeenCalled();
    expect(mockSkillRepo.findAll).toHaveBeenCalled();
    expect(mockSkillRepo.findAdvanced).toHaveBeenCalled();
    expect(mockExperienceRepo.findCurrent).toHaveBeenCalled();
  });
});

describe('GetExperienceTimeline', () => {
  let useCase: GetExperienceTimeline;
  let mockExperienceRepo: IExperienceRepository;

  const mockExperiences = [
    Experience.create({
      id: 'exp-1',
      company: 'Current Co',
      role: 'Senior Engineer',
      description: ['Current job responsibilities'],
      technologies: ['TypeScript', 'React'],
      startDate: new Date('2023-01-01'),
      endDate: null,
      location: 'Remote',
      remote: true,
    }),
    Experience.create({
      id: 'exp-2',
      company: 'Past Co',
      role: 'Engineer',
      description: ['Past job responsibilities'],
      technologies: ['Python', 'Django'],
      startDate: new Date('2020-01-01'),
      endDate: new Date('2022-12-31'),
      location: 'Office',
      remote: false,
    }),
  ];

  beforeEach(() => {
    mockExperienceRepo = {
      findAll: vi.fn().mockResolvedValue(mockExperiences),
      findById: vi.fn(),
      findCurrent: vi.fn(),
      findByTechnology: vi.fn(),
    };

    useCase = new GetExperienceTimeline(mockExperienceRepo);
  });

  it('should return timeline with experiences', async () => {
    const result = await useCase.execute();

    expect(result.experiences).toHaveLength(2);
    expect(result.experiences[0].company).toBe('Current Co');
  });

  it('should calculate total years of experience', async () => {
    const result = await useCase.execute();

    expect(result.totalYears).toBeGreaterThan(0);
  });

  it('should collect unique technologies', async () => {
    const result = await useCase.execute();

    expect(result.technologies).toContain('TypeScript');
    expect(result.technologies).toContain('React');
    expect(result.technologies).toContain('Python');
    expect(result.technologies).toContain('Django');
    expect(result.technologies).toEqual(result.technologies.sort());
  });

  it('should handle empty experience list', async () => {
    mockExperienceRepo.findAll = vi.fn().mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.experiences).toHaveLength(0);
    expect(result.totalYears).toBe(0);
    expect(result.technologies).toHaveLength(0);
  });
});

describe('SendContactMessage', () => {
  let useCase: SendContactMessage;
  let mockContactService: ContactService;

  beforeEach(() => {
    mockContactService = {
      submitContactForm: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as ContactService;

    useCase = new SendContactMessage(mockContactService);
  });

  const validInput = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message that is long enough.',
  };

  describe('validation', () => {
    it('should throw error for empty name', async () => {
      await expect(
        useCase.execute({ ...validInput, name: '' })
      ).rejects.toThrow(ContactValidationError);
    });

    it('should throw error for short name', async () => {
      await expect(
        useCase.execute({ ...validInput, name: 'J' })
      ).rejects.toThrow(ContactValidationError);
    });

    it('should throw error for empty email', async () => {
      await expect(
        useCase.execute({ ...validInput, email: '' })
      ).rejects.toThrow(ContactValidationError);
    });

    it('should throw error for invalid email', async () => {
      await expect(
        useCase.execute({ ...validInput, email: 'invalid' })
      ).rejects.toThrow(ContactValidationError);
    });

    it('should throw error for empty subject', async () => {
      await expect(
        useCase.execute({ ...validInput, subject: '' })
      ).rejects.toThrow(ContactValidationError);
    });

    it('should throw error for short subject', async () => {
      await expect(
        useCase.execute({ ...validInput, subject: 'Hi' })
      ).rejects.toThrow(ContactValidationError);
    });

    it('should throw error for empty message', async () => {
      await expect(
        useCase.execute({ ...validInput, message: '' })
      ).rejects.toThrow(ContactValidationError);
    });

    it('should throw error for short message', async () => {
      await expect(
        useCase.execute({ ...validInput, message: 'Too short' })
      ).rejects.toThrow(ContactValidationError);
    });
  });

  describe('successful submission', () => {
    it('should return success result on valid input', async () => {
      const result = await useCase.execute(validInput);

      expect(result.success).toBe(true);
      expect(result.messageId).not.toBeNull();
      expect(result.error).toBeNull();
    });

    it('should call contact service with message', async () => {
      await useCase.execute(validInput);

      expect(mockContactService.submitContactForm).toHaveBeenCalled();
    });
  });

  describe('failed submission', () => {
    it('should return error result on service failure', async () => {
      mockContactService.submitContactForm = vi
        .fn()
        .mockResolvedValue({ success: false, error: 'Service unavailable' });

      const result = await useCase.execute(validInput);

      expect(result.success).toBe(false);
      expect(result.messageId).toBeNull();
      expect(result.error).toBe('Service unavailable');
    });

    it('should handle exception from service', async () => {
      mockContactService.submitContactForm = vi
        .fn()
        .mockRejectedValue(new Error('Network error'));

      const result = await useCase.execute(validInput);

      expect(result.success).toBe(false);
      expect(result.messageId).toBeNull();
      expect(result.error).toBe('Network error');
    });

    it('should handle non-Error exceptions', async () => {
      mockContactService.submitContactForm = vi
        .fn()
        .mockRejectedValue('Unknown error');

      const result = await useCase.execute(validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('An unexpected error occurred');
    });
  });
});
