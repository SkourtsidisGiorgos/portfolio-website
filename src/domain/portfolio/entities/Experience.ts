import { DateRange } from '../value-objects/DateRange';
import { TechStack } from '../value-objects/TechStack';

export interface ExperienceProps {
  id: string;
  company: string;
  role: string;
  dateRange: DateRange;
  location: string;
  remote: boolean;
  description: string[];
  technologies: TechStack;
}

/**
 * Entity representing a work experience entry.
 */
export class Experience {
  private constructor(private readonly props: ExperienceProps) {}

  static create(props: {
    id: string;
    company: string;
    role: string;
    startDate: Date | string;
    endDate: Date | string | null;
    location: string;
    remote?: boolean;
    description: string[];
    technologies: string[];
  }): Experience {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Experience ID is required');
    }
    if (!props.company || props.company.trim() === '') {
      throw new Error('Company name is required');
    }
    if (!props.role || props.role.trim() === '') {
      throw new Error('Role is required');
    }
    if (!props.location || props.location.trim() === '') {
      throw new Error('Location is required');
    }
    if (!props.description || props.description.length === 0) {
      throw new Error('At least one description item is required');
    }

    return new Experience({
      id: props.id.trim(),
      company: props.company.trim(),
      role: props.role.trim(),
      dateRange: DateRange.create(props.startDate, props.endDate),
      location: props.location.trim(),
      remote: props.remote ?? false,
      description: props.description.filter(d => d.trim() !== ''),
      technologies: TechStack.create(props.technologies),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get company(): string {
    return this.props.company;
  }

  get role(): string {
    return this.props.role;
  }

  get dateRange(): DateRange {
    return this.props.dateRange;
  }

  get location(): string {
    return this.props.location;
  }

  get remote(): boolean {
    return this.props.remote;
  }

  get description(): readonly string[] {
    return this.props.description;
  }

  get technologies(): TechStack {
    return this.props.technologies;
  }

  isCurrent(): boolean {
    return this.props.dateRange.isCurrent();
  }

  getDuration(): string {
    return this.props.dateRange.formatDuration();
  }

  getFormattedDateRange(): string {
    return this.props.dateRange.format();
  }

  getLocationDisplay(): string {
    return this.props.remote
      ? `${this.props.location} (Remote)`
      : this.props.location;
  }

  usesTechnology(technology: string): boolean {
    return this.props.technologies.contains(technology);
  }
}
