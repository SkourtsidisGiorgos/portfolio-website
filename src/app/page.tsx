'use client';

import { Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero } from '@/presentation/components/sections/Hero';

// Lazy load heavy sections for better initial performance
const About = lazy(() =>
  import('@/presentation/components/sections/About').then(m => ({
    default: m.About,
  }))
);
const Skills = lazy(() =>
  import('@/presentation/components/sections/Skills').then(m => ({
    default: m.Skills,
  }))
);
const Experience = lazy(() =>
  import('@/presentation/components/sections/Experience').then(m => ({
    default: m.Experience,
  }))
);
const Projects = lazy(() =>
  import('@/presentation/components/sections/Projects').then(m => ({
    default: m.Projects,
  }))
);
const Contact = lazy(() =>
  import('@/presentation/components/sections/Contact').then(m => ({
    default: m.Contact,
  }))
);

/**
 * Section loading fallback with skeleton
 */
function SectionSkeleton({ height = 'min-h-[600px]' }: { height?: string }) {
  return (
    <div className={`${height} flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Animated gradient divider between sections
 */
function SectionDivider() {
  return (
    <div className="relative py-4">
      <div className="section-divider" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glow-orb glow-orb--primary h-32 w-32" />
      </div>
    </div>
  );
}

/**
 * Floating glow orbs for ambient background effects
 */
function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Top right primary glow */}
      <motion.div
        className="glow-orb glow-orb--primary absolute -top-32 -right-32 h-96 w-96"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Bottom left accent glow */}
      <motion.div
        className="glow-orb glow-orb--accent absolute -bottom-32 -left-32 h-96 w-96"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Center success glow */}
      <motion.div
        className="glow-orb glow-orb--success absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
    </div>
  );
}

/**
 * Progress indicator showing scroll position
 */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-50 h-1 origin-left bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500"
      style={{ scaleX }}
    />
  );
}

/**
 * Section wrapper with reveal animation
 */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Main Portfolio Page
 *
 * Assembles all sections with beautiful transitions and visual effects.
 * Uses lazy loading for performance optimization.
 */
export default function Home() {
  return (
    <>
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Ambient floating glow effects */}
      <AmbientGlow />

      {/* Subtle noise texture overlay */}
      <div className="noise-overlay" />

      {/* Grid pattern background */}
      <div className="grid-pattern pointer-events-none fixed inset-0 -z-20" />

      {/* Hero Section - Full screen immersive experience */}
      <Hero />

      {/* About Section */}
      <SectionDivider />
      <AnimatedSection>
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>
      </AnimatedSection>

      {/* Skills Section - with darker background for contrast */}
      <SectionDivider />
      <AnimatedSection className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent" />
        <Suspense fallback={<SectionSkeleton />}>
          <Skills />
        </Suspense>
      </AnimatedSection>

      {/* Experience Section */}
      <SectionDivider />
      <AnimatedSection delay={0.1}>
        <Suspense fallback={<SectionSkeleton />}>
          <Experience />
        </Suspense>
      </AnimatedSection>

      {/* Projects Section - with darker background */}
      <SectionDivider />
      <AnimatedSection className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent" />
        <Suspense fallback={<SectionSkeleton />}>
          <Projects />
        </Suspense>
      </AnimatedSection>

      {/* Contact Section */}
      <SectionDivider />
      <AnimatedSection delay={0.1}>
        <Suspense fallback={<SectionSkeleton />}>
          <Contact />
        </Suspense>
      </AnimatedSection>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </>
  );
}
