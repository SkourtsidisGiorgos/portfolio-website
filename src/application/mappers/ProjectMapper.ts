import type { Project, ProjectType } from '@/domain/portfolio/entities/Project';
import type { ProjectDTO } from '../dto/ProjectDTO';

const TYPE_LABELS: Record<ProjectType, string> = {
  oss: 'Open Source',
  professional: 'Professional',
  personal: 'Personal',
};

/**
 * Maps Project domain entities to ProjectDTO.
 */
export class ProjectMapper {
  /**
   * Convert a single Project entity to DTO.
   */
  static toDTO(entity: Project): ProjectDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      technologies: [...entity.technologies.items],
      type: entity.type,
      typeLabel: TYPE_LABELS[entity.type],
      githubUrl: entity.githubUrl,
      liveUrl: entity.liveUrl,
      image: entity.image,
      featured: entity.featured,
      isOpenSource: entity.isOpenSource(),
    };
  }

  /**
   * Convert a list of Project entities to DTOs.
   */
  static toDTOList(entities: Project[]): ProjectDTO[] {
    return entities.map(entity => this.toDTO(entity));
  }
}
