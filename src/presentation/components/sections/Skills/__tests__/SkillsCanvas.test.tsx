import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Skill } from '@/domain/portfolio/entities/Skill';
import { SkillsCanvas } from '../SkillsCanvas';

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

// Mock SkillsGlobe
vi.mock('@/presentation/three/scenes/SkillsGlobe', () => ({
  SkillsGlobe: () => <mesh data-testid="skills-globe" />,
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

  describe('Suspense fallback', () => {
    it('shows default loading fallback', () => {
      render(<SkillsCanvas skills={mockSkills} />);

      expect(screen.getByText('Loading skills globe...')).toBeInTheDocument();
    });

    it('shows custom fallback when provided', () => {
      render(
        <SkillsCanvas
          skills={mockSkills}
          fallback={<div>Loading Skills...</div>}
        />
      );

      expect(screen.getByText('Loading Skills...')).toBeInTheDocument();
    });
  });

  describe('error fallback', () => {
    it('shows error fallback on WebGL context loss', async () => {
      render(<SkillsCanvas skills={mockSkills} />);

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(
        screen.getByText('3D globe requires WebGL support.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('View skills list below instead.')
      ).toBeInTheDocument();
    });

    it('shows custom error fallback when provided', async () => {
      render(
        <SkillsCanvas
          skills={mockSkills}
          errorFallback={<div>Custom Skills Error</div>}
        />
      );

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(screen.getByText('Custom Skills Error')).toBeInTheDocument();
    });

    it('recovers from error on context restored', async () => {
      render(<SkillsCanvas skills={mockSkills} />);

      await act(async () => {
        window.dispatchEvent(new Event('webglcontextlost'));
      });

      expect(
        screen.getByText('3D globe requires WebGL support.')
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

      const { unmount } = render(<SkillsCanvas skills={mockSkills} />);
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
