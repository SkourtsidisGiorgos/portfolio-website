'use client';

import { useState, useMemo } from 'react';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { ExperienceMapper } from '@/application/mappers/ExperienceMapper';
import experiencesData from '@/data/experiences.json';
import { Experience } from '@/domain/portfolio/entities/Experience';
import { usePerformanceMode } from '@/presentation/three/hooks/usePerformanceMode';
import { TimelineConfig } from '@/presentation/three/scenes/ExperienceTimeline/domain/TimelineConfig';

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

  // Get performance-based configuration
  const { quality: detectedQuality, isMobile } = usePerformanceMode();
  const quality = qualityOverride ?? detectedQuality;

  // Load and transform experiences from static data
  const experiences = useMemo(() => {
    const entities = experiencesData.map(data =>
      Experience.create({
        id: data.id,
        company: data.company,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        remote: data.remote,
        description: data.description,
        technologies: data.technologies,
      })
    );

    // Convert to DTOs
    return ExperienceMapper.toDTOList(entities);
  }, []);

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

  // Simple WebGL support detection
  const isWebGLSupported = useMemo(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }, []);

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
    isWebGLSupported: isWebGLSupported && !isMobile,
  };
}

export default useExperienceTimeline;
