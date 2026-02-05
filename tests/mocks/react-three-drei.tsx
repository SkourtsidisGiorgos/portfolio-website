import React from 'react';
import { vi } from 'vitest';

/**
 * Mock for @react-three/drei library.
 * Provides mock implementations of commonly used drei components and hooks.
 */

// Mock components that render as simple divs/spans
const Text: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span data-testid="drei-text">{children}</span>
);
Text.displayName = 'MockText';

const Html: React.FC<{
  children?: React.ReactNode;
  center?: boolean;
  transform?: boolean;
  [key: string]: unknown;
}> = ({ children }) => <div data-testid="drei-html">{children}</div>;
Html.displayName = 'MockHtml';

const Billboard: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group data-testid="drei-billboard">{children}</group>
);
Billboard.displayName = 'MockBillboard';

const Float: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group data-testid="drei-float">{children}</group>
);
Float.displayName = 'MockFloat';

const Stars: React.FC = () => <mesh data-testid="drei-stars" />;
Stars.displayName = 'MockStars';

const Environment: React.FC = () => null;
Environment.displayName = 'MockEnvironment';

const PerspectiveCamera: React.FC<{
  makeDefault?: boolean;
  position?: [number, number, number];
  fov?: number;
}> = () => null;
PerspectiveCamera.displayName = 'MockPerspectiveCamera';

const OrbitControls: React.FC = () => null;
OrbitControls.displayName = 'MockOrbitControls';

const ContactShadows: React.FC = () => null;
ContactShadows.displayName = 'MockContactShadows';

const Preload: React.FC<{ all?: boolean }> = () => null;
Preload.displayName = 'MockPreload';

const CameraShake: React.FC = () => null;
CameraShake.displayName = 'MockCameraShake';

const Sphere: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <mesh data-testid="drei-sphere">{children}</mesh>
);
Sphere.displayName = 'MockSphere';

const Box: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <mesh data-testid="drei-box">{children}</mesh>
);
Box.displayName = 'MockBox';

const Line: React.FC<{ points?: unknown[] }> = () => (
  <primitive data-testid="drei-line" object={{}} />
);
Line.displayName = 'MockLine';

const QuadraticBezierLine: React.FC = () => (
  <primitive data-testid="drei-bezier-line" object={{}} />
);
QuadraticBezierLine.displayName = 'MockQuadraticBezierLine';

const shaderMaterial = vi.fn(() => vi.fn());

// Mock hooks
const useTexture = vi.fn(() => null);
const useGLTF = vi.fn(() => ({
  scene: { clone: vi.fn() },
  nodes: {},
  materials: {},
}));
const useProgress = vi.fn(() => ({
  active: false,
  progress: 100,
  errors: [],
  item: '',
  loaded: 1,
  total: 1,
}));
const useCursor = vi.fn();
const useHelper = vi.fn();
const useBVH = vi.fn();

// Export the mock module
const reactThreeDreiMock = {
  Text,
  Html,
  Billboard,
  Float,
  Stars,
  Environment,
  PerspectiveCamera,
  OrbitControls,
  ContactShadows,
  Preload,
  CameraShake,
  Sphere,
  Box,
  Line,
  QuadraticBezierLine,
  shaderMaterial,
  useTexture,
  useGLTF,
  useProgress,
  useCursor,
  useHelper,
  useBVH,
};

export default reactThreeDreiMock;
