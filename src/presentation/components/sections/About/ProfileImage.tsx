'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export interface ProfileImageProps {
  /** Image source URL */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Additional class names */
  className?: string;
  /** Whether to show placeholder when no image */
  showPlaceholder?: boolean;
}

/**
 * Animated profile image with 3D hover effect.
 * Single Responsibility: only handles image display with effects.
 */
export function ProfileImage({
  src,
  alt = 'Profile photo',
  width = 300,
  height = 300,
  className,
  showPlaceholder = true,
}: ProfileImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const shouldShowPlaceholder = !src || imageError;

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'from-primary-500/20 to-accent-500/20 bg-gradient-to-br',
        'border border-white/10',
        'shadow-primary-500/20 shadow-2xl',
        className
      )}
      style={{
        perspective: '1000px',
        width,
        height,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 3D rotating container */}
      <motion.div
        className="relative h-full w-full"
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {shouldShowPlaceholder && showPlaceholder ? (
          // Placeholder avatar
          <div className="from-primary-500/30 to-accent-500/30 flex h-full w-full items-center justify-center bg-gradient-to-br">
            <svg
              className="h-24 w-24 text-white/30"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        ) : (
          // Actual image
          <Image
            src={src || ''}
            alt={alt}
            width={width}
            height={height}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
            priority
          />
        )}

        {/* Glassmorphism overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Decorative glow */}
        <motion.div
          className="from-primary-500 to-accent-500 absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r opacity-0 blur-xl"
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 ring-inset" />
    </motion.div>
  );
}
