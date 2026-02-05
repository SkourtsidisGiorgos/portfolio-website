'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/presentation/components/layout/Section';
import { Typography } from '@/presentation/components/ui';
import { useSkillsGlobe } from '@/presentation/hooks/useSkillsGlobe';
import { cn } from '@/shared/utils/cn';
import { SkillCategoryFilter } from './SkillCategoryFilter';
import { SkillDetail } from './SkillDetail';
import { SkillsCanvas } from './SkillsCanvas';
import { SkillsList } from './SkillsList';

export interface SkillsProps {
  /** Section ID for navigation */
  id?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Skills section with 3D globe visualization.
 * Shows interactive globe on desktop, falls back to list on mobile.
 */
export function Skills({ id = 'skills', className }: SkillsProps) {
  const {
    skills,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedSkill,
    setSelectedSkill,
    hoveredSkill,
    setHoveredSkill,
    globeConfig,
    isWebGLSupported,
  } = useSkillsGlobe();

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <Section
      id={id}
      className={cn('relative overflow-hidden', className)}
      aria-labelledby="skills-heading"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary-500/5 absolute top-1/4 -left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent-500/5 absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
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
            Technical Skills
          </Typography>
          <Typography
            id="skills-heading"
            variant="h2"
            gradient
            className="mb-4"
          >
            Technology Stack
          </Typography>
          <Typography variant="body-lg" muted className="mx-auto max-w-2xl">
            Explore my technical expertise across big data, cloud, and software
            engineering
          </Typography>
        </motion.div>

        {/* Category filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SkillCategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            className="justify-center"
          />
        </motion.div>

        {/* Desktop: Globe with detail panel */}
        {isWebGLSupported ? (
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-6">
              {/* Globe */}
              <div className="flex-1">
                <SkillsCanvas
                  skills={skills}
                  selectedCategory={selectedCategory}
                  selectedSkill={selectedSkill}
                  config={globeConfig}
                  onSkillSelect={setSelectedSkill}
                  onSkillHover={setHoveredSkill}
                  height="500px"
                  className="rounded-xl"
                />
                {/* Globe caption */}
                <Typography
                  variant="body-sm"
                  muted
                  className="mt-3 text-center"
                >
                  Drag to rotate • Click a skill to see details
                </Typography>
              </div>

              {/* Detail panel */}
              <div className="w-80 shrink-0">
                <SkillDetail
                  skill={hoveredSkill || selectedSkill}
                  onClose={() => setSelectedSkill(null)}
                />
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Mobile/Tablet: Skills list fallback */}
        <motion.div
          className={cn(isWebGLSupported ? 'lg:hidden' : '')}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SkillsList
            skills={skills}
            groupByCategory
            selectedCategory={selectedCategory}
            selectedSkill={selectedSkill}
            onSkillClick={setSelectedSkill}
          />
        </motion.div>
      </div>
    </Section>
  );
}
