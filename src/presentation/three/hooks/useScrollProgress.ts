'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ScrollProgress {
  /** Scroll progress (0-1) for the entire page */
  progress: number;
  /** Raw scroll position in pixels */
  scrollY: number;
  /** Scroll direction: 'up' | 'down' | null */
  direction: 'up' | 'down' | null;
  /** Scroll velocity (pixels per frame) */
  velocity: number;
  /** Whether user is currently scrolling */
  isScrolling: boolean;
}

export interface UseScrollProgressOptions {
  /** Target element to track (default: document) */
  target?: HTMLElement | null;
  /** Throttle scroll events (ms) */
  throttle?: number;
  /** Smoothing factor (0-1, higher = more smoothing) */
  smoothing?: number;
  /** Disable tracking */
  disabled?: boolean;
}

const initialProgress: ScrollProgress = {
  progress: 0,
  scrollY: 0,
  direction: null,
  velocity: 0,
  isScrolling: false,
};

export function useScrollProgress({
  target = null,
  throttle = 16, // ~60fps
  smoothing = 0,
  disabled = false,
}: UseScrollProgressOptions = {}): ScrollProgress {
  const [progress, setProgress] = useState<ScrollProgress>(initialProgress);
  const lastScrollY = useRef(0);
  const lastTime = useRef<number | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const targetProgress = useRef<ScrollProgress>(initialProgress);

  const calculateProgress = useCallback((): ScrollProgress => {
    const scrollY = target ? target.scrollTop : window.scrollY;
    const maxScroll = target
      ? target.scrollHeight - target.clientHeight
      : document.documentElement.scrollHeight - window.innerHeight;

    const currentTime = Date.now();
    // Initialize lastTime on first call
    if (lastTime.current === null) {
      lastTime.current = currentTime;
    }
    const timeDelta = currentTime - lastTime.current;
    const scrollDelta = scrollY - lastScrollY.current;

    const progress =
      maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    const direction: 'up' | 'down' | null =
      scrollDelta > 0 ? 'down' : scrollDelta < 0 ? 'up' : null;
    const velocity = timeDelta > 0 ? Math.abs(scrollDelta) / timeDelta : 0;

    lastScrollY.current = scrollY;
    lastTime.current = currentTime;

    return {
      progress,
      scrollY,
      direction,
      velocity,
      isScrolling: true,
    };
  }, [target]);

  const handleScroll = useCallback(() => {
    const newProgress = calculateProgress();
    targetProgress.current = newProgress;

    // If no smoothing, update immediately
    if (smoothing <= 0) {
      setProgress(newProgress);
    }

    // Reset isScrolling after delay
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      setProgress(prev => ({ ...prev, isScrolling: false }));
      targetProgress.current = {
        ...targetProgress.current,
        isScrolling: false,
      };
    }, 150);
  }, [calculateProgress, smoothing]);

  // Smooth animation loop
  useEffect(() => {
    if (disabled || smoothing <= 0) return;

    const animate = () => {
      setProgress(prev => ({
        progress:
          prev.progress +
          (targetProgress.current.progress - prev.progress) * (1 - smoothing),
        scrollY:
          prev.scrollY +
          (targetProgress.current.scrollY - prev.scrollY) * (1 - smoothing),
        direction: targetProgress.current.direction,
        velocity:
          prev.velocity +
          (targetProgress.current.velocity - prev.velocity) * (1 - smoothing),
        isScrolling: targetProgress.current.isScrolling,
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [disabled, smoothing]);

  // Throttled scroll handler
  useEffect(() => {
    if (disabled) return;

    let lastCall = 0;
    const throttledHandler = () => {
      const now = Date.now();
      if (now - lastCall >= throttle) {
        lastCall = now;
        handleScroll();
      }
    };

    const scrollTarget = target || window;
    scrollTarget.addEventListener('scroll', throttledHandler, {
      passive: true,
    });

    // Initial calculation - use timeout to avoid calling setState directly in effect
    const initialTimeout = setTimeout(() => {
      throttledHandler();
    }, 0);

    return () => {
      scrollTarget.removeEventListener('scroll', throttledHandler);
      clearTimeout(initialTimeout);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [target, throttle, disabled, handleScroll]);

  return disabled ? initialProgress : progress;
}

// Hook to track scroll progress within a specific section
export interface SectionScrollProgress {
  /** Progress through the section (0-1) */
  progress: number;
  /** Whether section is in view */
  isInView: boolean;
  /** Whether section is fully visible */
  isFullyVisible: boolean;
}

export function useSectionScrollProgress(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: { offset?: number; disabled?: boolean } = {}
): SectionScrollProgress {
  const { offset = 0, disabled = false } = options;
  const [sectionProgress, setSectionProgress] = useState<SectionScrollProgress>(
    {
      progress: 0,
      isInView: false,
      isFullyVisible: false,
    }
  );

  useEffect(() => {
    if (disabled || !sectionRef.current) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate visibility
      const sectionTop = rect.top - offset;
      const sectionBottom = rect.bottom + offset;
      const sectionHeight = rect.height;

      const isInView = sectionBottom > 0 && sectionTop < windowHeight;
      const isFullyVisible = sectionTop >= 0 && sectionBottom <= windowHeight;

      // Calculate progress through section
      // 0 = section just entering viewport from bottom
      // 1 = section just leaving viewport from top
      let progress = 0;
      if (isInView) {
        const visibleTop = Math.max(0, windowHeight - sectionTop);
        const totalTravel = windowHeight + sectionHeight;
        progress = Math.min(1, Math.max(0, visibleTop / totalTravel));
      }

      setSectionProgress({ progress, isInView, isFullyVisible });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRef, offset, disabled]);

  return sectionProgress;
}

export default useScrollProgress;
