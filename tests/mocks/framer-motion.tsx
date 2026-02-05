import React, { type ComponentPropsWithoutRef, type ElementType } from 'react';
import { vi } from 'vitest';

/**
 * Type-safe factory function for creating mock motion components.
 * Preserves all HTML attributes while filtering out framer-motion specific props.
 */
function createMockMotionComponent<T extends ElementType>(
  Component: T
): React.FC<ComponentPropsWithoutRef<T> & Record<string, unknown>> {
  const MockComponent: React.FC<
    ComponentPropsWithoutRef<T> & Record<string, unknown>
  > = ({ children, ...props }) => {
    // Filter out framer-motion specific props
    const {
      initial,
      animate,
      exit,
      transition,
      variants,
      whileHover,
      whileTap,
      whileFocus,
      whileDrag,
      whileInView,
      drag,
      dragConstraints,
      dragElastic,
      dragMomentum,
      dragTransition,
      dragPropagation,
      dragControls,
      dragListener,
      dragDirectionLock,
      dragSnapToOrigin,
      onDragStart,
      onDrag,
      onDragEnd,
      onDirectionLock,
      onDragTransitionEnd,
      onPan,
      onPanStart,
      onPanEnd,
      onTap,
      onTapCancel,
      onTapStart,
      onHoverStart,
      onHoverEnd,
      onViewportEnter,
      onViewportLeave,
      viewport,
      layout,
      layoutId,
      layoutDependency,
      layoutScroll,
      layoutRoot,
      onLayoutAnimationStart,
      onLayoutAnimationComplete,
      style,
      transformTemplate,
      custom,
      inherit,
      onAnimationStart,
      onAnimationComplete,
      onUpdate,
      ...htmlProps
    } = props;

    // Convert layoutId to data attribute for testing purposes
    const testProps = layoutId ? { 'data-layout-id': layoutId } : {};

    return React.createElement(
      Component,
      { ...htmlProps, ...testProps, style },
      children
    );
  };

  MockComponent.displayName = `MockMotion${String(Component)}`;
  return MockComponent;
}

// Create mock motion components for commonly used HTML elements
const motion = {
  div: createMockMotionComponent('div'),
  span: createMockMotionComponent('span'),
  button: createMockMotionComponent('button'),
  a: createMockMotionComponent('a'),
  ul: createMockMotionComponent('ul'),
  li: createMockMotionComponent('li'),
  ol: createMockMotionComponent('ol'),
  p: createMockMotionComponent('p'),
  h1: createMockMotionComponent('h1'),
  h2: createMockMotionComponent('h2'),
  h3: createMockMotionComponent('h3'),
  h4: createMockMotionComponent('h4'),
  h5: createMockMotionComponent('h5'),
  h6: createMockMotionComponent('h6'),
  section: createMockMotionComponent('section'),
  article: createMockMotionComponent('article'),
  aside: createMockMotionComponent('aside'),
  header: createMockMotionComponent('header'),
  footer: createMockMotionComponent('footer'),
  nav: createMockMotionComponent('nav'),
  main: createMockMotionComponent('main'),
  form: createMockMotionComponent('form'),
  input: createMockMotionComponent('input'),
  textarea: createMockMotionComponent('textarea'),
  label: createMockMotionComponent('label'),
  img: createMockMotionComponent('img'),
  svg: createMockMotionComponent('svg'),
  path: createMockMotionComponent('path'),
  circle: createMockMotionComponent('circle'),
  rect: createMockMotionComponent('rect'),
  line: createMockMotionComponent('line'),
  polyline: createMockMotionComponent('polyline'),
  polygon: createMockMotionComponent('polygon'),
  g: createMockMotionComponent('g'),
};

// Mock AnimatePresence - renders children directly
const AnimatePresence: React.FC<{
  children: React.ReactNode;
  mode?: 'sync' | 'wait' | 'popLayout';
  initial?: boolean;
  onExitComplete?: () => void;
  custom?: unknown;
  presenceAffectsLayout?: boolean;
}> = ({ children }) => <>{children}</>;
AnimatePresence.displayName = 'MockAnimatePresence';

// Mock LazyMotion - renders children directly
const LazyMotion: React.FC<{
  children: React.ReactNode;
  features: unknown;
  strict?: boolean;
}> = ({ children }) => <>{children}</>;
LazyMotion.displayName = 'MockLazyMotion';

// Mock MotionConfig - renders children directly
const MotionConfig: React.FC<{
  children: React.ReactNode;
  transition?: unknown;
  reducedMotion?: 'user' | 'always' | 'never';
}> = ({ children }) => <>{children}</>;
MotionConfig.displayName = 'MockMotionConfig';

// Mock hooks
const useInView = vi.fn(() => true);
const useReducedMotion = vi.fn(() => false);
const useScroll = vi.fn(() => ({
  scrollX: { get: () => 0, set: () => {} },
  scrollY: { get: () => 0, set: () => {} },
  scrollXProgress: { get: () => 0, set: () => {} },
  scrollYProgress: { get: () => 0, set: () => {} },
}));
const useTransform = vi.fn(
  (
    _value: unknown,
    _inputRange: number[],
    _outputRange: unknown[],
    _options?: unknown
  ) => ({
    get: () => 0,
    set: () => {},
  })
);
const useAnimation = vi.fn(() => ({
  start: vi.fn().mockResolvedValue(undefined),
  stop: vi.fn(),
  set: vi.fn(),
}));
const useMotionValue = vi.fn((initial: number) => ({
  get: () => initial,
  set: () => {},
  onChange: vi.fn(),
  on: vi.fn(),
}));
const useSpring = vi.fn((initial: unknown) => ({
  get: () => (typeof initial === 'number' ? initial : 0),
  set: () => {},
}));
const useVelocity = vi.fn(() => ({
  get: () => 0,
  set: () => {},
}));
const useAnimationFrame = vi.fn();
const useDragControls = vi.fn(() => ({
  start: vi.fn(),
}));
const useMotionTemplate = vi.fn(() => '');
const useTime = vi.fn(() => ({
  get: () => 0,
  set: () => {},
}));
const useWillChange = vi.fn(() => 'auto');
const useIsPresent = vi.fn(() => true);
const usePresence = vi.fn(() => [true, vi.fn()]);

// Mock animation controls
const animationControls = vi.fn(() => ({
  start: vi.fn().mockResolvedValue(undefined),
  stop: vi.fn(),
  set: vi.fn(),
}));

// Mock easing functions
const easeIn = vi.fn((t: number) => t);
const easeOut = vi.fn((t: number) => t);
const easeInOut = vi.fn((t: number) => t);

// Mock utilities
const transform = vi.fn(
  (value: number, _inputRange: number[], _outputRange: number[]) => value
);
const wrap = vi.fn((min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
});

// Mock feature bundles (for LazyMotion)
const domAnimation = {};
const domMax = {};

// Export the mock module
const framerMotionMock = {
  motion,
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useAnimation,
  useMotionValue,
  useSpring,
  useVelocity,
  useAnimationFrame,
  useDragControls,
  useMotionTemplate,
  useTime,
  useWillChange,
  useIsPresent,
  usePresence,
  animationControls,
  easeIn,
  easeOut,
  easeInOut,
  transform,
  wrap,
  domAnimation,
  domMax,
};

export default framerMotionMock;
