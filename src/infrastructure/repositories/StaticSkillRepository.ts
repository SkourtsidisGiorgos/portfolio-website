import {
  Skill,
  SkillCategory,
  SkillProficiency,
} from '@/domain/portfolio/entities/Skill';
import { ISkillRepository } from '@/domain/portfolio/repositories/ISkillRepository';
import skillsData from '@/data/skills.json';

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
export class StaticSkillRepository implements ISkillRepository {
  private skills: Skill[];

  constructor() {
    this.skills = this.loadSkills();
  }

  private loadSkills(): Skill[] {
    return (skillsData as SkillData[]).map(data =>
      Skill.create({
        id: data.id,
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        icon: data.icon,
        yearsOfExperience: data.yearsOfExperience,
      })
    );
  }

  async findAll(): Promise<Skill[]> {
    return [...this.skills];
  }

  async findById(id: string): Promise<Skill | null> {
    return this.skills.find(skill => skill.id === id) ?? null;
  }

  async findByCategory(category: SkillCategory): Promise<Skill[]> {
    return this.skills.filter(skill => skill.category === category);
  }

  async findAdvanced(): Promise<Skill[]> {
    return this.skills.filter(skill => skill.isAdvanced());
  }

  async getCategories(): Promise<SkillCategory[]> {
    const categories = new Set(this.skills.map(skill => skill.category));
    return Array.from(categories);
  }
}
