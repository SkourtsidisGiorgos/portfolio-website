import type {
  Skill,
  SkillCategory,
  SkillProficiency,
} from '@/domain/portfolio/entities/Skill';
import { Color3D } from '@/presentation/three/domain/value-objects/Color3D';
import { Position3D } from '@/presentation/three/domain/value-objects/Position3D';

/**
 * Category colors mapping for visual distinction on the globe
 */
export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  languages: '#00bcd4', // primary (cyan)
  bigdata: '#7c3aed', // accent (purple)
  devops: '#10b981', // success (green)
  aiml: '#a78bfa', // accent-light (light purple)
  databases: '#0891b2', // primary-dark (dark cyan)
  backend: '#6366f1', // indigo
  frontend: '#f59e0b', // amber
  other: '#6b7280', // gray
};

/**
 * Size mapping based on proficiency level
 */
const PROFICIENCY_SIZES: Record<SkillProficiency, number> = {
  expert: 0.3,
  advanced: 0.25,
  intermediate: 0.2,
  beginner: 0.15,
};

/**
 * Spherical coordinates representation
 */
export interface SphericalCoords {
  theta: number;
  phi: number;
  radius: number;
}

/**
 * Immutable value object mapping a domain Skill entity to a 3D position on a globe.
 * Uses Fibonacci lattice for even distribution of points on a sphere.
 */
export class SkillNode {
  private constructor(
    private readonly _skill: Skill,
    private readonly _spherical: SphericalCoords,
    private readonly _position: Position3D,
    private readonly _color: Color3D
  ) {
    Object.freeze(this);
  }

  /**
   * Creates a SkillNode from a Skill using Fibonacci lattice distribution.
   * @param skill - The domain skill entity
   * @param index - The index of this skill in the collection
   * @param total - Total number of skills
   * @param radius - Globe radius (default: 3)
   */
  static fromSkill(
    skill: Skill,
    index: number,
    total: number,
    radius = 3
  ): SkillNode {
    // Golden angle distribution for N points on sphere (Fibonacci lattice)
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const theta = goldenAngle * index;
    const phi = Math.acos(1 - (2 * (index + 0.5)) / total);

    return SkillNode.positioned(skill, theta, phi, radius);
  }

  /**
   * Creates a SkillNode with custom spherical coordinates.
   * @param skill - The domain skill entity
   * @param theta - Azimuthal angle (around Y axis)
   * @param phi - Polar angle (from Z axis)
   * @param radius - Distance from origin
   */
  static positioned(
    skill: Skill,
    theta: number,
    phi: number,
    radius = 3
  ): SkillNode {
    const spherical: SphericalCoords = { theta, phi, radius };
    const position = SkillNode.sphericalToCartesian(spherical);
    const color = Color3D.fromHex(CATEGORY_COLORS[skill.category]);

    return new SkillNode(skill, spherical, position, color);
  }

  /**
   * Converts spherical coordinates to cartesian Position3D.
   */
  private static sphericalToCartesian(spherical: SphericalCoords): Position3D {
    const { theta, phi, radius } = spherical;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return Position3D.create(x, y, z);
  }

  /**
   * Gets the underlying Skill entity.
   */
  get skill(): Skill {
    return this._skill;
  }

  /**
   * Gets the cartesian position on the globe.
   */
  get position(): Position3D {
    return this._position;
  }

  /**
   * Gets the spherical coordinates.
   */
  get spherical(): SphericalCoords {
    return this._spherical;
  }

  /**
   * Gets the size based on proficiency level.
   */
  get size(): number {
    return PROFICIENCY_SIZES[this._skill.proficiency];
  }

  /**
   * Gets the color based on category.
   */
  get color(): Color3D {
    return this._color;
  }

  /**
   * Returns a new SkillNode with an updated radius (recalculates position).
   */
  withRadius(radius: number): SkillNode {
    const newSpherical = { ...this._spherical, radius };
    const newPosition = SkillNode.sphericalToCartesian(newSpherical);
    return new SkillNode(this._skill, newSpherical, newPosition, this._color);
  }

  /**
   * Checks equality based on skill id.
   */
  equals(other: SkillNode): boolean {
    return this._skill.id === other._skill.id;
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `SkillNode(${this._skill.name} [${this._skill.category}] @ ${this._position.toString()})`;
  }
}
