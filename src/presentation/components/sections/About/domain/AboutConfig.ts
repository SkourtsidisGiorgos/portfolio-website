import { AboutMetric, type AboutMetricIcon } from './AboutMetric';

/**
 * Profile information interface
 */
export interface ProfileInfo {
  name: string;
  title: string;
  location: string;
  availability: string;
  summary: string;
  imageUrl?: string;
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

/**
 * Highlight card configuration
 */
export interface HighlightInfo {
  id: string;
  title: string;
  content: string;
  icon: AboutMetricIcon;
  link?: string;
}

/**
 * Grid size configuration for bento layout
 */
export type BentoSize = 'small' | 'medium' | 'large';

/**
 * Grid item configuration
 */
export interface GridItem {
  id: string;
  type: 'metric' | 'profile' | 'highlight' | 'custom';
  size: BentoSize;
  data: AboutMetric | ProfileInfo | HighlightInfo;
}

/**
 * Configuration options for AboutConfig
 */
export interface AboutConfigOptions {
  profile: ProfileInfo;
  metrics: AboutMetric[];
  highlights: HighlightInfo[];
  gridLayout?: GridItem[];
}

/**
 * Immutable configuration for the About section.
 * Follows DDD principles with factory methods.
 */
export class AboutConfig {
  private constructor(
    private readonly _profile: ProfileInfo,
    private readonly _metrics: AboutMetric[],
    private readonly _highlights: HighlightInfo[],
    private readonly _gridLayout?: GridItem[]
  ) {
    Object.freeze(this);
    Object.freeze(this._profile);
    Object.freeze(this._metrics);
    Object.freeze(this._highlights);
  }

  // Getters
  get profile(): ProfileInfo {
    return this._profile;
  }

  get metrics(): readonly AboutMetric[] {
    return this._metrics;
  }

  get highlights(): readonly HighlightInfo[] {
    return this._highlights;
  }

  get gridLayout(): readonly GridItem[] | undefined {
    return this._gridLayout;
  }

  /**
   * Factory to create default configuration
   */
  static default(): AboutConfig {
    const profile: ProfileInfo = {
      name: 'Giorgos Skourtsidis',
      title: 'Big Data & Software Engineer',
      location: 'Athens, Greece',
      availability: 'Remote',
      summary:
        'Big Data & Software Engineer with 4+ years of experience in telecommunications and fintech. Specialized in ETL pipelines, distributed systems, and data engineering.',
      social: {
        github: 'https://github.com/SkourtsidisGiorgos',
        linkedin: 'https://linkedin.com/in/gskourtsidis',
        email: 'mailto:gskourts@gmail.com',
      },
    };

    const metrics: AboutMetric[] = [
      AboutMetric.yearsExperience(4),
      AboutMetric.projectCount(15),
      AboutMetric.techCount(25),
      AboutMetric.contributions(),
    ];

    const highlights: HighlightInfo[] = [
      {
        id: 'education',
        title: 'Current Focus',
        content: 'MSc in Big Data & Machine Learning at NTUA',
        icon: 'graduation',
      },
      {
        id: 'location',
        title: 'Location',
        content: 'Athens, Greece (Remote Available)',
        icon: 'location',
      },
    ];

    return new AboutConfig(profile, metrics, highlights);
  }

  /**
   * Factory to create minimal configuration for performance
   */
  static minimal(): AboutConfig {
    const profile: ProfileInfo = {
      name: 'Giorgos Skourtsidis',
      title: 'Big Data & Software Engineer',
      location: 'Athens, Greece',
      availability: 'Remote',
      summary: 'Big Data & Software Engineer specializing in ETL pipelines.',
      social: {},
    };

    const metrics: AboutMetric[] = [
      AboutMetric.yearsExperience(4),
      AboutMetric.projectCount(15),
    ];

    return new AboutConfig(profile, metrics, []);
  }

  /**
   * Factory to create from raw data (e.g., from JSON)
   */
  static fromData(data: AboutConfigOptions): AboutConfig {
    return new AboutConfig(
      data.profile,
      data.metrics,
      data.highlights,
      data.gridLayout
    );
  }

  /**
   * Gets metrics array
   */
  getMetrics(): readonly AboutMetric[] {
    return this._metrics;
  }

  /**
   * Gets profile info
   */
  getProfileInfo(): ProfileInfo {
    return this._profile;
  }

  /**
   * Gets highlights
   */
  getHighlights(): readonly HighlightInfo[] {
    return this._highlights;
  }

  /**
   * Returns a new config with updated profile
   */
  withProfile(profile: ProfileInfo): AboutConfig {
    return new AboutConfig(
      profile,
      this._metrics,
      this._highlights,
      this._gridLayout
    );
  }

  /**
   * Returns a new config with additional metric
   */
  withMetric(metric: AboutMetric): AboutConfig {
    return new AboutConfig(
      this._profile,
      [...this._metrics, metric],
      this._highlights,
      this._gridLayout
    );
  }

  /**
   * Returns a new config with additional highlight
   */
  withHighlight(highlight: HighlightInfo): AboutConfig {
    return new AboutConfig(
      this._profile,
      this._metrics,
      [...this._highlights, highlight],
      this._gridLayout
    );
  }

  /**
   * Converts to plain object for serialization
   */
  toJSON(): AboutConfigOptions {
    return {
      profile: this._profile,
      metrics: this._metrics.map(m => m.toJSON()) as unknown as AboutMetric[],
      highlights: this._highlights,
      gridLayout: this._gridLayout as GridItem[] | undefined,
    };
  }
}
