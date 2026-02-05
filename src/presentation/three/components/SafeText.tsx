'use client';

import { memo, forwardRef } from 'react';
import { Text, type TextProps } from '@react-three/drei';
import { Html } from '@react-three/drei';
import type * as THREE from 'three';

/**
 * Check if WebGL supports instanced arrays (required by troika-three-text)
 */
function checkWebGLInstancedArraysSupport(): boolean {
  if (typeof window === 'undefined') return true; // SSR - assume supported

  try {
    const canvas = document.createElement('canvas');

    // Try WebGL2 first (has instanced arrays built-in)
    const gl2 = canvas.getContext('webgl2');
    if (gl2) return true;

    // Fall back to WebGL1 and check for extension
    const gl1 =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl1) return false;

    const webgl = gl1 as WebGLRenderingContext;
    const ext = webgl.getExtension('ANGLE_instanced_arrays');

    return !!ext;
  } catch {
    return false;
  }
}

// Cache the result globally
let _isSupported: boolean | null = null;

function isTextSupported(): boolean {
  if (_isSupported === null) {
    _isSupported = checkWebGLInstancedArraysSupport();
    if (!_isSupported) {
      console.warn(
        'SafeText: WebGL instanced arrays not supported, 3D text will be disabled'
      );
    }
  }
  return _isSupported;
}

export interface SafeTextProps extends Omit<TextProps, 'children'> {
  children: string;
  /** Show HTML fallback text instead of 3D text when not supported */
  htmlFallback?: boolean;
  /** CSS class for HTML fallback */
  fallbackClassName?: string;
}

/**
 * A wrapper around drei's Text component that gracefully handles
 * WebGL extension errors (like ANGLE_instanced_arrays not supported).
 *
 * On unsupported systems, it either renders nothing or an HTML fallback.
 */
export const SafeText = memo(
  forwardRef<THREE.Mesh, SafeTextProps>(function SafeText(
    {
      children,
      htmlFallback = false,
      fallbackClassName = 'text-white text-sm',
      position = [0, 0, 0],
      fontSize = 1,
      color = '#ffffff',
      ...props
    },
    ref
  ) {
    // Check support once
    if (!isTextSupported()) {
      if (htmlFallback) {
        return (
          <Html position={position as [number, number, number]} center>
            <span
              className={fallbackClassName}
              style={{ color: color as string }}
            >
              {children}
            </span>
          </Html>
        );
      }
      return null;
    }

    return (
      <Text
        ref={ref}
        position={position}
        fontSize={fontSize}
        color={color}
        {...props}
      >
        {children}
      </Text>
    );
  })
);

export default SafeText;
