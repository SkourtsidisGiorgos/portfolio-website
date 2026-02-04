import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { Color3D } from '@/presentation/three/domain/value-objects/Color3D';
import { Position3D } from '@/presentation/three/domain/value-objects/Position3D';

/**
 * Company node colors for visual distinction
 */
export const COMPANY_COLORS = {
  current: '#00bcd4', // primary (cyan) - current position
  past: '#6b7280', // gray - past positions
  accent: '#7c3aed', // accent (purple) - highlighted
} as const;

/**
 * Parses duration string and returns approximate months
 */
function parseDurationToMonths(duration: string): number {
  let months = 0;

  // Match years
  const yearsMatch = duration.match(/(\d+)\s*year/i);
  if (yearsMatch) {
    months += parseInt(yearsMatch[1], 10) * 12;
  }

  // Match months
  const monthsMatch = duration.match(/(\d+)\s*month/i);
  if (monthsMatch) {
    months += parseInt(monthsMatch[1], 10);
  }

  // Default to 6 months if parsing fails
  return months || 6;
}

/**
 * Calculates node size based on duration (0.4-0.6 range)
 * Longer tenure = larger node
 */
function calculateSizeFromDuration(duration: string): number {
  const months = parseDurationToMonths(duration);
  // Scale: 3 months = 0.4, 36 months (3 years) = 0.6
  const normalized = Math.min(Math.max((months - 3) / 33, 0), 1);
  return 0.4 + normalized * 0.2;
}

/**
 * Immutable value object mapping an ExperienceDTO to a 3D position on a horizontal timeline.
 * Calculates position, color, and size based on experience data.
 */
export class TimelineNode {
  private constructor(
    private readonly _experience: ExperienceDTO,
    private readonly _position: Position3D,
    private readonly _color: Color3D,
    private readonly _size: number,
    private readonly _index: number,
    private readonly _isCurrent: boolean
  ) {
    Object.freeze(this);
  }

  /**
   * Creates a TimelineNode from an ExperienceDTO.
   * @param experience - The experience data
   * @param index - The index of this experience in the collection (0-based, chronological)
   * @param total - Total number of experiences
   * @param spacing - Horizontal spacing between nodes
   */
  static fromExperience(
    experience: ExperienceDTO,
    index: number,
    total: number,
    spacing = 3
  ): TimelineNode {
    // Calculate horizontal position (centered timeline)
    const x = (index - (total - 1) / 2) * spacing;
    // Add slight wave effect for visual interest
    const y = Math.sin(index * 0.8) * 0.3;
    const z = 0;

    const position = Position3D.create(x, y, z);

    // Color based on whether this is current position
    const colorHex = experience.isCurrent
      ? COMPANY_COLORS.current
      : COMPANY_COLORS.past;
    const color = Color3D.fromHex(colorHex);

    // Size based on duration
    const size = calculateSizeFromDuration(experience.duration);

    return new TimelineNode(
      experience,
      position,
      color,
      size,
      index,
      experience.isCurrent
    );
  }

  /**
   * Gets the underlying ExperienceDTO.
   */
  get experience(): ExperienceDTO {
    return this._experience;
  }

  /**
   * Gets the 3D position on the timeline.
   */
  get position(): Position3D {
    return this._position;
  }

  /**
   * Gets the color based on current/past status.
   */
  get color(): Color3D {
    return this._color;
  }

  /**
   * Gets the size based on duration.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Gets the index in the timeline.
   */
  get index(): number {
    return this._index;
  }

  /**
   * Returns true if this is the current position.
   */
  get isCurrent(): boolean {
    return this._isCurrent;
  }

  /**
   * Checks equality based on experience id.
   */
  equals(other: TimelineNode): boolean {
    return this._experience.id === other._experience.id;
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `TimelineNode(${this._experience.company} @ ${this._position.toString()})`;
  }
}
