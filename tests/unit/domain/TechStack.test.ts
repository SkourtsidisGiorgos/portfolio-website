import { describe, it, expect } from 'vitest';
import { TechStack } from '@/domain/portfolio/value-objects/TechStack';

describe('TechStack', () => {
  describe('create', () => {
    it('should create a tech stack from array', () => {
      const stack = TechStack.create(['Python', 'Java', 'TypeScript']);
      expect(stack.count).toBe(3);
    });

    it('should remove duplicates', () => {
      const stack = TechStack.create(['Python', 'Java', 'Python']);
      expect(stack.count).toBe(2);
    });

    it('should remove empty strings', () => {
      const stack = TechStack.create(['Python', '', 'Java', '  ']);
      expect(stack.count).toBe(2);
    });

    it('should throw for empty array', () => {
      expect(() => TechStack.create([])).toThrow(
        'TechStack must contain at least one technology'
      );
    });

    it('should throw for array with only empty strings', () => {
      expect(() => TechStack.create(['', '  '])).toThrow(
        'TechStack must contain at least one valid technology'
      );
    });
  });

  describe('contains', () => {
    it('should return true for existing technology', () => {
      const stack = TechStack.create(['Python', 'Java']);
      expect(stack.contains('Python')).toBe(true);
    });

    it('should be case insensitive', () => {
      const stack = TechStack.create(['Python', 'Java']);
      expect(stack.contains('python')).toBe(true);
      expect(stack.contains('PYTHON')).toBe(true);
    });

    it('should return false for non-existing technology', () => {
      const stack = TechStack.create(['Python', 'Java']);
      expect(stack.contains('Ruby')).toBe(false);
    });
  });

  describe('hasAny', () => {
    it('should return true if any technology exists', () => {
      const stack = TechStack.create(['Python', 'Java']);
      expect(stack.hasAny(['Ruby', 'Python'])).toBe(true);
    });

    it('should return false if no technology exists', () => {
      const stack = TechStack.create(['Python', 'Java']);
      expect(stack.hasAny(['Ruby', 'Go'])).toBe(false);
    });
  });

  describe('hasAll', () => {
    it('should return true if all technologies exist', () => {
      const stack = TechStack.create(['Python', 'Java', 'TypeScript']);
      expect(stack.hasAll(['Python', 'Java'])).toBe(true);
    });

    it('should return false if not all technologies exist', () => {
      const stack = TechStack.create(['Python', 'Java']);
      expect(stack.hasAll(['Python', 'Ruby'])).toBe(false);
    });
  });

  describe('merge', () => {
    it('should merge two tech stacks', () => {
      const stack1 = TechStack.create(['Python', 'Java']);
      const stack2 = TechStack.create(['TypeScript', 'Go']);
      const merged = stack1.merge(stack2);
      expect(merged.count).toBe(4);
      expect(merged.contains('Python')).toBe(true);
      expect(merged.contains('Go')).toBe(true);
    });

    it('should remove duplicates when merging', () => {
      const stack1 = TechStack.create(['Python', 'Java']);
      const stack2 = TechStack.create(['Java', 'Go']);
      const merged = stack1.merge(stack2);
      expect(merged.count).toBe(3);
    });
  });

  describe('toString', () => {
    it('should return comma-separated string', () => {
      const stack = TechStack.create(['Python', 'Java', 'TypeScript']);
      expect(stack.toString()).toBe('Python, Java, TypeScript');
    });
  });

  describe('equals', () => {
    it('should return true for equal stacks', () => {
      const stack1 = TechStack.create(['Python', 'Java']);
      const stack2 = TechStack.create(['Java', 'Python']);
      expect(stack1.equals(stack2)).toBe(true);
    });

    it('should return false for different stacks', () => {
      const stack1 = TechStack.create(['Python', 'Java']);
      const stack2 = TechStack.create(['Python', 'Ruby']);
      expect(stack1.equals(stack2)).toBe(false);
    });
  });
});
