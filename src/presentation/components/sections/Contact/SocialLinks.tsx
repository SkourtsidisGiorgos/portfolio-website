'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export interface SocialLink {
  name: string;
  url: string;
  icon: 'github' | 'linkedin' | 'email';
  label: string;
}

export interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

const iconPaths: Record<string, ReactNode> = {
  github: (
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
  ),
  linkedin: (
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  ),
  email: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  ),
};

/**
 * Social media links component with hover animations.
 * Accessible with proper link text for screen readers.
 */
export function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <div className={cn('flex gap-4', className)}>
      {links.map((link, index) => (
        <motion.a
          key={link.name}
          href={link.url}
          target={link.icon !== 'email' ? '_blank' : undefined}
          rel={link.icon !== 'email' ? 'noopener noreferrer' : undefined}
          className="group focus:ring-primary-500/50 relative rounded-full bg-white/5 p-3 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:ring-2 focus:outline-none"
          aria-label={link.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="h-6 w-6"
            fill={link.icon === 'email' ? 'none' : 'currentColor'}
            viewBox="0 0 24 24"
            strokeWidth={link.icon === 'email' ? 1.5 : undefined}
            stroke={link.icon === 'email' ? 'currentColor' : undefined}
            aria-hidden="true"
          >
            {iconPaths[link.icon]}
          </svg>
          {/* Tooltip */}
          <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-sm whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
            {link.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
