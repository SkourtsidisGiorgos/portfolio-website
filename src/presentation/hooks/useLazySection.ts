'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LAZY_LOAD_CONFIG } from '@/shared/config/performance.config';

/**
 * Options for useLazySection hook
 */
export interface UseLazySectionOptions {
  /** Root margin for intersection observer (default: '200px 0px') */
  rootMargin?: string;
  /** Intersection threshold (default: 0.1) */
  threshold?: number;
  /** Whether to trigger only once (default: true) */
  triggerOnce?: boolean;
  /** Disable lazy loading (always visible) */
  disabled?: boolean;
}

/**
 * Return type for useLazySection hook
 */
export interface UseLazySectionReturn {
  /** Ref to attach to the target element */
  ref: React.RefObject<HTMLDivElement | null>;
  /** Whether the element is currently visible */
  isVisible: boolean;
  /** Whether the element has ever been loaded/visible */
  hasLoaded: boolean;
  /** Manually trigger load */
  triggerLoad: () => void;
}

/**
 * Hook for lazy loading sections using Intersection Observer.
 *
 * Single Responsibility: visibility detection for lazy loading.
 * Uses centralized configuration (DRY).
 *
 * @example
 * ```tsx
 * function LazyComponent() {
 *   const { ref, hasLoaded } = useLazySection();
 *
 *   return (
 *     <div ref={ref}>
 *       {hasLoaded ? <HeavyContent /> : <Skeleton />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLazySection(
  options: UseLazySectionOptions = {}
): UseLazySectionReturn {
  const {
    rootMargin = LAZY_LOAD_CONFIG.rootMargin,
    threshold = LAZY_LOAD_CONFIG.threshold,
    triggerOnce = true,
    disabled = false,
  } = options;

  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(disabled);
  const [hasLoaded, setHasLoaded] = useState(disabled);

  // Manual trigger function
  const triggerLoad = useCallback(() => {
    setIsVisible(true);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    // Skip if disabled or already loaded (and triggerOnce)
    if (disabled || (triggerOnce && hasLoaded)) return;

    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: schedule state update for next tick to avoid React Compiler warning
      const timeoutId = setTimeout(() => {
        setIsVisible(true);
        setHasLoaded(true);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const visible = entry.isIntersecting;
          setIsVisible(visible);

          if (visible && !hasLoaded) {
            setHasLoaded(true);

            // Disconnect if triggerOnce
            if (triggerOnce) {
              observer.disconnect();
            }
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, triggerOnce, hasLoaded, disabled]);

  return {
    ref,
    isVisible,
    hasLoaded,
    triggerLoad,
  };
}

export default useLazySection;
