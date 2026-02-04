import { DateRange } from '@/domain/portfolio/value-objects/DateRange';

/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', options);
}

/**
 * Format a date range (e.g., "Jan 2023 - Present")
 *
 * @deprecated Prefer using DateRange.format() directly when working with domain entities.
 * This function delegates to DateRange for consistency.
 */
export function formatDateRange(
  start: Date | string,
  end: Date | string | null
): string {
  const dateRange = DateRange.create(start, end);
  return dateRange.format();
}

/**
 * Calculate duration between two dates in years and months
 *
 * @deprecated Prefer using DateRange.formatDuration() directly when working with domain entities.
 * This function delegates to DateRange for consistency.
 */
export function calculateDuration(
  start: Date | string,
  end: Date | string | null
): string {
  const dateRange = DateRange.create(start, end);
  return dateRange.formatDuration();
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert a string to title case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Slugify a string (convert to URL-friendly format)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
