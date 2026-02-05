'use client';

import { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/presentation/components/layout/Section';
import { Typography } from '@/presentation/components/ui';
import { useExperienceTimeline } from '@/presentation/hooks/useExperienceTimeline';
import { cn } from '@/shared/utils/cn';
import { ExperienceCanvas } from './ExperienceCanvas';
import { ExperienceCard } from './ExperienceCard';
import { ExperienceList } from './ExperienceList';
import { TimelineNav } from './TimelineNav';

export interface ExperienceProps {
  /** Section ID for navigation */
  id?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Experience section with 3D timeline visualization.
 * Shows interactive timeline on desktop, falls back to list on mobile.
 */
export function Experience({ id = 'experience', className }: ExperienceProps) {
  const {
    experiences,
    totalYears,
    selectedExperience,
    setSelectedExperience,
    hoveredExperience,
    setHoveredExperience,
    timelineConfig,
    isWebGLSupported,
  } = useExperienceTimeline();

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Find active index for TimelineNav
  const activeIndex = useMemo(() => {
    if (!selectedExperience && !hoveredExperience) return 0;
    const exp = selectedExperience || hoveredExperience;
    return experiences.findIndex(e => e.id === exp?.id);
  }, [experiences, selectedExperience, hoveredExperience]);

  // Handle navigation dot selection
  const handleNavSelect = (index: number) => {
    setSelectedExperience(experiences[index]);
  };

  return (
    <Section
      id={id}
      className={cn('relative overflow-hidden', className)}
      aria-labelledby="experience-heading"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary-500/5 absolute top-1/3 -left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent-500/5 absolute -right-1/4 bottom-1/3 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-success-500/3 absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div ref={sectionRef} className="relative">
        {/* Section header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="caption" className="text-primary-400 mb-2">
            Professional Journey
          </Typography>
          <Typography
            id="experience-heading"
            variant="h2"
            gradient
            className="mb-4"
          >
            Work Experience
          </Typography>
          <Typography variant="body-lg" muted className="mx-auto max-w-2xl">
            {totalYears}+ years building scalable data systems and software
            solutions across telecommunications and fintech
          </Typography>
        </motion.div>

        {/* Desktop: 3D Timeline with detail panel */}
        {isWebGLSupported ? (
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-6">
              {/* Timeline */}
              <div className="flex-1">
                <ExperienceCanvas
                  experiences={experiences}
                  selectedExperience={selectedExperience}
                  config={timelineConfig}
                  onExperienceSelect={setSelectedExperience}
                  onExperienceHover={setHoveredExperience}
                  height="450px"
                  className="rounded-xl"
                />
                {/* Timeline caption */}
                <Typography
                  variant="body-sm"
                  muted
                  className="mt-3 text-center"
                >
                  Drag to rotate • Click a node to see details
                </Typography>
              </div>

              {/* Detail panel */}
              <div className="w-80 shrink-0">
                <ExperienceCard
                  experience={hoveredExperience || selectedExperience}
                  onClose={() => setSelectedExperience(null)}
                />
              </div>
            </div>

            {/* Timeline navigation */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TimelineNav
                experiences={experiences}
                activeIndex={activeIndex >= 0 ? activeIndex : 0}
                onSelect={handleNavSelect}
              />
            </motion.div>
          </motion.div>
        ) : null}

        {/* Mobile/Tablet: Experience list fallback */}
        <motion.div
          className={cn(isWebGLSupported ? 'lg:hidden' : '')}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ExperienceList
            experiences={experiences}
            selectedExperience={selectedExperience}
            onExperienceClick={setSelectedExperience}
          />
        </motion.div>
      </div>
    </Section>
  );
}
