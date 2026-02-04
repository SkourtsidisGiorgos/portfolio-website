import { Project, ProjectType } from '@/domain/portfolio/entities/Project';
import { IProjectRepository } from '@/domain/portfolio/repositories/IProjectRepository';
import projectsData from '@/data/projects.json';

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
export class StaticProjectRepository implements IProjectRepository {
  private projects: Project[];

  constructor() {
    this.projects = this.loadProjects();
  }

  private loadProjects(): Project[] {
    return (projectsData as ProjectData[]).map(data =>
      Project.create({
        id: data.id,
        title: data.title,
        description: data.description,
        technologies: data.technologies,
        type: data.type,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        image: data.image,
        featured: data.featured,
      })
    );
  }

  async findAll(): Promise<Project[]> {
    return [...this.projects];
  }

  async findById(id: string): Promise<Project | null> {
    return this.projects.find(proj => proj.id === id) ?? null;
  }

  async findFeatured(): Promise<Project[]> {
    return this.projects.filter(proj => proj.featured);
  }

  async findByType(type: ProjectType): Promise<Project[]> {
    return this.projects.filter(proj => proj.type === type);
  }

  async findByTechnology(technology: string): Promise<Project[]> {
    return this.projects.filter(proj => proj.usesTechnology(technology));
  }
}
