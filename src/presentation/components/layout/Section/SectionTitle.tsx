'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../../ui/Typography';

export interface SectionTitleProps {
  title: ReactNode;
  subtitle?: ReactNode;
  centered?: boolean;
  className?: string;
}

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: 'easeOut',
    },
  },
};

/**
 * Animated section title with optional subtitle.
 */
export function SectionTitle({
  title,
  subtitle,
  centered = false,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn('mb-12 md:mb-16', centered && 'text-center', className)}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={titleVariants}
      >
        <Typography variant="h2" gradient>
          {title}
        </Typography>
      </motion.div>
      {subtitle && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={subtitleVariants}
        >
          <Typography variant="body-lg" muted className="mt-4 max-w-2xl">
            {subtitle}
          </Typography>
        </motion.div>
      )}
    </div>
  );
}
