import { TechStack } from '../value-objects/TechStack';

export type ProjectType = 'oss' | 'professional' | 'personal';

export interface ProjectProps {
  id: string;
  title: string;
  description: string;
  technologies: TechStack;
  type: ProjectType;
  githubUrl: string | null;
  liveUrl: string | null;
  image: string | null;
  featured: boolean;
}

/**
 * Entity representing a project.
 */
export class Project {
  private constructor(private readonly props: ProjectProps) {}

  static create(props: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    type?: ProjectType;
    githubUrl?: string | null;
    liveUrl?: string | null;
    image?: string | null;
    featured?: boolean;
  }): Project {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Project ID is required');
    }
    if (!props.title || props.title.trim() === '') {
      throw new Error('Project title is required');
    }
    if (!props.description || props.description.trim() === '') {
      throw new Error('Project description is required');
    }

    return new Project({
      id: props.id.trim(),
      title: props.title.trim(),
      description: props.description.trim(),
      technologies: TechStack.create(props.technologies),
      type: props.type ?? 'personal',
      githubUrl: props.githubUrl ?? null,
      liveUrl: props.liveUrl ?? null,
      image: props.image ?? null,
      featured: props.featured ?? false,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get technologies(): TechStack {
    return this.props.technologies;
  }

  get type(): ProjectType {
    return this.props.type;
  }

  get githubUrl(): string | null {
    return this.props.githubUrl;
  }

  get liveUrl(): string | null {
    return this.props.liveUrl;
  }

  get image(): string | null {
    return this.props.image;
  }

  get featured(): boolean {
    return this.props.featured;
  }

  hasGithub(): boolean {
    return this.props.githubUrl !== null;
  }

  hasLiveDemo(): boolean {
    return this.props.liveUrl !== null;
  }

  hasImage(): boolean {
    return this.props.image !== null;
  }

  isOpenSource(): boolean {
    return this.props.type === 'oss';
  }

  isProfessional(): boolean {
    return this.props.type === 'professional';
  }

  usesTechnology(technology: string): boolean {
    return this.props.technologies.contains(technology);
  }
}
