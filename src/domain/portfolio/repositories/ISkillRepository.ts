import type { Skill, SkillCategory } from '../entities/Skill';

/**
 * Repository interface for Skill entities.
 * Implementations should provide data access for skills.
 */
export interface ISkillRepository {
  /**
   * Find all skills.
   */
  findAll(): Promise<Skill[]>;

  /**
   * Find a skill by its ID.
   */
  findById(id: string): Promise<Skill | null>;

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
