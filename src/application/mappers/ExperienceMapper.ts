import { Experience } from '@/domain/portfolio/entities/Experience';
import type { ExperienceDTO } from '../dto/ExperienceDTO';
import { formatDateRange } from '@/shared/utils/formatters';

/**
 * Maps Experience domain entities to ExperienceDTO.
 */
export class ExperienceMapper {
  /**
   * Convert a single Experience entity to DTO.
   */
  static toDTO(entity: Experience): ExperienceDTO {
    const startDate = entity.dateRange.start;
    const endDate = entity.dateRange.end;

    return {
      id: entity.id,
      company: entity.company,
      role: entity.role,
      description: [...entity.description],
      technologies: entity.technologies.items,
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : null,
      formattedDateRange: formatDateRange(startDate, endDate),
      duration: entity.dateRange.formatDuration(),
      location: entity.location,
      locationDisplay: entity.getLocationDisplay(),
      remote: entity.remote,
      isCurrent: entity.isCurrent(),
    };
  }

  /**
   * Convert a list of Experience entities to DTOs.
   */
  static toDTOList(entities: Experience[]): ExperienceDTO[] {
    return entities.map(entity => this.toDTO(entity));
  }
}
