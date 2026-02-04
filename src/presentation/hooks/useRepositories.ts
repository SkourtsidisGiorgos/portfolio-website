'use client';

import type { IExperienceRepository } from '@/domain/portfolio/repositories/IExperienceRepository';
import type { IProjectRepository } from '@/domain/portfolio/repositories/IProjectRepository';
import type { ISkillRepository } from '@/domain/portfolio/repositories/ISkillRepository';
import { RepositoryContainer } from '@/infrastructure/container';

/**
 * Hook for accessing the experience repository.
 *
 * Presentation layer hook that provides access to the repository
 * through the DI container. Enables DDD layering by abstracting
 * the concrete implementation from UI components.
 *
 * @returns The experience repository instance
 */
export function useExperienceRepository(): IExperienceRepository {
  return RepositoryContainer.experienceRepository;
}

/**
 * Hook for accessing the project repository.
 *
 * @returns The project repository instance
 */
export function useProjectRepository(): IProjectRepository {
  return RepositoryContainer.projectRepository;
}

/**
 * Hook for accessing the skill repository.
 *
 * @returns The skill repository instance
 */
export function useSkillRepository(): ISkillRepository {
  return RepositoryContainer.skillRepository;
}
