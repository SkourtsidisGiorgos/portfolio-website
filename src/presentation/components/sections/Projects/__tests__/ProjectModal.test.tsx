import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Project } from '@/domain/portfolio/entities/Project';
import { ProjectModal } from '../ProjectModal';

// Mock framer-motion with proper handling of AnimatePresence children
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, className, role, ...props }: any) => (
      <div className={className} role={role} {...props}>
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
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ProjectModal', () => {
  const createTestProject = (
    overrides?: Partial<Parameters<typeof Project.create>[0]>
  ) =>
    Project.create({
      id: 'proj-test',
      title: 'Test Project',
      description: 'Test description for the project',
      technologies: ['TypeScript', 'React', 'Node.js'],
      type: 'oss',
      featured: false,
      githubUrl: 'https://github.com/test/project',
      liveUrl: 'https://example.com',
      ...overrides,
    });

  afterEach(() => {
    // Reset body overflow
    document.body.style.overflow = '';
  });

  it('renders nothing when project is null', () => {
    const { container } = render(
      <ProjectModal project={null} onClose={vi.fn()} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal when project is provided', () => {
    const project = createTestProject();
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders project title', () => {
    const project = createTestProject({ title: 'My Amazing Project' });
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByText('My Amazing Project')).toBeInTheDocument();
  });

  it('renders project description', () => {
    const project = createTestProject({ description: 'This is amazing' });
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByText('This is amazing')).toBeInTheDocument();
  });

  it('renders project type badge', () => {
    const project = createTestProject({ type: 'oss' });
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByText('Open Source')).toBeInTheDocument();
  });

  it('renders featured badge when project is featured', () => {
    const project = createTestProject({ featured: true });
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders all technologies', () => {
    const project = createTestProject({
      technologies: ['TypeScript', 'React', 'Node.js', 'Python', 'Spark'],
    });
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Spark')).toBeInTheDocument();
  });

  it('renders GitHub button when project has GitHub URL', () => {
    const project = createTestProject({ githubUrl: 'https://github.com/test' });
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByText('View on GitHub')).toBeInTheDocument();
  });

  it('renders Demo button when project has live URL', () => {
    const project = createTestProject({ liveUrl: 'https://example.com' });
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByText('Live Demo')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const project = createTestProject();
    const handleClose = vi.fn();
    render(<ProjectModal project={project} onClose={handleClose} />);

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const project = createTestProject();
    const handleClose = vi.fn();
    render(<ProjectModal project={project} onClose={handleClose} />);

    // Find the backdrop (first div that's not the modal)
    const backdrop = screen.getByRole('dialog').previousSibling as HTMLElement;
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const project = createTestProject();
    const handleClose = vi.fn();
    render(<ProjectModal project={project} onClose={handleClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalled();
  });

  it('has correct aria-modal attribute', () => {
    const project = createTestProject();
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('has correct aria-labelledby attribute', () => {
    const project = createTestProject();
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-labelledby',
      'project-modal-title'
    );
  });

  it('has correct aria-describedby attribute', () => {
    const project = createTestProject();
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-describedby',
      'project-modal-description'
    );
  });

  it('prevents body scroll when open', () => {
    const project = createTestProject();
    render(<ProjectModal project={project} onClose={vi.fn()} />);

    expect(document.body.style.overflow).toBe('hidden');
  });
});
