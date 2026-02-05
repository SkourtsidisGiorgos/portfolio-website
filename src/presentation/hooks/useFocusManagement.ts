'use client';

import { useEffect, useRef, useCallback, type RefObject } from 'react';
import { getFocusableElements } from '@/shared/utils/a11y';

/**
 * Options for useFocusManagement hook
 */
export interface UseFocusManagementOptions {
  /** Container element ref to trap focus within */
  containerRef: RefObject<HTMLElement | null>;
  /** Whether focus trapping is enabled */
  enabled?: boolean;
  /** Whether to restore focus to previous element on cleanup */
  restoreFocus?: boolean;
  /** Ref to element that should receive initial focus */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Return type for useFocusManagement hook
 */
export interface UseFocusManagementReturn {
  /** Function to manually focus the first focusable element */
  focusFirst: () => void;
  /** Function to manually focus the last focusable element */
  focusLast: () => void;
}

/**
 * Hook for managing focus trapping within a container.
 * Extracts focus trap logic for reuse across modal/dialog components.
 *
 * @param options - Configuration options
 * @returns Focus management utilities
 *
 * @example
 * function Modal({ isOpen, onClose, children }) {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   const closeButtonRef = useRef<HTMLButtonElement>(null);
 *
 *   useFocusManagement({
 *     containerRef,
 *     enabled: isOpen,
 *     restoreFocus: true,
 *     initialFocusRef: closeButtonRef,
 *   });
 *
 *   return (
 *     <div ref={containerRef} role="dialog" aria-modal="true">
 *       <button ref={closeButtonRef} onClick={onClose}>Close</button>
 *       {children}
 *     </div>
 *   );
 * }
 */
export function useFocusManagement({
  containerRef,
  enabled = true,
  restoreFocus = true,
  initialFocusRef,
}: UseFocusManagementOptions): UseFocusManagementReturn {
  const previousActiveElement = useRef<Element | null>(null);

  const focusFirst = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [containerRef]);

  const focusLast = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [containerRef]);

  // Handle Tab key for focus trapping
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !containerRef.current) return;

      const focusableElements = getFocusableElements(containerRef.current);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [containerRef]
  );

  useEffect(() => {
    if (!enabled) return;

    // Store previously focused element
    previousActiveElement.current = document.activeElement;

    // Focus initial element or first focusable
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else {
      focusFirst();
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previous element
      if (
        restoreFocus &&
        previousActiveElement.current instanceof HTMLElement
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, initialFocusRef, restoreFocus, focusFirst, handleKeyDown]);

  return {
    focusFirst,
    focusLast,
  };
}
