'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'outline';
  hover?: boolean;
  children: ReactNode;
}

const variantStyles = {
  glass: 'bg-white/5 backdrop-blur-md border border-white/10',
  solid: 'bg-gray-800/80 border border-gray-700/50',
  outline: 'bg-transparent border border-gray-700',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'glass', hover = true, className, children, ...props }, ref) => {
    const Component = hover ? motion.div : 'div';

    const hoverProps = hover
      ? {
          whileHover: {
            y: -4,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          },
          transition: { duration: 0.2 },
        }
      : {};

    return (
      <Component
        ref={ref}
        className={cn(
          'overflow-hidden rounded-xl',
          variantStyles[variant],
          'shadow-lg shadow-black/20',
          hover && 'transition-shadow duration-200',
          className
        )}
        {...hoverProps}
        {...(props as HTMLMotionProps<'div'>)}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-b border-white/10 px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-t border-white/10 px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';
