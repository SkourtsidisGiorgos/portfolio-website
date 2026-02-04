import type { Project, ProjectType } from '@/domain/portfolio/entities/Project';
import { Color3D } from '@/presentation/three/domain/value-objects/Color3D';
import { Position3D } from '@/presentation/three/domain/value-objects/Position3D';

/**
 * Color mapping for project types
 */
export const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  oss: '#10b981', // success green
  professional: '#7c3aed', // accent purple
  personal: '#00bcd4', // primary cyan
};

/**
 * Parameters for floating animation
 */
export interface FloatingAnimationParams {
  amplitude: number;
  frequency: number;
  phase: number;
}

/**
 * Default animation parameters
 */
const DEFAULT_ANIMATION: FloatingAnimationParams = {
  amplitude: 0.1,
  frequency: 0.5,
  phase: 0,
};

/**
 * Grid spacing constants
 */
const GRID_HORIZONTAL_SPACING = 3;
const GRID_VERTICAL_SPACING = 2.5;
const CARD_Z_DEPTH = 0;

/**
 * Featured card settings
 */
const FEATURED_SCALE = 1.3;
const FEATURED_Z_OFFSET = 0.5;

/**
 * Immutable value object representing a 3D project card configuration.
 * Maps a Project entity to 3D rendering parameters.
 */
export class ProjectCard3DConfig {
  private constructor(
    private readonly _project: Project,
    private readonly _position: Position3D,
    private readonly _rotation: Position3D,
    private readonly _scale: number,
    private readonly _floatingAnimation: FloatingAnimationParams
  ) {
    Object.freeze(this);
  }

  /**
   * Creates a config from a project with index-based grid position.
   * @param project - The domain project entity
   * @param index - The index of this project in the collection
   * @param total - Total number of projects
   * @param columns - Number of columns in the grid
   */
  static fromProject(
    project: Project,
    index: number,
    total: number,
    columns: number
  ): ProjectCard3DConfig {
    const row = Math.floor(index / columns);
    const col = index % columns;

    // Calculate total rows for centering
    const totalRows = Math.ceil(total / columns);
    const rowsOffset = (totalRows - 1) * GRID_VERTICAL_SPACING * 0.5;
    const colsOffset = (columns - 1) * GRID_HORIZONTAL_SPACING * 0.5;

    const x = col * GRID_HORIZONTAL_SPACING - colsOffset;
    const y = -row * GRID_VERTICAL_SPACING + rowsOffset;
    const z = CARD_Z_DEPTH;

    const position = Position3D.create(x, y, z);
    const rotation = Position3D.create(0, 0, 0);

    // Unique phase offset for floating animation
    const phase = (index / total) * Math.PI * 2;
    const floatingAnimation: FloatingAnimationParams = {
      ...DEFAULT_ANIMATION,
      phase,
    };

    return new ProjectCard3DConfig(
      project,
      position,
      rotation,
      1,
      floatingAnimation
    );
  }

  /**
   * Creates a config for a featured project (larger, centered).
   * @param project - The featured project entity
   * @param zOffset - Optional z-axis offset (default: 0.5)
   */
  static featured(
    project: Project,
    zOffset = FEATURED_Z_OFFSET
  ): ProjectCard3DConfig {
    const position = Position3D.create(0, 0, zOffset);
    const rotation = Position3D.create(0, 0, 0);

    const floatingAnimation: FloatingAnimationParams = {
      amplitude: 0.15,
      frequency: 0.3,
      phase: 0,
    };

    return new ProjectCard3DConfig(
      project,
      position,
      rotation,
      FEATURED_SCALE,
      floatingAnimation
    );
  }

  /**
   * Creates a config with custom position, rotation, and scale.
   * @param project - The project entity
   * @param position - Custom 3D position
   * @param rotation - Custom 3D rotation (Euler angles)
   * @param scale - Custom scale factor
   * @param floatingAnimation - Optional custom animation params
   */
  static custom(
    project: Project,
    position: Position3D,
    rotation: Position3D,
    scale: number,
    floatingAnimation: FloatingAnimationParams = DEFAULT_ANIMATION
  ): ProjectCard3DConfig {
    return new ProjectCard3DConfig(
      project,
      position,
      rotation,
      scale,
      floatingAnimation
    );
  }

  /**
   * Gets the underlying Project entity.
   */
  get project(): Project {
    return this._project;
  }

  /**
   * Gets the 3D position.
   */
  get position(): Position3D {
    return this._position;
  }

  /**
   * Gets the 3D rotation (Euler angles).
   */
  get rotation(): Position3D {
    return this._rotation;
  }

  /**
   * Gets the scale factor.
   */
  get scale(): number {
    return this._scale;
  }

  /**
   * Gets the floating animation parameters.
   */
  get floatingAnimation(): FloatingAnimationParams {
    return this._floatingAnimation;
  }

  /**
   * Gets the color based on project type.
   */
  getColor(): Color3D {
    return Color3D.fromHex(PROJECT_TYPE_COLORS[this._project.type]);
  }

  /**
   * Returns a new config with an updated scale.
   */
  withScale(scale: number): ProjectCard3DConfig {
    return new ProjectCard3DConfig(
      this._project,
      this._position,
      this._rotation,
      scale,
      this._floatingAnimation
    );
  }

  /**
   * Returns a new config with an updated position.
   */
  withPosition(position: Position3D): ProjectCard3DConfig {
    return new ProjectCard3DConfig(
      this._project,
      position,
      this._rotation,
      this._scale,
      this._floatingAnimation
    );
  }

  /**
   * Returns a new config with an updated rotation.
   */
  withRotation(rotation: Position3D): ProjectCard3DConfig {
    return new ProjectCard3DConfig(
      this._project,
      this._position,
      rotation,
      this._scale,
      this._floatingAnimation
    );
  }

  /**
   * Checks equality based on project id.
   */
  equals(other: ProjectCard3DConfig): boolean {
    return this._project.id === other._project.id;
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `ProjectCard3DConfig(${this._project.title} [${this._project.type}] @ ${this._position.toString()})`;
  }
}
