'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

// Omit props that conflict with Framer Motion
type SafeSpanProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'
>;

export interface BadgeProps extends SafeSpanProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  animated?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-gray-300',
  primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
  secondary: 'bg-accent-500/20 text-accent-300 border border-accent-500/30',
  outline: 'bg-transparent border border-white/20 text-gray-300',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      animated = true,
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseClassName = cn(
      'inline-flex items-center gap-1.5',
      'rounded-full font-medium',
      'transition-colors duration-200',
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    const content = (
      <>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </>
    );

    if (animated) {
      return (
        <motion.span
          ref={ref}
          className={baseClassName}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          {...props}
        >
          {content}
        </motion.span>
      );
    }

    return (
      <span ref={ref} className={baseClassName} {...props}>
        {content}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
