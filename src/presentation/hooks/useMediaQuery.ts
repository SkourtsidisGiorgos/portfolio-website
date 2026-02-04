'use client';

import { useSyncExternalStore } from 'react';
import { breakpoints } from '@/shared/constants/breakpoints';

/**
 * Hook to check if a media query matches.
 * Uses useSyncExternalStore for proper SSR/hydration handling.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') {
      return () => {};
    }
    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener('change', callback);
    return () => mediaQueryList.removeEventListener('change', callback);
  };

  const getSnapshot = () => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Hook to check if viewport is at or above a breakpoint.
 */
export function useBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  const query = `(min-width: ${breakpoints[breakpoint]}px)`;
  return useMediaQuery(query);
}

/**
 * Hook to check if viewport is mobile (below md breakpoint).
 */
export function useIsMobile(): boolean {
  return !useBreakpoint('md');
}

/**
 * Hook to check if viewport is tablet (between md and lg).
 */
export function useIsTablet(): boolean {
  const isAboveMd = useBreakpoint('md');
  const isAboveLg = useBreakpoint('lg');
  return isAboveMd && !isAboveLg;
}

/**
 * Hook to check if viewport is desktop (at or above lg).
 */
export function useIsDesktop(): boolean {
  return useBreakpoint('lg');
}
