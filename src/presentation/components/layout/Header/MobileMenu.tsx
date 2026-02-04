'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import { NAV_ITEMS } from '@/shared/config/navigation';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeId: string | null;
  onNavigate: (id: string) => void;
}

const menuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

/**
 * Mobile navigation menu with animations.
 */
export function MobileMenu({
  isOpen,
  onClose,
  activeId,
  onNavigate,
}: MobileMenuProps) {
  const handleNavigate = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="overflow-hidden md:hidden"
        >
          <nav className="space-y-1 border-t border-white/10 px-4 py-4">
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                custom={i}
                variants={itemVariants}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  'block w-full rounded-lg px-4 py-3 text-left',
                  'text-base font-medium transition-colors',
                  'focus:outline-none focus-visible:ring-2',
                  'focus-visible:ring-primary-500',
                  activeId === item.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
                aria-current={activeId === item.id ? 'page' : undefined}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
