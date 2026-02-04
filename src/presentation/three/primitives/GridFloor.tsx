'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface GridFloorProps {
  size?: number;
  divisions?: number;
  color?: string;
  secondaryColor?: string;
  fadeDistance?: number;
  position?: [number, number, number];
  animated?: boolean;
  animationSpeed?: number;
}

export function GridFloor({
  size = 100,
  divisions = 100,
  color = '#00bcd4',
  secondaryColor = '#7c3aed',
  fadeDistance = 50,
  position = [0, 0, 0],
  animated = true,
  animationSpeed = 0.1,
}: GridFloorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Custom shader for infinite grid with fade
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uSecondaryColor: { value: new THREE.Color(secondaryColor) },
        uFadeDistance: { value: fadeDistance },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uSecondaryColor;
        uniform float uFadeDistance;
        uniform float uTime;

        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          // Calculate distance from center for fade
          float dist = length(vWorldPosition.xz);
          float fade = 1.0 - smoothstep(0.0, uFadeDistance, dist);

          // Create grid pattern
          vec2 coord = vWorldPosition.xz;
          vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = min(grid.x, grid.y);

          // Major grid lines every 10 units
          vec2 majorCoord = vWorldPosition.xz * 0.1;
          vec2 majorGrid = abs(fract(majorCoord - 0.5) - 0.5) / fwidth(majorCoord);
          float majorLine = min(majorGrid.x, majorGrid.y);

          // Mix colors based on line type
          float minorStrength = 1.0 - min(line, 1.0);
          float majorStrength = 1.0 - min(majorLine, 1.0);

          vec3 finalColor = mix(uColor, uSecondaryColor, majorStrength * 0.5);
          float alpha = max(minorStrength * 0.3, majorStrength * 0.6) * fade;

          // Add subtle animation pulse
          alpha *= 0.8 + 0.2 * sin(uTime * 0.5 + dist * 0.1);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [color, secondaryColor, fadeDistance]);

  useFrame(state => {
    if (animated && materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        state.clock.elapsedTime * animationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[size, size, divisions, divisions]} />
        <primitive object={shaderMaterial} ref={materialRef} />
      </mesh>
    </group>
  );
}

// Simple grid using drei Grid helper (alternative)
export interface SimpleGridProps {
  size?: number;
  cellSize?: number;
  color?: string;
  position?: [number, number, number];
}

export function SimpleGrid({
  size = 100,
  cellSize = 1,
  color = '#00bcd4',
  position = [0, 0, 0],
}: SimpleGridProps) {
  const gridHelper = useMemo(() => {
    const divisions = size / cellSize;
    return new THREE.GridHelper(size, divisions, color, color);
  }, [size, cellSize, color]);

  return <primitive object={gridHelper} position={position} />;
}

export default GridFloor;
