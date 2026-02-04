import { describe, it, expect } from 'vitest';
import { Experience } from '@/domain/portfolio/entities/Experience';

describe('Experience', () => {
  const validProps = {
    id: 'exp-1',
    company: 'SWIFT',
    role: 'Big Data Engineer',
    startDate: '2023-11-01',
    endDate: null,
    location: 'Belgium',
    remote: true,
    description: ['Built ETL pipelines', 'Worked with Kubernetes'],
    technologies: ['Python', 'Spark', 'Kubernetes'],
  };

  describe('create', () => {
    it('should create an experience with valid props', () => {
      const experience = Experience.create(validProps);
      expect(experience.id).toBe('exp-1');
      expect(experience.company).toBe('SWIFT');
      expect(experience.role).toBe('Big Data Engineer');
    });

    it('should throw for missing ID', () => {
      expect(() => Experience.create({ ...validProps, id: '' })).toThrow(
        'Experience ID is required'
      );
    });

    it('should throw for missing company', () => {
      expect(() => Experience.create({ ...validProps, company: '' })).toThrow(
        'Company name is required'
      );
    });

    it('should throw for missing role', () => {
      expect(() => Experience.create({ ...validProps, role: '' })).toThrow(
        'Role is required'
      );
    });

    it('should throw for missing location', () => {
      expect(() => Experience.create({ ...validProps, location: '' })).toThrow(
        'Location is required'
      );
    });

    it('should throw for empty description', () => {
      expect(() =>
        Experience.create({ ...validProps, description: [] })
      ).toThrow('At least one description item is required');
    });

    it('should default remote to false', () => {
      const { remote: _remote, ...propsWithoutRemote } = validProps;
      const experience = Experience.create(propsWithoutRemote);
      expect(experience.remote).toBe(false);
    });
  });

  describe('isCurrent', () => {
    it('should return true for null end date', () => {
      const experience = Experience.create(validProps);
      expect(experience.isCurrent()).toBe(true);
    });

    it('should return false for non-null end date', () => {
      const experience = Experience.create({
        ...validProps,
        endDate: '2024-05-31',
      });
      expect(experience.isCurrent()).toBe(false);
    });
  });

  describe('getLocationDisplay', () => {
    it('should return location with Remote suffix', () => {
      const experience = Experience.create(validProps);
      expect(experience.getLocationDisplay()).toBe('Belgium (Remote)');
    });

    it('should return just location when not remote', () => {
      const experience = Experience.create({ ...validProps, remote: false });
      expect(experience.getLocationDisplay()).toBe('Belgium');
    });
  });

  describe('usesTechnology', () => {
    it('should return true for used technology', () => {
      const experience = Experience.create(validProps);
      expect(experience.usesTechnology('Python')).toBe(true);
    });

    it('should return false for unused technology', () => {
      const experience = Experience.create(validProps);
      expect(experience.usesTechnology('Ruby')).toBe(false);
    });
  });

  describe('getDuration', () => {
    it('should return formatted duration', () => {
      const experience = Experience.create({
        ...validProps,
        startDate: '2021-01-01',
        endDate: '2023-01-01',
      });
      expect(experience.getDuration()).toBe('2 years');
    });
  });
});
