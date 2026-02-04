'use client';

import { useMemo } from 'react';
import { DataPacket } from './DataPacket';
import { ETLNode3D } from './ETLNode3D';
import type { ETLNode } from './domain/ETLNode';
import type { PipelineConfig } from './domain/PipelineConfig';

export interface ETLPipelineVisualizationProps {
  /** Pipeline configuration */
  config: PipelineConfig;
  /** Whether animation is paused */
  paused?: boolean;
  /** Show node labels */
  showLabels?: boolean;
  /** Number of data packets per connection */
  packetsPerConnection?: number;
  /** Node hover callback */
  onNodeHover?: (node: ETLNode | null) => void;
  /** Node click callback */
  onNodeClick?: (node: ETLNode) => void;
}

/**
 * Complete ETL pipeline visualization.
 * Renders nodes, connections, and animated data packets.
 */
export function ETLPipelineVisualization({
  config,
  paused = false,
  showLabels = true,
  packetsPerConnection = 3,
  onNodeHover,
  onNodeClick,
}: ETLPipelineVisualizationProps) {
  // Generate packets for each connection
  const packets = useMemo(() => {
    const result: Array<{
      key: string;
      start: [number, number, number];
      end: [number, number, number];
      curved: boolean;
      curveHeight: number;
      offset: number;
      color: string;
    }> = [];

    config.connections.forEach((connection, connIndex) => {
      if (!connection.animated) return;

      const fromNode = config.getNodeById(connection.from);
      const toNode = config.getNodeById(connection.to);

      if (!fromNode || !toNode) return;

      // Create multiple packets per connection with offset
      for (let i = 0; i < packetsPerConnection; i++) {
        result.push({
          key: `${connection.from}-${connection.to}-${i}`,
          start: [
            fromNode.position.x,
            fromNode.position.y,
            fromNode.position.z,
          ],
          end: [toNode.position.x, toNode.position.y, toNode.position.z],
          curved: connection.curved ?? false,
          curveHeight: connection.curveHeight ?? 0,
          offset: i / packetsPerConnection + connIndex * 0.1,
          color: fromNode.color.toHex(),
        });
      }
    });

    return result;
  }, [config, packetsPerConnection]);

  return (
    <group>
      {/* Render nodes */}
      {config.nodes.map(node => (
        <ETLNode3D
          key={node.id}
          node={node}
          showLabel={showLabels}
          paused={paused}
          onHover={onNodeHover}
          onClick={onNodeClick}
        />
      ))}

      {/* Render data packets */}
      {packets.map(packet => (
        <DataPacket
          key={packet.key}
          start={packet.start}
          end={packet.end}
          curved={packet.curved}
          curveHeight={packet.curveHeight}
          offset={packet.offset}
          color={packet.color}
          paused={paused}
        />
      ))}
    </group>
  );
}

export default ETLPipelineVisualization;
