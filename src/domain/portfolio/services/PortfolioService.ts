import type { Experience } from '../entities/Experience';
import type { Project } from '../entities/Project';
import type { Skill, SkillCategory } from '../entities/Skill';
import type { IExperienceRepository } from '../repositories/IExperienceRepository';
import type { IProjectRepository } from '../repositories/IProjectRepository';
import type { ISkillRepository } from '../repositories/ISkillRepository';

export interface PortfolioData {
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  currentExperience: Experience | null;
  featuredProjects: Project[];
  skillsByCategory: Map<SkillCategory, Skill[]>;
}

/**
 * Domain service that aggregates portfolio data operations.
 * Coordinates between different repositories to provide comprehensive portfolio data.
 */
export class PortfolioService {
  constructor(
    private readonly experienceRepository: IExperienceRepository,
    private readonly projectRepository: IProjectRepository,
    private readonly skillRepository: ISkillRepository
  ) {}

  /**
   * Get all portfolio data in a single call.
   */
  async getPortfolioData(): Promise<PortfolioData> {
    const [
      experiences,
      projects,
      skills,
      currentExperience,
      featuredProjects,
      categories,
    ] = await Promise.all([
      this.experienceRepository.findAll(),
      this.projectRepository.findAll(),
      this.skillRepository.findAll(),
      this.experienceRepository.findCurrent(),
      this.projectRepository.findFeatured(),
      this.skillRepository.getCategories(),
    ]);

    const skillsByCategory = new Map<SkillCategory, Skill[]>();
    for (const category of categories) {
      const categorySkills =
        await this.skillRepository.findByCategory(category);
      skillsByCategory.set(category, categorySkills);
    }

    return {
      experiences,
      projects,
      skills,
      currentExperience,
      featuredProjects,
      skillsByCategory,
    };
  }

  /**
   * Get experience timeline sorted by date.
   */
  async getExperienceTimeline(): Promise<Experience[]> {
    const experiences = await this.experienceRepository.findAll();
    return experiences.sort(
      (a, b) => b.dateRange.start.getTime() - a.dateRange.start.getTime()
    );
  }

  /**
   * Get total years of experience.
   */
  async getTotalExperienceYears(): Promise<number> {
    const experiences = await this.experienceRepository.findAll();
    let totalMonths = 0;

    for (const exp of experiences) {
      totalMonths += exp.dateRange.getDurationInMonths();
    }

    return Math.round(totalMonths / 12);
  }

  /**
   * Get all unique technologies used across experiences and projects.
   */
  async getAllTechnologies(): Promise<string[]> {
    const [experiences, projects] = await Promise.all([
      this.experienceRepository.findAll(),
      this.projectRepository.findAll(),
    ]);

    const techSet = new Set<string>();

    for (const exp of experiences) {
      for (const tech of exp.technologies.items) {
        techSet.add(tech);
      }
    }

    for (const proj of projects) {
      for (const tech of proj.technologies.items) {
        techSet.add(tech);
      }
    }

    return Array.from(techSet).sort();
  }

  /**
   * Search across all portfolio items by technology.
   */
  async searchByTechnology(technology: string): Promise<{
    experiences: Experience[];
    projects: Project[];
  }> {
    const [experiences, projects] = await Promise.all([
      this.experienceRepository.findByTechnology(technology),
      this.projectRepository.findByTechnology(technology),
    ]);

    return { experiences, projects };
  }
}
