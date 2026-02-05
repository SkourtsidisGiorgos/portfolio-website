import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ExperienceDTO } from '@/application/dto/ExperienceDTO';
import type { ExperienceCanvasProps } from '../ExperienceCanvas';

// We need to reset modules before importing the component to clear cached WebGL state
let ExperienceCanvas: React.ComponentType<ExperienceCanvasProps>;

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

// Mock ExperienceTimeline
vi.mock('@/presentation/three/scenes/ExperienceTimeline', () => ({
  ExperienceTimeline: () => <mesh data-testid="experience-timeline" />,
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
    const imported = await import('../ExperienceCanvas');
    ExperienceCanvas = imported.ExperienceCanvas;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it('renders the 3D scene component', () => {
    render(<ExperienceCanvas experiences={mockExperiences} />);

    expect(screen.getByTestId('experience-timeline')).toBeInTheDocument();
  });
});
