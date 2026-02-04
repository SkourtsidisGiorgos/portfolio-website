import type { IBaseRepository } from './IBaseRepository';
import type { Experience } from '../entities/Experience';

/**
 * Repository interface for Experience entities.
 * Extends IBaseRepository with experience-specific queries.
 */
export interface IExperienceRepository extends IBaseRepository<Experience> {
  /**
   * Find the current (ongoing) experience.
   * Returns the experience with null end date, or null if none exists.
   */
  findCurrent(): Promise<Experience | null>;

  /**
   * Find experiences that use a specific technology.
   */
  findByTechnology(technology: string): Promise<Experience[]>;
}
