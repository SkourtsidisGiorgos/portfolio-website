import type { IBaseRepository } from './IBaseRepository';
import type { Project, ProjectType } from '../entities/Project';

/**
 * Repository interface for Project entities.
 * Extends IBaseRepository with project-specific queries.
 */
export interface IProjectRepository extends IBaseRepository<Project> {
  /**
   * Find featured projects.
   */
  findFeatured(): Promise<Project[]>;

  /**
   * Find projects by type (oss, professional, personal).
   */
  findByType(type: ProjectType): Promise<Project[]>;

  /**
   * Find projects that use a specific technology.
   */
  findByTechnology(technology: string): Promise<Project[]>;
}
