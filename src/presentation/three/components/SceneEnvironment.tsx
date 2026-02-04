'use client';

import { Stars, Environment } from '@react-three/drei';

export interface SceneEnvironmentProps {
  /** Ambient light intensity (default: 0.4) */
  ambientIntensity?: number;
  /** Directional light intensity (default: 0.7) */
  directionalIntensity?: number;
  /** Point light intensity multiplier (default: 1) */
  pointLightIntensity?: number;
  /** Number of background stars (default: 3000) */
  starCount?: number;
  /** Star animation speed (default: 0.3) */
  starSpeed?: number;
  /** Show accent point lights (default: true) */
  showAccentLights?: boolean;
  /** Environment preset (default: 'night') */
  preset?:
    | 'night'
    | 'sunset'
    | 'dawn'
    | 'warehouse'
    | 'forest'
    | 'apartment'
    | 'studio'
    | 'city'
    | 'park'
    | 'lobby';
}

/**
 * Shared scene environment setup with lighting, stars, and environment map.
 * Eliminates duplicated environment code across 3D scenes.
 */
export function SceneEnvironment({
  ambientIntensity = 0.4,
  directionalIntensity = 0.7,
  pointLightIntensity = 1,
  starCount = 3000,
  starSpeed = 0.3,
  showAccentLights = true,
  preset = 'night',
}: SceneEnvironmentProps) {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={ambientIntensity} />

      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={directionalIntensity}
      />

      {/* Accent point lights matching theme colors */}
      {showAccentLights && (
        <>
          <pointLight
            position={[-5, 5, 5]}
            intensity={0.4 * pointLightIntensity}
            color="#00bcd4"
          />
          <pointLight
            position={[5, -5, 5]}
            intensity={0.4 * pointLightIntensity}
            color="#7c3aed"
          />
          <pointLight
            position={[0, -5, -5]}
            intensity={0.3 * pointLightIntensity}
            color="#10b981"
          />
        </>
      )}

      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={starCount}
        factor={4}
        saturation={0}
        fade
        speed={starSpeed}
      />

      {/* Environment for reflections */}
      <Environment preset={preset} />
    </>
  );
}

export default SceneEnvironment;
