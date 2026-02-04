import type {
  SkillCategory,
  SkillProficiency,
} from '@/domain/portfolio/entities/Skill';

/**
 * Data Transfer Object for Skill.
 * Includes category and proficiency information.
 */
export interface SkillDTO {
  id: string;
  name: string;
  category: SkillCategory;
  categoryLabel: string; // Human-readable category
  proficiency: SkillProficiency;
  proficiencyLabel: string; // Human-readable proficiency
  proficiencyPercentage: number; // 0-100 for progress bars
  icon: string | null;
  yearsOfExperience: number;
  isAdvanced: boolean;
}
