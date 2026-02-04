/**
 * Value object representing a date range (start to end).
 * End can be null to represent "Present" (ongoing).
 */
export class DateRange {
  private constructor(
    private readonly _start: Date,
    private readonly _end: Date | null
  ) {}

  static create(start: Date | string, end: Date | string | null): DateRange {
    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = end
      ? typeof end === 'string'
        ? new Date(end)
        : end
      : null;

    if (endDate && endDate < startDate) {
      throw new Error('End date must be after start date');
    }

    return new DateRange(startDate, endDate);
  }

  get start(): Date {
    return this._start;
  }

  get end(): Date | null {
    return this._end;
  }

  isCurrent(): boolean {
    return this._end === null;
  }

  getDurationInMonths(): number {
    const endDate = this._end ?? new Date();
    const months =
      (endDate.getFullYear() - this._start.getFullYear()) * 12 +
      (endDate.getMonth() - this._start.getMonth());
    return Math.max(0, months);
  }

  formatDuration(): string {
    const months = this.getDurationInMonths();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }

    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }

    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }

  format(): string {
    const startStr = this._start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
    const endStr = this._end
      ? this._end.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        })
      : 'Present';
    return `${startStr} - ${endStr}`;
  }

  equals(other: DateRange): boolean {
    return (
      this._start.getTime() === other._start.getTime() &&
      (this._end === null
        ? other._end === null
        : other._end !== null && this._end.getTime() === other._end.getTime())
    );
  }
}
