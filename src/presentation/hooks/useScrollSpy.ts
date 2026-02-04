'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseScrollSpyOptions {
  sectionIds: string[];
  offset?: number;
  rootMargin?: string;
}

/**
 * Hook to track which section is currently in view.
 * Uses Intersection Observer for efficient scroll tracking.
 */
export function useScrollSpy({
  sectionIds,
  offset = 100,
  rootMargin = '-20% 0px -70% 0px',
}: UseScrollSpyOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || sectionIds.length === 0) {
      return;
    }

    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    elements.forEach(element => observer.observe(element));

    return () => {
      elements.forEach(element => observer.unobserve(element));
    };
  }, [sectionIds, offset, rootMargin]);

  return activeId;
}

/**
 * Hook to smoothly scroll to a section by ID.
 */
export function useScrollTo() {
  return useCallback((id: string, offset = 80) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }, []);
}
