'use client';

import { useMemo } from 'react';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export interface PostProcessingProps {
  /** Enable bloom effect */
  bloom?: boolean;
  /** Bloom intensity (0-2) */
  bloomIntensity?: number;
  /** Bloom luminance threshold */
  bloomThreshold?: number;
  /** Bloom smoothing */
  bloomSmoothing?: number;

  /** Enable vignette effect */
  vignette?: boolean;
  /** Vignette darkness (0-1) */
  vignetteDarkness?: number;
  /** Vignette offset (0-1) */
  vignetteOffset?: number;

  /** Enable chromatic aberration */
  chromaticAberration?: boolean;
  /** Chromatic aberration offset */
  chromaticAberrationOffset?: [number, number];

  /** Enable all effects */
  enabled?: boolean;
}

export function PostProcessing({
  bloom = true,
  bloomIntensity = 1.5,
  bloomThreshold = 0.2,
  bloomSmoothing = 0.9,
  vignette = true,
  vignetteDarkness = 0.5,
  vignetteOffset = 0.3,
  chromaticAberration = true,
  chromaticAberrationOffset = [0.002, 0.002],
  enabled = true,
}: PostProcessingProps) {
  // Memoize chromatic aberration offset vector
  const chromaticOffset = useMemo(
    () => new THREE.Vector2(...chromaticAberrationOffset),
    [chromaticAberrationOffset]
  );

  // Memoize effects to avoid re-creating on each render
  const effects = useMemo(() => {
    const effectsList: React.ReactElement[] = [];

    if (bloom) {
      effectsList.push(
        <Bloom
          key="bloom"
          intensity={bloomIntensity}
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={bloomSmoothing}
          blendFunction={BlendFunction.ADD}
        />
      );
    }

    if (vignette) {
      effectsList.push(
        <Vignette
          key="vignette"
          offset={vignetteOffset}
          darkness={vignetteDarkness}
          blendFunction={BlendFunction.NORMAL}
        />
      );
    }

    if (chromaticAberration) {
      effectsList.push(
        <ChromaticAberration
          key="chromatic"
          offset={chromaticOffset}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0.15}
        />
      );
    }

    return effectsList;
  }, [
    bloom,
    bloomIntensity,
    bloomThreshold,
    bloomSmoothing,
    vignette,
    vignetteDarkness,
    vignetteOffset,
    chromaticAberration,
    chromaticOffset,
  ]);

  if (!enabled || effects.length === 0) return null;

  return <EffectComposer>{effects}</EffectComposer>;
}

// Preset configurations for different scenes
export const PostProcessingPresets = {
  hero: {
    bloom: true,
    bloomIntensity: 2,
    bloomThreshold: 0.1,
    bloomSmoothing: 0.8,
    vignette: true,
    vignetteDarkness: 0.6,
    vignetteOffset: 0.25,
    chromaticAberration: true,
    chromaticAberrationOffset: [0.003, 0.003] as [number, number],
  },
  subtle: {
    bloom: true,
    bloomIntensity: 0.8,
    bloomThreshold: 0.3,
    bloomSmoothing: 0.9,
    vignette: true,
    vignetteDarkness: 0.3,
    vignetteOffset: 0.4,
    chromaticAberration: false,
    chromaticAberrationOffset: [0, 0] as [number, number],
  },
  minimal: {
    bloom: true,
    bloomIntensity: 0.5,
    bloomThreshold: 0.4,
    bloomSmoothing: 0.9,
    vignette: false,
    vignetteDarkness: 0,
    vignetteOffset: 0,
    chromaticAberration: false,
    chromaticAberrationOffset: [0, 0] as [number, number],
  },
} as const;

export type PostProcessingPreset = keyof typeof PostProcessingPresets;
