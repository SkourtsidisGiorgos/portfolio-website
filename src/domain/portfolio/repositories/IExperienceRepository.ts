import { Experience } from '../entities/Experience';

/**
 * Repository interface for Experience entities.
 * Implementations should provide data access for work experiences.
 */
export interface IExperienceRepository {
  /**
   * Find all experiences, ordered by start date descending.
   */
  findAll(): Promise<Experience[]>;

  /**
   * Find an experience by its ID.
   */
  findById(id: string): Promise<Experience | null>;

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
