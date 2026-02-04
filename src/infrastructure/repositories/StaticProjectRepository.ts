import projectsData from '@/data/projects.json';
import type { ProjectType } from '@/domain/portfolio/entities/Project';
import { Project } from '@/domain/portfolio/entities/Project';
import type { IProjectRepository } from '@/domain/portfolio/repositories/IProjectRepository';
import { BaseStaticRepository } from './BaseStaticRepository';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  type: ProjectType;
  githubUrl: string | null;
  liveUrl: string | null;
  image: string | null;
  featured: boolean;
}

/**
 * Static implementation of IProjectRepository.
 * Loads project data from JSON file.
 */
export class StaticProjectRepository
  extends BaseStaticRepository<Project, ProjectData>
  implements IProjectRepository
{
  constructor() {
    super(projectsData as ProjectData[]);
  }

  protected mapToEntity(data: ProjectData): Project {
    return Project.create({
      id: data.id,
      title: data.title,
      description: data.description,
      technologies: data.technologies,
      type: data.type,
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      image: data.image,
      featured: data.featured,
    });
  }

  async findFeatured(): Promise<Project[]> {
    return this.filterBy(proj => proj.featured);
  }

  async findByType(type: ProjectType): Promise<Project[]> {
    return this.filterBy(proj => proj.type === type);
  }

  async findByTechnology(technology: string): Promise<Project[]> {
    return this.filterBy(proj => proj.usesTechnology(technology));
  }
}
