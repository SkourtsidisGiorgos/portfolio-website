import type { QualityLevel } from '@/presentation/three/domain/interfaces';
import { Position3D } from '@/presentation/three/domain/value-objects/Position3D';
import { ETLNode } from './ETLNode';

/**
 * Represents a connection between two ETL nodes
 */
export interface PipelineConnection {
  from: string;
  to: string;
  curved?: boolean;
  curveHeight?: number;
  animated?: boolean;
}

/**
 * Options for creating a custom pipeline configuration
 */
export interface PipelineConfigOptions {
  nodes: ETLNode[];
  connections: PipelineConnection[];
  particleCount?: number;
  particleSpeed?: number;
  particleSize?: number;
  particleColor?: string;
  enableEffects?: boolean;
}

/**
 * Immutable value object representing the ETL pipeline configuration.
 * Contains nodes, connections, and particle settings.
 */
export class PipelineConfig {
  private constructor(
    public readonly nodes: readonly ETLNode[],
    public readonly connections: readonly PipelineConnection[],
    public readonly particleCount: number,
    public readonly particleSpeed: number,
    public readonly particleSize: number,
    public readonly particleColor: string,
    public readonly enableEffects: boolean
  ) {
    Object.freeze(this.nodes);
    Object.freeze(this.connections);
    Object.freeze(this);
  }

  /**
   * Creates the default (high-quality) pipeline configuration.
   * Full visualization with all effects enabled.
   */
  static default(): PipelineConfig {
    const nodes = PipelineConfig.createDefaultNodes();
    const connections = PipelineConfig.createDefaultConnections(nodes);

    return new PipelineConfig(
      nodes,
      connections,
      10000, // High particle count
      1, // Normal speed
      0.02, // Particle size
      '#00bcd4', // Primary color
      true // Effects enabled
    );
  }

  /**
   * Creates a minimal pipeline configuration for low-end devices.
   * Reduced nodes and particles, no effects.
   */
  static minimal(): PipelineConfig {
    const nodes = [
      ETLNode.source('Data', Position3D.create(-3, 0, 0)),
      ETLNode.transform('Process', Position3D.create(0, 0, 0)),
      ETLNode.load('Store', Position3D.create(3, 0, 0)),
    ];

    const connections: PipelineConnection[] = [
      { from: nodes[0].id, to: nodes[1].id, animated: true },
      { from: nodes[1].id, to: nodes[2].id, animated: true },
    ];

    return new PipelineConfig(
      nodes,
      connections,
      1000, // Reduced particle count
      1,
      0.03, // Slightly larger particles (fewer = more visible)
      '#00bcd4',
      false // Effects disabled
    );
  }

  /**
   * Creates a medium-quality pipeline configuration.
   */
  static medium(): PipelineConfig {
    const nodes = PipelineConfig.createDefaultNodes();
    const connections = PipelineConfig.createDefaultConnections(nodes);

    return new PipelineConfig(
      nodes,
      connections,
      5000, // Medium particle count
      1,
      0.025,
      '#00bcd4',
      true // Effects still enabled
    );
  }

  /**
   * Returns configuration based on quality level.
   */
  static forQuality(quality: QualityLevel): PipelineConfig {
    switch (quality) {
      case 'high':
        return PipelineConfig.default();
      case 'medium':
        return PipelineConfig.medium();
      case 'low':
        return PipelineConfig.minimal();
    }
  }

  /**
   * Creates a custom pipeline configuration.
   */
  static custom(options: PipelineConfigOptions): PipelineConfig {
    return new PipelineConfig(
      options.nodes,
      options.connections,
      options.particleCount ?? 10000,
      options.particleSpeed ?? 1,
      options.particleSize ?? 0.02,
      options.particleColor ?? '#00bcd4',
      options.enableEffects ?? true
    );
  }

  /**
   * Creates the default set of ETL nodes for the hero visualization.
   */
  private static createDefaultNodes(): ETLNode[] {
    return [
      // Data sources (left side)
      ETLNode.source('Database', Position3D.create(-5, 1, 0)),
      ETLNode.source('API', Position3D.create(-5, -1, 0)),

      // Transform stage (center)
      ETLNode.transform('ETL', Position3D.create(-1.5, 0, 0)),
      ETLNode.transform('Clean', Position3D.create(0, 1.5, 0)),
      ETLNode.transform('Validate', Position3D.create(0, -1.5, 0)),

      // Load stage
      ETLNode.load('Warehouse', Position3D.create(3, 0, 0)),

      // Analytics (right side)
      ETLNode.analytics('Insights', Position3D.create(5.5, 1, 0)),
      ETLNode.analytics('ML Model', Position3D.create(5.5, -1, 0)),
    ];
  }

  /**
   * Creates the default connections between nodes.
   */
  private static createDefaultConnections(
    nodes: ETLNode[]
  ): PipelineConnection[] {
    const getNode = (label: string) => nodes.find(n => n.label === label);

    const db = getNode('Database');
    const api = getNode('API');
    const etl = getNode('ETL');
    const clean = getNode('Clean');
    const validate = getNode('Validate');
    const warehouse = getNode('Warehouse');
    const insights = getNode('Insights');
    const mlModel = getNode('ML Model');

    if (
      !db ||
      !api ||
      !etl ||
      !clean ||
      !validate ||
      !warehouse ||
      !insights ||
      !mlModel
    ) {
      return [];
    }

    return [
      // Sources to ETL
      {
        from: db.id,
        to: etl.id,
        curved: true,
        curveHeight: 0.5,
        animated: true,
      },
      {
        from: api.id,
        to: etl.id,
        curved: true,
        curveHeight: -0.5,
        animated: true,
      },

      // ETL to transforms
      { from: etl.id, to: clean.id, animated: true },
      { from: etl.id, to: validate.id, animated: true },

      // Transforms to warehouse
      {
        from: clean.id,
        to: warehouse.id,
        curved: true,
        curveHeight: 0.3,
        animated: true,
      },
      {
        from: validate.id,
        to: warehouse.id,
        curved: true,
        curveHeight: -0.3,
        animated: true,
      },

      // Warehouse to analytics
      {
        from: warehouse.id,
        to: insights.id,
        curved: true,
        curveHeight: 0.4,
        animated: true,
      },
      {
        from: warehouse.id,
        to: mlModel.id,
        curved: true,
        curveHeight: -0.4,
        animated: true,
      },
    ];
  }

  /**
   * Gets a node by its ID.
   */
  getNodeById(id: string): ETLNode | undefined {
    return this.nodes.find(n => n.id === id);
  }

  /**
   * Gets all connections originating from a node.
   */
  getConnectionsFromNode(nodeId: string): readonly PipelineConnection[] {
    return this.connections.filter(c => c.from === nodeId);
  }

  /**
   * Gets all connections going to a node.
   */
  getConnectionsToNode(nodeId: string): readonly PipelineConnection[] {
    return this.connections.filter(c => c.to === nodeId);
  }

  /**
   * Returns a new config with updated nodes.
   */
  withNodes(nodes: ETLNode[]): PipelineConfig {
    return new PipelineConfig(
      nodes,
      this.connections,
      this.particleCount,
      this.particleSpeed,
      this.particleSize,
      this.particleColor,
      this.enableEffects
    );
  }

  /**
   * Returns a new config with updated connections.
   */
  withConnections(connections: PipelineConnection[]): PipelineConfig {
    return new PipelineConfig(
      this.nodes,
      connections,
      this.particleCount,
      this.particleSpeed,
      this.particleSize,
      this.particleColor,
      this.enableEffects
    );
  }

  /**
   * Returns a new config with updated particle count.
   */
  withParticleCount(count: number): PipelineConfig {
    return new PipelineConfig(
      this.nodes,
      this.connections,
      Math.max(0, count),
      this.particleSpeed,
      this.particleSize,
      this.particleColor,
      this.enableEffects
    );
  }

  /**
   * Returns a new config with updated particle speed.
   */
  withParticleSpeed(speed: number): PipelineConfig {
    return new PipelineConfig(
      this.nodes,
      this.connections,
      this.particleCount,
      speed,
      this.particleSize,
      this.particleColor,
      this.enableEffects
    );
  }

  /**
   * Returns a new config with effects enabled/disabled.
   */
  withEffects(enabled: boolean): PipelineConfig {
    return new PipelineConfig(
      this.nodes,
      this.connections,
      this.particleCount,
      this.particleSpeed,
      this.particleSize,
      this.particleColor,
      enabled
    );
  }

  /**
   * Returns a string representation.
   */
  toString(): string {
    return `PipelineConfig(nodes: ${this.nodes.length}, connections: ${this.connections.length}, particles: ${this.particleCount})`;
  }
}
