import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useExperienceTimeline } from '../useExperienceTimeline';

// Mock usePerformanceMode hook
vi.mock('@/presentation/three/hooks/usePerformanceMode', () => ({
  usePerformanceMode: () => ({
    quality: 'high' as const,
    isMobile: false,
  }),
}));

describe('useExperienceTimeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('data loading', () => {
    it('should load experiences from data file', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      expect(result.current.experiences).toBeDefined();
      expect(result.current.experiences.length).toBeGreaterThan(0);
    });

    it('should have all required DTO fields', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      const exp = result.current.experiences[0];
      expect(exp).toHaveProperty('id');
      expect(exp).toHaveProperty('company');
      expect(exp).toHaveProperty('role');
      expect(exp).toHaveProperty('description');
      expect(exp).toHaveProperty('technologies');
      expect(exp).toHaveProperty('formattedDateRange');
      expect(exp).toHaveProperty('duration');
      expect(exp).toHaveProperty('isCurrent');
    });
  });

  describe('computed values', () => {
    it('should calculate total years of experience', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      expect(result.current.totalYears).toBeGreaterThan(0);
    });

    it('should extract unique technologies', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      expect(result.current.technologies).toBeDefined();
      expect(result.current.technologies.length).toBeGreaterThan(0);
      // Should be unique
      const unique = new Set(result.current.technologies);
      expect(unique.size).toBe(result.current.technologies.length);
    });
  });

  describe('selection state', () => {
    it('should have null selected experience initially', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      expect(result.current.selectedExperience).toBeNull();
    });

    it('should update selected experience when set', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      act(() => {
        result.current.setSelectedExperience(result.current.experiences[0]);
      });

      expect(result.current.selectedExperience).toBe(
        result.current.experiences[0]
      );
    });

    it('should clear selected experience when set to null', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      act(() => {
        result.current.setSelectedExperience(result.current.experiences[0]);
      });

      act(() => {
        result.current.setSelectedExperience(null);
      });

      expect(result.current.selectedExperience).toBeNull();
    });
  });

  describe('hover state', () => {
    it('should have null hovered experience initially', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      expect(result.current.hoveredExperience).toBeNull();
    });

    it('should update hovered experience when set', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      act(() => {
        result.current.setHoveredExperience(result.current.experiences[0]);
      });

      expect(result.current.hoveredExperience).toBe(
        result.current.experiences[0]
      );
    });
  });

  describe('configuration', () => {
    it('should provide timeline config based on quality', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      expect(result.current.timelineConfig).toBeDefined();
      expect(result.current.timelineConfig.nodeScale).toBeDefined();
      expect(result.current.timelineConfig.enableEffects).toBe(true); // high quality
    });

    it('should provide quality level', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      expect(result.current.quality).toBe('high');
    });

    it('should respect quality override option', () => {
      const { result } = renderHook(() =>
        useExperienceTimeline({ qualityOverride: 'low' })
      );

      expect(result.current.quality).toBe('low');
      expect(result.current.timelineConfig.enableEffects).toBe(false);
    });
  });

  describe('WebGL support', () => {
    it('should indicate WebGL support status', () => {
      const { result } = renderHook(() => useExperienceTimeline());

      expect(typeof result.current.isWebGLSupported).toBe('boolean');
    });
  });
});
