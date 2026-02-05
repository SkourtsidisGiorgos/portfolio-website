import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Project } from '@/domain/portfolio/entities/Project';
import { ProjectsCanvas } from '../ProjectsCanvas';

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

// Mock ProjectScene
vi.mock('@/presentation/three/scenes/ProjectShowcase', () => ({
  ProjectScene: () => <mesh data-testid="project-scene" />,
}));

// Create mock projects for testing
const mockProjects = [
  Project.create({
    id: 'project-1',
    title: 'Test Project',
    description: 'A test project',
    technologies: ['TypeScript', 'React'],
    type: 'oss',
    githubUrl: 'https://github.com/test/project',
    liveUrl: null,
    image: null,
    featured: true,
  }),
];

describe('ProjectsCanvas', () => {
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
    render(<ProjectsCanvas projects={mockProjects} />);

    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('renders with aria-hidden for accessibility', () => {
    const { container } = render(<ProjectsCanvas projects={mockProjects} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies default height of 500px', () => {
    const { container } = render(<ProjectsCanvas projects={mockProjects} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '500px' });
  });

  it('applies custom height', () => {
    const { container } = render(
      <ProjectsCanvas projects={mockProjects} height="700px" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '700px' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProjectsCanvas projects={mockProjects} className="custom-projects" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-projects');
  });

  it('applies relative positioning', () => {
    const { container } = render(<ProjectsCanvas projects={mockProjects} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('relative');
  });

  describe('Suspense fallback', () => {
    it('shows default loading fallback', () => {
      render(<ProjectsCanvas projects={mockProjects} />);

      expect(
        screen.getByText('Loading project showcase...')
      ).toBeInTheDocument();
    });

    it('shows custom fallback when provided', () => {
      render(
        <ProjectsCanvas
          projects={mockProjects}
          fallback={<div>Loading Projects...</div>}
        />
      );

      expect(screen.getByText('Loading Projects...')).toBeInTheDocument();
    });
  });

  describe('error fallback', () => {
    it('shows error fallback on WebGL context loss', async () => {
      render(<ProjectsCanvas projects={mockProjects} />);

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(
        screen.getByText('3D showcase requires WebGL support.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('View projects grid below instead.')
      ).toBeInTheDocument();
    });

    it('shows custom error fallback when provided', async () => {
      render(
        <ProjectsCanvas
          projects={mockProjects}
          errorFallback={<div>Custom Projects Error</div>}
        />
      );

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(screen.getByText('Custom Projects Error')).toBeInTheDocument();
    });

    it('recovers from error on context restored', async () => {
      render(<ProjectsCanvas projects={mockProjects} />);

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(
        screen.getByText('3D showcase requires WebGL support.')
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

      const { unmount } = render(<ProjectsCanvas projects={mockProjects} />);
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
