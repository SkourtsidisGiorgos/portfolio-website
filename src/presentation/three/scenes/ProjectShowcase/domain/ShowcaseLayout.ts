import { Position3D } from '@/presentation/three/domain/value-objects/Position3D';

/**
 * Available layout types for the project showcase.
 */
export type LayoutType = 'grid' | 'spiral' | 'featured' | 'custom';

/**
 * Options for grid layout
 */
export interface GridLayoutOptions {
  horizontalSpacing?: number;
  verticalSpacing?: number;
  zDepth?: number;
}

/**
 * Options for spiral layout
 */
export interface SpiralLayoutOptions {
  turns?: number;
  verticalSpread?: number;
}

/**
 * Default grid options
 */
const DEFAULT_GRID_OPTIONS: Required<GridLayoutOptions> = {
  horizontalSpacing: 3,
  verticalSpacing: 2.5,
  zDepth: 0,
};

/**
 * Default spiral options
 */
const DEFAULT_SPIRAL_OPTIONS: Required<SpiralLayoutOptions> = {
  turns: 2,
  verticalSpread: 1,
};

/**
 * Featured layout settings
 */
const FEATURED_RADIUS = 4;
const FEATURED_SCALE = 1.4;
const DEFAULT_SCALE = 1;

/**
 * Immutable value object for calculating 3D layout positions.
 * Implements Strategy pattern for different layout algorithms.
 */
export class ShowcaseLayout {
  private readonly _positions: Position3D[];
  private readonly _scales: number[];

  private constructor(
    private readonly _type: LayoutType,
    private readonly _itemCount: number,
    positions: Position3D[],
    scales: number[]
  ) {
    this._positions = positions;
    this._scales = scales;
    Object.freeze(this);
  }

  /**
   * Creates a grid layout with specified columns.
   * @param count - Number of items
   * @param columns - Number of columns
   * @param options - Optional grid configuration
   */
  static grid(
    count: number,
    columns: number,
    options: GridLayoutOptions = {}
  ): ShowcaseLayout {
    const { horizontalSpacing, verticalSpacing, zDepth } = {
      ...DEFAULT_GRID_OPTIONS,
      ...options,
    };

    const positions: Position3D[] = [];
    const totalRows = Math.ceil(count / columns);
    const rowsOffset = (totalRows - 1) * verticalSpacing * 0.5;
    const colsOffset = (columns - 1) * horizontalSpacing * 0.5;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;

      const x = col * horizontalSpacing - colsOffset;
      const y = -row * verticalSpacing + rowsOffset;
      const z = zDepth;

      positions.push(Position3D.create(x, y, z));
    }

    const scales = Array(count).fill(DEFAULT_SCALE) as number[];

    return new ShowcaseLayout('grid', count, positions, scales);
  }

  /**
   * Creates a spiral layout around the center.
   * @param count - Number of items
   * @param radius - Maximum radius of spiral
   * @param options - Optional spiral configuration
   */
  static spiral(
    count: number,
    radius: number,
    options: SpiralLayoutOptions = {}
  ): ShowcaseLayout {
    const { turns, verticalSpread } = {
      ...DEFAULT_SPIRAL_OPTIONS,
      ...options,
    };

    const positions: Position3D[] = [];

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1 || 1);
      const angle = t * turns * Math.PI * 2;
      const r = t * radius;

      const x = Math.cos(angle) * r;
      const y = (t - 0.5) * verticalSpread * count * 0.3;
      const z = Math.sin(angle) * r * 0.3;

      positions.push(Position3D.create(x, y, z));
    }

    const scales = Array(count).fill(DEFAULT_SCALE) as number[];

    return new ShowcaseLayout('spiral', count, positions, scales);
  }

  /**
   * Creates a featured layout with one large center item and others around it.
   * @param count - Number of items (first is featured)
   * @param radius - Optional radius for surrounding items
   */
  static featured(count: number, radius = FEATURED_RADIUS): ShowcaseLayout {
    const positions: Position3D[] = [];

    // Featured item at center
    positions.push(Position3D.create(0, 0, 0.5));

    // Remaining items arranged in a circle around center
    const remainingCount = count - 1;
    for (let i = 0; i < remainingCount; i++) {
      const angle = (i / remainingCount) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.6;
      const z = 0;

      positions.push(Position3D.create(x, y, z));
    }

    const scales = [FEATURED_SCALE];
    for (let i = 1; i < count; i++) {
      scales.push(DEFAULT_SCALE);
    }

    return new ShowcaseLayout('featured', count, positions, scales);
  }

  /**
   * Creates a layout with custom positions.
   * @param positions - Array of custom Position3D objects
   * @param scales - Optional array of custom scale values
   */
  static custom(positions: Position3D[], scales?: number[]): ShowcaseLayout {
    const count = positions.length;
    const positionsCopy = [...positions];
    const scalesCopy = scales
      ? [...scales]
      : (Array(count).fill(DEFAULT_SCALE) as number[]);

    return new ShowcaseLayout('custom', count, positionsCopy, scalesCopy);
  }

  /**
   * Gets the layout type.
   */
  get type(): LayoutType {
    return this._type;
  }

  /**
   * Gets the total item count.
   */
  get itemCount(): number {
    return this._itemCount;
  }

  /**
   * Gets all calculated positions.
   */
  getPositions(): Position3D[] {
    return this._positions;
  }

  /**
   * Gets the position at a specific index.
   * @param index - The item index
   * @throws Error if index is out of bounds
   */
  getPosition(index: number): Position3D {
    if (index < 0 || index >= this._itemCount) {
      throw new Error(
        `Index ${index} out of bounds for layout with ${this._itemCount} items`
      );
    }
    return this.getPositions()[index];
  }

  /**
   * Gets all scale values.
   */
  getScales(): number[] {
    return this._scales;
  }

  /**
   * Gets the scale at a specific index.
   * @param index - The item index
   * @throws Error if index is out of bounds
   */
  getScale(index: number): number {
    if (index < 0 || index >= this._itemCount) {
      throw new Error(
        `Index ${index} out of bounds for layout with ${this._itemCount} items`
      );
    }
    return this.getScales()[index];
  }

  /**
   * Returns a new layout with all positions offset by the given vector.
   * @param offset - Position3D to add to all positions
   */
  withOffset(offset: Position3D): ShowcaseLayout {
    const originalPositions = this.getPositions();
    const offsetPositions = originalPositions.map(pos => pos.add(offset));
    const scales = this.getScales();

    return ShowcaseLayout.custom(offsetPositions, scales);
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `ShowcaseLayout(${this._type}, ${this._itemCount} items)`;
  }
}
