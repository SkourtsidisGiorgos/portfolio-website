'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Animation frame state passed to callbacks
 */
export interface AnimationFrameState {
  /** Elapsed time in seconds */
  elapsed: number;
  /** Delta time since last frame in seconds */
  delta: number;
  /** Whether component is visible */
  isVisible: boolean;
}

/**
 * Options for useAnimationFrame hook
 */
export interface UseAnimationFrameOptions {
  /** Callback for each animation frame */
  onFrame?: (state: AnimationFrameState) => void;
  /** Whether animation is enabled (default: true) */
  enabled?: boolean;
  /** Pause when component is not visible (default: true) */
  pauseWhenHidden?: boolean;
  /** Throttle updates to this interval in ms (default: 0 = no throttle) */
  throttleMs?: number;
}

/**
 * Return value from useAnimationFrame hook
 */
export interface UseAnimationFrameReturn {
  /** Current elapsed time */
  elapsed: number;
  /** Whether animation is currently running */
  isRunning: boolean;
  /** Pause the animation */
  pause: () => void;
  /** Resume the animation */
  resume: () => void;
  /** Reset elapsed time to 0 */
  reset: () => void;
}

/**
 * Hook that wraps useFrame with common animation patterns.
 * Provides auto-pause when not visible and elapsed time tracking.
 * Follows Single Responsibility - only handles animation frame logic.
 */
export function useAnimationFrame(
  options: UseAnimationFrameOptions = {}
): UseAnimationFrameReturn {
  const {
    onFrame,
    enabled = true,
    pauseWhenHidden = true,
    throttleMs = 0,
  } = options;

  // State for exposed values (causes re-render when changed)
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for internal tracking (don't cause re-render)
  const elapsedRef = useRef(0);
  const isPausedRef = useRef(false);
  const lastUpdateRef = useRef(0);
  const isVisibleRef = useRef(true);
  const lastReportedRef = useRef(0);

  // Track document visibility
  useEffect(() => {
    if (!pauseWhenHidden) return;

    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseWhenHidden]);

  // Pause callback
  const pause = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
  }, []);

  // Resume callback
  const resume = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
  }, []);

  // Reset callback
  const reset = useCallback(() => {
    elapsedRef.current = 0;
    lastUpdateRef.current = 0;
    lastReportedRef.current = 0;
    setElapsed(0);
  }, []);

  // Main animation frame
  useFrame((state, delta) => {
    // Skip if disabled or paused
    if (!enabled || isPausedRef.current) return;

    // Skip if hidden and pauseWhenHidden is true
    if (pauseWhenHidden && !isVisibleRef.current) return;

    // Throttle updates if specified
    if (throttleMs > 0) {
      const now = state.clock.elapsedTime;
      if ((now - lastUpdateRef.current) * 1000 < throttleMs) return;
      lastUpdateRef.current = now;
    }

    // Update elapsed time
    elapsedRef.current += delta;

    // Sync to state periodically (every ~100ms to avoid too many re-renders)
    if (elapsedRef.current - lastReportedRef.current > 0.1) {
      lastReportedRef.current = elapsedRef.current;
      setElapsed(elapsedRef.current);
    }

    // Call frame callback
    onFrame?.({
      elapsed: elapsedRef.current,
      delta,
      isVisible: isVisibleRef.current,
    });
  });

  return {
    elapsed,
    isRunning: enabled && !isPaused,
    pause,
    resume,
    reset,
  };
}

export default useAnimationFrame;
