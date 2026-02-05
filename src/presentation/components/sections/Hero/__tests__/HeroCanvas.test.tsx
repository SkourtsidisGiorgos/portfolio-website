import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { HeroCanvasProps } from '../HeroCanvas';

// We need to reset modules before importing the component to clear cached WebGL state
let HeroCanvas: React.ComponentType<HeroCanvasProps>;

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({
    children,
  }: {
    children?: React.ReactNode;
    fallback?: React.ReactNode;
  }) => (
    <div data-testid="r3f-canvas" role="img" aria-label="3D Scene">
      {children}
    </div>
  ),
}));

// Mock HeroScene
vi.mock('@/presentation/three/scenes/HeroScene', () => ({
  HeroScene: () => <mesh data-testid="hero-scene" />,
}));

// Mock useWebGLCanvas hook
vi.mock('@/presentation/three/hooks', () => ({
  useWebGLCanvas: () => ({
    isSupported: true,
    hasError: false,
    contextLost: false,
  }),
}));

describe('HeroCanvas', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    // Mock window.WebGLRenderingContext to simulate WebGL support
    vi.stubGlobal(
      'WebGLRenderingContext',
      vi.fn(() => ({}))
    );

    // Mock canvas.getContext to return a WebGL context
    HTMLCanvasElement.prototype.getContext = vi.fn(
      (contextId: string) => {
        if (contextId === 'webgl' || contextId === 'experimental-webgl') {
          return {}; // Return truthy object to indicate support
        }
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;

    // Dynamically import the component after setting up mocks
    const imported = await import('../HeroCanvas');
    HeroCanvas = imported.HeroCanvas;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders without crashing', () => {
    render(<HeroCanvas />);

    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('renders with aria-hidden for accessibility', () => {
    const { container } = render(<HeroCanvas />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies default height', () => {
    const { container } = render(<HeroCanvas />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '100vh' });
  });

  it('applies custom height', () => {
    const { container } = render(<HeroCanvas height="500px" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '500px' });
  });

  it('applies custom className', () => {
    const { container } = render(<HeroCanvas className="custom-canvas" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-canvas');
  });

  it('applies relative positioning', () => {
    const { container } = render(<HeroCanvas />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('relative');
  });

  it('renders the 3D scene component', () => {
    render(<HeroCanvas />);

    expect(screen.getByTestId('hero-scene')).toBeInTheDocument();
  });
});
