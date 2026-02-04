import { describe, it, expect } from 'vitest';
import { AboutConfig } from '../domain/AboutConfig';
import { AboutMetric } from '../domain/AboutMetric';

describe('AboutConfig', () => {
  describe('default()', () => {
    it('creates valid default configuration', () => {
      const config = AboutConfig.default();

      expect(config.profile.name).toBe('Giorgos Skourtsidis');
      expect(config.profile.title).toBe('Big Data & Software Engineer');
    });

    it('includes default metrics', () => {
      const config = AboutConfig.default();
      const metrics = config.getMetrics();

      expect(metrics.length).toBe(4);
      expect(metrics[0].label).toBe('Years Experience');
      expect(metrics[1].label).toBe('Projects Delivered');
      expect(metrics[2].label).toBe('Technologies');
      expect(metrics[3].label).toBe('Open Source');
    });

    it('includes default highlights', () => {
      const config = AboutConfig.default();
      const highlights = config.getHighlights();

      expect(highlights.length).toBe(2);
      expect(highlights[0].title).toBe('Current Focus');
      expect(highlights[1].title).toBe('Location');
    });

    it('includes social links', () => {
      const config = AboutConfig.default();
      const profile = config.getProfileInfo();

      expect(profile.social.github).toContain('github.com');
      expect(profile.social.linkedin).toContain('linkedin.com');
    });
  });

  describe('minimal()', () => {
    it('creates reduced configuration', () => {
      const config = AboutConfig.minimal();

      expect(config.getMetrics().length).toBe(2);
      expect(config.getHighlights().length).toBe(0);
    });

    it('has basic profile info', () => {
      const config = AboutConfig.minimal();

      expect(config.profile.name).toBe('Giorgos Skourtsidis');
      expect(config.profile.summary).toBeDefined();
    });
  });

  describe('fromData()', () => {
    it('creates config from raw data', () => {
      const data = {
        profile: {
          name: 'Test User',
          title: 'Developer',
          location: 'Test City',
          availability: 'Full-time',
          summary: 'Test summary',
          social: {},
        },
        metrics: [AboutMetric.yearsExperience(5)],
        highlights: [
          { id: '1', title: 'Test', content: 'Content', icon: 'star' as const },
        ],
      };

      const config = AboutConfig.fromData(data);

      expect(config.profile.name).toBe('Test User');
      expect(config.getMetrics().length).toBe(1);
      expect(config.getHighlights().length).toBe(1);
    });
  });

  describe('getters', () => {
    it('getMetrics() returns metrics array', () => {
      const config = AboutConfig.default();
      const metrics = config.getMetrics();

      expect(Array.isArray(metrics)).toBe(true);
      metrics.forEach(metric => {
        expect(metric).toBeInstanceOf(AboutMetric);
      });
    });

    it('getProfileInfo() returns profile', () => {
      const config = AboutConfig.default();
      const profile = config.getProfileInfo();

      expect(profile.name).toBeDefined();
      expect(profile.title).toBeDefined();
    });

    it('getHighlights() returns highlights array', () => {
      const config = AboutConfig.default();
      const highlights = config.getHighlights();

      expect(Array.isArray(highlights)).toBe(true);
    });
  });

  describe('immutability', () => {
    it('withProfile returns new config', () => {
      const original = AboutConfig.default();
      const newProfile = {
        ...original.profile,
        name: 'New Name',
      };
      const updated = original.withProfile(newProfile);

      expect(original.profile.name).toBe('Giorgos Skourtsidis');
      expect(updated.profile.name).toBe('New Name');
      expect(original).not.toBe(updated);
    });

    it('withMetric returns new config with added metric', () => {
      const original = AboutConfig.default();
      const newMetric = AboutMetric.create({
        value: '100%',
        label: 'Satisfaction',
        icon: 'star',
      });
      const updated = original.withMetric(newMetric);

      expect(original.getMetrics().length).toBe(4);
      expect(updated.getMetrics().length).toBe(5);
    });

    it('withHighlight returns new config with added highlight', () => {
      const original = AboutConfig.default();
      const newHighlight = {
        id: 'new',
        title: 'New Highlight',
        content: 'Content',
        icon: 'trophy' as const,
      };
      const updated = original.withHighlight(newHighlight);

      expect(original.getHighlights().length).toBe(2);
      expect(updated.getHighlights().length).toBe(3);
    });
  });

  describe('serialization', () => {
    it('toJSON() returns plain object', () => {
      const config = AboutConfig.default();
      const json = config.toJSON();

      expect(json.profile).toBeDefined();
      expect(json.metrics).toBeDefined();
      expect(json.highlights).toBeDefined();
    });
  });
});
