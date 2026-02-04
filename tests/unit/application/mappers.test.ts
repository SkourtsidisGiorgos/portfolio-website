import { describe, it, expect } from 'vitest';
import { ExperienceMapper } from '@/application/mappers/ExperienceMapper';
import { ProjectMapper } from '@/application/mappers/ProjectMapper';
import { SkillMapper } from '@/application/mappers/SkillMapper';
import { Experience } from '@/domain/portfolio/entities/Experience';
import { Project } from '@/domain/portfolio/entities/Project';
import { Skill } from '@/domain/portfolio/entities/Skill';

describe('ExperienceMapper', () => {
  const createExperience = () =>
    Experience.create({
      id: 'exp-1',
      company: 'Test Company',
      role: 'Software Engineer',
      description: ['Building things', 'Leading teams'],
      technologies: ['TypeScript', 'React'],
      startDate: new Date('2023-01-15'),
      endDate: null,
      location: 'San Francisco',
      remote: true,
    });

  describe('toDTO', () => {
    it('should map experience entity to DTO', () => {
      const experience = createExperience();
      const dto = ExperienceMapper.toDTO(experience);

      expect(dto.id).toBe('exp-1');
      expect(dto.company).toBe('Test Company');
      expect(dto.role).toBe('Software Engineer');
      expect(dto.description).toEqual(['Building things', 'Leading teams']);
      expect(dto.technologies).toEqual(['TypeScript', 'React']);
      expect(dto.location).toBe('San Francisco');
      expect(dto.locationDisplay).toBe('San Francisco (Remote)');
      expect(dto.remote).toBe(true);
      expect(dto.isCurrent).toBe(true);
    });

    it('should format dates correctly', () => {
      const experience = createExperience();
      const dto = ExperienceMapper.toDTO(experience);

      expect(dto.startDate).toBe(new Date('2023-01-15').toISOString());
      expect(dto.endDate).toBeNull();
      expect(dto.formattedDateRange).toContain('Jan 2023');
      expect(dto.formattedDateRange).toContain('Present');
    });

    it('should handle non-current experience', () => {
      const experience = Experience.create({
        id: 'exp-2',
        company: 'Past Company',
        role: 'Developer',
        description: ['Did stuff'],
        technologies: ['Python'],
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-12-31'),
        location: 'New York',
        remote: false,
      });

      const dto = ExperienceMapper.toDTO(experience);

      expect(dto.isCurrent).toBe(false);
      expect(dto.endDate).toBe(new Date('2022-12-31').toISOString());
      expect(dto.location).toBe('New York');
      expect(dto.locationDisplay).toBe('New York');
      expect(dto.remote).toBe(false);
    });
  });

  describe('toDTOList', () => {
    it('should map list of experiences to DTOs', () => {
      const experiences = [createExperience(), createExperience()];
      const dtos = ExperienceMapper.toDTOList(experiences);

      expect(dtos).toHaveLength(2);
      expect(dtos[0].company).toBe('Test Company');
    });

    it('should return empty array for empty input', () => {
      const dtos = ExperienceMapper.toDTOList([]);
      expect(dtos).toEqual([]);
    });
  });
});

describe('ProjectMapper', () => {
  const createProject = () =>
    Project.create({
      id: 'proj-1',
      title: 'Test Project',
      description: 'A test project',
      technologies: ['TypeScript', 'Node.js'],
      type: 'oss',
      githubUrl: 'https://github.com/test/project',
      liveUrl: 'https://example.com',
      image: '/images/test.png',
      featured: true,
    });

  describe('toDTO', () => {
    it('should map project entity to DTO', () => {
      const project = createProject();
      const dto = ProjectMapper.toDTO(project);

      expect(dto.id).toBe('proj-1');
      expect(dto.title).toBe('Test Project');
      expect(dto.description).toBe('A test project');
      expect(dto.technologies).toEqual(['TypeScript', 'Node.js']);
      expect(dto.type).toBe('oss');
      expect(dto.githubUrl).toBe('https://github.com/test/project');
      expect(dto.liveUrl).toBe('https://example.com');
      expect(dto.image).toBe('/images/test.png');
      expect(dto.featured).toBe(true);
    });

    it('should add type label', () => {
      const project = createProject();
      const dto = ProjectMapper.toDTO(project);

      expect(dto.typeLabel).toBe('Open Source');
    });

    it('should calculate isOpenSource', () => {
      const ossProject = createProject();
      const professionalProject = Project.create({
        id: 'proj-2',
        title: 'Work Project',
        description: 'Professional work',
        technologies: ['Java'],
        type: 'professional',
        githubUrl: null,
        liveUrl: null,
        image: null,
        featured: false,
      });

      expect(ProjectMapper.toDTO(ossProject).isOpenSource).toBe(true);
      expect(ProjectMapper.toDTO(professionalProject).isOpenSource).toBe(false);
    });

    it('should handle null URLs and images', () => {
      const project = Project.create({
        id: 'proj-3',
        title: 'Minimal Project',
        description: 'No extras',
        technologies: ['HTML'],
        type: 'personal',
        githubUrl: null,
        liveUrl: null,
        image: null,
        featured: false,
      });

      const dto = ProjectMapper.toDTO(project);

      expect(dto.githubUrl).toBeNull();
      expect(dto.liveUrl).toBeNull();
      expect(dto.image).toBeNull();
      expect(dto.typeLabel).toBe('Personal');
    });
  });

  describe('toDTOList', () => {
    it('should map list of projects to DTOs', () => {
      const projects = [createProject(), createProject()];
      const dtos = ProjectMapper.toDTOList(projects);

      expect(dtos).toHaveLength(2);
      expect(dtos[0].title).toBe('Test Project');
    });
  });
});

describe('SkillMapper', () => {
  const createSkill = () =>
    Skill.create({
      id: 'skill-1',
      name: 'TypeScript',
      category: 'languages',
      proficiency: 'expert',
      icon: 'typescript.svg',
      yearsOfExperience: 5,
    });

  describe('toDTO', () => {
    it('should map skill entity to DTO', () => {
      const skill = createSkill();
      const dto = SkillMapper.toDTO(skill);

      expect(dto.id).toBe('skill-1');
      expect(dto.name).toBe('TypeScript');
      expect(dto.category).toBe('languages');
      expect(dto.proficiency).toBe('expert');
      expect(dto.icon).toBe('typescript.svg');
      expect(dto.yearsOfExperience).toBe(5);
    });

    it('should add category label', () => {
      const skill = createSkill();
      const dto = SkillMapper.toDTO(skill);

      expect(dto.categoryLabel).toBe('Programming Languages');
    });

    it('should add proficiency label and percentage', () => {
      const expertSkill = createSkill();
      const beginnerSkill = Skill.create({
        id: 'skill-2',
        name: 'Rust',
        category: 'languages',
        proficiency: 'beginner',
        icon: null,
        yearsOfExperience: 1,
      });

      const expertDTO = SkillMapper.toDTO(expertSkill);
      const beginnerDTO = SkillMapper.toDTO(beginnerSkill);

      expect(expertDTO.proficiencyLabel).toBe('Expert');
      expect(expertDTO.proficiencyPercentage).toBe(100);
      expect(beginnerDTO.proficiencyLabel).toBe('Beginner');
      expect(beginnerDTO.proficiencyPercentage).toBe(25);
    });

    it('should calculate isAdvanced', () => {
      const expertSkill = createSkill();
      const intermediateSkill = Skill.create({
        id: 'skill-3',
        name: 'Go',
        category: 'languages',
        proficiency: 'intermediate',
        icon: null,
        yearsOfExperience: 2,
      });

      expect(SkillMapper.toDTO(expertSkill).isAdvanced).toBe(true);
      expect(SkillMapper.toDTO(intermediateSkill).isAdvanced).toBe(false);
    });

    it('should handle all category labels', () => {
      const categories = [
        { category: 'languages', label: 'Programming Languages' },
        { category: 'bigdata', label: 'Big Data & Processing' },
        { category: 'devops', label: 'DevOps & Cloud' },
        { category: 'aiml', label: 'AI & Machine Learning' },
        { category: 'databases', label: 'Databases' },
        { category: 'backend', label: 'Backend & APIs' },
      ] as const;

      for (const { category, label } of categories) {
        const skill = Skill.create({
          id: `skill-${category}`,
          name: 'Test',
          category,
          proficiency: 'intermediate',
          icon: null,
          yearsOfExperience: 1,
        });

        expect(SkillMapper.toDTO(skill).categoryLabel).toBe(label);
      }
    });

    it('should handle all proficiency labels', () => {
      const proficiencies = [
        { proficiency: 'beginner', label: 'Beginner', percentage: 25 },
        { proficiency: 'intermediate', label: 'Intermediate', percentage: 50 },
        { proficiency: 'advanced', label: 'Advanced', percentage: 75 },
        { proficiency: 'expert', label: 'Expert', percentage: 100 },
      ] as const;

      for (const { proficiency, label, percentage } of proficiencies) {
        const skill = Skill.create({
          id: `skill-${proficiency}`,
          name: 'Test',
          category: 'languages',
          proficiency,
          icon: null,
          yearsOfExperience: 1,
        });

        const dto = SkillMapper.toDTO(skill);
        expect(dto.proficiencyLabel).toBe(label);
        expect(dto.proficiencyPercentage).toBe(percentage);
      }
    });
  });

  describe('toDTOList', () => {
    it('should map list of skills to DTOs', () => {
      const skills = [createSkill(), createSkill()];
      const dtos = SkillMapper.toDTOList(skills);

      expect(dtos).toHaveLength(2);
      expect(dtos[0].name).toBe('TypeScript');
    });
  });
});
