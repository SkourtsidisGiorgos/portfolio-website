import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Skill } from '@/domain/portfolio/entities/Skill';
import type { SkillsCanvasProps } from '../SkillsCanvas';

// We need to reset modules before importing the component to clear cached WebGL state
let SkillsCanvas: React.ComponentType<SkillsCanvasProps>;

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

// Mock SkillsGlobe
vi.mock('@/presentation/three/scenes/SkillsGlobe', () => ({
  SkillsGlobe: () => <mesh data-testid="skills-globe" />,
}));

// Mock useWebGLCanvas hook
vi.mock('@/presentation/three/hooks', () => ({
  useWebGLCanvas: () => ({
    isSupported: true,
    hasError: false,
    contextLost: false,
  }),
}));

// Create mock skills for testing
const mockSkills = [
  Skill.create({
    id: 'skill-1',
    name: 'TypeScript',
    category: 'languages',
    proficiency: 'expert',
    icon: null,
    yearsOfExperience: 5,
  }),
];

describe('SkillsCanvas', () => {
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
    const imported = await import('../SkillsCanvas');
    SkillsCanvas = imported.SkillsCanvas;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders without crashing', () => {
    render(<SkillsCanvas skills={mockSkills} />);

    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('renders with aria-hidden for accessibility', () => {
    const { container } = render(<SkillsCanvas skills={mockSkills} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies default height of 500px', () => {
    const { container } = render(<SkillsCanvas skills={mockSkills} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '500px' });
  });

  it('applies custom height', () => {
    const { container } = render(
      <SkillsCanvas skills={mockSkills} height="600px" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '600px' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <SkillsCanvas skills={mockSkills} className="custom-skills" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-skills');
  });

  it('applies relative positioning', () => {
    const { container } = render(<SkillsCanvas skills={mockSkills} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('relative');
  });

  it('renders the 3D scene component', () => {
    render(<SkillsCanvas skills={mockSkills} />);

    expect(screen.getByTestId('skills-globe')).toBeInTheDocument();
  });
});
