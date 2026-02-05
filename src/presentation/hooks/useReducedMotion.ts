'use client';

import { useSyncExternalStore } from 'react';

/**
 * Media query for prefers-reduced-motion
 */
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Hook to reactively detect if user prefers reduced motion.
 * Uses useSyncExternalStore pattern for proper SSR/hydration handling.
 *
 * @returns true if user prefers reduced motion
 *
 * @example
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       animate={{ opacity: 1 }}
 *       transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
 *     />
 *   );
 * }
 */
export function useReducedMotion(): boolean {
  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') {
      return () => {};
    }
    const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
    mediaQueryList.addEventListener('change', callback);
    return () => mediaQueryList.removeEventListener('change', callback);
  };

  const getSnapshot = () => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
