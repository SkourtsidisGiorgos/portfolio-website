'use client';

import { motion } from 'framer-motion';
import { useScrollProgress } from '@/presentation/three/hooks/useScrollProgress';

export interface ScrollIndicatorProps {
  /** Text to display */
  text?: string;
  /** Scroll threshold to hide (0-1) */
  hideThreshold?: number;
  /** CSS class name */
  className?: string;
}

/**
 * Animated scroll indicator with bouncing arrow.
 * Fades out as user scrolls down.
 */
export function ScrollIndicator({
  text = 'Scroll to explore',
  hideThreshold = 0.1,
  className = '',
}: ScrollIndicatorProps) {
  const { progress } = useScrollProgress();

  // Calculate opacity based on scroll progress
  const opacity = Math.max(0, 1 - progress / hideThreshold);

  if (opacity <= 0) return null;

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      aria-hidden="true"
    >
      {/* Text */}
      <span className="text-sm text-gray-400">{text}</span>

      {/* Bouncing arrow */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary-500"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default ScrollIndicator;
