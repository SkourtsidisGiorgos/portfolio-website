'use client';

import type { Project } from '@/domain/portfolio/entities/Project';
import { cn } from '@/shared/utils/cn';
import { ProjectCard } from './ProjectCard';

export interface ProjectGridProps {
  /** Array of projects to display */
  projects: Project[];
  /** Currently selected project */
  selectedProject?: Project | null;
  /** Project click handler */
  onProjectClick?: (project: Project) => void;
  /** Number of columns (responsive by default) */
  columns?: 1 | 2 | 3 | 4;
  /** Additional class names */
  className?: string;
}

/**
 * Column class mapping
 */
const COLUMN_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

/**
 * Responsive grid of project cards.
 * Mobile-first design with configurable columns.
 */
export function ProjectGrid({
  projects,
  selectedProject = null,
  onProjectClick,
  columns = 3,
  className,
}: ProjectGridProps) {
  const gridClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES[3];

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-400">No projects found.</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', gridClass, className)}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          selected={selectedProject?.id === project.id}
          onClick={onProjectClick}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
