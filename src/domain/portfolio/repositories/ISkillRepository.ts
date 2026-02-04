import type { IBaseRepository } from './IBaseRepository';
import type { Skill, SkillCategory } from '../entities/Skill';

/**
 * Repository interface for Skill entities.
 * Extends IBaseRepository with skill-specific queries.
 */
export interface ISkillRepository extends IBaseRepository<Skill> {
  /**
   * Find skills by category.
   */
  findByCategory(category: SkillCategory): Promise<Skill[]>;

  /**
   * Find skills that are expert or advanced level.
   */
  findAdvanced(): Promise<Skill[]>;

  /**
   * Get all unique categories that have skills.
   */
  getCategories(): Promise<SkillCategory[]>;
}
