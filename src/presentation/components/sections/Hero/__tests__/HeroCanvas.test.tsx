import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HeroCanvas } from '../HeroCanvas';

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({
    children,
    fallback,
  }: {
    children?: React.ReactNode;
    fallback?: React.ReactNode;
  }) => (
    <div data-testid="r3f-canvas" role="img" aria-label="3D Scene">
      {fallback || children}
    </div>
  ),
}));

// Mock HeroScene
vi.mock('@/presentation/three/scenes/HeroScene', () => ({
  HeroScene: () => <mesh data-testid="hero-scene" />,
}));

describe('HeroCanvas', () => {
  // Mock WebGL support
  let originalGetContext: typeof HTMLCanvasElement.prototype.getContext;
  let mockWebGLSupport = true;

  beforeEach(() => {
    vi.clearAllMocks();

    // Store original getContext
    originalGetContext = HTMLCanvasElement.prototype.getContext;

    // Mock canvas getContext to simulate WebGL support
    HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
      if (contextId === 'webgl' || contextId === 'experimental-webgl') {
        return mockWebGLSupport ? {} : null;
      }
      return originalGetContext.call(
        document.createElement('canvas'),
        contextId as '2d'
      );
    }) as typeof HTMLCanvasElement.prototype.getContext;

    // Reset WebGL support cache by re-importing module
    mockWebGLSupport = true;
  });

  afterEach(() => {
    // Restore original getContext
    HTMLCanvasElement.prototype.getContext = originalGetContext;
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

  describe('Suspense fallback', () => {
    it('shows default loading fallback', () => {
      render(<HeroCanvas />);

      // The Canvas mock renders fallback if provided
      expect(screen.getByText('Loading 3D scene...')).toBeInTheDocument();
    });

    it('shows custom fallback when provided', () => {
      render(<HeroCanvas fallback={<div>Custom Loading...</div>} />);

      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });
  });

  describe('WebGL context loss handling', () => {
    it('handles webglcontextlost event', async () => {
      render(<HeroCanvas />);

      // Initially shows canvas
      expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();

      // Simulate context loss
      await act(async () => {
        const event = new Event('webglcontextlost');
        window.dispatchEvent(event);
      });

      // Should show error fallback
      expect(
        screen.getByText('3D visualization requires WebGL support.')
      ).toBeInTheDocument();
    });

    it('handles webglcontextrestored event', async () => {
      render(<HeroCanvas />);

      // Simulate context loss
      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      // Verify error state
      expect(
        screen.getByText('3D visualization requires WebGL support.')
      ).toBeInTheDocument();

      // Simulate context restored
      await act(async () => {
        window.dispatchEvent(new Event('webglcontextrestored'));
      });

      // Should show canvas again
      expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
    });

    it('shows custom error fallback when provided', async () => {
      render(<HeroCanvas errorFallback={<div>Custom Error Message</div>} />);

      // Simulate context loss
      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(screen.getByText('Custom Error Message')).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<HeroCanvas />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'webglcontextlost',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'webglcontextrestored',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
