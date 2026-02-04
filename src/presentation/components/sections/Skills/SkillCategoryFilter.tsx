'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SkillCategory } from '@/domain/portfolio/entities/Skill';
import { Badge } from '@/presentation/components/ui/Badge';
import { Button } from '@/presentation/components/ui/Button';
import type { CategoryInfo } from '@/presentation/hooks/useSkillsGlobe';
import { cn } from '@/shared/utils/cn';

export interface SkillCategoryFilterProps {
  /** Available categories with counts */
  categories: CategoryInfo[];
  /** Currently selected category (null = all) */
  selected: SkillCategory | null;
  /** Callback when category is selected */
  onSelect: (category: SkillCategory | null) => void;
  /** Additional class names */
  className?: string;
}

/**
 * Horizontal scrollable category filter with counts.
 * Uses radiogroup pattern for accessibility.
 */
export function SkillCategoryFilter({
  categories,
  selected,
  onSelect,
  className,
}: SkillCategoryFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Scroll selected button into view on mount and selection change
  useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = selectedRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      // Check if button is outside visible area
      if (
        buttonRect.left < containerRect.left ||
        buttonRect.right > containerRect.right
      ) {
        button.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent',
        'flex gap-2 overflow-x-auto pb-2',
        className
      )}
      role="radiogroup"
      aria-label="Filter skills by category"
    >
      {/* All categories button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          ref={selected === null ? selectedRef : undefined}
          variant={selected === null ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onSelect(null)}
          role="radio"
          aria-checked={selected === null}
          className="whitespace-nowrap"
        >
          All
          <Badge
            variant="default"
            size="sm"
            animated={false}
            className="ml-1.5"
          >
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </Badge>
        </Button>
      </motion.div>

      {/* Category buttons */}
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 * (index + 1) }}
        >
          <Button
            ref={selected === category.id ? selectedRef : undefined}
            variant={selected === category.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onSelect(category.id)}
            role="radio"
            aria-checked={selected === category.id}
            className="whitespace-nowrap"
          >
            {category.label}
            <Badge
              variant="default"
              size="sm"
              animated={false}
              className="ml-1.5"
            >
              {category.count}
            </Badge>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export default SkillCategoryFilter;
