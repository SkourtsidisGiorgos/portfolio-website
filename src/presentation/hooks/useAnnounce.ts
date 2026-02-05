'use client';

import { useState, useCallback } from 'react';
import {
  announceToScreenReader,
  type AnnoucementPoliteness,
} from '@/shared/utils/a11y';

/**
 * Announcement state
 */
export interface Announcement {
  /** The message to announce */
  message: string;
  /** The politeness level */
  politeness: AnnoucementPoliteness;
}

/**
 * Return type for useAnnounce hook
 */
export interface UseAnnounceReturn {
  /** Function to announce a message to screen readers */
  announce: (message: string, politeness?: AnnoucementPoliteness) => void;
  /** Current announcement (for declarative live regions) */
  announcement: Announcement | null;
  /** Clear the current announcement */
  clearAnnouncement: () => void;
}

/**
 * Hook for making announcements to screen readers.
 * Provides both imperative and declarative announcement patterns.
 *
 * @returns Announcement utilities
 *
 * @example
 * // Imperative usage
 * function Form() {
 *   const { announce } = useAnnounce();
 *
 *   const handleSubmit = async () => {
 *     await submitForm();
 *     announce('Form submitted successfully');
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 *
 * @example
 * // Declarative usage with LiveRegion component
 * function Form() {
 *   const { announcement, announce, clearAnnouncement } = useAnnounce();
 *
 *   const handleSubmit = async () => {
 *     await submitForm();
 *     announce('Form submitted successfully');
 *   };
 *
 *   return (
 *     <>
 *       <form onSubmit={handleSubmit}>...</form>
 *       <LiveRegion
 *         message={announcement?.message}
 *         politeness={announcement?.politeness}
 *         onClear={clearAnnouncement}
 *       />
 *     </>
 *   );
 * }
 */
export function useAnnounce(): UseAnnounceReturn {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const announce = useCallback(
    (message: string, politeness: AnnoucementPoliteness = 'polite') => {
      // Update state for declarative usage
      setAnnouncement({ message, politeness });

      // Also announce imperatively for immediate effect
      announceToScreenReader(message, politeness);
    },
    []
  );

  const clearAnnouncement = useCallback(() => {
    setAnnouncement(null);
  }, []);

  return {
    announce,
    announcement,
    clearAnnouncement,
  };
}
