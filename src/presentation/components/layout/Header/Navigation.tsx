'use client';

import { motion } from 'framer-motion';
import { NAV_ITEMS } from '@/shared/config/navigation';
import { cn } from '@/shared/utils/cn';

export interface NavigationProps {
  activeId: string | null;
  onNavigate: (id: string) => void;
  className?: string;
}

/**
 * Desktop navigation links with scroll spy highlighting.
 */
export function Navigation({
  activeId,
  onNavigate,
  className,
}: NavigationProps) {
  return (
    <nav className={cn('hidden items-center gap-1 md:flex', className)}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium',
            'transition-colors duration-200',
            'hover:text-white focus:outline-none focus-visible:ring-2',
            'focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'rounded-md focus-visible:ring-offset-gray-900',
            activeId === item.id ? 'text-white' : 'text-gray-400'
          )}
          aria-current={activeId === item.id ? 'page' : undefined}
        >
          {item.label}
          {activeId === item.id && (
            <motion.div
              layoutId="nav-indicator"
              className="absolute inset-0 rounded-md bg-white/10"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
