// Entities
export { Experience, type ExperienceProps } from './entities/Experience';
export {
  Project,
  type ProjectProps,
  type ProjectType,
} from './entities/Project';
export {
  Skill,
  type SkillProps,
  type SkillCategory,
  type SkillProficiency,
} from './entities/Skill';

// Value Objects
export { DateRange } from './value-objects/DateRange';
export { TechStack } from './value-objects/TechStack';

// Repositories
export type { IExperienceRepository } from './repositories/IExperienceRepository';
export type { IProjectRepository } from './repositories/IProjectRepository';
export type { ISkillRepository } from './repositories/ISkillRepository';

// Services
export {
  PortfolioService,
  type PortfolioData,
} from './services/PortfolioService';
