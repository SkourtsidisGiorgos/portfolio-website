'use client';

import type { ReactNode } from 'react';
import { Card, CardContent } from '@/presentation/components/ui/Card';
import { Typography } from '@/presentation/components/ui/Typography';
import { cn } from '@/shared/utils/cn';

/**
 * Props for WebGLFallback component
 */
export interface WebGLFallbackProps {
  /** Custom title for the fallback */
  title?: string;
  /** Custom message for the fallback */
  message?: string;
  /** Whether to show a minimal version (less prominent) */
  minimal?: boolean;
  /** Custom fallback content to display instead of default */
  children?: ReactNode;
  /** Additional class names */
  className?: string;
  /** Minimum height for the fallback container */
  minHeight?: string;
  /** Whether WebGL is unsupported (vs just disabled) */
  unsupported?: boolean;
}

/**
 * Fallback component for non-WebGL browsers or disabled 3D.
 *
 * Single Responsibility: fallback display for when WebGL is unavailable.
 * Reuses Card component (DRY principle).
 *
 * @example
 * ```tsx
 * const { is3DEnabled } = useWebGLSupport();
 *
 * if (!is3DEnabled) {
 *   return <WebGLFallback />;
 * }
 *
 * return <Canvas>...</Canvas>;
 * ```
 */
export function WebGLFallback({
  title,
  message,
  minimal = false,
  children,
  className,
  minHeight = '300px',
  unsupported = false,
}: WebGLFallbackProps) {
  const defaultTitle = unsupported
    ? '3D Graphics Not Supported'
    : 'Interactive 3D View';

  const defaultMessage = unsupported
    ? 'Your browser does not support WebGL. Please try a modern browser like Chrome, Firefox, or Edge for the full experience.'
    : 'The interactive 3D experience has been disabled for optimal performance on your device.';

  // If custom children provided, render them
  if (children) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ minHeight }}
      >
        {children}
      </div>
    );
  }

  // Minimal version - just a subtle message
  if (minimal) {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          'bg-gradient-to-b from-transparent via-gray-900/10 to-transparent',
          className
        )}
        style={{ minHeight }}
      >
        <Typography variant="body-sm" className="text-gray-500">
          {message || defaultMessage}
        </Typography>
      </div>
    );
  }

  // Full fallback with card
  return (
    <div
      className={cn(
        'flex items-center justify-center p-8',
        'bg-gradient-to-b from-transparent via-gray-900/20 to-transparent',
        className
      )}
      style={{ minHeight }}
    >
      <Card variant="glass" className="max-w-md">
        <CardContent className="p-6 text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/50">
            <svg
              className="h-8 w-8 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {unsupported ? (
                // Warning icon for unsupported
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              ) : (
                // Monitor/cube icon for disabled
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              )}
            </svg>
          </div>

          {/* Title */}
          <Typography variant="h4" className="mb-2">
            {title || defaultTitle}
          </Typography>

          {/* Message */}
          <Typography variant="body" className="text-gray-400">
            {message || defaultMessage}
          </Typography>

          {/* Browser suggestion for unsupported */}
          {unsupported && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <a
                href="https://www.google.com/chrome/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Chrome
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="https://www.mozilla.org/firefox/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Firefox
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="https://www.microsoft.com/edge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Edge
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Context lost fallback for when WebGL context is lost during use.
 * Shows a reload prompt.
 */
export interface ContextLostFallbackProps {
  /** Custom message */
  message?: string;
  /** Callback to attempt recovery */
  onReload?: () => void;
  /** Additional class names */
  className?: string;
}

export function ContextLostFallback({
  message = 'The 3D graphics context was lost. This can happen due to memory constraints.',
  onReload,
  className,
}: ContextLostFallbackProps) {
  return (
    <div
      className={cn(
        'flex min-h-[300px] items-center justify-center p-8',
        'bg-gradient-to-b from-transparent via-gray-900/20 to-transparent',
        className
      )}
    >
      <Card variant="glass" className="max-w-md">
        <CardContent className="p-6 text-center">
          {/* Warning icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-900/30">
            <svg
              className="h-8 w-8 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>

          <Typography variant="h4" className="mb-2">
            Graphics Context Lost
          </Typography>

          <Typography variant="body" className="mb-4 text-gray-400">
            {message}
          </Typography>

          <button
            onClick={onReload || (() => window.location.reload())}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500"
          >
            Reload Page
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
