import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateRange,
  calculateDuration,
  truncate,
  capitalize,
  toTitleCase,
  slugify,
} from '@/shared/utils/formatters';

describe('formatDate', () => {
  it('should format a Date object', () => {
    const date = new Date('2023-06-15');
    expect(formatDate(date)).toBe('June 2023');
  });

  it('should format a date string', () => {
    expect(formatDate('2023-06-15')).toBe('June 2023');
  });

  it('should accept custom options', () => {
    const date = new Date('2023-06-15');
    expect(
      formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' })
    ).toBe('Jun 15, 2023');
  });
});

describe('formatDateRange', () => {
  it('should format a date range with end date', () => {
    const result = formatDateRange('2021-05-01', '2023-10-31');
    expect(result).toBe('May 2021 - Oct 2023');
  });

  it('should show Present for null end date', () => {
    const result = formatDateRange('2023-11-01', null);
    expect(result).toBe('Nov 2023 - Present');
  });
});

describe('calculateDuration', () => {
  it('should calculate duration in years and months', () => {
    const result = calculateDuration('2021-05-01', '2023-10-31');
    expect(result).toBe('2 years, 5 months');
  });

  it('should handle duration less than a year', () => {
    const result = calculateDuration('2023-06-01', '2023-10-31');
    expect(result).toBe('4 months');
  });

  it('should handle exact years', () => {
    const result = calculateDuration('2021-01-01', '2023-01-01');
    expect(result).toBe('2 years');
  });

  it('should handle single month', () => {
    const result = calculateDuration('2023-06-01', '2023-07-01');
    expect(result).toBe('1 month');
  });

  it('should handle single year', () => {
    const result = calculateDuration('2022-01-01', '2023-01-01');
    expect(result).toBe('1 year');
  });
});

describe('truncate', () => {
  it('should truncate long text', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...');
  });

  it('should not truncate short text', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('should handle exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });
});

describe('capitalize', () => {
  it('should capitalize the first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('should handle already capitalized', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle single character', () => {
    expect(capitalize('h')).toBe('H');
  });
});

describe('toTitleCase', () => {
  it('should convert to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('should handle uppercase input', () => {
    expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('should handle mixed case', () => {
    expect(toTitleCase('hElLo WoRlD')).toBe('Hello World');
  });
});

describe('slugify', () => {
  it('should create a slug from text', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify("Hello World! It's great")).toBe('hello-world-its-great');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('should trim leading/trailing hyphens', () => {
    expect(slugify(' Hello World ')).toBe('hello-world');
  });

  it('should handle underscores', () => {
    expect(slugify('hello_world_test')).toBe('hello-world-test');
  });
});
