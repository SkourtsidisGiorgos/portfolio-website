'use client';

import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export type LoaderSize = 'sm' | 'md' | 'lg';

export interface LoaderProps {
  size?: LoaderSize;
  className?: string;
  label?: string;
}

const sizeStyles: Record<LoaderSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function Loader({
  size = 'md',
  className,
  label = 'Loading...',
}: LoaderProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block', className)}
    >
      <motion.span
        className={cn(
          'block rounded-full',
          'border-2 border-current border-t-transparent',
          sizeStyles[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
