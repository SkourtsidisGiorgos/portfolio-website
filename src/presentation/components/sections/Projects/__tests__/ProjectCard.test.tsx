import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Project } from '@/domain/portfolio/entities/Project';
import { ProjectCard } from '../ProjectCard';

describe('ProjectCard', () => {
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
      liveUrl: null,
      ...overrides,
    });

  it('renders project title', () => {
    const project = createTestProject({ title: 'My Amazing Project' });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('My Amazing Project')).toBeInTheDocument();
  });

  it('renders project description', () => {
    const project = createTestProject({
      description: 'This is a great project',
    });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('This is a great project')).toBeInTheDocument();
  });

  it('renders project type badge', () => {
    const project = createTestProject({ type: 'oss' });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Open Source')).toBeInTheDocument();
  });

  it('renders featured badge when project is featured', () => {
    const project = createTestProject({ featured: true });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('does not render featured badge when project is not featured', () => {
    const project = createTestProject({ featured: false });
    render(<ProjectCard project={project} />);

    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('renders technology badges', () => {
    const project = createTestProject({
      technologies: ['TypeScript', 'React', 'Node.js'],
    });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('shows overflow count for more than 4 technologies', () => {
    const project = createTestProject({
      technologies: [
        'TypeScript',
        'React',
        'Node.js',
        'Python',
        'Spark',
        'Kafka',
      ],
    });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('renders GitHub button when project has GitHub URL', () => {
    const project = createTestProject({ githubUrl: 'https://github.com/test' });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Code')).toBeInTheDocument();
  });

  it('renders Demo button when project has live URL', () => {
    const project = createTestProject({ liveUrl: 'https://example.com' });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Demo')).toBeInTheDocument();
  });

  it('calls onClick handler when card is clicked', () => {
    const project = createTestProject();
    const handleClick = vi.fn();
    render(<ProjectCard project={project} onClick={handleClick} />);

    // Find the card element and click it
    const card = screen
      .getByText('Test Project')
      .closest('[class*="cursor-pointer"]');
    if (card) {
      fireEvent.click(card);
    }

    expect(handleClick).toHaveBeenCalledWith(project);
  });

  it('applies selected styles when selected', () => {
    const project = createTestProject();
    const { container } = render(<ProjectCard project={project} selected />);

    const card = container.querySelector('[class*="ring-2"]');
    expect(card).toBeInTheDocument();
  });

  it('renders professional type badge correctly', () => {
    const project = createTestProject({ type: 'professional' });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Professional')).toBeInTheDocument();
  });

  it('renders personal type badge correctly', () => {
    const project = createTestProject({ type: 'personal' });
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Personal')).toBeInTheDocument();
  });
});
