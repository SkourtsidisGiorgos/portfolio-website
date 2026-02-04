'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import { useScrollSpy, useScrollTo } from '@/presentation/hooks/useScrollSpy';
import { NAV_ITEMS } from '@/shared/config/navigation';
import { Container } from '../Container';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';

export interface HeaderProps {
  className?: string;
}

/**
 * Fixed header with navigation and mobile menu.
 */
export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const sectionIds = NAV_ITEMS.map(item => item.id);
  const activeId = useScrollSpy({ sectionIds });
  const scrollTo = useScrollTo();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (id: string) => {
    scrollTo(id);
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 right-0 left-0 z-50',
        'transition-all duration-300',
        isScrolled
          ? 'border-b border-white/10 bg-gray-900/80 backdrop-blur-lg'
          : 'bg-transparent',
        className
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="hover:text-primary-400 text-xl font-bold text-white transition-colors"
          >
            <span className="sr-only">Home</span>
            GS
          </button>

          {/* Desktop Navigation */}
          <Navigation activeId={activeId} onNavigate={handleNavigate} />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              'rounded-lg p-2 md:hidden',
              'text-gray-400 hover:text-white',
              'focus:outline-none focus-visible:ring-2',
              'focus-visible:ring-primary-500'
            )}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeId={activeId}
        onNavigate={handleNavigate}
      />
    </motion.header>
  );
}
