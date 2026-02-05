'use client';

import { memo, forwardRef, useSyncExternalStore } from 'react';
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
let _textSupportChecked = false;
let _isTextSupported = true;

function checkTextSupport(): boolean {
  if (!_textSupportChecked) {
    _textSupportChecked = true;
    _isTextSupported = checkWebGLInstancedArraysSupport();
    if (!_isTextSupported) {
      console.warn(
        'SafeText: WebGL instanced arrays not supported, using HTML fallback'
      );
    }
  }
  return _isTextSupported;
}

// useSyncExternalStore setup for text support
function subscribeTextSupport(_callback: () => void): () => void {
  return () => {};
}

function getTextSupportSnapshot(): {
  isChecked: boolean;
  isSupported: boolean;
} {
  return { isChecked: true, isSupported: checkTextSupport() };
}

function getTextSupportServerSnapshot(): {
  isChecked: boolean;
  isSupported: boolean;
} {
  return { isChecked: false, isSupported: true }; // SSR: not checked yet, assume supported
}

/**
 * Hook to check text support using useSyncExternalStore for SSR safety
 */
function useTextSupport(): { isChecked: boolean; isSupported: boolean } {
  return useSyncExternalStore(
    subscribeTextSupport,
    getTextSupportSnapshot,
    getTextSupportServerSnapshot
  );
}

export interface SafeTextProps extends Omit<TextProps, 'children'> {
  children: string;
  /** Show HTML fallback text instead of 3D text when not supported (default: true) */
  htmlFallback?: boolean;
  /** CSS class for HTML fallback */
  fallbackClassName?: string;
}

/**
 * A wrapper around drei's Text component that gracefully handles
 * WebGL extension errors (like ANGLE_instanced_arrays not supported).
 *
 * On unsupported systems, it renders an HTML fallback by default.
 */
export const SafeText = memo(
  forwardRef<THREE.Mesh, SafeTextProps>(function SafeText(
    {
      children,
      htmlFallback = true, // Changed default to true for better fallback behavior
      fallbackClassName = 'text-white text-sm whitespace-nowrap',
      position = [0, 0, 0],
      fontSize = 1,
      color = '#ffffff',
      ...props
    },
    ref
  ) {
    const { isChecked, isSupported } = useTextSupport();

    // Render HTML fallback while checking support or if not supported
    if (!isChecked || !isSupported) {
      if (htmlFallback) {
        return (
          <Html
            position={position as [number, number, number]}
            center
            style={{ pointerEvents: 'none' }}
          >
            <span
              className={fallbackClassName}
              style={{
                color: color as string,
                fontSize: `${(fontSize as number) * 12}px`,
                textShadow: '0 0 4px rgba(0,0,0,0.8)',
              }}
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
