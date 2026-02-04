import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Projects } from '../Projects';

// Mock framer-motion with all needed components
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    button: ({ children, className, ...props }: any) => (
      <button className={className} {...props}>
        {children}
      </button>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
  },
  useInView: vi.fn(() => true),
  useReducedMotion: vi.fn(() => false),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock useProjectShowcase hook
vi.mock('@/presentation/hooks/useProjectShowcase', () => ({
  useProjectShowcase: () => ({
    projects: [
      {
        id: 'proj-1',
        title: 'Test Project 1',
        description: 'Test description 1',
        type: 'oss',
        featured: true,
        technologies: { items: ['TypeScript', 'React'], count: 2 },
        githubUrl: 'https://github.com/test/project1',
        liveUrl: null,
        hasGithub: () => true,
        hasLiveDemo: () => false,
        hasImage: () => false,
        isOpenSource: () => true,
        isProfessional: () => false,
        usesTechnology: () => false,
      },
      {
        id: 'proj-2',
        title: 'Test Project 2',
        description: 'Test description 2',
        type: 'professional',
        featured: false,
        technologies: { items: ['Python', 'Spark'], count: 2 },
        githubUrl: null,
        liveUrl: null,
        hasGithub: () => false,
        hasLiveDemo: () => false,
        hasImage: () => false,
        isOpenSource: () => false,
        isProfessional: () => true,
        usesTechnology: () => false,
      },
    ],
    featuredProjects: [],
    filterOptions: [
      { id: 'all', label: 'All Projects', count: 2 },
      { id: 'oss', label: 'Open Source', count: 1 },
      { id: 'professional', label: 'Professional', count: 1 },
    ],
    selectedFilter: 'all',
    setSelectedFilter: vi.fn(),
    selectedProject: null,
    setSelectedProject: vi.fn(),
    hoveredProject: null,
    setHoveredProject: vi.fn(),
    filteredProjects: [
      {
        id: 'proj-1',
        title: 'Test Project 1',
        description: 'Test description 1',
        type: 'oss',
        featured: true,
        technologies: { items: ['TypeScript', 'React'], count: 2 },
        githubUrl: 'https://github.com/test/project1',
        liveUrl: null,
        hasGithub: () => true,
        hasLiveDemo: () => false,
        hasImage: () => false,
        isOpenSource: () => true,
        isProfessional: () => false,
        usesTechnology: () => false,
      },
      {
        id: 'proj-2',
        title: 'Test Project 2',
        description: 'Test description 2',
        type: 'professional',
        featured: false,
        technologies: { items: ['Python', 'Spark'], count: 2 },
        githubUrl: null,
        liveUrl: null,
        hasGithub: () => false,
        hasLiveDemo: () => false,
        hasImage: () => false,
        isOpenSource: () => false,
        isProfessional: () => true,
        usesTechnology: () => false,
      },
    ],
    quality: 'high',
    isWebGLSupported: false, // Force grid fallback for testing
  }),
}));

describe('Projects', () => {
  it('renders section with correct id', () => {
    const { container } = render(<Projects />);

    const section = container.querySelector('#projects');
    expect(section).toBeInTheDocument();
  });

  it('renders section heading', () => {
    render(<Projects />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('renders caption', () => {
    render(<Projects />);

    expect(screen.getByText('Featured Work')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<Projects />);

    expect(
      screen.getByText(/A selection of projects showcasing/)
    ).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(<Projects />);

    expect(screen.getByText('All Projects')).toBeInTheDocument();
    // There can be multiple instances of these texts in filter and cards
    expect(screen.getAllByText('Open Source').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Professional').length).toBeGreaterThan(0);
  });

  it('renders project cards', () => {
    render(<Projects />);

    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
  });

  it('renders project descriptions', () => {
    render(<Projects />);

    expect(screen.getByText('Test description 1')).toBeInTheDocument();
    expect(screen.getByText('Test description 2')).toBeInTheDocument();
  });

  it('has correct aria-labelledby for accessibility', () => {
    const { container } = render(<Projects />);

    const section = container.querySelector('#projects');
    expect(section).toHaveAttribute('aria-labelledby', 'projects-heading');
  });

  it('accepts custom id', () => {
    const { container } = render(<Projects id="custom-projects" />);

    const section = container.querySelector('#custom-projects');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Projects className="custom-class" />);

    const section = container.querySelector('#projects');
    expect(section).toHaveClass('custom-class');
  });
});
