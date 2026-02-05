'use client';

import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

/**
 * Props for LoadingFallback component
 */
export interface LoadingFallbackProps {
  /** Loading message to display */
  message?: string;
  /** Additional CSS classes */
  className?: string;
  /** Spinner size */
  spinnerSize?: 'sm' | 'md' | 'lg';
  /** Background style */
  background?: 'primary' | 'transparent';
}

/**
 * Props for ErrorFallback component
 */
export interface ErrorFallbackProps {
  /** Primary error message */
  message?: string;
  /** Secondary hint message */
  hint?: string;
  /** Custom icon to display */
  icon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Background style */
  background?: 'primary' | 'transparent';
}

const spinnerSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

/**
 * Loading fallback component for Canvas suspension.
 *
 * Single Responsibility: Display loading state with customizable message.
 * Used by canvas components during async loading.
 *
 * @example
 * ```tsx
 * <Suspense fallback={<LoadingFallback message="Loading 3D scene..." />}>
 *   <Canvas>...</Canvas>
 * </Suspense>
 * ```
 */
export function LoadingFallback({
  message = 'Loading...',
  className,
  spinnerSize = 'md',
  background = 'transparent',
}: LoadingFallbackProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        background === 'primary' ? 'bg-background-primary' : 'bg-transparent',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            spinnerSizes[spinnerSize],
            'animate-spin rounded-full border-2 border-t-transparent',
            'border-primary-500'
          )}
          aria-hidden="true"
        />
        <span className="text-sm text-gray-400">{message}</span>
      </div>
    </div>
  );
}

/**
 * Default globe icon SVG
 */
const GlobeIcon = () => (
  <svg
    className="mx-auto h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
    />
  </svg>
);

/**
 * Database icon SVG
 */
const DatabaseIcon = () => (
  <svg
    className="mx-auto h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
    />
  </svg>
);

/**
 * Briefcase icon SVG
 */
const BriefcaseIcon = () => (
  <svg
    className="mx-auto h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
    />
  </svg>
);

/**
 * Computer emoji fallback (for Hero section)
 */
const ComputerEmoji = () => (
  <span role="img" aria-label="Computer" className="text-4xl">
    {'\uD83D\uDCBB'}
  </span>
);

/**
 * Pre-defined icon types for convenience
 */
export const ErrorIcons = {
  globe: <GlobeIcon />,
  database: <DatabaseIcon />,
  briefcase: <BriefcaseIcon />,
  computer: <ComputerEmoji />,
} as const;

export type ErrorIconType = keyof typeof ErrorIcons;

/**
 * Error fallback component for WebGL unsupported or context lost.
 *
 * Single Responsibility: Display error state with customizable message and icon.
 * Used by canvas components when WebGL is unavailable.
 *
 * @example
 * ```tsx
 * if (!isSupported || hasError) {
 *   return (
 *     <ErrorFallback
 *       message="3D visualization requires WebGL support."
 *       hint="Please use a modern browser with WebGL enabled."
 *       icon={ErrorIcons.computer}
 *     />
 *   );
 * }
 * ```
 */
export function ErrorFallback({
  message = '3D visualization requires WebGL support.',
  hint = 'Please use a modern browser with WebGL enabled.',
  icon = <GlobeIcon />,
  className,
  background = 'transparent',
}: ErrorFallbackProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        background === 'primary' ? 'bg-background-primary' : 'bg-transparent',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="text-primary-500/50 mb-3 text-4xl" aria-hidden="true">
          {icon}
        </div>
        <p className="text-gray-400">{message}</p>
        {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      </div>
    </div>
  );
}
