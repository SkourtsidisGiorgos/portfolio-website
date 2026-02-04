export type SkillCategory =
  | 'languages'
  | 'bigdata'
  | 'devops'
  | 'aiml'
  | 'databases'
  | 'backend'
  | 'frontend'
  | 'other';

export type SkillProficiency =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';

export interface SkillProps {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  icon: string | null;
  yearsOfExperience: number;
}

/**
 * Entity representing a technical skill.
 */
export class Skill {
  private constructor(private readonly props: SkillProps) {}

  static create(props: {
    id: string;
    name: string;
    category: SkillCategory;
    proficiency?: SkillProficiency;
    icon?: string | null;
    yearsOfExperience?: number;
  }): Skill {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Skill ID is required');
    }
    if (!props.name || props.name.trim() === '') {
      throw new Error('Skill name is required');
    }

    const yearsOfExperience = props.yearsOfExperience ?? 0;
    if (yearsOfExperience < 0) {
      throw new Error('Years of experience cannot be negative');
    }

    return new Skill({
      id: props.id.trim(),
      name: props.name.trim(),
      category: props.category,
      proficiency: props.proficiency ?? 'intermediate',
      icon: props.icon ?? null,
      yearsOfExperience,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get category(): SkillCategory {
    return this.props.category;
  }

  get proficiency(): SkillProficiency {
    return this.props.proficiency;
  }

  get icon(): string | null {
    return this.props.icon;
  }

  get yearsOfExperience(): number {
    return this.props.yearsOfExperience;
  }

  hasIcon(): boolean {
    return this.props.icon !== null;
  }

  getProficiencyLevel(): number {
    const levels: Record<SkillProficiency, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };
    return levels[this.props.proficiency];
  }

  getProficiencyPercentage(): number {
    return this.getProficiencyLevel() * 25;
  }

  isExpert(): boolean {
    return this.props.proficiency === 'expert';
  }

  isAdvanced(): boolean {
    return (
      this.props.proficiency === 'advanced' ||
      this.props.proficiency === 'expert'
    );
  }

  getCategoryLabel(): string {
    const labels: Record<SkillCategory, string> = {
      languages: 'Languages',
      bigdata: 'Big Data',
      devops: 'DevOps',
      aiml: 'AI/ML',
      databases: 'Databases',
      backend: 'Backend',
      frontend: 'Frontend',
      other: 'Other',
    };
    return labels[this.props.category];
  }
}
