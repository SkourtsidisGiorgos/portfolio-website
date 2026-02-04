'use client';

import { Suspense, type ReactNode } from 'react';
import { Loader } from '@/presentation/components/ui/Loader';
import {
  useLazySection,
  type UseLazySectionOptions,
} from '@/presentation/hooks/useLazySection';
import { cn } from '@/shared/utils/cn';

/**
 * Props for LazySection component
 */
export interface LazySectionProps {
  /** Content to render when loaded */
  children: ReactNode;
  /** Custom fallback component (defaults to centered Loader) */
  fallback?: ReactNode;
  /** Minimum height for the section placeholder */
  minHeight?: string;
  /** Additional class names */
  className?: string;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Intersection threshold */
  threshold?: number;
  /** Disable lazy loading (always show content) */
  disabled?: boolean;
  /** ID for the section */
  id?: string;
}

/**
 * Default fallback component
 */
function DefaultFallback({ minHeight }: { minHeight: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'bg-gradient-to-b from-transparent via-gray-900/20 to-transparent'
      )}
      style={{ minHeight }}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Lazy loading wrapper component for page sections.
 *
 * Single Responsibility: lazy loading container.
 * Uses useLazySection hook and Suspense boundary for optimal loading.
 *
 * @example
 * ```tsx
 * <LazySection minHeight="600px">
 *   <HeavySection />
 * </LazySection>
 * ```
 *
 * @example with custom fallback
 * ```tsx
 * <LazySection fallback={<CustomSkeleton />}>
 *   <HeavySection />
 * </LazySection>
 * ```
 */
export function LazySection({
  children,
  fallback,
  minHeight = '400px',
  className,
  rootMargin,
  threshold,
  disabled,
  id,
}: LazySectionProps) {
  const options: UseLazySectionOptions = {
    rootMargin,
    threshold,
    disabled,
    triggerOnce: true,
  };

  const { ref, hasLoaded } = useLazySection(options);

  const fallbackContent = fallback ?? <DefaultFallback minHeight={minHeight} />;

  return (
    <div ref={ref} id={id} className={className} style={{ minHeight }}>
      {hasLoaded ? (
        <Suspense fallback={fallbackContent}>{children}</Suspense>
      ) : (
        fallbackContent
      )}
    </div>
  );
}

export default LazySection;
