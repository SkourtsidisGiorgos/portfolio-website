'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SafeText } from '../components/SafeText';

export interface FloatingTextProps {
  children: string;
  position?: [number, number, number];
  fontSize?: number;
  color?: string;
  hoverColor?: string;
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
  floatSpeed?: number;
  floatAmplitude?: number;
  onClick?: () => void;
  font?: string;
  outlineWidth?: number;
  outlineColor?: string;
}

export function FloatingText({
  children,
  position = [0, 0, 0],
  fontSize = 1,
  color = '#ffffff',
  hoverColor = '#00bcd4',
  anchorX = 'center',
  anchorY = 'middle',
  floatSpeed = 1,
  floatAmplitude = 0.1,
  onClick,
  font,
  outlineWidth = 0.02,
  outlineColor = '#000000',
}: FloatingTextProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame(state => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y =
        position[1] +
        Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
    }

    if (textRef.current) {
      // Scale on hover
      const targetScale = isHovered ? 1.1 : 1;
      textRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={onClick}
    >
      <SafeText
        ref={textRef}
        fontSize={fontSize}
        color={isHovered ? hoverColor : color}
        anchorX={anchorX}
        anchorY={anchorY}
        font={font}
        outlineWidth={outlineWidth}
        outlineColor={outlineColor}
        fillOpacity={isHovered ? 1 : 0.9}
      >
        {children}
      </SafeText>

      {/* Glow effect on hover */}
      {isHovered && (
        <SafeText
          fontSize={fontSize * 1.02}
          color={hoverColor}
          anchorX={anchorX}
          anchorY={anchorY}
          font={font}
          outlineWidth={outlineWidth * 1.5}
          outlineColor={outlineColor}
          fillOpacity={0.3}
        >
          {children}
        </SafeText>
      )}
    </group>
  );
}

export default FloatingText;
