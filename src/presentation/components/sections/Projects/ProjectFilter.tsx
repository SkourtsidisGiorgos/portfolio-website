'use client';

import { motion } from 'framer-motion';
import type { ProjectType } from '@/domain/portfolio/entities/Project';
import { cn } from '@/shared/utils/cn';

export interface FilterOption {
  id: ProjectType | 'all';
  label: string;
  count: number;
}

export interface ProjectFilterProps {
  /** Available filter options */
  options: FilterOption[];
  /** Currently selected filter */
  selected: ProjectType | 'all';
  /** Selection change handler */
  onSelect: (filter: ProjectType | 'all') => void;
  /** Additional class names */
  className?: string;
}

/**
 * Color mapping for filter options
 */
const FILTER_COLORS: Record<string, string> = {
  all: 'bg-white/10 text-white',
  oss: 'bg-success-500/20 text-success-400',
  professional: 'bg-accent-500/20 text-accent-400',
  personal: 'bg-primary-500/20 text-primary-400',
};

/**
 * Selected indicator colors
 */
const SELECTED_COLORS: Record<string, string> = {
  all: 'bg-white/20',
  oss: 'bg-success-500/30',
  professional: 'bg-accent-500/30',
  personal: 'bg-primary-500/30',
};

/**
 * Project type filter buttons.
 * Uses radiogroup pattern for accessibility.
 */
export function ProjectFilter({
  options,
  selected,
  onSelect,
  className,
}: ProjectFilterProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Filter projects by type"
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      {options.map(option => {
        const isSelected = selected === option.id;
        const colorClass = FILTER_COLORS[option.id] || FILTER_COLORS.all;
        const selectedColorClass =
          SELECTED_COLORS[option.id] || SELECTED_COLORS.all;

        return (
          <motion.button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              'focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none',
              isSelected
                ? cn(selectedColorClass, 'ring-1 ring-white/20')
                : cn(colorClass, 'hover:bg-white/15')
            )}
          >
            {/* Selected indicator */}
            {isSelected && (
              <motion.div
                layoutId="project-filter-indicator"
                className="absolute inset-0 rounded-full bg-white/5"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              {option.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs',
                  isSelected ? 'bg-white/10' : 'bg-white/5'
                )}
              >
                {option.count}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default ProjectFilter;
