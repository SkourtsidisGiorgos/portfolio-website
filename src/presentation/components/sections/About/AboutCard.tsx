'use client';

import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';
import { BentoCell, type BentoCellSize } from './BentoCell';

export type AboutCardVariant = 'metric' | 'profile' | 'highlight' | 'custom';

export interface AboutCardProps {
  /** Card variant determining styling */
  variant?: AboutCardVariant;
  /** Cell size in the bento grid */
  size?: BentoCellSize;
  /** Card content */
  children: ReactNode;
  /** Custom render function for extension (Open/Closed Principle) */
  renderContent?: (children: ReactNode) => ReactNode;
  /** Additional class names */
  className?: string;
}

const variantStyles: Record<AboutCardVariant, string> = {
  metric: '',
  profile: 'bg-gradient-to-br from-primary-500/10 to-accent-500/10',
  highlight: 'bg-gradient-to-br from-accent-500/5 to-primary-500/5',
  custom: '',
};

/**
 * Generic about card component following Open/Closed Principle.
 * Can be extended with custom render function without modification.
 */
export function AboutCard({
  variant = 'custom',
  size = 'medium',
  children,
  renderContent,
  className,
}: AboutCardProps) {
  const content = renderContent ? renderContent(children) : children;

  return (
    <BentoCell size={size} className={cn(variantStyles[variant], className)}>
      {content}
    </BentoCell>
  );
}
