import React from 'react';
import { vi } from 'vitest';

/**
 * Mock for @react-three/fiber Canvas component.
 * Renders children into a div for testing purposes.
 */
interface MockCanvasProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  camera?: unknown;
  dpr?: number | [number, number];
  gl?: unknown;
  onCreated?: (state: unknown) => void;
  [key: string]: unknown;
}

const Canvas: React.FC<MockCanvasProps> = ({
  children,
  fallback,
  className,
  style,
}) => {
  // In test environment, render fallback if provided (to test Suspense behavior)
  // Otherwise render a div with test id
  return (
    <div
      data-testid="r3f-canvas"
      className={className}
      style={style}
      role="img"
      aria-label="3D Scene"
    >
      {fallback || children}
    </div>
  );
};

Canvas.displayName = 'MockCanvas';

// Mock useFrame hook
const useFrame = vi.fn();

// Mock useThree hook
const useThree = vi.fn(() => ({
  camera: {
    position: { x: 0, y: 0, z: 10 },
    lookAt: vi.fn(),
    updateProjectionMatrix: vi.fn(),
  },
  gl: {
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    setClearColor: vi.fn(),
  },
  scene: {
    add: vi.fn(),
    remove: vi.fn(),
  },
  size: {
    width: 800,
    height: 600,
  },
  viewport: {
    width: 800,
    height: 600,
  },
  clock: {
    getElapsedTime: () => 0,
  },
  invalidate: vi.fn(),
}));

// Mock useLoader hook
const useLoader = vi.fn(() => null);

// Mock extend function
const extend = vi.fn();

// Mock createPortal
const createPortal = vi.fn((children: React.ReactNode) => children);

// Mock useGraph
const useGraph = vi.fn(() => ({
  nodes: {},
  materials: {},
}));

// Export the mock module
const reactThreeFiberMock = {
  Canvas,
  useFrame,
  useThree,
  useLoader,
  extend,
  createPortal,
  useGraph,
};

export default reactThreeFiberMock;
