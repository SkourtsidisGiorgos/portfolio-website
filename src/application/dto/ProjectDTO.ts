import type { ProjectType } from '@/domain/portfolio/entities/Project';

/**
 * Data Transfer Object for Project.
 * UI-ready project data structure.
 */
export interface ProjectDTO {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  type: ProjectType;
  typeLabel: string; // Human-readable type
  githubUrl: string | null;
  liveUrl: string | null;
  image: string | null;
  featured: boolean;
  isOpenSource: boolean;
}
