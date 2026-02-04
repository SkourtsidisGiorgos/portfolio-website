import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Skill } from '@/domain/portfolio/entities/Skill';
import { SkillDetail } from '../SkillDetail';

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
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('SkillDetail', () => {
  const createSkill = (
    overrides?: Partial<Parameters<typeof Skill.create>[0]>
  ) =>
    Skill.create({
      id: 'skill-python',
      name: 'Python',
      category: 'languages',
      proficiency: 'expert',
      yearsOfExperience: 5,
      ...overrides,
    });

  it('renders empty state when skill is null', () => {
    render(<SkillDetail skill={null} />);

    expect(
      screen.getByText('Select a skill to see details')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Click on any skill node on the globe')
    ).toBeInTheDocument();
  });

  it('renders skill name', () => {
    render(<SkillDetail skill={createSkill()} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders category label', () => {
    render(<SkillDetail skill={createSkill()} />);

    expect(screen.getByText('Languages')).toBeInTheDocument();
  });

  it('renders proficiency level', () => {
    render(<SkillDetail skill={createSkill({ proficiency: 'advanced' })} />);

    expect(screen.getByText('Proficiency')).toBeInTheDocument();
    expect(screen.getByText('advanced')).toBeInTheDocument();
  });

  it('renders years of experience', () => {
    render(<SkillDetail skill={createSkill({ yearsOfExperience: 5 })} />);

    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('5 years')).toBeInTheDocument();
  });

  it('renders "year" (singular) for 1 year experience', () => {
    render(<SkillDetail skill={createSkill({ yearsOfExperience: 1 })} />);

    expect(screen.getByText('1 year')).toBeInTheDocument();
  });

  it('renders Expert badge for expert proficiency', () => {
    render(<SkillDetail skill={createSkill({ proficiency: 'expert' })} />);

    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('renders Advanced badge for advanced proficiency', () => {
    render(<SkillDetail skill={createSkill({ proficiency: 'advanced' })} />);

    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('does not render badge for intermediate proficiency', () => {
    render(
      <SkillDetail skill={createSkill({ proficiency: 'intermediate' })} />
    );

    expect(screen.queryByText('Expert')).not.toBeInTheDocument();
    expect(screen.queryByText('Advanced')).not.toBeInTheDocument();
  });

  it('renders close button when onClose is provided', () => {
    render(<SkillDetail skill={createSkill()} onClose={() => {}} />);

    expect(screen.getByLabelText('Close details')).toBeInTheDocument();
  });

  it('does not render close button when onClose is not provided', () => {
    render(<SkillDetail skill={createSkill()} />);

    expect(screen.queryByLabelText('Close details')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<SkillDetail skill={createSkill()} onClose={onClose} />);

    fireEvent.click(screen.getByLabelText('Close details'));
    expect(onClose).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SkillDetail skill={createSkill()} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
