import experiencesData from '@/data/experiences.json';
import { Experience } from '@/domain/portfolio/entities/Experience';
import type { IExperienceRepository } from '@/domain/portfolio/repositories/IExperienceRepository';
import { BaseStaticRepository } from './BaseStaticRepository';

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
export class StaticExperienceRepository
  extends BaseStaticRepository<Experience, ExperienceData>
  implements IExperienceRepository
{
  constructor() {
    super(experiencesData as ExperienceData[]);
  }

  protected mapToEntity(data: ExperienceData): Experience {
    return Experience.create({
      id: data.id,
      company: data.company,
      role: data.role,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      remote: data.remote,
      description: data.description,
      technologies: data.technologies,
    });
  }

  override async findAll(): Promise<Experience[]> {
    const all = await super.findAll();
    return all.sort(
      (a, b) => b.dateRange.start.getTime() - a.dateRange.start.getTime()
    );
  }

  async findCurrent(): Promise<Experience | null> {
    return this.findBy(exp => exp.isCurrent());
  }

  async findByTechnology(technology: string): Promise<Experience[]> {
    return this.filterBy(exp => exp.usesTechnology(technology));
  }
}
