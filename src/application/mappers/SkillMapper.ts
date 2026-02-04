import {
  Skill,
  SkillCategory,
  SkillProficiency,
} from '@/domain/portfolio/entities/Skill';
import type { SkillDTO } from '../dto/SkillDTO';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languages: 'Programming Languages',
  bigdata: 'Big Data & Processing',
  devops: 'DevOps & Cloud',
  aiml: 'AI & Machine Learning',
  databases: 'Databases',
  backend: 'Backend & APIs',
};

const PROFICIENCY_LABELS: Record<SkillProficiency, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

const PROFICIENCY_PERCENTAGES: Record<SkillProficiency, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

/**
 * Maps Skill domain entities to SkillDTO.
 */
export class SkillMapper {
  /**
   * Convert a single Skill entity to DTO.
   */
  static toDTO(entity: Skill): SkillDTO {
    return {
      id: entity.id,
      name: entity.name,
      category: entity.category,
      categoryLabel: CATEGORY_LABELS[entity.category],
      proficiency: entity.proficiency,
      proficiencyLabel: PROFICIENCY_LABELS[entity.proficiency],
      proficiencyPercentage: PROFICIENCY_PERCENTAGES[entity.proficiency],
      icon: entity.icon,
      yearsOfExperience: entity.yearsOfExperience,
      isAdvanced: entity.isAdvanced(),
    };
  }

  /**
   * Convert a list of Skill entities to DTOs.
   */
  static toDTOList(entities: Skill[]): SkillDTO[] {
    return entities.map(entity => this.toDTO(entity));
  }
}
