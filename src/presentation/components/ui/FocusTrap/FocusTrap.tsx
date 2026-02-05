'use client';

import { useRef, type ReactNode, type RefObject } from 'react';
import {
  useFocusManagement,
  type UseFocusManagementReturn,
} from '@/presentation/hooks/useFocusManagement';

/**
 * Props for FocusTrap component
 */
export interface FocusTrapProps {
  /** Content to trap focus within (optional when using render prop) */
  children?: ReactNode;
  /** Whether focus trapping is active */
  active?: boolean;
  /** Whether to restore focus to previous element on deactivation */
  restoreFocus?: boolean;
  /** Ref to element that should receive initial focus */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Additional CSS classes for the container */
  className?: string;
  /** Render prop for accessing focus management functions */
  render?: (props: {
    containerRef: RefObject<HTMLDivElement | null>;
    focusManagement: UseFocusManagementReturn;
  }) => ReactNode;
}

/**
 * Component that traps focus within its children.
 * Uses useFocusManagement hook for focus trapping logic.
 *
 * @example
 * // Basic modal usage
 * <FocusTrap active={isOpen} restoreFocus>
 *   <div role="dialog" aria-modal="true">
 *     <button onClick={onClose}>Close</button>
 *     <p>Modal content</p>
 *   </div>
 * </FocusTrap>
 *
 * @example
 * // With initial focus element
 * function Modal() {
 *   const closeButtonRef = useRef<HTMLButtonElement>(null);
 *
 *   return (
 *     <FocusTrap active={isOpen} initialFocusRef={closeButtonRef}>
 *       <div role="dialog">
 *         <button ref={closeButtonRef}>Close</button>
 *         <input type="text" />
 *       </div>
 *     </FocusTrap>
 *   );
 * }
 *
 * @example
 * // With render prop for focus utilities
 * <FocusTrap
 *   active={isOpen}
 *   render={({ containerRef, focusManagement }) => (
 *     <div ref={containerRef}>
 *       <button onClick={focusManagement.focusFirst}>Focus First</button>
 *       {children}
 *     </div>
 *   )}
 * />
 */
export function FocusTrap({
  children,
  active = true,
  restoreFocus = true,
  initialFocusRef,
  className,
  render,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const focusManagement = useFocusManagement({
    containerRef,
    enabled: active,
    restoreFocus,
    initialFocusRef,
  });

  // Use render prop if provided
  if (render) {
    return <>{render({ containerRef, focusManagement })}</>;
  }

  // Default rendering
  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
