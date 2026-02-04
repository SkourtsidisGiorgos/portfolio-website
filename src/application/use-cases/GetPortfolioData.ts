import type { IExperienceRepository } from '@/domain/portfolio/repositories/IExperienceRepository';
import type { IProjectRepository } from '@/domain/portfolio/repositories/IProjectRepository';
import type { ISkillRepository } from '@/domain/portfolio/repositories/ISkillRepository';
import { ExperienceMapper } from '../mappers/ExperienceMapper';
import { ProjectMapper } from '../mappers/ProjectMapper';
import { SkillMapper } from '../mappers/SkillMapper';
import type { ExperienceDTO } from '../dto/ExperienceDTO';
import type { ProjectDTO } from '../dto/ProjectDTO';
import type { SkillDTO } from '../dto/SkillDTO';

/**
 * Portfolio data aggregated for the UI.
 */
export interface PortfolioDataDTO {
  experiences: ExperienceDTO[];
  projects: ProjectDTO[];
  featuredProjects: ProjectDTO[];
  skills: SkillDTO[];
  advancedSkills: SkillDTO[];
  currentExperience: ExperienceDTO | null;
}

/**
 * Use case for retrieving aggregated portfolio data.
 */
export class GetPortfolioData {
  constructor(
    private experienceRepository: IExperienceRepository,
    private projectRepository: IProjectRepository,
    private skillRepository: ISkillRepository
  ) {}

  /**
   * Execute the use case to get all portfolio data.
   */
  async execute(): Promise<PortfolioDataDTO> {
    const [
      experiences,
      projects,
      featuredProjects,
      skills,
      advancedSkills,
      currentExperience,
    ] = await Promise.all([
      this.experienceRepository.findAll(),
      this.projectRepository.findAll(),
      this.projectRepository.findFeatured(),
      this.skillRepository.findAll(),
      this.skillRepository.findAdvanced(),
      this.experienceRepository.findCurrent(),
    ]);

    return {
      experiences: ExperienceMapper.toDTOList(experiences),
      projects: ProjectMapper.toDTOList(projects),
      featuredProjects: ProjectMapper.toDTOList(featuredProjects),
      skills: SkillMapper.toDTOList(skills),
      advancedSkills: SkillMapper.toDTOList(advancedSkills),
      currentExperience: currentExperience
        ? ExperienceMapper.toDTO(currentExperience)
        : null,
    };
  }
}
