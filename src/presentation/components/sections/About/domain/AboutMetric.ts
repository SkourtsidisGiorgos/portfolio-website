/**
 * Valid icon types for metrics
 */
export type AboutMetricIcon =
  | 'clock'
  | 'folder'
  | 'code'
  | 'github'
  | 'star'
  | 'trophy'
  | 'graduation'
  | 'location';

/**
 * Options for creating an AboutMetric
 */
export interface AboutMetricOptions {
  value: string | number;
  label: string;
  icon: AboutMetricIcon;
  description?: string;
}

/**
 * Immutable value object representing a metric card in the About section.
 * Follows DDD principles with factory methods and validation.
 */
export class AboutMetric {
  private constructor(
    private readonly _value: string | number,
    private readonly _label: string,
    private readonly _icon: AboutMetricIcon,
    private readonly _description?: string
  ) {
    Object.freeze(this);
  }

  // Getters
  get value(): string | number {
    return this._value;
  }

  get label(): string {
    return this._label;
  }

  get icon(): AboutMetricIcon {
    return this._icon;
  }

  get description(): string | undefined {
    return this._description;
  }

  /**
   * Returns the numeric value, parsing from string if necessary
   */
  get numericValue(): number | null {
    if (typeof this._value === 'number') {
      return this._value;
    }
    const parsed = parseInt(this._value.replace(/[^0-9-]/g, ''), 10);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Factory method to create an AboutMetric with validation
   */
  static create(options: AboutMetricOptions): AboutMetric {
    const { value, label, icon, description } = options;

    // Validation
    if (value === '' || value === null || value === undefined) {
      throw new Error('Value is required');
    }
    if (!label || label.trim() === '') {
      throw new Error('Label is required');
    }

    return new AboutMetric(value, label, icon, description);
  }

  /**
   * Factory for years of experience metric
   */
  static yearsExperience(years: number): AboutMetric {
    return new AboutMetric(`${years}+`, 'Years Experience', 'clock');
  }

  /**
   * Factory for project count metric
   */
  static projectCount(count: number): AboutMetric {
    return new AboutMetric(`${count}+`, 'Projects Delivered', 'folder');
  }

  /**
   * Factory for technology count metric
   */
  static techCount(count: number): AboutMetric {
    return new AboutMetric(`${count}+`, 'Technologies', 'code');
  }

  /**
   * Factory for open source contributions metric
   */
  static contributions(): AboutMetric {
    return new AboutMetric('Active', 'Open Source', 'github');
  }

  /**
   * Returns a new AboutMetric with updated value
   */
  withValue(value: string | number): AboutMetric {
    return new AboutMetric(value, this._label, this._icon, this._description);
  }

  /**
   * Returns a new AboutMetric with updated label
   */
  withLabel(label: string): AboutMetric {
    return new AboutMetric(this._value, label, this._icon, this._description);
  }

  /**
   * Returns a new AboutMetric with updated description
   */
  withDescription(description: string): AboutMetric {
    return new AboutMetric(this._value, this._label, this._icon, description);
  }

  /**
   * Checks equality with another AboutMetric
   */
  equals(other: AboutMetric): boolean {
    return (
      this._value === other._value &&
      this._label === other._label &&
      this._icon === other._icon &&
      this._description === other._description
    );
  }

  /**
   * Converts to plain object for serialization
   */
  toJSON(): AboutMetricOptions {
    return {
      value: this._value,
      label: this._label,
      icon: this._icon,
      description: this._description,
    };
  }
}
