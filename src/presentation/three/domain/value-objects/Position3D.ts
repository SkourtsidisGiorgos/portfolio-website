/**
 * Immutable value object representing a 3D position.
 * Provides factory methods and operations for 3D coordinate manipulation.
 */
export type Position3DTuple = readonly [number, number, number];

export class Position3D {
  private constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number
  ) {
    Object.freeze(this);
  }

  /**
   * Creates a new Position3D from x, y, z coordinates.
   * @param x - The x coordinate
   * @param y - The y coordinate
   * @param z - The z coordinate
   * @throws Error if any value is not a finite number
   */
  static create(x: number, y: number, z: number): Position3D {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      throw new Error('Position3D values must be finite numbers');
    }
    return new Position3D(x, y, z);
  }

  /**
   * Creates a Position3D from a tuple array.
   * @param tuple - Array of [x, y, z] coordinates
   */
  static fromTuple(
    tuple: Position3DTuple | [number, number, number]
  ): Position3D {
    return Position3D.create(tuple[0], tuple[1], tuple[2]);
  }

  /**
   * Creates a Position3D at the origin (0, 0, 0).
   */
  static origin(): Position3D {
    return new Position3D(0, 0, 0);
  }

  /**
   * Adds another position to this one, returning a new Position3D.
   * @param other - The position to add
   */
  add(other: Position3D): Position3D {
    return Position3D.create(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    );
  }

  /**
   * Subtracts another position from this one, returning a new Position3D.
   * @param other - The position to subtract
   */
  subtract(other: Position3D): Position3D {
    return Position3D.create(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z
    );
  }

  /**
   * Scales this position by a factor, returning a new Position3D.
   * @param factor - The scaling factor
   */
  scale(factor: number): Position3D {
    return Position3D.create(this.x * factor, this.y * factor, this.z * factor);
  }

  /**
   * Calculates the Euclidean distance to another position.
   * @param other - The other position
   * @returns The distance between the two positions
   */
  distanceTo(other: Position3D): number {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const dz = other.z - this.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Calculates the length (magnitude) of this position vector from origin.
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Returns a normalized version of this position (unit vector).
   */
  normalize(): Position3D {
    const len = this.length();
    if (len === 0) return Position3D.origin();
    return this.scale(1 / len);
  }

  /**
   * Linearly interpolates between this position and another.
   * @param other - The target position
   * @param t - Interpolation factor (0 = this, 1 = other)
   */
  lerp(other: Position3D, t: number): Position3D {
    return Position3D.create(
      this.x + (other.x - this.x) * t,
      this.y + (other.y - this.y) * t,
      this.z + (other.z - this.z) * t
    );
  }

  /**
   * Converts to a mutable tuple array.
   */
  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  /**
   * Converts to a readonly tuple.
   */
  toTuple(): Position3DTuple {
    return [this.x, this.y, this.z] as const;
  }

  /**
   * Checks equality with another Position3D.
   */
  equals(other: Position3D): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `Position3D(${this.x}, ${this.y}, ${this.z})`;
  }
}
