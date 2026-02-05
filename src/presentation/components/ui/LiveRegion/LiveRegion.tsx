'use client';

import { useEffect, useState } from 'react';
import type { AnnoucementPoliteness } from '@/shared/utils/a11y';
import { cn } from '@/shared/utils/cn';

/**
 * Props for LiveRegion component
 */
export interface LiveRegionProps {
  /** The message to announce */
  message?: string | null;
  /** Politeness level for the announcement */
  politeness?: AnnoucementPoliteness;
  /** Auto-clear the message after specified milliseconds (0 to disable) */
  clearAfter?: number;
  /** Callback when message is cleared */
  onClear?: () => void;
  /** Whether to visually hide the region (default: true) */
  visuallyHidden?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Declarative ARIA live region component.
 * Announces messages to screen readers when the message prop changes.
 *
 * @example
 * // Basic usage
 * function Form() {
 *   const [status, setStatus] = useState<string | null>(null);
 *
 *   const handleSubmit = async () => {
 *     setStatus('Submitting...');
 *     await submitForm();
 *     setStatus('Form submitted successfully!');
 *   };
 *
 *   return (
 *     <>
 *       <form onSubmit={handleSubmit}>...</form>
 *       <LiveRegion message={status} />
 *     </>
 *   );
 * }
 *
 * @example
 * // With auto-clear
 * <LiveRegion
 *   message={error}
 *   politeness="assertive"
 *   clearAfter={5000}
 *   onClear={() => setError(null)}
 * />
 *
 * @example
 * // Visible live region (for status messages)
 * <LiveRegion
 *   message={status}
 *   visuallyHidden={false}
 *   className="text-success-500"
 * />
 */
export function LiveRegion({
  message,
  politeness = 'polite',
  clearAfter = 0,
  onClear,
  visuallyHidden = true,
  className,
}: LiveRegionProps) {
  const [currentMessage, setCurrentMessage] = useState(message);

  // Update current message when prop changes
  useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  // Auto-clear after timeout
  useEffect(() => {
    if (!currentMessage || clearAfter <= 0) return;

    const timeoutId = setTimeout(() => {
      setCurrentMessage(null);
      onClear?.();
    }, clearAfter);

    return () => clearTimeout(timeoutId);
  }, [currentMessage, clearAfter, onClear]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={cn(
        visuallyHidden && [
          'absolute h-px w-px overflow-hidden whitespace-nowrap',
          'm-[-1px] border-0 p-0 [clip:rect(0,0,0,0)]',
        ],
        className
      )}
    >
      {currentMessage}
    </div>
  );
}
