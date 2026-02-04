'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { cn } from '@/shared/utils/cn';

export interface TimelineNavProps {
  /** List of experiences */
  experiences: ExperienceDTO[];
  /** Index of the active (selected) experience */
  activeIndex: number;
  /** Callback when a navigation dot is selected */
  onSelect: (index: number) => void;
  /** Additional class names */
  className?: string;
}

/**
 * Navigation dots for quick jumping between experiences in the timeline.
 * Supports keyboard navigation with arrow keys.
 */
export function TimelineNav({
  experiences,
  activeIndex,
  onSelect,
  className,
}: TimelineNavProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      if (event.key === 'ArrowRight' && currentIndex < experiences.length - 1) {
        event.preventDefault();
        onSelect(currentIndex + 1);
      } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
        event.preventDefault();
        onSelect(currentIndex - 1);
      }
    },
    [experiences.length, onSelect]
  );

  return (
    <nav
      aria-label="Timeline navigation"
      className={cn('flex items-center justify-center gap-3', className)}
    >
      {experiences.map((exp, index) => {
        const isActive = index === activeIndex;
        const isCurrent = exp.isCurrent;

        return (
          <motion.button
            key={exp.id}
            onClick={() => onSelect(index)}
            onKeyDown={e => handleKeyDown(e, index)}
            aria-label={`${exp.company} - ${exp.role}`}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'group relative flex items-center justify-center',
              'rounded-full transition-all duration-200',
              'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
            )}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Outer ring for active state */}
            <motion.span
              className={cn(
                'absolute inset-0 rounded-full',
                isActive ? 'bg-primary-500/20' : 'bg-transparent'
              )}
              initial={false}
              animate={{
                scale: isActive ? 1 : 0.5,
                opacity: isActive ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              style={{
                width: 24,
                height: 24,
                margin: -4,
              }}
            />

            {/* Main dot */}
            <motion.span
              className={cn(
                'relative z-10 rounded-full',
                isActive
                  ? isCurrent
                    ? 'bg-primary-500'
                    : 'bg-primary-400'
                  : isCurrent
                    ? 'bg-primary-500/50'
                    : 'bg-gray-600',
                'transition-colors duration-200',
                'group-hover:bg-primary-400'
              )}
              initial={false}
              animate={{
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Tooltip on hover */}
            <span
              className={cn(
                'absolute -top-10 left-1/2 -translate-x-1/2',
                'rounded bg-gray-900/95 px-2 py-1 text-xs font-medium whitespace-nowrap text-white',
                'opacity-0 transition-opacity duration-200',
                'pointer-events-none',
                'group-hover:opacity-100 group-focus-visible:opacity-100'
              )}
            >
              {exp.company}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}

export default TimelineNav;
