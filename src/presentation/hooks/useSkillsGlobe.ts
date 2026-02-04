'use client';

import { useState, useMemo, useCallback } from 'react';
import skillsData from '@/data/skills.json';
import { Skill, type SkillCategory } from '@/domain/portfolio/entities/Skill';
import { usePerformanceMode } from '@/presentation/three/hooks/usePerformanceMode';
import { GlobeConfig } from '@/presentation/three/scenes/SkillsGlobe/domain/GlobeConfig';

/**
 * Category info with label and count
 */
export interface CategoryInfo {
  id: SkillCategory;
  label: string;
  count: number;
}

/**
 * Options for useSkillsGlobe hook
 */
export interface UseSkillsGlobeOptions {
  /** Override quality level */
  qualityOverride?: 'high' | 'medium' | 'low';
}

/**
 * Return type for useSkillsGlobe hook
 */
export interface UseSkillsGlobeReturn {
  /** All skills */
  skills: Skill[];
  /** Categories with counts */
  categories: CategoryInfo[];
  /** Currently selected category filter */
  selectedCategory: SkillCategory | null;
  /** Set selected category */
  setSelectedCategory: (category: SkillCategory | null) => void;
  /** Currently selected skill */
  selectedSkill: Skill | null;
  /** Set selected skill */
  setSelectedSkill: (skill: Skill | null) => void;
  /** Currently hovered skill */
  hoveredSkill: Skill | null;
  /** Set hovered skill */
  setHoveredSkill: (skill: Skill | null) => void;
  /** Skills filtered by selected category */
  filteredSkills: Skill[];
  /** Globe configuration based on quality */
  globeConfig: GlobeConfig;
  /** Current quality level */
  quality: 'high' | 'medium' | 'low';
  /** Whether WebGL is likely supported */
  isWebGLSupported: boolean;
}

/**
 * Category labels for display
 */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languages: 'Languages',
  bigdata: 'Big Data',
  devops: 'DevOps',
  aiml: 'AI/ML',
  databases: 'Databases',
  backend: 'Backend',
  frontend: 'Frontend',
  other: 'Other',
};

/**
 * Order of categories for display
 */
const CATEGORY_ORDER: SkillCategory[] = [
  'languages',
  'bigdata',
  'devops',
  'databases',
  'backend',
  'aiml',
  'frontend',
  'other',
];

/**
 * Hook for managing Skills Globe state and data.
 * Handles skill loading, category filtering, and performance configuration.
 */
export function useSkillsGlobe(
  options: UseSkillsGlobeOptions = {}
): UseSkillsGlobeReturn {
  const { qualityOverride } = options;

  // Get performance-based configuration
  const { quality: detectedQuality, isMobile } = usePerformanceMode();
  const quality = qualityOverride ?? detectedQuality;

  // Load and transform skills from static data
  const skills = useMemo(() => {
    return skillsData.map(data =>
      Skill.create({
        id: data.id,
        name: data.name,
        category: data.category as SkillCategory,
        proficiency: data.proficiency as
          | 'beginner'
          | 'intermediate'
          | 'advanced'
          | 'expert',
        icon: data.icon,
        yearsOfExperience: data.yearsOfExperience,
      })
    );
  }, []);

  // Compute categories with counts
  const categories = useMemo(() => {
    const countMap = new Map<SkillCategory, number>();

    // Initialize counts
    CATEGORY_ORDER.forEach(cat => countMap.set(cat, 0));

    // Count skills per category
    skills.forEach(skill => {
      const current = countMap.get(skill.category) ?? 0;
      countMap.set(skill.category, current + 1);
    });

    // Convert to array, filtering out empty categories
    return CATEGORY_ORDER.filter(cat => (countMap.get(cat) ?? 0) > 0).map(
      cat => ({
        id: cat,
        label: CATEGORY_LABELS[cat],
        count: countMap.get(cat) ?? 0,
      })
    );
  }, [skills]);

  // Selection and filter state
  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategory | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  // Filter skills by category
  const filteredSkills = useMemo(() => {
    if (selectedCategory === null) {
      return skills;
    }
    return skills.filter(skill => skill.category === selectedCategory);
  }, [skills, selectedCategory]);

  // Handle category selection (also clears skill selection if not in category)
  const handleSetSelectedCategory = useCallback(
    (category: SkillCategory | null) => {
      setSelectedCategory(category);
      // Clear skill selection if it doesn't match the new category
      if (
        category !== null &&
        selectedSkill &&
        selectedSkill.category !== category
      ) {
        setSelectedSkill(null);
      }
    },
    [selectedSkill]
  );

  // Globe configuration based on quality
  const globeConfig = useMemo(() => {
    return GlobeConfig.forQuality(quality);
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
    skills,
    categories,
    selectedCategory,
    setSelectedCategory: handleSetSelectedCategory,
    selectedSkill,
    setSelectedSkill,
    hoveredSkill,
    setHoveredSkill,
    filteredSkills,
    globeConfig,
    quality,
    isWebGLSupported: isWebGLSupported && !isMobile,
  };
}

export default useSkillsGlobe;
