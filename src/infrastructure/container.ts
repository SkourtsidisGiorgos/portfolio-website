import type { IExperienceRepository } from '@/domain/portfolio/repositories/IExperienceRepository';
import type { IProjectRepository } from '@/domain/portfolio/repositories/IProjectRepository';
import type { ISkillRepository } from '@/domain/portfolio/repositories/ISkillRepository';
import { StaticExperienceRepository } from './repositories/StaticExperienceRepository';
import { StaticProjectRepository } from './repositories/StaticProjectRepository';
import { StaticSkillRepository } from './repositories/StaticSkillRepository';

/**
 * Repository overrides for testing or alternative implementations.
 */
export interface RepositoryOverrides {
  experienceRepository?: IExperienceRepository;
  projectRepository?: IProjectRepository;
  skillRepository?: ISkillRepository;
}

/**
 * Dependency injection container for repository instances.
 *
 * Implements a simple singleton pattern for repository access.
 * Supports override for testing (DIP - Dependency Inversion).
 *
 * Usage:
 * ```typescript
 * // Normal usage
 * const repo = RepositoryContainer.experienceRepository;
 *
 * // Testing
 * RepositoryContainer.override({ experienceRepository: mockRepo });
 * // ... run tests
 * RepositoryContainer.reset();
 * ```
 */
export class RepositoryContainer {
  private static _experienceRepository: IExperienceRepository | null = null;
  private static _projectRepository: IProjectRepository | null = null;
  private static _skillRepository: ISkillRepository | null = null;

  private static _overrides: RepositoryOverrides = {};

  /**
   * Get the experience repository instance.
   */
  static get experienceRepository(): IExperienceRepository {
    if (this._overrides.experienceRepository) {
      return this._overrides.experienceRepository;
    }
    if (!this._experienceRepository) {
      this._experienceRepository = new StaticExperienceRepository();
    }
    return this._experienceRepository;
  }

  /**
   * Get the project repository instance.
   */
  static get projectRepository(): IProjectRepository {
    if (this._overrides.projectRepository) {
      return this._overrides.projectRepository;
    }
    if (!this._projectRepository) {
      this._projectRepository = new StaticProjectRepository();
    }
    return this._projectRepository;
  }

  /**
   * Get the skill repository instance.
   */
  static get skillRepository(): ISkillRepository {
    if (this._overrides.skillRepository) {
      return this._overrides.skillRepository;
    }
    if (!this._skillRepository) {
      this._skillRepository = new StaticSkillRepository();
    }
    return this._skillRepository;
  }

  /**
   * Override repositories for testing.
   */
  static override(overrides: RepositoryOverrides): void {
    this._overrides = { ...this._overrides, ...overrides };
  }

  /**
   * Reset all overrides and cached instances.
   * Call this in test cleanup.
   */
  static reset(): void {
    this._overrides = {};
    this._experienceRepository = null;
    this._projectRepository = null;
    this._skillRepository = null;
  }
}
