import { RepositoryContainer } from '@/infrastructure/container';
import { GetExperienceTimeline } from './GetExperienceTimeline';
import { GetPortfolioData } from './GetPortfolioData';

/**
 * Factory for instantiating use cases with repository dependencies.
 *
 * This factory connects the application layer to the infrastructure layer
 * through the dependency injection container. Use cases are instantiated
 * with the appropriate repository implementations.
 *
 * Usage:
 * ```typescript
 * const timeline = await UseCaseFactory.getExperienceTimeline().execute();
 * const portfolio = await UseCaseFactory.getPortfolioData().execute();
 * ```
 */
export class UseCaseFactory {
  /**
   * Create a GetExperienceTimeline use case instance.
   */
  static getExperienceTimeline(): GetExperienceTimeline {
    return new GetExperienceTimeline(RepositoryContainer.experienceRepository);
  }

  /**
   * Create a GetPortfolioData use case instance.
   */
  static getPortfolioData(): GetPortfolioData {
    return new GetPortfolioData(
      RepositoryContainer.experienceRepository,
      RepositoryContainer.projectRepository,
      RepositoryContainer.skillRepository
    );
  }
}
