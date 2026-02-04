import { describe, it, expect, beforeEach } from 'vitest';
import { StaticExperienceRepository } from '@/infrastructure/repositories/StaticExperienceRepository';
import { StaticProjectRepository } from '@/infrastructure/repositories/StaticProjectRepository';
import { StaticSkillRepository } from '@/infrastructure/repositories/StaticSkillRepository';

describe('StaticExperienceRepository', () => {
  let repository: StaticExperienceRepository;

  beforeEach(() => {
    repository = new StaticExperienceRepository();
  });

  describe('findAll', () => {
    it('should return all experiences', async () => {
      const experiences = await repository.findAll();

      expect(experiences.length).toBeGreaterThan(0);
      expect(experiences[0].company).toBeDefined();
    });

    it('should return experiences sorted by date descending', async () => {
      const experiences = await repository.findAll();

      for (let i = 1; i < experiences.length; i++) {
        expect(
          experiences[i - 1].dateRange.start.getTime()
        ).toBeGreaterThanOrEqual(experiences[i].dateRange.start.getTime());
      }
    });
  });

  describe('findById', () => {
    it('should find experience by ID', async () => {
      const experience = await repository.findById('exp-swift');

      expect(experience).not.toBeNull();
      expect(experience?.company).toBe('SWIFT');
    });

    it('should return null for non-existent ID', async () => {
      const experience = await repository.findById('non-existent');

      expect(experience).toBeNull();
    });
  });

  describe('findCurrent', () => {
    it('should find the current experience', async () => {
      const current = await repository.findCurrent();

      expect(current).not.toBeNull();
      expect(current?.isCurrent()).toBe(true);
    });
  });

  describe('findByTechnology', () => {
    it('should find experiences by technology', async () => {
      const experiences = await repository.findByTechnology('Python');

      expect(experiences.length).toBeGreaterThan(0);
      expect(experiences.every(exp => exp.usesTechnology('Python'))).toBe(true);
    });
  });
});

describe('StaticProjectRepository', () => {
  let repository: StaticProjectRepository;

  beforeEach(() => {
    repository = new StaticProjectRepository();
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const projects = await repository.findAll();

      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0].title).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should find project by ID', async () => {
      const project = await repository.findById('proj-commandeft');

      expect(project).not.toBeNull();
      expect(project?.title).toBe('Commandeft');
    });
  });

  describe('findFeatured', () => {
    it('should return only featured projects', async () => {
      const featured = await repository.findFeatured();

      expect(featured.length).toBeGreaterThan(0);
      expect(featured.every(proj => proj.featured)).toBe(true);
    });
  });

  describe('findByType', () => {
    it('should find projects by type', async () => {
      const ossProjects = await repository.findByType('oss');

      expect(ossProjects.length).toBeGreaterThan(0);
      expect(ossProjects.every(proj => proj.isOpenSource())).toBe(true);
    });
  });

  describe('findByTechnology', () => {
    it('should find projects by technology', async () => {
      const projects = await repository.findByTechnology('Python');

      expect(projects.length).toBeGreaterThan(0);
      expect(projects.every(proj => proj.usesTechnology('Python'))).toBe(true);
    });
  });
});

describe('StaticSkillRepository', () => {
  let repository: StaticSkillRepository;

  beforeEach(() => {
    repository = new StaticSkillRepository();
  });

  describe('findAll', () => {
    it('should return all skills', async () => {
      const skills = await repository.findAll();

      expect(skills.length).toBeGreaterThan(0);
      expect(skills[0].name).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should find skill by ID', async () => {
      const skill = await repository.findById('skill-python');

      expect(skill).not.toBeNull();
      expect(skill?.name).toBe('Python');
    });
  });

  describe('findByCategory', () => {
    it('should find skills by category', async () => {
      const languages = await repository.findByCategory('languages');

      expect(languages.length).toBeGreaterThan(0);
      expect(languages.every(skill => skill.category === 'languages')).toBe(
        true
      );
    });
  });

  describe('findAdvanced', () => {
    it('should return only advanced/expert skills', async () => {
      const advanced = await repository.findAdvanced();

      expect(advanced.length).toBeGreaterThan(0);
      expect(advanced.every(skill => skill.isAdvanced())).toBe(true);
    });
  });

  describe('getCategories', () => {
    it('should return unique categories', async () => {
      const categories = await repository.getCategories();

      expect(categories.length).toBeGreaterThan(0);
      expect(new Set(categories).size).toBe(categories.length);
    });

    it('should include expected categories', async () => {
      const categories = await repository.getCategories();

      expect(categories).toContain('languages');
      expect(categories).toContain('bigdata');
      expect(categories).toContain('devops');
    });
  });
});
