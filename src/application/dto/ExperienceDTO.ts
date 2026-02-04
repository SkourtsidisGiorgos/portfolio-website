/**
 * Data Transfer Object for Experience.
 * Flat structure optimized for UI consumption.
 */
export interface ExperienceDTO {
  id: string;
  company: string;
  role: string;
  description: string[]; // Array of description items
  technologies: string[];
  startDate: string; // ISO format
  endDate: string | null; // ISO format or null for current
  formattedDateRange: string; // Human-readable format
  duration: string; // Human-readable duration
  location: string;
  locationDisplay: string; // Includes (Remote) suffix if applicable
  remote: boolean;
  isCurrent: boolean;
}
