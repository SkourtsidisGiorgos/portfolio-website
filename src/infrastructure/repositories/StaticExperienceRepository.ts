import experiencesData from '@/data/experiences.json';
import { Experience } from '@/domain/portfolio/entities/Experience';
import type { IExperienceRepository } from '@/domain/portfolio/repositories/IExperienceRepository';

interface ExperienceData {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  location: string;
  remote: boolean;
  description: string[];
  technologies: string[];
}

/**
 * Static implementation of IExperienceRepository.
 * Loads experience data from JSON file.
 */
export class StaticExperienceRepository implements IExperienceRepository {
  private experiences: Experience[];

  constructor() {
    this.experiences = this.loadExperiences();
  }

  private loadExperiences(): Experience[] {
    return (experiencesData as ExperienceData[]).map(data =>
      Experience.create({
        id: data.id,
        company: data.company,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        remote: data.remote,
        description: data.description,
        technologies: data.technologies,
      })
    );
  }

  async findAll(): Promise<Experience[]> {
    return [...this.experiences].sort(
      (a, b) => b.dateRange.start.getTime() - a.dateRange.start.getTime()
    );
  }

  async findById(id: string): Promise<Experience | null> {
    return this.experiences.find(exp => exp.id === id) ?? null;
  }

  async findCurrent(): Promise<Experience | null> {
    return this.experiences.find(exp => exp.isCurrent()) ?? null;
  }

  async findByTechnology(technology: string): Promise<Experience[]> {
    return this.experiences.filter(exp => exp.usesTechnology(technology));
  }
}
