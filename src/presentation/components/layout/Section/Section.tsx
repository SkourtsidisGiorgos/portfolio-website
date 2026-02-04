'use client';

import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';
import { Container } from '../Container';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
  className?: string;
}

/**
 * Section wrapper with consistent padding and optional container.
 */
export function Section({
  children,
  id,
  fullWidth = false,
  noPadding = false,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative',
        !noPadding && 'py-16 md:py-24 lg:py-32',
        className
      )}
      {...props}
    >
      {fullWidth ? children : <Container>{children}</Container>}
    </section>
  );
}
