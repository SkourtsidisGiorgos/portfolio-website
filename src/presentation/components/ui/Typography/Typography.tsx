'use client';

import {
  forwardRef,
  createElement,
  type HTMLAttributes,
  type ElementType,
  type ReactNode,
} from 'react';
import { cn } from '@/shared/utils/cn';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'body-lg'
  | 'body-sm'
  | 'caption';

export interface TypographyProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children'
> {
  variant?: TypographyVariant;
  as?: ElementType;
  gradient?: boolean;
  muted?: boolean;
  children?: ReactNode;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
  h2: 'text-3xl md:text-4xl font-bold tracking-tight',
  h3: 'text-2xl md:text-3xl font-semibold',
  h4: 'text-xl md:text-2xl font-semibold',
  h5: 'text-lg md:text-xl font-medium',
  h6: 'text-base md:text-lg font-medium',
  body: 'text-base leading-relaxed',
  'body-lg': 'text-lg leading-relaxed',
  'body-sm': 'text-sm leading-relaxed',
  caption: 'text-xs uppercase tracking-wide',
};

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  'body-lg': 'p',
  'body-sm': 'p',
  caption: 'span',
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body',
      as,
      gradient = false,
      muted = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || defaultElements[variant];

    return createElement(
      Component,
      {
        ref,
        className: cn(
          variantStyles[variant],
          gradient &&
            'from-primary-400 via-accent-400 to-primary-400 bg-gradient-to-r bg-clip-text text-transparent',
          muted && 'text-gray-400',
          !gradient && !muted && 'text-white',
          className
        ),
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';
