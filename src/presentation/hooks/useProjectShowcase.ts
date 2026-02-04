'use client';

import { useState, useMemo, useCallback } from 'react';
import projectsData from '@/data/projects.json';
import { Project, type ProjectType } from '@/domain/portfolio/entities/Project';
import type { FilterOption } from '@/presentation/components/sections/Projects/ProjectFilter';
import { usePerformanceMode } from '@/presentation/three/hooks/usePerformanceMode';

/**
 * Options for useProjectShowcase hook
 */
export interface UseProjectShowcaseOptions {
  /** Override quality level */
  qualityOverride?: 'high' | 'medium' | 'low';
}

/**
 * Return type for useProjectShowcase hook
 */
export interface UseProjectShowcaseReturn {
  /** All projects */
  projects: Project[];
  /** Featured projects */
  featuredProjects: Project[];
  /** Filter options with counts */
  filterOptions: FilterOption[];
  /** Currently selected filter */
  selectedFilter: ProjectType | 'all';
  /** Set selected filter */
  setSelectedFilter: (filter: ProjectType | 'all') => void;
  /** Currently selected project */
  selectedProject: Project | null;
  /** Set selected project */
  setSelectedProject: (project: Project | null) => void;
  /** Currently hovered project */
  hoveredProject: Project | null;
  /** Set hovered project */
  setHoveredProject: (project: Project | null) => void;
  /** Projects filtered by selected filter */
  filteredProjects: Project[];
  /** Current quality level */
  quality: 'high' | 'medium' | 'low';
  /** Whether WebGL is likely supported */
  isWebGLSupported: boolean;
}

/**
 * Filter labels for display
 */
const FILTER_LABELS: Record<ProjectType | 'all', string> = {
  all: 'All Projects',
  oss: 'Open Source',
  professional: 'Professional',
  personal: 'Personal',
};

/**
 * Filter order for display
 */
const FILTER_ORDER: (ProjectType | 'all')[] = [
  'all',
  'oss',
  'professional',
  'personal',
];

/**
 * Hook for managing Projects Showcase state and data.
 * Handles project loading, filtering, and performance configuration.
 */
export function useProjectShowcase(
  options: UseProjectShowcaseOptions = {}
): UseProjectShowcaseReturn {
  const { qualityOverride } = options;

  // Get performance-based configuration
  const { quality: detectedQuality, isMobile } = usePerformanceMode();
  const quality = qualityOverride ?? detectedQuality;

  // Load and transform projects from static data
  const projects = useMemo(() => {
    return projectsData.map(data =>
      Project.create({
        id: data.id,
        title: data.title,
        description: data.description,
        technologies: data.technologies,
        type: data.type as ProjectType,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        image: data.image,
        featured: data.featured,
      })
    );
  }, []);

  // Get featured projects (sorted: featured first)
  const featuredProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [projects]);

  // Compute filter options with counts
  const filterOptions = useMemo(() => {
    const countMap = new Map<ProjectType | 'all', number>();

    // Initialize counts
    countMap.set('all', projects.length);
    FILTER_ORDER.slice(1).forEach(type => countMap.set(type as ProjectType, 0));

    // Count projects per type
    projects.forEach(project => {
      const current = countMap.get(project.type) ?? 0;
      countMap.set(project.type, current + 1);
    });

    // Convert to filter options, keeping only non-empty types (except 'all')
    return FILTER_ORDER.filter(type => {
      if (type === 'all') return true;
      return (countMap.get(type) ?? 0) > 0;
    }).map(type => ({
      id: type,
      label: FILTER_LABELS[type],
      count: countMap.get(type) ?? 0,
    }));
  }, [projects]);

  // Selection and filter state
  const [selectedFilter, setSelectedFilter] = useState<ProjectType | 'all'>(
    'all'
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  // Filter projects by selected type
  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'all') {
      return featuredProjects;
    }
    return featuredProjects.filter(project => project.type === selectedFilter);
  }, [featuredProjects, selectedFilter]);

  // Handle filter selection (also clears project selection if not in filter)
  const handleSetSelectedFilter = useCallback(
    (filter: ProjectType | 'all') => {
      setSelectedFilter(filter);
      // Clear project selection if it doesn't match the new filter
      if (
        filter !== 'all' &&
        selectedProject &&
        selectedProject.type !== filter
      ) {
        setSelectedProject(null);
      }
    },
    [selectedProject]
  );

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
    projects,
    featuredProjects,
    filterOptions,
    selectedFilter,
    setSelectedFilter: handleSetSelectedFilter,
    selectedProject,
    setSelectedProject,
    hoveredProject,
    setHoveredProject,
    filteredProjects,
    quality,
    isWebGLSupported: isWebGLSupported && !isMobile,
  };
}

export default useProjectShowcase;
