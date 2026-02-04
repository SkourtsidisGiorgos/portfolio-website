/**
 * WebGL detection utilities
 *
 * Extracted to eliminate duplication across hooks (DRY principle).
 * Used by: useExperienceTimeline, useSkillsGlobe, useProjectShowcase
 */

/**
 * Detects whether WebGL is supported in the current browser environment.
 *
 * @returns true if WebGL is supported, false otherwise.
 *          Returns true during SSR (typeof window === 'undefined').
 */
export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
