'use client';

import { useReducedMotion } from 'framer-motion';
import { Section } from '@/presentation/components/layout/Section';
import type { PipelineConfig } from '@/presentation/three/scenes/HeroScene';
import { HeroCanvas } from './HeroCanvas';
import { HeroContent, type CTAButton } from './HeroContent';
import { ScrollIndicator } from './ScrollIndicator';

export interface HeroProps {
  /** Main title (usually name) */
  title?: string;
  /** Subtitle (usually role/profession) */
  subtitle?: string;
  /** Description text */
  description?: string;
  /** Call-to-action buttons */
  ctaButtons?: CTAButton[];
  /** Override pipeline configuration */
  pipelineConfig?: PipelineConfig;
  /** Quality level override */
  quality?: 'high' | 'medium' | 'low';
  /** Show scroll indicator */
  showScrollIndicator?: boolean;
  /** Disable 3D scene */
  disable3D?: boolean;
  /** CSS class name */
  className?: string;
}

// Default content
const DEFAULT_TITLE = 'Giorgos Skourtsidis';
const DEFAULT_SUBTITLE = 'Big Data & Software Engineer';
const DEFAULT_DESCRIPTION =
  'Transforming raw data into actionable insights through elegant engineering solutions. Specializing in ETL pipelines, distributed systems, and cloud architecture.';
const DEFAULT_CTA_BUTTONS: CTAButton[] = [
  { label: 'View Projects', href: '#projects', variant: 'primary' },
  { label: 'Contact Me', href: '#contact', variant: 'outline' },
];

/**
 * Hero section with 3D ETL pipeline visualization.
 * Combines immersive 3D background with accessible content overlay.
 */
export function Hero({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  description = DEFAULT_DESCRIPTION,
  ctaButtons = DEFAULT_CTA_BUTTONS,
  pipelineConfig,
  quality,
  showScrollIndicator = true,
  disable3D = false,
  className = '',
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  // Respect user's motion preferences
  const effectiveDisable3D = disable3D || shouldReduceMotion;
  const effectiveQuality = shouldReduceMotion ? 'low' : quality;

  return (
    <Section
      id="hero"
      className={`relative min-h-screen overflow-hidden ${className}`}
      fullWidth
      noPadding
    >
      {/* Skip link target */}
      <a
        href="#main-content"
        className="focus:bg-primary-500 sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {/* 3D Canvas Background */}
      {!effectiveDisable3D && (
        <div className="absolute inset-0">
          <HeroCanvas
            config={pipelineConfig}
            quality={effectiveQuality}
            paused={shouldReduceMotion ?? false}
            enableParallax={!shouldReduceMotion}
          />
        </div>
      )}

      {/* Fallback background for disabled 3D */}
      {effectiveDisable3D && (
        <div className="bg-background-primary absolute inset-0">
          <div className="from-primary-900/20 absolute inset-0 bg-gradient-to-br to-transparent" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <HeroContent
            title={title}
            subtitle={subtitle}
            description={description}
            ctaButtons={ctaButtons}
            className="max-w-2xl"
          />
        </div>

        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div className="absolute inset-x-0 bottom-8 flex justify-center">
            <ScrollIndicator />
          </div>
        )}
      </div>

      {/* Gradient overlay for text readability */}
      <div className="from-background-primary/80 via-background-primary/40 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent" />

      {/* Bottom gradient for transition to next section */}
      <div className="from-background-primary pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent" />

      {/* Main content anchor for skip link */}
      <div id="main-content" className="sr-only">
        Main content starts here
      </div>
    </Section>
  );
}

export default Hero;
