import type { Project, ProjectType } from '../entities/Project';

/**
 * Repository interface for Project entities.
 * Implementations should provide data access for projects.
 */
export interface IProjectRepository {
  /**
   * Find all projects.
   */
  findAll(): Promise<Project[]>;

  /**
   * Find a project by its ID.
   */
  findById(id: string): Promise<Project | null>;

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
