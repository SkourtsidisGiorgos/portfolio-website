'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * Props for PerformanceMonitor component
 */
export interface PerformanceMonitorProps {
  /** Whether to show the monitor (default: only in development) */
  visible?: boolean;
  /** Position of the monitor */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Refresh interval in ms */
  refreshInterval?: number;
  /** Keyboard shortcut to toggle visibility (default: 'p') */
  toggleKey?: string;
}

/**
 * Performance statistics
 */
interface PerformanceStats {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  memory: number;
}

/**
 * Gets position styles based on position prop
 */
function getPositionStyles(
  position: PerformanceMonitorProps['position']
): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    fontFamily: 'monospace',
    fontSize: '12px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#00ff00',
    padding: '8px 12px',
    borderRadius: '4px',
    pointerEvents: 'none',
    userSelect: 'none',
  };

  switch (position) {
    case 'top-left':
      return { ...base, top: 10, left: 10 };
    case 'top-right':
      return { ...base, top: 10, right: 10 };
    case 'bottom-left':
      return { ...base, bottom: 10, left: 10 };
    case 'bottom-right':
    default:
      return { ...base, bottom: 10, right: 10 };
  }
}

/**
 * Formats bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Dev-only FPS counter and performance monitor for 3D scenes.
 *
 * Single Responsibility: performance display.
 * Only renders in development mode.
 *
 * @example Inside a Canvas:
 * ```tsx
 * <Canvas>
 *   <Scene />
 *   <PerformanceMonitor />
 * </Canvas>
 * ```
 */
export function PerformanceMonitor({
  visible: initialVisible,
  position = 'bottom-right',
  refreshInterval = 100,
  toggleKey = 'p',
}: PerformanceMonitorProps) {
  // Only show in development by default
  const [isVisible, setIsVisible] = useState(
    initialVisible ?? process.env.NODE_ENV === 'development'
  );

  const { gl } = useThree();
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const isInitialized = useRef(false);

  // Initialize lastTime in effect to avoid impure function during render
  useEffect(() => {
    if (!isInitialized.current) {
      lastTime.current = performance.now();
      isInitialized.current = true;
    }
  }, []);
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    memory: 0,
  });

  // Toggle visibility with keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only toggle if not in input field
      if (
        e.key.toLowerCase() === toggleKey &&
        !['INPUT', 'TEXTAREA'].includes((e.target as Element)?.tagName)
      ) {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleKey]);

  // Update stats on interval
  const updateStats = useCallback(() => {
    const now = performance.now();
    const elapsed = now - lastTime.current;
    const fps = (frameCount.current / elapsed) * 1000;

    const info = gl.info;

    // Get memory info if available
    let memory = 0;
    if (info.memory) {
      memory = info.memory.geometries + info.memory.textures;
    }

    setStats({
      fps: Math.round(fps),
      frameTime: elapsed / Math.max(frameCount.current, 1),
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      memory,
    });

    frameCount.current = 0;
    lastTime.current = now;
  }, [gl]);

  // Count frames
  useFrame(() => {
    frameCount.current++;
  });

  // Update stats periodically
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(updateStats, refreshInterval);
    return () => clearInterval(interval);
  }, [isVisible, refreshInterval, updateStats]);

  // Don't render if not visible
  if (!isVisible) return null;

  const fpsColor =
    stats.fps >= 55 ? '#00ff00' : stats.fps >= 30 ? '#ffff00' : '#ff0000';

  return (
    <Html
      as="div"
      style={getPositionStyles(position)}
      transform={false}
      sprite={false}
    >
      <div style={{ lineHeight: 1.5 }}>
        <div style={{ color: fpsColor, fontWeight: 'bold' }}>
          FPS: {stats.fps}
        </div>
        <div>Frame: {stats.frameTime.toFixed(1)}ms</div>
        <div>Draw: {stats.drawCalls}</div>
        <div>Tris: {(stats.triangles / 1000).toFixed(1)}k</div>
        <div>Geo: {stats.geometries}</div>
        <div>Tex: {stats.textures}</div>
        {stats.memory > 0 && <div>Mem: {formatBytes(stats.memory)}</div>}
        <div
          style={{
            marginTop: 4,
            fontSize: '10px',
            opacity: 0.7,
          }}
        >
          Press &apos;{toggleKey}&apos; to toggle
        </div>
      </div>
    </Html>
  );
}

/**
 * Standalone HTML-based performance monitor.
 * Use outside of Canvas for general page performance.
 */
export function PagePerformanceMonitor({
  visible = process.env.NODE_ENV === 'development',
  position = 'bottom-left',
}: Omit<PerformanceMonitorProps, 'toggleKey' | 'refreshInterval'>) {
  const [fps, setFps] = useState(0);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) return;

    const updateFps = () => {
      frameRef.current++;

      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameRef.current / elapsed) * 1000));
        frameRef.current = 0;
        lastTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(updateFps);
    };

    rafRef.current = requestAnimationFrame(updateFps);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [visible]);

  if (!visible) return null;

  const styles = getPositionStyles(position);
  const fpsColor = fps >= 55 ? '#00ff00' : fps >= 30 ? '#ffff00' : '#ff0000';

  return (
    <div style={styles}>
      <span style={{ color: fpsColor }}>{fps} FPS</span>
    </div>
  );
}
