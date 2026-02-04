import type { IExperienceRepository } from '@/domain/portfolio/repositories/IExperienceRepository';
import type { ExperienceDTO } from '../dto/ExperienceDTO';
import { ExperienceMapper } from '../mappers/ExperienceMapper';

/**
 * Timeline data structure with grouped experiences.
 */
export interface TimelineDTO {
  experiences: ExperienceDTO[];
  totalYears: number;
  technologies: string[];
}

/**
 * Use case for retrieving experience timeline data.
 */
export class GetExperienceTimeline {
  constructor(private experienceRepository: IExperienceRepository) {}

  /**
   * Execute the use case to get experience timeline.
   * Returns experiences sorted by date (most recent first).
   */
  async execute(): Promise<TimelineDTO> {
    const experiences = await this.experienceRepository.findAll();

    // Calculate total years of experience
    const totalYears = this.calculateTotalYears(
      experiences.map(e => ({
        start: e.dateRange.start,
        end: e.dateRange.end,
      }))
    );

    // Collect unique technologies
    const techSet = new Set<string>();
    experiences.forEach(exp => {
      exp.technologies.items.forEach(tech => techSet.add(tech));
    });

    return {
      experiences: ExperienceMapper.toDTOList(experiences),
      totalYears,
      technologies: Array.from(techSet).sort(),
    };
  }

  /**
   * Calculate total years of professional experience.
   * Accounts for overlapping periods.
   */
  private calculateTotalYears(
    periods: Array<{ start: Date; end: Date | null }>
  ): number {
    if (periods.length === 0) return 0;

    // Normalize periods (use current date for null end dates)
    const normalizedPeriods = periods.map(p => ({
      start: p.start.getTime(),
      end: (p.end || new Date()).getTime(),
    }));

    // Sort by start time
    normalizedPeriods.sort((a, b) => a.start - b.start);

    // Merge overlapping periods
    const merged: Array<{ start: number; end: number }> = [];
    for (const period of normalizedPeriods) {
      if (merged.length === 0) {
        merged.push(period);
      } else {
        const last = merged[merged.length - 1];
        if (period.start <= last.end) {
          last.end = Math.max(last.end, period.end);
        } else {
          merged.push(period);
        }
      }
    }

    // Calculate total milliseconds
    const totalMs = merged.reduce((sum, p) => sum + (p.end - p.start), 0);

    // Convert to years (rounded to 1 decimal)
    const years = totalMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.round(years * 10) / 10;
  }
}
