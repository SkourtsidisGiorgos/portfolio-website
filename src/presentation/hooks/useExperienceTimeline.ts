'use client';

import { useState, useMemo, useEffect } from 'react';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { ExperienceMapper } from '@/application/mappers/ExperienceMapper';
import { usePerformanceMode } from '@/presentation/three/hooks/usePerformanceMode';
import { useWebGLSupport } from '@/presentation/three/hooks/useWebGLSupport';
import { TimelineConfig } from '@/presentation/three/scenes/ExperienceTimeline/domain/TimelineConfig';
import { useExperienceRepository } from './useRepositories';

/**
 * Options for useExperienceTimeline hook
 */
export interface UseExperienceTimelineOptions {
  /** Override quality level */
  qualityOverride?: 'high' | 'medium' | 'low';
}

/**
 * Return type for useExperienceTimeline hook
 */
export interface UseExperienceTimelineReturn {
  /** All experiences as DTOs */
  experiences: ExperienceDTO[];
  /** Total years of professional experience */
  totalYears: number;
  /** Unique technologies across all experiences */
  technologies: string[];
  /** Currently selected experience */
  selectedExperience: ExperienceDTO | null;
  /** Set selected experience */
  setSelectedExperience: (exp: ExperienceDTO | null) => void;
  /** Currently hovered experience */
  hoveredExperience: ExperienceDTO | null;
  /** Set hovered experience */
  setHoveredExperience: (exp: ExperienceDTO | null) => void;
  /** Timeline configuration based on quality */
  timelineConfig: TimelineConfig;
  /** Current quality level */
  quality: 'high' | 'medium' | 'low';
  /** Whether WebGL is likely supported */
  isWebGLSupported: boolean;
}

/**
 * Calculates total years of experience from start date of first job to now
 */
function calculateTotalYears(experiences: ExperienceDTO[]): number {
  if (experiences.length === 0) return 0;

  // Find earliest start date
  const startDates = experiences.map(exp => new Date(exp.startDate).getTime());
  const earliest = Math.min(...startDates);

  const now = new Date().getTime();
  const years = (now - earliest) / (1000 * 60 * 60 * 24 * 365.25);

  return Math.round(years * 10) / 10; // Round to 1 decimal
}

/**
 * Extracts unique technologies from all experiences
 */
function extractUniqueTechnologies(experiences: ExperienceDTO[]): string[] {
  const techSet = new Set<string>();
  experiences.forEach(exp => {
    exp.technologies.forEach(tech => techSet.add(tech));
  });
  return Array.from(techSet).sort();
}

/**
 * Hook for managing Experience Timeline state and data.
 * Handles experience loading, selection state, and performance configuration.
 */
export function useExperienceTimeline(
  options: UseExperienceTimelineOptions = {}
): UseExperienceTimelineReturn {
  const { qualityOverride } = options;

  // Get performance-based configuration with WebGL support detection
  const { quality } = usePerformanceMode({ forceQuality: qualityOverride });
  const { is3DEnabled } = useWebGLSupport();

  // Get repository through DI container
  const experienceRepository = useExperienceRepository();

  // Load experiences from repository
  const [experiences, setExperiences] = useState<ExperienceDTO[]>([]);

  useEffect(() => {
    let mounted = true;

    experienceRepository.findAll().then(entities => {
      if (mounted) {
        setExperiences(ExperienceMapper.toDTOList(entities));
      }
    });

    return () => {
      mounted = false;
    };
  }, [experienceRepository]);

  // Computed values
  const totalYears = useMemo(
    () => calculateTotalYears(experiences),
    [experiences]
  );

  const technologies = useMemo(
    () => extractUniqueTechnologies(experiences),
    [experiences]
  );

  // Selection state
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceDTO | null>(null);
  const [hoveredExperience, setHoveredExperience] =
    useState<ExperienceDTO | null>(null);

  // Timeline configuration based on quality
  const timelineConfig = useMemo(() => {
    return TimelineConfig.forQuality(quality);
  }, [quality]);

  return {
    experiences,
    totalYears,
    technologies,
    selectedExperience,
    setSelectedExperience,
    hoveredExperience,
    setHoveredExperience,
    timelineConfig,
    quality,
    isWebGLSupported: is3DEnabled,
  };
}

export default useExperienceTimeline;
