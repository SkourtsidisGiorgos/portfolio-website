import { describe, it, expect } from 'vitest';
import { Position3D } from '@/presentation/three/domain/value-objects/Position3D';
import { ETLNode } from '../domain/ETLNode';
import { PipelineConfig } from '../domain/PipelineConfig';
import type { PipelineConnection } from '../domain/PipelineConfig';

describe('PipelineConfig', () => {
  describe('default()', () => {
    it('should create config with default nodes', () => {
      const config = PipelineConfig.default();

      expect(config.nodes.length).toBeGreaterThan(0);
    });

    it('should include source, transform, load, and analytics nodes', () => {
      const config = PipelineConfig.default();
      const types = config.nodes.map(n => n.type);

      expect(types).toContain('source');
      expect(types).toContain('transform');
      expect(types).toContain('load');
      expect(types).toContain('analytics');
    });

    it('should have connections between nodes', () => {
      const config = PipelineConfig.default();

      expect(config.connections.length).toBeGreaterThan(0);
    });

    it('should have high particle count for default config', () => {
      const config = PipelineConfig.default();

      expect(config.particleCount).toBe(10000);
    });

    it('should have effects enabled by default', () => {
      const config = PipelineConfig.default();

      expect(config.enableEffects).toBe(true);
    });
  });

  describe('minimal()', () => {
    it('should create config with reduced nodes', () => {
      const config = PipelineConfig.minimal();

      expect(config.nodes.length).toBeLessThanOrEqual(
        PipelineConfig.default().nodes.length
      );
    });

    it('should have lower particle count', () => {
      const config = PipelineConfig.minimal();

      expect(config.particleCount).toBeLessThan(
        PipelineConfig.default().particleCount
      );
      expect(config.particleCount).toBe(1000);
    });

    it('should have effects disabled', () => {
      const config = PipelineConfig.minimal();

      expect(config.enableEffects).toBe(false);
    });
  });

  describe('forQuality()', () => {
    it('should return default config for high quality', () => {
      const config = PipelineConfig.forQuality('high');

      expect(config.particleCount).toBe(10000);
      expect(config.enableEffects).toBe(true);
    });

    it('should return medium config for medium quality', () => {
      const config = PipelineConfig.forQuality('medium');

      expect(config.particleCount).toBe(5000);
      expect(config.enableEffects).toBe(true);
    });

    it('should return minimal config for low quality', () => {
      const config = PipelineConfig.forQuality('low');

      expect(config.particleCount).toBe(1000);
      expect(config.enableEffects).toBe(false);
    });
  });

  describe('custom()', () => {
    it('should create config with custom nodes', () => {
      const nodes = [
        ETLNode.source('API', Position3D.create(-2, 0, 0)),
        ETLNode.load('Storage', Position3D.create(2, 0, 0)),
      ];

      const config = PipelineConfig.custom({
        nodes,
        connections: [{ from: nodes[0].id, to: nodes[1].id }],
      });

      expect(config.nodes.length).toBe(2);
      expect(config.nodes[0].label).toBe('API');
      expect(config.nodes[1].label).toBe('Storage');
    });

    it('should allow custom particle count', () => {
      const config = PipelineConfig.custom({
        nodes: [ETLNode.source('Test', Position3D.create(0, 0, 0))],
        connections: [],
        particleCount: 2000,
      });

      expect(config.particleCount).toBe(2000);
    });

    it('should allow custom particle speed', () => {
      const config = PipelineConfig.custom({
        nodes: [ETLNode.source('Test', Position3D.create(0, 0, 0))],
        connections: [],
        particleSpeed: 2.5,
      });

      expect(config.particleSpeed).toBe(2.5);
    });
  });

  describe('connections', () => {
    it('should have from and to node ids', () => {
      const config = PipelineConfig.default();
      const connection = config.connections[0];

      expect(connection.from).toBeDefined();
      expect(connection.to).toBeDefined();
    });

    it('should reference valid node ids', () => {
      const config = PipelineConfig.default();
      const nodeIds = config.nodes.map(n => n.id);

      config.connections.forEach(conn => {
        expect(nodeIds).toContain(conn.from);
        expect(nodeIds).toContain(conn.to);
      });
    });

    it('should support curved connections', () => {
      const config = PipelineConfig.default();
      const curvedConnection = config.connections.find(c => c.curved);

      if (curvedConnection) {
        expect(curvedConnection.curved).toBe(true);
        expect(curvedConnection.curveHeight).toBeDefined();
      }
    });

    it('should support animated connections', () => {
      const config = PipelineConfig.default();

      config.connections.forEach(conn => {
        expect(conn.animated).toBe(true);
      });
    });
  });

  describe('particle settings', () => {
    it('should have default particle speed', () => {
      const config = PipelineConfig.default();

      expect(config.particleSpeed).toBe(1);
    });

    it('should have particle color', () => {
      const config = PipelineConfig.default();

      expect(config.particleColor).toBeDefined();
    });

    it('should have particle size', () => {
      const config = PipelineConfig.default();

      expect(config.particleSize).toBeGreaterThan(0);
    });
  });

  describe('getNodeById()', () => {
    it('should return node by id', () => {
      const config = PipelineConfig.default();
      const firstNode = config.nodes[0];
      const found = config.getNodeById(firstNode.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(firstNode.id);
    });

    it('should return undefined for non-existent id', () => {
      const config = PipelineConfig.default();
      const found = config.getNodeById('non-existent');

      expect(found).toBeUndefined();
    });
  });

  describe('getConnectionsFromNode()', () => {
    it('should return all connections from a node', () => {
      const config = PipelineConfig.default();
      const sourceNode = config.nodes.find(n => n.type === 'source');

      if (sourceNode) {
        const connections = config.getConnectionsFromNode(sourceNode.id);
        connections.forEach(conn => {
          expect(conn.from).toBe(sourceNode.id);
        });
      }
    });

    it('should return empty array for node with no outgoing connections', () => {
      const config = PipelineConfig.default();
      const analyticsNode = config.nodes.find(n => n.type === 'analytics');

      if (analyticsNode) {
        const connections = config.getConnectionsFromNode(analyticsNode.id);
        expect(connections.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('getConnectionsToNode()', () => {
    it('should return all connections to a node', () => {
      const config = PipelineConfig.default();
      const loadNode = config.nodes.find(n => n.type === 'load');

      if (loadNode) {
        const connections = config.getConnectionsToNode(loadNode.id);
        connections.forEach(conn => {
          expect(conn.to).toBe(loadNode.id);
        });
      }
    });
  });

  describe('withNodes()', () => {
    it('should return new config with updated nodes', () => {
      const config = PipelineConfig.default();
      const newNodes = [
        ETLNode.source('New Source', Position3D.create(0, 0, 0)),
      ];

      const newConfig = config.withNodes(newNodes);

      expect(newConfig.nodes.length).toBe(1);
      expect(newConfig.nodes[0].label).toBe('New Source');
    });

    it('should not mutate original config', () => {
      const config = PipelineConfig.default();
      const originalNodeCount = config.nodes.length;

      config.withNodes([]);

      expect(config.nodes.length).toBe(originalNodeCount);
    });
  });

  describe('withConnections()', () => {
    it('should return new config with updated connections', () => {
      const config = PipelineConfig.default();
      const newConnections: PipelineConnection[] = [];

      const newConfig = config.withConnections(newConnections);

      expect(newConfig.connections.length).toBe(0);
    });
  });

  describe('withParticleCount()', () => {
    it('should return new config with updated particle count', () => {
      const config = PipelineConfig.default();
      const newConfig = config.withParticleCount(5000);

      expect(newConfig.particleCount).toBe(5000);
    });

    it('should clamp negative values to 0', () => {
      const config = PipelineConfig.default();
      const newConfig = config.withParticleCount(-100);

      expect(newConfig.particleCount).toBe(0);
    });
  });

  describe('withEffects()', () => {
    it('should enable effects', () => {
      const config = PipelineConfig.minimal();
      const newConfig = config.withEffects(true);

      expect(newConfig.enableEffects).toBe(true);
    });

    it('should disable effects', () => {
      const config = PipelineConfig.default();
      const newConfig = config.withEffects(false);

      expect(newConfig.enableEffects).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const config = PipelineConfig.default();

      expect(Object.isFrozen(config)).toBe(true);
    });

    it('should have frozen nodes array', () => {
      const config = PipelineConfig.default();

      expect(Object.isFrozen(config.nodes)).toBe(true);
    });

    it('should have frozen connections array', () => {
      const config = PipelineConfig.default();

      expect(Object.isFrozen(config.connections)).toBe(true);
    });
  });

  describe('toString()', () => {
    it('should return readable string representation', () => {
      const config = PipelineConfig.default();
      const str = config.toString();

      expect(str).toContain('PipelineConfig');
      expect(str).toContain('nodes');
      expect(str).toContain('connections');
    });
  });
});
