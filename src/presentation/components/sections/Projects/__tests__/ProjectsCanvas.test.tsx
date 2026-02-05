import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Project } from '@/domain/portfolio/entities/Project';
import type { ProjectsCanvasProps } from '../ProjectsCanvas';

// We need to reset modules before importing the component to clear cached WebGL state
let ProjectsCanvas: React.ComponentType<ProjectsCanvasProps>;

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

// Mock ProjectScene
vi.mock('@/presentation/three/scenes/ProjectShowcase', () => ({
  ProjectScene: () => <mesh data-testid="project-scene" />,
}));

// Mock useWebGLCanvas hook
vi.mock('@/presentation/three/hooks', () => ({
  useWebGLCanvas: () => ({
    isMounted: true,
    isSupported: true,
    hasError: false,
    contextLost: false,
  }),
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
    const imported = await import('../ProjectsCanvas');
    ProjectsCanvas = imported.ProjectsCanvas;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it('renders the 3D scene component', () => {
    render(<ProjectsCanvas projects={mockProjects} />);

    expect(screen.getByTestId('project-scene')).toBeInTheDocument();
  });
});
