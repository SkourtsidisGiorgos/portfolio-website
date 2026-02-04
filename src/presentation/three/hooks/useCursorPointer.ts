'use client';

import { useCallback } from 'react';

/**
 * Hook for managing pointer cursor state on 3D object interactions.
 * Eliminates duplicated cursor handling code across 3D components.
 */
export function useCursorPointer() {
  const setPointer = useCallback(() => {
    document.body.style.cursor = 'pointer';
  }, []);

  const setAuto = useCallback(() => {
    document.body.style.cursor = 'auto';
  }, []);

  return { setPointer, setAuto };
}

export default useCursorPointer;
