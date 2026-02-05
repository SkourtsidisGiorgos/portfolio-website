'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/presentation/components/layout/Section';
import { Typography } from '@/presentation/components/ui';
import { useProjectShowcase } from '@/presentation/hooks/useProjectShowcase';
import { cn } from '@/shared/utils/cn';
import { ProjectFilter } from './ProjectFilter';
import { ProjectGrid } from './ProjectGrid';
import { ProjectModal } from './ProjectModal';
import { ProjectsCanvas } from './ProjectsCanvas';

export interface ProjectsProps {
  /** Section ID for navigation */
  id?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Projects section with 3D showcase and 2D grid.
 * Shows interactive 3D cards on desktop, falls back to grid on mobile.
 */
export function Projects({ id = 'projects', className }: ProjectsProps) {
  const {
    filteredProjects,
    filterOptions,
    selectedFilter,
    setSelectedFilter,
    selectedProject,
    setSelectedProject,
    hoveredProject,
    setHoveredProject,
    isWebGLSupported,
  } = useProjectShowcase();

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <Section
      id={id}
      className={cn('relative overflow-hidden', className)}
      aria-labelledby="projects-heading"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary-500/5 absolute -top-1/4 -left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent-500/5 absolute top-1/4 -right-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-success-500/3 absolute bottom-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" />
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
            Featured Work
          </Typography>
          <Typography
            id="projects-heading"
            variant="h2"
            gradient
            className="mb-4"
          >
            Projects
          </Typography>
          <Typography variant="body-lg" muted className="mx-auto max-w-2xl">
            A selection of projects showcasing my expertise in big data,
            software engineering, and open-source contributions
          </Typography>
        </motion.div>

        {/* Filter controls */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProjectFilter
            options={filterOptions}
            selected={selectedFilter}
            onSelect={setSelectedFilter}
            className="justify-center"
          />
        </motion.div>

        {/* Desktop: 3D showcase */}
        {isWebGLSupported ? (
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProjectsCanvas
              projects={filteredProjects}
              selectedProject={selectedProject}
              layout={filteredProjects.length <= 1 ? 'featured' : 'grid'}
              columns={3}
              onProjectSelect={setSelectedProject}
              onProjectHover={setHoveredProject}
              height="600px"
              className="rounded-xl"
            />
            {/* Canvas caption */}
            <Typography variant="body-sm" muted className="mt-3 text-center">
              Drag to rotate • Double-click to flip • Click to view details
            </Typography>
          </motion.div>
        ) : null}

        {/* Mobile/Tablet: Grid fallback */}
        <motion.div
          className={cn(isWebGLSupported ? 'lg:hidden' : '')}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ProjectGrid
            projects={filteredProjects}
            selectedProject={selectedProject}
            onProjectClick={setSelectedProject}
            columns={3}
          />
        </motion.div>

        {/* Hovered project hint (desktop only) */}
        {hoveredProject && isWebGLSupported && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none fixed bottom-8 left-1/2 z-40 hidden -translate-x-1/2 lg:block"
          >
            <div className="rounded-lg bg-gray-900/90 px-4 py-2 shadow-xl backdrop-blur-sm">
              <Typography variant="body-sm" className="text-white">
                Click on{' '}
                <span className="text-primary-400 font-medium">
                  {hoveredProject.title}
                </span>{' '}
                to view details
              </Typography>
            </div>
          </motion.div>
        )}
      </div>

      {/* Project detail modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </Section>
  );
}
