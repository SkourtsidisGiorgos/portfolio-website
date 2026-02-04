import { describe, it, expect } from 'vitest';
import { AboutMetric } from '../domain/AboutMetric';
import type { AboutMetricIcon } from '../domain/AboutMetric';

describe('AboutMetric', () => {
  describe('create()', () => {
    it('creates a metric with valid data', () => {
      const metric = AboutMetric.create({
        value: '4+',
        label: 'Years Experience',
        icon: 'clock',
      });

      expect(metric.value).toBe('4+');
      expect(metric.label).toBe('Years Experience');
      expect(metric.icon).toBe('clock');
    });

    it('creates a metric with optional description', () => {
      const metric = AboutMetric.create({
        value: 100,
        label: 'Projects',
        icon: 'folder',
        description: 'Completed projects',
      });

      expect(metric.description).toBe('Completed projects');
    });

    it('throws for missing value', () => {
      expect(() =>
        AboutMetric.create({
          value: '',
          label: 'Label',
          icon: 'clock',
        })
      ).toThrow('Value is required');
    });

    it('throws for missing label', () => {
      expect(() =>
        AboutMetric.create({
          value: '10',
          label: '',
          icon: 'clock',
        })
      ).toThrow('Label is required');
    });

    it('accepts numeric values', () => {
      const metric = AboutMetric.create({
        value: 42,
        label: 'Answer',
        icon: 'star',
      });

      expect(metric.value).toBe(42);
      expect(metric.numericValue).toBe(42);
    });

    it('parses numeric value from string', () => {
      const metric = AboutMetric.create({
        value: '15+',
        label: 'Projects',
        icon: 'folder',
      });

      expect(metric.numericValue).toBe(15);
    });
  });

  describe('factory methods', () => {
    it('yearsExperience() creates formatted metric', () => {
      const metric = AboutMetric.yearsExperience(4);

      expect(metric.value).toBe('4+');
      expect(metric.label).toBe('Years Experience');
      expect(metric.icon).toBe('clock');
      expect(metric.numericValue).toBe(4);
    });

    it('projectCount() creates formatted metric', () => {
      const metric = AboutMetric.projectCount(15);

      expect(metric.value).toBe('15+');
      expect(metric.label).toBe('Projects Delivered');
      expect(metric.icon).toBe('folder');
      expect(metric.numericValue).toBe(15);
    });

    it('techCount() creates formatted metric', () => {
      const metric = AboutMetric.techCount(25);

      expect(metric.value).toBe('25+');
      expect(metric.label).toBe('Technologies');
      expect(metric.icon).toBe('code');
      expect(metric.numericValue).toBe(25);
    });

    it('contributions() creates formatted metric', () => {
      const metric = AboutMetric.contributions();

      expect(metric.value).toBe('Active');
      expect(metric.label).toBe('Open Source');
      expect(metric.icon).toBe('github');
    });
  });

  describe('immutability', () => {
    it('returns a new instance with updated value', () => {
      const original = AboutMetric.create({
        value: '10',
        label: 'Test',
        icon: 'star',
      });

      const updated = original.withValue('20');

      expect(original.value).toBe('10');
      expect(updated.value).toBe('20');
      expect(original).not.toBe(updated);
    });

    it('returns a new instance with updated label', () => {
      const original = AboutMetric.create({
        value: '10',
        label: 'Original',
        icon: 'star',
      });

      const updated = original.withLabel('Updated');

      expect(original.label).toBe('Original');
      expect(updated.label).toBe('Updated');
    });
  });

  describe('equals()', () => {
    it('returns true for equal metrics', () => {
      const metric1 = AboutMetric.create({
        value: '10',
        label: 'Test',
        icon: 'star',
      });
      const metric2 = AboutMetric.create({
        value: '10',
        label: 'Test',
        icon: 'star',
      });

      expect(metric1.equals(metric2)).toBe(true);
    });

    it('returns false for different metrics', () => {
      const metric1 = AboutMetric.create({
        value: '10',
        label: 'Test',
        icon: 'star',
      });
      const metric2 = AboutMetric.create({
        value: '20',
        label: 'Test',
        icon: 'star',
      });

      expect(metric1.equals(metric2)).toBe(false);
    });
  });

  describe('icon types', () => {
    it('accepts all valid icon types', () => {
      const icons: AboutMetricIcon[] = [
        'clock',
        'folder',
        'code',
        'github',
        'star',
        'trophy',
        'graduation',
        'location',
      ];

      icons.forEach(icon => {
        const metric = AboutMetric.create({
          value: '1',
          label: 'Test',
          icon,
        });
        expect(metric.icon).toBe(icon);
      });
    });
  });
});
