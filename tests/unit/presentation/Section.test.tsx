import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Section,
  SectionTitle,
} from '@/presentation/components/layout/Section';

describe('Section', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(<Section>Section content</Section>);
      expect(screen.getByText('Section content')).toBeInTheDocument();
    });

    it('should render as section element', () => {
      render(<Section data-testid="section">Content</Section>);
      const section = screen.getByTestId('section');
      expect(section.tagName).toBe('SECTION');
    });

    it('should render with id', () => {
      render(<Section id="about">Content</Section>);
      expect(document.getElementById('about')).toBeInTheDocument();
    });
  });

  describe('padding', () => {
    it('should apply default padding', () => {
      render(<Section data-testid="section">Content</Section>);
      const section = screen.getByTestId('section');
      expect(section).toHaveClass('py-16');
    });

    it('should not apply padding when noPadding is true', () => {
      render(
        <Section noPadding data-testid="section">
          Content
        </Section>
      );
      const section = screen.getByTestId('section');
      expect(section).not.toHaveClass('py-16');
    });
  });

  describe('styling', () => {
    it('should apply relative positioning', () => {
      render(<Section data-testid="section">Content</Section>);
      const section = screen.getByTestId('section');
      expect(section).toHaveClass('relative');
    });

    it('should accept custom className', () => {
      render(
        <Section className="custom-section" data-testid="section">
          Content
        </Section>
      );
      const section = screen.getByTestId('section');
      expect(section).toHaveClass('custom-section');
    });
  });
});

describe('SectionTitle', () => {
  describe('rendering', () => {
    it('should render title', () => {
      render(<SectionTitle title="About Me" />);
      expect(screen.getByText('About Me')).toBeInTheDocument();
    });

    it('should render subtitle when provided', () => {
      render(<SectionTitle title="About" subtitle="Learn more about me" />);
      expect(screen.getByText('Learn more about me')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      render(<SectionTitle title="About" />);
      expect(screen.queryByText(/Learn more/)).not.toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply margin bottom', () => {
      const { container } = render(<SectionTitle title="Title" />);
      const wrapper = container.firstElementChild;
      expect(wrapper).toHaveClass('mb-12');
    });

    it('should center text when centered is true', () => {
      const { container } = render(<SectionTitle title="Title" centered />);
      const wrapper = container.firstElementChild;
      expect(wrapper).toHaveClass('text-center');
    });

    it('should accept custom className', () => {
      const { container } = render(
        <SectionTitle title="Title" className="custom-title" />
      );
      const wrapper = container.firstElementChild;
      expect(wrapper).toHaveClass('custom-title');
    });
  });
});
