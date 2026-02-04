'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Typography } from '@/presentation/components/ui/Typography';
import { cn } from '@/shared/utils/cn';

export interface CTAButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
}

const buttonVariantStyles: Record<string, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500/50',
  secondary:
    'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500/50',
  ghost: 'bg-transparent text-gray-300 hover:bg-white/10 focus:ring-white/20',
  outline:
    'border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 focus:ring-primary-500/50',
};

const buttonBaseStyles = cn(
  'inline-flex items-center justify-center gap-2',
  'rounded-lg font-medium',
  'transition-colors duration-200',
  'focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none',
  'px-6 py-3 text-lg'
);

export interface HeroContentProps {
  /** Main title (usually name) */
  title: string;
  /** Subtitle (usually role/profession) */
  subtitle: string;
  /** Description text */
  description?: string;
  /** Call-to-action buttons */
  ctaButtons?: CTAButton[];
  /** CSS class name */
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

/**
 * Hero section text content with animated entrance.
 * Includes title, subtitle, description, and CTA buttons.
 */
export function HeroContent({
  title,
  subtitle,
  description,
  ctaButtons = [],
  className = '',
}: HeroContentProps) {
  return (
    <motion.div
      className={`flex flex-col gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Subtitle (role) */}
      <motion.div variants={itemVariants}>
        <Typography variant="caption" className="text-primary-500">
          {subtitle}
        </Typography>
      </motion.div>

      {/* Main title (name) */}
      <motion.div variants={itemVariants}>
        <Typography
          as="h1"
          variant="h1"
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title}
        </Typography>
      </motion.div>

      {/* Description */}
      {description && (
        <motion.div variants={itemVariants}>
          <Typography variant="body" className="max-w-xl text-gray-400">
            {description}
          </Typography>
        </motion.div>
      )}

      {/* CTA Buttons */}
      {ctaButtons.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-4 pt-4"
        >
          {ctaButtons.map((button, index) => (
            <Link
              key={index}
              href={button.href}
              className={cn(
                buttonBaseStyles,
                buttonVariantStyles[
                  button.variant ?? (index === 0 ? 'primary' : 'outline')
                ]
              )}
            >
              {button.label}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default HeroContent;
