import { Color3D } from '@/presentation/three/domain/value-objects/Color3D';
import type { Position3D } from '@/presentation/three/domain/value-objects/Position3D';

/**
 * Types of ETL pipeline nodes
 */
export type ETLNodeType = 'source' | 'transform' | 'load' | 'analytics';

/**
 * Options for creating an ETL node
 */
export interface ETLNodeOptions {
  type: ETLNodeType;
  label: string;
  position: Position3D;
  color?: Color3D;
  radius?: number;
  id?: string;
}

/**
 * Default colors for each node type based on theme
 */
const DEFAULT_COLORS: Record<ETLNodeType, Color3D> = {
  source: Color3D.fromTheme('primary', 500), // Cyber Blue - data sources
  transform: Color3D.fromTheme('accent', 500), // Electric Purple - transformations
  load: Color3D.fromTheme('success', 500), // Matrix Green - data destinations
  analytics: Color3D.fromTheme('accent', 400), // Lighter purple - analytics/ML
};

/**
 * Immutable value object representing an ETL pipeline node.
 * Each node has a type, label, position, color, and radius.
 */
export class ETLNode {
  private constructor(
    public readonly id: string,
    public readonly type: ETLNodeType,
    public readonly label: string,
    public readonly position: Position3D,
    public readonly color: Color3D,
    public readonly radius: number
  ) {
    Object.freeze(this);
  }

  /**
   * Creates a new ETL node with the specified options.
   */
  static create(options: ETLNodeOptions): ETLNode {
    const {
      type,
      label,
      position,
      color = DEFAULT_COLORS[type],
      radius = 0.5,
      id = ETLNode.generateId(type, label),
    } = options;

    return new ETLNode(id, type, label, position, color, radius);
  }

  /**
   * Generates a unique ID from type and label.
   */
  private static generateId(type: ETLNodeType, label: string): string {
    const slug = label.toLowerCase().replace(/\s+/g, '-');
    return `${type}-${slug}`;
  }

  /**
   * Factory method for creating a source node.
   */
  static source(
    label: string,
    position: Position3D,
    options?: Partial<Omit<ETLNodeOptions, 'type' | 'label' | 'position'>>
  ): ETLNode {
    return ETLNode.create({ type: 'source', label, position, ...options });
  }

  /**
   * Factory method for creating a transform node.
   */
  static transform(
    label: string,
    position: Position3D,
    options?: Partial<Omit<ETLNodeOptions, 'type' | 'label' | 'position'>>
  ): ETLNode {
    return ETLNode.create({ type: 'transform', label, position, ...options });
  }

  /**
   * Factory method for creating a load node.
   */
  static load(
    label: string,
    position: Position3D,
    options?: Partial<Omit<ETLNodeOptions, 'type' | 'label' | 'position'>>
  ): ETLNode {
    return ETLNode.create({ type: 'load', label, position, ...options });
  }

  /**
   * Factory method for creating an analytics node.
   */
  static analytics(
    label: string,
    position: Position3D,
    options?: Partial<Omit<ETLNodeOptions, 'type' | 'label' | 'position'>>
  ): ETLNode {
    return ETLNode.create({ type: 'analytics', label, position, ...options });
  }

  /**
   * Returns a new ETLNode with an updated position.
   */
  withPosition(position: Position3D): ETLNode {
    return new ETLNode(
      this.id,
      this.type,
      this.label,
      position,
      this.color,
      this.radius
    );
  }

  /**
   * Returns a new ETLNode with an updated color.
   */
  withColor(color: Color3D): ETLNode {
    return new ETLNode(
      this.id,
      this.type,
      this.label,
      this.position,
      color,
      this.radius
    );
  }

  /**
   * Returns a new ETLNode with an updated radius.
   */
  withRadius(radius: number): ETLNode {
    return new ETLNode(
      this.id,
      this.type,
      this.label,
      this.position,
      this.color,
      radius
    );
  }

  /**
   * Checks equality based on id.
   */
  equals(other: ETLNode): boolean {
    return this.id === other.id;
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `ETLNode(${this.type}: ${this.label} @ (${this.position.x}, ${this.position.y}, ${this.position.z}))`;
  }
}
