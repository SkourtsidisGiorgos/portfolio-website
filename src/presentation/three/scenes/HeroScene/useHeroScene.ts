import { useMemo, useState, useCallback } from 'react';
import { PipelineConfig } from './domain/PipelineConfig';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';
import type { ETLNode } from './domain/ETLNode';

export interface UseHeroSceneOptions {
  /** Override quality level */
  qualityOverride?: 'high' | 'medium' | 'low';
  /** Custom pipeline config */
  customConfig?: PipelineConfig;
}

export interface UseHeroSceneReturn {
  /** Pipeline configuration */
  config: PipelineConfig;
  /** Current quality level */
  quality: 'high' | 'medium' | 'low';
  /** Currently hovered node */
  hoveredNode: ETLNode | null;
  /** Handle node hover */
  handleNodeHover: (node: ETLNode | null) => void;
  /** Currently selected node */
  selectedNode: ETLNode | null;
  /** Handle node click */
  handleNodeClick: (node: ETLNode) => void;
  /** Whether effects should be enabled */
  enableEffects: boolean;
  /** Particle count for current quality */
  particleCount: number;
}

/**
 * Hook for managing Hero scene state and configuration.
 * Handles performance-based quality scaling and user interactions.
 */
export function useHeroScene(
  options: UseHeroSceneOptions = {}
): UseHeroSceneReturn {
  const { qualityOverride, customConfig } = options;

  // Get performance-based quality level
  const { quality: detectedQuality } = usePerformanceMode();
  const quality = qualityOverride ?? detectedQuality;

  // Generate config based on quality or use custom
  const config = useMemo(() => {
    if (customConfig) {
      return customConfig;
    }
    return PipelineConfig.forQuality(quality);
  }, [quality, customConfig]);

  // Interaction state
  const [hoveredNode, setHoveredNode] = useState<ETLNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<ETLNode | null>(null);

  const handleNodeHover = useCallback((node: ETLNode | null) => {
    setHoveredNode(node);
  }, []);

  const handleNodeClick = useCallback((node: ETLNode) => {
    setSelectedNode(prev => (prev?.equals(node) ? null : node));
  }, []);

  return {
    config,
    quality,
    hoveredNode,
    handleNodeHover,
    selectedNode,
    handleNodeClick,
    enableEffects: config.enableEffects,
    particleCount: config.particleCount,
  };
}

export default useHeroScene;
