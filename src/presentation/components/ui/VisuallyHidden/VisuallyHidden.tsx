'use client';

import { type ReactNode, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/utils/cn';

/**
 * Props for VisuallyHidden component
 */
export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<'span'> {
  /** The content to visually hide but keep accessible to screen readers */
  children: ReactNode;
  /** The HTML element to render (default: span) */
  as?: 'span' | 'div' | 'a' | 'p' | 'label';
  /** Whether the element should become visible when focused (for skip links) */
  focusable?: boolean;
}

/**
 * Visually hidden content that remains accessible to screen readers.
 * Uses the sr-only pattern for accessibility.
 *
 * @example
 * // Basic usage - hidden text for screen readers
 * <VisuallyHidden>Loading, please wait</VisuallyHidden>
 *
 * @example
 * // Icon button with accessible label
 * <button>
 *   <SearchIcon />
 *   <VisuallyHidden>Search</VisuallyHidden>
 * </button>
 *
 * @example
 * // Skip link that becomes visible on focus
 * <VisuallyHidden as="a" href="#main" focusable>
 *   Skip to main content
 * </VisuallyHidden>
 */
export function VisuallyHidden({
  children,
  as = 'span',
  focusable = false,
  className,
  ...props
}: VisuallyHiddenProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        // Base sr-only styles
        'absolute h-px w-px overflow-hidden whitespace-nowrap',
        'm-[-1px] border-0 p-0 [clip:rect(0,0,0,0)]',
        // When focusable, become visible on focus
        focusable && [
          'focus:relative focus:h-auto focus:w-auto',
          'focus:overflow-visible focus:whitespace-normal',
          'focus:m-0 focus:p-4 focus:[clip:auto]',
          'focus:z-50 focus:bg-gray-900 focus:text-white',
          'focus:outline-primary-500 focus:outline-2',
        ],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
