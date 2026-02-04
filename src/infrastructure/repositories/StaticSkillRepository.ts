import skillsData from '@/data/skills.json';
import type {
  SkillCategory,
  SkillProficiency,
} from '@/domain/portfolio/entities/Skill';
import { Skill } from '@/domain/portfolio/entities/Skill';
import type { ISkillRepository } from '@/domain/portfolio/repositories/ISkillRepository';
import { BaseStaticRepository } from './BaseStaticRepository';

interface SkillData {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  icon: string | null;
  yearsOfExperience: number;
}

/**
 * Static implementation of ISkillRepository.
 * Loads skill data from JSON file.
 */
export class StaticSkillRepository
  extends BaseStaticRepository<Skill, SkillData>
  implements ISkillRepository
{
  constructor() {
    super(skillsData as SkillData[]);
  }

  protected mapToEntity(data: SkillData): Skill {
    return Skill.create({
      id: data.id,
      name: data.name,
      category: data.category,
      proficiency: data.proficiency,
      icon: data.icon,
      yearsOfExperience: data.yearsOfExperience,
    });
  }

  async findByCategory(category: SkillCategory): Promise<Skill[]> {
    return this.filterBy(skill => skill.category === category);
  }

  async findAdvanced(): Promise<Skill[]> {
    return this.filterBy(skill => skill.isAdvanced());
  }

  async getCategories(): Promise<SkillCategory[]> {
    const categories = new Set(this.entities.map(skill => skill.category));
    return Array.from(categories);
  }
}
