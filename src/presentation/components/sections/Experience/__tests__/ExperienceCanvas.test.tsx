import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import { ExperienceCanvas } from '../ExperienceCanvas';

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

// Mock ExperienceTimeline
vi.mock('@/presentation/three/scenes/ExperienceTimeline', () => ({
  ExperienceTimeline: () => <mesh data-testid="experience-timeline" />,
}));

// Create mock experiences for testing
const mockExperiences: ExperienceDTO[] = [
  {
    id: 'exp-1',
    company: 'Test Company',
    role: 'Software Engineer',
    description: ['Working on projects'],
    technologies: ['TypeScript', 'React'],
    startDate: '2023-01-01',
    endDate: null,
    location: 'Remote',
    locationDisplay: 'Remote',
    remote: true,
    isCurrent: true,
    duration: '1 year',
    formattedDateRange: 'Jan 2023 - Present',
  },
];

describe('ExperienceCanvas', () => {
  let originalGetContext: typeof HTMLCanvasElement.prototype.getContext;
  let mockWebGLSupport = true;

  beforeEach(() => {
    vi.clearAllMocks();
    originalGetContext = HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
      if (contextId === 'webgl' || contextId === 'experimental-webgl') {
        return mockWebGLSupport ? {} : null;
      }
      return originalGetContext.call(
        document.createElement('canvas'),
        contextId as '2d'
      );
    }) as typeof HTMLCanvasElement.prototype.getContext;

    mockWebGLSupport = true;
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('renders without crashing', () => {
    render(<ExperienceCanvas experiences={mockExperiences} />);

    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('renders with aria-hidden for accessibility', () => {
    const { container } = render(
      <ExperienceCanvas experiences={mockExperiences} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies default height of 450px', () => {
    const { container } = render(
      <ExperienceCanvas experiences={mockExperiences} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '450px' });
  });

  it('applies custom height', () => {
    const { container } = render(
      <ExperienceCanvas experiences={mockExperiences} height="600px" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '600px' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <ExperienceCanvas
        experiences={mockExperiences}
        className="custom-experience"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-experience');
  });

  it('applies relative positioning', () => {
    const { container } = render(
      <ExperienceCanvas experiences={mockExperiences} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('relative');
  });

  describe('Suspense fallback', () => {
    it('shows default loading fallback', () => {
      render(<ExperienceCanvas experiences={mockExperiences} />);

      expect(screen.getByText('Loading timeline...')).toBeInTheDocument();
    });

    it('shows custom fallback when provided', () => {
      render(
        <ExperienceCanvas
          experiences={mockExperiences}
          fallback={<div>Loading Experience...</div>}
        />
      );

      expect(screen.getByText('Loading Experience...')).toBeInTheDocument();
    });
  });

  describe('error fallback', () => {
    it('shows error fallback on WebGL context loss', async () => {
      render(<ExperienceCanvas experiences={mockExperiences} />);

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(
        screen.getByText('3D timeline requires WebGL support.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('View experience list below instead.')
      ).toBeInTheDocument();
    });

    it('shows custom error fallback when provided', async () => {
      render(
        <ExperienceCanvas
          experiences={mockExperiences}
          errorFallback={<div>Custom Timeline Error</div>}
        />
      );

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(screen.getByText('Custom Timeline Error')).toBeInTheDocument();
    });

    it('recovers from error on context restored', async () => {
      render(<ExperienceCanvas experiences={mockExperiences} />);

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(
        screen.getByText('3D timeline requires WebGL support.')
      ).toBeInTheDocument();

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextrestored'));
      });

      expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <ExperienceCanvas experiences={mockExperiences} />
      );
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
