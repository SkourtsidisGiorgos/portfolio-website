import { describe, it, expect } from 'vitest';
import { DateRange } from '@/domain/portfolio/value-objects/DateRange';

describe('DateRange', () => {
  describe('create', () => {
    it('should create a date range with start and end dates', () => {
      const range = DateRange.create('2021-05-01', '2023-10-31');
      expect(range.start).toBeInstanceOf(Date);
      expect(range.end).toBeInstanceOf(Date);
    });

    it('should create a date range with null end (current)', () => {
      const range = DateRange.create('2023-11-01', null);
      expect(range.start).toBeInstanceOf(Date);
      expect(range.end).toBeNull();
    });

    it('should accept Date objects', () => {
      const start = new Date('2021-05-01');
      const end = new Date('2023-10-31');
      const range = DateRange.create(start, end);
      expect(range.start.getTime()).toBe(start.getTime());
    });

    it('should throw if end date is before start date', () => {
      expect(() => DateRange.create('2023-10-31', '2021-05-01')).toThrow(
        'End date must be after start date'
      );
    });
  });

  describe('isCurrent', () => {
    it('should return true for null end date', () => {
      const range = DateRange.create('2023-11-01', null);
      expect(range.isCurrent()).toBe(true);
    });

    it('should return false for non-null end date', () => {
      const range = DateRange.create('2021-05-01', '2023-10-31');
      expect(range.isCurrent()).toBe(false);
    });
  });

  describe('getDurationInMonths', () => {
    it('should calculate duration correctly', () => {
      const range = DateRange.create('2021-01-01', '2023-01-01');
      expect(range.getDurationInMonths()).toBe(24);
    });

    it('should handle partial months', () => {
      const range = DateRange.create('2021-01-01', '2021-06-01');
      expect(range.getDurationInMonths()).toBe(5);
    });
  });

  describe('formatDuration', () => {
    it('should format years and months', () => {
      const range = DateRange.create('2021-05-01', '2023-10-01');
      expect(range.formatDuration()).toBe('2 years, 5 months');
    });

    it('should handle months only', () => {
      const range = DateRange.create('2023-06-01', '2023-10-01');
      expect(range.formatDuration()).toBe('4 months');
    });

    it('should handle exact years', () => {
      const range = DateRange.create('2021-01-01', '2023-01-01');
      expect(range.formatDuration()).toBe('2 years');
    });

    it('should handle singular forms', () => {
      const range = DateRange.create('2023-01-01', '2023-02-01');
      expect(range.formatDuration()).toBe('1 month');
    });
  });

  describe('format', () => {
    it('should format date range with end date', () => {
      const range = DateRange.create('2021-05-01', '2023-10-31');
      expect(range.format()).toMatch(/May 2021 - Oct 2023/);
    });

    it('should format date range with Present', () => {
      const range = DateRange.create('2023-11-01', null);
      expect(range.format()).toMatch(/Nov 2023 - Present/);
    });
  });

  describe('equals', () => {
    it('should return true for equal ranges', () => {
      const range1 = DateRange.create('2021-05-01', '2023-10-31');
      const range2 = DateRange.create('2021-05-01', '2023-10-31');
      expect(range1.equals(range2)).toBe(true);
    });

    it('should return false for different ranges', () => {
      const range1 = DateRange.create('2021-05-01', '2023-10-31');
      const range2 = DateRange.create('2021-06-01', '2023-10-31');
      expect(range1.equals(range2)).toBe(false);
    });

    it('should handle null end dates', () => {
      const range1 = DateRange.create('2023-11-01', null);
      const range2 = DateRange.create('2023-11-01', null);
      expect(range1.equals(range2)).toBe(true);
    });
  });
});
