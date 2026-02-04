'use client';

import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Grid children (BentoCell components) */
  children: ReactNode;
  /** Number of columns (responsive by default) */
  columns?: 1 | 2 | 3 | 4;
  /** Gap between cells */
  gap?: 'sm' | 'md' | 'lg';
  /** Additional class names */
  className?: string;
}

const gapStyles = {
  sm: 'gap-3',
  md: 'gap-4 md:gap-6',
  lg: 'gap-6 md:gap-8',
};

const columnStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

/**
 * Responsive bento-style grid layout.
 * Single Responsibility: only handles grid layout structure.
 */
export function BentoGrid({
  children,
  columns = 3,
  gap = 'md',
  className,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid w-full',
        columnStyles[columns],
        gapStyles[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
