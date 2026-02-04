import { describe, it, expect } from 'vitest';
import { Skill } from '@/domain/portfolio/entities/Skill';

describe('Skill', () => {
  const validProps = {
    id: 'skill-1',
    name: 'Python',
    category: 'languages' as const,
    proficiency: 'expert' as const,
    yearsOfExperience: 5,
  };

  describe('create', () => {
    it('should create a skill with valid props', () => {
      const skill = Skill.create(validProps);
      expect(skill.id).toBe('skill-1');
      expect(skill.name).toBe('Python');
      expect(skill.category).toBe('languages');
    });

    it('should throw for missing ID', () => {
      expect(() => Skill.create({ ...validProps, id: '' })).toThrow(
        'Skill ID is required'
      );
    });

    it('should throw for missing name', () => {
      expect(() => Skill.create({ ...validProps, name: '' })).toThrow(
        'Skill name is required'
      );
    });

    it('should throw for negative years of experience', () => {
      expect(() =>
        Skill.create({ ...validProps, yearsOfExperience: -1 })
      ).toThrow('Years of experience cannot be negative');
    });

    it('should default proficiency to intermediate', () => {
      const { proficiency: _proficiency, ...propsWithoutProficiency } =
        validProps;
      const skill = Skill.create(propsWithoutProficiency);
      expect(skill.proficiency).toBe('intermediate');
    });

    it('should default yearsOfExperience to 0', () => {
      const { yearsOfExperience: _yoe, ...propsWithoutYOE } = validProps;
      const skill = Skill.create(propsWithoutYOE);
      expect(skill.yearsOfExperience).toBe(0);
    });
  });

  describe('getProficiencyLevel', () => {
    it('should return 1 for beginner', () => {
      const skill = Skill.create({ ...validProps, proficiency: 'beginner' });
      expect(skill.getProficiencyLevel()).toBe(1);
    });

    it('should return 2 for intermediate', () => {
      const skill = Skill.create({
        ...validProps,
        proficiency: 'intermediate',
      });
      expect(skill.getProficiencyLevel()).toBe(2);
    });

    it('should return 3 for advanced', () => {
      const skill = Skill.create({ ...validProps, proficiency: 'advanced' });
      expect(skill.getProficiencyLevel()).toBe(3);
    });

    it('should return 4 for expert', () => {
      const skill = Skill.create(validProps);
      expect(skill.getProficiencyLevel()).toBe(4);
    });
  });

  describe('getProficiencyPercentage', () => {
    it('should return correct percentage', () => {
      const skill = Skill.create(validProps);
      expect(skill.getProficiencyPercentage()).toBe(100);
    });

    it('should return 50 for intermediate', () => {
      const skill = Skill.create({
        ...validProps,
        proficiency: 'intermediate',
      });
      expect(skill.getProficiencyPercentage()).toBe(50);
    });
  });

  describe('isExpert', () => {
    it('should return true for expert proficiency', () => {
      const skill = Skill.create(validProps);
      expect(skill.isExpert()).toBe(true);
    });

    it('should return false for non-expert', () => {
      const skill = Skill.create({ ...validProps, proficiency: 'advanced' });
      expect(skill.isExpert()).toBe(false);
    });
  });

  describe('isAdvanced', () => {
    it('should return true for advanced proficiency', () => {
      const skill = Skill.create({ ...validProps, proficiency: 'advanced' });
      expect(skill.isAdvanced()).toBe(true);
    });

    it('should return true for expert proficiency', () => {
      const skill = Skill.create(validProps);
      expect(skill.isAdvanced()).toBe(true);
    });

    it('should return false for intermediate', () => {
      const skill = Skill.create({
        ...validProps,
        proficiency: 'intermediate',
      });
      expect(skill.isAdvanced()).toBe(false);
    });
  });

  describe('getCategoryLabel', () => {
    it('should return correct label for languages', () => {
      const skill = Skill.create(validProps);
      expect(skill.getCategoryLabel()).toBe('Languages');
    });

    it('should return correct label for bigdata', () => {
      const skill = Skill.create({ ...validProps, category: 'bigdata' });
      expect(skill.getCategoryLabel()).toBe('Big Data');
    });

    it('should return correct label for aiml', () => {
      const skill = Skill.create({ ...validProps, category: 'aiml' });
      expect(skill.getCategoryLabel()).toBe('AI/ML');
    });
  });
});
