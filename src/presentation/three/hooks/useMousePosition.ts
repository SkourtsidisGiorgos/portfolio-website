'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface MousePosition {
  /** Raw X position (0-window width) */
  x: number;
  /** Raw Y position (0-window height) */
  y: number;
  /** Normalized X position (-1 to 1) */
  normalizedX: number;
  /** Normalized Y position (-1 to 1) */
  normalizedY: number;
  /** Whether the mouse is inside the viewport */
  isInViewport: boolean;
}

export interface UseMousePositionOptions {
  /** Smoothing factor (0-1, higher = more smoothing) */
  smoothing?: number;
  /** Container element to track within (default: window) */
  container?: HTMLElement | null;
  /** Disable tracking */
  disabled?: boolean;
}

const initialPosition: MousePosition = {
  x: 0,
  y: 0,
  normalizedX: 0,
  normalizedY: 0,
  isInViewport: false,
};

export function useMousePosition({
  smoothing = 0,
  container = null,
  disabled = false,
}: UseMousePositionOptions = {}): MousePosition {
  const [position, setPosition] = useState<MousePosition>(initialPosition);
  const targetRef = useRef<MousePosition>(initialPosition);
  const animationFrameRef = useRef<number | null>(null);

  // Handle mouse move
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const target = container || document.documentElement;
      const rect = target.getBoundingClientRect();

      const x = event.clientX;
      const y = event.clientY;

      // Calculate normalized positions (-1 to 1)
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normalizedX = (x - centerX) / (rect.width / 2);
      const normalizedY = -(y - centerY) / (rect.height / 2); // Inverted for 3D coords

      // Check if mouse is in viewport
      const isInViewport =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      targetRef.current = {
        x,
        y,
        normalizedX: Math.max(-1, Math.min(1, normalizedX)),
        normalizedY: Math.max(-1, Math.min(1, normalizedY)),
        isInViewport,
      };

      // If no smoothing, update immediately
      if (smoothing <= 0) {
        setPosition(targetRef.current);
      }
    },
    [container, smoothing]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    targetRef.current = { ...targetRef.current, isInViewport: false };
    if (smoothing <= 0) {
      setPosition(targetRef.current);
    }
  }, [smoothing]);

  // Smooth animation loop
  useEffect(() => {
    if (disabled || smoothing <= 0) return;

    const animate = () => {
      setPosition(prev => ({
        x: prev.x + (targetRef.current.x - prev.x) * (1 - smoothing),
        y: prev.y + (targetRef.current.y - prev.y) * (1 - smoothing),
        normalizedX:
          prev.normalizedX +
          (targetRef.current.normalizedX - prev.normalizedX) * (1 - smoothing),
        normalizedY:
          prev.normalizedY +
          (targetRef.current.normalizedY - prev.normalizedY) * (1 - smoothing),
        isInViewport: targetRef.current.isInViewport,
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

  // Event listeners
  useEffect(() => {
    if (disabled) return;

    const target = container || window;

    target.addEventListener('mousemove', handleMouseMove as EventListener);
    target.addEventListener('mouseleave', handleMouseLeave as EventListener);

    return () => {
      target.removeEventListener('mousemove', handleMouseMove as EventListener);
      target.removeEventListener(
        'mouseleave',
        handleMouseLeave as EventListener
      );
    };
  }, [container, disabled, handleMouseMove, handleMouseLeave]);

  return disabled ? initialPosition : position;
}
