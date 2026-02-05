import { useRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { FocusTrap } from '../FocusTrap';

describe('FocusTrap', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children', () => {
    render(
      <FocusTrap active={false}>
        <button>Click me</button>
      </FocusTrap>
    );
    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <FocusTrap active={false} className="custom-class">
        <button>Click me</button>
      </FocusTrap>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('focuses first element when active', () => {
    render(
      <FocusTrap active>
        <button>First</button>
        <button>Second</button>
      </FocusTrap>
    );
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'First' })
    );
  });

  it('does not focus when not active', () => {
    const previousActive = document.activeElement;
    render(
      <FocusTrap active={false}>
        <button>First</button>
        <button>Second</button>
      </FocusTrap>
    );
    expect(document.activeElement).toBe(previousActive);
  });

  it('focuses initial focus element when provided', () => {
    function TestComponent() {
      const secondRef = useRef<HTMLButtonElement>(null);
      return (
        <FocusTrap active initialFocusRef={secondRef}>
          <button>First</button>
          <button ref={secondRef}>Second</button>
        </FocusTrap>
      );
    }

    render(<TestComponent />);
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Second' })
    );
  });

  it('traps focus on Tab at last element', () => {
    render(
      <FocusTrap active>
        <button>First</button>
        <button>Last</button>
      </FocusTrap>
    );

    const lastButton = screen.getByRole('button', { name: 'Last' });
    const firstButton = screen.getByRole('button', { name: 'First' });

    lastButton.focus();
    expect(document.activeElement).toBe(lastButton);

    // Simulate Tab key
    act(() => {
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });
      Object.defineProperty(tabEvent, 'preventDefault', {
        value: vi.fn(),
        writable: true,
      });
      document.dispatchEvent(tabEvent);
    });

    expect(document.activeElement).toBe(firstButton);
  });

  it('traps focus on Shift+Tab at first element', () => {
    render(
      <FocusTrap active>
        <button>First</button>
        <button>Last</button>
      </FocusTrap>
    );

    const firstButton = screen.getByRole('button', { name: 'First' });
    const lastButton = screen.getByRole('button', { name: 'Last' });

    // Already focused on first due to active
    expect(document.activeElement).toBe(firstButton);

    // Simulate Shift+Tab key
    act(() => {
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });
      Object.defineProperty(tabEvent, 'preventDefault', {
        value: vi.fn(),
        writable: true,
      });
      document.dispatchEvent(tabEvent);
    });

    expect(document.activeElement).toBe(lastButton);
  });

  it('supports render prop pattern', () => {
    render(
      <FocusTrap
        active={false}
        render={({ containerRef, focusManagement }) => (
          <div ref={containerRef} data-testid="render-prop-container">
            <button onClick={focusManagement.focusFirst}>Focus First</button>
            <input type="text" />
          </div>
        )}
      />
    );

    expect(screen.getByTestId('render-prop-container')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Focus First' })
    ).toBeInTheDocument();
  });

  it('restores focus on unmount when restoreFocus is true', () => {
    const outsideButton = document.createElement('button');
    outsideButton.textContent = 'Outside';
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const { unmount } = render(
      <FocusTrap active restoreFocus>
        <button>Inside</button>
      </FocusTrap>
    );

    // Focus should be inside
    expect(document.activeElement).not.toBe(outsideButton);

    unmount();

    // Focus should be restored
    expect(document.activeElement).toBe(outsideButton);

    document.body.removeChild(outsideButton);
  });
});
