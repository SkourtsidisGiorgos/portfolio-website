'use client';

import { type ReactNode, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export type BentoCellSize = 'small' | 'medium' | 'large';

export interface BentoCellProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'
> {
  /** Cell size affecting grid span */
  size?: BentoCellSize;
  /** Cell content */
  children: ReactNode;
  /** Enable hover animation */
  hover?: boolean;
  /** Additional class names */
  className?: string;
}

const sizeStyles: Record<BentoCellSize, string> = {
  small: 'col-span-1',
  medium: 'col-span-1 md:col-span-1 lg:col-span-1',
  large: 'col-span-1 md:col-span-2',
};

/**
 * Individual bento cell wrapper with glassmorphism styling.
 * Single Responsibility: only handles cell styling and hover animation.
 */
export function BentoCell({
  size = 'medium',
  children,
  hover = true,
  className,
  ...props
}: BentoCellProps) {
  const baseClassName = cn(
    // Glassmorphism styling
    'rounded-2xl',
    'bg-white/5 backdrop-blur-md',
    'border border-white/10',
    'shadow-lg shadow-black/20',
    'overflow-hidden',
    // Size
    sizeStyles[size],
    // Transition
    hover && 'transition-all duration-300',
    className
  );

  if (hover) {
    return (
      <motion.div
        className={baseClassName}
        whileHover={{
          y: -4,
          scale: 1.02,
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClassName} {...props}>
      {children}
    </div>
  );
}
